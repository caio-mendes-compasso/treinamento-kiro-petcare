"use client";

import { plans } from "@/mocks/plans";
import { PurchaseAction } from "./purchaseReducer";

interface PlanStepProps {
  selectedPlanId: string | null;
  error?: string;
  dispatch: React.Dispatch<PurchaseAction>;
}

export default function PlanStep({ selectedPlanId, error, dispatch }: PlanStepProps) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {plans.map((plan) => {
          const isSelected = selectedPlanId === plan.id;

          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => dispatch({ type: "SELECT_PLAN", planId: plan.id })}
              className={`bg-white rounded-lg shadow-sm p-4 md:p-6 cursor-pointer text-left transition-colors ${
                isSelected
                  ? "border-2 border-primary-500"
                  : "border border-gray-200"
              }`}
            >
              <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
              <p className="text-primary-500 font-semibold mt-1">{plan.priceLabel}</p>
              <ul className="mt-3 space-y-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="text-sm text-gray-700">
                    • {feature}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}
