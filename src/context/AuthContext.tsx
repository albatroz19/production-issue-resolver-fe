import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { login as apiLogin } from '@/api/tracker';
import { TrackerApiError } from '@/api/tracker';

const AUTH_STORAGE_KEY = 'tracker-auth';

interface AuthState {
  token: string;
  username: string;
}

interface AuthContextValue {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadAuth(): AuthState | null {
  const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as AuthState;
    if (parsed.token && parsed.username) return parsed;
  } catch {
    // ignore
  }
  return null;
}

function saveAuth(state: AuthState | null) {
  if (state) {
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
  } else {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState | null>(() => loadAuth());

  useEffect(() => {
    saveAuth(auth);
  }, [auth]);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const response = await apiLogin(username, password);
      setAuth({ token: response.token, username: response.username });
    } catch (error) {
      if (error instanceof TrackerApiError) {
        throw new Error(error.detail);
      }
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    setAuth(null);
  }, []);

  const value = useMemo(
    () => ({
      token: auth?.token ?? null,
      username: auth?.username ?? null,
      isAuthenticated: Boolean(auth?.token),
      login,
      logout,
    }),
    [auth, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
