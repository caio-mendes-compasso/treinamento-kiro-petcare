export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  text: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Maria Silva",
    avatar: "/avatars/maria.png",
    text: "O Pet Care salvou a vida do meu cachorro! Atendimento rápido e veterinários muito competentes.",
  },
  {
    id: "2",
    name: "João Santos",
    avatar: "/avatars/joao.png",
    text: "Melhor investimento que fiz pro meu gato. As consultas ilimitadas fazem toda a diferença.",
  },
  {
    id: "3",
    name: "Ana Oliveira",
    avatar: "/avatars/ana.png",
    text: "Recomendo para todos os donos de pets! O app de acompanhamento é muito prático.",
  },
];
