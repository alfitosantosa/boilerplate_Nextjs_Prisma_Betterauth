"use client";

import { CACHE_STRATEGIES } from "@/app/providers";
import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/http/apiClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type BranchRecord = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  address?: string | null;
  phone?: string | null;
  adminName?: string | null;
  signatureUrl?: string | null;
  clientId?: string | null;
  createdAt?: string;
  updatedAt?: string;
  _count?: { users: number };
};

export type BranchInput = {
  id?: string;
  code: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  adminName?: string;
  signatureUrl?: string;
  isActive: boolean;
};

export const useGetBranchs = () => {
  return useQuery({
    queryKey: ["branchs"],
    queryFn: async () => {
      const res = await apiGet<BranchRecord[]>("/api/branches");
      return res.data;
    },
    ...CACHE_STRATEGIES.static,
  });
};

export const useCreateBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: BranchInput) => {
      const res = await apiPost("/api/branches", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branchs"] });
    },
  });
};

export const useUpdateBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: BranchInput) => {
      const res = await apiPut("/api/branches", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branchs"] });
    },
  });
};

export const useDeleteBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiDelete("/api/branches", {
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branchs"] });
    },
  });
};
