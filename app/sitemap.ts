import type { MetadataRoute } from "next";
import { companies } from "@/lib/data";
import { englishPath } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { getPublishedGuides, getGuideIndexUpdated } from "@/lib/guides";

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

type PublicRoute = {
  path: string;
  changeFrequency: ChangeFrequency;
  priority: number;
  lastModified: string;
};

/**
 * Indexable routes only.
 * /concepts is a design preview (noindex).
 * /documents and /procedures redirect to /prepare.
 * /company/facebook redirects to /company/meta.
 */
const STATIC_ROUTES: PublicRoute[] = [
  { path: "/", changeFrequency: "weekly", priority: 1, lastModified: "2026-08-23" },
  { path: "/services", changeFrequency: "weekly", priority: 0.9, lastModified: "2026-08-23" },
  { path: "/prepare", changeFrequency: "monthly", priority: 0.8, lastModified: "2026-08-23" },
  { path: "/compare", changeFrequency: "monthly", priority: 0.8, lastModified: "2026-08-23" },
  { path: "/guide", changeFrequency: "monthly", priority: 0.7, lastModified: "2026-08-23" },
  { path: "/about", changeFrequency: "monthly", priority: 0.5, lastModified: "2026-08-23" },
  { path: "/updates", changeFrequency: "weekly", priority: 0.6, lastModified: "2026-08-23" },
  { path: "/contact", changeFrequency: "yearly", priority: 0.4, lastModified: "2026-08-23" },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3, lastModified: "2026-08-22" },
];

function absolutePageUrl(path: string) {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

function localizedEntries(koPath: string, changeFrequency: ChangeFrequency, priority: number, lastModified: string): MetadataRoute.Sitemap {
  const enPath = englishPath(koPath);
  const languages = {
    "ko-KR": absolutePageUrl(koPath),
    en: absolutePageUrl(enPath),
    "x-default": absolutePageUrl(koPath),
  };

  return [koPath, enPath].map((path) => ({
    url: absolutePageUrl(path),
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = STATIC_ROUTES.flatMap((route) =>
    localizedEntries(route.path, route.changeFrequency, route.priority, route.lastModified),
  );

  const companyEntries = companies.flatMap((company) =>
    localizedEntries(`/company/${company.slug}`, "monthly", 0.7, company.lastUpdated || "2026-08-22"),
  );

  const guides = getPublishedGuides();
  const guideEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/guides`, lastModified: getGuideIndexUpdated(guides), changeFrequency: "weekly", priority: 0.8 },
    ...guides.map((guide) => ({ url: `${SITE_URL}/guides/${guide.slug}`, lastModified: guide.updated ?? guide.date, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
  return [...staticEntries, ...companyEntries, ...guideEntries];
}
