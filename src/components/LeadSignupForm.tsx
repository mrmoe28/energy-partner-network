'use client';

import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

type LeadFormData = {
  fullName: string;
  email: string;
  company: string;
  phone: string;
  partnerInterest: string;
  notes: string;
};

const initialFormState: LeadFormData = {
  fullName: '',
  email: '',
  company: '',
  phone: '',
  partnerInterest: '',
  notes: '',
};

export default function LeadSignupForm() {
  const location = useLocation();
  const [formData, setFormData] = useState<LeadFormData>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ success?: boolean; message?: string } | null>(
    null,
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const { error } = await supabase.from('lead_signups').insert([
        {
          full_name: formData.fullName,
          email: formData.email,
          company: formData.company || null,
          phone: formData.phone || null,
          partner_interest: formData.partnerInterest,
          notes: formData.notes || null,
          source_page: location.pathname,
          lead_source: 'website',
        },
      ]);

      if (error) {
        throw new Error(error.message);
      }

      setSubmitStatus({
        success: true,
        message: 'Submission received. We will follow up soon.',
      });
      setFormData(initialFormState);
    } catch (error) {
      console.error('Error submitting lead signup:', error);
      setSubmitStatus({
        success: false,
        message: 'There was an error saving your submission. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-surface p-6 md:p-8">
      {submitStatus && (
        <div
          className={`rounded-xl px-4 py-3 text-sm ${
            submitStatus.success
              ? 'bg-emerald-500/10 text-emerald-300'
              : 'bg-red-500/10 text-red-300'
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="fullName" className="block text-sm font-medium text-text-secondary">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Your full name"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-text-secondary">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="company" className="block text-sm font-medium text-text-secondary">
            Company
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Company or organization"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-medium text-text-secondary">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Optional"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="partnerInterest" className="block text-sm font-medium text-text-secondary">
          I’m interested in
        </label>
        <select
          id="partnerInterest"
          name="partnerInterest"
          value={formData.partnerInterest}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <option value="">Select an option</option>
          <option value="dealer-partner">Dealer Partner Network</option>
          <option value="build-partner">Build Partner Network</option>
          <option value="solar-partner">Solar Partner Network</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="block text-sm font-medium text-text-secondary">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          placeholder="Tell us what you’re looking for"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-lg bg-accent px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-accent-muted disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Submitting...' : 'Join the list'}
      </button>
    </form>
  );
}
