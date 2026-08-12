"use client";

import { TimeSlot } from "@/types/agenda";

export type SlotState = "available" | "blocked" | "occupied" | "selected";

interface SlotButtonProps {
  slot: TimeSlot;
  state: SlotState;
  onClick: () => void;
}

const stateStyles: Record<SlotState, string> = {
  available:
    "border border-gray-200 hover:border-primary-500 text-gray-700 bg-white",
  blocked:
    "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-100",
  occupied:
    "bg-red-50 text-red-400 cursor-not-allowed border border-red-50",
  selected:
    "bg-primary-500 text-white border border-primary-500",
};

const stateLabels: Partial<Record<SlotState, string>> = {
  blocked: "Bloqueado",
  occupied: "Ocupado",
};

export default function SlotButton({ slot, state, onClick }: SlotButtonProps) {
  const isDisabled = state === "blocked" || state === "occupied";

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={!isDisabled ? onClick : undefined}
      className={`
        flex flex-col items-center justify-center
        rounded-lg px-3 py-2 text-sm font-medium
        transition-colors
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        ${stateStyles[state]}
      `}
    >
      <span>{slot}</span>
      {stateLabels[state] && (
        <span className="text-xs mt-0.5">{stateLabels[state]}</span>
      )}
    </button>
  );
}
