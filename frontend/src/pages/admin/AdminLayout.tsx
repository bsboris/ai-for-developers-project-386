import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function useAdminAuth() {
  const [auth, setAuth] = useState<{ username: string; password: string } | null>(null);

  return {
    auth,
    setAuth,
    isAuthenticated: auth !== null,
  };
}

export default function AdminLayout() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [auth, setAuth] = useState<{ username: string; password: string } | null>(null);

  if (!auth) {
    return (
      <div className="mx-auto max-w-sm space-y-6 p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Админ-панель</h1>
          <p className="text-muted-foreground">Введите логин и пароль</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setAuth({ username: credentials.username, password: credentials.password });
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="username">Логин</Label>
                <Input
                  id="username"
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials((prev) => ({ ...prev, username: e.target.value }))
                  }
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials((prev) => ({ ...prev, password: e.target.value }))
                  }
                />
              </div>
              <Button type="submit" className="w-full">
                Войти
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Админ-панель</h1>
        <Button variant="outline" onClick={() => setAuth(null)}>
          Выйти
        </Button>
      </div>

      <nav className="flex gap-2">
        <NavLink
          to="/admin/event-types"
          className={({ isActive }) =>
            `rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              isActive ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            }`
          }
        >
          Типы событий
        </NavLink>
        <NavLink
          to="/admin/bookings"
          className={({ isActive }) =>
            `rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              isActive ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            }`
          }
        >
          Бронирования
        </NavLink>
        <NavLink
          to="/admin/blocked"
          className={({ isActive }) =>
            `rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              isActive ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            }`
          }
        >
          Блокировки
        </NavLink>
      </nav>

      <Separator />

      <Outlet context={{ auth }} />
    </div>
  );
}
