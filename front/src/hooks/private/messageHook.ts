//========================CRUD MESSAGES========================
import { axiosInstance } from "@/axios/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Read - Get all messages
export const useGetMessages = () => {
  return useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const res = await axiosInstance.get("/messages");
      return res.data;
    },
  });
};

// Read - Get recent conversations
export const useGetRecentConversations = () => {
  return useQuery({
    queryKey: ["messages", "conversations"],
    queryFn: async () => {
      const res = await axiosInstance.get("/messages/conversations");
      return res.data;
    },
    staleTime: 0, // Les données sont toujours considérées comme périmées
    refetchOnMount: true, // Recharger à chaque montage
    refetchOnWindowFocus: true, // Recharger quand la fenêtre regagne le focus
  });
};

// Read - Get conversation with specific user
export const useGetConversation = (userId: number) => {
  return useQuery({
    queryKey: ["messages", "conversation", userId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/messages/conversation/${userId}`);
      return res.data;
    },
    enabled: !!userId,
    staleTime: 0, // Les données sont toujours considérées comme périmées
    refetchOnMount: true, // Recharger à chaque montage
    refetchOnWindowFocus: true, // Recharger quand la fenêtre regagne le focus
    refetchInterval: 2000, // Recharger automatiquement toutes les 2 secondes
    refetchIntervalInBackground: true, // Continuer le polling même en arrière-plan
  });
};

// Create - Send message
export const useSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosInstance.post("/messages", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Message envoyé avec succès");
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Erreur lors de l'envoi du message";
      toast.error(message);
    },
  });
};

// Update - Mark message as read
export const useMarkMessageAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axiosInstance.put(`/messages/${id}/read`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Erreur lors de la mise à jour";
      toast.error(message);
    },
  });
};

// Delete - Delete message for me
export const useDeleteMessageForMe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axiosInstance.delete(`/messages/${id}/delete-for-me`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Message supprimé pour vous");
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Erreur lors de la suppression";
      toast.error(message);
    },
  });
};

// Delete - Delete message for everyone
export const useDeleteMessageForEveryone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axiosInstance.delete(`/messages/${id}/delete-for-everyone`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Message supprimé pour tout le monde");
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Erreur lors de la suppression";
      toast.error(message);
    },
  });
};
