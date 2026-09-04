import { useState } from "react";
import { useLoginForm } from "../hooks/useLoginForm";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { handleLogin, isSubmitting, error, clearError } = useLoginForm();
  const { isAuthenticated, accounts } = useAuth();
  const [searchParams] = useSearchParams();
  const isAddingAccount =
    searchParams.get("addAccount") === "1" || isAuthenticated;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {isAddingAccount ? "Agregar cuenta" : "Iniciar sesión"}
          </CardTitle>
          <CardDescription>
            {isAddingAccount
              ? "Inicia sesión con otra cuenta para cambiar entre ellas sin cerrar la actual de forma permanente."
              : "Ingresa tu correo y contraseña para acceder a Pokemon Journal."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isAddingAccount && accounts.length > 0 && (
            <div className="mb-4 rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
              Ya tienes {accounts.length}{" "}
              {accounts.length === 1 ? "cuenta" : "cuentas"} en este dispositivo.
              Al iniciar sesión se añadirá una nueva a la lista.
            </div>
          )}
          <form
            onSubmit={(e) => {
              void handleLogin(e, email, password, { addAccount: isAddingAccount });
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Correo</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="isaac@gmail.com"
                  autoComplete="username"
                  required
                  disabled={isSubmitting}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  disabled={isSubmitting}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isAddingAccount ? "Agregando…" : "Entrando…"}
                  </>
                ) : isAddingAccount ? (
                  "Agregar e iniciar sesión"
                ) : (
                  "Iniciar sesión"
                )}
              </Button>
              {isAddingAccount && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={isSubmitting}
                  onClick={() => navigate("/games")}
                >
                  Cancelar y volver
                </Button>
              )}
            </div>
            {!isAddingAccount && (
              <div className="mt-4 text-center text-sm">
                ¿No tienes cuenta?{" "}
                <button
                  type="button"
                  className="underline underline-offset-4"
                  onClick={() => navigate("/signup")}
                >
                  Regístrate
                </button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      <AlertDialog
        open={!!error}
        onOpenChange={(open) => {
          if (!open) {
            clearError();
            requestAnimationFrame(() => {
              document.body.style.pointerEvents = "";
              document.body.style.removeProperty("pointer-events");
            });
          }
        }}
      >
        <AlertDialogContent
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            requestAnimationFrame(() => {
              document.body.style.pointerEvents = "";
              document.body.style.removeProperty("pointer-events");
            });
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isAddingAccount
                ? "No se pudo agregar la cuenta"
                : "Error al iniciar sesión"}
            </AlertDialogTitle>
            <AlertDialogDescription>{error}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                clearError();
                requestAnimationFrame(() => {
                  document.body.style.pointerEvents = "";
                  document.body.style.removeProperty("pointer-events");
                });
              }}
            >
              Entendido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
