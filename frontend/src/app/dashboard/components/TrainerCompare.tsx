import { useMemo } from "react";
import { Event, Player, ShowdownMatchup } from "../interfaces/Dashboard";
import { buildCompareRows } from "../utils/runHelpers";

interface TrainerCompareProps {
  players: Player[];
  events: Event[];
  matchups: ShowdownMatchup[];
}

export function TrainerCompare({
  players,
  events,
  matchups,
}: TrainerCompareProps) {
  const rows = useMemo(
    () => buildCompareRows(players, events, matchups),
    [players, events, matchups]
  );

  const metrics: { key: keyof (typeof rows)[0]; label: string }[] = [
    { key: "catched", label: "Vivos" },
    { key: "defeated", label: "Caídos" },
    { key: "runAway", label: "Huyeron" },
    { key: "shinies", label: "Shinies" },
    { key: "champs", label: "Champs" },
    { key: "wins", label: "Wins SD" },
    { key: "losses", label: "Loss SD" },
    { key: "points", label: "Pts" },
    { key: "mvpCount", label: "MVP" },
  ];

  const best = (key: (typeof metrics)[0]["key"]) => {
    if (rows.length === 0) return null;
    const max = Math.max(...rows.map((r) => Number(r[key])));
    if (max === 0 && key !== "points") return null;
    return max;
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Comparativa</h2>
        <p className="text-sm text-muted-foreground">
          Lado a lado: encuentros y showdowns de este run
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sin entrenadores en el run.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-left">
                <th className="px-4 py-3 font-medium">Métrica</th>
                {rows.map((r) => (
                  <th key={r.playerId} className="px-3 py-3 text-center font-medium">
                    {r.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((m) => {
                const top = best(m.key);
                return (
                  <tr key={m.key} className="border-b last:border-0">
                    <td className="px-4 py-2.5 text-muted-foreground">{m.label}</td>
                    {rows.map((r) => {
                      const val = Number(r[m.key]);
                      const isBest = top !== null && val === top && val > 0;
                      return (
                        <td
                          key={r.playerId}
                          className={`px-3 py-2.5 text-center tabular-nums ${
                            isBest ? "font-semibold text-foreground" : ""
                          }`}
                        >
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
