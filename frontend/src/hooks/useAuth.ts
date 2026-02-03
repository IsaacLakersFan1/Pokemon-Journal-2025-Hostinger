import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import API_URL from "@/utils/apiConfig";
import { toastError } from "@/hooks/useToastError";
import { UseAuthReturn, User, StoredAccount, DisplayAccount } from "@/interfaces/useAuth";

const ACCOUNTS_STORAGE_KEY = "pokemon_journal_accounts";

function loadStoredAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStoredAccounts(accounts: StoredAccount[]): void {
  localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [storedAccounts, setStoredAccounts] = useState<StoredAccount[]>(() => loadStoredAccounts());
  const { showToastError } = toastError();

  const checkAuth = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/auth/me`, {
        withCredentials: true
      });
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const addAccount = (token: string, newUser: User) => {
    const current = loadStoredAccounts();
    const exists = current.some((a) => a.userId === newUser.id);
    if (exists) return;
    setStoredAccounts([...current, { userId: newUser.id, token, user: newUser }]);
    saveStoredAccounts([...current, { userId: newUser.id, token, user: newUser }]);
  };

  const removeAccount = (userId: number) => {
    const next = storedAccounts.filter((a) => a.userId !== userId);
    setStoredAccounts(next);
    saveStoredAccounts(next);
  };

  const switchAccount = async (token: string) => {
    try {
      await axios.post(
        `${API_URL}/api/auth/switch-account`,
        { token },
        { withCredentials: true }
      );
      await checkAuth();
    } catch (error) {
      showToastError("Error al cambiar de cuenta");
    }
  };

  const logout = async () => {
    if (user) removeAccount(user.id);
    try {
      await axios.post(`${API_URL}/api/auth/logout`, {}, {
        withCredentials: true
      });
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      showToastError("Error al cerrar sesión");
    }
  };

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
    setStoredAccounts(loadStoredAccounts());
    checkAuth();
  }, []);

  return {
    user,
    loading,
    isAuthenticated,
    accounts,
    logout,
    checkAuth,
    addAccount,
    removeAccount,
    switchAccount,
  };
};
