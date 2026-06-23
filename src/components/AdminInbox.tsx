'use client';

import { useEffect, useMemo, useState } from 'react';

type LeadSignup = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  company: string | null;
  phone: string | null;
  partner_interest: string;
  notes: string | null;
  lead_source: string;
  source_page: string | null;
  status: string;
  consent: boolean;
};

type ContactSubmission = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company: string | null;
  partner_type: string;
  message: string;
  status: string;
};

type DatasetKey = 'lead_signups' | 'contact_submissions';

const datasetMeta: Record<
  DatasetKey,
  { label: string; endpoint: string; emptyLabel: string }
> = {
  lead_signups: {
    label: 'Lead Signups',
    endpoint: '/api/lead-signups',
    emptyLabel: 'No lead signups yet.',
  },
  contact_submissions: {
    label: 'Contact Submissions',
    endpoint: '/api/contact-submissions',
    emptyLabel: 'No contact submissions yet.',
  },
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default function AdminInbox() {
  const [activeTab, setActiveTab] = useState<DatasetKey>('lead_signups');
  const [leadSignups, setLeadSignups] = useState<LeadSignup[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const [leadsResponse, contactsResponse] = await Promise.all([
          fetch(datasetMeta.lead_signups.endpoint, { credentials: 'include' }),
          fetch(datasetMeta.contact_submissions.endpoint, { credentials: 'include' }),
        ]);

        if (!leadsResponse.ok) {
          throw new Error('Unable to load lead signups.');
        }

        if (!contactsResponse.ok) {
          throw new Error('Unable to load contact submissions.');
        }

        const [leads, contacts] = await Promise.all([
          leadsResponse.json(),
          contactsResponse.json(),
        ]);

        if (!cancelled) {
          setLeadSignups(leads);
          setContactSubmissions(contacts);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load inbox.');
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

  const currentRows = activeTab === 'lead_signups' ? leadSignups : contactSubmissions;

  const stats = useMemo(() => {
    const leadCount = leadSignups.length;
    const contactCount = contactSubmissions.length;
    const newLeads = leadSignups.filter((item) => item.status === 'new').length;
    return { leadCount, contactCount, newLeads };
  }, [leadSignups, contactSubmissions]);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs uppercase tracking-widest text-text-tertiary">Lead Signups</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{stats.leadCount}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs uppercase tracking-widest text-text-tertiary">New Leads</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{stats.newLeads}</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs uppercase tracking-widest text-text-tertiary">Contact Messages</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{stats.contactCount}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {(Object.keys(datasetMeta) as DatasetKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              activeTab === key
                ? 'border-accent bg-accent-subtle text-accent'
                : 'border-border bg-surface text-text-secondary hover:text-text-primary'
            }`}
          >
            {datasetMeta[key].label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-2xl border border-border bg-surface p-8 text-sm text-text-secondary">
          Loading inbox...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-border bg-surface p-8 text-sm text-red-300">
          {error}
        </div>
      ) : currentRows.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-8 text-sm text-text-secondary">
          {datasetMeta[activeTab].emptyLabel}
        </div>
      ) : activeTab === 'lead_signups' ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-surface-raised">
                <tr className="text-left text-xs uppercase tracking-widest text-text-tertiary">
                  <th className="px-5 py-4 font-medium">Name</th>
                  <th className="px-5 py-4 font-medium">Email</th>
                  <th className="px-5 py-4 font-medium">Interest</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(currentRows as LeadSignup[]).map((row) => (
                  <tr key={row.id} className="align-top">
                    <td className="px-5 py-4">
                      <div className="font-medium text-foreground">{row.full_name}</div>
                      <div className="mt-1 text-xs text-text-tertiary">{row.company || 'No company'}</div>
                    </td>
                    <td className="px-5 py-4 text-sm text-text-secondary">{row.email}</td>
                    <td className="px-5 py-4 text-sm text-text-secondary">{row.partner_interest}</td>
                    <td className="px-5 py-4 text-sm text-text-secondary">{row.status}</td>
                    <td className="px-5 py-4 text-sm text-text-secondary">{formatDate(row.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {(currentRows as ContactSubmission[]).map((row) => (
            <div key={row.id} className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-base font-semibold text-foreground">{row.name}</p>
                  <p className="text-sm text-text-secondary">{row.email}</p>
                  <p className="text-xs text-text-tertiary">
                    {row.company || 'No company'} · {row.partner_type}
                  </p>
                </div>
                <p className="text-xs text-text-tertiary">{formatDate(row.created_at)}</p>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
                {row.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
