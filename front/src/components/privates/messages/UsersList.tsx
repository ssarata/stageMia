import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetUsers } from "@/hooks/private/userHook";
import { useMessageStore } from "@/store/messageStore";
import { useSocketStore } from "@/store/socketStore";
import { useAuthStore } from "@/store/authStore";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Search,
  MessageCircle,
  Users,
  MoreVertical,
  Circle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  lastSeen?: string;
  isOnline?: boolean;
}

export const UsersList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: users } = useGetUsers();
  const { activeConversation, setActiveConversation } = useMessageStore();
  const { isUserOnline } = useSocketStore();
  const { user: currentUser } = useAuthStore();

  // Filtrer les utilisateurs (exclure l'utilisateur actuel)
  const filteredUsers = users?.filter((u: User) => {
    if (u.id === currentUser?.id) return false;
    const query = searchQuery.toLowerCase();
    return (
      u.nom.toLowerCase().includes(query) ||
      u.prenom.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query)
    );
  });

  const handleUserClick = (userId: number) => {
    setActiveConversation(userId);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header WhatsApp style */}
      <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-primary-foreground/20">
            <AvatarFallback className="bg-primary-foreground text-primary">
              {currentUser?.prenom?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">Messages</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
            <MessageCircle className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Nouveau groupe</DropdownMenuItem>
              <DropdownMenuItem>Messages archivés</DropdownMenuItem>
              <DropdownMenuItem>Messages favoris</DropdownMenuItem>
              <DropdownMenuItem>Paramètres</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-3 bg-background border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher ou démarrer une discussion"
            className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      {/* Liste des utilisateurs */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-muted/30 px-4 py-2 border-b">
          <h3 className="text-sm font-medium text-muted-foreground">Tous les utilisateurs</h3>
        </div>

        <ScrollArea className="flex-1">
          {!filteredUsers || filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center px-4">
              <Users className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
              <h3 className="font-medium mb-2">
                {searchQuery ? "Aucun utilisateur trouvé" : "Aucun utilisateur"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? "Essayez une autre recherche"
                  : "Aucun utilisateur disponible pour le moment"}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredUsers.map((u: User) => {
                const isOnline = isUserOnline(u.id);
                const isActive = activeConversation === u.id;

                return (
                  <div
                    key={u.id}
                    onClick={() => handleUserClick(u.id)}
                    className={`flex items-center gap-3 p-3 cursor-pointer transition-colors hover:bg-muted/50 ${
                      isActive ? "bg-muted" : ""
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10">
                          {u.prenom.charAt(0).toUpperCase()}
                          {u.nom.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {isOnline && (
                        <Circle className="absolute bottom-0 right-0 h-3 w-3 fill-green-500 text-green-500 border-2 border-background rounded-full" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">
                        {u.prenom} {u.nom}
                      </h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {isOnline ? (
                          <span className="text-green-600 font-medium">En ligne</span>
                        ) : u.lastSeen ? (
                          <span className="text-muted-foreground">
                            Vu {formatDistanceToNow(new Date(u.lastSeen), {
                              addSuffix: true,
                              locale: fr
                            })}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Hors ligne</span>
                        )}
                      </p>
                    </div>

                    <MessageCircle className="h-5 w-5 text-muted-foreground" />
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};
