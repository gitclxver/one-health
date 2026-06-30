"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import type { User } from "@/lib/types/api";

type AuthState = "loading" | "authenticated" | "guest";

interface AuthContextValue {
  state: AuthState;
  user: User | null;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>("loading");
  const [user, setUser] = useState<User | null>(null);

  const refresh = useCallback(async () => {
    try {
      const profile = await authApi.me();
      setUser(profile);
      setState("authenticated");
    } catch (error) {
      setUser(null);
      setState("guest");
      if (error instanceof ApiError && error.status !== 401 && error.status !== 0) {
        // Silent for guests / offline — no console noise for expected cases
      }
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setState("guest");
    }
  }, []);

  const value = useMemo(
    () => ({ state, user, refresh, logout }),
    [state, user, refresh, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
