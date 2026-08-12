interface BenefitItem {
  icon: string;
  title: string;
  description: string;
}

const benefits: BenefitItem[] = [
  { icon: "🏥", title: "Consultas ilimitadas", description: "Sem limite de consultas para seu pet" },
  { icon: "🌐", title: "Rede credenciada", description: "Mais de 500 clínicas parceiras" },
  { icon: "🚨", title: "Emergência 24h", description: "Atendimento de urgência a qualquer hora" },
  { icon: "📱", title: "App de acompanhamento", description: "Acompanhe tudo pelo portal" },
];

export default function BenefitsSection() {
  return (
    <section className="py-12 md:py-16 px-4 md:px-6 lg:px-8">
      <h2 className="text-2xl md:text-3xl text-gray-900 font-semibold text-center mb-8">
        Por que escolher o Pet Care?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
        {benefits.map((benefit) => (
          <div
            key={benefit.title}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center text-center"
          >
            <span className="text-4xl mb-4" role="img" aria-label={benefit.title}>
              {benefit.icon}
            </span>
            <h3 className="text-gray-900 font-semibold text-lg mb-2">
              {benefit.title}
            </h3>
            <p className="text-gray-700">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
