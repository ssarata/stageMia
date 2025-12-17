//========================CRUD PERMISSIONS========================
import { axiosInstance } from "@/axios/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Create - Add new permission
export const useAddPermission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosInstance.post("/permissions", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Permission ajoutée avec succès");
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Erreur lors de l'ajout de la permission";
      toast.error(message);
    },
  });
};

// Read - Get all permissions
export const useGetPermissions = () => {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      const res = await axiosInstance.get("/permissions");
      return res.data;
    },
  });
};

// Read - Get single permission
export const useGetPermission = (id: number) => {
  return useQuery({
    queryKey: ["permissions", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/permissions/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

// Update - Update existing permission
export const useUpdatePermission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await axiosInstance.put(`/permissions/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Permission mise à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Erreur lors de la mise à jour";
      toast.error(message);
    },
  });
};

// Delete - Delete permission
export const useDeletePermission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axiosInstance.delete(`/permissions/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Permission supprimée avec succès");
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Erreur lors de la suppression";
      toast.error(message);
    },
  });
};