import { plans } from "@/mocks/plans";
import { applyCpfMask, applyPhoneMask } from "./masks";
import { TutorData, PetData, PurchaseAction } from "./purchaseReducer";

interface SummaryStepProps {
  selectedPlanId: string | null;
  tutorData: TutorData;
  petData: PetData;
  termsAccepted: boolean;
  dispatch: React.Dispatch<PurchaseAction>;
}

export default function SummaryStep({
  selectedPlanId,
  tutorData,
  petData,
  termsAccepted,
  dispatch,
}: SummaryStepProps) {
  const selectedPlan = plans.find((p) => p.id === selectedPlanId);

  const speciesLabel = petData.species === "cao" ? "Cão" : petData.species === "gato" ? "Gato" : "";

  return (
    <div className="space-y-6">
      {/* Plano Selecionado */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
        <h3 className="text-gray-900 font-semibold text-lg mb-3">Plano Selecionado</h3>
        {selectedPlan && (
          <div className="space-y-1">
            <p className="text-gray-700">
              <span className="font-medium">Plano:</span> {selectedPlan.name}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Valor:</span> {selectedPlan.priceLabel}
            </p>
          </div>
        )}
      </section>

      {/* Dados do Tutor */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
        <h3 className="text-gray-900 font-semibold text-lg mb-3">Dados do Tutor</h3>
        <div className="space-y-1">
          <p className="text-gray-700">
            <span className="font-medium">Nome:</span> {tutorData.fullName}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">CPF:</span> {applyCpfMask(tutorData.cpf)}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Email:</span> {tutorData.email}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Telefone:</span> {applyPhoneMask(tutorData.phone)}
          </p>
        </div>
      </section>

      {/* Dados do Pet */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
        <h3 className="text-gray-900 font-semibold text-lg mb-3">Dados do Pet</h3>
        <div className="space-y-1">
          <p className="text-gray-700">
            <span className="font-medium">Nome:</span> {petData.name}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Espécie:</span> {speciesLabel}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Raça:</span> {petData.breed}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Data de Nascimento:</span> {petData.birthDate}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Peso:</span> {petData.weight}kg
          </p>
        </div>
      </section>

      {/* Termos e Condições */}
      <div className="flex items-start gap-3">
        <input
          id="terms"
          type="checkbox"
          checked={termsAccepted}
          onChange={() => dispatch({ type: "TOGGLE_TERMS" })}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        />
        <label htmlFor="terms" className="text-sm text-gray-700">
          Li e aceito os termos e condições de uso do serviço.
        </label>
      </div>
    </div>
  );
}
