"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Session = {
  code: string;
  dates: string;
  month: string;
  capacity: number;
  sold: number;
  flag?: string;
  bridge?: boolean;
  full?: boolean;
  priceOverride?: number;
};

const SESSIONS: Session[] = [
  { code: "A", dates: "June 15 – June 19", month: "Jun", capacity: 24, sold: 13 },
  { code: "B", dates: "June 22 – June 26", month: "Jun", capacity: 24, sold: 16 },
  { code: "B.5", dates: "June 29 – July 3", month: "Jun/Jul", capacity: 24, sold: 5, flag: "New! Bridge Week", bridge: true, priceOverride: 375 },
  { code: "C", dates: "July 6 – July 10", month: "Jul", capacity: 24, sold: 11 },
  { code: "D", dates: "July 13 – July 17", month: "Jul", capacity: 24, sold: 8 },
  { code: "E", dates: "July 20 – July 24", month: "Jul", capacity: 24, sold: 14 },
  { code: "F", dates: "July 27 – July 31", month: "Jul", capacity: 24, sold: 9 },
  { code: "G", dates: "August 3 – August 7", month: "Aug", capacity: 24, sold: 6 },
];

const BASE_EARLY = 375;
const BASE_STANDARD = 425;

const Check = () => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M5 12l5 5 9-11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function CampPageClient() {
  const [pricingMode, setPricingMode] = useState<"early" | "standard">("early");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [emailDone, setEmailDone] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll reveal observer
  useEffect(() => {
    if (!containerRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    containerRef.current.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const basePrice = pricingMode === "early" ? BASE_EARLY : BASE_STANDARD;

  const priceFor = (s: Session) => {
    if (s.priceOverride && pricingMode === "early") return s.priceOverride;
    if (s.bridge && pricingMode === "standard") return 400;
    return basePrice;
  };

  const picks = useMemo(
    () => SESSIONS.filter((s) => selected.has(s.code)),
    [selected]
  );

  const cart = useMemo(() => {
    const base = picks.reduce((sum, p) => sum + priceFor(p), 0);
    let bundleDiscount = 0;
    if (picks.length === 2) bundleDiscount = 25 * picks.length;
    else if (picks.length >= 3) bundleDiscount = 50 * picks.length;
    const total = base - bundleDiscount;
    const deposit = Math.round(total / 2);
    return { base, bundleDiscount, total, deposit };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picks, pricingMode]);

  const toggleSession = (s: Session) => {
    if (s.full) {
      alert("This session is full. Join the waitlist by signing up for camp updates below.");
      return;
    }
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(s.code)) next.delete(s.code);
      else next.add(s.code);
      return next;
    });
  };

  const closeModal = () => setModalOpen(false);

  return (
    <div className="camp-page" ref={containerRef}>
      {/* ===== Hero ===== */}
      <header className="hero">
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="hero-eyebrow">
                <span className="tick" />
                <span className="eyebrow">Music Performance Camp · Summer 2026</span>
              </div>
              <h1 className="display h1">
                Your child<br />steps on<br /><em>the stage.</em>
              </h1>
              <p className="hero-sub">
                A week-long, fully immersive camp where 8–14 year-olds learn like real musicians — band rehearsals, sectionals, workshops, and a live Friday showcase in the heart of Wynwood.
              </p>
              <div className="hero-ctas">
                <a href="#sessions" className="btn btn-primary">Reserve a Session <span className="arrow">→</span></a>
                <a href="#how-it-works" className="btn btn-ghost">How it works</a>
              </div>
              <div className="hero-facts">
                <div className="hero-fact">
                  <div className="label">Ages</div>
                  <div className="value">8 – 14</div>
                </div>
                <div className="hero-fact">
                  <div className="label">Hours</div>
                  <div className="value">9 AM – 3:30 PM</div>
                </div>
                <div className="hero-fact">
                  <div className="label">Per Week</div>
                  <div className="value"><s style={{ opacity: 0.5, fontSize: 18 }}>$425</s> $375*</div>
                </div>
                <div className="hero-fact">
                  <div className="label">Location</div>
                  <div className="value">Wynwood, Miami</div>
                </div>
              </div>
            </div>
            <div className="hero-video">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80"
                alt="Young musicians on stage"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
              />
              <button
                className="play"
                aria-label="Play highlight reel"
                onClick={() => alert("Demo only — would open the Friday Showcase highlight video. Drop in a real Vimeo/YouTube embed here.")}
              >
                <svg viewBox="0 0 24 24" fill="none"><path d="M8 5v14l11-7L8 5Z" fill="currentColor" /></svg>
              </button>
              <div className="caption">
                <span className="tag">Watch · 0:90</span>
                <h4>Friday Showcase Highlight</h4>
                <p>Last summer&rsquo;s session closing set — what your child&rsquo;s week builds toward.</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ===== Proof Bar ===== */}
      <section className="proof" style={{ padding: "34px 0" }}>
        <div className="container">
          <div className="proof-inner">
            <div className="proof-item">
              <div className="num">12</div>
              <div className="copy">Years teaching musicians<br />in Miami</div>
            </div>
            <div className="proof-item">
              <div className="num">500+</div>
              <div className="copy">Kids who have<br />played our stage</div>
            </div>
            <div className="proof-item">
              <div className="num">7</div>
              <div className="copy">Weekly sessions<br />all summer long</div>
            </div>
            <div className="proof-item">
              <div className="num">4.9★</div>
              <div className="copy">Parent rating<br />across 80+ reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Outcomes ===== */}
      <section className="outcomes" id="how-it-works">
        <div className="container">
          <div className="section-head">
            <div className="left">
              <div className="section-number">— 01</div>
              <h2 className="display h2">What your child <em>will walk away with</em></h2>
            </div>
            <p className="kicker" style={{ maxWidth: 320, color: "var(--muted)" }}>
              Every camper — beginner or intermediate — leaves with measurable progress, new friendships, and their first live performance in the books.
            </p>
          </div>
          <div className="outcomes-grid">
            <div className="outcome-card reveal">
              <div className="tier">For First-Time Campers</div>
              <h3>Beginners will leave able to…</h3>
              <ul className="outcome-list">
                <li><span className="check"><Check /></span><span className="text"><b>Play a full song on stage with a live band.</b><small>Not a sit-down recital — an amplified performance with peers.</small></span></li>
                <li><span className="check"><Check /></span><span className="text"><b>Hold their own in a rehearsal.</b><small>Count time, follow a leader, know when to come in and when to lay back.</small></span></li>
                <li><span className="check"><Check /></span><span className="text"><b>Read basic chord charts and rhythms.</b><small>The foundation of every song they&rsquo;ll ever want to learn next.</small></span></li>
                <li><span className="check"><Check /></span><span className="text"><b>Feel confident picking up an instrument again.</b><small>The #1 reason we hear from returning parents.</small></span></li>
              </ul>
            </div>
            <div className="outcome-card reveal">
              <div className="tier">For Returning &amp; Intermediate Players</div>
              <h3>Intermediate players will…</h3>
              <ul className="outcome-list">
                <li><span className="check"><Check /></span><span className="text"><b>Play a featured solo in a showcase set.</b><small>Stretch past the song chart and improvise in front of an audience.</small></span></li>
                <li><span className="check"><Check /></span><span className="text"><b>Learn to lead a band.</b><small>Count in a song, cue transitions, and read the room like a pro.</small></span></li>
                <li><span className="check"><Check /></span><span className="text"><b>Deepen music theory fluency.</b><small>Scales, modes, and ear-training applied to repertoire they choose.</small></span></li>
                <li><span className="check"><Check /></span><span className="text"><b>Write &amp; arrange original material.</b><small>Optional track for campers ready to move beyond covers.</small></span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Instructors ===== */}
      <section>
        <div className="container">
          <div className="section-head">
            <div className="left">
              <div className="section-number">— 02</div>
              <h2 className="display h2">Meet the <em>people</em> teaching your kid</h2>
            </div>
            <p className="kicker" style={{ maxWidth: 320, color: "var(--muted)" }}>
              Every instructor is a working, gigging musician who teaches because they love it — not because they&rsquo;re between jobs.
            </p>
          </div>
          <div className="instructors-grid">
            {[
              { name: "Sammy Gonzalez Zeira", role: "Co-Founder · Guitar · Bass", badge: "Co-Founder", bio: "Touring guitarist and bassist, Director of the Miami Beach Senior High Rock Ensemble, and CEO of Young Musicians Unite — Miami-Dade's free music-education non-profit serving 12,000+ students.", img: "/images/team/sammy-gonzalez.jpg" },
              { name: "Zach Larmer", role: "Co-Founder · Guitar · Composition", badge: "Co-Founder", bio: "Three-time GRAMMY-winning jazz guitarist who has toured the world and shared stages with renowned artists. 13 years educating Miami's young musicians.", img: "/images/team/zach-larmer.png" },
              { name: "Vale Peñaranda", role: "Voice · Keys · Production", badge: "Voice & Keys", bio: "Berklee and Frost School of Music alum. Recipient of the Eduardo Abaroa Award and a Latin GRAMMY Cultural Foundation Leading Lady, with stages from the Berklee Performance Center to the Suena Caracas Festival.", img: "/images/team/vale-penaranda.jpg" },
              { name: "AJ Hill", role: "Saxophone · Vocals · Drums", badge: "Saxophone", bio: "Twice Grammy-nominated and Oscar-nominated. Has shared the bill with Sly & the Family Stone and Earth Wind & Fire alums, and serves as Artistic Director of the Miami Beach Rock Ensemble.", img: "/images/team/aj-hill-camp.png" },
            ].map((i) => (
              <div key={i.name} className="instructor reveal">
                <div className="instructor-photo">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={i.img}
                    alt={i.name}
                    style={i.imgScale ? { transform: `scale(${i.imgScale})`, transformOrigin: "center" } : undefined}
                  />
                  <span className="badge">{i.badge}</span>
                </div>
                <h4>{i.name}</h4>
                <div className="role">{i.role}</div>
                <p>{i.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Schedule ===== */}
      <section className="schedule">
        <div className="container">
          <div className="section-head">
            <div className="left">
              <div className="section-number">— 03</div>
              <h2 className="display h2">A day in the <em>camper&rsquo;s life</em></h2>
            </div>
            <p className="kicker" style={{ maxWidth: 320, color: "var(--muted)" }}>
              Structured enough to make rapid progress. Loose enough that kids actually want to come back on day two.
            </p>
          </div>
          <div className="schedule-grid">
            <ul className="schedule-list">
              {[
                ["9:00", "Drop-Off, Warm-Up & Bonding", "Coffee for parents at the door. Campers jam loosely while the room fills."],
                ["10:00", "Music Education Workshops", "Theory, ear training, and songwriting — taught the way working musicians actually use them."],
                ["11:00", "Band Rehearsal", "Every camper plays in a band grouped by skill level. Friday's setlist starts here."],
                ["12:15", "Lunch + Community Hour", "Time to unplug, hang out, make friends. The friendships that form here are half the reason kids come back."],
                ["1:15", "Instrument Sectionals", "Small-group coaching by instrument with our senior instructors."],
                ["2:30", "Band Rehearsal (Round 2)", "Afternoon run-throughs. This is where the setlist tightens up."],
                ["3:30", "Dismissal + Pickup", "Campers head home — or straight into Aftercare."],
              ].map(([time, title, desc]) => (
                <li key={time}>
                  <div className="time">{time}</div>
                  <div className="activity">
                    <strong>{title}</strong>
                    <p>{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <aside className="schedule-aside">
              <h4>Friday = Showtime</h4>
              <p>
                Every session ends with a live Friday showcase at our Wynwood stage. Families, friends, lights, amps — the full experience. It&rsquo;s what every day of the week has been pointing toward.
              </p>
              <div className="showcase-banner">
                <div className="icon">
                  <svg viewBox="0 0 24 24" fill="none"><path d="M12 2v20M2 12h20" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
                </div>
                <div>
                  <strong>All families invited — free entry</strong>
                  <small>Doors open 2:45 PM Fridays. Arrive early, it fills up.</small>
                </div>
              </div>
            </aside>
          </div>

          {/* Aftercare callout */}
          <div className="aftercare">
            <div className="aftercare-card">
              <div className="mark">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
              </div>
              <div className="copy">
                <h4>Extended Care Until 5 PM</h4>
                <p>For working parents: aftercare runs 3:30 – 5:00 PM daily with supervised jam time, homework space, and room to decompress. Add it per day, no commitment.</p>
              </div>
              <div className="price">
                $25<small>Per day</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Sessions ===== */}
      <section id="sessions">
        <div className="container sessions-wrap">
          <div className="section-head">
            <div className="left">
              <div className="section-number">— 04</div>
              <h2 className="display h2">Pick your <em>weeks</em></h2>
            </div>
            <div className="pricing-toggle" role="tablist" aria-label="Pricing type">
              <button className={pricingMode === "early" ? "active" : ""} onClick={() => setPricingMode("early")}>
                Early Bird · Through May 15
              </button>
              <button className={pricingMode === "standard" ? "active" : ""} onClick={() => setPricingMode("standard")}>
                Standard
              </button>
            </div>
          </div>

          <p style={{ maxWidth: 720, color: "var(--muted)", margin: "-20px 0 32px", fontSize: 15 }}>
            Click a session to add it to your cart. Tap multiple to unlock multi-week bundle savings.
            Book and pay online — no phone calls, no waiting list, no &ldquo;we&rsquo;ll get back to you.&rdquo;
          </p>

          <div className="sessions-grid">
            {SESSIONS.map((s) => {
              const fillPct = Math.round((s.sold / s.capacity) * 100);
              const spotsLeft = s.capacity - s.sold;
              const displayPrice = priceFor(s);
              const origPrice = pricingMode === "early" ? BASE_STANDARD : null;
              const hot = fillPct >= 80 && !s.full;
              const isSelected = selected.has(s.code);
              const cls = ["session", s.full && "full", s.bridge && "bridge", isSelected && "selected"]
                .filter(Boolean).join(" ");
              return (
                <div
                  key={s.code}
                  className={cls}
                  onClick={() => toggleSession(s)}
                  style={{ ["--fill" as string]: `${fillPct}%` } as React.CSSProperties}
                >
                  {s.flag && <span className="flag">{s.flag}</span>}
                  <div className="session-header">
                    <div className="session-code">{s.code}</div>
                    <div className="session-dates">
                      <strong>{s.month}</strong>
                      {s.dates}
                    </div>
                  </div>
                  <div className="capacity">
                    <div className="capacity-bar" style={{ ["--fill" as string]: `${fillPct}%` } as React.CSSProperties} />
                    <div className="capacity-label">
                      <span>{s.full ? "Sold out" : `${spotsLeft} spots left`}</span>
                      <span className={hot ? "hot" : ""}>
                        {s.full ? "—" : hot ? "🔥 Filling fast" : `${fillPct}% full`}
                      </span>
                    </div>
                  </div>
                  <div className="session-cta">
                    <div className="session-price">
                      {origPrice && !s.bridge && <s>${origPrice}</s>}
                      ${displayPrice}
                    </div>
                    <div className="session-select">
                      {isSelected ? "Added ✓" : s.full ? "Join Waitlist" : "Add Session"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="discounts-row">
            <div className="discount-chip"><b>Save $25/wk</b> — Book 2+ sessions</div>
            <div className="discount-chip"><b>Save $50/wk</b> — Book 3+ sessions</div>
            <div className="discount-chip"><b>10% off</b> — Each additional sibling</div>
            <div className="discount-chip"><b>Save $50/wk</b> — Early Bird through May 15</div>
          </div>

          <div className="bundle-cart">
            <div>
              <h4>Your Cart</h4>
              <div className="selected-list">
                {picks.length === 0 ? (
                  "No sessions selected yet — tap a week above to begin."
                ) : (
                  picks.map((p) => (
                    <div key={p.code}>
                      Session {p.code} · <span style={{ color: "var(--muted)" }}>{p.dates}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="bundle-math">
              {picks.length === 0 ? (
                <div className="line"><span>Base</span><span>$0</span></div>
              ) : (
                <>
                  <div className="line">
                    <span>{picks.length} session{picks.length > 1 ? "s" : ""} · {pricingMode === "early" ? "Early Bird" : "Standard"}</span>
                    <span>${cart.base}</span>
                  </div>
                  {cart.bundleDiscount > 0 && (
                    <div className="line discount">
                      <span>Bundle discount ({picks.length}-week)</span>
                      <span>−${cart.bundleDiscount}</span>
                    </div>
                  )}
                  <div className="line total"><span>Total</span><span>${cart.total}</span></div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>
                    50% deposit today · balance on first day
                  </div>
                </>
              )}
            </div>
            <button
              className="btn btn-primary"
              disabled={picks.length === 0}
              style={{
                opacity: picks.length === 0 ? 0.4 : 1,
                pointerEvents: picks.length === 0 ? "none" : "auto",
              }}
              onClick={() => setModalOpen(true)}
            >
              Reserve &amp; Checkout <span className="arrow">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* ===== Gallery ===== */}
      <section className="gallery">
        <div className="container">
          <div className="section-head">
            <div className="left">
              <div className="section-number">— 05</div>
              <h2 className="display h2">Inside the <em>camp</em></h2>
            </div>
          </div>
          <div className="gallery-grid">
            {[
              { cls: "g-1", src: "/images/camp/gallery/gallery-01-hero.jpg", alt: "Sun Salutation full band on the WSM stage" },
              { cls: "g-2", src: "/images/camp/gallery/gallery-05.jpg", alt: "Young singer mid-song with a guitarist beside her" },
              { cls: "g-3", src: "/images/camp/gallery/gallery-06.jpg", alt: "Teen camper beaming with a red electric guitar on stage" },
              { cls: "g-4", src: "/images/camp/gallery/gallery-07.jpg", alt: "Teen camper with acoustic guitar on stage, drums behind" },
              { cls: "g-5", src: "/images/camp/gallery/gallery-08.jpg", alt: "Black-and-white drummer mid-fill in front of the WSM backdrop" },
              { cls: "g-6", src: "/images/camp/gallery/gallery-02-wide.jpg", alt: "Full teen band performing under purple stage lights" },
              { cls: "g-7", src: "/images/camp/gallery/gallery-03-wide.jpg", alt: "Instructor with acoustic guitar coaching a young keyboardist mid-lesson" },
              { cls: "g-8", src: "/images/camp/gallery/gallery-04-wide.jpg", alt: "Singer in coral dress on stage accompanied by a pianist" },
            ].map((g) => (
              <div key={g.cls} className={`g ${g.cls}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.src} alt={g.alt} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Testimonials ===== */}
      <section>
        <div className="container">
          <div className="section-head">
            <div className="left">
              <div className="section-number">— 06</div>
              <h2 className="display h2">What camp <em>families say</em></h2>
            </div>
            <p className="kicker" style={{ maxWidth: 320, color: "var(--muted)" }}>
              Every quote below is from a parent whose child came to WSM Camp in the last two summers.
            </p>
          </div>
          <div className="testimonials-grid">
            {[
              { quote: "My daughter hadn't touched an instrument before. On Friday she was singing lead in a 5-piece band. I was in tears.", who: "Elena R.", role: "Parent, Session B 2025", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80" },
              { quote: "The instructors get the kids. My son asked if he could come back for a second week after day three. He's been to three camps — this is the one that stuck.", who: "David O.", role: "Parent, Sessions A + C 2025", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
              { quote: "Worth every dollar. The Friday showcase is unlike any \"kid recital\" you've ever been to — it feels like an actual show. And the aftercare is a lifesaver.", who: "Priya K.", role: "Parent, Session E 2024 & Session D 2025", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80" },
            ].map((t) => (
              <div key={t.who} className="testimonial reveal">
                <div className="stars">★★★★★</div>
                <span className="quote-mark">&ldquo;</span>
                <blockquote>{t.quote}</blockquote>
                <div className="who">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.img} alt={t.who} />
                  <div>
                    <strong>{t.who}</strong>
                    <small>{t.role}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ + Email capture ===== */}
      <section style={{ background: "var(--bg-elev)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="container">
          <div className="section-head">
            <div className="left">
              <div className="section-number">— 07</div>
              <h2 className="display h2">Answers to <em>all your questions</em></h2>
            </div>
          </div>
          <div className="faq-email">
            <ul className="faq-list">
              {[
                { q: "Does my child need prior experience playing an instrument?", a: "Absolutely not. The camp is for every skill level. Beginners and advanced students are placed into small groups with musicians at a similar level — no one gets lost and no one gets held back.", open: true },
                { q: "Which instruments can my child enroll in?", a: "Voice, guitar, keyboard, bass, and drums. If your child plays something else and wants to join, email us — we can often accommodate." },
                { q: "Does my child need to bring their own instrument?", a: "We encourage it (practicing on the same instrument you rehearse on matters), but we have loaner instruments on a first-come basis for families who don't have one yet." },
                { q: "How does registration and payment work?", a: "You pick your sessions above and check out online with a 50% deposit. The remaining balance is charged to the card on file on the first day of each session. No phone tag, no contact forms." },
                { q: "What's your cancellation policy?", a: "Cancel 14+ days before your session starts and you get a full refund of the deposit. 7–13 days: 50% refund. 0–6 days: the deposit is non-refundable." },
                { q: "Will there be lunch and breaks?", a: "Yes. Lunch + Community Hour runs 12:15–1:15 daily. Kids bring their own lunch or order delivery as a group. This is also when friendships form — which, no exaggeration, is half the reason kids come back." },
                { q: "Do you offer aftercare?", a: "Yes — 3:30–5:00 PM, $25/day, no commitment. Add it day-of or for the whole week. Private lessons after camp are also available (separate program/cost)." },
                { q: "Where can we park?", a: "A parking lot is available along the western wall of the school. Additional parking along 29th Street and 13th Ave." },
              ].map((f) => (
                <details key={f.q} className="faq-item" open={f.open}>
                  <summary>{f.q}</summary>
                  <div className="answer">{f.a}</div>
                </details>
              ))}
            </ul>

            <div className="email-card">
              <h4>Not quite ready?</h4>
              <p>Get camp updates, early-bird windows, and behind-the-scenes from our Friday showcases. One email a month — no spam.</p>
              <form
                className={`email-form${emailDone ? " done" : ""}`}
                onSubmit={(e) => { e.preventDefault(); setEmailDone(true); }}
              >
                <input type="text" placeholder="Parent's first name" required />
                <input type="email" placeholder="Email address" required />
                <button type="submit">Keep me posted</button>
                <div className="success">✓ You&rsquo;re on the list. See you Friday.</div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Final CTA ===== */}
      <section className="final-cta">
        <div className="container">
          <h2 className="display">Your kid&rsquo;s<br /><em>summer story</em><br />starts here.</h2>
          <p>Early bird pricing ends May 15. Sessions fill in the order reserved — most popular weeks sell out first.</p>
          <a href="#sessions" className="btn btn-yellow">Reserve a Session <span className="arrow">→</span></a>
        </div>
      </section>

      {/* ===== Reservation Modal (UI only) ===== */}
      <div
        className={`modal-backdrop${modalOpen ? " open" : ""}`}
        onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
      >
        <div className="modal">
          <button className="modal-close" onClick={closeModal} aria-label="Close">×</button>
          <h3>Reserve Your Spot</h3>
          <p>A 50% deposit secures your sessions. Balance is charged to this card on the first day of each session.</p>

          <div className="summary-box">
            {picks.length === 0 ? (
              <div className="line"><span>No sessions selected</span><span /></div>
            ) : (
              <>
                {picks.map((p) => (
                  <div key={p.code} className="line">
                    <span>Session {p.code} · {p.dates}</span>
                    <span>${priceFor(p)}</span>
                  </div>
                ))}
                {cart.bundleDiscount > 0 && (
                  <div className="line" style={{ color: "var(--yellow)" }}>
                    <span>Bundle discount</span>
                    <span>−${cart.bundleDiscount}</span>
                  </div>
                )}
                <div className="line total"><span>Total</span><span>${cart.total}</span></div>
                <div className="line"><span>Deposit today</span><span>${cart.deposit}</span></div>
              </>
            )}
          </div>

          <div className="modal-row">
            <div className="modal-field">
              <label>Camper&rsquo;s Name</label>
              <input type="text" placeholder="First & last" />
            </div>
            <div className="modal-field">
              <label>Age</label>
              <input type="number" min={8} max={14} placeholder="8–14" />
            </div>
          </div>

          <div className="modal-field">
            <label>Primary Instrument</label>
            <select>
              <option>Voice</option>
              <option>Guitar</option>
              <option>Keyboard</option>
              <option>Bass</option>
              <option>Drums</option>
              <option>Not sure yet</option>
            </select>
          </div>

          <div className="modal-row">
            <div className="modal-field">
              <label>Parent Email</label>
              <input type="email" placeholder="you@example.com" />
            </div>
            <div className="modal-field">
              <label>Parent Phone</label>
              <input type="tel" placeholder="(305) ..." />
            </div>
          </div>

          <button
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center", marginTop: 6 }}
            onClick={() => {
              alert("UI demo only — checkout will be wired up later.");
              closeModal();
            }}
          >
            Proceed to Secure Checkout <span className="arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
