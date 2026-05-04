"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/site-data";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="lg:hidden bg-wsm-darker border-t border-white/10">
      <nav className="flex flex-col py-4">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          const hasChildren = link.children && link.children.length > 0;
          const isExpanded = expandedItems.includes(link.label);

          return (
            <div key={link.label}>
              <div className="flex items-center justify-between px-6">
                <Link
                  href={link.href}
                  onClick={onClose}
                  className={`py-3 text-sm font-heading uppercase tracking-wider transition-colors ${
                    link.highlight
                      ? "text-[#ffd84d] hover:text-[#fff0a0]"
                      : isActive
                      ? "text-wsm-accent"
                      : "text-white hover:text-wsm-accent"
                  }`}
                >
                  {link.label}
                </Link>
                {hasChildren && (
                  <button
                    onClick={() => toggleExpand(link.label)}
                    className="text-white hover:text-wsm-accent p-2"
                    aria-label={`Toggle ${link.label} submenu`}
                  >
                    <svg
                      className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}
              </div>
              {hasChildren && isExpanded && (
                <div className="bg-wsm-dark pl-10 pr-6">
                  {link.children!.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={onClose}
                      className={`block py-2 text-sm transition-colors ${
                        pathname === child.href
                          ? "text-wsm-accent"
                          : "text-wsm-gray hover:text-white"
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
