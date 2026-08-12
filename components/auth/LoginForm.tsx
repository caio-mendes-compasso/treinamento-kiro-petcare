"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Toast from "@/components/ui/Toast";
import { useAuth } from "@/contexts/AuthContext";
import { loginSchema } from "@/types/auth";

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [errors, setErrors] = useState<{ email?: string; senha?: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const validateField = (fieldName: "email" | "senha", value: string): string | undefined => {
    const result = loginSchema.shape[fieldName].safeParse(value);
    if (!result.success) {
      return result.error.errors[0]?.message;
    }
    return undefined;
  };

  const handleBlur = (fieldName: "email" | "senha") => {
    const value = fieldName === "email" ? email : senha;
    const error = validateField(fieldName, value);
    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = loginSchema.safeParse({ email, senha });

    if (!result.success) {
      const fieldErrors: { email?: string; senha?: string } = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as "email" | "senha";
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);

      // Focus the first field with error in DOM order (email comes before senha)
      if (fieldErrors.email) {
        document.getElementById("email")?.focus();
      } else if (fieldErrors.senha) {
        document.getElementById("senha")?.focus();
      }

      return;
    }

    // Validation passed — proceed with authentication
    setGeneralError(null);
    setIsSubmitting(true);

    try {
      const success = await login(email, senha);

      if (success) {
        router.push("/pets");
      } else {
        setGeneralError("Email ou senha inválidos");
      }
    } catch {
      setGeneralError("Email ou senha inválidos");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    setShowToast(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8 w-full max-w-md">
      <h2 className="text-gray-900 font-semibold text-2xl text-center mb-6">
        Entrar
      </h2>

      {generalError && (
        <p className="text-red-500 text-sm text-center mb-4">{generalError}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleBlur("email")}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            placeholder="seu@email.com"
          />
          {errors.email && (
            <p id="email-error" className="text-red-500 text-sm mt-1">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="senha"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Senha
          </label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            onBlur={() => handleBlur("senha")}
            aria-invalid={!!errors.senha}
            aria-describedby={errors.senha ? "senha-error" : undefined}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            placeholder="••••••"
          />
          {errors.senha && (
            <p id="senha-error" className="text-red-500 text-sm mt-1">
              {errors.senha}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="bg-primary-500 text-white w-full py-2 rounded-lg font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Entrando...
            </>
          ) : (
            "Entrar"
          )}
        </button>
      </form>

      <div className="text-center mt-4">
        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-primary-500 hover:text-primary-600 text-sm"
        >
          Esqueci minha senha
        </button>
      </div>

      <Toast
        message="Funcionalidade em breve"
        visible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
