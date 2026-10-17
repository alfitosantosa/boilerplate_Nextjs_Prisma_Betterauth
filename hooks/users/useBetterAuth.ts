"use client";
import { type betterauthUser } from "@/types/betterAuthTypes";
import { apiGet, apiPost } from "@/lib/http/apiClient";
import { useQuery } from "@tanstack/react-query";

export const useGetBetterAuth = () => {
  return useQuery({
    queryKey: ["betterauth"],
    queryFn: async () => {
      try {
        const res = await apiGet<betterauthUser[]>("/api/betterAuth/users");
        return res.data;
      } catch (error) {
        console.error(error);
      }
    },
  });
};

export const useGetBetterAuthById = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["betterauth-by-id", userId],
    queryFn: async () => {
      try {
        const res = await apiPost<betterauthUser>("/api/betterAuth/users", {
          userId,
        });
        return res.data;
      } catch (error) {
        console.error(error);
      }
    },
    enabled: !!userId, // Only fetch when userId is available
  });
};
