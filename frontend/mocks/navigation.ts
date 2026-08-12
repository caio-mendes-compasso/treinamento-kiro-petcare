import { NavigationConfig } from "@/types/navigation";

export const navigationItems: NavigationConfig = [
  { label: "Home", href: "/", visibility: "public", type: "link" },
  { label: "Planos", href: "/planos", visibility: "public", type: "link" },
  { label: "Login", href: "/login", visibility: "public", type: "link" },
  { label: "Meus Pets", href: "/pets", visibility: "authenticated", type: "link" },
  { label: "Agenda", href: "/agenda", visibility: "authenticated", type: "link" },
  { label: "Financeiro", href: "/financeiro", visibility: "authenticated", type: "link" },
  { label: "Carteirinha", href: "/carteirinha", visibility: "authenticated", type: "link" },
  { label: "Logout", href: "#", visibility: "authenticated", type: "button" },
];
