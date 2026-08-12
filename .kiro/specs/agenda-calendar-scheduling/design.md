# Design Document: Agenda Calendar Scheduling

## Overview

A funcionalidade de Agenda permite que usuários do Pet Care agendem consultas e exames para seus pets através de um calendário mensal interativo, com seleção de horários disponíveis, tipo de atendimento e pet. O sistema persiste os dados localmente e exibe uma lista de próximos agendamentos com opção de cancelamento.

## Architecture

A funcionalidade de Agenda segue a arquitetura existente do projeto Pet Care: componentes React client-side com App Router (Next.js 14+), state management via Context API, persistência em localStorage e estilização com Tailwind CSS (mobile-first).

A página `/agenda` é composta por um calendário mensal custom (sem libs externas), um modal de agendamento com slots de horário, e uma lista de agendamentos futuros. O estado dos agendamentos é gerenciado localmente na página, enquanto os dados de pets são fornecidos pelo PetsContext global compartilhado.

```text
┌─────────────────────────────────────────────────┐
│                  RootLayout                      │
│  ┌───────────────────────────────────────────┐  │
│  │            AuthProvider                    │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │          PetsProvider               │  │  │
│  │  │  ┌───────────────────────────────┐  │  │  │
│  │  │  │     ProtectedLayout           │  │  │  │
│  │  │  │  ┌─────────────────────────┐  │  │  │  │
│  │  │  │  │      AgendaPage         │  │  │  │  │
│  │  │  │  │  ┌───────────────────┐  │  │  │  │  │
│  │  │  │  │  │ CalendarComponent │  │  │  │  │  │
│  │  │  │  │  ├───────────────────┤  │  │  │  │  │
│  │  │  │  │  │ SchedulingModal   │  │  │  │  │  │
│  │  │  │  │  ├───────────────────┤  │  │  │  │  │
│  │  │  │  │  │ AppointmentsList  │  │  │  │  │  │
│  │  │  │  │  ├───────────────────┤  │  │  │  │  │
│  │  │  │  │  │ CancelDialog      │  │  │  │  │  │
│  │  │  │  │  └───────────────────┘  │  │  │  │  │
│  │  │  │  └─────────────────────────┘  │  │  │  │
│  │  │  └───────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. PetsContext (`contexts/PetsContext.tsx`)

Context global que fornece a lista de pets para todas as páginas protegidas. Substitui o estado local atual da página de Pets.

```typescript
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Pet } from "@/types/pets";
import { initialPets } from "@/mocks/pets";

interface PetsContextType {
  pets: Pet[];
  addPet: (pet: Omit<Pet, "id">) => void;
  removePet: (id: string) => void;
}

const PetsContext = createContext<PetsContextType>({
  pets: [],
  addPet: () => {},
  removePet: () => {},
});

const STORAGE_KEY = "petcare_pets";

export function PetsProvider({ children }: { children: ReactNode }) {
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPets(JSON.parse(stored));
      } else {
        setPets(initialPets);
      }
    } catch {
      setPets(initialPets);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pets));
    } catch {
      // localStorage unavailable
    }
  }, [pets]);

  const addPet = (newPet: Omit<Pet, "id">) => {
    const pet: Pet = { ...newPet, id: crypto.randomUUID() };
    setPets((prev) => [...prev, pet]);
  };

  const removePet = (id: string) => {
    setPets((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <PetsContext.Provider value={{ pets, addPet, removePet }}>
      {children}
    </PetsContext.Provider>
  );
}

export function usePets(): PetsContextType {
  return useContext(PetsContext);
}
```

### 2. CalendarComponent (`components/agenda/Calendar.tsx`)

Calendário mensal implementado manualmente. Gerencia navegação entre meses e renderiza o grid de dias.

```typescript
"use client";

import { useState } from "react";
import { Appointment } from "@/types/agenda";

interface CalendarProps {
  appointments: Appointment[];
  onDayClick: (date: Date) => void;
}

export default function Calendar({ appointments, onDayClick }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const goToPreviousMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Render logic...
}
```

### 3. SchedulingModal (`components/agenda/SchedulingModal.tsx`)

Modal centralizado que exibe slots de horário, tipo de atendimento e seleção de pet.

```typescript
"use client";

import { useState, useEffect } from "react";
import { Pet } from "@/types/pets";
import { AppointmentType, TimeSlot } from "@/types/agenda";

interface SchedulingModalProps {
  isOpen: boolean;
  selectedDate: Date | null;
  pets: Pet[];
  existingAppointments: Appointment[];
  onConfirm: (data: { slot: TimeSlot; type: AppointmentType; petId: string }) => void;
  onClose: () => void;
}

export default function SchedulingModal({
  isOpen,
  selectedDate,
  pets,
  existingAppointments,
  onConfirm,
  onClose,
}: SchedulingModalProps) {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedType, setSelectedType] = useState<AppointmentType | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  // Auto-select pet when only one exists
  useEffect(() => {
    if (pets.length === 1) {
      setSelectedPetId(pets[0].id);
    }
  }, [pets]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  const isConfirmDisabled = !selectedSlot || !selectedType || !selectedPetId;

  // Render logic...
}
```

### 4. AppointmentsList (`components/agenda/AppointmentsList.tsx`)

Lista de agendamentos futuros em formato de cards com opção de cancelamento.

```typescript
"use client";

import { Appointment } from "@/types/agenda";
import { Pet } from "@/types/pets";

interface AppointmentsListProps {
  appointments: Appointment[];
  pets: Pet[];
  onCancel: (appointmentId: string) => void;
}

export default function AppointmentsList({
  appointments,
  pets,
  onCancel,
}: AppointmentsListProps) {
  // Filter future appointments and sort by date+time
  const futureAppointments = appointments
    .filter((a) => new Date(`${a.date}T${a.slot}`) >= new Date())
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.slot}`);
      const dateB = new Date(`${b.date}T${b.slot}`);
      return dateA.getTime() - dateB.getTime();
    });

  // Render cards...
}
```

### 5. CancelDialog (`components/agenda/CancelDialog.tsx`)

Diálogo de confirmação de cancelamento, seguindo o padrão do `RemoveDialog` existente no projeto.

```typescript
"use client";

import { Appointment } from "@/types/agenda";

interface CancelDialogProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function CancelDialog({
  appointment,
  isOpen,
  onConfirm,
  onCancel,
}: CancelDialogProps) {
  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onCancel}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-dialog-title"
        className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dialog content */}
      </div>
    </div>
  );
}
```

### 6. AgendaPage (`app/(protected)/agenda/page.tsx`)

Página principal que orquestra todos os componentes e gerencia o estado de agendamentos.

```typescript
"use client";

import { useState, useEffect } from "react";
import { usePets } from "@/contexts/PetsContext";
import { Appointment, TimeSlot, AppointmentType } from "@/types/agenda";
import Calendar from "@/components/agenda/Calendar";
import SchedulingModal from "@/components/agenda/SchedulingModal";
import AppointmentsList from "@/components/agenda/AppointmentsList";
import CancelDialog from "@/components/agenda/CancelDialog";

const STORAGE_KEY = "petcare_appointments";

export default function AgendaPage() {
  const { pets } = usePets();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setAppointments(JSON.parse(stored));
    } catch { /* noop */ }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
    } catch { /* noop */ }
  }, [appointments]);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleConfirmAppointment = (data: {
    slot: TimeSlot;
    type: AppointmentType;
    petId: string;
  }) => {
    const newAppointment: Appointment = {
      id: crypto.randomUUID(),
      date: selectedDate!.toISOString().split("T")[0],
      slot: data.slot,
      type: data.type,
      petId: data.petId,
      status: "agendado",
    };
    setAppointments((prev) => [...prev, newAppointment]);
    setIsModalOpen(false);
  };

  const handleCancelAppointment = () => {
    if (appointmentToCancel) {
      setAppointments((prev) => prev.filter((a) => a.id !== appointmentToCancel.id));
      setAppointmentToCancel(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Agenda</h1>
      <Calendar appointments={appointments} onDayClick={handleDayClick} />
      <SchedulingModal
        isOpen={isModalOpen}
        selectedDate={selectedDate}
        pets={pets}
        existingAppointments={appointments}
        onConfirm={handleConfirmAppointment}
        onClose={() => setIsModalOpen(false)}
      />
      <AppointmentsList
        appointments={appointments}
        pets={pets}
        onCancel={(id) => setAppointmentToCancel(appointments.find((a) => a.id === id) || null)}
      />
      <CancelDialog
        appointment={appointmentToCancel}
        isOpen={appointmentToCancel !== null}
        onConfirm={handleCancelAppointment}
        onCancel={() => setAppointmentToCancel(null)}
      />
    </div>
  );
}
```

## Data Models

### Types (`types/agenda.ts`)

```typescript
export type TimeSlot = "09:00" | "10:00" | "11:00" | "14:00" | "15:00" | "16:00";

export type AppointmentType = "consulta" | "exame";

export type AppointmentStatus = "agendado";

export interface Appointment {
  id: string;
  date: string;        // ISO date string (YYYY-MM-DD)
  slot: TimeSlot;
  type: AppointmentType;
  petId: string;
  status: AppointmentStatus;
}

export const ALL_SLOTS: TimeSlot[] = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

export const BLOCKED_SLOTS_PER_DAY = 2;
```

### Utility Functions (`components/agenda/calendarUtils.ts`)

```typescript
import { TimeSlot, ALL_SLOTS, BLOCKED_SLOTS_PER_DAY } from "@/types/agenda";

/** Returns days in a month (1-indexed month) */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Returns the weekday (0=Sun, 6=Sat) of the first day of the month */
export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/** Generates calendar grid data for a given month */
export interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  dateString: string; // YYYY-MM-DD
}

export function generateCalendarGrid(year: number, month: number): CalendarDay[] {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const days: CalendarDay[] = [];

  // Leading empty cells for alignment
  for (let i = 0; i < firstDay; i++) {
    days.push({ date: 0, isCurrentMonth: false, isToday: false, isPast: true, dateString: "" });
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const isPast = dateString < todayStr;
    const isToday = dateString === todayStr;

    days.push({ date: day, isCurrentMonth: true, isToday, isPast, dateString });
  }

  return days;
}

/** Generates 2 random blocked slots for a given date (deterministic per date) */
export function getBlockedSlots(dateString: string): TimeSlot[] {
  // Simple hash-based deterministic random from date string
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
    hash |= 0;
  }

  const indices: number[] = [];
  const idx1 = Math.abs(hash) % ALL_SLOTS.length;
  indices.push(idx1);

  let idx2 = Math.abs(hash >> 3) % ALL_SLOTS.length;
  while (idx2 === idx1) {
    idx2 = (idx2 + 1) % ALL_SLOTS.length;
  }
  indices.push(idx2);

  return indices.map((i) => ALL_SLOTS[i]);
}

/** Gets the month name in Portuguese */
export function getMonthName(month: number): string {
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];
  return months[month];
}

/** Navigates to previous month */
export function getPreviousMonth(year: number, month: number): { year: number; month: number } {
  if (month === 0) return { year: year - 1, month: 11 };
  return { year, month: month - 1 };
}

/** Navigates to next month */
export function getNextMonth(year: number, month: number): { year: number; month: number } {
  if (month === 11) return { year: year + 1, month: 0 };
  return { year, month: month + 1 };
}
```

### Appointment Persistence (`components/agenda/appointmentStorage.ts`)

```typescript
import { Appointment } from "@/types/agenda";

const STORAGE_KEY = "petcare_appointments";

export function loadAppointments(): Appointment[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // localStorage unavailable or parse error
  }
  return [];
}

export function saveAppointments(appointments: Appointment[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  } catch {
    // localStorage unavailable
  }
}
```

## Error Handling

| Cenário | Tratamento |
| ------- | ---------- |
| localStorage indisponível (SSR, private mode) | Fallback silencioso: estado em memória, sem persistência |
| JSON parse error ao ler localStorage | Inicializar com array vazio / dados mock |
| PetsContext sem pets cadastrados | Modal não exibe seletor de pet; botão confirmar permanece desabilitado |
| Tentativa de agendar em slot bloqueado/ocupado | Slot visualmente desabilitado; click handler ignora a interação |
| Tentativa de clicar em dia passado | Day cell desabilitada; click handler não dispara |
| Data inválida no localStorage | Validação no parse; itens inválidos são descartados |

## File Structure

```text
components/
  agenda/
    Calendar.tsx              # Componente de calendário mensal
    SchedulingModal.tsx       # Modal de agendamento
    AppointmentsList.tsx      # Lista de agendamentos futuros
    AppointmentCard.tsx       # Card individual de agendamento
    CancelDialog.tsx          # Diálogo de confirmação de cancelamento
    SlotButton.tsx            # Botão individual de slot de horário
    calendarUtils.ts          # Funções utilitárias do calendário
    appointmentStorage.ts     # Persistência localStorage
    __tests__/                # Testes unitários e de propriedade

contexts/
  PetsContext.tsx             # Context global de pets

types/
  agenda.ts                   # Tipos e interfaces da agenda

app/(protected)/agenda/
  page.tsx                    # Página de agenda
```

## Testing Strategy

- **Unit Tests**: Testes com exemplos específicos para componentes React (renderização, interações de UI) e edge cases (localStorage indisponível, lista vazia de pets, JSON inválido).
- **Property-Based Tests**: Testes de propriedade com fast-check para funções puras (`calendarUtils.ts`, `appointmentStorage.ts`) e lógica de negócio (filtragem de slots, ordenação de agendamentos, round-trip de serialização).
- **Framework**: Vitest + React Testing Library para testes unitários; fast-check para PBT.
- **Cobertura**: Mínimo de 100 iterações por teste de propriedade. Testes unitários cobrem integração entre componentes e edge cases.

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Calendar grid produces correct number of days

*For any* valid year and month (0–11), the `generateCalendarGrid` function SHALL produce exactly as many `isCurrentMonth: true` entries as the actual number of days in that month (28–31).

**Validates: Requirements 1.2**

### Property 2: Calendar navigation round-trip

*For any* valid year and month, navigating to the next month and then back to the previous month SHALL return to the original year and month values. Symmetrically, navigating previous then next SHALL also return to the original.

**Validates: Requirements 1.3, 1.4**

### Property 3: Past days are disabled

*For any* date string that is strictly before today's date, the generated `CalendarDay` SHALL have `isPast: true`, preventing user interaction.

**Validates: Requirements 2.2**

### Property 4: Appointment indicator matches data

*For any* list of appointments and any day in the calendar, the day SHALL show a visual indicator if and only if at least one appointment exists with that day's date string.

**Validates: Requirements 2.3**

### Property 5: Blocked slots invariant

*For any* valid date string, the `getBlockedSlots` function SHALL return exactly 2 distinct slots from the set of 6 available slots, and the total slot count SHALL always be 6.

**Validates: Requirements 3.1, 3.2**

### Property 6: Unavailable slots are not selectable

*For any* slot that is either blocked (via `getBlockedSlots`) or already has an existing appointment for that date, attempting to select it SHALL not change the selected slot state.

**Validates: Requirements 3.3, 3.4**

### Property 7: Available slot selection

*For any* slot that is neither blocked nor occupied by an existing appointment, selecting it SHALL update the selected slot state to that slot's time value.

**Validates: Requirements 3.5**

### Property 8: Confirm button disabled when form incomplete

*For any* combination of form state where the selected slot is null OR the appointment type is null OR the selected pet is null, the confirm button SHALL be disabled.

**Validates: Requirements 4.5**

### Property 9: Pet selector visibility based on pet count

*For any* pets list with length greater than 1, the scheduling modal SHALL render a pet selector. For a list with exactly 1 pet, the pet SHALL be auto-selected without showing a selector.

**Validates: Requirements 4.2, 4.3**

### Property 10: Appointment creation produces valid object

*For any* valid combination of future date, available time slot, appointment type, and pet ID, creating an appointment SHALL produce an `Appointment` object with all fields correctly set, status equal to "agendado", and a unique non-empty ID.

**Validates: Requirements 5.1**

### Property 11: Appointment localStorage round-trip

*For any* list of valid appointments, serializing to localStorage via `saveAppointments` and then deserializing via `loadAppointments` SHALL produce an equivalent list.

**Validates: Requirements 5.2, 6.5**

### Property 12: Future appointments filtering

*For any* list of appointments with mixed past and future dates, the filtered appointments list SHALL contain only appointments where the date is greater than or equal to today's date.

**Validates: Requirements 6.2**

### Property 13: Appointments sorted in ascending order

*For any* list of future appointments, after sorting, each appointment's datetime SHALL be less than or equal to the next appointment's datetime in the list.

**Validates: Requirements 6.4**

### Property 14: Cancellation removes appointment

*For any* list of appointments and any appointment in that list, after cancellation the resulting list SHALL have length equal to the original length minus 1, and SHALL NOT contain the cancelled appointment's ID.

**Validates: Requirements 7.3, 7.4**

### Property 15: Cancellation dismissal preserves state

*For any* list of appointments and any appointment selected for cancellation, dismissing the cancel dialog (clicking "Cancelar" or outside) SHALL leave the appointments list identical to its state before the dialog was opened.

**Validates: Requirements 7.6**

### Property 16: PetsContext localStorage round-trip

*For any* valid list of pets, persisting to localStorage and then initializing PetsContext SHALL produce the same list of pets with all fields preserved.

**Validates: Requirements 8.2, 8.4**

### Property 17: Modal dismissal via Escape key

*For any* open modal state, dispatching a keyboard event with key "Escape" SHALL result in the modal being closed (isOpen becomes false).

**Validates: Requirements 9.4**
