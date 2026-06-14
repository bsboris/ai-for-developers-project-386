import { useOutletContext } from "react-router-dom";
import { useBlockedIntervals, useDeleteBlockedInterval } from "@/api/blocked";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

export default function BlockedPage() {
  const { auth } = useOutletContext<{ auth: { username: string; password: string } }>();
  const { data: intervals, isLoading } = useBlockedIntervals(auth);
  const deleteInterval = useDeleteBlockedInterval(auth);

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Заблокированные интервалы</CardTitle>
        <Button>Заблокировать</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Начало</TableHead>
              <TableHead>Конец</TableHead>
              <TableHead>Причина</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {intervals?.map((interval) => (
              <TableRow key={interval.id}>
                <TableCell className="text-sm">
                  {format(new Date(interval.startTime), "d MMM yyyy HH:mm")}
                </TableCell>
                <TableCell className="text-sm">
                  {format(new Date(interval.endTime), "d MMM yyyy HH:mm")}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {interval.reason || "—"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteInterval.mutate(interval.id)}
                  >
                    Удалить
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
