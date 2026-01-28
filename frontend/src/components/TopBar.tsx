import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { toastError } from "@/hooks/useToastError";
import { useSyncPokemon } from "@/hooks/useSyncPokemon";
import { Database, RefreshCw } from "lucide-react";
import API_URL from "@/utils/apiConfig";
import { useState } from "react";

export function TopBar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { showToastError } = toastError();
  const { syncPokemon, isLoading } = useSyncPokemon();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      showToastError("Error al cerrar sesión");
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  if (!isAuthenticated) {
    return null;
  }

  const handleDownloadDB = async () => {
    setIsDownloading(true);
    try {
        // Directly open the download URL instead of using fetch
        window.open(`${API_URL}/api/settings/download-db`, "_blank");
        console.log("Downloading DB...", isDownloading);
    } catch (error) {
        console.error("Download error:", error);
    } finally {
        setIsDownloading(false);
    }

  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className=" flex h-14 items-center justify-between px-6">
        <div className="flex items-center space-x-8">
          <h1 
            className="text-xl font-bold cursor-pointer hover:text-blue-600 transition-colors"
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
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          {user?.role === "admin" && (
            <Button
              variant="outline"
              size="sm"
              onClick={syncPokemon}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Sincronizar Pokemon
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={user?.firstName} />
                  <AvatarFallback>
                    {user?.firstName?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDownloadDB}>
                                    <Database className="mr-2 h-4 w-4" />
                                    <span>Download DB</span>
                                    <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                                </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigation("/profile")}>
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigation("/settings")}>
                Configuración
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
