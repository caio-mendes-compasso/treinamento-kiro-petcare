"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { User, AuthContextType } from "@/types/auth";
import { mockLogin } from "@/mocks/auth";

const defaultContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultContext);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const token = localStorage.getItem("petcare_token");
      const userStr = localStorage.getItem("petcare_user");

      if (token && userStr) {
        const parsed = JSON.parse(userStr);

        if (
          parsed &&
          typeof parsed.nome === "string" &&
          typeof parsed.email === "string"
        ) {
          setUser({ nome: parsed.nome, email: parsed.email });
          setIsAuthenticated(true);
        }
      }
    } catch {
      // localStorage unavailable or JSON parse error — remain unauthenticated
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, senha: string): Promise<boolean> => {
    const result = await mockLogin(email, senha);

    if (result.success && result.user) {
      try {
        const token = `mock-token-${Date.now()}`;
        localStorage.setItem("petcare_token", token);
        localStorage.setItem("petcare_user", JSON.stringify(result.user));
      } catch {
        // localStorage unavailable — return false without changing state
        return false;
      }

      setUser(result.user);
      setIsAuthenticated(true);
      return true;
    }

    return false;
  };

  const logout = () => {
    try {
      localStorage.removeItem("petcare_token");
      localStorage.removeItem("petcare_user");
    } catch {
      // localStorage unavailable — still reset state and redirect
    }

    setUser(null);
    setIsAuthenticated(false);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}
