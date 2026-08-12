import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";

// Mock next/navigation
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/",
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock window.matchMedia for Sidebar media query listener
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: true,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

/**
 * Test consumer that exposes login/logout actions and auth state.
 */
function AuthTestConsumer() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  return (
    <div>
      <span data-testid="isAuthenticated">{String(isAuthenticated)}</span>
      <span data-testid="isLoading">{String(isLoading)}</span>
      <span data-testid="user">{user ? JSON.stringify(user) : "null"}</span>
      <button
        data-testid="login-btn"
        onClick={() => login("user@example.com", "123456")}
      />
      <button data-testid="logout-btn" onClick={logout} />
    </div>
  );
}

describe("Integration: Full Auth Flow", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    mockPush.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it("full flow: login → protected access → logout → redirect", async () => {
    render(
      <AuthProvider>
        <AuthTestConsumer />
      </AuthProvider>
    );

    // Wait for provider initialization
    await act(async () => {});

    // Initially not authenticated
    expect(screen.getByTestId("isAuthenticated").textContent).toBe("false");

    // Perform login
    await act(async () => {
      screen.getByTestId("login-btn").click();
      await vi.advanceTimersByTimeAsync(1000);
    });

    // Verify authenticated
    expect(screen.getByTestId("isAuthenticated").textContent).toBe("true");
    expect(screen.getByTestId("user").textContent).toBe(
      JSON.stringify({ nome: "Usuário PetCare", email: "user@example.com" })
    );

    // Perform logout
    await act(async () => {
      screen.getByTestId("logout-btn").click();
    });

    // Verify state cleared and redirect happened
    expect(screen.getByTestId("isAuthenticated").textContent).toBe("false");
    expect(screen.getByTestId("user").textContent).toBe("null");
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("session persists between provider remounts (simulating page reload)", async () => {
    const { unmount } = render(
      <AuthProvider>
        <AuthTestConsumer />
      </AuthProvider>
    );

    // Wait for provider initialization
    await act(async () => {});

    // Perform login
    await act(async () => {
      screen.getByTestId("login-btn").click();
      await vi.advanceTimersByTimeAsync(1000);
    });

    // Verify authenticated
    expect(screen.getByTestId("isAuthenticated").textContent).toBe("true");
    expect(screen.getByTestId("user").textContent).toBe(
      JSON.stringify({ nome: "Usuário PetCare", email: "user@example.com" })
    );

    // Unmount (simulating page unload)
    unmount();

    // Re-render (simulating page reload — localStorage still has data)
    render(
      <AuthProvider>
        <AuthTestConsumer />
      </AuthProvider>
    );

    // Wait for provider initialization to read from localStorage
    await act(async () => {});

    // State should be restored from localStorage
    expect(screen.getByTestId("isAuthenticated").textContent).toBe("true");
    expect(screen.getByTestId("user").textContent).toBe(
      JSON.stringify({ nome: "Usuário PetCare", email: "user@example.com" })
    );
  });

  it("Header updates navigation items when auth state changes", async () => {
    render(
      <AuthProvider>
        <Header />
        <AuthTestConsumer />
      </AuthProvider>
    );

    // Wait for provider initialization
    await act(async () => {});

    // Get the desktop nav (aria-label="Navegação principal") for scoped queries
    const desktopNav = screen.getByRole("navigation", {
      name: "Navegação principal",
    });

    // Initially not authenticated: verify public items visible in desktop nav
    expect(desktopNav).toHaveTextContent("Home");
    expect(desktopNav).toHaveTextContent("Planos");
    expect(desktopNav).toHaveTextContent("Login");

    // Authenticated items should NOT be in desktop nav
    expect(desktopNav).not.toHaveTextContent("Meus Pets");
    expect(desktopNav).not.toHaveTextContent("Agenda");
    expect(desktopNav).not.toHaveTextContent("Financeiro");
    expect(desktopNav).not.toHaveTextContent("Carteirinha");
    expect(desktopNav).not.toHaveTextContent("Logout");

    // Perform login
    await act(async () => {
      screen.getByTestId("login-btn").click();
      await vi.advanceTimersByTimeAsync(1000);
    });

    // Verify authenticated items appear in desktop nav
    expect(desktopNav).toHaveTextContent("Meus Pets");
    expect(desktopNav).toHaveTextContent("Agenda");
    expect(desktopNav).toHaveTextContent("Financeiro");
    expect(desktopNav).toHaveTextContent("Carteirinha");
    expect(desktopNav).toHaveTextContent("Logout");

    // Verify public items are no longer in desktop nav
    expect(desktopNav).not.toHaveTextContent("Home");
    expect(desktopNav).not.toHaveTextContent("Planos");
    expect(desktopNav).not.toHaveTextContent("Login");

    // Perform logout
    await act(async () => {
      screen.getByTestId("logout-btn").click();
    });

    // Verify public items return in desktop nav
    expect(desktopNav).toHaveTextContent("Home");
    expect(desktopNav).toHaveTextContent("Planos");
    expect(desktopNav).toHaveTextContent("Login");

    // Verify authenticated items disappear from desktop nav
    expect(desktopNav).not.toHaveTextContent("Meus Pets");
    expect(desktopNav).not.toHaveTextContent("Agenda");
    expect(desktopNav).not.toHaveTextContent("Financeiro");
    expect(desktopNav).not.toHaveTextContent("Carteirinha");
    expect(desktopNav).not.toHaveTextContent("Logout");
  });
});
