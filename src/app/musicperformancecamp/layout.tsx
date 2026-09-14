import { Anton, Instrument_Serif, Manrope } from "next/font/google";
import CampUrgencyBar from "@/components/CampUrgencyBar";
import { CAMP_EARLY_BIRD_DEADLINE } from "@/lib/camp";

const campDisplay = Anton({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-camp-display",
});

const campSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  display: "swap",
  variable: "--font-camp-serif",
});

const campBody = Manrope({
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
  variable: "--font-camp-body",
});

const earlyBirdExpiredAtBuild = Date.now() >= CAMP_EARLY_BIRD_DEADLINE;

export default function MusicPerformanceCampLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${campDisplay.variable} ${campSerif.variable} ${campBody.variable}`}
    >
      <CampUrgencyBar initiallyExpired={earlyBirdExpiredAtBuild} />
      {children}
    </div>
  );
}
