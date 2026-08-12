# Implementation Plan: Pet Registration & Listing

## Overview

Implementação da funcionalidade de cadastro e listagem de pets na área protegida do PetCare. A abordagem é incremental: migrar o arquivo de raças compartilhado, definir tipos e schemas, criar componentes visuais (PetCard, PetGrid, BreedSelector, PhotoUpload, RemoveDialog, PetForm), e finalmente orquestrar tudo na PetsPage com estado local via useState.

## Tasks

- [x] 1. Setup de tipos, mocks e migração do arquivo de raças
  - [x] 1.1 Criar interface Pet e tipo Species em `types/pets.ts`
    - Definir `Species = "cao" | "gato" | "outro"`
    - Definir interface `Pet` com campos: id, name, species, breed, birthDate, weight, color, photo
    - Exportar ambos os tipos
    - _Requirements: 3.2, 8.3_

  - [x] 1.2 Migrar `components/planos/breeds.ts` para `mocks/breeds.ts`
    - Mover o conteúdo para `mocks/breeds.ts`
    - Expandir o tipo Record para incluir `"outro"` com array vazio
    - Atualizar o import em `components/planos/PetStep.tsx` para `@/mocks/breeds`
    - Remover o arquivo antigo `components/planos/breeds.ts`
    - _Requirements: 8.1, 8.2, 8.3_

  - [x] 1.3 Criar dados mock iniciais em `mocks/pets.ts`
    - Definir array `initialPets` com 2 pets: Thor (Cão, Golden Retriever) e Luna (Gato, Siamês)
    - Usar a interface Pet importada de `@/types/pets`
    - _Requirements: 1.2_

  - [x] 1.4 Criar schema Zod de validação em `components/pets/petSchema.ts`
    - Implementar `petFormSchema` com validações: name (1–50 chars), species (enum), breed (non-empty), birthDate (non-empty), weight (string positivo numérico), color (non-empty)
    - Exportar tipo `PetFormData` derivado do schema
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [x] 1.5 Write property test for Pet form schema validation
    - **Property 6: Pet form schema validation round-trip**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4**

- [ ] 2. Implementar validação de arquivo e componentes base
  - [x] 2.1 Criar `components/pets/fileValidation.ts`
    - Implementar `validatePetPhoto(file: File): FileValidationResult`
    - Validar tipo MIME (`file.type.startsWith("image/")`)
    - Validar tamanho máximo (5MB = 5 * 1024 * 1024 bytes)
    - Retornar mensagens de erro específicas
    - _Requirements: 4.1, 4.3, 4.4_

  - [x] 2.2 Write property test for file type validation
    - **Property 4: File type validation accepts only images**
    - **Validates: Requirements 4.1, 4.4**

  - [x] 2.3 Write property test for file size validation
    - **Property 5: File size validation rejects files above 5MB**
    - **Validates: Requirements 4.3**

  - [x] 2.4 Criar componente `components/pets/BreedSelector.tsx`
    - Renderizar `<select>` quando species é "cao" ou "gato" com opções de `breedsBySpecies`
    - Renderizar `<input type="text">` quando species é "outro"
    - Resetar valor de raça ao alterar espécie (via callback onChange com string vazia)
    - Exibir mensagem de erro quando `error` prop estiver presente
    - _Requirements: 3.3, 3.4, 3.5, 3.6_

  - [x] 2.5 Write property test for breed filtering
    - **Property 2: Breed filtering matches species data**
    - **Validates: Requirements 3.3, 3.4**

  - [x] 2.6 Write property test for species change resetting breed
    - **Property 3: Species change resets breed value**
    - **Validates: Requirements 3.6**

  - [x] 2.7 Criar componente `components/pets/PhotoUpload.tsx`
    - Aceitar `input[type="file"][accept="image/*"]`
    - Usar FileReader API para gerar preview (base64 data URL)
    - Chamar `validatePetPhoto` antes de aceitar o arquivo
    - Exibir preview da imagem quando válida
    - Exibir mensagem de erro quando inválida
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 3. Checkpoint - Validar base
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Implementar componentes visuais de listagem
  - [x] 4.1 Criar componente `components/pets/PetCard.tsx`
    - Exibir foto do pet ou placeholder emoji (🐕 Cão, 🐈 Gato, 🐾 Outro)
    - Exibir nome, espécie e raça do pet
    - Incluir botão "Remover" com estilo secundário
    - Usar visual: `bg-white rounded-lg shadow-sm border border-gray-200 p-4`
    - _Requirements: 1.1, 1.6, 7.1_

  - [x] 4.2 Criar componente `components/pets/PetGrid.tsx`
    - Renderizar lista de PetCards em grid responsivo
    - Classes: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6`
    - Receber props: pets array e onRemovePet callback
    - _Requirements: 1.3, 1.4, 1.5_

  - [x] 4.3 Criar componente `components/pets/RemoveDialog.tsx`
    - Renderizar diálogo modal de confirmação
    - Exibir nome do pet selecionado para remoção
    - Botões "Confirmar" e "Cancelar"
    - Controlar visibilidade via props `isOpen` e `pet`
    - _Requirements: 7.2, 7.3, 7.4_

- [x] 5. Implementar formulário de cadastro
  - [x] 5.1 Criar componente `components/pets/PetForm.tsx`
    - Renderizar seção expansível inline (não modal) controlada via prop `isOpen`
    - Incluir campos: Nome, Espécie (select com "Cão", "Gato", "Outro"), Raça (via BreedSelector), Data de Nascimento, Peso (kg), Cor/Pelagem, Upload de Foto (via PhotoUpload)
    - Integrar validação Zod com `petFormSchema` no submit
    - Exibir mensagens de erro inline por campo
    - Chamar `onSubmit` com dados válidos ou `onCancel` para recolher
    - Limpar campos após submissão e resetar raça ao mudar espécie
    - _Requirements: 3.1, 3.2, 3.5, 3.6, 5.1, 5.2, 5.3, 5.4_

  - [x] 5.2 Write unit tests for PetForm
    - Testar validação inline de campos obrigatórios
    - Testar alternância de BreedSelector ao mudar espécie
    - Testar submissão com dados válidos
    - _Requirements: 3.1, 3.2, 5.1, 5.2_

- [ ] 6. Orquestrar PetsPage com estado e lógica completa
  - [x] 6.1 Implementar `app/(protected)/pets/page.tsx` como PetsPage
    - Adicionar `"use client"` e gerenciar estado com useState: `pets`, `isFormOpen`, `petToRemove`
    - Inicializar com `initialPets` do mock
    - Renderizar PetGrid, botão "Adicionar Pet", PetForm, RemoveDialog
    - Implementar lógica de adicionar pet: gerar id via `crypto.randomUUID()`, adicionar à lista, fechar form
    - Implementar lógica de remoção: confirmar via dialog, remover da lista
    - Controlar visibilidade do botão "Adicionar Pet" (ocultar quando length >= 3)
    - Exibir mensagem de limite quando length === 3
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.3, 6.1, 6.2, 6.3, 7.2, 7.3, 7.4_

  - [-] 6.2 Write property test for pet limit controlling button visibility
    - **Property 1: Pet limit controls add button visibility**
    - **Validates: Requirements 2.1, 2.2, 2.3**

  - [-] 6.3 Write property test for adding a valid pet
    - **Property 7: Adding a valid pet grows the list by one**
    - **Validates: Requirements 6.1**

  - [-] 6.4 Write property test for form reset after submission
    - **Property 8: Form resets after successful submission**
    - **Validates: Requirements 6.2**

  - [-] 6.5 Write property test for unique ID generation
    - **Property 9: Generated IDs are unique**
    - **Validates: Requirements 6.3**

  - [-] 6.6 Write property test for confirmed removal
    - **Property 10: Confirmed removal decreases list by one**
    - **Validates: Requirements 7.3**

  - [x] 6.7 Write property test for cancelled removal
    - **Property 11: Cancelled removal preserves list**
    - **Validates: Requirements 7.4**

- [x] 7. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties defined in design.md
- Unit tests validate specific examples and edge cases
- Stack: TypeScript, Next.js 14+ App Router, Tailwind CSS, Zod, Vitest + fast-check
- O arquivo `breeds.ts` migrado é compartilhado entre o fluxo de planos existente e a nova feature de pets

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "1.4"] },
    { "id": 2, "tasks": ["1.5", "2.1", "2.4"] },
    { "id": 3, "tasks": ["2.2", "2.3", "2.5", "2.6", "2.7"] },
    { "id": 4, "tasks": ["4.1", "4.2", "4.3"] },
    { "id": 5, "tasks": ["5.1"] },
    { "id": 6, "tasks": ["5.2", "6.1"] },
    { "id": 7, "tasks": ["6.2", "6.3", "6.4", "6.5", "6.6", "6.7"] }
  ]
}
```
