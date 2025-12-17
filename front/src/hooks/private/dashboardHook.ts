import { axiosInstance } from "@/axios/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export interface DashboardStats {
  users: {
    total: number | null;
    newThisMonth: number | null;
  };
  contacts: {
    total: number;
    newThisMonth: number;
    byCategory: Array<{
      category: string;
      count: number;
    }>;
  };
  messages: {
    total: number;
    unread: number;
    recentActivity: Array<{
      date: Date;
      count: number;
    }>;
  };
  notifications: {
    total: number;
    unread: number;
  };
  shares: {
    total: number;
    thisMonth: number;
    byPlatform: Array<{
      platform: string;
      count: number;
    }>;
  };
}

// Get dashboard statistics
export const useGetDashboardStats = () => {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await axiosInstance.get("/dashboard/stats");
      return res.data;
    },
    refetchInterval: 60000, // Rafraîchir toutes les 60 secondes
  });
};
