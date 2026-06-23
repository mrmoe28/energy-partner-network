"use client";

import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import { fetchSession, loginWithEmail, logout, type SessionUser } from "@/lib/session";

function LoginIcon() {
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/20 bg-accent-subtle text-accent">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M15 4.5h3A1.5 1.5 0 0 1 19.5 6v12A1.5 1.5 0 0 1 18 19.5h-3" />
        <path d="M10 16l4-4-4-4" />
        <path d="M14 12H4.5" />
      </svg>
    </div>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextPath = searchParams.get('next');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const session = await fetchSession();
        if (!cancelled && session.authenticated) {
          setSessionUser(session.user);
        }
      } catch {
        if (!cancelled) {
          setSessionUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const resolveRedirect = (user: SessionUser) => {
    if (nextPath && nextPath.startsWith('/') && !nextPath.startsWith('//')) {
      return nextPath;
    }

    return user.role === 'admin' ? '/admin/leads' : '/';
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await loginWithEmail(email, password);
      setSessionUser(response.user);
      navigate(resolveRedirect(response.user), { replace: true });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Unable to sign in.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setSubmitting(true);
    setError(null);

    try {
      await logout();
      setSessionUser(null);
    } catch (logoutError) {
      setError(logoutError instanceof Error ? logoutError.message : 'Unable to sign out.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(201,169,110,0.08),_transparent_28%),radial-gradient(circle_at_80%_10%,_rgba(255,255,255,0.03),_transparent_24%)]" />
      <section className="border-b border-border">
        <div className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1fr_0.92fr] lg:items-center">
          <div className="max-w-2xl">
            <ScrollReveal direction="left">
              <p className="mb-4 text-xs font-medium uppercase tracking-widest text-accent">
                Account Access
              </p>
              <h1 className="mb-6 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                One login for the whole ecosystem.
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-text-secondary">
                Use your email address to access the shared account page. Admin users are routed to
                the lead inbox. Standard users land back on the public site.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={120}>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent-muted hover:bg-surface-raised"
                >
                  Back to C² HQ
                </Link>
                <Link
                  to="/admin/leads"
                  className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-accent transition-colors hover:text-accent-muted"
                >
                  Lead inbox
                </Link>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal direction="right" delay={140}>
            <div className="rounded-3xl border border-border bg-surface/95 p-8 shadow-2xl shadow-black/20 backdrop-blur">
              <div className="flex items-start gap-4">
                <LoginIcon />
                <div>
                  <p className="text-xs uppercase tracking-widest text-text-tertiary">Sign in</p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                    Account portal
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    Admin and user accounts use the same form.
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="mt-8 rounded-2xl border border-border bg-surface-raised p-6 text-sm text-text-secondary">
                  Checking session...
                </div>
              ) : sessionUser ? (
                <div className="mt-8 space-y-4 rounded-2xl border border-border bg-surface-raised p-6">
                  <p className="text-sm uppercase tracking-widest text-text-tertiary">
                    Signed in as
                  </p>
                  <div>
                    <p className="text-lg font-medium text-foreground">
                      {sessionUser.display_name || sessionUser.email}
                    </p>
                    <p className="text-sm text-text-secondary">{sessionUser.email}</p>
                    <p className="mt-2 text-xs uppercase tracking-widest text-text-tertiary">
                      {sessionUser.role}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm text-text-secondary transition-colors hover:text-text-primary"
                    >
                      {submitting ? 'Signing out...' : 'Sign out'}
                    </button>
                    <Link
                      to={sessionUser.role === 'admin' ? '/admin/leads' : '/'}
                      className="inline-flex items-center justify-center rounded-lg border border-accent/30 bg-accent-subtle px-4 py-2 text-sm text-accent transition-colors hover:border-accent/50"
                    >
                      Continue
                    </Link>
                  </div>
                </div>
              ) : (
                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-text-secondary">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition-colors placeholder:text-text-tertiary focus:border-accent/50"
                      placeholder="name@company.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-text-secondary">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition-colors placeholder:text-text-tertiary focus:border-accent/50"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  {error && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-200">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex w-full items-center justify-center rounded-xl border border-accent/30 bg-accent-subtle px-4 py-3 text-sm font-medium text-accent transition-colors hover:border-accent/50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? 'Signing in...' : 'Sign in'}
                  </button>
                </form>
              )}

              <div className="mt-6 border-t border-border pt-4 text-xs leading-relaxed text-text-tertiary">
                Admin access is controlled by the `user_accounts` table and the
                `ADMIN_EMAIL` / `ADMIN_PASSWORD` environment variables in Coolify.
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
