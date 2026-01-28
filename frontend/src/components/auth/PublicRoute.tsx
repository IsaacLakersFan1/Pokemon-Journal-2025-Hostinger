import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LoadingScreen } from "@/components/ui/loading-screen";

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  allowAuthenticated?: boolean; // Nueva prop para permitir acceso cuando está autenticado
}

export const PublicRoute = ({ 
  children, 
  redirectTo = "/login",
  allowAuthenticated = false // Por defecto no permite acceso cuando está autenticado
}: PublicRouteProps) => {
  const { isAuthenticated, loading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return <LoadingScreen message="Verificando autenticación..." />;
  }

  // Si está autenticado y no se permite acceso, redirigir a la página principal
  if (isAuthenticated && !allowAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Si no está autenticado o se permite acceso cuando está autenticado, mostrar el contenido
  return <>{children}</>;
};
