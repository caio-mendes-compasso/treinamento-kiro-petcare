import Link from "next/link";

export default function HeroBanner() {
  return (
    <section className="w-full bg-primary-50 py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h1 className="text-3xl font-semibold text-gray-900 md:text-5xl">
          Cuidado completo para quem você ama
        </h1>
        <p className="mt-4 text-lg text-gray-700 md:text-xl">
          Planos a partir de R$ 49,90/mês
        </p>
        <Link
          href="/planos"
          className="mt-8 inline-block rounded-lg bg-primary-500 px-6 py-3 text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Conheça nossos planos
        </Link>
      </div>
    </section>
  );
}
