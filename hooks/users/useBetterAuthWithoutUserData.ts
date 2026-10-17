"use client";
import { type BetterAuthUser } from "@/components/users/userDialogs";
import { apiGet } from "@/lib/http/apiClient";
import { useQuery } from "@tanstack/react-query";

export const useGetBetterAuthWithoutUserData = (clientId?: string) => {
  return useQuery<BetterAuthUser[]>({
    queryKey: ["betterauth", "users", "withoutUserData", clientId],
    queryFn: async () => {
      try {
        const res = await apiGet<BetterAuthUser[]>(
          "/api/betterAuth/users/withoutUserData",
          {
            params: clientId ? { clientId } : undefined,
          },
        );
        return res.data ?? [];
      } catch (error) {
        console.error(error);
        return [];
      }
    },
  });
};
