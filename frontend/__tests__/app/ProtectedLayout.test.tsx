import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import React from "react";

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock @/contexts/AuthContext
const mockUseAuth = vi.fn();
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

describe("ProtectedLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading spinner with aria-live while isLoading", async () => {
    /**
     * Validates: Requirements 5.2, 5.3
     */
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });

    const { default: ProtectedLayout } = await import(
      "@/app/(protected)/layout"
    );

    render(
      <ProtectedLayout>
        <div>Protected Content</div>
      </ProtectedLayout>
    );

    const statusElement = screen.getByRole("status");
    expect(statusElement).toBeInTheDocument();
    expect(statusElement).toHaveAttribute("aria-live", "polite");
  });

  it("does not render children while loading", async () => {
    /**
     * Validates: Requirements 5.2
     */
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });

    const { default: ProtectedLayout } = await import(
      "@/app/(protected)/layout"
    );

    render(
      <ProtectedLayout>
        <div>Protected Content</div>
      </ProtectedLayout>
    );

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("redirects to /login when not authenticated", async () => {
    /**
     * Validates: Requirements 5.4
     */
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });

    const { default: ProtectedLayout } = await import(
      "@/app/(protected)/layout"
    );

    render(
      <ProtectedLayout>
        <div>Protected Content</div>
      </ProtectedLayout>
    );

    expect(mockPush).toHaveBeenCalledWith("/login");
  });

  it("renders children when authenticated", async () => {
    /**
     * Validates: Requirements 5.5
     */
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    const { default: ProtectedLayout } = await import(
      "@/app/(protected)/layout"
    );

    render(
      <ProtectedLayout>
        <div>Protected Content</div>
      </ProtectedLayout>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading indicator while isLoading", async () => {
    /**
     * Validates: Requirements 6.3
     */
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });

    const { default: LoginPage } = await import("@/app/login/page");

    render(<LoginPage />);

    const statusElement = screen.getByRole("status");
    expect(statusElement).toBeInTheDocument();
  });

  it("redirects to /pets when authenticated", async () => {
    /**
     * Validates: Requirements 6.1
     */
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    const { default: LoginPage } = await import("@/app/login/page");

    render(<LoginPage />);

    expect(mockPush).toHaveBeenCalledWith("/pets");
  });

  it("renders login content when not authenticated", async () => {
    /**
     * Validates: Requirements 6.2
     */
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });

    const { default: LoginPage } = await import("@/app/login/page");

    render(<LoginPage />);

    expect(screen.getByText("Pet Care")).toBeInTheDocument();
  });
});
