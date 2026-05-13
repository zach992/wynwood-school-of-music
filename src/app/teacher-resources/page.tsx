import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teacher Resources",
  description:
    "Internal resources for Wynwood School of Music teachers — technique, music literacy, repertoire, training, and reference materials.",
  robots: { index: false, follow: false },
};

type ResourceLink = { label: string; href: string };

const technique: ResourceLink[] = [
  { label: "Bass", href: "https://drive.google.com/drive/folders/1Ku_lRmxrZqgzYh7WFaj57_NDPhhyUo4W" },
  { label: "Drums", href: "https://drive.google.com/drive/folders/1g9jV8ovbhJZCHpcgF45IJTXF1o0MFQu3" },
  { label: "Guitar", href: "https://drive.google.com/drive/folders/1mHm1nrpMTKNc4mNewXjX9fjcynI6SFGC" },
  { label: "Piano", href: "https://drive.google.com/drive/folders/1pxfnNkoPLCAuaPu5_ObE1Xj8-K6IFMAC" },
  { label: "Voice", href: "https://drive.google.com/drive/folders/1C6rVW7aCAvUoxpJP5IVfkUO0jbyQulWh" },
];

const musicLiteracy: ResourceLink[] = [
  { label: "Bass", href: "https://drive.google.com/drive/folders/1v4u5iqCdW5XIEDRJNdbT1ZVCBhvdNqNw" },
  { label: "Drums", href: "https://drive.google.com/drive/folders/1cvf_bNdcHRFimkZryGcryF_A0A1UMiKT" },
  { label: "Guitar", href: "https://drive.google.com/drive/folders/1wKlK41WvNkZH8BrloYX_tNkmM4gzjH8G" },
  { label: "Piano", href: "https://drive.google.com/drive/folders/1w7RF-tbu9o5fVgwrIZVt4fqGG82QOT72" },
  { label: "Voice", href: "https://drive.google.com/drive/folders/1sQyPANm1U3hDahUS88NXByNwADQg7-pI" },
  { label: "Theory", href: "https://drive.google.com/drive/folders/1Yr5kQRCTUyXvjk7Igso1zOw4IWr3Vz4w" },
];

const repertoire: Array<{ tier: string; charts: string; playlist: string }> = [
  {
    tier: "Beginner",
    charts: "https://drive.google.com/drive/folders/1aB4QWgAG7xYvhvK8ds3UMEgk863Kk0XR",
    playlist: "https://www.youtube.com/playlist?list=PLvtZljWIgxWsf1_a6LSVvHNJ799uGD2_4",
  },
  {
    tier: "Intermediate",
    charts: "https://drive.google.com/drive/folders/149I_WDKDXAj6m0JbwrBETBON22Fulj9a",
    playlist: "https://www.youtube.com/playlist?list=PLvtZljWIgxWsK7MsL9o2B-_mS85WNFsg_",
  },
  {
    tier: "Advanced",
    charts: "https://drive.google.com/drive/folders/14pU1Gi7xfS2VWDGDlXBv46uIm8_EO5Lp",
    playlist: "https://www.youtube.com/playlist?list=PLvtZljWIgxWsKY47GzjsvYi2bSmf_io0l",
  },
];

const pianoPlaylist =
  "https://www.youtube.com/playlist?list=PLvtZljWIgxWukgWlf-KvGc-8X_EiOBgey";

const training: ResourceLink[] = [
  {
    label: "Private Lessons 123",
    href: "https://docs.google.com/document/d/109CHaQ1f4CWruRkkyPVCJt32UWK41D9wX8GmunK_wW8/edit?usp=sharing",
  },
  {
    label: "Rehearsing a Band",
    href: "https://docs.google.com/document/d/1pea5G2MXLEng8j4jXKNs6j_sv3LjZn52WM67A75FNMs/edit?usp=sharing",
  },
  {
    label: "Current Bands + Set Lists",
    href: "https://docs.google.com/spreadsheets/d/1a5pn9qbliubf1PqQFiFiTj6WR2zuNPUtobQBhkjVa44/edit?gid=58448966#gid=58448966",
  },
];

const resources: ResourceLink[] = [
  {
    label: "Practice Log",
    href: "https://docs.google.com/spreadsheets/d/1Zu29WDTQ0DUSKZgd-BPgXTXiWmKEfEdnSvH7Ww_zdj4/edit?usp=sharing",
  },
  { label: "Staff Paper", href: "https://drive.google.com/open?id=1M72V4BgJiNkqIGigdYlKWFg13KqcSw4b" },
  { label: "Guitar Chord Charts", href: "https://drive.google.com/open?id=1FL_wNIOIYgT-q9P20Z0oObVO8eAA6nEg" },
  { label: "Piano Chord Charts", href: "https://drive.google.com/open?id=1ZkrFfD9jpwIflm08tBnIgKtZ6wloOLYZ" },
  { label: "Guitar Tabs", href: "https://drive.google.com/open?id=1fPGLOa8gd24iEVr_eZ7cqkEavT6RkuGd" },
  { label: "Bass Tabs", href: "https://drive.google.com/open?id=1AZCM08seYUu7k9OG0VahwnC3migKgTMA" },
];

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-wsm-mauve hover:text-white transition-colors underline underline-offset-4 font-semibold"
    >
      {children}
    </a>
  );
}

function InstrumentRow({ items }: { items: ResourceLink[] }) {
  return (
    <p className="font-body text-wsm-gray text-base md:text-lg leading-relaxed">
      {items.map((item, i) => (
        <span key={item.label}>
          <ExternalLink href={item.href}>{item.label}</ExternalLink>
          {i < items.length - 1 && <span className="mx-2 text-wsm-gray-dark">|</span>}
        </span>
      ))}
    </p>
  );
}

function Section({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="grid md:grid-cols-12 gap-6 md:gap-8 py-8 md:py-10">
        <div className="md:col-span-3">
          <h2 className="font-heading text-xl md:text-2xl uppercase font-black text-white tracking-wide">
            {heading}
          </h2>
        </div>
        <div className="md:col-span-9">{children}</div>
      </div>
      <hr className="border-wsm-gray-dark" />
    </>
  );
}

export default function TeacherResourcesPage() {
  return (
    <>
      {/* Page Heading */}
      <section className="bg-wsm-dark px-4 pt-12 pb-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-heading text-5xl md:text-6xl uppercase font-black text-white">
            Teacher Resources
          </h1>
          <hr className="border-wsm-gray-dark mt-6" />
        </div>
      </section>

      {/* Sections */}
      <section className="bg-wsm-dark px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <Section heading="Technique">
            <InstrumentRow items={technique} />
          </Section>

          <Section heading="Music Literacy (Reading)">
            <InstrumentRow items={musicLiteracy} />
          </Section>

          <Section heading="Repertoire">
            <div className="space-y-2 font-body text-wsm-gray text-base md:text-lg leading-relaxed">
              {repertoire.map((row) => (
                <p key={row.tier}>
                  <span className="text-white font-semibold">{row.tier}: </span>
                  <ExternalLink href={row.charts}>Charts</ExternalLink>
                  <span className="mx-2 text-wsm-gray-dark">|</span>
                  <ExternalLink href={row.playlist}>YouTube Playlist</ExternalLink>
                </p>
              ))}
              <p>
                <span className="text-white font-semibold">Piano: </span>
                <ExternalLink href={pianoPlaylist}>YouTube Playlist</ExternalLink>
              </p>
            </div>
          </Section>

          <Section heading="Training">
            <ul className="space-y-2 font-body text-base md:text-lg leading-relaxed list-none">
              {training.map((item) => (
                <li key={item.label}>
                  <ExternalLink href={item.href}>{item.label}</ExternalLink>
                </li>
              ))}
            </ul>
          </Section>

          <Section heading="Resources">
            <ul className="space-y-2 font-body text-base md:text-lg leading-relaxed list-none">
              {resources.map((item) => (
                <li key={item.label}>
                  <ExternalLink href={item.href}>{item.label}</ExternalLink>
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </section>
    </>
  );
}
