"use client";

import { useState } from "react";
import posthog from "posthog-js";
import { HoneypotField, useFormGuard } from "./FormGuard";

const instruments = ["Guitar", "Bass", "Ukulele"];

const experienceLevels = [
  "Beginner (Less than 1 Year)",
  "Intermediate (1-3 years)",
  "Advanced (4+ Years)",
];

export default function WgvForm() {
  const guard = useFormGuard();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    dob: "",
    instruments: [] as string[],
    experience: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function toggleInstrument(value: string) {
    setFormData((prev) => ({
      ...prev,
      instruments: prev.instruments.includes(value)
        ? prev.instruments.filter((v) => v !== value)
        : [...prev.instruments, value],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (guard.isLikelyBot()) return;
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/wgv", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...formData, ...guard.payload() }),
      });
      if (!res.ok) throw new Error(`Submission failed (${res.status})`);
      posthog.capture("form_submitted", { form: "wgv" });
      setSubmitted(true);
    } catch (err) {
      console.error("WGV form submit error:", err);
      setSubmitError(
        "Something went wrong sending your signup. Please try again or email info@wynwoodschoolofmusic.com."
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
          We&apos;ll be in touch within 24 hours to schedule your free lesson.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full bg-white border border-gray-300 text-wsm-dark font-body text-sm py-2 px-3 focus:outline-none focus:border-wsm-accent transition-colors";
  const labelClass = "block font-body text-white text-sm font-semibold mb-1";
  const requiredBadge = (
    <span className="text-wsm-gray-dark text-xs font-normal ml-1">
      (required)
    </span>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <p className={labelClass}>Name</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <label className="block font-body text-wsm-gray text-xs mb-1">
              First Name {requiredBadge}
            </label>
            <input
              type="text"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block font-body text-wsm-gray text-xs mb-1">
              Last Name {requiredBadge}
            </label>
            <input
              type="text"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Phone */}
      <div>
        <label className={labelClass}>
          Phone Number {requiredBadge}
        </label>
        <input
          type="tel"
          name="phone"
          required
          value={formData.phone}
          onChange={handleChange}
          className={`${inputClass} mt-2`}
        />
      </div>

      {/* Email */}
      <div>
        <label className={labelClass}>
          Email {requiredBadge}
        </label>
        <input
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className={`${inputClass} mt-2`}
        />
      </div>

      {/* DOB */}
      <div>
        <label className={labelClass}>
          Date of Birth {requiredBadge}
        </label>
        <input
          type="date"
          name="dob"
          required
          value={formData.dob}
          onChange={handleChange}
          className={`${inputClass} max-w-[200px] mt-2`}
        />
      </div>

      {/* Instruments */}
      <div>
        <p className={labelClass}>
          Which instrument would you like to begin lessons on? {requiredBadge}
        </p>
        <div className="space-y-2 mt-2">
          {instruments.map((inst) => (
            <label
              key={inst}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={formData.instruments.includes(inst)}
                onChange={() => toggleInstrument(inst)}
                className="accent-wsm-accent"
              />
              <span className="font-body text-wsm-gray text-sm group-hover:text-white transition-colors">
                {inst}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div>
        <p className={labelClass}>
          What is your current level of experience on that instrument?{" "}
          {requiredBadge}
        </p>
        <div className="space-y-2 mt-2">
          {experienceLevels.map((level) => (
            <label
              key={level}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                name="experience"
                value={level}
                required
                checked={formData.experience === level}
                onChange={handleChange}
                className="accent-wsm-accent"
              />
              <span className="font-body text-wsm-gray text-sm group-hover:text-white transition-colors">
                {level}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Notes (textarea) */}
      <div>
        <label className={labelClass}>
          Any questions or additional information you would like to provide?
        </label>
        <textarea
          name="notes"
          rows={4}
          value={formData.notes}
          onChange={handleChange}
          className={`${inputClass} mt-2 resize-y`}
        />
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
