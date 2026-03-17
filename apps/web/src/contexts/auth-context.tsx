
'use client';
// apps/web/src/contexts/auth-context.tsx

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { authApi, AuthUser } from '@/lib/auth-api';
import { setAccessToken } from '@/lib/api';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (u: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true); // true until first me() check

  // On mount: try to refresh access token silently (user may have a valid cookie)
  useEffect(() => {
  (async () => {
    try {
      // Step 1 — silently get a new access token using the refresh cookie
      const { data } = await authApi.refresh();
      setAccessToken(data.accessToken);

      // Step 2 — now fetch the user with that token
      const { data: me } = await authApi.me();
      setUser(me);
    } catch {
      // No valid session — that's fine, user stays null
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  })();
}, []);

  const login = useCallback(
    async (identifier: string, password: string): Promise<AuthUser> => {
      const { data } = await authApi.login({ identifier, password });
      setAccessToken(data.accessToken);
      setUser(data.user);
      return data.user;
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const { data } = await authApi.me();
    setUser(data);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}

