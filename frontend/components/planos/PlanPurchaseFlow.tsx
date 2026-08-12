"use client";

import { useReducer } from "react";
import { z } from "zod";
import {
  purchaseReducer,
  initialState,
  PurchaseState,
  PurchaseAction,
  StepErrors,
} from "./purchaseReducer";
import { planSelectionSchema, tutorSchema, petSchema } from "./schemas";
import Stepper from "./Stepper";
import PlanStep from "./PlanStep";
import TutorStep from "./TutorStep";
import PetStep from "./PetStep";
import SummaryStep from "./SummaryStep";
import SuccessScreen from "./SuccessScreen";
import NavigationBar from "./NavigationBar";

function validateCurrentStep(
  state: PurchaseState
): z.SafeParseReturnType<unknown, unknown> {
  switch (state.currentStep) {
    case 1:
      return planSelectionSchema.safeParse({
        selectedPlanId: state.selectedPlanId ?? "",
      });
    case 2:
      return tutorSchema.safeParse(state.tutorData);
    case 3:
      return petSchema.safeParse(state.petData);
    case 4:
      return { success: true, data: state } as z.SafeParseReturnType<
        unknown,
        unknown
      >;
  }
}

function mapZodErrors(error: z.ZodError, step: number): StepErrors {
  const errors: StepErrors = {};

  switch (step) {
    case 1: {
      const planError = error.errors.find(
        (e) => e.path[0] === "selectedPlanId"
      );
      if (planError) {
        errors.plan = planError.message;
      }
      break;
    }
    case 2: {
      const tutorErrors: Partial<
        Record<"fullName" | "cpf" | "email" | "phone", string>
      > = {};
      for (const err of error.errors) {
        const field = err.path[0] as keyof typeof tutorErrors;
        if (field) {
          tutorErrors[field] = err.message;
        }
      }
      if (Object.keys(tutorErrors).length > 0) {
        errors.tutor = tutorErrors;
      }
      break;
    }
    case 3: {
      const petErrors: Partial<
        Record<"name" | "species" | "breed" | "birthDate" | "weight", string>
      > = {};
      for (const err of error.errors) {
        const field = err.path[0] as keyof typeof petErrors;
        if (field) {
          petErrors[field] = err.message;
        }
      }
      if (Object.keys(petErrors).length > 0) {
        errors.pet = petErrors;
      }
      break;
    }
  }

  return errors;
}

function handleNext(
  state: PurchaseState,
  dispatch: React.Dispatch<PurchaseAction>
): void {
  const result = validateCurrentStep(state);

  if (!result.success) {
    const zodResult = result as z.SafeParseError<unknown>;
    dispatch({
      type: "SET_ERRORS",
      errors: mapZodErrors(zodResult.error, state.currentStep),
    });
    return;
  }

  if (state.currentStep === 4) {
    if (!state.termsAccepted) return;
    dispatch({ type: "COMPLETE" });
  } else {
    dispatch({ type: "NEXT_STEP" });
  }
}

export default function PlanPurchaseFlow() {
  const [state, dispatch] = useReducer(purchaseReducer, initialState);

  if (state.completed) {
    return <SuccessScreen />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      <Stepper currentStep={state.currentStep} />

      {state.currentStep === 1 && (
        <PlanStep
          selectedPlanId={state.selectedPlanId}
          error={state.errors.plan}
          dispatch={dispatch}
        />
      )}
      {state.currentStep === 2 && (
        <TutorStep
          tutorData={state.tutorData}
          errors={state.errors.tutor}
          dispatch={dispatch}
        />
      )}
      {state.currentStep === 3 && (
        <PetStep
          petData={state.petData}
          errors={state.errors.pet}
          dispatch={dispatch}
        />
      )}
      {state.currentStep === 4 && (
        <SummaryStep
          selectedPlanId={state.selectedPlanId}
          tutorData={state.tutorData}
          petData={state.petData}
          termsAccepted={state.termsAccepted}
          dispatch={dispatch}
        />
      )}

      <NavigationBar
        currentStep={state.currentStep}
        termsAccepted={state.termsAccepted}
        onBack={() => dispatch({ type: "BACK" })}
        onNext={() => handleNext(state, dispatch)}
      />
    </div>
  );
}
