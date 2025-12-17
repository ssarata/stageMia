import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Message } from "../interfaces/interfaceTable";

interface Conversation {
  userId: number;
  userName: string;
  userAvatar?: string;
  lastMessage: string;
  lastMessageDate: string;
  unreadCount: number;
}

interface RealtimeMessage {
  id: string;
  senderId: number;
  receiverId: number;
  contenu: string;
  timestamp: number;
  lu: boolean;
  senderName?: string;
}

interface MessageState {
  messages: Message[];
  conversations: Conversation[];
  activeConversation: number | null;
  typingUsers: Set<number>;
  conversationMessages: Record<number, RealtimeMessage[]>; // Messages par conversation

  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (id: number, updates: Partial<Message>) => void;
  setConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (userId: number | null) => void;
  addTypingUser: (userId: number) => void;
  removeTypingUser: (userId: number) => void;
  markMessagesAsRead: (senderId: number) => void;
  clearMessages: () => void;
  addConversationMessage: (userId: number, message: RealtimeMessage) => void;
  updateConversationMessage: (userId: number, messageId: string, updates: Partial<RealtimeMessage>) => void;
  deleteConversationMessage: (userId: number, messageId: string) => void;
  clearConversationMessages: (userId: number) => void;
}

export const useMessageStore = create<MessageState>()(
  persist(
    (set) => ({
      messages: [],
      conversations: [],
      activeConversation: null,
      typingUsers: new Set(),
      conversationMessages: {},

      setMessages: (messages) => set({ messages }),

      addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
      })),

      updateMessage: (id, updates) => set((state) => ({
        messages: state.messages.map((msg) =>
          msg.id === id ? { ...msg, ...updates } : msg
        )
      })),

      setConversations: (conversations) => set({ conversations }),

      setActiveConversation: (userId) => set({ activeConversation: userId }),

      addTypingUser: (userId) => set((state) => ({
        typingUsers: new Set([...state.typingUsers, userId])
      })),

      removeTypingUser: (userId) => set((state) => {
        const newSet = new Set(state.typingUsers);
        newSet.delete(userId);
        return { typingUsers: newSet };
      }),

      markMessagesAsRead: (senderId) => set((state) => ({
        messages: state.messages.map((msg) =>
          msg.senderId === senderId ? { ...msg, lu: true } : msg
        )
      })),

      clearMessages: () => set({ messages: [], activeConversation: null }),

      addConversationMessage: (userId, message) => set((state) => ({
        conversationMessages: {
          ...state.conversationMessages,
          [userId]: [...(state.conversationMessages[userId] || []), message]
        }
      })),

      updateConversationMessage: (userId, messageId, updates) => set((state) => ({
        conversationMessages: {
          ...state.conversationMessages,
          [userId]: (state.conversationMessages[userId] || []).map((msg) =>
            msg.id === messageId ? { ...msg, ...updates } : msg
          )
        }
      })),

      deleteConversationMessage: (userId, messageId) => set((state) => ({
        conversationMessages: {
          ...state.conversationMessages,
          [userId]: (state.conversationMessages[userId] || []).filter((msg) =>
            msg.id !== messageId
          )
        }
      })),

      clearConversationMessages: (userId) => set((state) => ({
        conversationMessages: {
          ...state.conversationMessages,
          [userId]: []
        }
      }))
    }),
    {
      name: "message-storage",
      partialize: (state) => ({
        messages: state.messages,
        conversations: state.conversations,
        conversationMessages: state.conversationMessages,
      }),
    }
  )
);
