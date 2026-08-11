"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { NavItem } from "@/types/navigation";
import { navigationItems } from "@/mocks/navigation";
import Sidebar from "./Sidebar";

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const handleSidebarClose = useCallback(() => {
    setIsSidebarOpen(false);
    // Return focus to the hamburger button (Requirement 3.10)
    hamburgerRef.current?.focus();
  }, []);

  const filteredItems: NavItem[] = navigationItems.filter((item) =>
    isAuthenticated
      ? item.visibility === "authenticated"
      : item.visibility === "public"
  );

  // Close sidebar when viewport crosses md breakpoint (768px)
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setIsSidebarOpen(false);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          aria-label="Pet Care - Ir para página inicial"
          className="font-bold text-xl text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
        >
          🐾 Pet Care
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Navegação principal" className="hidden md:flex items-center space-x-6">
          {filteredItems.map((item) => {
            const isActive = item.href === pathname;

            if (item.type === "button") {
              return (
                <button
                  key={item.label}
                  onClick={logout}
                  className={`transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded ${
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
                className={`transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded ${
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

        {/* Hamburger Button (mobile only) */}
        <button
          ref={hamburgerRef}
          className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-gray-700 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label="Abrir menu de navegação"
          onClick={() => setIsSidebarOpen(true)}
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Sidebar (mobile navigation) */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        navItems={filteredItems}
        currentPath={pathname}
      />
    </header>
  );
}
