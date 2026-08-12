# Design Document: Pet Registration & Listing

## Architecture Overview

A funcionalidade de cadastro e listagem de pets segue a arquitetura existente do projeto: uma página client-side (`"use client"`) com estado local via `useState`, componentes reutilizáveis por feature, e dados mock para desenvolvimento. Não há backend; toda persistência é in-memory durante a sessão.

```
app/(protected)/pets/page.tsx          → PetsPage (orchestrator)
components/pets/PetCard.tsx            → Card visual de um pet
components/pets/PetForm.tsx            → Formulário expansível de cadastro
components/pets/PetGrid.tsx            → Grid responsivo de cards
components/pets/RemoveDialog.tsx       → Diálogo de confirmação de remoção
components/pets/BreedSelector.tsx      → Seletor dinâmico de raça
components/pets/PhotoUpload.tsx        → Upload e preview de foto
components/pets/petSchema.ts           → Schema Zod de validação
mocks/breeds.ts                        → Dados de raças (compartilhado)
mocks/pets.ts                          → Dados mock iniciais de pets
```

## Components

### PetsPage (`app/(protected)/pets/page.tsx`)

Componente orquestrador que gerencia o estado da listagem e do formulário.

```typescript
"use client";

import { useState } from "react";
import { Pet } from "@/types/pets";
import { initialPets } from "@/mocks/pets";
import PetGrid from "@/components/pets/PetGrid";
import PetForm from "@/components/pets/PetForm";
import RemoveDialog from "@/components/pets/RemoveDialog";

const MAX_PETS = 3;

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>(initialPets);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [petToRemove, setPetToRemove] = useState<Pet | null>(null);

  const canAddPet = pets.length < MAX_PETS;

  const handleAddPet = (newPet: Omit<Pet, "id">) => {
    const pet: Pet = { ...newPet, id: crypto.randomUUID() };
    setPets((prev) => [...prev, pet]);
    setIsFormOpen(false);
  };

  const handleConfirmRemove = () => {
    if (petToRemove) {
      setPets((prev) => prev.filter((p) => p.id !== petToRemove.id));
      setPetToRemove(null);
    }
  };

  // ... render
}
```

### PetCard (`components/pets/PetCard.tsx`)

Exibe informações resumidas de um pet com foto/placeholder e botão de remoção.

```typescript
interface PetCardProps {
  pet: Pet;
  onRemove: (pet: Pet) => void;
}
```

Regras de placeholder:
- Espécie "Cão" → 🐕
- Espécie "Gato" → 🐈
- Espécie "Outro" → 🐾

Visual: `bg-white rounded-lg shadow-sm border border-gray-200 p-4`

### PetGrid (`components/pets/PetGrid.tsx`)

Grid responsivo que distribui PetCards conforme breakpoints.

```typescript
interface PetGridProps {
  pets: Pet[];
  onRemovePet: (pet: Pet) => void;
}
```

Classes Tailwind: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6`

### PetForm (`components/pets/PetForm.tsx`)

Seção expansível inline com formulário completo de cadastro.

```typescript
interface PetFormProps {
  isOpen: boolean;
  onSubmit: (pet: Omit<Pet, "id">) => void;
  onCancel: () => void;
}
```

Campos: Nome, Espécie (select), Raça (dinâmico), Data de Nascimento, Peso (kg), Cor/Pelagem, Upload de Foto.

A expansão/colapso é controlada pelo pai via prop `isOpen` com transição CSS suave.

### BreedSelector (`components/pets/BreedSelector.tsx`)

Componente que alterna entre `<select>` e `<input type="text">` conforme a espécie.

```typescript
interface BreedSelectorProps {
  species: Species;
  value: string;
  onChange: (breed: string) => void;
  error?: string;
}
```

Lógica:
- `species === "cao"` ou `"gato"` → renderiza `<select>` com opções de `breedsBySpecies[species]`
- `species === "outro"` → renderiza `<input type="text">`
- Ao alterar espécie, o valor de raça é resetado para `""`

### PhotoUpload (`components/pets/PhotoUpload.tsx`)

Upload de foto com validação de tipo e tamanho, preview via FileReader.

```typescript
interface PhotoUploadProps {
  value: string | null; // base64 data URL ou null
  onChange: (dataUrl: string | null) => void;
  error?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
```

Validações:
- Tipo: `file.type.startsWith("image/")` — rejeita se não for imagem
- Tamanho: `file.size <= MAX_FILE_SIZE` — rejeita se > 5MB

### RemoveDialog (`components/pets/RemoveDialog.tsx`)

Diálogo modal de confirmação antes de remover um pet.

```typescript
interface RemoveDialogProps {
  pet: Pet | null;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
```

## Data Models

### Pet Interface

```typescript
// types/pets.ts
export type Species = "cao" | "gato" | "outro";

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed: string;
  birthDate: string; // ISO date string (YYYY-MM-DD)
  weight: number;
  color: string;
  photo: string | null; // base64 data URL ou null
}
```

### BreedsData (Migrado)

```typescript
// mocks/breeds.ts
export const breedsBySpecies: Record<Species, string[]> = {
  cao: ["Golden Retriever", "Labrador", "Bulldog", "Poodle", "SRD"],
  gato: ["Siamês", "Persa", "Maine Coon", "SRD"],
  outro: [], // texto livre
};
```

### Mock Data Inicial

```typescript
// mocks/pets.ts
import { Pet } from "@/types/pets";

export const initialPets: Pet[] = [
  {
    id: "mock-1",
    name: "Thor",
    species: "cao",
    breed: "Golden Retriever",
    birthDate: "2021-03-15",
    weight: 32,
    color: "Dourado",
    photo: null,
  },
  {
    id: "mock-2",
    name: "Luna",
    species: "gato",
    breed: "Siamês",
    birthDate: "2022-06-10",
    weight: 4.5,
    color: "Creme com pontas escuras",
    photo: null,
  },
];
```

## Validation Schema

```typescript
// components/pets/petSchema.ts
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
```

## File Validation

```typescript
// components/pets/fileValidation.ts
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validatePetPhoto(file: File): FileValidationResult {
  if (!file.type.startsWith("image/")) {
    return { valid: false, error: "Apenas imagens são aceitas" };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "Tamanho máximo permitido é 5MB" };
  }
  return { valid: true };
}
```

## State Management

O estado é gerenciado localmente no `PetsPage` com `useState`:

- `pets: Pet[]` — lista de pets (inicializada com mock data)
- `isFormOpen: boolean` — controla visibilidade do formulário
- `petToRemove: Pet | null` — pet selecionado para remoção (controla o dialog)

Não há Context nem estado global. As ações de estado são passadas via props para os componentes filhos.

### Fluxo de Dados

```
PetsPage (state owner)
├── PetGrid (pets, onRemovePet)
│   └── PetCard[] (pet, onRemove)
├── PetForm (isOpen, onSubmit, onCancel)
│   ├── BreedSelector (species, value, onChange)
│   └── PhotoUpload (value, onChange)
└── RemoveDialog (pet, isOpen, onConfirm, onCancel)
```

## Error Handling

| Cenário | Tratamento |
|---------|-----------|
| Formulário com campos inválidos | Exibe mensagem de erro inline abaixo de cada campo |
| Upload de arquivo não-imagem | Exibe mensagem "Apenas imagens são aceitas" |
| Upload de arquivo > 5MB | Exibe mensagem "Tamanho máximo permitido é 5MB" |
| Tentativa de adicionar com limite atingido | Botão "Adicionar Pet" não é renderizado; mensagem de limite exibida |
| Remoção acidental | RemoveDialog com confirmação antes de efetivar |

## Migração do Arquivo de Raças

O arquivo `components/planos/breeds.ts` será movido para `mocks/breeds.ts` com a adição da espécie "outro":

1. Mover o conteúdo para `mocks/breeds.ts`
2. Expandir o tipo `Record` para incluir `"outro"` com array vazio
3. Atualizar o import em `components/planos/PetStep.tsx` para `@/mocks/breeds`
4. O novo tipo `Species` em `types/pets.ts` define as três espécies válidas

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Pet limit controls add button visibility

*For any* pet list, the "Adicionar Pet" button is visible if and only if the list contains fewer than 3 pets, and the limit message is displayed if and only if the list contains exactly 3 pets.

**Validates: Requirements 2.1, 2.2, 2.3**

### Property 2: Breed filtering matches species data

*For any* species value in `{"cao", "gato"}`, the BreedSelector options rendered must equal exactly the array of breeds defined for that species in BreedsData.

**Validates: Requirements 3.3, 3.4**

### Property 3: Species change resets breed value

*For any* current form state with a non-empty breed, changing the species to a different value must reset the breed field to an empty string.

**Validates: Requirements 3.6**

### Property 4: File type validation accepts only images

*For any* file, `validatePetPhoto` returns `valid: true` if and only if the file's MIME type starts with `"image/"`. For non-image MIME types, it returns an error message indicating only images are accepted.

**Validates: Requirements 4.1, 4.4**

### Property 5: File size validation rejects files above 5MB

*For any* file with MIME type starting with `"image/"`, `validatePetPhoto` returns `valid: false` with the size error if and only if the file size exceeds 5,242,880 bytes.

**Validates: Requirements 4.3**

### Property 6: Pet form schema validation round-trip

*For any* form data object where all required fields contain valid values (name 1–50 chars, species in enum, breed non-empty, birthDate non-empty, weight as positive number string, color non-empty), the Zod schema must pass validation. Conversely, for any form data missing or containing invalid values in at least one required field, the schema must fail with a field-specific error message.

**Validates: Requirements 5.1, 5.2, 5.3, 5.4**

### Property 7: Adding a valid pet grows the list by one

*For any* pet list with length < 3 and any valid pet form data, submitting the form must result in the pet list having exactly one more element, and the new element must contain the submitted data.

**Validates: Requirements 6.1**

### Property 8: Form resets after successful submission

*For any* successful pet submission, the form must be collapsed (isOpen = false) and all form field values must be reset to their initial empty state.

**Validates: Requirements 6.2**

### Property 9: Generated IDs are unique

*For any* sequence of N pet additions (N ≤ 3), all generated pet IDs must be distinct from each other and from any pre-existing pet IDs in the list.

**Validates: Requirements 6.3**

### Property 10: Confirmed removal decreases list by one

*For any* pet list with at least 1 pet and any pet in that list, confirming removal must result in a list that is exactly one element shorter and does not contain the removed pet's ID.

**Validates: Requirements 7.3**

### Property 11: Cancelled removal preserves list

*For any* pet list and any pet selected for removal, cancelling the removal dialog must leave the pet list unchanged (same length, same elements in same order).

**Validates: Requirements 7.4**
