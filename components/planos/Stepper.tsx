"use client";

interface StepperProps {
  currentStep: number; // 1-4
}

const steps = [
  "Escolha do Plano",
  "Dados do Tutor",
  "Dados do Pet",
  "Resumo",
];

function CheckIcon() {
  return (
    <svg
      className="w-4 h-4 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

export default function Stepper({ currentStep }: StepperProps) {
  return (
    <nav aria-label="Progresso do cadastro" className="mb-8">
      <ol className="flex items-center justify-between md:justify-center md:gap-8">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <li key={label} className="flex flex-col items-center gap-2 flex-1 md:flex-none">
              {/* Connector line (not for first step) */}
              <div className="flex items-center w-full md:w-auto">
                {index > 0 && (
                  <div
                    className={`hidden md:block w-12 h-0.5 ${
                      stepNumber <= currentStep ? "bg-primary-500" : "bg-gray-200"
                    }`}
                    aria-hidden="true"
                  />
                )}
                {/* Step indicator */}
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${
                    isCompleted
                      ? "bg-primary-500"
                      : isActive
                      ? "bg-primary-500"
                      : "bg-gray-200"
                  }`}
                  aria-current={isActive ? "step" : undefined}
                >
                  {isCompleted ? (
                    <CheckIcon />
                  ) : (
                    <span
                      className={`text-sm font-medium ${
                        isActive ? "text-white" : "text-gray-500"
                      }`}
                    >
                      {stepNumber}
                    </span>
                  )}
                </div>
              </div>
              {/* Label */}
              <span
                className={`text-xs md:text-sm text-center leading-tight ${
                  isCompleted
                    ? "text-primary-500"
                    : isActive
                    ? "text-primary-500 font-semibold"
                    : "text-gray-400"
                }`}
              >
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">
                  {stepNumber === 1 && "Plano"}
                  {stepNumber === 2 && "Tutor"}
                  {stepNumber === 3 && "Pet"}
                  {stepNumber === 4 && "Resumo"}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
