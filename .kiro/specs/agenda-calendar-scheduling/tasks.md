# Implementation Plan: Agenda Calendar Scheduling

## Overview

Implementação da funcionalidade de Agenda com calendário mensal custom, modal de agendamento com slots de horário, lista de agendamentos futuros e cancelamento. Utiliza PetsContext global compartilhado, persistência em localStorage, e segue a arquitetura existente do projeto (Next.js 14+, TypeScript, Tailwind CSS mobile-first).

## Tasks

- [x] 1. Set up types, utilities and storage layer
  - [x] 1.1 Create agenda types and interfaces (`types/agenda.ts`)
    - Define `TimeSlot`, `AppointmentType`, `AppointmentStatus` types
    - Define `Appointment` interface with id, date, slot, type, petId, status
    - Export `ALL_SLOTS` array and `BLOCKED_SLOTS_PER_DAY` constant
    - _Requirements: 3.1, 5.1_

  - [x] 1.2 Create calendar utility functions (`components/agenda/calendarUtils.ts`)
    - Implement `getDaysInMonth`, `getFirstDayOfMonth`, `generateCalendarGrid`
    - Implement `getBlockedSlots` with deterministic hash-based random
    - Implement `getMonthName` (Portuguese), `getPreviousMonth`, `getNextMonth`
    - Define `CalendarDay` interface
    - _Requirements: 1.2, 1.3, 1.4, 3.2_

  - [x] 1.3 Create appointment storage module (`components/agenda/appointmentStorage.ts`)
    - Implement `loadAppointments` with try/catch and fallback to empty array
    - Implement `saveAppointments` with try/catch for localStorage unavailability
    - _Requirements: 5.2, 6.5_

  - [x] 1.4 Write property tests for calendarUtils (Properties 1, 2, 3, 5)
    - **Property 1: Calendar grid produces correct number of days**
    - **Property 2: Calendar navigation round-trip**
    - **Property 3: Past days are disabled**
    - **Property 5: Blocked slots invariant**
    - **Validates: Requirements 1.2, 1.3, 1.4, 2.2, 3.1, 3.2**

  - [x] 1.5 Write property test for appointmentStorage (Property 11)
    - **Property 11: Appointment localStorage round-trip**
    - **Validates: Requirements 5.2, 6.5**

- [x] 2. Checkpoint - Ensure types and utilities compile correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Implement PetsContext global
  - [x] 3.1 Create PetsContext provider (`contexts/PetsContext.tsx`)
    - Implement `PetsProvider` with localStorage persistence and mock fallback
    - Implement `usePets` hook exposing pets, addPet, removePet
    - Initialize from localStorage or `initialPets` mock data
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

  - [x] 3.2 Integrate PetsContext into the protected layout (`app/(protected)/layout.tsx`)
    - Wrap children with `PetsProvider` in the existing layout
    - Ensure PetsContext is available for both Pets and Agenda pages
    - _Requirements: 8.1, 8.3_

  - [x] 3.3 Refactor existing Pets page to consume PetsContext
    - Replace local state management in `app/(protected)/pets/page.tsx` with `usePets()` hook
    - Ensure existing pet CRUD functionality remains unchanged
    - _Requirements: 8.3_

  - [x] 3.4 Write property test for PetsContext persistence (Property 16)
    - **Property 16: PetsContext localStorage round-trip**
    - **Validates: Requirements 8.2, 8.4**

- [x] 4. Implement Calendar component
  - [x] 4.1 Create Calendar component (`components/agenda/Calendar.tsx`)
    - Render month/year header with navigation buttons (previous/next)
    - Render weekday headers (Dom–Sáb)
    - Render day grid using `generateCalendarGrid`
    - Disable past days visually and prevent click interaction
    - Show visual indicator (dot) on days with appointments
    - Highlight today's date with distinct style
    - Use primary color `#0D7377` for active elements
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 9.1, 9.5_

  - [x] 4.2 Write property test for appointment indicator (Property 4)
    - **Property 4: Appointment indicator matches data**
    - **Validates: Requirements 2.3**

- [x] 5. Implement Scheduling Modal and slot selection
  - [x] 5.1 Create SlotButton component (`components/agenda/SlotButton.tsx`)
    - Render slot time with appropriate visual state (available, blocked, occupied, selected)
    - Handle click only for available slots
    - Apply disabled styling for blocked/occupied slots
    - Apply focus ring for keyboard navigation
    - _Requirements: 3.3, 3.4, 3.5, 9.3_

  - [x] 5.2 Create SchedulingModal component (`components/agenda/SchedulingModal.tsx`)
    - Render centered overlay with backdrop click-to-close
    - Display selected date in header
    - Render 6 time slots using SlotButton, marking blocked and occupied ones
    - Render appointment type radio buttons (Consulta / Exame)
    - Conditionally render pet selector (only when >1 pet) or auto-select single pet
    - Render "Confirmar agendamento" button, disabled until all fields selected
    - Close modal on Escape key press
    - Use `role="dialog"`, `aria-modal="true"`, `aria-labelledby` for accessibility
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4, 4.5, 9.2, 9.3, 9.4, 9.5_

  - [x] 5.3 Write property tests for modal logic (Properties 6, 7, 8, 9, 17)
    - **Property 6: Unavailable slots are not selectable**
    - **Property 7: Available slot selection**
    - **Property 8: Confirm button disabled when form incomplete**
    - **Property 9: Pet selector visibility based on pet count**
    - **Property 17: Modal dismissal via Escape key**
    - **Validates: Requirements 3.3, 3.4, 3.5, 4.2, 4.3, 4.5, 9.4**

- [x] 6. Checkpoint - Ensure Calendar and Modal render correctly
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implement Appointments list and cancellation
  - [x] 7.1 Create AppointmentCard component (`components/agenda/AppointmentCard.tsx`)
    - Display date, time slot, appointment type, pet name, and status
    - Render "Cancelar" button
    - Style as card with shadow, border, and rounded corners
    - _Requirements: 6.3, 7.1_

  - [x] 7.2 Create AppointmentsList component (`components/agenda/AppointmentsList.tsx`)
    - Filter appointments to show only future/today entries
    - Sort appointments by date and time in ascending order
    - Render list of AppointmentCard components
    - Show empty state message when no future appointments exist
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [x] 7.3 Create CancelDialog component (`components/agenda/CancelDialog.tsx`)
    - Render confirmation dialog with appointment details
    - Provide "Confirmar cancelamento" and "Voltar" buttons
    - Close on backdrop click
    - Use accessible dialog pattern (role, aria-modal, aria-labelledby)
    - _Requirements: 7.2, 7.6, 9.3_

  - [x] 7.4 Write property tests for appointments list (Properties 12, 13)
    - **Property 12: Future appointments filtering**
    - **Property 13: Appointments sorted in ascending order**
    - **Validates: Requirements 6.2, 6.4**

  - [x] 7.5 Write property tests for cancellation (Properties 14, 15)
    - **Property 14: Cancellation removes appointment**
    - **Property 15: Cancellation dismissal preserves state**
    - **Validates: Requirements 7.3, 7.4, 7.6**

- [x] 8. Wire everything in the Agenda page
  - [x] 8.1 Implement AgendaPage (`app/(protected)/agenda/page.tsx`)
    - Import and use `usePets()` to access pet list
    - Manage appointments state with localStorage load/save via appointmentStorage
    - Handle day click → open SchedulingModal with selected date
    - Handle appointment confirmation → create Appointment, persist, close modal
    - Handle cancel flow → open CancelDialog, remove appointment on confirm
    - Compose Calendar, SchedulingModal, AppointmentsList, CancelDialog
    - _Requirements: 2.1, 5.1, 5.2, 5.3, 5.4, 5.5, 6.5, 7.3, 7.4, 7.5_

  - [x] 8.2 Write property test for appointment creation (Property 10)
    - **Property 10: Appointment creation produces valid object**
    - **Validates: Requirements 5.1**

- [x] 9. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The PetsContext refactor (3.3) must maintain backward compatibility with the existing Pets page
- All components use Tailwind CSS with the project's primary color (#0D7377) and mobile-first approach
- Testing uses Vitest + fast-check for property-based tests

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3"] },
    { "id": 2, "tasks": ["1.4", "1.5", "3.1"] },
    { "id": 3, "tasks": ["3.2", "3.3", "3.4"] },
    { "id": 4, "tasks": ["4.1", "5.1"] },
    { "id": 5, "tasks": ["4.2", "5.2"] },
    { "id": 6, "tasks": ["5.3", "7.1"] },
    { "id": 7, "tasks": ["7.2", "7.3"] },
    { "id": 8, "tasks": ["7.4", "7.5"] },
    { "id": 9, "tasks": ["8.1"] },
    { "id": 10, "tasks": ["8.2"] }
  ]
}
```
