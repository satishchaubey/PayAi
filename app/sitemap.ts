import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/app/seo";

const routes = ["/", "/bbps-assistant", "/payment-flow", "/js-internals", "/company-solutions", "/journey"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((route) => ({
    url: absoluteUrl(route),
    lastModified,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.8
  }));
}
