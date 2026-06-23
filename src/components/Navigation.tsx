"use client";

import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchSession, logout, type SessionUser } from "@/lib/session";

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
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const session = await fetchSession();
        if (!cancelled) {
          setUser(session.user);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const initials = user
    ? (user.display_name || user.email)
        .split(/\s+|@/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.slice(0, 1).toUpperCase())
        .join('')
    : '';

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setUser(null);
      setProfileOpen(false);
      window.location.assign('/');
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border backdrop-blur-xl bg-background/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-lg font-semibold tracking-tight text-foreground">
          C²
        </Link>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              return (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) =>
                    `rounded-md px-3 py-1.5 text-sm transition-colors ${
                      isActive
                        ? 'bg-accent-subtle text-accent'
                        : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="relative">
            {user ? (
              <>
                <button
                  type="button"
                  onClick={() => setProfileOpen((value) => !value)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/30 bg-accent-subtle text-sm font-semibold text-accent transition-colors hover:border-accent/50"
                  aria-label="Open account menu"
                >
                  {initials || 'C²'}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-border bg-surface p-3 shadow-2xl shadow-black/30">
                    <p className="px-2 text-xs uppercase tracking-widest text-text-tertiary">Signed in</p>
                    <div className="mt-2 rounded-xl border border-border bg-surface-raised px-3 py-2">
                      <p className="text-sm font-medium text-foreground">
                        {user.display_name || user.email}
                      </p>
                      <p className="text-xs text-text-secondary">{user.email}</p>
                      <p className="mt-1 text-xs uppercase tracking-widest text-text-tertiary">
                        {user.role}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Link
                        to="/login"
                        className="inline-flex flex-1 items-center justify-center rounded-lg border border-border px-3 py-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
                        onClick={() => setProfileOpen(false)}
                      >
                        Account
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="inline-flex flex-1 items-center justify-center rounded-lg border border-border px-3 py-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Link
                to="/login"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-text-secondary transition-colors hover:border-accent/40 hover:text-accent"
                aria-label="Sign in"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21a8 8 0 1 0-16 0" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Link>
            )}
          </div>

          <button
            className="p-2 text-text-secondary hover:text-text-primary md:hidden"
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
