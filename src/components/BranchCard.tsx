import Link from "next/link";

interface BranchCardProps {
  href: string;
  label: string;
  title: string;
  description: string;
}

export default function BranchCard({ href, label, title, description }: BranchCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-xl border border-border bg-surface p-8 transition-all duration-300 hover:border-accent-muted hover:bg-surface-raised"
    >
      <div className="mb-4 inline-flex items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-widest text-accent">
          {label}
        </span>
        <svg
          className="h-4 w-4 text-accent opacity-0 transition-opacity group-hover:opacity-100"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
      <h3 className="mb-3 text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-text-secondary">{description}</p>
    </Link>
  );
}
