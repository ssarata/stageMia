//========================SHARE CONTACTS========================
import { axiosInstance } from "@/axios/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Read - Get shared contacts (received)
export const useGetSharedContacts = () => {
  return useQuery({
    queryKey: ["share", "received"],
    queryFn: async () => {
      const res = await axiosInstance.get("/share/received");
      return res.data;
    },
  });
};

// Create - Share contact
export const useShareContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosInstance.post("/share/contact", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Contact partagé avec succès");
      queryClient.invalidateQueries({ queryKey: ["share"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Erreur lors du partage du contact";
      toast.error(message);
    },
  });
};

// Create - Generate share link
export const useGenerateShareLink = () => {
  return useMutation({
    mutationFn: async (data: { contactId: number; platform: string }) => {
      const res = await axiosInstance.post("/share/generate-link", data);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Lien de partage généré avec succès");
      // Copy to clipboard if available
      if (navigator.clipboard && data.shareUrl) {
        navigator.clipboard.writeText(data.shareUrl);
        toast.success("Lien copié dans le presse-papiers");
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Erreur lors de la génération du lien";
      toast.error(message);
    },
  });
};

// Create - Import shared contact
export const useImportSharedContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (shareId: number) => {
      const res = await axiosInstance.post("/share/import", { shareId });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Contact importé avec succès");
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["share"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Erreur lors de l'importation du contact";
      toast.error(message);
    },
  });
};

// Alias pour compatibilité
export const useGetReceivedShares = useGetSharedContacts;
