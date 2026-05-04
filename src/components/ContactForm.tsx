"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HoneypotField, useFormGuard } from "./FormGuard";

const subjects = [
  "Acoustic Guitar",
  "Cello",
  "Drums",
  "Electric Bass",
  "Electric Guitar",
  "Keyboard",
  "Music Production",
  "Music Theory",
  "Musical Theater (Voice)",
  "Saxophone",
  "Songwriting",
  "Spoken Word / Poetry",
  "Trumpet",
  "Ukulele",
  "Viola",
  "Violin",
  "Voice",
];

export default function ContactForm() {
  const router = useRouter();
  const guard = useFormGuard();
  const [formData, setFormData] = useState({
    studentFirstName: "",
    studentLastName: "",
    dob: "",
    lessonType: "",
    subjects: [] as string[],
    experience: "",
    parentFirstName: "",
    parentLastName: "",
    parentPhone: "",
    parentEmail: "",
    hearAboutUs: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubjectToggle(subject: string) {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (guard.isLikelyBot()) return;
    if (submitting) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...formData, ...guard.payload() }),
      });
      if (!res.ok) {
        throw new Error(`Submission failed (${res.status})`);
      }
      router.push("/thank-you");
    } catch (err) {
      console.error("Contact form submit error:", err);
      setSubmitError(
        "Something went wrong sending your message. Please try again or email info@wynwoodschoolofmusic.com."
      );
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full bg-white border border-gray-300 text-wsm-dark font-body text-sm py-2 px-3 focus:outline-none focus:border-wsm-accent transition-colors";
  const labelClass = "block font-body text-white text-sm font-semibold mb-1";
  const requiredBadge = (
    <span className="text-wsm-gray-dark text-xs font-normal ml-1">(required)</span>
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
          Student&apos;s Date of Birth {requiredBadge}
        </label>
        <p className="font-body text-wsm-gray-dark text-xs mb-2">
          Students under 6 years of age at the discretion of our teachers.
          <br />
          No students under 4 years of age.
        </p>
        <input
          type="date"
          name="dob"
          required
          value={formData.dob}
          onChange={handleChange}
          className={`${inputClass} max-w-[200px]`}
        />
      </div>

      {/* Lesson Type */}
      <div>
        <p className={labelClass}>
          Private lessons or a band program? {requiredBadge}
        </p>
        <p className="font-body text-wsm-gray-dark text-xs mb-3">
          Band programs require enrollment in private lessons.
        </p>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="lessonType"
              value="Private Lessons"
              required
              checked={formData.lessonType === "Private Lessons"}
              onChange={handleChange}
              className="accent-wsm-accent"
            />
            <span className="font-body text-wsm-gray text-sm group-hover:text-white transition-colors">
              Private Lessons
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="lessonType"
              value="Band and Private Lesson"
              checked={formData.lessonType === "Band and Private Lesson"}
              onChange={handleChange}
              className="accent-wsm-accent"
            />
            <span className="font-body text-wsm-gray text-sm group-hover:text-white transition-colors">
              Band and Private Lesson
            </span>
          </label>
        </div>
      </div>

      {/* Subjects */}
      <div>
        <p className={labelClass}>Subject(s) {requiredBadge}</p>
        <div className="mt-2 space-y-2">
          {subjects.map((subject) => (
            <label
              key={subject}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={formData.subjects.includes(subject)}
                onChange={() => handleSubjectToggle(subject)}
                className="accent-wsm-accent"
              />
              <span className="font-body text-wsm-gray text-sm group-hover:text-white transition-colors">
                {subject}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div>
        <label className={labelClass}>
          How many years of experience do you or your child have? {requiredBadge}
        </label>
        <input
          type="text"
          name="experience"
          required
          value={formData.experience}
          onChange={handleChange}
          className={`${inputClass} mt-2`}
        />
      </div>

      {/* Parent / Guardian Name */}
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

      {/* How did you hear about us */}
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
