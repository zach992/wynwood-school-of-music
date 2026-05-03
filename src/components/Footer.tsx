import Link from "next/link";
import { siteData } from "@/lib/site-data";
import Button from "./Button";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Contact Us", href: "/contact" },
  { label: "About Us", href: "/our-story" },
  { label: "Team", href: "/team" },
  { label: "Programs", href: "/programs-and-pricing" },
  { label: "Privacy Policy", href: "/privacy-policy" },
];

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-wsm-accent transition-colors"
    >
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="bg-wsm-dark text-white border-t border-white/10">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Free Trial */}
          <div>
            <h3 className="font-heading text-2xl uppercase mb-4">Free Trial Lesson</h3>
            <p className="text-wsm-gray text-sm mb-6">
              Your first lesson is on us, sign up and start today!
            </p>
            <Button href="/contact">Sign Up!</Button>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-2xl uppercase mb-4">Quick Links</h3>
            <ul className="space-y-2 mb-6 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-wsm-gray hover:text-wsm-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex space-x-3">
              <SocialIcon href={siteData.social.facebook} label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </SocialIcon>
              <SocialIcon href={siteData.social.instagram} label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="17.5" cy="6.5" r="1.5" />
                </svg>
              </SocialIcon>
              <SocialIcon href={siteData.social.youtube} label="YouTube">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="black" />
                </svg>
              </SocialIcon>
              <SocialIcon href={siteData.social.spotify} label="Spotify">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M8 15c3-1 6-1 9 .5M7.5 12.5c4-1.5 8-1.5 11 .5M7 10c4.5-1.5 9.5-1.5 13 1" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </SocialIcon>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-2xl uppercase mb-4">Contact Us</h3>
            <div className="space-y-3 text-wsm-gray text-sm">
              <p>
                {siteData.address.street}<br />
                {siteData.address.city}, {siteData.address.state} {siteData.address.zip}
              </p>
              <p>
                <a href={`tel:${siteData.phone}`} className="hover:text-wsm-accent transition-colors">
                  {siteData.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${siteData.email}`} className="hover:text-wsm-accent transition-colors">
                  {siteData.email}
                </a>
              </p>
              <div>
                <p className="font-black uppercase tracking-wider text-white text-xs mb-1">Hours</p>
                {siteData.hours.regular.map((h) => (
                  <p key={h.days}>{h.days}: {h.time}</p>
                ))}
              </div>
              <div>
                <p className="font-black uppercase tracking-wider text-white text-xs mb-1">Holiday Closures</p>
                {Object.entries(siteData.hours.holidayClosures).map(([season, dates]) => (
                  <div key={season} className="mb-2">
                    <p className="font-bold text-white">{season}</p>
                    {dates.map((d) => (
                      <p key={d}>{d}</p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 py-6 text-center text-sm text-wsm-gray-dark">
        <p>&copy; {new Date().getFullYear()} {siteData.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
