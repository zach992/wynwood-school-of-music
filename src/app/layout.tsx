import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wynwood School of Music",
  description: "Music lessons and band programs in the heart of Miami's art district",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-wsm-dark text-white font-body min-h-screen">
        <main>{children}</main>
      </body>
    </html>
  );
}
