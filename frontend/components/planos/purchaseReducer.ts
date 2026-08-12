// State interfaces

export interface TutorData {
  fullName: string;
  cpf: string; // raw digits, e.g. "12345678901"
  email: string;
  phone: string; // raw digits, e.g. "11999998888"
}

export interface PetData {
  name: string;
  species: "" | "cao" | "gato";
  breed: string;
  birthDate: string; // ISO date string "YYYY-MM-DD"
  weight: string; // string to handle input, parsed as number for validation
}

export interface StepErrors {
  plan?: string;
  tutor?: Partial<Record<keyof TutorData, string>>;
  pet?: Partial<Record<keyof PetData, string>>;
}

export interface PurchaseState {
  currentStep: 1 | 2 | 3 | 4;
  completed: boolean;
  selectedPlanId: string | null;
  tutorData: TutorData;
  petData: PetData;
  termsAccepted: boolean;
  errors: StepErrors;
}

// Action types

export type PurchaseAction =
  | { type: "SELECT_PLAN"; planId: string }
  | { type: "SET_TUTOR_FIELD"; field: keyof TutorData; value: string }
  | { type: "SET_PET_FIELD"; field: keyof PetData; value: string }
  | { type: "SET_SPECIES"; species: "" | "cao" | "gato" }
  | { type: "TOGGLE_TERMS" }
  | { type: "NEXT_STEP" }
  | { type: "BACK" }
  | { type: "SET_ERRORS"; errors: StepErrors }
  | { type: "COMPLETE" };

// Initial state

export const initialState: PurchaseState = {
  currentStep: 1,
  completed: false,
  selectedPlanId: null,
  tutorData: { fullName: "", cpf: "", email: "", phone: "" },
  petData: { name: "", species: "", breed: "", birthDate: "", weight: "" },
  termsAccepted: false,
  errors: {},
};

// Reducer

export function purchaseReducer(
  state: PurchaseState,
  action: PurchaseAction
): PurchaseState {
  switch (action.type) {
    case "SELECT_PLAN":
      return {
        ...state,
        selectedPlanId: action.planId,
        errors: { ...state.errors, plan: undefined },
      };

    case "SET_TUTOR_FIELD":
      return {
        ...state,
        tutorData: { ...state.tutorData, [action.field]: action.value },
        errors: {
          ...state.errors,
          tutor: { ...state.errors.tutor, [action.field]: undefined },
        },
      };

    case "SET_PET_FIELD":
      return {
        ...state,
        petData: { ...state.petData, [action.field]: action.value },
        errors: {
          ...state.errors,
          pet: { ...state.errors.pet, [action.field]: undefined },
        },
      };

    case "SET_SPECIES":
      return {
        ...state,
        petData: { ...state.petData, species: action.species, breed: "" },
        errors: {
          ...state.errors,
          pet: { ...state.errors.pet, species: undefined, breed: undefined },
        },
      };

    case "TOGGLE_TERMS":
      return { ...state, termsAccepted: !state.termsAccepted };

    case "NEXT_STEP":
      if (state.currentStep < 4) {
        return {
          ...state,
          currentStep: (state.currentStep + 1) as 1 | 2 | 3 | 4,
          errors: {},
        };
      }
      return state;

    case "BACK":
      if (state.currentStep > 1) {
        return {
          ...state,
          currentStep: (state.currentStep - 1) as 1 | 2 | 3 | 4,
          errors: {},
        };
      }
      return state;

    case "SET_ERRORS":
      return { ...state, errors: action.errors };

    case "COMPLETE":
      return { ...state, completed: true };

    default:
      return state;
  }
}
