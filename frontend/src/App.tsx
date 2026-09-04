import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { LoginPage } from "./app/login/LoginPage";
import { SignupPage } from "./app/signup/SignupPage";
import { GamePage } from "./app/games/GamePage";
import { NewGamePage } from "./app/games/new/NewGamePage";
import { EditGamePage } from "./app/games/edit/EditGamePage";
import { DashboardPage } from "./app/dashboard/DashboardPage";
import { PlayersPage } from "./app/players/PlayersPage";
import { GlobalPlayersPage } from "./app/global-players/GlobalPlayersPage";
import { PlayerStatsPage } from "./app/player-stats/PlayerStatsPage";
import { PokedexPage } from "./app/pokedex/PokedexPage";
import { GuessWhoPage } from "./app/guess-who/GuessWhoPage";
import { SearchPage } from "./app/search/SearchPage";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { PublicRoute } from "./components/auth/PublicRoute";
import { AuthProvider } from "./components/auth/AuthProvider";
import { TopBar } from "./components/TopBar";

function App() {
  return (
    <div className="w-full h-full">
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <BrowserRouter>
          <AuthProvider>
            <Routes>
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
                  <PublicRoute redirectTo="/games">
                    <SignupPage />
                  </PublicRoute>
                }
              />

              <Route
                path="/games"
                element={
                  <ProtectedRoute>
                    <TopBar />
                    <GamePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games/new"
                element={
                  <ProtectedRoute>
                    <TopBar />
                    <NewGamePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games/:gameId/edit"
                element={
                  <ProtectedRoute>
                    <TopBar />
                    <EditGamePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games/:gameId/dashboard"
                element={
                  <ProtectedRoute>
                    <TopBar />
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games/:gameId/players"
                element={
                  <ProtectedRoute>
                    <TopBar />
                    <PlayersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/players"
                element={
                  <ProtectedRoute>
                    <TopBar />
                    <GlobalPlayersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/players/:playerId"
                element={
                  <ProtectedRoute>
                    <TopBar />
                    <PlayerStatsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pokedex"
                element={
                  <ProtectedRoute>
                    <TopBar />
                    <PokedexPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/guess-who"
                element={
                  <ProtectedRoute>
                    <TopBar />
                    <GuessWhoPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/search"
                element={
                  <ProtectedRoute>
                    <TopBar />
                    <SearchPage />
                  </ProtectedRoute>
                }
              />

              <Route path="/" element={<Navigate to="/games" />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
        <Toaster />
      </ThemeProvider>
    </div>
  );
}

export default App;
