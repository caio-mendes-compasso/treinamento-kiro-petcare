import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import Stepper from "@/components/planos/Stepper";

/**
 * Property 1: Stepper highlights exactly the current step
 *
 * For any valid step index (1 through 4), the Stepper component SHALL visually
 * highlight exactly one step — the one matching the current step index — while
 * all other steps remain unhighlighted.
 *
 * **Validates: Requirements 1.2**
 */
describe("Stepper - Property Tests", () => {
  it("highlights exactly the current step (aria-current='step' on exactly one element)", () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 4 }), (currentStep) => {
        const { container } = render(<Stepper currentStep={currentStep} />);

        const ariaCurrent = container.querySelectorAll("[aria-current='step']");
        expect(ariaCurrent.length).toBe(1);
      })
    );
  });

  it("highlights exactly the current step (font-semibold on exactly one label)", () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 4 }), (currentStep) => {
        const { container } = render(<Stepper currentStep={currentStep} />);

        const labels = container.querySelectorAll("ol > li > span");
        const semiboldLabels = Array.from(labels).filter((el) =>
          el.className.includes("font-semibold")
        );
        expect(semiboldLabels.length).toBe(1);
      })
    );
  });
});
