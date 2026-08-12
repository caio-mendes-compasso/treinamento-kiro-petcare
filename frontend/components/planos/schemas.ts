import { z } from "zod";

// Step 1 — Plan Selection
export const planSelectionSchema = z.object({
  selectedPlanId: z.string().min(1, "Selecione um plano"),
});

// Step 2 — Tutor Data
export const tutorSchema = z.object({
  fullName: z.string().min(3, "Nome deve ter no mínimo 3 caracteres").max(100),
  cpf: z.string().regex(/^\d{11}$/, "CPF deve conter 11 dígitos numéricos"),
  email: z.string().email("Email inválido"),
  phone: z.string().regex(/^\d{11}$/, "Telefone deve conter 11 dígitos numéricos"),
});

// Step 3 — Pet Data
export const petSchema = z.object({
  name: z.string().min(1, "Nome do pet é obrigatório").max(50),
  species: z.enum(["cao", "gato"], { errorMap: () => ({ message: "Selecione a espécie" }) }),
  breed: z.string().min(1, "Selecione a raça"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  weight: z.string().regex(/^\d+(\.\d{1,2})?$/, "Peso inválido"),
});

export type TutorData = z.infer<typeof tutorSchema>;
export type PetData = z.infer<typeof petSchema>;
