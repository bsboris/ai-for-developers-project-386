import { Link } from "react-router-dom";
import { useEventTypes } from "@/api/eventTypes";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  const { data: eventTypes, isLoading, error } = useEventTypes();

  if (isLoading) return <div className="flex justify-center p-8">Загрузка...</div>;
  if (error) return <div className="p-8 text-destructive">Ошибка загрузки</div>;

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">TimeSpot</h1>
        <p className="text-muted-foreground">Выберите тип встречи для бронирования</p>
      </div>

      <div className="space-y-4">
        {eventTypes?.map((eventType) => (
          <Link key={eventType.id} to={`/book/${eventType.id}`}>
            <Card className="transition-colors hover:bg-accent/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{eventType.name}</CardTitle>
                  <Badge variant="secondary">{eventType.duration} мин</Badge>
                </div>
                {eventType.description && (
                  <CardDescription>{eventType.description}</CardDescription>
                )}
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
