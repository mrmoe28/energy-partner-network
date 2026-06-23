import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";

export default function Architecture() {
  return (
    <div className="space-y-0">
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <ScrollReveal direction="left">
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-accent">
            Architecture
          </p>
          <h1 className="mb-8 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Ecosystem structure.
          </h1>

          <div className="max-w-2xl">
            <p className="text-lg leading-relaxed text-text-secondary">
              The C² ecosystem is organized around a single headquarters layer and three
              specialized branches. Each branch has a distinct audience, tone, and function. They are
              connected by shared standards, not by shared messaging.
            </p>
          </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Visual diagram */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <ScrollReveal direction="right">
          <p className="mb-10 text-xs font-medium uppercase tracking-widest text-text-tertiary">
            Layer Map
          </p>
          </ScrollReveal>

          <div className="flex flex-col items-center gap-8">
            {/* C² HQ */}
            <div className="w-full max-w-md">
              <ScrollReveal direction="left">
              <div className="rounded-xl border border-accent/30 bg-accent-subtle p-6 text-center">
                <p className="text-xs font-medium uppercase tracking-widest text-accent">Root</p>
                <p className="mt-1 text-lg font-semibold text-foreground">C² — Ecosystem HQ</p>
                <p className="mt-1 text-sm text-text-secondary">Philosophy, standards, coherence</p>
              </div>
              </ScrollReveal>
            </div>

            {/* Connector */}
            <div className="h-8 w-px bg-border-light" />

            {/* Branches */}
            <div className="grid w-full max-w-4xl gap-6 md:grid-cols-3">
              {[
                {
                  label: "01",
                  title: "Dealer Partner Network",
                  role: "Sales-side alignment",
                  href: "/dealer-partner",
                },
                {
                  label: "02",
                  title: "Build Partner Network",
                  role: "Field execution",
                  href: "/build-partner",
                },
                {
                  label: "03",
                  title: "Solar Partner Network",
                  role: "Public trust layer",
                  href: "/solar-partner",
                },
              ].map((b, index) => (
                <ScrollReveal key={b.label} direction={index % 2 === 0 ? 'left' : 'right'} delay={index * 80}>
                <Link
                  to={b.href}
                  className="group rounded-xl border border-border bg-surface p-6 text-center transition-all hover:border-accent-muted hover:bg-surface-raised"
                >
                  <p className="text-xs font-medium uppercase tracking-widest text-accent">{b.label}</p>
                  <p className="mt-2 text-base font-semibold text-foreground">{b.title}</p>
                  <p className="mt-1 text-sm text-text-secondary">{b.role}</p>
                </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cycle */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <ScrollReveal direction="left">
          <p className="mb-10 text-xs font-medium uppercase tracking-widest text-text-tertiary">
            The Energy Cycle
          </p>
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              {["Effort", "Energy", "Deals", "Trust", "Growth"].map((word, i, arr) => (
                <div key={word} className="flex items-center gap-4">
                  <span className="rounded-lg border border-border bg-surface px-4 py-2 font-medium text-foreground">
                    {word}
                  </span>
                  {i < arr.length - 1 && (
                    <svg className="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-10 text-center text-sm text-text-tertiary">
              The loop closes back on itself. Every deal returns value to the whole.
            </p>
          </div>
          </ScrollReveal>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-20">
          <ScrollReveal direction="right">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-accent"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Back to C² HQ
          </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
