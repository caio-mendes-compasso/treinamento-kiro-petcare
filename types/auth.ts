import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email inválido" })
    .max(254)
    .email({ message: "Email inválido" }),
  senha: z
    .string()
    .min(6, { message: "Senha deve ter no mínimo 6 caracteres" })
    .max(128),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export interface User {
  nome: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
}

export interface MockLoginResponse {
  success: boolean;
  user?: User;
}
