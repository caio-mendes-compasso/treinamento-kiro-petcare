export default function SuccessScreen() {
  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8 py-16 text-center">
      <div className="flex flex-col items-center gap-6">
        {/* Success icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-emerald-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold text-gray-900">
          Contratação realizada com sucesso!
        </h1>

        <p className="text-gray-500 max-w-md">
          Seu plano de saúde pet foi contratado. Em breve você receberá mais
          informações sobre a cobertura e os próximos passos.
        </p>
      </div>
    </div>
  );
}
