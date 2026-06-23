import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-3">
            <p className="text-lg font-semibold tracking-tight">C²</p>
            <p className="text-sm leading-relaxed text-text-secondary">
              The root intelligence behind a connected ecosystem.
            </p>
          </div>

          {/* Branches */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-text-tertiary uppercase tracking-wider">Branches</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/dealer-partner" className="text-text-secondary hover:text-accent transition-colors">
                  Dealer Partner Network
                </Link>
              </li>
              <li>
                <Link to="/build-partner" className="text-text-secondary hover:text-accent transition-colors">
                  Build Partner Network
                </Link>
              </li>
              <li>
                <Link to="/solar-partner" className="text-text-secondary hover:text-accent transition-colors">
                  Solar Partner Network
                </Link>
              </li>
            </ul>
          </div>

          {/* Meta */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-text-tertiary uppercase tracking-wider">System</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/manifesto" className="text-text-secondary hover:text-accent transition-colors">
                  Manifesto
                </Link>
              </li>
              <li>
                <Link to="/architecture" className="text-text-secondary hover:text-accent transition-colors">
                  Architecture
                </Link>
              </li>
              <li>
                <Link to="/admin/leads" className="text-text-secondary hover:text-accent transition-colors">
                  Lead Inbox
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-xs text-text-muted">
            C² Ecosystem HQ. Built to feel inevitable, not loud.
          </p>
          <p className="text-xs text-text-muted">Prototype — first visible version.</p>
        </div>
      </div>
    </footer>
  );
}
