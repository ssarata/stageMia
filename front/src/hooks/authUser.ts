import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "../axios/axiosInstance";
import { useAuthStore } from "../store/authStore";
import type { AuthResponse } from "../interfaces/interfaceTable";
import type { UserFormSchema, LoginFormSchema } from "@/validators/allSchema";

// --- Me
export const useGetMe = () => {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    },
    retry: false,
  });
};

// --- Login ---
export const useLogin = () => {
  const queryClient = useQueryClient();
  const loginStore = useAuthStore((s) => s.login);

  return useMutation<AuthResponse, unknown, LoginFormSchema>({
    mutationFn: async (credentials) => {
      const res = await axiosInstance.post("/auth/login", credentials);
      return res.data;
    },
    onSuccess: (data) => {
      loginStore(data.user, data.token);
      toast.success("Connexion réussie");
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
    onError: () => {
      toast.error("Email ou mot de passe incorrect");
    },
  });
};

// --- Register ---
export const useRegister = () => {
  return useMutation<AuthResponse, unknown, UserFormSchema>({
    mutationFn: async (payload) => {
      const res = await axiosInstance.post("/auth/register", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Inscription réussie ! Vous pouvez maintenant vous connecter.");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || error?.response?.data?.message || "Erreur lors de l'inscription";
      toast.error(errorMessage);
    },
  });
};

// --- Forgot Password ---
export const useForgotPassword = () => {
  return useMutation<{ message: string }, unknown, { email: string }>({
    mutationFn: async (payload) => {
      const res = await axiosInstance.post("/auth/forgot-password", payload);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Email de réinitialisation envoyé avec succès");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Erreur lors de l'envoi de l'email";
      toast.error(errorMessage);
    },
  });
};

// --- Reset Password ---
export const useResetPassword = () => {
  return useMutation<{ message: string }, unknown, { token: string; newPassword: string }>({
    mutationFn: async (payload) => {
      const res = await axiosInstance.post("/auth/reset-password", payload);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Mot de passe réinitialisé avec succès");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la réinitialisation";
      toast.error(errorMessage);
    },
  });
};

// --- Verify Token ---
export const useVerifyToken = (token: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["auth", "verify-token", token],
    queryFn: async () => {
      const res = await axiosInstance.get(`/auth/verify-token/${token}`); // ✅ Corrigé ici
      return res.data;
    },
    enabled: enabled && !!token,
    retry: false,
  });
};

// --- Update Profile ---
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  return useMutation({
    mutationFn: async (data: {
      nom?: string;
      prenom?: string;
      email?: string;
      telephone?: string;
      adresse?: string;
    }) => {
      const res = await axiosInstance.put("/auth/profile", data);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.user) {
        updateUser(data.user);
      }
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      toast.success("Profil mis à jour avec succès");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la mise à jour du profil";
      toast.error(errorMessage);
    },
  });
};

// --- Update Password ---
export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: async (data: {
      currentPassword: string;
      newPassword: string;
    }) => {
      const res = await axiosInstance.put("/auth/password", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Mot de passe modifié avec succès");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Erreur lors de la modification du mot de passe";
      toast.error(errorMessage);
    },
  });
};

// --- Logout ---
export const useLogout = () => {
  const queryClient = useQueryClient();
  const logoutStore = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post("/auth/logout");
      return res.data;
    },
    onSuccess: () => {
      logoutStore();
      toast.success("Déconnecté avec succès");
      queryClient.removeQueries({ queryKey: ["auth"] });
    },
    onError: () => {
      toast.error("Erreur lors de la déconnexion");
    },
  });
};