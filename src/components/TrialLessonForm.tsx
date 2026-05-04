"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HoneypotField, useFormGuard } from "./FormGuard";

const instruments = [
  "Guitar",
  "Bass",
  "Drums",
  "Keyboard",
  "Voice",
  "Horns (Saxophone, Trumpet)",
  "Strings (Violin, Viola, Cello)",
  "Music Production",
];

const experienceLevels = [
  "Never Played",
  "Some Experience",
  "Currently Taking Lessons",
];

export default function TrialLessonForm() {
  const router = useRouter();
  const guard = useFormGuard();
  const [formData, setFormData] = useState({
    studentFirstName: "",
    studentLastName: "",
    dob: "",
    instrument: "",
    experience: "",
    parentFirstName: "",
    parentLastName: "",
    parentEmail: "",
    parentPhone: "",
    hearAboutUs: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (guard.isLikelyBot()) return;
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/trial-lesson", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...formData, ...guard.payload() }),
      });
      if (!res.ok) throw new Error(`Submission failed (${res.status})`);
      router.push("/your-trial");
    } catch (err) {
      console.error("Trial lesson form submit error:", err);
      setSubmitError(
        "Something went wrong sending your request. Please try again or email info@wynwoodschoolofmusic.com."
      );
      setSubmitting(false);
    }
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
      {/* Student Name */}
      <div>
        <p className={labelClass}>Student Name</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <label className="block font-body text-wsm-gray text-xs mb-1">
              First Name {requiredBadge}
            </label>
            <input
              type="text"
              name="studentFirstName"
              required
              value={formData.studentFirstName}
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
              name="studentLastName"
              required
              value={formData.studentLastName}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Date of Birth */}
      <div>
        <label className={labelClass}>
          Student Date of Birth {requiredBadge}
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

      {/* Instrument */}
      <div>
        <label className={labelClass}>Instrument {requiredBadge}</label>
        <select
          name="instrument"
          required
          value={formData.instrument}
          onChange={handleChange}
          className={`${inputClass} mt-2`}
        >
          <option value="">Select an Instrument from the Dropdown</option>
          {instruments.map((inst) => (
            <option key={inst} value={inst}>
              {inst}
            </option>
          ))}
        </select>
      </div>

      {/* Experience */}
      <div>
        <label className={labelClass}>
          Experience Level {requiredBadge}
        </label>
        <select
          name="experience"
          required
          value={formData.experience}
          onChange={handleChange}
          className={`${inputClass} mt-2`}
        >
          <option value="">Select an option</option>
          {experienceLevels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      {/* Parent Name */}
      <div>
        <p className={labelClass}>
          Parent / Guardian Name
          <span className="block text-wsm-gray-dark text-xs font-normal mt-1">
            If Student is Under 18 Years of Age
          </span>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <label className="block font-body text-wsm-gray text-xs mb-1">
              First Name {requiredBadge}
            </label>
            <input
              type="text"
              name="parentFirstName"
              required
              value={formData.parentFirstName}
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
              name="parentLastName"
              required
              value={formData.parentLastName}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Parent Email */}
      <div>
        <label className={labelClass}>
          Parent/Guardian Email {requiredBadge}
        </label>
        <input
          type="email"
          name="parentEmail"
          required
          value={formData.parentEmail}
          onChange={handleChange}
          className={`${inputClass} mt-2`}
        />
      </div>

      {/* Parent Phone */}
      <div>
        <label className={labelClass}>
          Parent/Guardian Phone {requiredBadge}
        </label>
        <input
          type="tel"
          name="parentPhone"
          required
          value={formData.parentPhone}
          onChange={handleChange}
          className={`${inputClass} mt-2`}
        />
      </div>

      {/* How did you hear about us */}
      <div>
        <label className={labelClass}>
          How Did You Hear About Us? {requiredBadge}
        </label>
        <input
          type="text"
          name="hearAboutUs"
          required
          value={formData.hearAboutUs}
          onChange={handleChange}
          className={`${inputClass} mt-2`}
        />
      </div>

      {/* Anything else */}
      <div>
        <label className={labelClass}>Anything Else?</label>
        <p className="font-body text-wsm-gray-dark text-xs mb-2">
          Let us know any additional information that can help us ensure the
          best trial experience for you!
        </p>
        <textarea
          name="notes"
          rows={3}
          value={formData.notes}
          onChange={handleChange}
          className={`${inputClass} resize-y`}
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
          {submitting ? "Sending…" : "Claim Your Free Trial Lesson"}
        </button>
      </div>
    </form>
  );
}
