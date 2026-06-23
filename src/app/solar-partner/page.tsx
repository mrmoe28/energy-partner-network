import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";

export default function SolarPartner() {
  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <ScrollReveal direction="left">
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-accent">
              03 — Solar Partner Network
            </p>
            <h1 className="mb-6 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Public trust layer.
            </h1>
            <p className="text-lg leading-relaxed text-text-secondary">
              Editorial education and ecosystem explanation designed to inform first and sell never.
            </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <ScrollReveal direction="right">
          <p className="mb-10 text-xs font-medium uppercase tracking-widest text-text-tertiary">
            Core Functions
          </p>
          </ScrollReveal>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                title: "Public Education",
                body: "Clear, honest content that helps homeowners and businesses understand solar without pressure, gimmicks, or hidden agendas.",
              },
              {
                title: "Editorial Trust",
                body: "Every piece of content is written to earn credibility, not clicks. Transparency and accuracy are higher priorities than conversion rate.",
              },
              {
                title: "Ecosystem Explanation",
                body: "The public deserves to know how the system works — who builds, who sells, who stands behind the work, and why that structure matters.",
              },
              {
                title: "Thought Leadership",
                body: "Positioning the brand as a source of genuine insight on energy, policy, technology, and industry trends — not just another installer voice.",
              },
            ].map((item, index) => (
              <ScrollReveal key={item.title} direction={index % 2 === 0 ? 'left' : 'right'} delay={index * 80}>
              <div className="rounded-xl border border-border bg-surface p-6">
                <h3 className="mb-2 text-lg font-semibold tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-text-secondary">{item.body}</p>
              </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Positioning */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <ScrollReveal direction="left">
          <p className="mb-10 text-xs font-medium uppercase tracking-widest text-text-tertiary">
            Positioning
          </p>
          <div className="max-w-2xl">
            <p className="mb-6 text-lg leading-relaxed text-text-secondary">
              The Solar Partner Network is the public face of the ecosystem. It does not sell —
              it explains. It does not push — it earns. The trust built here makes every other
              branch more effective, because the public already knows what the system stands for
              before they meet a dealer or a build crew.
            </p>
            <div className="flex flex-wrap gap-3">
              {["Inform-first content", "No sales pressure", "Transparent structure", "Earned credibility"].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-text-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Navigation */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-20">
          <ScrollReveal direction="right">
          <div className="flex items-center justify-between">
            <Link
              to="/build-partner"
              className="inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-accent"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Build Partner Network
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-accent transition-colors hover:text-accent-muted"
            >
              Back to C² HQ
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
