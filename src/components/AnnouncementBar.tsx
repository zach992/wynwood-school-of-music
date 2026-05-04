"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteData } from "@/lib/site-data";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const pathname = usePathname();

  if (!visible) return null;
  if (pathname === "/musicperformancecamp") return null;

  return (
    <div className="bg-wsm-accent text-white text-center text-sm py-2 px-4 relative">
      <Link href={siteData.announcement.link} className="hover:underline font-black uppercase tracking-wider">
        {siteData.announcement.text}
      </Link>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:opacity-70 text-lg leading-none"
        aria-label="Dismiss announcement"
      >
        &times;
      </button>
    </div>
  );
}
