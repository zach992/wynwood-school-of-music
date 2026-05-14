const SITE_URL = "https://www.wynwoodschoolofmusic.com";

export type BreadcrumbCrumb = {
  name: string;
  path: string;
};

export default function BreadcrumbSchema({ trail }: { trail: BreadcrumbCrumb[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
