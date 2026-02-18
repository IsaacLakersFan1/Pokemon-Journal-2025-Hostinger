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
import { ShowdownMatchup, ShowdownRecord } from "../interfaces/Dashboard";
import { Pencil, Trash2 } from "lucide-react";
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
import { useState } from "react";
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

interface ShowdownInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameName: string;
  matchups: ShowdownMatchup[];
  onRefresh: () => Promise<void>;
}

export function ShowdownInfoModal({
  open,
  onOpenChange,
  gameName,
  matchups,
  onRefresh,
}: ShowdownInfoModalProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [editingShowdown, setEditingShowdown] = useState<ShowdownRecord | null>(null);
  const [editWinnerId, setEditWinnerId] = useState<number | null>(null);
  const [editMvpEventId, setEditMvpEventId] = useState<number | null | "">(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const { showToastError } = toastError();
  const { showToastSuccess } = toastSuccess();

  const openEdit = (s: ShowdownRecord) => {
    setEditingShowdown(s);
    setEditWinnerId(s.winnerId);
    setEditMvpEventId(s.mvpEventId ?? "");
  };

  const handleSaveEdit = async () => {
    if (!editingShowdown || editWinnerId === null) return;
    setSavingEdit(true);
    try {
      await axios.put(
        `${API_URL}/api/showdowns/${editingShowdown.id}`,
        {
          winnerId: editWinnerId,
          mvpEventId: editMvpEventId === "" ? null : editMvpEventId,
        },
        { withCredentials: true }
      );
      showToastSuccess("Showdown actualizado");
      setEditingShowdown(null);
      await onRefresh();
    } catch (error: unknown) {
      const msg =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
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
      await onRefresh();
      setConfirmDeleteId(null);
    } catch (error: unknown) {
      const msg =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Error al eliminar";
      showToastError(msg);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Enfrentamientos - {gameName}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-x-auto overflow-y-auto pr-2">
            <div className="flex gap-6 pb-4 min-w-max">
              {matchups.length === 0 ? (
                <p className="text-muted-foreground py-8">
                  Aún no hay enfrentamientos registrados. Usa &quot;Registrar Showdown&quot; para añadir uno.
                </p>
              ) : (
                matchups.map((m) => (
                  <div
                    key={`${m.player1Id}-${m.player2Id}`}
                    className="min-w-[280px] border rounded-lg p-4 bg-card"
                  >
                    <div className="text-center font-semibold text-lg mb-2">
                      {m.player1Name} vs {m.player2Name}
                    </div>
                    <div className="flex justify-between text-sm mb-4">
                      <span className="font-medium">{m.player1Name}: {m.player1Points} pts</span>
                      <span className="font-medium">{m.player2Name}: {m.player2Points} pts</span>
                    </div>
                    <div className="space-y-2">
                      {m.showdowns.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center justify-between gap-2 p-2 rounded border bg-background text-sm"
                        >
                          <span>
                            Ganó: {s.winner.id === m.player1Id ? m.player1Name : m.player2Name}
                          </span>
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
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmDeleteId !== null} onOpenChange={(o) => !o && setConfirmDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar registro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmDeleteId !== null && handleDelete(confirmDeleteId)}
              disabled={deletingId !== null}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingId !== null ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={editingShowdown !== null} onOpenChange={(o) => !o && setEditingShowdown(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Showdown</DialogTitle>
          </DialogHeader>
          {editingShowdown && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Ganador</Label>
                <Select
                  value={editWinnerId?.toString() ?? ""}
                  onValueChange={(v) => setEditWinnerId(v ? Number(v) : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Elegir ganador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={editingShowdown.player1Id.toString()}>
                      {editingShowdown.player1.name}
                    </SelectItem>
                    <SelectItem value={editingShowdown.player2Id.toString()}>
                      {editingShowdown.player2.name}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>MVP (opcional)</Label>
                <Select
                  value={editMvpEventId === "" || editMvpEventId === null ? "none" : String(editMvpEventId)}
                  onValueChange={(v) => setEditMvpEventId(v === "none" ? "" : Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Ninguno" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Ninguno</SelectItem>
                    {[
                      ...parseEventIds(editingShowdown.player1EventIds),
                      ...parseEventIds(editingShowdown.player2EventIds),
                    ].map((eventId) => (
                      <SelectItem key={eventId} value={String(eventId)}>
                        Evento #{eventId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setEditingShowdown(null)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveEdit} disabled={savingEdit}>
                  {savingEdit ? "Guardando..." : "Guardar"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
