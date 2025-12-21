//========================CRUD NOTIFICATIONS========================
import { axiosInstance } from "@/axios/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Read - Get all notifications
export const useGetNotifications = (enabled = true) => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await axiosInstance.get("/notifications");
      return res.data;
    },
    enabled,
    refetchInterval: 30000, // Refetch toutes les 30 secondes en plus du temps réel
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

// Read - Get unread count
export const useGetUnreadCount = () => {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      const res = await axiosInstance.get("/notifications/unread-count");
      return res.data;
    },
    refetchInterval: 30000, // Refetch toutes les 30 secondes
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

// Update - Mark notification as read
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axiosInstance.put(`/notifications/${id}/read`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Erreur lors de la mise à jour";
      toast.error(message);
    },
  });
};

// Update - Mark all notifications as read
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.put("/notifications/mark-all-read");
      return res.data;
    },
    onSuccess: () => {
      toast.success("Toutes les notifications ont été marquées comme lues");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Erreur lors de la mise à jour";
      toast.error(message);
    },
  });
};

// Delete - Delete notification
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axiosInstance.delete(`/notifications/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Notification supprimée avec succès");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Erreur lors de la suppression";
      toast.error(message);
    },
  });
};

// Alias pour compatibilité
export const useMarkAllAsRead = useMarkAllNotificationsAsRead;
