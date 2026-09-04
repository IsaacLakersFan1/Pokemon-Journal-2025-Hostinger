import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSyncPokemon } from "@/hooks/useSyncPokemon";
import { Database, RefreshCw, Search } from "lucide-react";
import API_URL from "@/utils/apiConfig";
import { useState } from "react";
import { AccountSwitcher } from "@/components/auth/AccountSwitcher";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function TopBar() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { syncPokemon, isLoading } = useSyncPokemon();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  if (!isAuthenticated) {
    return null;
  }

  const handleDownloadDB = () => {
    setIsDownloading(true);
    try {
      window.open(`${API_URL}/api/settings/download-db`, "_blank");
    } catch {
      setDownloadError("No se pudo iniciar la descarga de la base de datos.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-6">
          <div className="flex items-center space-x-8">
            <h1
              className="cursor-pointer text-xl font-bold transition-colors hover:text-blue-600"
              onClick={() => handleNavigation("/games")}
            >
              Pokemon Journal
            </h1>
            <nav className="flex items-center space-x-1">
              <Button
                variant="ghost"
                onClick={() => handleNavigation("/games")}
                className="text-sm font-medium"
              >
                Juegos
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleNavigation("/pokedex")}
                className="text-sm font-medium"
              >
                Pokédex
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleNavigation("/players")}
                className="text-sm font-medium"
              >
                Entrenadores
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleNavigation("/search")}
                className="text-sm font-medium"
              >
                <Search className="mr-1 h-4 w-4" />
                Buscar
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleNavigation("/guess-who")}
                className="text-sm font-medium"
              >
                Guess Who
              </Button>
            </nav>
          </div>

          <div className="flex items-center space-x-2">
            {user?.role === "admin" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={syncPokemon}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                  />
                  Sincronizar Pokemon
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadDB}
                  disabled={isDownloading}
                  className="flex items-center gap-2"
                >
                  <Database className="h-4 w-4" />
                  DB
                </Button>
              </>
            )}
            <AccountSwitcher />
          </div>
        </div>
      </header>

      <AlertDialog
        open={!!downloadError}
        onOpenChange={(open) => {
          if (!open) setDownloadError(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error al descargar</AlertDialogTitle>
            <AlertDialogDescription>{downloadError}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setDownloadError(null)}>
              Entendido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
