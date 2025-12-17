import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetNotifications, useMarkNotificationAsRead, useMarkAllAsRead, useDeleteNotification } from "@/hooks/private/notificationHook";
import { useNotificationStore } from "@/store/notificationStore";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Bell, Check, Trash2, CheckCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/_authenticated/dashboard/notifications/")({
  component: NotificationsPage,
});

function NotificationsPage() {
  const { data: notifications, isLoading } = useGetNotifications();
  const { unreadCount } = useNotificationStore();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const deleteNotification = useDeleteNotification();

  const getTypeColor = (type: string) => {
    switch (type) {
      case "error": return "destructive";
      case "warning": return "destructive";
      case "success": return "default";
      default: return "secondary";
    }
  };

  const getTypeIcon = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive">{unreadCount} nouvelles</Badge>
              )}
            </CardTitle>
            {notifications && notifications.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => markAllAsRead.mutate()}
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                Tout marquer comme lu
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!notifications || notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucune notification</p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="space-y-2">
                {notifications.map((notif: any, index: number) => (
                  <div key={notif.id}>
                    <div
                      className={`p-4 rounded-lg transition-colors ${
                        !notif.lu ? "bg-accent" : "hover:bg-accent/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={getTypeColor(notif.type)}>
                              {getTypeIcon(notif.type)}
                            </Badge>
                            {!notif.lu && (
                              <Badge variant="default" className="text-xs">
                                Nouveau
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm mb-2">{notif.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notif.date), {
                              addSuffix: true,
                              locale: fr
                            })}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {!notif.lu && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => markAsRead.mutate(notif.id)}
                              title="Marquer comme lu"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteNotification.mutate(notif.id)}
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    {index < notifications.length - 1 && <Separator className="my-2" />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
