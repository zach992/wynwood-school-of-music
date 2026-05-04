import { siteData } from "@/lib/site-data";

const SITE_URL = "https://www.wynwoodschoolofmusic.com";

export default function StructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["MusicSchool", "LocalBusiness"],
    "@id": `${SITE_URL}#organization`,
    name: siteData.name,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    image: `${SITE_URL}/og-image.png`,
    telephone: `+1-${siteData.phone}`,
    email: siteData.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteData.address.street,
      addressLocality: siteData.address.city,
      addressRegion: siteData.address.state,
      postalCode: siteData.address.zip,
      addressCountry: "US",
    },
    areaServed: [
      { "@type": "City", name: "Miami" },
      { "@type": "AdministrativeArea", name: "Miami-Dade County" },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "14:00",
        closes: "21:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Friday",
        opens: "14:00",
        closes: "19:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "11:00",
        closes: "20:00",
      },
    ],
    sameAs: [
      siteData.social.facebook,
      siteData.social.instagram,
      siteData.social.youtube,
      siteData.social.spotify,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
