import { Event } from "../interfaces/Dashboard";
import { EventCard } from "./EventCard";

interface EventsByPlayerProps {
  events: Event[];
}

export function EventsByPlayer({ events }: EventsByPlayerProps) {
  // Group events by player
  const eventsByPlayer = events.reduce((acc: { [key: number]: Event[] }, event) => {
    const playerId = event.player.id;
    if (!acc[playerId]) acc[playerId] = [];
    acc[playerId].push(event);
    return acc;
  }, {});

  const playerCount = Object.keys(eventsByPlayer).length;

  return (
    <div className="mt-8">
      <div
        className={`grid grid-cols-1 ${
          playerCount === 2 ? 'md:grid-cols-2' : ''
        } ${
          playerCount > 2 ? `md:grid-cols-${playerCount}` : ''
        } gap-4`}
      >
        {Object.keys(eventsByPlayer).map((playerId) => (
          <div key={playerId}>
            <h3 className="text-xl font-semibold text-indigo-600 mb-2">
              {eventsByPlayer[Number(playerId)][0]?.player.name}
            </h3>
            <div className="space-y-4">
              {eventsByPlayer[Number(playerId)].map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onDelete={() => {
                    // This will be handled by the parent component
                    window.location.reload();
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
