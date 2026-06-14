import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, apiRequestWithAuth } from "@/api/client";
import type { EventType, EventTypeCreate, EventTypeUpdate } from "@/types/api";

export function useEventTypes() {
  return useQuery({
    queryKey: ["event-types"],
    queryFn: () => apiRequest<EventType[]>("/event-types"),
  });
}

export function useEventType(eventTypeId: string) {
  return useQuery({
    queryKey: ["event-types", eventTypeId],
    queryFn: () => apiRequest<EventType>(`/event-types/${eventTypeId}`),
    enabled: !!eventTypeId,
  });
}

export function useCreateEventType(auth: { username: string; password: string }) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: EventTypeCreate) =>
      apiRequestWithAuth<EventType>("/admin/event-types", auth.username, auth.password, {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["event-types"] }),
  });
}

export function useUpdateEventType(auth: { username: string; password: string }) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ eventTypeId, body }: { eventTypeId: string; body: EventTypeUpdate }) =>
      apiRequestWithAuth<EventType>(`/admin/event-types/${eventTypeId}`, auth.username, auth.password, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["event-types"] }),
  });
}

export function useDeleteEventType(auth: { username: string; password: string }) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (eventTypeId: string) =>
      apiRequestWithAuth<void>(`/admin/event-types/${eventTypeId}`, auth.username, auth.password, {
        method: "DELETE",
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["event-types"] }),
  });
}
