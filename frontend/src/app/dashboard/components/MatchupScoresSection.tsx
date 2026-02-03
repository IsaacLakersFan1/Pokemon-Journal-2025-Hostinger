import { ShowdownMatchup } from "../interfaces/Dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Swords } from "lucide-react";

interface MatchupScoresSectionProps {
  matchups: ShowdownMatchup[];
}

export function MatchupScoresSection({ matchups }: MatchupScoresSectionProps) {
  const hasMatchups = matchups.length > 0;

  return (
    <Card className="border-primary/20 bg-muted/30">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Swords className="h-4 w-4" />
          Marcadores por enfrentamiento
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasMatchups && (
          <p className="text-sm text-muted-foreground">
            Aún no hay enfrentamientos. Los marcadores aparecerán cuando registres un Showdown.
          </p>
        )}
        {hasMatchups && (
        <div className="flex flex-wrap gap-3">
          {matchups.map((m) => (
            <div
              key={`${m.player1Id}-${m.player2Id}`}
              className="flex items-center gap-2 rounded-lg border bg-card px-4 py-2 shadow-sm"
            >
              <span className="font-medium text-foreground">{m.player1Name}</span>
              <Badge variant="secondary" className="min-w-[3rem] justify-center">
                {m.player1Points}
              </Badge>
              <span className="text-muted-foreground">vs</span>
              <Badge variant="secondary" className="min-w-[3rem] justify-center">
                {m.player2Points}
              </Badge>
              <span className="font-medium text-foreground">{m.player2Name}</span>
            </div>
          ))}
        </div>
        )}
      </CardContent>
    </Card>
  );
}
