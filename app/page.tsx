export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <main className="flex flex-1 w-full max-w-4xl flex-col items-center justify-center px-4 py-16">
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-4xl font-bold text-primary">
            Pet Care
          </h1>
          <p className="max-w-md text-lg text-gray-500">
            Cuidando do seu pet com carinho. Gerencie consultas, vacinas e muito
            mais em um só lugar.
          </p>
          <a
            href="#"
            className="bg-primary text-white rounded-lg px-6 py-3 font-semibold hover:bg-primary-dark transition-colors"
          >
            Começar
          </a>
        </div>
      </main>
    </div>
  );
}
