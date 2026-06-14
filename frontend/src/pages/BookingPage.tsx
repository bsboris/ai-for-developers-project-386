import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useEventType } from "@/api/eventTypes";
import { useSlots } from "@/api/slots";
import { useCreateBooking } from "@/api/bookings";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { format, addDays, startOfDay, isBefore } from "date-fns";

const timezones = Intl.supportedValuesOf?.("timeZone") ?? [
  "Europe/Moscow",
  "Europe/London",
  "America/New_York",
  "Asia/Tokyo",
];

function toDateString(d: Date) {
  return format(d, "yyyy-MM-dd");
}

const bookingSchema = z.object({
  guestName: z.string().min(1, "Имя обязательно"),
  guestEmail: z.string().email("Некорректный email"),
  comment: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function BookingPage() {
  const { eventTypeId } = useParams<{ eventTypeId: string }>();
  const navigate = useNavigate();
  const [timezone, setTimezone] = useState(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return "Europe/Moscow";
    }
  });
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));

  const { data: eventType, isLoading: loadingType } = useEventType(eventTypeId ?? "");
  const dateStr = selectedDate ? toDateString(selectedDate) : "";
  const { data: slots, isLoading: loadingSlots } = useSlots(eventTypeId ?? "", dateStr, timezone);
  const createBooking = useCreateBooking();

  const { register, handleSubmit, formState: { errors } } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  if (loadingType) return <div className="flex justify-center p-8">Загрузка...</div>;
  if (!eventType) return <div className="p-8 text-destructive">Тип события не найден</div>;

  const today = startOfDay(new Date());
  const maxDate = addDays(today, 13);

  const isDayDisabled = (date: Date) => {
    return isBefore(date, today) || isBefore(maxDate, date);
  };

  const onSubmit = async (data: BookingFormData) => {
    if (!selectedSlot || !eventTypeId) return;

    const result = await createBooking.mutateAsync({
      eventTypeId,
      startTime: selectedSlot,
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      comment: data.comment || undefined,
    });

    navigate(`/booking/${result.id}/confirmation`, {
      state: { booking: result },
    });
  };

  const formatSlotTime = (iso: string) => {
    try {
      return format(new Date(iso), "HH:mm");
    } catch {
      return iso;
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <Link to="/" className="text-sm text-muted-foreground hover:underline">
        ← Назад к списку
      </Link>

      <div>
        <h1 className="text-2xl font-bold">{eventType.name}</h1>
        <p className="text-muted-foreground">{eventType.description}</p>
        <Badge variant="secondary" className="mt-2">
          {eventType.duration} мин
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_400px]">
        <Card>
          <CardHeader>
            <CardTitle>Выберите дату и время</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Часовой пояс</Label>
              <Select
                value={timezone}
                onValueChange={(v: string | null) => v && setTimezone(v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(d: Date | undefined) => d && setSelectedDate(d)}
              disabled={isDayDisabled}
              className="rounded-md border"
            />

            {loadingSlots && <div className="text-center text-muted-foreground">Загрузка слотов...</div>}

            {slots && slots.length === 0 && !loadingSlots && (
              <div className="text-center text-muted-foreground">
                Нет свободных слотов на выбранную дату
              </div>
            )}

            {slots && slots.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {slots.map((slot) => (
                  <Button
                    key={slot.startTime}
                    variant={selectedSlot === slot.startTime ? "default" : "outline"}
                    onClick={() => setSelectedSlot(slot.startTime)}
                  >
                    {formatSlotTime(slot.startTime)}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {selectedSlot && (
          <Card>
            <CardHeader>
              <CardTitle>Ваши данные</CardTitle>
              <CardDescription>
                {format(new Date(selectedSlot), "d MMM yyyy, HH:mm")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="guestName">Имя</Label>
                  <Input id="guestName" {...register("guestName")} />
                  {errors.guestName && (
                    <p className="text-sm text-destructive">{errors.guestName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guestEmail">Email</Label>
                  <Input id="guestEmail" type="email" {...register("guestEmail")} />
                  {errors.guestEmail && (
                    <p className="text-sm text-destructive">{errors.guestEmail.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comment">Комментарий (опционально)</Label>
                  <Input id="comment" {...register("comment")} />
                </div>

                <Button type="submit" className="w-full" disabled={createBooking.isPending}>
                  {createBooking.isPending ? "Бронирование..." : "Забронировать"}
                </Button>

                {createBooking.isError && (
                  <p className="text-sm text-destructive">
                    {createBooking.error instanceof Error
                      ? createBooking.error.message
                      : "Ошибка бронирования"}
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
