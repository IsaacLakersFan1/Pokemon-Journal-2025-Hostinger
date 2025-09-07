import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { LoginPage } from "./app/login/LoginPage";
import { SignupPage } from "./app/signup/SignupPage";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { PublicRoute } from "./components/auth/PublicRoute";

function App() {
  return (
    <div className="w-full h-full">
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Routes>
            {/* Rutas públicas - solo accesibles sin autenticación */}
            <Route
              path="/login"
              element={
                <PublicRoute allowAuthenticated={true}>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <SignupPage />
                </PublicRoute>
              }
            />

            {/* Rutas protegidas - requieren autenticación */}

            {/* Ruta por defecto */}
            <Route path="/" element={<Navigate to="/home" />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </ThemeProvider>
    </div>
  );
}

export default App;
