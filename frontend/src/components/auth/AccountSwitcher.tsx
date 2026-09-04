import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Check, Loader2, LogOut, Trash2, UserPlus, Users } from "lucide-react";
import { DisplayAccount } from "@/interfaces/useAuth";

function initials(firstName?: string, lastName?: string, email?: string) {
  const a = firstName?.charAt(0) || email?.charAt(0) || "U";
  const b = lastName?.charAt(0) || "";
  return (a + b).toUpperCase();
}

/** Radix can leave body with pointer-events:none after nested menu+dialog. */
function restorePointerEvents() {
  requestAnimationFrame(() => {
    document.body.style.pointerEvents = "";
    document.body.style.removeProperty("pointer-events");
  });
}

export function AccountSwitcher() {
  const {
    user,
    accounts,
    switchAccount,
    logout,
    removeAccount,
    error,
    clearError,
  } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [switchError, setSwitchError] = useState<string | null>(null);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<DisplayAccount | null>(null);

  const closeMenuThen = (action: () => void) => {
    setMenuOpen(false);
    // Let DropdownMenu finish teardown before opening a dialog
    window.setTimeout(() => {
      restorePointerEvents();
      action();
    }, 50);
  };

  const handleSwitch = async (account: DisplayAccount) => {
    if (account.isCurrent || !account.token || isSwitching) return;
    setMenuOpen(false);
    setIsSwitching(true);
    setSwitchError(null);
    try {
      await switchAccount(account.token);
      navigate("/games", { replace: true });
      window.location.reload();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "No se pudo cambiar de cuenta. Inténtalo de nuevo.";
      // Open error dialog after menu has closed
      window.setTimeout(() => {
        restorePointerEvents();
        setSwitchError(message);
      }, 50);
    } finally {
      setIsSwitching(false);
    }
  };

  const handleAddAccount = () => {
    setMenuOpen(false);
    navigate("/login?addAccount=1");
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      const switchedToAnother = await logout();
      setLogoutConfirmOpen(false);
      restorePointerEvents();
      if (switchedToAnother) {
        navigate("/games", { replace: true });
        window.location.reload();
      } else {
        navigate("/login", { replace: true });
      }
    } catch {
      setLogoutConfirmOpen(false);
      window.setTimeout(() => {
        restorePointerEvents();
        setSwitchError("No se pudo cerrar la sesión. Inténtalo de nuevo.");
      }, 50);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleRemoveAccount = () => {
    if (!removeTarget) return;
    if (removeTarget.isCurrent) {
      setRemoveTarget(null);
      window.setTimeout(() => {
        restorePointerEvents();
        setLogoutConfirmOpen(true);
      }, 50);
      return;
    }
    removeAccount(removeTarget.user.id);
    setRemoveTarget(null);
    restorePointerEvents();
  };

  const clearDialogError = () => {
    setSwitchError(null);
    clearError();
    restorePointerEvents();
  };

  const dialogError = switchError || error;

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-9 w-9 rounded-full"
            disabled={isSwitching}
            aria-label="Menú de cuentas"
          >
            {isSwitching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {initials(user?.firstName, user?.lastName, user?.email)}
                </AvatarFallback>
              </Avatar>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="end">
          <DropdownMenuLabel className="flex items-center gap-2 font-normal">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Cuentas</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <div className="max-h-64 overflow-y-auto py-1">
            {accounts.map((acc) => (
              <div key={acc.user.id} className="flex items-center gap-1 px-1">
                <button
                  type="button"
                  disabled={acc.isCurrent || isSwitching || !acc.token}
                  onClick={() => void handleSwitch(acc)}
                  className="flex min-w-0 flex-1 items-start gap-2 rounded-sm px-2 py-2 text-left text-sm outline-none hover:bg-accent disabled:pointer-events-none disabled:opacity-60"
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="text-xs">
                      {initials(
                        acc.user.firstName,
                        acc.user.lastName,
                        acc.user.email
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-medium">
                      {acc.user.firstName} {acc.user.lastName}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {acc.user.email}
                    </span>
                    {!acc.token && !acc.isCurrent && (
                      <span className="text-xs text-destructive">
                        Sesión no disponible
                      </span>
                    )}
                  </div>
                  {acc.isCurrent && (
                    <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                  )}
                </button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                  title="Quitar de este dispositivo"
                  onClick={() =>
                    closeMenuThen(() => setRemoveTarget(acc))
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem onSelect={handleAddAccount}>
            <UserPlus className="mr-2 h-4 w-4" />
            Agregar cuenta
          </DropdownMenuItem>

          <DropdownMenuSeparator />

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

          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onSelect={(e) => {
              e.preventDefault();
              closeMenuThen(() => setLogoutConfirmOpen(true));
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={!!dialogError}
        onOpenChange={(open) => {
          if (!open) clearDialogError();
        }}
      >
        <AlertDialogContent
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            restorePointerEvents();
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>No se pudo completar la acción</AlertDialogTitle>
            <AlertDialogDescription>{dialogError}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {dialogError?.toLowerCase().includes("expir") && (
              <AlertDialogAction
                onClick={() => {
                  clearDialogError();
                  navigate("/login?addAccount=1");
                }}
              >
                Volver a iniciar sesión
              </AlertDialogAction>
            )}
            <AlertDialogAction onClick={clearDialogError}>
              Entendido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={logoutConfirmOpen}
        onOpenChange={(open) => {
          setLogoutConfirmOpen(open);
          if (!open) restorePointerEvents();
        }}
      >
        <AlertDialogContent
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            restorePointerEvents();
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
            <AlertDialogDescription>
              {accounts.length > 1
                ? "Se cerrará esta cuenta. Si tienes otras cuentas guardadas, cambiarás automáticamente a la siguiente."
                : "Se cerrará tu sesión actual y tendrás que volver a iniciar sesión."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoggingOut}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void handleConfirmLogout();
              }}
              disabled={isLoggingOut}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cerrando…
                </>
              ) : (
                "Cerrar sesión"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!removeTarget}
        onOpenChange={(open) => {
          if (!open) {
            setRemoveTarget(null);
            restorePointerEvents();
          }
        }}
      >
        <AlertDialogContent
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            restorePointerEvents();
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>¿Quitar esta cuenta?</AlertDialogTitle>
            <AlertDialogDescription>
              {removeTarget?.isCurrent
                ? "Es tu cuenta activa. Al quitarla se cerrará la sesión."
                : `Se eliminará ${removeTarget?.user.email} de la lista de cuentas en este dispositivo. No se borrará la cuenta del sistema.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Quitar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
