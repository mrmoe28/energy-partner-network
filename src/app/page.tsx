import { Link } from "react-router-dom";
import BranchCard from "@/components/BranchCard";

const branches = [
  {
    href: "/dealer-partner",
    label: "01",
    title: "Dealer Partner Network",
    description:
      "Partner acquisition, onboarding, disciplined growth, and sales-side alignment. Recruiting without hype, pressure, or bro culture.",
  },
  {
    href: "/build-partner",
    label: "02",
    title: "Build Partner Network",
    description:
      "Execution, fulfillment, quality standards, field trust, and operational credibility. Presented with trade respect and structure.",
  },
  {
    href: "/solar-partner",
    label: "03",
    title: "Solar Partner Network",
    description:
      "Public education, editorial trust, ecosystem explanation, and thought leadership. Designed to inform first and sell never.",
  },
];

export default function Home() {
  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-accent">
              Architectural Center
            </p>
            <h1 className="mb-6 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              The system behind the system.
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-text-secondary">
              C² is not the public storefront. It is the headquarters layer: the place where
              philosophy, standards, partner structure, and energy flow are held together with
              intention.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/architecture"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent-muted hover:bg-surface-raised"
              >
                View ecosystem architecture
              </Link>
              <Link
                to="/manifesto"
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-accent transition-colors hover:text-accent-muted"
              >
                Read the manifesto
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="mt-8 inline-flex items-center rounded-full border border-accent/20 bg-accent-subtle px-4 py-2 text-sm text-text-secondary">
              <a
                href="https://energy-partner-network.lock28.com"
                className="font-medium text-foreground underline decoration-accent/40 underline-offset-4 transition-colors hover:text-accent"
                target="_blank"
                rel="noreferrer"
              >
                energy-partner-network.lock28.com
              </a>
            </div>
          </div>
        </div>

        {/* Decorative */}
        <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-1/3 md:block">
          <div className="absolute right-12 top-12 h-64 w-64 rounded-full bg-accent/[0.03] blur-3xl" />
          <div className="absolute bottom-12 right-32 h-48 w-48 rounded-full bg-accent/[0.02] blur-2xl" />
        </div>
      </section>

      {/* System Logic */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="mb-10 text-xs font-medium uppercase tracking-widest text-text-tertiary">
            System Logic
          </p>
          <h2 className="mb-8 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            An ecosystem, not a stack of pages.
          </h2>
          <p className="mb-12 max-w-2xl text-base leading-relaxed text-text-secondary">
            The operating idea is cyclical. Effort becomes energy. Energy becomes deals. Deals
            return as energy. The result is a self-sustaining system in which public trust, partner
            growth, and field execution are designed to reinforce each other rather than compete
            for attention.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Trust",
                body: "Public-facing education establishes credibility before anyone is asked to commit.",
              },
              {
                step: "02",
                title: "Partners",
                body: "Recruitment is structured around maturity, fit, and durable performance, not noise.",
              },
              {
                step: "03",
                title: "Execution",
                body: "Build quality closes the loop and protects the reputation of the entire ecosystem.",
              },
            ].map((item) => (
              <div key={item.step} className="rounded-xl border border-border bg-surface p-6">
                <p className="mb-3 text-xs font-medium uppercase tracking-widest text-accent">
                  {item.step}
                </p>
                <h3 className="mb-2 text-lg font-semibold tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-text-secondary">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Locked Architecture */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="mb-10 text-xs font-medium uppercase tracking-widest text-text-tertiary">
            Locked Architecture
          </p>
          <h2 className="mb-8 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Each branch has a job. C² keeps the jobs aligned.
          </h2>
          <p className="mb-12 max-w-2xl text-base leading-relaxed text-text-secondary">
            The architecture only works when each layer is distinct in tone and purpose. C² does
            not compete with its branches for attention. It governs them. That creates a stronger
            family resemblance and clearer pathways for different audiences.
          </p>

          <div className="flex flex-wrap gap-3">
            {[
              "HQ, not storefront",
              "Premium trust layer",
              "Architected growth",
            ].map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-text-secondary"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Priority Order */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="mb-10 text-xs font-medium uppercase tracking-widest text-text-tertiary">
            Priority Order
          </p>
          <ol className="space-y-4">
            {[
              "C² establishes philosophy and system confidence.",
              "DPN brings in aligned dealer organizations.",
              "BPN proves execution standards in the field.",
              "SPN sustains public trust and ongoing education.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent/30 text-xs font-medium text-accent">
                  {i + 1}
                </span>
                <span className="text-base text-text-secondary">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Branches */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="mb-10 text-xs font-medium uppercase tracking-widest text-text-tertiary">
            Connected Branches
          </p>
          <h2 className="mb-10 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Clear identities. Distinct roles.
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {branches.map((b) => (
              <BranchCard key={b.href} {...b} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
