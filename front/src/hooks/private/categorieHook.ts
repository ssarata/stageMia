//========================CRUD CATEGORIES========================
import { axiosInstance } from "@/axios/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Create - Add new categorie
export const useAddCategorie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosInstance.post("/categories", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Catégorie créée avec succès");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Erreur lors de la création de la catégorie";
      toast.error(message);
    },
  });
};

// Read - Get all categories
export const useGetCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosInstance.get("/categories");
      return res.data;
    },
  });
};

// Read - Get single categorie
export const useGetCategorie = (id: number) => {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/categories/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

// Update - Update existing categorie
export const useUpdateCategorie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await axiosInstance.put(`/categories/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Catégorie mise à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Erreur lors de la mise à jour";
      toast.error(message);
    },
  });
};

// Delete - Delete categorie
export const useDeleteCategorie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axiosInstance.delete(`/categories/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Catégorie supprimée avec succès");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Erreur lors de la suppression";
      toast.error(message);
    },
  });
};
