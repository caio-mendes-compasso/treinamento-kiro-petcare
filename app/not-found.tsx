import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-lg text-gray-800 mb-8">
        Página não encontrada
      </p>
      <Link
        href="/"
        className="bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-dark"
      >
        Voltar à Home
      </Link>
    </div>
  );
}
