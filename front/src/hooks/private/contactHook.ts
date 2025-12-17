//========================CRUD CONTACTS========================
import { axiosInstance } from "@/axios/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Create - Add new contact
export const useAddContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosInstance.post("/contacts", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Contact créé avec succès");
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Erreur lors de la création du contact";
      toast.error(message);
    },
  });
};

// Read - Get all contacts
export const useGetContacts = () => {
  return useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/contacts");
      return res.data;
    },
  });
};

// Read - Get single contact
export const useGetContact = (id: number) => {
  return useQuery({
    queryKey: ["contacts", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/contacts/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

// Read - Search contacts
export const useSearchContacts = (query: string) => {
  return useQuery({
    queryKey: ["contacts", "search", query],
    queryFn: async () => {
      const res = await axiosInstance.get(`/contacts/search`, {
        params: { query }
      });
      return res.data;
    },
    enabled: !!query && query.length > 0,
  });
};

// Update - Update existing contact
export const useUpdateContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await axiosInstance.put(`/contacts/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Contact mis à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Erreur lors de la mise à jour";
      toast.error(message);
    },
  });
};

// Delete - Delete contact
export const useDeleteContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axiosInstance.delete(`/contacts/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Contact supprimé avec succès");
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Erreur lors de la suppression";
      toast.error(message);
    },
  });
};