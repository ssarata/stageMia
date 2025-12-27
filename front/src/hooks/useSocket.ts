import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";
import { useSocketStore } from "../store/socketStore";
import { useNotificationStore } from "../store/notificationStore";
import { useAuthStore } from "../store/authStore";
import { SOCKET_URL } from "../axios/api";
import toast from "react-hot-toast";
import type { Notification } from "../interfaces/interfaceTable";
import { useQueryClient } from "@tanstack/react-query";

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();
  const { setSocket, setConnected } = useSocketStore();
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
  // Partager un contact
  shareContact: (socket: Socket | null, data: { contactId: number; recipientId: number; platform: string }) => {
    if (!socket) {
      toast.error("Connexion socket non établie");
      return;
    }
    socket.emit("contact:share", data);
  }
};
