"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HoneypotField, useFormGuard } from "./FormGuard";

const instruments = ["Voice", "Guitar", "Keyboard", "Bass", "Drums"];

const experienceLevels = [
  "Beginner (Less than 1 year)",
  "Intermediate (1-3 Years)",
  "Advanced (4+ Years)",
];

const sessions = [
  "Session A | June 15th - June 19th, 2026",
  "Session B | June 22nd - June 26th, 2026",
  "Session C | July 6th - July 10th, 2026",
  "Session D | July 13th - July 17th, 2026",
  "Session E | July 20th - July 24th, 2026",
  "Session F | July 27th - July 31st, 2026",
  "Session G | August 3rd - August 7th, 2026",
];

const genres = ["Rock", "Jazz", "Songwriting/Original Music", "Funk", "Pop"];

export default function CampSignupForm() {
  const router = useRouter();
  const guard = useFormGuard();
  const [formData, setFormData] = useState({
    studentFirstName: "",
    studentLastName: "",
    dob: "",
    instrument: "",
    experience: "",
    sessions: [] as string[],
    genres: [] as string[],
    parentFirstName: "",
    parentLastName: "",
    parentPhone: "",
    parentEmail: "",
    hearAboutUs: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function toggleArray(key: "sessions" | "genres", value: string) {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (guard.isLikelyBot()) return;
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/camp-signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...formData, ...guard.payload() }),
      });
      if (!res.ok) throw new Error(`Submission failed (${res.status})`);
      router.push("/summer-camp-thank-you");
    } catch (err) {
      console.error("Camp signup submit error:", err);
      setSubmitError(
        "Something went wrong sending your registration. Please try again or email info@wynwoodschoolofmusic.com."
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
        <p className={labelClass}>
          What is your primary instrument? {requiredBadge}
        </p>
        <div className="space-y-2 mt-2">
          {instruments.map((inst) => (
            <label
              key={inst}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                name="instrument"
                value={inst}
                required
                checked={formData.instrument === inst}
                onChange={handleChange}
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
          What is your current level of experience? {requiredBadge}
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

      {/* Sessions */}
      <div>
        <p className={labelClass}>
          Which session(s) would you like to sign up for? {requiredBadge}
        </p>
        <div className="space-y-2 mt-2">
          {sessions.map((session) => (
            <label
              key={session}
              className="flex items-start gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={formData.sessions.includes(session)}
                onChange={() => toggleArray("sessions", session)}
                className="mt-1 shrink-0 accent-wsm-accent"
              />
              <span className="font-body text-wsm-gray text-sm group-hover:text-white transition-colors">
                {session}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Genres */}
      <div>
        <p className={labelClass}>
          Which genres are you interested in exploring? {requiredBadge}
        </p>
        <div className="space-y-2 mt-2">
          {genres.map((genre) => (
            <label
              key={genre}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={formData.genres.includes(genre)}
                onChange={() => toggleArray("genres", genre)}
                className="accent-wsm-accent"
              />
              <span className="font-body text-wsm-gray text-sm group-hover:text-white transition-colors">
                {genre}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Parent Name */}
      <div>
        <p className={labelClass}>Parent / Guardian Name</p>
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

      {/* Parent Phone */}
      <div>
        <label className={labelClass}>
          Parent / Guardian Phone Number {requiredBadge}
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

      {/* Parent Email */}
      <div>
        <label className={labelClass}>
          Parent / Guardian Email {requiredBadge}
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

      {/* How did you hear */}
      <div>
        <label className={labelClass}>
          How did you hear about us? {requiredBadge}
        </label>
        <p className="font-body text-wsm-gray-dark text-xs mb-2">
          Referred by a friend, Facebook, Instagram, Google, Print Advertising, Other
        </p>
        <input
          type="text"
          name="hearAboutUs"
          required
          value={formData.hearAboutUs}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <HoneypotField value={guard.honeypot} onChange={guard.setHoneypot} />

      {/* Submit */}
      <div className="pt-4 text-center">
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
          {submitting ? "Sending…" : "Sign Up"}
        </button>
      </div>
    </form>
  );
}
