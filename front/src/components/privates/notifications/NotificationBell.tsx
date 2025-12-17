import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotificationStore } from "@/store/notificationStore";
import { useMarkNotificationAsRead, useGetNotifications } from "@/hooks/private/notificationHook";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "@tanstack/react-router";

export const NotificationBell = () => {
  const { notifications, unreadCount } = useNotificationStore();
  const { refetch } = useGetNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const navigate = useNavigate();

  const handleNotificationClick = (id: number) => {
    markAsRead.mutate(id);
  };

  const handleViewAll = () => {
    navigate({ to: "/dashboard/notifications" });
  };

  const recentNotifications = notifications.slice(0, 5);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary">{unreadCount} nouvelles</Badge>
            )}
          </div>
          <Separator />
          <ScrollArea className="h-80">
            {recentNotifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucune notification
              </div>
            ) : (
              <div className="space-y-2">
                {recentNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      !notif.lu ? "bg-accent" : "hover:bg-accent/50"
                    }`}
                    onClick={() => handleNotificationClick(notif.id)}
                  >
                    <p className="text-sm">{notif.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notif.date), {
                        addSuffix: true,
                        locale: fr
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          <Separator />
          <Button
            variant="ghost"
            className="w-full"
            onClick={handleViewAll}
          >
            Voir tout
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
