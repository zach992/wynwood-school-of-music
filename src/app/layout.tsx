import type { Metadata, Viewport } from "next";
import { Barlow_Condensed } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import AnnouncementBar from "@/components/AnnouncementBar";
import CampUrgencyBar from "@/components/CampUrgencyBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PostHogProvider } from "@/components/PostHogProvider";
import ScrollToTop from "@/components/ScrollToTop";
import StructuredData from "@/components/StructuredData";
import { GOOGLE_ADS_ENABLED, GOOGLE_ADS_ID } from "@/lib/google-ads";
import { META_PIXEL_ENABLED, META_PIXEL_ID } from "@/lib/meta-pixel";

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
        {GOOGLE_ADS_ENABLED && (
          <>
            {/* afterInteractive, not lazyOnload: lazyOnload waits for browser
                idle after load, so a fast form submit can beat the tag and
                drop the conversion. A measurement tag has to be ready before
                the action it measures. */}
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-ads-gtag" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GOOGLE_ADS_ID}');
              `}
            </Script>
          </>
        )}
        {META_PIXEL_ENABLED && (
          <>
            {/* Meta Pixel. The snippet's own fbq('track','PageView') is the
                only PageView call on the site — fbevents.js installs a History
                API listener and re-fires PageView on client-side route changes
                by itself, so adding a Next.js route-change tracker on top would
                double-count every navigation. (Google Ads needs no equivalent:
                it has no pageview conversion.) */}
            <Script id="meta-pixel" strategy="afterInteractive">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window,document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${META_PIXEL_ID}');
                fbq('track', 'PageView');
              `}
            </Script>
            <noscript>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                alt=""
                src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
              />
            </noscript>
          </>
        )}
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
