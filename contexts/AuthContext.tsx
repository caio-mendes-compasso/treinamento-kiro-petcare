"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import type { AuthContextType, User } from "@/types/auth";

const COOKIE_NAME = "petcare-auth";

const AuthContext = createContext<AuthContextType | null>(null);

function setCookie(name: string, value: string, days: number = 7): void {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cookieValue = getCookie(COOKIE_NAME);
    if (cookieValue) {
      try {
        const userData: User = JSON.parse(cookieValue);
        setUser(userData);
        setIsAuthenticated(true);
      } catch {
        deleteCookie(COOKIE_NAME);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    // Mock login — in a real app this would call an API
    const userData: User = {
      name: email.split("@")[0],
      email,
    };

    setCookie(COOKIE_NAME, JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback((): void => {
    deleteCookie(COOKIE_NAME);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider. Wrap your component tree with <AuthProvider>."
    );
  }
  return context;
}

export { AuthContext };
export default AuthProvider;
