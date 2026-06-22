import { Link } from "react-router-dom";

export default function Manifesto() {
  return (
    <div className="space-y-0">
      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-accent">
            Manifesto
          </p>
          <h1 className="mb-8 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Built to feel inevitable, not loud.
          </h1>

          <div className="space-y-8 text-base leading-relaxed text-text-secondary">
            <p className="text-lg">
              The tone is deliberate: premium, strategic, intelligent, mature, connected,
              trustworthy, architected. Nothing about the system should read as hustle culture,
              startup theater, or generic solar marketing.
            </p>

            <blockquote className="border-l-2 border-accent pl-6 italic text-foreground">
              C² operates as the root intelligence behind a connected ecosystem. It gives shape to
              effort, clarity to energy, and continuity to every deal that returns value to the
              whole.
            </blockquote>

            <h2 className="text-xl font-semibold tracking-tight text-foreground">Operating Principles</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>
                  <strong className="text-text-primary">Distinct branches:</strong> each audience gets a page
                  built for their role, not a watered-down generic message.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>
                  <strong className="text-text-primary">Shared standards:</strong> design, language, and trust
                  signals stay connected across the family.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>
                  <strong className="text-text-primary">Measured pathways:</strong> movement between
                  branches is clear, but never forced or salesy.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>
                  <strong className="text-text-primary">Reputation compounding:</strong> public education,
                  partner growth, and build quality reinforce one another.
                </span>
              </li>
            </ul>

            <h2 className="text-xl font-semibold tracking-tight text-foreground">The Cyclical System</h2>
            <p>
              The operating idea is cyclical. Effort becomes energy. Energy becomes deals. Deals
              return as energy. The result is a self-sustaining system in which public trust,
              partner growth, and field execution are designed to reinforce each other rather than
              compete for attention.
            </p>

            <p className="text-text-tertiary">
              This document is a living standard. It evolves as the ecosystem evolves, but its
              foundational tone — premium, strategic, architected — is permanent.
            </p>
          </div>
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
