import { useOutletContext } from "react-router-dom";
import { useEventTypes, useDeleteEventType } from "@/api/eventTypes";
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

export default function EventTypesPage() {
  const { auth } = useOutletContext<{ auth: { username: string; password: string } }>();
  const { data: eventTypes, isLoading } = useEventTypes();
  const deleteEventType = useDeleteEventType(auth);

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Типы событий</CardTitle>
        <Button>Создать</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Длительность</TableHead>
              <TableHead>Создан</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eventTypes?.map((et) => (
              <TableRow key={et.id}>
                <TableCell className="font-mono text-sm">{et.id}</TableCell>
                <TableCell>{et.name}</TableCell>
                <TableCell><Badge variant="secondary">{et.duration} мин</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(et.createdAt), "d MMM yyyy")}
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteEventType.mutate(et.id)}
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
