import { Link } from "react-router-dom";
import AdminInbox from "@/components/AdminInbox";
import ScrollReveal from "@/components/ScrollReveal";

export default function AdminLeadsPage() {
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
                Review entries captured from the public forms. This route is protected by basic
                authentication at the server layer.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <ScrollReveal direction="right">
            <AdminInbox />
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
