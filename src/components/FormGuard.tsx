"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Invisible spam protection. Two layers, zero UX friction:
 *
 *   1. Honeypot — a hidden input named "website" that real users never see.
 *      Scripted bots fill every field they encounter.
 *   2. Time-to-submit — bots fill forms in milliseconds; humans take seconds.
 *      We stamp render time and reject submissions that come back too fast.
 *
 * Both checks must also be enforced server-side once the API routes exist
 * (see FORMS.md). Client-side checks are belt-and-suspenders.
 */

const MIN_HUMAN_FILL_MS = 3_000;

export function useFormGuard() {
  // Stamp the render time after mount so it's pure during render.
  // Use a sentinel of 0 until the effect fires; isLikelyBot treats 0 as "not yet ready".
  const renderedAtRef = useRef<number>(0);
  useEffect(() => {
    if (renderedAtRef.current === 0) {
      renderedAtRef.current = Date.now();
    }
  }, []);
  const [honeypot, setHoneypot] = useState("");

  function isLikelyBot() {
    if (honeypot !== "") return true;
    if (renderedAtRef.current === 0) return true; // effect hasn't run; treat as too fast
    if (Date.now() - renderedAtRef.current < MIN_HUMAN_FILL_MS) return true;
    return false;
  }

  function payload() {
    return {
      website: honeypot,
      _renderedAt: renderedAtRef.current,
    };
  }

  return {
    honeypot,
    setHoneypot,
    isLikelyBot,
    payload,
  };
}

interface HoneypotFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function HoneypotField({ value, onChange }: HoneypotFieldProps) {
  return (
    <div
      aria-hidden="true"
      className="absolute left-[-9999px] top-auto w-px h-px overflow-hidden"
    >
      <label htmlFor="website-url-confirm">
        Leave this field blank
        <input
          id="website-url-confirm"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
}
