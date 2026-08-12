"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { NavItem } from "@/types/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  currentPath: string;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Sidebar is a fully controlled component (no internal open/close state).
 *
 * Rapid-click protection (Requirement 3.9):
 * - The parent (Header) manages `isSidebarOpen` using functional setState:
 *   `setIsSidebarOpen(prev => !prev)` to avoid stale closures.
 * - React 18 automatic batching ensures multiple rapid clicks produce
 *   a single consistent re-render, preventing flicker or intermediate states.
 * - The CSS `transition-transform duration-300` provides smooth visual
 *   feedback regardless of click frequency.
 */
export default function Sidebar({
  isOpen,
  onClose,
  navItems,
  currentPath,
}: SidebarProps) {
  const asideRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const aside = asideRef.current;
    if (!aside) return;

    // Focus the first focusable element (close button) when sidebar opens
    const focusableElements = aside.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (!aside) return;

      // Escape key closes the sidebar
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      // Focus trap: Tab and Shift+Tab cycle within sidebar
      if (event.key === "Tab") {
        const focusable = aside.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (event.shiftKey) {
          // Shift+Tab: if on first element, move to last
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: if on last element, move to first
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay - only rendered when open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        ref={asideRef}
        aria-hidden={!isOpen}
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <div className="flex items-center justify-end p-4 border-b border-gray-200">
          <button
            onClick={onClose}
            aria-label="Fechar menu de navegação"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-gray-700 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex flex-col p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = item.href === currentPath;

            if (item.type === "button") {
              return (
                <button
                  key={item.label}
                  onClick={onClose}
                  className={`min-w-[44px] min-h-[44px] px-4 py-3 rounded-lg text-left transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    isActive
                      ? "text-primary-500 font-semibold"
                      : "text-gray-700 hover:text-primary-500"
                  }`}
                >
                  {item.label}
                </button>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`min-w-[44px] min-h-[44px] px-4 py-3 rounded-lg flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  isActive
                    ? "text-primary-500 font-semibold"
                    : "text-gray-700 hover:text-primary-500"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
