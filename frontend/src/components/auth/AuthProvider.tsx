import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";
import API_URL from "@/utils/apiConfig";
import {
  UseAuthReturn,
  User,
  StoredAccount,
  DisplayAccount,
} from "@/interfaces/useAuth";

const ACCOUNTS_STORAGE_KEY = "pokemon_journal_accounts";

function sanitizeUser(raw: Partial<User> & { id: number }): User {
  return {
    id: raw.id,
    firstName: raw.firstName ?? "",
    lastName: raw.lastName ?? "",
    email: raw.email ?? "",
    role: (raw.role as User["role"]) ?? "user",
  };
}

function loadStoredAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (a): a is StoredAccount =>
          a &&
          typeof a.userId === "number" &&
          typeof a.token === "string" &&
          a.token.length > 0 &&
          a.user &&
          typeof a.user.id === "number"
      )
      .map((a) => ({
        userId: a.userId,
        token: a.token,
        user: sanitizeUser(a.user),
      }));
  } catch {
    return [];
  }
}

function saveStoredAccounts(accounts: StoredAccount[]): void {
  localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
}

function upsertStoredAccount(token: string, user: User): StoredAccount[] {
  const sanitized = sanitizeUser(user);
  const current = loadStoredAccounts();
  const next = current.filter((a) => a.userId !== sanitized.id);
  next.push({ userId: sanitized.id, token, user: sanitized });
  saveStoredAccounts(next);
  return next;
}

function removeStoredAccount(userId: number): StoredAccount[] {
  const next = loadStoredAccounts().filter((a) => a.userId !== userId);
  saveStoredAccounts(next);
  return next;
}

const AuthContext = createContext<UseAuthReturn | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [storedAccounts, setStoredAccounts] = useState<StoredAccount[]>(() =>
    loadStoredAccounts()
  );
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const syncAccountsFromStorage = useCallback(() => {
    setStoredAccounts(loadStoredAccounts());
  }, []);

  const persistCurrentSession = useCallback(async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/persist-session`,
        {},
        { withCredentials: true }
      );
      const { token, user: sessionUser } = response.data;
      if (token && sessionUser) {
        setStoredAccounts(upsertStoredAccount(token, sessionUser));
      }
    } catch {
      // Session may already be gone; ignore — checkAuth handles auth state
    }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/auth/me`, {
        withCredentials: true,
      });
      const sessionUser = sanitizeUser(response.data.user);
      setUser(sessionUser);
      setIsAuthenticated(true);

      const existing = loadStoredAccounts().find(
        (a) => a.userId === sessionUser.id
      );
      if (!existing?.token) {
        await persistCurrentSession();
      } else {
        // Keep profile fields fresh
        setStoredAccounts(
          upsertStoredAccount(existing.token, sessionUser)
        );
      }
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, [persistCurrentSession]);

  const addAccount = useCallback((token: string, newUser: User) => {
    setStoredAccounts(upsertStoredAccount(token, newUser));
  }, []);

  const removeAccount = useCallback((userId: number) => {
    setStoredAccounts(removeStoredAccount(userId));
  }, []);

  const switchAccount = useCallback(async (token: string): Promise<User> => {
    try {
      setError(null);
      const response = await axios.post(
        `${API_URL}/api/auth/switch-account`,
        { token },
        { withCredentials: true }
      );
      const { token: freshToken, user: switchedUser } = response.data;
      if (!switchedUser) {
        throw new Error("No se recibió la cuenta");
      }
      const sanitized = sanitizeUser(switchedUser);
      if (freshToken) {
        setStoredAccounts(upsertStoredAccount(freshToken, sanitized));
      } else {
        setStoredAccounts(upsertStoredAccount(token, sanitized));
      }
      setUser(sanitized);
      setIsAuthenticated(true);
      return sanitized;
    } catch (err: unknown) {
      const status =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { status?: number; data?: { message?: string } } })
              .response?.status
          : undefined;
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : null;

      // Drop expired / invalid stored sessions so the UI stays honest
      if (status === 401 || status === 403) {
        const next = loadStoredAccounts().filter((a) => a.token !== token);
        saveStoredAccounts(next);
        setStoredAccounts(next);
      }

      const finalMessage =
        message ||
        "No se pudo cambiar de cuenta. La sesión guardada expiró; vuelve a iniciar sesión con esa cuenta.";
      setError(finalMessage);
      throw new Error(finalMessage);
    }
  }, []);

  const logout = useCallback(async (): Promise<boolean> => {
    setError(null);
    const currentUserId = user?.id;
    const remaining = currentUserId
      ? removeStoredAccount(currentUserId)
      : loadStoredAccounts();
    setStoredAccounts(remaining);

    try {
      await axios.post(
        `${API_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch {
      // Continue local logout even if the request fails
    }

    if (remaining.length > 0 && remaining[0].token) {
      try {
        await switchAccount(remaining[0].token);
        return true;
      } catch {
        // Fall through to full logout
      }
    }

    setUser(null);
    setIsAuthenticated(false);
    return false;
  }, [user?.id, switchAccount]);

  const accounts: DisplayAccount[] = useMemo(() => {
    if (!user) return [];
    const currentEntry = storedAccounts.find((a) => a.userId === user.id);
    const others = storedAccounts.filter((a) => a.userId !== user.id);
    const current: DisplayAccount = {
      user,
      token: currentEntry?.token ?? null,
      isCurrent: true,
    };
    const rest: DisplayAccount[] = others.map((a) => ({
      user: a.user,
      token: a.token,
      isCurrent: false,
    }));
    return [current, ...rest];
  }, [user, storedAccounts]);

  useEffect(() => {
    syncAccountsFromStorage();
    checkAuth();
  }, [checkAuth, syncAccountsFromStorage]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === ACCOUNTS_STORAGE_KEY) {
        syncAccountsFromStorage();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [syncAccountsFromStorage]);

  const value = useMemo<UseAuthReturn>(
    () => ({
      user,
      loading,
      isAuthenticated,
      accounts,
      logout,
      checkAuth,
      addAccount,
      removeAccount,
      switchAccount,
      error,
      clearError,
    }),
    [
      user,
      loading,
      isAuthenticated,
      accounts,
      logout,
      checkAuth,
      addAccount,
      removeAccount,
      switchAccount,
      error,
      clearError,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): UseAuthReturn => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return ctx;
};
