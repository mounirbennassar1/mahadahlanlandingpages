import type { MetadataRoute } from "next";
import { SPECIALTIES } from "@/app/_home/config";
import {
  getActiveDevices,
  getActiveDoctors,
  getPublishedArticles,
} from "@/lib/content";
import { SITE_URL } from "@/lib/site";

/** Refresh the cached sitemap hourly so new dashboard content shows up. */
export const revalidate = 3600;

const STATIC: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "monthly" }[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/en", priority: 0.9, changeFrequency: "weekly" },
  { path: "/services", priority: 0.9, changeFrequency: "weekly" },
  { path: "/offers", priority: 0.9, changeFrequency: "daily" },
  { path: "/careers", priority: 0.5, changeFrequency: "monthly" },
  { path: "/book-now", priority: 0.9, changeFrequency: "monthly" },
  { path: "/about-us", priority: 0.7, changeFrequency: "monthly" },
  { path: "/doctors", priority: 0.7, changeFrequency: "monthly" },
  { path: "/our-devices", priority: 0.6, changeFrequency: "monthly" },
  { path: "/news-articles", priority: 0.7, changeFrequency: "weekly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [doctors, devices, { items: articles }] = await Promise.all([
    getActiveDoctors(),
    getActiveDevices(),
    getPublishedArticles(),
  ]);

  const now = new Date();
  const url = (path: string) => `${SITE_URL}${path}`;

  return [
    ...STATIC.map((s) => ({
      url: url(s.path),
      lastModified: now,
      changeFrequency: s.changeFrequency,
      priority: s.priority,
    })),
    ...SPECIALTIES.map((s) => ({
      url: url(`/${s.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...doctors.map((d) => ({
      url: url(`/doctors/${d.slug}`),
      lastModified: d.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...devices.map((d) => ({
      url: url(`/our-devices/${d.slug}`),
      lastModified: d.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...articles.map((a) => ({
      url: url(`/news-articles/${a.slug}`),
      lastModified: a.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
