import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminInbox from "@/components/AdminInbox";
import ScrollReveal from "@/components/ScrollReveal";
import { fetchSession, type SessionUser } from "@/lib/session";

export default function AdminLeadsPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const session = await fetchSession();
        if (!cancelled) {
          setUser(session.user && session.user.role === 'admin' ? session.user : null);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
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

  return (
    <div className="space-y-0">
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <ScrollReveal direction="left">
              <p className="mb-4 text-xs font-medium uppercase tracking-widest text-accent">
                Admin Lead Inbox
              </p>
              <h1 className="mb-6 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                Captured leads and contact submissions.
              </h1>
              <p className="text-lg leading-relaxed text-text-secondary">
                Review entries captured from the public forms. This route is protected by the
                shared email login at the server layer.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <ScrollReveal direction="right">
            {loading ? (
              <div className="rounded-2xl border border-border bg-surface p-8 text-sm text-text-secondary">
                Checking access...
              </div>
            ) : user ? (
              <AdminInbox />
            ) : (
              <div className="rounded-3xl border border-border bg-surface p-8 md:p-10">
                <p className="text-xs font-medium uppercase tracking-widest text-accent">
                  Sign in required
                </p>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
                  Use the shared login page to access the inbox.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-secondary">
                  The admin inbox is protected by an email login. Use the profile icon in the top
                  right or open the account page directly.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/login?next=/admin/leads"
                    className="inline-flex items-center gap-2 rounded-lg border border-accent/30 bg-accent-subtle px-5 py-2.5 text-sm font-medium text-accent transition-colors hover:border-accent/50"
                  >
                    Go to login
                  </Link>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-raised px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent-muted hover:bg-surface-elevated"
                  >
                    Back to C² HQ
                  </Link>
                </div>
              </div>
            )}
          </ScrollReveal>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-accent"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Back to C² HQ
          </Link>
        </div>
      </section>
    </div>
  );
}
