"use client";

interface NavigationBarProps {
  currentStep: number;
  termsAccepted?: boolean;
  onBack: () => void;
  onNext: () => void;
}

export default function NavigationBar({
  currentStep,
  termsAccepted,
  onBack,
  onNext,
}: NavigationBarProps) {
  const showBackButton = currentStep > 1;
  const isLastStep = currentStep === 4;
  const nextLabel = isLastStep ? "Contratar" : "Avançar";
  const isNextDisabled = isLastStep && termsAccepted === false;

  return (
    <div
      className={`flex mt-8 ${showBackButton ? "justify-between" : "justify-end"}`}
    >
      {showBackButton && (
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 rounded-lg font-medium border border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Voltar
        </button>
      )}

      <button
        type="button"
        onClick={onNext}
        disabled={isNextDisabled}
        className={`px-6 py-2 rounded-lg font-medium focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
          isNextDisabled
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-primary-500 text-white hover:bg-primary-600"
        }`}
      >
        {nextLabel}
      </button>
    </div>
  );
}
