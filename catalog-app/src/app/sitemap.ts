import type { MetadataRoute } from "next";
import { catalogModels, modelPath } from "@/data/catalog";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...catalogModels.map((entry) => ({
      url: absoluteUrl(modelPath(entry.slug)),
      lastModified: new Date(entry.updated),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    {
      url: absoluteUrl("/privacy"),
      changeFrequency: "yearly" as const,
      priority: 0.1,
    },
  ];
}
