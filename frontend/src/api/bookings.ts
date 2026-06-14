import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, apiRequestWithAuth } from "@/api/client";
import type { Booking, BookingCreate, BookingAdminView, CancelResult } from "@/types/api";

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: BookingCreate) =>
      apiRequest<Booking>("/bookings", {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["slots"] }),
  });
}

export function useCancelBooking() {
  return useMutation({
    mutationFn: ({ bookingId, token }: { bookingId: string; token: string }) =>
      apiRequest<CancelResult>(`/bookings/${bookingId}/cancel?token=${encodeURIComponent(token)}`, {
        method: "POST",
      }),
  });
}

export function useAdminBookings(auth: { username: string; password: string }) {
  return useQuery({
    queryKey: ["admin", "bookings"],
    queryFn: () =>
      apiRequestWithAuth<BookingAdminView[]>("/admin/bookings", auth.username, auth.password),
  });
}

export function useAdminCancelBooking(auth: { username: string; password: string }) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) =>
      apiRequestWithAuth<BookingAdminView>(`/admin/bookings/${bookingId}/cancel`, auth.username, auth.password, {
        method: "POST",
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "bookings"] }),
  });
}
