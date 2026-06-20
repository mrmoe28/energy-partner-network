import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "C² | Build Partner Network",
  description:
    "Operational credibility. Execution standards, field trust, and fulfillment maturity presented with trade respect and structure.",
};

export default function BuildPartner() {
  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-accent">
              02 — Build Partner Network
            </p>
            <h1 className="mb-6 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Operational credibility.
            </h1>
            <p className="text-lg leading-relaxed text-text-secondary">
              Execution standards, field trust, and fulfillment maturity presented with trade respect
              and structure.
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
                title: "Execution Standards",
                body: "Documented, repeatable processes for every phase of installation. Quality is not assumed — it is verified, measured, and continuously refined.",
              },
              {
                title: "Field Trust",
                body: "Build partners are the hands of the brand. Their workmanship, professionalism, and communication directly shape customer perception.",
              },
              {
                title: "Quality Verification",
                body: "Inspection protocols, photo documentation, and post-install reviews create accountability without micromanagement.",
              },
              {
                title: "Fulfillment Maturity",
                body: "Scheduling, material flow, crew coordination, and customer communication are treated as systems, not improvisations.",
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
              The Build Partner Network is where promises become physical reality. It is not a
              contractor directory — it is a curated execution layer where quality, communication,
              and operational discipline are non-negotiable.
            </p>
            <div className="flex flex-wrap gap-3">
              {["Verified workmanship", "Repeatable processes", "Post-install reviews", "Trade respect"].map((tag) => (
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
              href="/dealer-partner"
              className="inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-accent"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Dealer Partner Network
            </Link>
            <Link
              href="/solar-partner"
              className="inline-flex items-center gap-2 text-sm text-accent transition-colors hover:text-accent-muted"
            >
              Solar Partner Network
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
