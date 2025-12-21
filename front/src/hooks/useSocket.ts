import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { useSocketStore } from "../store/socketStore";
import { useMessageStore } from "../store/messageStore";
import { useNotificationStore } from "../store/notificationStore";
import { useAuthStore } from "../store/authStore";
import { SOCKET_URL } from "../axios/api";
import toast from "react-hot-toast";
import type { Message, Notification } from "../interfaces/interfaceTable";
import { useQueryClient } from "@tanstack/react-query";

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();
  const { setSocket, setConnected, setOnlineUsers } = useSocketStore();
  const { addMessage, markMessagesAsRead, addTypingUser, removeTypingUser, updateConversationMessage, deleteConversationMessage } = useMessageStore();
  const { addNotification } = useNotificationStore();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      // Déconnecter le socket si l'utilisateur n'est pas authentifié
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    const token = Cookies.get("token");
    if (!token) return;

    // Créer connexion Socket.IO
    const socket = io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    socketRef.current = socket;
    setSocket(socket);

    // ======== ÉVÉNEMENTS DE CONNEXION ========
    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("disconnect", (reason) => {
      setConnected(false);
      if (reason === "io server disconnect") {
        // Le serveur a forcé la déconnexion, se reconnecter manuellement
        socket.connect();
      }
    });

    socket.on("connect_error", () => {
    });

    // ======== MESSAGES ========
    socket.on("message:received", (message: Message) => {
      addMessage(message);

      // Invalider et mettre à jour le cache React Query pour la conversation
      queryClient.invalidateQueries({ queryKey: ["messages", "conversation", message.senderId] });
      queryClient.invalidateQueries({ queryKey: ["messages", "conversations"] });

      toast.success(`Nouveau message de ${message.sender?.prenom || "Utilisateur"}`);
    });

    socket.on("message:sent", (message: Message) => {
      addMessage(message);

      // Invalider et mettre à jour le cache React Query pour la conversation
      queryClient.invalidateQueries({ queryKey: ["messages", "conversation", message.receiverId] });
      queryClient.invalidateQueries({ queryKey: ["messages", "conversations"] });
    });

    socket.on("message:error", (error: { error: string }) => {
      toast.error(error.error || "Erreur lors de l'envoi du message");
    });

    socket.on("messages:marked-read", (data: { senderId: number }) => {
      markMessagesAsRead(data.senderId);
    });

    socket.on("messages:read-by", (data: { userId: number }) => {
      // L'utilisateur peut afficher une indication que ses messages ont été lus
    });

    // ======== MODIFICATION ET SUPPRESSION DE MESSAGES ========
    socket.on("realtime:message:updated", (message: any) => {
      if (message.senderId === user.id || message.receiverId === user.id) {
        // Mettre à jour le store localement
        const otherUserId = message.senderId === user.id ? message.receiverId : message.senderId;
        updateConversationMessage(otherUserId, message.id, {
          contenu: message.contenu,
          timestamp: message.timestamp,
          lu: message.lu
        });

        // Invalider le cache pour recharger la conversation
        queryClient.invalidateQueries({ queryKey: ["messages", "conversation", otherUserId] });
      }
    });

    socket.on("realtime:message:deleted-for-me", (data: { messageId: string; senderId: number; receiverId: number }) => {
      // Supprimer du store local
      const otherUserId = data.senderId === user.id ? data.receiverId : data.senderId;
      deleteConversationMessage(otherUserId, data.messageId);

      // Invalider le cache pour recharger la conversation
      queryClient.invalidateQueries({ queryKey: ["messages", "conversation", otherUserId] });
    });

    socket.on("realtime:message:deleted-for-everyone", (data: { messageId: string; senderId: number; receiverId: number }) => {
      // Supprimer du store local
      const otherUserId = data.senderId === user.id ? data.receiverId : data.senderId;
      deleteConversationMessage(otherUserId, data.messageId);

      // Invalider le cache pour recharger la conversation
      queryClient.invalidateQueries({ queryKey: ["messages", "conversation", otherUserId] });
    });

    // ======== INDICATEUR DE FRAPPE ========
    socket.on("typing:user", (data: { userId: number; isTyping: boolean }) => {
      if (data.isTyping) {
        addTypingUser(data.userId);
      } else {
        removeTypingUser(data.userId);
      }
    });

    // ======== UTILISATEURS EN LIGNE ========
    socket.on("users:online", (userIds: number[]) => {
      setOnlineUsers(userIds);
    });

    // ======== NOTIFICATIONS ========
    socket.on("notification:new", (notification: Notification) => {
      addNotification(notification);

      // Invalider le cache React Query pour mettre à jour l'interface
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });

      // Toast avec type approprié
      const toastType = notification.type === "error" ? "error" :
                       notification.type === "warning" ? "error" :
                       notification.type === "success" ? "success" : "default";

      if (toastType === "error") {
        toast.error(notification.message);
      } else if (toastType === "success") {
        toast.success(notification.message);
      } else {
        toast(notification.message);
      }
    });

    // ======== PARTAGE DE CONTACT ========
    socket.on("contact:shared", (data: { share: any; message: string }) => {
      toast.success(data.message);
    });

    socket.on("contact:share:success", () => {
      // Partage réussi
    });

    socket.on("contact:share:error", (error: { error: string }) => {
      toast.error(error.error || "Erreur lors du partage");
    });

    // Nettoyage
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("message:received");
      socket.off("message:sent");
      socket.off("message:error");
      socket.off("messages:marked-read");
      socket.off("messages:read-by");
      socket.off("typing:user");
      socket.off("users:online");
      socket.off("notification:new");
      socket.off("contact:shared");
      socket.off("contact:share:success");
      socket.off("contact:share:error");
      socket.disconnect();
      socketRef.current = null;
      setSocket(null);
      setConnected(false);
    };
  }, [isAuthenticated, user]);

  return socketRef.current;
};

// ======== FONCTIONS UTILITAIRES POUR ÉMETTRE DES ÉVÉNEMENTS ========

export const socketEmit = {
  // Envoyer un message
  sendMessage: (socket: Socket | null, data: { receiverId: number; contenu: string; typeMessage?: string }) => {
    if (!socket) {
      toast.error("Connexion socket non établie");
      return;
    }
    socket.emit("message:send", data);
  },

  // Démarrer l'indicateur de frappe
  startTyping: (socket: Socket | null, receiverId: number) => {
    if (!socket) return;
    socket.emit("typing:start", { receiverId });
  },

  // Arrêter l'indicateur de frappe
  stopTyping: (socket: Socket | null, receiverId: number) => {
    if (!socket) return;
    socket.emit("typing:stop", { receiverId });
  },

  // Marquer les messages comme lus
  markMessagesAsRead: (socket: Socket | null, senderId: number) => {
    if (!socket) return;
    socket.emit("messages:mark-read", { senderId });
  },

  // Partager un contact
  shareContact: (socket: Socket | null, data: { contactId: number; recipientId: number; platform: string }) => {
    if (!socket) {
      toast.error("Connexion socket non établie");
      return;
    }
    socket.emit("contact:share", data);
  }
};
