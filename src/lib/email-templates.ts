function esc(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = Array.isArray(value) ? value.join(", ") : String(value);
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fmtDate(value: unknown): string {
  if (typeof value !== "string" || !value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function nowET(): string {
  return new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function row(label: string, value: string): string {
  return `<tr><td style="padding:6px 12px 6px 0;color:#666;vertical-align:top;width:170px;font-weight:600;">${esc(label)}</td><td style="padding:6px 0;color:#111;">${value || "<span style='color:#bbb;'>—</span>"}</td></tr>`;
}

function section(title: string, rows: string[]): string {
  return `<h3 style="margin:24px 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#888;font-weight:600;">${esc(title)}</h3>
<table style="border-collapse:collapse;width:100%;font-size:14px;">${rows.join("")}</table>`;
}

function quickReply(name: string, phone: string, email: string): string {
  const parts: string[] = [];
  if (name) parts.push(`<strong style="color:#111;">${esc(name)}</strong>`);
  if (phone) parts.push(`<a href="tel:${esc(phone)}" style="color:#994878;text-decoration:none;font-weight:500;">${esc(phone)}</a>`);
  if (email) parts.push(`<a href="mailto:${esc(email)}" style="color:#994878;text-decoration:none;font-weight:500;">${esc(email)}</a>`);
  return `<div style="background:#fbf7f9;border:1px solid #e6d5dd;border-radius:6px;padding:14px 16px;margin-bottom:24px;">
    <div style="font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#994878;font-weight:700;margin-bottom:6px;">Reply to this lead</div>
    <div style="font-size:15px;line-height:1.6;">${parts.join("&nbsp;·&nbsp;")}</div>
  </div>`;
}

function shell(opts: { tag: string; headline: string; body: string }): string {
  return `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;font-size:14px;color:#111;max-width:640px;margin:0 auto;background:#fff;border:1px solid #eee;border-radius:8px;overflow:hidden;">
  <div style="background:#994878;color:#fff;padding:18px 24px;">
    <div style="font-size:11px;text-transform:uppercase;letter-spacing:1.5px;opacity:0.85;">${esc(opts.tag)}</div>
    <h1 style="margin:6px 0 0;font-size:22px;font-weight:700;">${esc(opts.headline)}</h1>
  </div>
  <div style="padding:24px;">${opts.body}</div>
  <div style="padding:14px 24px;border-top:1px solid #eee;color:#999;font-size:11px;">Submitted ${esc(nowET())} ET · wynwoodschoolofmusic.com</div>
</div>`;
}

function joinNonEmpty(...parts: unknown[]): string {
  return parts.map((p) => (typeof p === "string" ? p.trim() : "")).filter(Boolean).join(" ");
}

type AnyPayload = Record<string, unknown>;

// ─── Contact ────────────────────────────────────────────────────────────────

export function buildContactEmail(p: AnyPayload, studentAge: number | null) {
  const studentName = joinNonEmpty(p.studentFirstName, p.studentLastName) || "(no name)";
  const parentName = joinNonEmpty(p.parentFirstName, p.parentLastName);
  const subjects = Array.isArray(p.subjects) ? (p.subjects as unknown[]).map(String) : [];
  const subjectsLabel = subjects.length ? subjects.slice(0, 3).join(", ") + (subjects.length > 3 ? "…" : "") : "";

  const subject = `New WSM lead: ${studentName}${subjectsLabel ? ` — ${subjectsLabel}` : ""}`;

  const body = quickReply(parentName, String(p.parentPhone || ""), String(p.parentEmail || "")) +
    section("Student", [
      row("Name", esc(studentName)),
      row("Date of Birth", esc(fmtDate(p.dob))),
      row("Age", studentAge != null ? esc(String(studentAge)) : ""),
      row("Years of Experience", esc(p.experience)),
      row("Lesson Type", esc(p.lessonType)),
      row("Subjects", esc(subjects.join(", "))),
    ]) +
    section("Other", [
      row("How did they hear?", esc(p.hearAboutUs)),
    ]);

  return {
    subject,
    html: shell({ tag: "Contact form · /contact", headline: studentName, body }),
    replyTo: typeof p.parentEmail === "string" ? p.parentEmail : undefined,
  };
}

// ─── Repair ─────────────────────────────────────────────────────────────────

export function buildRepairEmail(p: AnyPayload) {
  const name = String(p.name || "(no name)");
  const services = Array.isArray(p.services) ? (p.services as unknown[]).map(String) : [];
  const subject = `New repair request: ${name}${services.length ? ` (${services.length} service${services.length === 1 ? "" : "s"})` : ""}`;

  const servicesHtml = services.length
    ? `<ul style="margin:6px 0 0;padding-left:20px;color:#111;">${services.map((s) => `<li style="margin-bottom:4px;">${esc(s)}</li>`).join("")}</ul>`
    : "<span style='color:#bbb;'>—</span>";

  const body = quickReply(name, String(p.phone || ""), String(p.email || "")) +
    section("Customer", [
      row("Name", esc(name)),
      row("Email", esc(p.email)),
      row("Phone", esc(p.phone)),
    ]) +
    `<h3 style="margin:24px 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#888;font-weight:600;">Services Requested</h3>${servicesHtml}`;

  return {
    subject,
    html: shell({ tag: "Repair request · /repair", headline: name, body }),
    replyTo: typeof p.email === "string" ? p.email : undefined,
  };
}

// ─── Camp ───────────────────────────────────────────────────────────────────

export function buildCampEmail(p: AnyPayload, studentAge: number | null) {
  const studentName = joinNonEmpty(p.studentFirstName, p.studentLastName) || "(no name)";
  const parentName = joinNonEmpty(p.parentFirstName, p.parentLastName);
  const sessions = Array.isArray(p.sessions) ? (p.sessions as unknown[]).map(String) : [];
  const genres = Array.isArray(p.genres) ? (p.genres as unknown[]).map(String) : [];
  const subject = `Summer Camp signup: ${studentName}${sessions.length ? ` (${sessions.length} session${sessions.length === 1 ? "" : "s"})` : ""}`;

  const sessionsHtml = sessions.length
    ? `<ul style="margin:6px 0 0;padding-left:20px;color:#111;">${sessions.map((s) => `<li style="margin-bottom:4px;">${esc(s)}</li>`).join("")}</ul>`
    : "<span style='color:#bbb;'>—</span>";

  const body = quickReply(parentName, String(p.parentPhone || ""), String(p.parentEmail || "")) +
    section("Student", [
      row("Name", esc(studentName)),
      row("Date of Birth", esc(fmtDate(p.dob))),
      row("Age", studentAge != null ? esc(String(studentAge)) : ""),
      row("Primary Instrument", esc(p.instrument)),
      row("Experience", esc(p.experience)),
      row("Genres", esc(genres.join(", "))),
    ]) +
    `<h3 style="margin:24px 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#888;font-weight:600;">Sessions Selected</h3>${sessionsHtml}` +
    section("Other", [
      row("How did they hear?", esc(p.hearAboutUs)),
    ]);

  return {
    subject,
    html: shell({ tag: "Summer Camp signup · /camp-signup", headline: studentName, body }),
    replyTo: typeof p.parentEmail === "string" ? p.parentEmail : undefined,
  };
}

// ─── WGV ────────────────────────────────────────────────────────────────────

export function buildWgvEmail(p: AnyPayload, studentAge: number | null) {
  const name = joinNonEmpty(p.firstName, p.lastName) || "(no name)";
  const instruments = Array.isArray(p.instruments) ? (p.instruments as unknown[]).map(String) : [];
  const subject = `Walt Grace lesson signup: ${name}${instruments.length ? ` — ${instruments.join(", ")}` : ""}`;

  const body = quickReply(name, String(p.phone || ""), String(p.email || "")) +
    section("Student", [
      row("Name", esc(name)),
      row("Email", esc(p.email)),
      row("Phone", esc(p.phone)),
      row("Date of Birth", esc(fmtDate(p.dob))),
      row("Age", studentAge != null ? esc(String(studentAge)) : ""),
      row("Instrument", esc(instruments.join(", "))),
      row("Experience", esc(p.experience)),
    ]) +
    (p.notes ? section("Additional Info", [row("Notes", esc(p.notes))]) : "");

  return {
    subject,
    html: shell({ tag: "Walt Grace signup · /wgv", headline: name, body }),
    replyTo: typeof p.email === "string" ? p.email : undefined,
  };
}

// ─── Trial Lesson ───────────────────────────────────────────────────────────

export function buildTrialEmail(p: AnyPayload, studentAge: number | null) {
  const studentName = joinNonEmpty(p.studentFirstName, p.studentLastName) || "(no name)";
  const parentName = joinNonEmpty(p.parentFirstName, p.parentLastName);
  const subject = `Trial lesson signup: ${studentName}${p.instrument ? ` — ${esc(p.instrument)}` : ""}`;

  const body = quickReply(parentName, String(p.parentPhone || ""), String(p.parentEmail || "")) +
    section("Student", [
      row("Name", esc(studentName)),
      row("Date of Birth", esc(fmtDate(p.dob))),
      row("Age", studentAge != null ? esc(String(studentAge)) : ""),
      row("Instrument", esc(p.instrument)),
      row("Experience", esc(p.experience)),
    ]) +
    section("Other", [
      row("How did they hear?", esc(p.hearAboutUs)),
    ]) +
    (p.notes ? section("Additional Info", [row("Anything else?", esc(p.notes))]) : "");

  return {
    subject,
    html: shell({ tag: "Trial lesson signup · /trial-music-lesson", headline: studentName, body }),
    replyTo: typeof p.parentEmail === "string" ? p.parentEmail : undefined,
  };
}
