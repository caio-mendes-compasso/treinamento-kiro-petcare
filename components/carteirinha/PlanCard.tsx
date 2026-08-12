"use client";

import { useState } from "react";
import { Pet } from "@/types/pets";
import { Plan } from "@/mocks/plans";
import { planColors } from "@/types/financeiro";
import { generatePlanNumber } from "@/components/financeiro/invoiceUtils";
import PlanCardFront from "./PlanCardFront";
import PlanCardBack from "./PlanCardBack";

interface PlanCardProps {
  pet: Pet;
  plan: Plan;
  userName: string;
}

export default function PlanCard({ pet, plan, userName }: PlanCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const planNumber = generatePlanNumber(pet.id);
  const planColor = planColors[plan.id] || planColors["basico"];

  // Compute validity: subscription start + 1 year
  const validUntil = (() => {
    const start = new Date("2025-01-01");
    start.setFullYear(start.getFullYear() + 1);
    return start.toLocaleDateString("pt-BR");
  })();

  const handleClick = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleMouseEnter = () => {
    setIsFlipped(true);
  };

  const handleMouseLeave = () => {
    setIsFlipped(false);
  };

  return (
    <div
      className="w-full max-w-md mx-auto cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={0}
      aria-label={`Carteirinha do pet ${pet.name}. Clique para ${isFlipped ? "ver a frente" : "ver o verso"}.`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div
        className="relative w-full transition-transform duration-[600ms]"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          aspectRatio: "1.6",
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: "hidden" }}
        >
          <PlanCardFront
            planName={plan.name}
            planColor={planColor}
            userName={userName}
            petName={pet.name}
            planNumber={planNumber}
            validUntil={validUntil}
          />
        </div>

        {/* Back */}
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <PlanCardBack pet={pet} />
        </div>
      </div>
    </div>
  );
}
