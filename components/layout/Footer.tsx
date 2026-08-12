export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          {/* Contato */}
          <div>
            <h3 className="text-white font-semibold mb-3">Contato</h3>
            <p className="mb-1">(16) 5555-3553</p>
            <p>contato@petcare.com</p>
          </div>

          {/* Links Institucionais */}
          <div>
            <h3 className="text-white font-semibold mb-3">Institucional</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
                >
                  Termos de Uso
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
                >
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded"
                >
                  Fale Conosco
                </a>
              </li>
            </ul>
          </div>

          {/* Copyright */}
          <div className="md:text-right">
            <p className="text-sm">© 2025 Pet Care</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
