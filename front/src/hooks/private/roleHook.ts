//========================CRUD ROLES========================
import { axiosInstance } from "@/axios/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Create - Add new rôle
export const useAddRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosInstance.post("/roles", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Rôle ajouté avec succès");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Erreur lors de l'ajout du rôle";
      toast.error(message);
    },
  });
};

// Read - Get all rôles
export const useGetRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await axiosInstance.get("/roles");
      return res.data;
    },
  });
};

// Read - Get single rôle
export const useGetRole = (id: number) => {
  return useQuery({
    queryKey: ["roles", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/roles/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

// Update - Update existing rôle
export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await axiosInstance.put(`/roles/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Rôle mis à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Erreur lors de la mise à jour";
      toast.error(message);
    },
  });
};

// Delete - Delete rôle
export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axiosInstance.delete(`/roles/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Rôle supprimé avec succès");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || "Erreur lors de la suppression";
      toast.error(message);
    },
  });
};

// Assign permissions to rôle
// Assign permissions to rôle
interface AssignPermissionsData {
  permissionIds: number[]; 
}

export const useAssignPermissionsToRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      data 
    }: { 
      id: number; 
      data: AssignPermissionsData 
    }) => {
      const res = await axiosInstance.post(`/roles/${id}/permissions`, data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      toast.success("Permissions assignées au rôle avec succès");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["roles", variables.id] });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.error ||
        "Erreur lors de l'assignation des permissions";
      toast.error(message);
    },
  });
};