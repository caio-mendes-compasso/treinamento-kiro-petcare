import Link from "next/link";
import type { ContactInfo, FooterLink } from "@/types/navigation";

const contactInfo: ContactInfo = {
  email: "contato@petcare.com.br",
  phone: "(41) 3000-1234",
  address: "Rua das Flores, 123 - Curitiba, PR",
};

const footerLinks: FooterLink[] = [
  { label: "Home", href: "/" },
  { label: "Planos", href: "/planos" },
  { label: "Login", href: "/login" },
  { label: "Política de Privacidade", href: "/privacidade" },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-white px-4 py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Pet Care</h3>
          <p className="text-sm">
            Cuidando do seu pet com amor e dedicação.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Contato</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href={`mailto:${contactInfo.email}`}
                className="rounded px-1 -mx-1 hover:bg-primary-dark transition-colors"
              >
                {contactInfo.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${contactInfo.phone.replace(/\D/g, "")}`}
                className="rounded px-1 -mx-1 hover:bg-primary-dark transition-colors"
              >
                {contactInfo.phone}
              </a>
            </li>
            <li>{contactInfo.address}</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Links Úteis</h3>
          <ul className="space-y-2 text-sm">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded px-1 -mx-1 hover:bg-primary-dark transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
