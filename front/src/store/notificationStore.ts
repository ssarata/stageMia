import { create } from "zustand";
import type { Notification } from "../interfaces/interfaceTable";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;

  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  updateNotification: (id: number, updates: Partial<Notification>) => void;
  removeNotification: (id: number) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  setUnreadCount: (count: number) => void;
  incrementUnreadCount: () => void;
  decrementUnreadCount: () => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications) => set({
    notifications,
    unreadCount: notifications.filter(n => !n.lu).length
  }),

  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications],
    unreadCount: notification.lu ? state.unreadCount : state.unreadCount + 1
  })),

  updateNotification: (id, updates) => set((state) => ({
    notifications: state.notifications.map((notif) =>
      notif.id === id ? { ...notif, ...updates } : notif
    )
  })),

  removeNotification: (id) => set((state) => {
    const notification = state.notifications.find(n => n.id === id);
    const wasUnread = notification && !notification.lu;

    return {
      notifications: state.notifications.filter((n) => n.id !== id),
      unreadCount: wasUnread ? state.unreadCount - 1 : state.unreadCount
    };
  }),

  markAsRead: (id) => set((state) => {
    const notification = state.notifications.find(n => n.id === id);
    const wasUnread = notification && !notification.lu;

    return {
      notifications: state.notifications.map((notif) =>
        notif.id === id ? { ...notif, lu: true } : notif
      ),
      unreadCount: wasUnread ? state.unreadCount - 1 : state.unreadCount
    };
  }),

  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map((notif) => ({ ...notif, lu: true })),
    unreadCount: 0
  })),

  setUnreadCount: (count) => set({ unreadCount: count }),

  incrementUnreadCount: () => set((state) => ({
    unreadCount: state.unreadCount + 1
  })),

  decrementUnreadCount: () => set((state) => ({
    unreadCount: Math.max(0, state.unreadCount - 1)
  })),

  clearNotifications: () => set({ notifications: [], unreadCount: 0 })
}));
