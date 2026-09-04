/**
 * Shared helpers for dashboard filtering / showdown stats / routes.
 */
import { Event, Player, ShowdownMatchup } from "../interfaces/Dashboard";

export type EventStatusFilter = "all" | "Catched" | "Defeated" | "Run Away";

export interface PlayerEventFilters {
  status: EventStatusFilter;
  shinyOnly: boolean;
  champOnly: boolean;
  query: string;
}

export const defaultPlayerFilters = (): PlayerEventFilters => ({
  status: "all",
  shinyOnly: false,
  champOnly: false,
  query: "",
});

export function filterEvents(
  events: Event[],
  filters: PlayerEventFilters
): Event[] {
  const q = filters.query.trim().toLowerCase();
  return events.filter((e) => {
    if (filters.status !== "all" && e.status !== filters.status) return false;
    if (filters.shinyOnly && !e.isShiny) return false;
    if (filters.champOnly && !e.isChamp) return false;
    if (q) {
      const hay = [
        e.nickname,
        e.route,
        e.pokemon?.name,
        e.pokemon?.form,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function parseRouteList(raw?: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.map(String).map((s) => s.trim()).filter(Boolean)
      : [];
  } catch {
    return [];
  }
}

export type RouteCellStatus = "caught" | "failed" | "empty";

/** Best outcome for a player on a route: caught > failed > empty */
export function routeStatusForPlayer(
  events: Event[],
  playerId: number,
  routeName: string
): RouteCellStatus {
  const onRoute = events.filter(
    (e) =>
      e.player.id === playerId &&
      e.route.trim().toLowerCase() === routeName.trim().toLowerCase()
  );
  if (onRoute.some((e) => e.status === "Catched" || e.status === "Defeated")) {
    return "caught";
  }
  if (onRoute.some((e) => e.status === "Run Away")) return "failed";
  return "empty";
}

export interface StandingRow {
  playerId: number;
  name: string;
  wins: number;
  losses: number;
  points: number;
  matches: number;
  mvpCount: number;
}

export function buildStandings(
  players: Player[],
  matchups: ShowdownMatchup[]
): StandingRow[] {
  const map = new Map<number, StandingRow>();
  for (const p of players) {
    map.set(p.id, {
      playerId: p.id,
      name: p.name,
      wins: 0,
      losses: 0,
      points: 0,
      matches: 0,
      mvpCount: 0,
    });
  }

  for (const m of matchups) {
    const p1 = map.get(m.player1Id);
    const p2 = map.get(m.player2Id);
    if (p1) p1.points = m.player1Points;
    if (p2) p2.points = m.player2Points;

    for (const s of m.showdowns) {
      const winner = map.get(s.winnerId);
      const loserId =
        s.winnerId === s.player1Id ? s.player2Id : s.player1Id;
      const loser = map.get(loserId);
      if (winner) {
        winner.wins += 1;
        winner.matches += 1;
      }
      if (loser) {
        loser.losses += 1;
        loser.matches += 1;
      }
      if (s.mvpEvent?.player?.id) {
        const mvpOwner = map.get(s.mvpEvent.player.id);
        if (mvpOwner) mvpOwner.mvpCount += 1;
      }
    }
  }

  return Array.from(map.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.wins !== a.wins) return b.wins - a.wins;
    return a.name.localeCompare(b.name);
  });
}

export interface CompareRow {
  playerId: number;
  name: string;
  catched: number;
  defeated: number;
  runAway: number;
  shinies: number;
  champs: number;
  wins: number;
  losses: number;
  points: number;
  mvpCount: number;
}

export function buildCompareRows(
  players: Player[],
  events: Event[],
  matchups: ShowdownMatchup[]
): CompareRow[] {
  const standings = buildStandings(players, matchups);
  const byId = new Map(standings.map((s) => [s.playerId, s]));

  return players.map((p) => {
    const list = events.filter((e) => e.player.id === p.id);
    const s = byId.get(p.id);
    return {
      playerId: p.id,
      name: p.name,
      catched: list.filter((e) => e.status === "Catched").length,
      defeated: list.filter((e) => e.status === "Defeated").length,
      runAway: list.filter((e) => e.status === "Run Away").length,
      shinies: list.filter((e) => e.isShiny).length,
      champs: list.filter((e) => e.isChamp).length,
      wins: s?.wins ?? 0,
      losses: s?.losses ?? 0,
      points: s?.points ?? 0,
      mvpCount: s?.mvpCount ?? 0,
    };
  });
}

/** Species already claimed (Catched/Defeated) in this run — for dupes clause */
export function claimedSpeciesKeys(events: Event[]): Set<string> {
  const set = new Set<string>();
  for (const e of events) {
    if (e.status !== "Catched" && e.status !== "Defeated") continue;
    const name = e.pokemon?.name?.toLowerCase();
    if (!name) continue;
    const form = e.pokemon?.form?.toLowerCase() || "";
    set.add(`${name}::${form}`);
  }
  return set;
}

export function speciesKey(name: string, form?: string | null): string {
  return `${name.toLowerCase()}::${(form || "").toLowerCase()}`;
}
