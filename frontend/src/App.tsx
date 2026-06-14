import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import HomePage from "@/pages/HomePage";
import BookingPage from "@/pages/BookingPage";
import ConfirmationPage from "@/pages/ConfirmationPage";
import CancelPage from "@/pages/CancelPage";
import AdminLayout from "@/pages/admin/AdminLayout";
import EventTypesPage from "@/pages/admin/EventTypesPage";
import BookingsPage from "@/pages/admin/BookingsPage";
import BlockedPage from "@/pages/admin/BlockedPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/book/:eventTypeId" element={<BookingPage />} />
          <Route path="/booking/:bookingId/confirmation" element={<ConfirmationPage />} />
          <Route path="/cancel/:bookingId" element={<CancelPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="event-types" element={<EventTypesPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="blocked" element={<BlockedPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}
