"use client";

import { Link, NavLink } from "react-router-dom";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "C²" },
  { href: "/dealer-partner", label: "Dealer Partner" },
  { href: "/build-partner", label: "Build Partner" },
  { href: "/solar-partner", label: "Solar Partner" },
  { href: "/manifesto", label: "Manifesto" },
  { href: "/architecture", label: "Architecture" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border backdrop-blur-xl bg-background/80">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold tracking-tight text-foreground">
          C²
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            return (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `px-3 py-1.5 text-sm rounded-md transition-colors ${
                    isActive
                      ? "text-accent bg-accent-subtle"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-raised"
                  }`
                }
              >
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-text-secondary hover:text-text-primary"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden border-t border-border bg-background px-6 pb-4">
          {navLinks.map((link) => {
            return (
              <NavLink
                key={link.href}
                to={link.href}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block py-2.5 text-sm transition-colors ${
                    isActive ? "text-accent" : "text-text-secondary hover:text-text-primary"
                  }`
                }
              >
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      )}
    </header>
  );
}
