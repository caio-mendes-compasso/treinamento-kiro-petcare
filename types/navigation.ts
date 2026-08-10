export interface NavigationItem {
  label: string;
  href: string;
  isButton?: boolean;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export const PUBLIC_NAV: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Planos", href: "/planos" },
  { label: "Login", href: "/login", isButton: true },
];

export const AUTH_NAV: NavigationItem[] = [
  { label: "Meus Pets", href: "/pets" },
  { label: "Agenda", href: "/agenda" },
  { label: "Financeiro", href: "/financeiro" },
  { label: "Carteirinha", href: "/carteirinha" },
];

export const PROTECTED_ROUTES = ["/pets", "/agenda", "/financeiro", "/carteirinha"];
