import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/api/client";
import type { Slot } from "@/types/api";

export function useSlots(eventTypeId: string, date: string, timezone: string) {
  return useQuery({
    queryKey: ["slots", eventTypeId, date, timezone],
    queryFn: () =>
      apiRequest<Slot[]>(
        `/slots?eventTypeId=${encodeURIComponent(eventTypeId)}&date=${encodeURIComponent(date)}&timezone=${encodeURIComponent(timezone)}`,
      ),
    enabled: !!eventTypeId && !!date && !!timezone,
  });
}
