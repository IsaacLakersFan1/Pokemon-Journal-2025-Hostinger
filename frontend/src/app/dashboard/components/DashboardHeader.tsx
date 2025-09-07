interface DashboardHeaderProps {
  gameId: string;
}

export function DashboardHeader({ gameId }: DashboardHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
    </div>
  );
}
