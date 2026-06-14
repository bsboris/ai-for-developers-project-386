import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequestWithAuth } from "@/api/client";
import type { BlockedInterval, BlockedIntervalCreate } from "@/types/api";

export function useBlockedIntervals(auth: { username: string; password: string }) {
  return useQuery({
    queryKey: ["admin", "blocked-intervals"],
    queryFn: () =>
      apiRequestWithAuth<BlockedInterval[]>("/admin/blocked-intervals", auth.username, auth.password),
  });
}

export function useCreateBlockedInterval(auth: { username: string; password: string }) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: BlockedIntervalCreate) =>
      apiRequestWithAuth<BlockedInterval>("/admin/blocked-intervals", auth.username, auth.password, {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "blocked-intervals"] }),
  });
}

export function useDeleteBlockedInterval(auth: { username: string; password: string }) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (intervalId: string) =>
      apiRequestWithAuth<void>(`/admin/blocked-intervals/${intervalId}`, auth.username, auth.password, {
        method: "DELETE",
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "blocked-intervals"] }),
  });
}
