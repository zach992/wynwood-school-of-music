"use client";

import { usePostHog } from "posthog-js/react";
import Button from "./Button";

/**
 * Donation checkout for Friends of Wynwood School of Music.
 *
 * This is the foundation's own Stripe account (Friends of WSM is a separate
 * 501(c)(3), EIN 99-4110235) — NOT the school's Stripe account that backs the
 * camp deposit checkout. That is why this is a plain outbound link to a Stripe
 * Payment Link rather than a server-created checkout session: nothing about this
 * transaction belongs in the WSM account or in our Airtable/Resend fan-out.
 */
export const DONATE_URL = "https://donate.stripe.com/bJecN5aSA3Oj4ZP0dr6c001";

interface DonateButtonProps {
  /** Where on the page this button sits — sent as a property on donate_clicked. */
  location: string;
  variant?: "primary" | "outline";
  className?: string;
  children?: React.ReactNode;
}

export default function DonateButton({
  location,
  variant = "primary",
  className = "",
  children = "Donate",
}: DonateButtonProps) {
  const posthog = usePostHog();

  return (
    <Button
      href={DONATE_URL}
      variant={variant}
      className={className}
      onClick={() => posthog?.capture("donate_clicked", { location })}
    >
      {children}
    </Button>
  );
}
