import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Search,
  Circle,
  ArrowLeft,
  Check,
  CheckCheck,
  Pencil,
  Trash2,
  X
} from "lucide-react";
import { useMessageStore } from "@/store/messageStore";
import { useSocketStore } from "@/store/socketStore";
import { useAuthStore } from "@/store/authStore";
import { useGetUsers } from "@/hooks/private/userHook";
import { useGetConversation } from "@/hooks/private/messageHook";
import { format, isToday, isYesterday } from "date-fns";
import { fr } from "date-fns/locale";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RealtimeMessage {
  id: string;
  senderId: number;
  receiverId: number;
  contenu: string;
  timestamp: number;
  lu: boolean;
  senderName?: string;
}

export const RealtimeChatBox = () => {
  const {
    activeConversation,
    typingUsers,
    setActiveConversation,
    conversationMessages,
    addConversationMessage,
    updateConversationMessage,
    deleteConversationMessage
  } = useMessageStore();
  const { socket, isUserOnline } = useSocketStore();
  const { user } = useAuthStore();
  const { data: users } = useGetUsers();
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Charger l'historique depuis la BDD
  const { data: conversationData } = useGetConversation(activeConversation || 0);

  // Trouver l'utilisateur sélectionné
  const recipientUser = users?.find((u: any) => u.id === activeConversation);
  const recipientName = recipientUser ? `${recipientUser.prenom} ${recipientUser.nom}` : "";

  // Convertir les messages de la BDD au format RealtimeMessage
  const dbMessages: RealtimeMessage[] = conversationData?.messages?.map((msg: any) => ({
    id: msg.id.toString(),
    senderId: msg.senderId,
    receiverId: msg.receiverId,
    contenu: msg.contenu,
    timestamp: new Date(msg.dateEnvoi).getTime(),
    lu: msg.lu,
    senderName: msg.sender ? `${msg.sender.prenom} ${msg.sender.nom}` : ""
  })) || [];

  // Fusionner messages BDD + messages temps réel (Zustand)
  const storeMessages = activeConversation ? (conversationMessages[activeConversation] || []) : [];

  // Combiner et dédupliquer par ID
  const messagesMap = new Map<string, RealtimeMessage>();
  [...dbMessages, ...storeMessages].forEach(msg => {
    messagesMap.set(msg.id, msg);
  });

  const messages = Array.from(messagesMap.values()).sort((a, b) => a.timestamp - b.timestamp);

  // Auto-scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Écouter les messages entrants
  useEffect(() => {
    if (!socket || !user) return;

    // Message reçu
    socket.on('realtime:message:received', (data: RealtimeMessage) => {
      if (data.senderId === activeConversation && data.receiverId === user.id) {
        // Message reçu de la conversation active
        addConversationMessage(data.senderId, data);

        // Marquer comme lu automatiquement
        socket.emit('realtime:message:mark-read', { messageId: data.id });
      } else if (data.receiverId === user.id) {
        // Message reçu d'une autre conversation
        addConversationMessage(data.senderId, data);
      }
    });

    // Message envoyé (confirmation)
    socket.on('realtime:message:sent', (data: RealtimeMessage) => {
      // Ajouter le message à la conversation du destinataire
      if (data.receiverId) {
        addConversationMessage(data.receiverId, data);
      }
    });

    // Message marqué comme lu
    socket.on('realtime:message:read', (data: { messageId: string }) => {
      if (activeConversation) {
        updateConversationMessage(activeConversation, data.messageId, { lu: true });
      }
    });

    // Message modifié
    socket.on('realtime:message:updated', (data: RealtimeMessage) => {
      if (activeConversation && (data.senderId === activeConversation || data.receiverId === activeConversation)) {
        const otherUserId = data.senderId === user.id ? data.receiverId : data.senderId;
        updateConversationMessage(otherUserId, data.id, {
          contenu: data.contenu,
          timestamp: data.timestamp,
          lu: data.lu
        });
      }
    });

    // Message supprimé pour moi
    socket.on('realtime:message:deleted-for-me', (data: { messageId: string; senderId: number; receiverId: number }) => {
      // Déterminer l'autre utilisateur dans la conversation
      const otherUserId = data.senderId === user.id ? data.receiverId : data.senderId;
      deleteConversationMessage(otherUserId, data.messageId);
    });

    // Message supprimé pour tout le monde
    socket.on('realtime:message:deleted-for-everyone', (data: { messageId: string; senderId: number; receiverId: number }) => {
      // Déterminer l'autre utilisateur dans la conversation
      const otherUserId = data.senderId === user.id ? data.receiverId : data.senderId;
      deleteConversationMessage(otherUserId, data.messageId);
    });

    return () => {
      socket.off('realtime:message:received');
      socket.off('realtime:message:sent');
      socket.off('realtime:message:read');
      socket.off('realtime:message:updated');
      socket.off('realtime:message:deleted-for-me');
      socket.off('realtime:message:deleted-for-everyone');
    };
  }, [socket, activeConversation, user, addConversationMessage, updateConversationMessage, deleteConversationMessage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    if (!isTyping && activeConversation && socket) {
      setIsTyping(true);
      socket.emit('typing:start', { receiverId: activeConversation });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current as ReturnType<typeof setTimeout>);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (activeConversation && socket) {
        socket.emit('typing:stop', { receiverId: activeConversation });
      }
    }, 1000);
  };

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!message.trim() || !activeConversation || !socket || !user) return;

    const newMessage: RealtimeMessage = {
      id: `msg_${Date.now()}_${Math.random()}`,
      senderId: user.id,
      receiverId: activeConversation,
      contenu: message,
      timestamp: Date.now(),
      lu: false,
      senderName: `${user.prenom} ${user.nom}`
    };

    // Envoyer via Socket.IO (avec sauvegarde DB)
    socket.emit('realtime:message:send', newMessage);

    setMessage("");
    setIsTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current as ReturnType<typeof setTimeout>);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEditMessage = (msg: RealtimeMessage) => {
    setEditingMessageId(msg.id);
    setEditedContent(msg.contenu);
    setSelectedMessageId(null);
  };

  const handleSaveEdit = () => {
    if (!editedContent.trim() || !editingMessageId || !socket) return;

    socket.emit('realtime:message:update', {
      messageId: editingMessageId,
      contenu: editedContent.trim()
    });

    setEditingMessageId(null);
    setEditedContent("");
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditedContent("");
  };

  const handleDeleteForMe = (messageId: string) => {
    if (!socket) return;

    if (window.confirm("Supprimer ce message pour vous uniquement ?")) {
      socket.emit('realtime:message:delete-for-me', { messageId });
      setSelectedMessageId(null);
    }
  };

  const handleDeleteForEveryone = (messageId: string) => {
    if (!socket) return;

    if (window.confirm("Supprimer ce message pour tout le monde ?")) {
      socket.emit('realtime:message:delete-for-everyone', { messageId });
      setSelectedMessageId(null);
    }
  };

  const handleMessageClick = (messageId: string) => {
    setSelectedMessageId(selectedMessageId === messageId ? null : messageId);
  };

  const formatMessageDate = (timestamp: number) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, "HH:mm");
    } else if (isYesterday(date)) {
      return `Hier ${format(date, "HH:mm")}`;
    } else {
      return format(date, "dd/MM/yyyy HH:mm");
    }
  };

  const groupMessagesByDate = (messages: RealtimeMessage[]) => {
    const groups: { [key: string]: RealtimeMessage[] } = {};

    messages.forEach((msg) => {
      const date = new Date(msg.timestamp);
      let dateKey: string;

      if (isToday(date)) {
        dateKey = "Aujourd'hui";
      } else if (isYesterday(date)) {
        dateKey = "Hier";
      } else {
        dateKey = format(date, "dd MMMM yyyy", { locale: fr });
      }

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(msg);
    });

    return groups;
  };

  if (!activeConversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-muted/10">
        <div className="text-center space-y-4">
          <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
            <Send className="h-12 w-12 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Aucune conversation sélectionnée</h3>
            <p className="text-muted-foreground">
              Sélectionnez un utilisateur pour commencer à discuter
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isRecipientOnline = isUserOnline(activeConversation);
  const isRecipientTyping = typingUsers.has(activeConversation);
  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b bg-primary text-primary-foreground">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => setActiveConversation(null)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary-foreground text-primary">
                  {recipientName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isRecipientOnline && (
                <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-primary"></span>
              )}
            </div>
            <div>
              <h3 className="font-semibold">
                {recipientName || "Chargement..."}
              </h3>
              {isRecipientTyping ? (
                <p className="text-sm text-primary-foreground/80 flex items-center gap-1">
                  <Circle className="h-2 w-2 fill-current animate-pulse" />
                  En train d'écrire...
                </p>
              ) : (
                <p className="text-sm text-primary-foreground/80">
                  {isRecipientOnline ? "En ligne" : "Hors ligne"}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
              <Video className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Effacer la conversation</DropdownMenuItem>
                <DropdownMenuItem>Bloquer l'utilisateur</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4 min-h-full">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="mb-4 text-6xl">💬</div>
              <p className="text-muted-foreground">
                Commencez la discussion en envoyant un message
              </p>
              <p className="text-xs text-muted-foreground mt-2">
              </p>
            </div>
          )}

          {Object.entries(messageGroups).map(([date, msgs]) => (
            <div key={date}>
              {/* Date Separator */}
              <div className="flex items-center justify-center my-4">
                <div className="bg-muted px-3 py-1 rounded-full">
                  <span className="text-xs font-medium text-muted-foreground">
                    {date}
                  </span>
                </div>
              </div>

              {/* Messages */}
              {msgs.map((msg: RealtimeMessage, index: number) => {
                const isOwn = msg.senderId === user?.id;
                const showAvatar = index === 0 || msgs[index - 1].senderId !== msg.senderId;
                const isEditing = editingMessageId === msg.id;
                const isSelected = selectedMessageId === msg.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 mb-3 ${
                      isOwn ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {/* Avatar */}
                    <div className="w-8">
                      {showAvatar && !isOwn && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-muted text-xs">
                            {msg.senderName?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div className="relative max-w-[70%] group">
                      {isEditing ? (
                        <div className="bg-primary/10 rounded-2xl px-4 py-2">
                          <Input
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSaveEdit();
                              } else if (e.key === "Escape") {
                                handleCancelEdit();
                              }
                            }}
                            className="mb-2"
                            autoFocus
                          />
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleCancelEdit}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={handleSaveEdit}
                            >
                              Enregistrer
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div
                            onClick={() => isOwn && handleMessageClick(msg.id)}
                            className={`rounded-2xl px-4 py-2 cursor-pointer ${
                              isOwn
                                ? "bg-primary text-primary-foreground rounded-br-sm"
                                : "bg-muted rounded-bl-sm"
                            }`}
                          >
                            <p className="break-words whitespace-pre-wrap">{msg.contenu}</p>
                            <div
                              className={`flex items-center gap-1 mt-1 ${
                                isOwn ? "justify-end" : "justify-start"
                              }`}
                            >
                              <span
                                className={`text-xs ${
                                  isOwn
                                    ? "text-primary-foreground/70"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {formatMessageDate(msg.timestamp)}
                              </span>
                              {isOwn && (
                                <span>
                                  {msg.lu ? (
                                    <CheckCheck className="h-3 w-3 text-primary-foreground/70" />
                                  ) : (
                                    <Check className="h-3 w-3 text-primary-foreground/70" />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Boutons Edit/Delete */}
                          {isOwn && isSelected && (
                            <div className={`absolute top-0 ${isOwn ? "left-0 -translate-x-full" : "right-0 translate-x-full"} flex gap-1 px-2`}>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 bg-background border shadow-sm hover:bg-muted"
                                onClick={() => handleEditMessage(msg)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 bg-background border shadow-sm hover:bg-destructive hover:text-destructive-foreground"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteForMe(msg.id)}
                                    className="text-orange-600 focus:text-orange-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Supprimer pour moi
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteForEveryone(msg.id)}
                                    className="text-red-600 focus:text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Supprimer pour tout le monde
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t bg-background p-4">
        <form onSubmit={handleSend} className="flex items-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0"
          >
            <Smile className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0"
          >
            <Paperclip className="h-5 w-5" />
          </Button>

          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Écrivez un message..."
              className="pr-4 resize-none"
            />
          </div>

          <Button
            type="submit"
            size="icon"
            disabled={!message.trim()}
            className="shrink-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Appuyez sur Entrée pour envoyer 💬
        </p>
      </div>
    </div>
  );
};
