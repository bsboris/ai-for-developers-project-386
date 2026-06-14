import { useLocation, Link } from "react-router-dom";
import type { Booking } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";

export default function ConfirmationPage() {
  const location = useLocation();
  const booking = location.state?.booking as Booking | undefined;

  if (!booking) {
    return (
      <div className="mx-auto max-w-md space-y-4 p-6 text-center">
        <h1 className="text-2xl font-bold">Бронирование не найдено</h1>
        <p className="text-muted-foreground">
          Информация о бронировании недоступна. Проверьте email с подтверждением.
        </p>
        <Link
          to="/"
          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-transparent bg-primary px-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          На главную
        </Link>
      </div>
    );
  }

  const cancelUrl = `${window.location.origin}/cancel/${booking.id}?token=${booking.cancellationToken}`;

  return (
    <div className="mx-auto max-w-md space-y-6 p-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">✅ Подтверждено</CardTitle>
          <CardDescription>Встреча забронирована</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p><span className="font-medium">Тип:</span> {booking.eventTypeId}</p>
            <p>
              <span className="font-medium">Время:</span>{" "}
              {format(new Date(booking.startTime), "d MMM yyyy, HH:mm")}
            </p>
            <p><span className="font-medium">Имя:</span> {booking.guestName}</p>
            <p><span className="font-medium">Email:</span> {booking.guestEmail}</p>
            {booking.comment && (
              <p><span className="font-medium">Комментарий:</span> {booking.comment}</p>
            )}
          </div>

          <div className="rounded-lg bg-muted p-4 text-sm">
            <p className="mb-2 font-medium">Ссылка для отмены:</p>
            <p className="break-all text-muted-foreground">{cancelUrl}</p>
          </div>
        </CardContent>
      </Card>

      <Link
        to="/"
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-transparent bg-primary px-2.5 h-8 text-sm font-medium text-primary-foreground hover:bg-primary/80"
      >
        На главную
      </Link>
    </div>
  );
}
