"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { PUBLIC_NAV, AUTH_NAV } from "@/types/navigation";
import MobileMenu from "@/components/MobileMenu";

export default function Header() {
  const { isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const showPublicNav = !isAuthenticated || loading;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-primary text-white sticky top-0 z-10 h-16 px-4 w-full flex items-center justify-between">
      {/* Logo */}
      <Link href="/" className="text-xl font-bold text-white hover:bg-primary-dark rounded-lg px-2 py-1">
        Pet Care
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-2">
        {showPublicNav ? (
          <>
            {PUBLIC_NAV.map((item) =>
              item.isButton ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className="bg-white text-primary rounded-lg px-4 py-2 font-semibold hover:bg-primary-dark hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-white px-3 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                >
                  {item.label}
                </Link>
              )
            )}
          </>
        ) : (
          <>
            {AUTH_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white px-3 py-2 rounded-lg hover:bg-primary-dark transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="border border-white rounded-lg px-4 py-2 text-white hover:bg-primary-dark transition-colors"
            >
              Logout
            </button>
          </>
        )}
      </nav>

      {/* Hamburger Button (mobile only) */}
      <button
        onClick={handleToggleMobileMenu}
        className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-primary-dark transition-colors"
        aria-label="Abrir menu de navegação"
        aria-expanded={isMobileMenuOpen}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={handleCloseMobileMenu}
        isAuthenticated={!showPublicNav}
        onLogout={handleLogout}
      />
    </header>
  );
}
