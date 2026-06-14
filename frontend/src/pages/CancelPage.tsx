import { useParams, useSearchParams, Link } from "react-router-dom";
import { useCancelBooking } from "@/api/bookings";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useEffect } from "react";

export default function CancelPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const cancelBooking = useCancelBooking();

  useEffect(() => {
    if (bookingId && token && !cancelBooking.isSuccess && !cancelBooking.isError) {
      cancelBooking.mutate({ bookingId, token });
    }
  }, [bookingId, token]);

  if (cancelBooking.isPending) {
    return <div className="flex justify-center p-8">Отмена бронирования...</div>;
  }

  return (
    <div className="mx-auto max-w-md space-y-6 p-6">
      {cancelBooking.isSuccess ? (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">❌ Отменено</CardTitle>
            <CardDescription>{cancelBooking.data.message}</CardDescription>
          </CardHeader>
        </Card>
      ) : cancelBooking.isError ? (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-destructive">Ошибка</CardTitle>
            <CardDescription>
              {cancelBooking.error instanceof Error
                ? cancelBooking.error.message
                : "Не удалось отменить бронирование"}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <Link
        to="/"
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-transparent bg-primary px-2.5 h-8 text-sm font-medium text-primary-foreground hover:bg-primary/80"
      >
        На главную
      </Link>
    </div>
  );
}
