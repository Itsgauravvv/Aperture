import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://aperture-a11y.vercel.app";
  return [
    { url: `${baseUrl}/`, lastModified: new Date(), priority: 1.0 },
    { url: `${baseUrl}/docs`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/playground`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/install`, lastModified: new Date(), priority: 0.8 },
  ];
}