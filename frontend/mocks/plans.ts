export interface Plan {
  id: string;
  name: string;         // max 50 chars
  price: number;        // valor numérico (e.g. 49.90)
  priceLabel: string;   // formatado (e.g. "R$ 49,90/mês")
  features: string[];   // 1-10 items
  highlighted: boolean; // exatamente 1 plan com true
}

export const plans: Plan[] = [
  {
    id: "basico",
    name: "Básico",
    price: 49.90,
    priceLabel: "R$ 49,90/mês",
    features: ["Consultas", "Vacinas"],
    highlighted: false,
  },
  {
    id: "plus",
    name: "Plus",
    price: 89.90,
    priceLabel: "R$ 89,90/mês",
    features: ["Consultas", "Vacinas", "Exames", "Emergência"],
    highlighted: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 149.90,
    priceLabel: "R$ 149,90/mês",
    features: ["Consultas", "Vacinas", "Exames", "Emergência", "Cirurgias", "Internação"],
    highlighted: false,
  },
];
