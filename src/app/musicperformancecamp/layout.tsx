import { Anton, Instrument_Serif, Manrope } from "next/font/google";

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

export default function MusicPerformanceCampLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${campDisplay.variable} ${campSerif.variable} ${campBody.variable}`}
    >
      {children}
    </div>
  );
}
