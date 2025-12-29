import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import type { User } from "../interfaces/interfaceTable";
import { axiosInstance } from "../axios/axiosInstance";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  refreshToken: () => Promise<void>;
  checkTokenExpiry: () => boolean;
}

// 
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiryTime = payload.exp * 1000; 
    return Date.now() >= expiryTime;
  } catch {
    return true; 
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) => {
        Cookies.set("token", token, { expires: 7 });
        set({ user, token, isAuthenticated: true });
      },

      updateUser: (user) => {
        set({ user });
      },

      logout: () => {
        // Supprimer le token
        Cookies.remove("token");

        // Réinitialiser l'état
        set({ user: null, token: null, isAuthenticated: false });

        // Nettoyer localStorage
        localStorage.removeItem("auth-storage");

        // Force reload complet pour éviter les problèmes de cache
        window.location.replace(window.location.origin + "/");
      },

      // 
      checkTokenExpiry: () => {
        const { token } = get();
        if (!token) return true;
        return isTokenExpired(token);
      },

      //Rafraîchir le token automatiquement
      refreshToken: async () => {
        try {
          const response = await axiosInstance.post("/refresh-token");
          const { token, user } = response.data;

          Cookies.set("token", token, { expires: 7 });
          set({ user, token, isAuthenticated: true });
        } catch {
          get().logout();
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
); 