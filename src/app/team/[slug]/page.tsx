import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { teamBios } from "@/lib/team-bios";
import Button from "@/components/Button";

export function generateStaticParams() {
  return teamBios
    .filter((b) => b.bioParagraphs.length > 0)
    .map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const bio = teamBios.find((b) => b.slug === slug);
  if (!bio) return { title: "Not Found" };
  const description = bio.bioParagraphs[0]?.slice(0, 200) ?? "";
  return {
    title: bio.name,
    description,
    alternates: { canonical: `/team/${bio.slug}` },
  };
}

export default async function BioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bio = teamBios.find((b) => b.slug === slug);
  if (!bio || bio.bioParagraphs.length === 0) notFound();

  return (
    <>
      {/* Back link */}
      <section className="bg-wsm-dark px-4 pt-8">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/team"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-wider text-wsm-gray hover:text-wsm-accent transition-colors font-semibold"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Team
          </Link>
        </div>
      </section>

      {/* Heading — left-aligned */}
      <section className="bg-wsm-dark px-4 pt-6 pb-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl uppercase font-black text-white leading-tight">
            {bio.name}
          </h1>
          {bio.role && (
            <p className="font-body text-wsm-accent text-sm md:text-base uppercase tracking-[0.3em] mt-4">
              {bio.role}
            </p>
          )}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4">
        <hr className="border-wsm-gray-dark" />
      </div>

      {/* Two-column body: small circular portrait + bio/quote */}
      <section className="bg-wsm-dark px-4 py-10 md:py-14">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-start">
            {/* Portrait — circular, smaller */}
            <div className="md:col-span-4">
              <div className="relative w-full max-w-[260px] mx-auto md:mx-0 aspect-square overflow-hidden rounded-full bg-wsm-darker">
                <Image
                  src={bio.portraitSrc}
                  alt={bio.name}
                  fill
                  sizes="(min-width: 768px) 260px, 80vw"
                  className="object-cover"
                  style={bio.portraitPosition ? { objectPosition: bio.portraitPosition } : undefined}
                  priority
                />
              </div>
            </div>

            {/* Bio + philosophy */}
            <div className="md:col-span-8 flex flex-col gap-5">
              {bio.bioParagraphs.map((para, i) => (
                <p
                  key={i}
                  className="font-body text-wsm-gray text-base leading-relaxed"
                >
                  {para}
                </p>
              ))}

              {bio.philosophy && (
                <div className="relative mt-2 pl-6 border-l-2 border-wsm-accent">
                  <span
                    aria-hidden="true"
                    className="absolute -top-3 -left-1 font-heading text-5xl text-wsm-accent/40 leading-none select-none"
                  >
                    &ldquo;
                  </span>
                  <p className="font-heading italic text-lg md:text-xl text-white leading-snug">
                    {bio.philosophy}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer: social + back button */}
      <section className="bg-wsm-dark px-4 pb-16">
        <div className="max-w-5xl mx-auto text-center">
          {bio.social && (
            <div className="mb-8">
              <p className="font-body text-xs uppercase tracking-[0.3em] text-wsm-gray-dark mb-2">
                Follow
              </p>
              <p className="font-body text-wsm-accent text-base font-semibold">
                {bio.social}
              </p>
            </div>
          )}
          <Button href="/team" variant="outline">
            Back to Team
          </Button>
        </div>
      </section>
    </>
  );
}
