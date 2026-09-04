import { useMemo, useState } from "react";
import { Event, Player } from "../interfaces/Dashboard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import {
  parseRouteList,
  routeStatusForPlayer,
  RouteCellStatus,
} from "../utils/runHelpers";
import API_URL from "@/utils/apiConfig";
import axios from "axios";
import { toastError } from "@/hooks/useToastError";
import { toastSuccess } from "@/hooks/useToastSuccess";

interface RouteChecklistProps {
  gameId: number;
  routeListRaw: string | null;
  players: Player[];
  events: Event[];
  onUpdated: (routeListJson: string) => void;
}

function cellClass(status: RouteCellStatus) {
  if (status === "caught") return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400";
  if (status === "failed") return "bg-muted text-muted-foreground";
  return "bg-transparent text-muted-foreground/40";
}

function cellMark(status: RouteCellStatus) {
  if (status === "caught") return "●";
  if (status === "failed") return "○";
  return "·";
}

export function RouteChecklist({
  gameId,
  routeListRaw,
  players,
  events,
  onUpdated,
}: RouteChecklistProps) {
  const routes = useMemo(() => parseRouteList(routeListRaw), [routeListRaw]);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const { showToastError } = toastError();
  const { showToastSuccess } = toastSuccess();

  const saveRoutes = async (next: string[]) => {
    setSaving(true);
    try {
      const json = JSON.stringify(next);
      await axios.put(
        `${API_URL}/api/games/${gameId}`,
        { routeList: json },
        { withCredentials: true }
      );
      onUpdated(json);
      showToastSuccess("Rutas actualizadas");
    } catch (error: unknown) {
      const msg =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : "No se pudieron guardar las rutas";
      showToastError(msg);
    } finally {
      setSaving(false);
    }
  };

  const addRoute = async () => {
    const name = draft.trim();
    if (!name) return;
    if (routes.some((r) => r.toLowerCase() === name.toLowerCase())) {
      showToastError("Esa ruta ya está en la lista");
      return;
    }
    setDraft("");
    await saveRoutes([...routes, name]);
  };

  const removeRoute = async (name: string) => {
    await saveRoutes(routes.filter((r) => r !== name));
  };

  return (
    <div className="space-y-6">
      <div className="max-w-xl space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">Rutas</h2>
        <p className="text-sm text-muted-foreground">
          Lista simple del run. ● encuentro usado · ○ huyó · vacío pendiente.
          Se actualiza sola según los eventos.
        </p>
      </div>

      <form
        className="flex max-w-md gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void addRoute();
        }}
      >
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Nombre de ruta o zona…"
          disabled={saving}
        />
        <Button type="submit" disabled={saving || !draft.trim()}>
          <Plus className="mr-1 h-4 w-4" />
          Añadir
        </Button>
      </form>

      {routes.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Todavía no hay rutas. Añade las zonas del run en el orden que quieras.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-left">
                <th className="px-4 py-3 font-medium">Ruta</th>
                {players.map((p) => (
                  <th
                    key={p.id}
                    className="px-3 py-3 text-center font-medium"
                  >
                    {p.name}
                  </th>
                ))}
                <th className="w-10 px-2" />
              </tr>
            </thead>
            <tbody>
              {routes.map((route) => (
                <tr key={route} className="border-b last:border-0">
                  <td className="px-4 py-2.5 font-medium">{route}</td>
                  {players.map((p) => {
                    const status = routeStatusForPlayer(events, p.id, route);
                    return (
                      <td key={p.id} className="px-3 py-2.5 text-center">
                        <span
                          className={cn(
                            "inline-flex h-7 w-7 items-center justify-center rounded-full text-sm",
                            cellClass(status)
                          )}
                          title={
                            status === "caught"
                              ? "Encuentro usado"
                              : status === "failed"
                                ? "Huyó / falló"
                                : "Pendiente"
                          }
                        >
                          {cellMark(status)}
                        </span>
                      </td>
                    );
                  })}
                  <td className="px-2 py-2.5 text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      disabled={saving}
                      onClick={() => void removeRoute(route)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
