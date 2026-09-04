import { useMemo, useState } from "react";
import { Event, Player, ShowdownMatchup, ShowdownRecord } from "../interfaces/Dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Swords, Trophy, Pencil, Trash2, Crown } from "lucide-react";
import { buildStandings } from "../utils/runHelpers";
import { pokemonImageUrl } from "@/utils/pokemonImage";
import API_URL from "@/utils/apiConfig";
import axios from "axios";
import { toastError } from "@/hooks/useToastError";
import { toastSuccess } from "@/hooks/useToastSuccess";

function parseEventIds(json: string): number[] {
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr.map(Number).filter((n) => !isNaN(n)) : [];
  } catch {
    return [];
  }
}

interface ShowdownsPanelProps {
  players: Player[];
  events: Event[];
  matchups: ShowdownMatchup[];
  onRefresh: () => Promise<void>;
  onRegister: () => void;
}

export function ShowdownsPanel({
  players,
  events,
  matchups,
  onRefresh,
  onRegister,
}: ShowdownsPanelProps) {
  const standings = useMemo(
    () => buildStandings(players, matchups),
    [players, matchups]
  );

  const [pairFilter, setPairFilter] = useState<string>("all");
  const [winnerFilter, setWinnerFilter] = useState<string>("all");

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editing, setEditing] = useState<ShowdownRecord | null>(null);
  const [editWinnerId, setEditWinnerId] = useState<number | null>(null);
  const [editMvpEventId, setEditMvpEventId] = useState<number | null | "">(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const { showToastError } = toastError();
  const { showToastSuccess } = toastSuccess();

  const eventById = useMemo(() => {
    const map = new Map<number, Event>();
    for (const e of events) map.set(e.id, e);
    return map;
  }, [events]);

  const filteredMatchups = useMemo(() => {
    return matchups
      .map((m) => {
        if (pairFilter !== "all") {
          const key = `${Math.min(m.player1Id, m.player2Id)}-${Math.max(m.player1Id, m.player2Id)}`;
          if (key !== pairFilter) return null;
        }
        const showdowns = m.showdowns.filter((s) => {
          if (winnerFilter === "all") return true;
          return s.winnerId === Number(winnerFilter);
        });
        if (pairFilter === "all" && winnerFilter !== "all" && showdowns.length === 0) {
          return null;
        }
        return { ...m, showdowns };
      })
      .filter(Boolean) as ShowdownMatchup[];
  }, [matchups, pairFilter, winnerFilter]);

  const pairOptions = matchups.map((m) => ({
    value: `${Math.min(m.player1Id, m.player2Id)}-${Math.max(m.player1Id, m.player2Id)}`,
    label: `${m.player1Name} vs ${m.player2Name}`,
  }));

  const openEdit = (s: ShowdownRecord) => {
    setEditing(s);
    setEditWinnerId(s.winnerId);
    setEditMvpEventId(s.mvpEventId ?? "");
  };

  const handleSaveEdit = async () => {
    if (!editing || editWinnerId === null) return;
    setSavingEdit(true);
    try {
      await axios.put(
        `${API_URL}/api/showdowns/${editing.id}`,
        {
          winnerId: editWinnerId,
          mvpEventId: editMvpEventId === "" ? null : editMvpEventId,
        },
        { withCredentials: true }
      );
      showToastSuccess("Showdown actualizado");
      setEditing(null);
      await onRefresh();
    } catch (error: unknown) {
      const msg =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : "Error al guardar";
      showToastError(msg);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await axios.delete(`${API_URL}/api/showdowns/${id}`, {
        withCredentials: true,
      });
      showToastSuccess("Registro eliminado");
      setConfirmDeleteId(null);
      await onRefresh();
    } catch (error: unknown) {
      const msg =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : "Error al eliminar";
      showToastError(msg);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Showdowns</h2>
          <p className="text-sm text-muted-foreground">
            Tabla, marcadores y historial del run
          </p>
        </div>
        <Button onClick={onRegister}>
          <Swords className="mr-2 h-4 w-4" />
          Registrar Showdown
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy className="h-4 w-4" />
            Clasificación
          </CardTitle>
        </CardHeader>
        <CardContent>
          {standings.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin entrenadores</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 pr-3 font-medium">#</th>
                    <th className="pb-2 pr-3 font-medium">Entrenador</th>
                    <th className="pb-2 pr-3 text-center font-medium">Pts</th>
                    <th className="pb-2 pr-3 text-center font-medium">G</th>
                    <th className="pb-2 pr-3 text-center font-medium">P</th>
                    <th className="pb-2 pr-3 text-center font-medium">PJ</th>
                    <th className="pb-2 text-center font-medium">MVP</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((row, i) => (
                    <tr key={row.playerId} className="border-b last:border-0">
                      <td className="py-2.5 pr-3 text-muted-foreground">{i + 1}</td>
                      <td className="py-2.5 pr-3 font-medium">{row.name}</td>
                      <td className="py-2.5 pr-3 text-center tabular-nums font-semibold">
                        {row.points}
                      </td>
                      <td className="py-2.5 pr-3 text-center tabular-nums text-emerald-600">
                        {row.wins}
                      </td>
                      <td className="py-2.5 pr-3 text-center tabular-nums text-red-600">
                        {row.losses}
                      </td>
                      <td className="py-2.5 pr-3 text-center tabular-nums">
                        {row.matches}
                      </td>
                      <td className="py-2.5 text-center tabular-nums">
                        {row.mvpCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            Pts = victorias (+10) y penalización por Pokémon derrotados (−1 c/u).
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Marcadores cara a cara</CardTitle>
        </CardHeader>
        <CardContent>
          {matchups.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aún no hay enfrentamientos registrados.
            </p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {matchups.map((m) => (
                <div
                  key={`${m.player1Id}-${m.player2Id}`}
                  className="flex items-center gap-2 rounded-lg border bg-background px-4 py-2"
                >
                  <span className="font-medium">{m.player1Name}</span>
                  <Badge variant="secondary" className="min-w-10 justify-center">
                    {m.player1Points}
                  </Badge>
                  <span className="text-muted-foreground">–</span>
                  <Badge variant="secondary" className="min-w-10 justify-center">
                    {m.player2Points}
                  </Badge>
                  <span className="font-medium">{m.player2Name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({m.showdowns.length} SD)
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-3">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Pareja</Label>
            <Select value={pairFilter} onValueChange={setPairFilter}>
              <SelectTrigger className="w-[220px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {pairOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Ganador</Label>
            <Select value={winnerFilter} onValueChange={setWinnerFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Cualquiera</SelectItem>
                {players.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredMatchups.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay showdowns con estos filtros.
          </p>
        ) : (
          <div className="space-y-4">
            {filteredMatchups.map((m) => (
              <Card key={`${m.player1Id}-${m.player2Id}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    {m.player1Name}{" "}
                    <span className="font-normal text-muted-foreground">vs</span>{" "}
                    {m.player2Name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {m.showdowns.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Sin combates en este filtro.
                    </p>
                  )}
                  {m.showdowns.map((s) => {
                    const mvp =
                      s.mvpEvent ||
                      (s.mvpEventId ? eventById.get(s.mvpEventId) : null);
                    const team1 = parseEventIds(s.player1EventIds)
                      .map((id) => eventById.get(id))
                      .filter(Boolean) as Event[];
                    const team2 = parseEventIds(s.player2EventIds)
                      .map((id) => eventById.get(id))
                      .filter(Boolean) as Event[];

                    return (
                      <div
                        key={s.id}
                        className="rounded-lg border bg-muted/20 p-3"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              Ganó{" "}
                              <span className="text-emerald-700 dark:text-emerald-400">
                                {s.winner?.name ??
                                  (s.winnerId === m.player1Id
                                    ? m.player1Name
                                    : m.player2Name)}
                              </span>
                            </p>
                            {mvp && (
                              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Crown className="h-3 w-3 text-yellow-600" />
                                MVP:{" "}
                                {mvp.nickname ||
                                  mvp.pokemon?.name ||
                                  `Evento #${s.mvpEventId}`}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              {s.createdAt
                                ? new Date(s.createdAt).toLocaleString("es-ES")
                                : ""}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => openEdit(s)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => setConfirmDeleteId(s.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <TeamStrip
                            label={m.player1Name}
                            events={team1}
                          />
                          <TeamStrip
                            label={m.player2Name}
                            events={team2}
                          />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog
        open={confirmDeleteId !== null}
        onOpenChange={(o) => !o && setConfirmDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar showdown?</AlertDialogTitle>
            <AlertDialogDescription>
              Se quitará del historial y recalculará la clasificación.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                confirmDeleteId !== null && void handleDelete(confirmDeleteId)
              }
              disabled={deletingId !== null}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingId !== null ? "Eliminando…" : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Showdown</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Ganador</Label>
                <Select
                  value={editWinnerId?.toString() ?? ""}
                  onValueChange={(v) => setEditWinnerId(v ? Number(v) : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={editing.player1Id.toString()}>
                      {editing.player1.name}
                    </SelectItem>
                    <SelectItem value={editing.player2Id.toString()}>
                      {editing.player2.name}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>MVP</Label>
                <Select
                  value={
                    editMvpEventId === "" || editMvpEventId === null
                      ? "none"
                      : String(editMvpEventId)
                  }
                  onValueChange={(v) =>
                    setEditMvpEventId(v === "none" ? "" : Number(v))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Ninguno" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Ninguno</SelectItem>
                    {[
                      ...parseEventIds(editing.player1EventIds),
                      ...parseEventIds(editing.player2EventIds),
                    ].map((eventId) => {
                      const ev = eventById.get(eventId);
                      return (
                        <SelectItem key={eventId} value={String(eventId)}>
                          {ev?.nickname ||
                            ev?.pokemon?.name ||
                            `Evento #${eventId}`}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditing(null)}>
                  Cancelar
                </Button>
                <Button onClick={() => void handleSaveEdit()} disabled={savingEdit}>
                  {savingEdit ? "Guardando…" : "Guardar"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TeamStrip({ label, events }: { label: string; events: Event[] }) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {events.length === 0 && (
          <span className="text-xs text-muted-foreground">Sin equipo guardado</span>
        )}
        {events.map((e) => (
          <div
            key={e.id}
            className="flex items-center gap-1 rounded-md border bg-background px-1.5 py-1"
            title={e.nickname || e.pokemon?.name}
          >
            <img
              src={pokemonImageUrl(e.pokemon?.image, { shiny: !!e.isShiny })}
              alt=""
              className="h-6 w-6 object-contain"
            />
            <span className="max-w-[72px] truncate text-[10px]">
              {e.nickname || e.pokemon?.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
