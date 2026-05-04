"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "./CampUrgencyBar.css";

const DEADLINE = new Date("2026-05-15T23:59:59-04:00").getTime();
const pad = (n: number) => String(n).padStart(2, "0");

export default function CampUrgencyBar() {
  const pathname = usePathname();
  const [countdown, setCountdown] = useState({ d: "00", h: "00", m: "00", s: "00" });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const tick = () => {
      const remaining = DEADLINE - Date.now();
      if (remaining <= 0) {
        setExpired(true);
        setCountdown({ d: "00", h: "00", m: "00", s: "00" });
        return;
      }
      let diff = remaining;
      const d = Math.floor(diff / 864e5); diff -= d * 864e5;
      const h = Math.floor(diff / 36e5); diff -= h * 36e5;
      const m = Math.floor(diff / 6e4); diff -= m * 6e4;
      const s = Math.floor(diff / 1e3);
      setCountdown({ d: pad(d), h: pad(h), m: pad(m), s: pad(s) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (pathname !== "/musicperformancecamp") return null;
  if (expired) return null;

  return (
    <div className="wsm-urgency">
      <div className="wsm-urgency-inner">
        <span className="wsm-urgency-label">Early Bird Ends May 15 — Save $50 per week</span>
        <span className="wsm-urgency-count">
          <span><b>{countdown.d}</b><small>Days</small></span>
          <span><b>{countdown.h}</b><small>Hrs</small></span>
          <span><b>{countdown.m}</b><small>Min</small></span>
          <span><b>{countdown.s}</b><small>Sec</small></span>
        </span>
        <a href="/musicperformancecamp#sessions" className="wsm-urgency-cta">Reserve now →</a>
      </div>
    </div>
  );
}
