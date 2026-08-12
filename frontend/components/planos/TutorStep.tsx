import { applyCpfMask, applyPhoneMask, unmask } from "./masks";
import { TutorData, PurchaseAction } from "./purchaseReducer";

interface TutorStepProps {
  tutorData: TutorData;
  errors?: Partial<Record<keyof TutorData, string>>;
  dispatch: React.Dispatch<PurchaseAction>;
}

export default function TutorStep({ tutorData, errors, dispatch }: TutorStepProps) {
  const baseInputClasses = "w-full rounded-lg border px-3 py-2";
  const normalClasses = "border-gray-200 focus:ring-primary-500 focus:ring-2 focus:ring-offset-2";
  const errorClasses = "border-red-500 focus:ring-red-500 focus:ring-2 focus:ring-offset-2";

  function getInputClasses(field: keyof TutorData) {
    return `${baseInputClasses} ${errors?.[field] ? errorClasses : normalClasses}`;
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
          Nome completo <span className="text-red-500">*</span>
        </label>
        <input
          id="fullName"
          type="text"
          required
          className={getInputClasses("fullName")}
          value={tutorData.fullName}
          onChange={(e) =>
            dispatch({ type: "SET_TUTOR_FIELD", field: "fullName", value: e.target.value })
          }
        />
        {errors?.fullName && (
          <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
        )}
      </div>

      <div>
        <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">
          CPF <span className="text-red-500">*</span>
        </label>
        <input
          id="cpf"
          type="text"
          required
          className={getInputClasses("cpf")}
          value={applyCpfMask(tutorData.cpf)}
          onChange={(e) =>
            dispatch({ type: "SET_TUTOR_FIELD", field: "cpf", value: unmask(e.target.value) })
          }
        />
        {errors?.cpf && (
          <p className="text-red-500 text-sm mt-1">{errors.cpf}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          required
          className={getInputClasses("email")}
          value={tutorData.email}
          onChange={(e) =>
            dispatch({ type: "SET_TUTOR_FIELD", field: "email", value: e.target.value })
          }
        />
        {errors?.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Telefone <span className="text-red-500">*</span>
        </label>
        <input
          id="phone"
          type="tel"
          required
          className={getInputClasses("phone")}
          value={applyPhoneMask(tutorData.phone)}
          onChange={(e) =>
            dispatch({ type: "SET_TUTOR_FIELD", field: "phone", value: unmask(e.target.value) })
          }
        />
        {errors?.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
        )}
      </div>
    </div>
  );
}
