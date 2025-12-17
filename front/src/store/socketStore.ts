import { create } from "zustand";
import type { Socket } from "socket.io-client";

interface SocketState {
  socket: Socket | null;
  connected: boolean;
  onlineUsers: number[];

  setSocket: (socket: Socket | null) => void;
  setConnected: (connected: boolean) => void;
  setOnlineUsers: (users: number[]) => void;
  addOnlineUser: (userId: number) => void;
  removeOnlineUser: (userId: number) => void;
  isUserOnline: (userId: number) => boolean;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  connected: false,
  onlineUsers: [],

  setSocket: (socket) => set({ socket }),

  setConnected: (connected) => set({ connected }),

  setOnlineUsers: (users) => set({ onlineUsers: users }),

  addOnlineUser: (userId) => set((state) => ({
    onlineUsers: state.onlineUsers.includes(userId)
      ? state.onlineUsers
      : [...state.onlineUsers, userId]
  })),

  removeOnlineUser: (userId) => set((state) => ({
    onlineUsers: state.onlineUsers.filter(id => id !== userId)
  })),

  isUserOnline: (userId) => {
    return get().onlineUsers.includes(userId);
  }
}));
