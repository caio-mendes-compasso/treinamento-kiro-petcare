"use client";

interface PlanCardFrontProps {
  planName: string;
  planColor: string;
  userName: string;
  petName: string;
  planNumber: string;   // PC-2025-XXXXXX
  validUntil: string;   // Data de validade
}

export default function PlanCardFront({
  planName,
  planColor,
  userName,
  petName,
  planNumber,
  validUntil,
}: PlanCardFrontProps) {
  return (
    <div
      className="w-full rounded-xl shadow-lg overflow-hidden"
      style={{ aspectRatio: "1.6" }}
      aria-label="Frente da carteirinha do plano"
      role="region"
    >
      {/* Gradient background */}
      <div className="relative w-full h-full bg-gradient-to-br from-white via-white to-primary-50 p-5 md:p-6 flex flex-col justify-between">
        {/* Header: Logo + Plan name */}
        <div className="flex items-center justify-between">
          <span className="text-primary-500 font-bold text-xl md:text-2xl tracking-tight">
            Pet Care
          </span>
          <span
            className="font-semibold text-sm md:text-base px-3 py-1 rounded-full"
            style={{ color: planColor, backgroundColor: `${planColor}15` }}
          >
            {planName}
          </span>
        </div>

        {/* Card body: Tutor and Pet info */}
        <div className="flex-1 flex flex-col justify-center gap-2 mt-3">
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wide">Titular</p>
            <p className="text-gray-900 font-semibold text-sm md:text-base truncate">
              {userName}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wide">Pet</p>
            <p className="text-gray-900 font-semibold text-sm md:text-base truncate">
              {petName}
            </p>
          </div>
        </div>

        {/* Footer: Plan number and validity */}
        <div className="flex items-end justify-between mt-3">
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wide">Nº do Plano</p>
            <p className="text-gray-900 font-mono text-xs md:text-sm">
              {planNumber}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-xs uppercase tracking-wide">Validade</p>
            <p className="text-gray-900 font-mono text-xs md:text-sm">
              {validUntil}
            </p>
          </div>
        </div>

        {/* Decorative accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ backgroundColor: planColor }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
