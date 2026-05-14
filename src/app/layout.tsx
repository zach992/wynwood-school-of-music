import type { Metadata, Viewport } from "next";
import { Barlow_Condensed } from "next/font/google";
import "./globals.css";
import AnnouncementBar from "@/components/AnnouncementBar";
import CampUrgencyBar from "@/components/CampUrgencyBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PostHogProvider } from "@/components/PostHogProvider";
import ScrollToTop from "@/components/ScrollToTop";
import StructuredData from "@/components/StructuredData";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  display: "swap",
  variable: "--font-brand",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.wynwoodschoolofmusic.com"),
  title: {
    default: "Wynwood School of Music",
    template: "%s | Wynwood School of Music",
  },
  description:
    "Music lessons and band programs in the heart of Miami's art district. Private lessons, band programs, and summer camp for ages 6 and up.",
  openGraph: {
    title: "Wynwood School of Music",
    description:
      "Music lessons and band programs in the heart of Miami's art district.",
    url: "https://www.wynwoodschoolofmusic.com",
    siteName: "Wynwood School of Music",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Wynwood School of Music — A lifelong love of music starts here",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wynwood School of Music",
    description:
      "Music lessons and band programs in the heart of Miami's art district.",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={barlowCondensed.variable}>
      <body className="bg-wsm-dark text-white font-body min-h-screen flex flex-col">
        <PostHogProvider>
          <StructuredData />
          <ScrollToTop />
          <CampUrgencyBar />
          <AnnouncementBar />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </PostHogProvider>
      </body>
    </html>
  );
}
