import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import BreedSelector from "@/components/pets/BreedSelector";
import { breedsBySpecies } from "@/mocks/breeds";

describe("BreedSelector", () => {
  describe("when species is 'cao'", () => {
    it("renders a select element with dog breed options", () => {
      render(
        <BreedSelector species="cao" value="" onChange={() => {}} />
      );

      const select = screen.getByRole("combobox");
      expect(select).toBeDefined();

      breedsBySpecies.cao.forEach((breed) => {
        expect(screen.getByText(breed)).toBeDefined();
      });
    });

    it("includes a placeholder option", () => {
      render(
        <BreedSelector species="cao" value="" onChange={() => {}} />
      );

      expect(screen.getByText("Selecione a raça")).toBeDefined();
    });

    it("calls onChange when a breed is selected", () => {
      const handleChange = vi.fn();
      render(
        <BreedSelector species="cao" value="" onChange={handleChange} />
      );

      const select = screen.getByRole("combobox");
      fireEvent.change(select, { target: { value: "Labrador" } });

      expect(handleChange).toHaveBeenCalledWith("Labrador");
    });
  });

  describe("when species is 'gato'", () => {
    it("renders a select element with cat breed options", () => {
      render(
        <BreedSelector species="gato" value="" onChange={() => {}} />
      );

      const select = screen.getByRole("combobox");
      expect(select).toBeDefined();

      breedsBySpecies.gato.forEach((breed) => {
        expect(screen.getByText(breed)).toBeDefined();
      });
    });

    it("calls onChange when a breed is selected", () => {
      const handleChange = vi.fn();
      render(
        <BreedSelector species="gato" value="" onChange={handleChange} />
      );

      const select = screen.getByRole("combobox");
      fireEvent.change(select, { target: { value: "Persa" } });

      expect(handleChange).toHaveBeenCalledWith("Persa");
    });
  });

  describe("when species is 'outro'", () => {
    it("renders a text input instead of select", () => {
      render(
        <BreedSelector species="outro" value="" onChange={() => {}} />
      );

      const input = screen.getByPlaceholderText("Digite a raça");
      expect(input).toBeDefined();
      expect(input.tagName).toBe("INPUT");
    });

    it("calls onChange when text is typed", () => {
      const handleChange = vi.fn();
      render(
        <BreedSelector species="outro" value="" onChange={handleChange} />
      );

      const input = screen.getByPlaceholderText("Digite a raça");
      fireEvent.change(input, { target: { value: "Hamster Sírio" } });

      expect(handleChange).toHaveBeenCalledWith("Hamster Sírio");
    });
  });

  describe("error display", () => {
    it("displays error message when error prop is provided (select mode)", () => {
      render(
        <BreedSelector species="cao" value="" onChange={() => {}} error="Raça é obrigatória" />
      );

      expect(screen.getByText("Raça é obrigatória")).toBeDefined();
    });

    it("displays error message when error prop is provided (input mode)", () => {
      render(
        <BreedSelector species="outro" value="" onChange={() => {}} error="Raça é obrigatória" />
      );

      expect(screen.getByText("Raça é obrigatória")).toBeDefined();
    });

    it("applies error border styling when error is present (select mode)", () => {
      render(
        <BreedSelector species="cao" value="" onChange={() => {}} error="Raça é obrigatória" />
      );

      const select = screen.getByRole("combobox");
      expect(select.className).toContain("border-red-500");
    });

    it("applies error border styling when error is present (input mode)", () => {
      render(
        <BreedSelector species="outro" value="" onChange={() => {}} error="Raça é obrigatória" />
      );

      const input = screen.getByPlaceholderText("Digite a raça");
      expect(input.className).toContain("border-red-500");
    });

    it("does not display error when error prop is undefined", () => {
      render(
        <BreedSelector species="cao" value="" onChange={() => {}} />
      );

      const select = screen.getByRole("combobox");
      expect(select.className).toContain("border-gray-200");
      expect(screen.queryByText("Raça é obrigatória")).toBeNull();
    });
  });
});
