"use client";

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { PUBLIC_NAV, AUTH_NAV } from "@/types/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export default function MobileMenu({ isOpen, onClose, isAuthenticated, onLogout }: MobileMenuProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const navItems = isAuthenticated ? AUTH_NAV : PUBLIC_NAV;

  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!sidebarRef.current) return [];
    const elements = sidebarRef.current.querySelectorAll<HTMLElement>(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    return Array.from(elements);
  }, []);

  const returnFocusToHamburger = useCallback(() => {
    const hamburger = document.querySelector<HTMLElement>(
      '[aria-label="Abrir menu de navegação"]'
    );
    if (hamburger) {
      hamburger.focus();
    }
  }, []);

  // Handle focus trap and keyboard events
  useEffect(() => {
    if (!isOpen) return;

    // Store previous focus for restoration
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Focus the first focusable element in the sidebar
    const timer = setTimeout(() => {
      const focusable = getFocusableElements();
      if (focusable.length > 0) {
        focusable[0].focus();
      }
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        returnFocusToHamburger();
        return;
      }

      if (e.key === "Tab") {
        const focusable = getFocusableElements();
        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
          // Shift+Tab: if focus is on first element, go to last
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: if focus is on last element, go to first
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, getFocusableElements, returnFocusToHamburger]);

  const handleLinkClick = () => {
    onClose();
  };

  const handleLogoutClick = () => {
    onLogout();
    onClose();
  };

  const handleBackdropClick = () => {
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-20 md:hidden ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        className={`absolute top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex flex-col p-4 pt-20 gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className="text-gray-800 px-3 py-2 rounded-lg hover:bg-primary-light transition-colors"
              tabIndex={isOpen ? 0 : -1}
            >
              {item.label}
            </Link>
          ))}
          {isAuthenticated && (
            <button
              onClick={handleLogoutClick}
              className="text-left text-primary border border-primary rounded-lg px-3 py-2 mt-2 hover:bg-primary-light transition-colors"
              tabIndex={isOpen ? 0 : -1}
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </div>
  );
}
