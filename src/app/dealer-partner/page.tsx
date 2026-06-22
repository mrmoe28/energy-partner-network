import { Link } from "react-router-dom";

export default function DealerPartner() {
  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-accent">
              01 — Dealer Partner Network
            </p>
            <h1 className="mb-6 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Serious partner growth.
            </h1>
            <p className="text-lg leading-relaxed text-text-secondary">
              Recruiting and onboarding for dealers and sales organizations without hype, pressure,
              or bro culture.
            </p>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="mb-10 text-xs font-medium uppercase tracking-widest text-text-tertiary">
            Core Functions
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                title: "Partner Acquisition",
                body: "Structured outreach to dealer organizations with aligned values and operational maturity. No volume-for-volume's-sake recruiting.",
              },
              {
                title: "Onboarding Discipline",
                body: "A clear, repeatable process that sets expectations, trains systems, and verifies readiness before any partner represents the brand.",
              },
              {
                title: "Growth Guardrails",
                body: "Expansion is tied to performance data and relationship health. Fast growth that erodes trust is treated as a failure mode.",
              },
              {
                title: "Sales-Side Alignment",
                body: "Every dealer partner is trained on the same standards, messaging, and ethical boundaries that protect the ecosystem's reputation.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-border bg-surface p-6">
                <h3 className="mb-2 text-lg font-semibold tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-text-secondary">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Positioning */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="mb-10 text-xs font-medium uppercase tracking-widest text-text-tertiary">
            Positioning
          </p>
          <div className="max-w-2xl">
            <p className="mb-6 text-lg leading-relaxed text-text-secondary">
              The Dealer Partner Network does not chase every sales organization that will sign a
              contract. It selects for maturity, operational discipline, and cultural fit. The
              result is a partner base that strengthens the brand instead of diluting it.
            </p>
            <div className="flex flex-wrap gap-3">
              {["Maturity-first recruiting", "Performance-based growth", "Ethical guardrails", "Shared standards"].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-text-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-accent"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Back to C² HQ
            </Link>
            <Link
              to="/build-partner"
              className="inline-flex items-center gap-2 text-sm text-accent transition-colors hover:text-accent-muted"
            >
              Build Partner Network
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
