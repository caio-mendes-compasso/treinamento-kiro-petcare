import Link from "next/link";
import { plans, Plan } from "@/mocks/plans";

interface PlanCardProps {
  plan: Plan;
}

function PlanCard({ plan }: PlanCardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-6 flex flex-col relative ${
        plan.highlighted
          ? "border-2 border-primary-500"
          : "border border-gray-200"
      }`}
    >
      {plan.highlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
          Mais popular
        </span>
      )}

      <h3 className="text-gray-900 font-semibold text-xl mb-2">{plan.name}</h3>
      <p className="text-2xl font-bold text-gray-900 mb-4">{plan.priceLabel}</p>

      <ul className="flex-1 space-y-2 mb-6">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2 text-gray-700">
            <svg
              className="w-5 h-5 text-primary-500 flex-shrink-0"
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
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href="/planos"
        className="block text-center bg-primary-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
      >
        Contratar
      </Link>
    </div>
  );
}

export default function PlansComparison() {
  return (
    <section className="py-12 md:py-16 px-4 md:px-6 lg:px-8">
      <h2 className="text-2xl md:text-3xl text-gray-900 font-semibold text-center mb-8">
        Nossos Planos
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </section>
  );
}
