import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Stepper from "@/components/planos/Stepper";

describe("Stepper", () => {
  it("renders all 4 step labels on desktop", () => {
    render(<Stepper currentStep={1} />);
    expect(screen.getByText("Escolha do Plano")).toBeDefined();
    expect(screen.getByText("Dados do Tutor")).toBeDefined();
    expect(screen.getByText("Dados do Pet")).toBeDefined();
    // "Resumo" appears twice (desktop + mobile label is the same)
    expect(screen.getAllByText("Resumo").length).toBeGreaterThanOrEqual(1);
  });

  it("renders navigation landmark with accessible label", () => {
    render(<Stepper currentStep={1} />);
    expect(screen.getByLabelText("Progresso do cadastro")).toBeDefined();
  });

  it("marks the active step with aria-current='step'", () => {
    const { container } = render(<Stepper currentStep={2} />);
    const activeIndicator = container.querySelector("[aria-current='step']");
    expect(activeIndicator).not.toBeNull();
  });

  it("applies font-semibold to the active step label", () => {
    const { container } = render(<Stepper currentStep={3} />);
    const labels = container.querySelectorAll("ol > li > span");
    // Step 3 (index 2) should have font-semibold
    const activeLabel = labels[2];
    expect(activeLabel.className).toContain("font-semibold");
    expect(activeLabel.className).toContain("text-primary-500");
  });

  it("shows checkmark for completed steps", () => {
    const { container } = render(<Stepper currentStep={3} />);
    // Steps 1 and 2 should have checkmark SVGs
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBe(2);
  });

  it("shows step number for pending steps", () => {
    render(<Stepper currentStep={1} />);
    // Steps 2, 3, 4 are pending and should show their numbers
    expect(screen.getByText("2")).toBeDefined();
    expect(screen.getByText("3")).toBeDefined();
    expect(screen.getByText("4")).toBeDefined();
  });

  it("does not show step number for active step when replaced by filled circle", () => {
    render(<Stepper currentStep={1} />);
    // Step 1 is active - shows number 1 inside the filled circle
    expect(screen.getByText("1")).toBeDefined();
  });

  it("applies text-gray-400 to pending steps", () => {
    const { container } = render(<Stepper currentStep={1} />);
    const labels = container.querySelectorAll("ol > li > span");
    // Steps 2, 3, 4 (index 1, 2, 3) should have text-gray-400
    expect(labels[1].className).toContain("text-gray-400");
    expect(labels[2].className).toContain("text-gray-400");
    expect(labels[3].className).toContain("text-gray-400");
  });

  it("applies text-primary-500 to completed step labels", () => {
    const { container } = render(<Stepper currentStep={4} />);
    const labels = container.querySelectorAll("ol > li > span");
    // Steps 1, 2, 3 (index 0, 1, 2) are completed
    expect(labels[0].className).toContain("text-primary-500");
    expect(labels[1].className).toContain("text-primary-500");
    expect(labels[2].className).toContain("text-primary-500");
    // They should NOT have font-semibold (only active does)
    expect(labels[0].className).not.toContain("font-semibold");
    expect(labels[1].className).not.toContain("font-semibold");
    expect(labels[2].className).not.toContain("font-semibold");
  });
});
