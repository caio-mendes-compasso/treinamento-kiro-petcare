import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import React from "react";

// Mock next/navigation
const mockPush = vi.fn();
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

// Mock @/contexts/AuthContext
const mockUseAuth = vi.fn();
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock LoginForm to avoid needing all its dependencies
vi.mock("@/components/auth/LoginForm", () => ({
  default: () => <div data-testid="login-form">LoginForm</div>,
}));

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects to /pets when user is authenticated", async () => {
    /**
     * Validates: Requirements 3.1
     */
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    const { default: LoginPage } = await import("@/app/login/page");

    render(<LoginPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/pets");
    });

    expect(screen.queryByTestId("login-form")).not.toBeInTheDocument();
  });

  it("shows loading spinner with role='status' while isLoading", async () => {
    /**
     * Validates: Requirements 3.2
     */
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });

    const { default: LoginPage } = await import("@/app/login/page");

    render(<LoginPage />);

    const statusElement = screen.getByRole("status");
    expect(statusElement).toBeInTheDocument();
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
    expect(screen.queryByTestId("login-form")).not.toBeInTheDocument();
  });

  it("renders LoginForm and 'Pet Care' heading when not authenticated", async () => {
    /**
     * Validates: Requirements 3.3
     */
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });

    const { default: LoginPage } = await import("@/app/login/page");

    render(<LoginPage />);

    expect(screen.getByTestId("login-form")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Pet Care" })
    ).toBeInTheDocument();
  });

  it("renders no visible content during redirect when authenticated", async () => {
    /**
     * Validates: Requirements 3.1, 3.3
     */
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    const { default: LoginPage } = await import("@/app/login/page");

    const { container } = render(<LoginPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/pets");
    });

    // Component should return null, so no LoginForm is visible
    expect(screen.queryByTestId("login-form")).not.toBeInTheDocument();
    expect(container.innerHTML).toBe("");
  });
});
