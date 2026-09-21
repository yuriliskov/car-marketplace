import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ModelLanding } from "@/components/model-landing";
import { catalogModels, findModel, modelPath } from "@/data/catalog";
import { absoluteUrl, site } from "@/lib/site";

export function generateStaticParams() {
  return catalogModels.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/cars/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const entry = findModel(slug);
  if (!entry) return {};

  const url = absoluteUrl(modelPath(entry.slug));
  const { vehicle } = entry;
  const preview = vehicle.gallery[0];
  const car = `${vehicle.brand} ${vehicle.model}`;

  return {
    title: entry.title,
    description: entry.description,
    keywords: [
      car,
      `${car} ${vehicle.year}`,
      `${car} из Китая`,
      `${car} под ключ`,
      `${car} цена`,
      `${car} характеристики`,
      `${car} купить в России`,
      vehicle.trim,
    ],
    alternates: { canonical: url },
    openGraph: {
      title: entry.title,
      description: entry.description,
      url,
      siteName: site.name,
      locale: "ru_RU",
      type: "website",
      images: [{ url: preview.src, alt: preview.alt, width: 560, height: 420 }],
    },
    twitter: {
      card: "summary_large_image",
      title: entry.title,
      description: entry.description,
      images: [preview.src],
    },
  };
}

export default async function CarPage({ params }: PageProps<"/cars/[slug]">) {
  const { slug } = await params;
  const entry = findModel(slug);
  if (!entry) notFound();

  const { vehicle } = entry;
  const url = absoluteUrl(modelPath(entry.slug));

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Car",
        name: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
        brand: { "@type": "Brand", name: vehicle.brand },
        model: vehicle.model,
        vehicleModelDate: String(vehicle.year),
        bodyType: vehicle.body,
        fuelType: vehicle.fuel,
        vehicleTransmission: vehicle.transmission,
        driveWheelConfiguration: vehicle.drive,
        vehicleEngine: {
          "@type": "EngineSpecification",
          enginePower: {
            "@type": "QuantitativeValue",
            value: vehicle.powerHp,
            unitText: "л.с.",
          },
        },
        image: vehicle.gallery.slice(0, 5).map((image) => image.src),
        description: entry.description,
        url,
        offers: {
          "@type": "Offer",
          price: vehicle.estimatedPriceRub,
          priceCurrency: "RUB",
          availability: "https://schema.org/PreOrder",
          seller: { "@type": "Organization", name: site.name },
          url,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Главная", item: site.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "Каталог",
            item: absoluteUrl("/#models"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `${vehicle.brand} ${vehicle.model}`,
            item: url,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ModelLanding vehicle={vehicle} lead={entry.summary} />
    </>
  );
}
