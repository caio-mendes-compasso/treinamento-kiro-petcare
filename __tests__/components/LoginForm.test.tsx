import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LoginForm from "@/components/auth/LoginForm";

const mockLogin = vi.fn();
const mockPush = vi.fn();

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
    isAuthenticated: false,
    isLoading: false,
    user: null,
    logout: vi.fn(),
  }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("onBlur validation", () => {
    it("shows 'Email inválido' and sets aria-invalid when email is invalid on blur", () => {
      render(<LoginForm />);

      const emailInput = screen.getByLabelText("Email");
      fireEvent.change(emailInput, { target: { value: "invalid-email" } });
      fireEvent.blur(emailInput);

      expect(screen.getByText("Email inválido")).toBeDefined();
      expect(emailInput.getAttribute("aria-invalid")).toBe("true");
      expect(emailInput.getAttribute("aria-describedby")).toBe("email-error");
    });

    it("shows 'Senha deve ter no mínimo 6 caracteres' when senha is too short on blur", () => {
      render(<LoginForm />);

      const senhaInput = screen.getByLabelText("Senha");
      fireEvent.change(senhaInput, { target: { value: "abc" } });
      fireEvent.blur(senhaInput);

      expect(screen.getByText("Senha deve ter no mínimo 6 caracteres")).toBeDefined();
      expect(senhaInput.getAttribute("aria-invalid")).toBe("true");
      expect(senhaInput.getAttribute("aria-describedby")).toBe("senha-error");
    });
  });

  describe("submit with empty fields", () => {
    it("shows both error messages when form is submitted with empty fields", async () => {
      render(<LoginForm />);

      const form = screen.getByRole("button", { name: "Entrar" });
      fireEvent.click(form);

      await waitFor(() => {
        expect(screen.getByText("Email inválido")).toBeDefined();
        expect(screen.getByText("Senha deve ter no mínimo 6 caracteres")).toBeDefined();
      });

      // Focus should move to email field (first in DOM order)
      const emailInput = screen.getByLabelText("Email");
      expect(document.activeElement).toBe(emailInput);
    });
  });

  describe("successful submit", () => {
    it("calls router.push('/pets') when login succeeds", async () => {
      mockLogin.mockResolvedValue(true);

      render(<LoginForm />);

      const emailInput = screen.getByLabelText("Email");
      const senhaInput = screen.getByLabelText("Senha");

      fireEvent.change(emailInput, { target: { value: "user@example.com" } });
      fireEvent.change(senhaInput, { target: { value: "password123" } });

      const submitButton = screen.getByRole("button", { name: "Entrar" });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith("user@example.com", "password123");
        expect(mockPush).toHaveBeenCalledWith("/pets");
      });
    });
  });

  describe("loading state", () => {
    it("shows 'Entrando...' text and disables button while login is in progress", async () => {
      // Never-resolving promise to keep loading state active
      mockLogin.mockImplementation(() => new Promise(() => {}));

      render(<LoginForm />);

      const emailInput = screen.getByLabelText("Email");
      const senhaInput = screen.getByLabelText("Senha");

      fireEvent.change(emailInput, { target: { value: "user@example.com" } });
      fireEvent.change(senhaInput, { target: { value: "password123" } });

      const submitButton = screen.getByRole("button", { name: "Entrar" });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Entrando...")).toBeDefined();
      });

      const button = screen.getByRole("button", { name: /Entrando/i });
      expect(button.hasAttribute("disabled")).toBe(true);
      expect(button.getAttribute("aria-busy")).toBe("true");
    });
  });

  describe("general error on login failure", () => {
    it("shows 'Email ou senha inválidos' when login returns false", async () => {
      mockLogin.mockResolvedValue(false);

      render(<LoginForm />);

      const emailInput = screen.getByLabelText("Email");
      const senhaInput = screen.getByLabelText("Senha");

      fireEvent.change(emailInput, { target: { value: "user@example.com" } });
      fireEvent.change(senhaInput, { target: { value: "wrongpass" } });

      const submitButton = screen.getByRole("button", { name: "Entrar" });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Email ou senha inválidos")).toBeDefined();
      });
    });
  });

  describe("toast on 'Esqueci minha senha'", () => {
    it("shows 'Funcionalidade em breve' toast when clicking forgot password", () => {
      render(<LoginForm />);

      const forgotButton = screen.getByText("Esqueci minha senha");
      fireEvent.click(forgotButton);

      expect(screen.getByText("Funcionalidade em breve")).toBeDefined();
    });
  });

  describe("accessibility attributes", () => {
    it("labels have htmlFor matching input ids", () => {
      render(<LoginForm />);

      const emailLabel = screen.getByText("Email");
      const senhaLabel = screen.getByText("Senha");

      expect(emailLabel.getAttribute("for")).toBe("email");
      expect(senhaLabel.getAttribute("for")).toBe("senha");

      const emailInput = document.getElementById("email");
      const senhaInput = document.getElementById("senha");

      expect(emailInput).not.toBeNull();
      expect(senhaInput).not.toBeNull();
    });

    it("inputs have correct type attributes (email and password)", () => {
      render(<LoginForm />);

      const emailInput = screen.getByLabelText("Email");
      const senhaInput = screen.getByLabelText("Senha");

      expect(emailInput.getAttribute("type")).toBe("email");
      expect(senhaInput.getAttribute("type")).toBe("password");
    });
  });

  describe("error clears on re-validation", () => {
    it("removes error when field is corrected and blurred again", () => {
      render(<LoginForm />);

      const emailInput = screen.getByLabelText("Email");

      // Type invalid email and blur → error shows
      fireEvent.change(emailInput, { target: { value: "bad" } });
      fireEvent.blur(emailInput);
      expect(screen.getByText("Email inválido")).toBeDefined();

      // Correct the email and blur → error disappears
      fireEvent.change(emailInput, { target: { value: "valid@email.com" } });
      fireEvent.blur(emailInput);
      expect(screen.queryByText("Email inválido")).toBeNull();
    });
  });
});
