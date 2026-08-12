import { render, screen, act, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Toast from "@/components/ui/Toast";

describe("Toast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders nothing when visible is false", () => {
    const { container } = render(
      <Toast message="Test" visible={false} onClose={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders the message when visible is true", () => {
    render(<Toast message="Funcionalidade em breve" visible={true} onClose={() => {}} />);
    expect(screen.getByText("Funcionalidade em breve")).toBeDefined();
  });

  it("has role='alert' for accessibility", () => {
    render(<Toast message="Test" visible={true} onClose={() => {}} />);
    expect(screen.getByRole("alert")).toBeDefined();
  });

  it("auto-dismisses after 3 seconds", () => {
    const onClose = vi.fn();
    render(<Toast message="Test" visible={true} onClose={onClose} />);

    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(<Toast message="Test" visible={true} onClose={onClose} />);

    const closeButton = screen.getByLabelText("Fechar notificação");
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("clears timeout when component unmounts", () => {
    const onClose = vi.fn();
    const { unmount } = render(
      <Toast message="Test" visible={true} onClose={onClose} />
    );

    unmount();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(onClose).not.toHaveBeenCalled();
  });
});
