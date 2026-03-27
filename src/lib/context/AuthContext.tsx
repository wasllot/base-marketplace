'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { API } from '@/lib/api/endpoints';
import { apiFetch, getToken, setToken, clearToken } from '@/lib/api/apiClient';

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const data = await apiFetch<{ data: User } | User>(API.USER);
      const usr = (data as { data: User }).data ?? (data as User);
      setUser(usr);
    } catch {
      setUser(null);
      clearToken();
      setTokenState(null);
    }
  }, []);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const stored = getToken();
    if (stored) {
      setTokenState(stored);
      refreshUser().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const res = await apiFetch<{ access_token: string; user?: User }>(API.LOGIN, {
      method: 'POST',
      body: { email, password },
    });
    const tok = res.access_token;
    setToken(tok);
    setTokenState(tok);
    await refreshUser();
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await apiFetch<{ access_token: string; user?: User }>(API.REGISTER, {
      method: 'POST',
      body: { name, email, password },
    });
    const tok = res.access_token;
    setToken(tok);
    setTokenState(tok);
    await refreshUser();
  };

  const logout = () => {
    clearToken();
    setTokenState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
