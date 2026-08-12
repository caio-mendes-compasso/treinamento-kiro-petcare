import { z } from "zod";

export const petFormSchema = z.object({
  name: z
    .string()
    .min(1, "Nome do pet é obrigatório")
    .max(50, "Nome deve ter no máximo 50 caracteres"),
  species: z.enum(["cao", "gato", "outro"], {
    errorMap: () => ({ message: "Selecione a espécie" }),
  }),
  breed: z.string().min(1, "Raça é obrigatória"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  weight: z
    .string()
    .min(1, "Peso é obrigatório")
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      },
      { message: "Peso deve ser um número positivo" }
    ),
  color: z.string().min(1, "Cor/pelagem é obrigatória"),
});

export type PetFormData = z.infer<typeof petFormSchema>;
