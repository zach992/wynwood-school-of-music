"use client";

import { useState } from "react";
import posthog from "posthog-js";
import { HoneypotField, useFormGuard } from "./FormGuard";

const services = [
  "Guitar/Bass Restringing - $30 (+$5 Non-Standard Tuning System)",
  "Basic Setup - $70 (+$10 Non-Standard Setup)",
  "Detailed Setup - $110",
  "5-Way Switch Replacement - $50",
  "Bridge Reglue - $150",
  "Crack Repair - $40 per inch",
  "Hardware Cleaning - $45",
  "Headstock Repair - Custom (estimate after inspection)",
  "Install Single Tuning Machine - $15",
  "Install Tuning Machine Set - $65",
  "Jack Repair - $35",
  "Level, Crown, Repolish - $140",
  "Nut Replacement - $120",
  "Pickguard + Electronics - $35",
  "Pickup Install (Acoustic Guitar) - $100",
  "Set of Pickups Install (Electric Guitar) - $75",
  "Single Pickup Install (Electric Guitar) - $50",
  "Single Pot Replacement - $35",
  "Standard Switch Replacement - $45",
  "Strap Button Install - $30",
  "Wiring - $30 per Wire (Capped at $135)",
];

export default function RepairForm() {
  const guard = useFormGuard();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    services: [] as string[],
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleCheckbox(service: string) {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (guard.isLikelyBot()) return;
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/repair", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...formData, ...guard.payload() }),
      });
      if (!res.ok) throw new Error(`Submission failed (${res.status})`);
      posthog.capture("form_submitted", { form: "repair" });
      setSubmitted(true);
    } catch (err) {
      console.error("Repair form submit error:", err);
      setSubmitError(
        "Something went wrong submitting your request. Please try again or email info@wynwoodschoolofmusic.com."
      );
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-12">
        <h3 className="font-heading text-2xl uppercase font-black text-white mb-4">
          Thank You!
        </h3>
        <p className="font-body text-wsm-gray">
          Your repair inquiry has been submitted. We&apos;ll be in touch soon!
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name and Email row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-body text-wsm-gray text-sm mb-2">
            Name <span className="text-wsm-accent">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-wsm-gray-dark text-white font-body text-sm py-2 focus:outline-none focus:border-wsm-accent transition-colors"
          />
        </div>
        <div>
          <label className="block font-body text-wsm-gray text-sm mb-2">
            Email <span className="text-wsm-accent">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-wsm-gray-dark text-white font-body text-sm py-2 focus:outline-none focus:border-wsm-accent transition-colors"
          />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label className="block font-body text-wsm-gray text-sm mb-2">
          Phone <span className="text-wsm-accent">*</span>
        </label>
        <input
          type="tel"
          name="phone"
          required
          value={formData.phone}
          onChange={handleChange}
          className="w-full bg-transparent border-b border-wsm-gray-dark text-white font-body text-sm py-2 focus:outline-none focus:border-wsm-accent transition-colors md:w-1/2"
        />
      </div>

      {/* Services checkboxes */}
      <div>
        <label className="block font-body text-wsm-gray text-sm mb-1">
          Which Repair Services Are You Inquiring About?{" "}
          <span className="text-wsm-accent">*</span>
        </label>
        <p className="font-body text-wsm-gray-dark text-xs mb-4">
          Select all that apply.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {services.map((service) => (
            <label
              key={service}
              className="flex items-start gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={formData.services.includes(service)}
                onChange={() => handleCheckbox(service)}
                className="mt-1 shrink-0 accent-wsm-accent"
              />
              <span className="font-body text-wsm-gray text-sm group-hover:text-white transition-colors">
                {service}
              </span>
            </label>
          ))}
        </div>
      </div>

      <HoneypotField value={guard.honeypot} onChange={guard.setHoneypot} />

      {/* Submit */}
      <div className="pt-4">
        {submitError && (
          <p className="font-body text-red-300 text-sm mb-4" role="alert">
            {submitError}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="inline-block rounded-full bg-wsm-accent text-white px-10 py-3 text-sm font-semibold uppercase tracking-wider hover:bg-wsm-accent-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting…" : "Submit"}
        </button>
      </div>
    </form>
  );
}
