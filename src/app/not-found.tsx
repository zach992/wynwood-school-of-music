import Button from "@/components/Button";

export const metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <section className="bg-wsm-dark px-4 py-24 md:py-32 min-h-[60vh] flex items-center">
      <div className="max-w-2xl mx-auto text-center">
        <p className="font-heading text-wsm-accent text-sm md:text-base uppercase tracking-[0.4em] mb-6">
          404 — Page Not Found
        </p>
        <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl uppercase font-black text-white leading-tight mb-8">
          Lost a Note Somewhere?
        </h1>
        <p className="font-body text-wsm-gray text-base md:text-lg leading-relaxed mb-10 max-w-lg mx-auto">
          The page you&apos;re looking for has either moved, been retired, or
          never existed. Let&apos;s get you back on key.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button href="/">Back Home</Button>
          <Button href="/contact" variant="outline">
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
}
