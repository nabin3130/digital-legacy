import type { MetadataRoute } from "next";
import { companies } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/prepare", "/about", "/contact", "/privacy", "/updates"];
  const routes = [...staticRoutes, ...companies.map((company) => `/company/${company.slug}`)];

  return routes.map((route, index) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date("2026-08-08"),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : index < staticRoutes.length ? 0.8 : 0.7,
  }));
}
