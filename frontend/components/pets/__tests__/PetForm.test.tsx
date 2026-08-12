import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import PetForm from "@/components/pets/PetForm";

describe("PetForm", () => {
  const defaultProps = {
    isOpen: true,
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
  };

  /**
   * Test 1: Form should not render when isOpen is false
   * Validates: Requirements 3.1
   */
  it("should not render the form when isOpen is false", () => {
    const { container } = render(
      <PetForm isOpen={false} onSubmit={vi.fn()} onCancel={vi.fn()} />
    );

    expect(container.innerHTML).toBe("");
  });

  /**
   * Test 2: When form is submitted with empty fields, error messages appear
   * Validates: Requirements 5.1, 5.2
   */
  it("should display error messages for required fields when submitted empty", () => {
    render(<PetForm {...defaultProps} />);

    fireEvent.click(screen.getByText("Cadastrar Pet"));

    expect(screen.getByText("Nome do pet é obrigatório")).toBeInTheDocument();
    // "Selecione a espécie" appears both in the <option> placeholder and the error <p>
    const speciesErrors = screen.getAllByText("Selecione a espécie");
    expect(speciesErrors.length).toBeGreaterThanOrEqual(2);
    // Check that the error paragraph is present
    const errorParagraph = speciesErrors.find((el) => el.tagName === "P");
    expect(errorParagraph).toBeInTheDocument();
    expect(screen.getByText("Raça é obrigatória")).toBeInTheDocument();
    expect(screen.getByText("Data de nascimento é obrigatória")).toBeInTheDocument();
    expect(screen.getByText("Peso é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("Cor/pelagem é obrigatória")).toBeInTheDocument();
  });

  /**
   * Test 3: When species changes, breed value resets and BreedSelector switches
   * Validates: Requirements 3.2, 3.6
   */
  it("should reset breed value when species changes from cao to gato", () => {
    render(<PetForm {...defaultProps} />);

    // Select species "cao"
    fireEvent.change(screen.getByLabelText(/espécie/i), {
      target: { value: "cao" },
    });

    // Select a breed
    const breedSelect = screen.getByRole("combobox", { name: "" });
    // The BreedSelector for "cao" renders a select with breeds
    fireEvent.change(breedSelect, {
      target: { value: "Golden Retriever" },
    });

    // Change species to "gato"
    fireEvent.change(screen.getByLabelText(/espécie/i), {
      target: { value: "gato" },
    });

    // Breed should be reset - the select value should be empty
    const updatedBreedSelect = screen.getByDisplayValue("Selecione a raça");
    expect(updatedBreedSelect).toBeInTheDocument();
  });

  /**
   * Test 4: When species is "outro", a text input appears for breed
   * Validates: Requirements 3.5
   */
  it("should render a text input for breed when species is 'outro'", () => {
    render(<PetForm {...defaultProps} />);

    // Select species "outro"
    fireEvent.change(screen.getByLabelText(/espécie/i), {
      target: { value: "outro" },
    });

    // A text input should appear with the placeholder "Digite a raça"
    const breedInput = screen.getByPlaceholderText("Digite a raça");
    expect(breedInput).toBeInTheDocument();
    expect(breedInput).toHaveAttribute("type", "text");
  });

  /**
   * Test 5: When all fields are valid and form is submitted, onSubmit is called
   * Validates: Requirements 3.1, 3.2, 5.1, 5.2
   */
  it("should call onSubmit with correct data when form is valid", () => {
    const onSubmit = vi.fn();
    render(<PetForm isOpen={true} onSubmit={onSubmit} onCancel={vi.fn()} />);

    // Fill name
    fireEvent.change(screen.getByLabelText(/nome/i), {
      target: { value: "Rex" },
    });

    // Fill species
    fireEvent.change(screen.getByLabelText(/espécie/i), {
      target: { value: "cao" },
    });

    // Fill breed (BreedSelector renders a select for "cao")
    const breedSelect = screen.getByDisplayValue("Selecione a raça");
    fireEvent.change(breedSelect, {
      target: { value: "Labrador" },
    });

    // Fill birth date
    fireEvent.change(screen.getByLabelText(/data de nascimento/i), {
      target: { value: "2020-05-15" },
    });

    // Fill weight
    fireEvent.change(screen.getByLabelText(/peso/i), {
      target: { value: "12.5" },
    });

    // Fill color
    fireEvent.change(screen.getByLabelText(/cor\/pelagem/i), {
      target: { value: "Dourado" },
    });

    // Submit
    fireEvent.click(screen.getByText("Cadastrar Pet"));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      name: "Rex",
      species: "cao",
      breed: "Labrador",
      birthDate: "2020-05-15",
      weight: 12.5,
      color: "Dourado",
      photo: null,
    });
  });
});
