//========================CRUD USERS========================
import { axiosInstance } from "@/axios/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Create - Add new user
export const useAddUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosInstance.post("/users", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Utilisateur ajouté avec succès");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || error.response?.data?.message || "Erreur lors de l'ajout de l'utilisateur";
      toast.error(message);
    },
  });
};

// Read - Get all users
export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users");
      return res.data;
    },
  });
};

// Read - Get single user
export const useGetUserById = (id: number) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/users/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

// Update - Update existing user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await axiosInstance.put(`/users/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Utilisateur mis à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || error.response?.data?.message || "Erreur lors de la mise à jour";
      toast.error(message);
    },
  });
};

// Delete - Delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axiosInstance.delete(`/users/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Utilisateur supprimé avec succès");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || error.response?.data?.message || "Erreur lors de la suppression";
      toast.error(message);
    },
  });
};

// Assign Role - Assign role to user (Admin only)
export const useAssignRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, roleId }: { userId: number; roleId: number }) => {
      const res = await axiosInstance.post("/users/assign-role", { userId, roleId });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Rôle attribué avec succès");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Erreur lors de l'attribution du rôle";
      toast.error(message);
    },
  });
};