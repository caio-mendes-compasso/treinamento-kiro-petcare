import Link from "next/link";

export default function CTASection() {
  return (
    <section className="bg-primary-500 text-white py-16 md:py-24 px-4 md:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4">
          Seu pet merece o melhor
        </h2>
        <p className="text-lg md:text-xl mb-8">
          Escolha o plano ideal e garanta saúde e bem-estar para seu melhor amigo
        </p>
        <Link
          href="/planos"
          className="inline-block bg-white text-primary-500 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-500 transition-colors"
        >
          Contratar agora
        </Link>
      </div>
    </section>
  );
}
