import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Event, Player } from "../interfaces/Dashboard";
import API_URL from "@/utils/apiConfig";
import axios from "axios";
import { toastError } from "@/hooks/useToastError";
import { toastSuccess } from "@/hooks/useToastSuccess";

interface RegisterShowdownModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameId: number;
  players: Player[];
  events: Event[];
  onSuccess: () => Promise<void>;
}

const EVENT_LIMIT = 6;

export function RegisterShowdownModal({
  open,
  onOpenChange,
  gameId,
  players,
  events,
  onSuccess,
}: RegisterShowdownModalProps) {
  const [player1Id, setPlayer1Id] = useState<number | null>(null);
  const [player2Id, setPlayer2Id] = useState<number | null>(null);
  const [player1EventIds, setPlayer1EventIds] = useState<number[]>([]);
  const [player2EventIds, setPlayer2EventIds] = useState<number[]>([]);
  const [winnerId, setWinnerId] = useState<number | null>(null);
  const [mvpEventId, setMvpEventId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToastError } = toastError();
  const { showToastSuccess } = toastSuccess();

  const catchedByPlayer = (playerId: number) =>
    events.filter((e) => e.player.id === playerId && e.status === "Catched");

  const player1Events = useMemo(
    () => (player1Id ? catchedByPlayer(player1Id) : []),
    [player1Id, events]
  );
  const player2Events = useMemo(
    () => (player2Id ? catchedByPlayer(player2Id) : []),
    [player2Id, events]
  );

  const allSelectedEventIds = useMemo(
    () => [...player1EventIds, ...player2EventIds],
    [player1EventIds, player2EventIds]
  );
  const allSelectedEvents = useMemo(
    () => events.filter((e) => allSelectedEventIds.includes(e.id)),
    [events, allSelectedEventIds]
  );

  const togglePlayer1Event = (eventId: number) => {
    setPlayer1EventIds((prev) => {
      if (prev.includes(eventId)) return prev.filter((id) => id !== eventId);
      if (prev.length >= EVENT_LIMIT) return prev;
      return [...prev, eventId];
    });
  };
  const togglePlayer2Event = (eventId: number) => {
    setPlayer2EventIds((prev) => {
      if (prev.includes(eventId)) return prev.filter((id) => id !== eventId);
      if (prev.length >= EVENT_LIMIT) return prev;
      return [...prev, eventId];
    });
  };

  const resetForm = () => {
    setPlayer1Id(null);
    setPlayer2Id(null);
    setPlayer1EventIds([]);
    setPlayer2EventIds([]);
    setWinnerId(null);
    setMvpEventId(null);
  };

  const handleSubmit = async () => {
    if (!player1Id || !player2Id || player1Id === player2Id) {
      showToastError("Elige dos jugadores distintos");
      return;
    }
    if (player1EventIds.length !== EVENT_LIMIT || player2EventIds.length !== EVENT_LIMIT) {
      showToastError("Cada jugador debe tener exactamente 6 Pokémon (Catched)");
      return;
    }
    if (!winnerId || (winnerId !== player1Id && winnerId !== player2Id)) {
      showToastError("Elige quién ganó");
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post(
        `${API_URL}/api/showdowns`,
        {
          gameId,
          player1Id,
          player2Id,
          winnerId,
          player1EventIds,
          player2EventIds,
          mvpEventId: mvpEventId ?? undefined,
        },
        { withCredentials: true }
      );
      showToastSuccess("Showdown registrado");
      resetForm();
      onOpenChange(false);
      await onSuccess();
    } catch (error: unknown) {
      const msg =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Error al registrar showdown";
      showToastError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Showdown</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Jugador 1</Label>
              <Select
                value={player1Id?.toString() ?? ""}
                onValueChange={(v) => {
                  setPlayer1Id(v ? Number(v) : null);
                  setPlayer1EventIds([]);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Elegir jugador" />
                </SelectTrigger>
                <SelectContent>
                  {players.map((p) => (
                    <SelectItem key={p.id} value={p.id.toString()} disabled={p.id === player2Id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Jugador 2</Label>
              <Select
                value={player2Id?.toString() ?? ""}
                onValueChange={(v) => {
                  setPlayer2Id(v ? Number(v) : null);
                  setPlayer2EventIds([]);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Elegir jugador" />
                </SelectTrigger>
                <SelectContent>
                  {players.map((p) => (
                    <SelectItem key={p.id} value={p.id.toString()} disabled={p.id === player1Id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {player1Id && player2Id && (
            <>
              <div className="space-y-2">
                <Label>Equipo de {players.find((p) => p.id === player1Id)?.name} (6 Pokémon Catched)</Label>
                <div className="flex flex-wrap gap-2 border rounded p-2 min-h-10">
                  {player1Events.map((e) => {
                    const selected = player1EventIds.includes(e.id);
                    return (
                      <Button
                        key={e.id}
                        type="button"
                        variant={selected ? "default" : "outline"}
                        size="sm"
                        onClick={() => togglePlayer1Event(e.id)}
                        disabled={!selected && player1EventIds.length >= EVENT_LIMIT}
                      >
                        {e.nickname || e.pokemon?.name || `#${e.id}`}
                      </Button>
                    );
                  })}
                  {player1Events.length === 0 && (
                    <span className="text-muted-foreground text-sm">Sin Pokémon Catched</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{player1EventIds.length} / 6</p>
              </div>
              <div className="space-y-2">
                <Label>Equipo de {players.find((p) => p.id === player2Id)?.name} (6 Pokémon Catched)</Label>
                <div className="flex flex-wrap gap-2 border rounded p-2 min-h-10">
                  {player2Events.map((e) => {
                    const selected = player2EventIds.includes(e.id);
                    return (
                      <Button
                        key={e.id}
                        type="button"
                        variant={selected ? "default" : "outline"}
                        size="sm"
                        onClick={() => togglePlayer2Event(e.id)}
                        disabled={!selected && player2EventIds.length >= EVENT_LIMIT}
                      >
                        {e.nickname || e.pokemon?.name || `#${e.id}`}
                      </Button>
                    );
                  })}
                  {player2Events.length === 0 && (
                    <span className="text-muted-foreground text-sm">Sin Pokémon Catched</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{player2EventIds.length} / 6</p>
              </div>
              <div className="space-y-2">
                <Label>Ganador</Label>
                <Select
                  value={winnerId?.toString() ?? ""}
                  onValueChange={(v) => setWinnerId(v ? Number(v) : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Quién ganó" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={player1Id.toString()}>
                      {players.find((p) => p.id === player1Id)?.name}
                    </SelectItem>
                    <SelectItem value={player2Id.toString()}>
                      {players.find((p) => p.id === player2Id)?.name}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {allSelectedEventIds.length === 12 && (
                <div className="space-y-2">
                  <Label>MVP (opcional)</Label>
                  <Select
                    value={mvpEventId?.toString() ?? ""}
                    onValueChange={(v) => setMvpEventId(v ? Number(v) : null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Elegir MVP de los 12" />
                    </SelectTrigger>
                    <SelectContent>
                      {allSelectedEvents.map((e) => (
                        <SelectItem key={e.id} value={e.id.toString()}>
                          {e.nickname || e.pokemon?.name || `#${e.id}`} ({e.player.name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                !player1Id ||
                !player2Id ||
                player1EventIds.length !== EVENT_LIMIT ||
                player2EventIds.length !== EVENT_LIMIT ||
                !winnerId
              }
            >
              {isSubmitting ? "Guardando..." : "Registrar Showdown"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
