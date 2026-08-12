import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import PlanPurchaseFlow from "../PlanPurchaseFlow";
import { applyCpfMask, applyPhoneMask } from "../masks";

// Valid test data
const TUTOR_DATA = {
  fullName: "João da Silva",
  cpf: "12345678901",
  email: "joao@email.com",
  phone: "11999998888",
};

const PET_DATA = {
  name: "Rex",
  species: "cao" as const,
  breed: "Labrador",
  birthDate: "2020-05-15",
  weight: "12.5",
};

/**
 * Helper: fills tutor form fields
 */
function fillTutorForm() {
  fireEvent.change(screen.getByLabelText(/nome completo/i), {
    target: { value: TUTOR_DATA.fullName },
  });
  fireEvent.change(screen.getByLabelText(/cpf/i), {
    target: { value: applyCpfMask(TUTOR_DATA.cpf) },
  });
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: TUTOR_DATA.email },
  });
  fireEvent.change(screen.getByLabelText(/telefone/i), {
    target: { value: applyPhoneMask(TUTOR_DATA.phone) },
  });
}

/**
 * Helper: fills pet form fields
 */
function fillPetForm() {
  fireEvent.change(screen.getByLabelText(/nome do pet/i), {
    target: { value: PET_DATA.name },
  });
  fireEvent.change(screen.getByLabelText(/espécie/i), {
    target: { value: PET_DATA.species },
  });
  fireEvent.change(screen.getByLabelText(/raça/i), {
    target: { value: PET_DATA.breed },
  });
  fireEvent.change(screen.getByLabelText(/data de nascimento/i), {
    target: { value: PET_DATA.birthDate },
  });
  fireEvent.change(screen.getByLabelText(/peso/i), {
    target: { value: PET_DATA.weight },
  });
}

/**
 * Helper: navigates from step 1 to step 4 filling all data
 */
function navigateToSummary() {
  // Step 1: Select plan
  fireEvent.click(screen.getByText("Plus"));
  fireEvent.click(screen.getByText("Avançar"));

  // Step 2: Fill tutor data
  fillTutorForm();
  fireEvent.click(screen.getByText("Avançar"));

  // Step 3: Fill pet data
  fillPetForm();
  fireEvent.click(screen.getByText("Avançar"));
}

describe("PlanPurchaseFlow Integration", () => {
  /**
   * Test 1: Full flow - plan selection → tutor → pet → summary → success
   * Validates: Requirements 1.3, 5.5, 5.6
   */
  it("should complete the full purchase flow from plan selection to success screen", () => {
    render(<PlanPurchaseFlow />);

    // Step 1: Select plan and advance
    fireEvent.click(screen.getByText("Plus"));
    fireEvent.click(screen.getByText("Avançar"));

    // Step 2: Fill tutor data and advance
    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    fillTutorForm();
    fireEvent.click(screen.getByText("Avançar"));

    // Step 3: Fill pet data and advance
    expect(screen.getByLabelText(/nome do pet/i)).toBeInTheDocument();
    fillPetForm();
    fireEvent.click(screen.getByText("Avançar"));

    // Step 4: Verify summary shows data
    expect(screen.getByText("Plus")).toBeInTheDocument();
    expect(screen.getByText(TUTOR_DATA.fullName)).toBeInTheDocument();

    // Accept terms and contract
    fireEvent.click(screen.getByLabelText(/termos e condições/i));
    fireEvent.click(screen.getByText("Contratar"));

    // Verify success screen
    expect(
      screen.getByText("Contratação realizada com sucesso!")
    ).toBeInTheDocument();
  });

  /**
   * Test 2: Back button hidden on step 1
   * Validates: Requirements 1.5
   */
  it("should NOT display the back button on step 1", () => {
    render(<PlanPurchaseFlow />);

    expect(screen.queryByText("Voltar")).not.toBeInTheDocument();
  });

  /**
   * Test 3: Contratar button is disabled without terms accepted
   * Validates: Requirements 5.5
   */
  it("should disable the Contratar button when terms are not accepted", () => {
    render(<PlanPurchaseFlow />);

    navigateToSummary();

    // Now on step 4 - verify Contratar button is disabled
    const contractButton = screen.getByText("Contratar");
    expect(contractButton).toBeDisabled();
  });

  /**
   * Test 4: Data preserved on navigation (back and forth)
   * Validates: Requirements 1.4
   */
  it("should preserve tutor data when navigating back from step 3 to step 2", () => {
    render(<PlanPurchaseFlow />);

    // Step 1: Select plan
    fireEvent.click(screen.getByText("Plus"));
    fireEvent.click(screen.getByText("Avançar"));

    // Step 2: Fill tutor data
    fillTutorForm();
    fireEvent.click(screen.getByText("Avançar"));

    // Step 3: Go back to step 2
    fireEvent.click(screen.getByText("Voltar"));

    // Verify tutor data is still present
    expect(screen.getByLabelText(/nome completo/i)).toHaveValue(TUTOR_DATA.fullName);
    expect(screen.getByLabelText(/cpf/i)).toHaveValue(applyCpfMask(TUTOR_DATA.cpf));
    expect(screen.getByLabelText(/email/i)).toHaveValue(TUTOR_DATA.email);
    expect(screen.getByLabelText(/telefone/i)).toHaveValue(applyPhoneMask(TUTOR_DATA.phone));
  });

  /**
   * Property 10: Summary displays all entered data unchanged
   * After filling valid data and reaching step 4, verify every field value
   * is displayed in the summary.
   * Validates: Requirements 1.5, 5.2, 5.3, 5.5
   */
  it("should display all entered data unchanged in the summary step", () => {
    render(<PlanPurchaseFlow />);

    navigateToSummary();

    // Verify plan data
    expect(screen.getByText("Plus")).toBeInTheDocument();
    expect(screen.getByText("R$ 89,90/mês")).toBeInTheDocument();

    // Verify tutor data
    expect(screen.getByText(TUTOR_DATA.fullName)).toBeInTheDocument();
    expect(screen.getByText(applyCpfMask(TUTOR_DATA.cpf))).toBeInTheDocument();
    expect(screen.getByText(TUTOR_DATA.email)).toBeInTheDocument();
    expect(screen.getByText(applyPhoneMask(TUTOR_DATA.phone))).toBeInTheDocument();

    // Verify pet data
    expect(screen.getByText(PET_DATA.name)).toBeInTheDocument();
    expect(screen.getByText("Cão")).toBeInTheDocument();
    expect(screen.getByText(PET_DATA.breed)).toBeInTheDocument();
    expect(screen.getByText(PET_DATA.birthDate)).toBeInTheDocument();
    expect(screen.getByText(`${PET_DATA.weight}kg`)).toBeInTheDocument();
  });
});
