import { useOutletContext } from "react-router-dom";
import { useAdminBookings, useAdminCancelBooking } from "@/api/bookings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

const statusColors: Record<string, "default" | "secondary"> = {
  confirmed: "default",
  cancelled: "secondary",
};

export default function BookingsPage() {
  const { auth } = useOutletContext<{ auth: { username: string; password: string } }>();
  const { data: bookings, isLoading } = useAdminBookings(auth);
  const cancelBooking = useAdminCancelBooking(auth);

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Бронирования</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Гость</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Тип</TableHead>
              <TableHead>Время</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings?.map((b) => (
              <TableRow key={b.id}>
                <TableCell>{b.guestName}</TableCell>
                <TableCell className="text-sm">{b.guestEmail}</TableCell>
                <TableCell className="font-mono text-sm">{b.eventTypeId}</TableCell>
                <TableCell className="text-sm">
                  {format(new Date(b.startTime), "d MMM HH:mm")}
                </TableCell>
                <TableCell>
                  <Badge variant={statusColors[b.status]}>{b.status}</Badge>
                </TableCell>
                <TableCell>
                  {b.status === "confirmed" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => cancelBooking.mutate(b.id)}
                    >
                      Отменить
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
