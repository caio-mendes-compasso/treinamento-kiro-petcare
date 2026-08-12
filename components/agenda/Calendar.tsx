"use client";

import { useState } from "react";
import { Appointment } from "@/types/agenda";
import {
  generateCalendarGrid,
  getMonthName,
  getPreviousMonth,
  getNextMonth,
} from "./calendarUtils";

interface CalendarProps {
  appointments: Appointment[];
  onDayClick: (date: Date) => void;
}

const WEEKDAY_HEADERS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function Calendar({ appointments, onDayClick }: CalendarProps) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const days = generateCalendarGrid(year, month);

  const appointmentDates = new Set(appointments.map((a) => a.date));

  const goToPreviousMonth = () => {
    const prev = getPreviousMonth(year, month);
    setYear(prev.year);
    setMonth(prev.month);
  };

  const goToNextMonth = () => {
    const next = getNextMonth(year, month);
    setYear(next.year);
    setMonth(next.month);
  };

  const handleDayClick = (dateString: string, isPast: boolean) => {
    if (isPast) return;
    onDayClick(new Date(dateString + "T00:00:00"));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
      {/* Month/Year header with navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          aria-label="Mês anterior"
          className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <h2 className="text-lg font-semibold text-gray-900">
          {getMonthName(month)} {year}
        </h2>

        <button
          onClick={goToNextMonth}
          aria-label="Próximo mês"
          className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAY_HEADERS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (!day.isCurrentMonth) {
            return <div key={index} className="h-10" />;
          }

          const hasAppointment = appointmentDates.has(day.dateString);

          const baseClasses =
            "relative h-10 w-full flex flex-col items-center justify-center rounded-full text-sm";

          let stateClasses: string;

          if (day.isToday) {
            stateClasses =
              "bg-primary-500 text-white font-semibold cursor-pointer hover:bg-primary-600";
          } else if (day.isPast) {
            stateClasses = "text-gray-300 cursor-not-allowed";
          } else {
            stateClasses =
              "text-gray-700 cursor-pointer hover:bg-primary-50 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2";
          }

          return (
            <button
              key={index}
              type="button"
              disabled={day.isPast}
              onClick={() => handleDayClick(day.dateString, day.isPast)}
              className={`${baseClasses} ${stateClasses}`}
              aria-label={`${day.date} de ${getMonthName(month)}`}
            >
              <span>{day.date}</span>
              {hasAppointment && (
                <span
                  className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${
                    day.isToday ? "bg-white" : "bg-primary-500"
                  }`}
                  aria-label="Dia com agendamento"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
