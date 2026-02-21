import type { Metadata } from "next";
import { absoluteUrl } from "@/app/seo";

export const metadata: Metadata = {
  title: "Company Solutions",
  description:
    "Enterprise customer solution interface for onboarding, issue resolution, retention workflows, and demo booking with validated form flows.",
  alternates: {
    canonical: "/company-solutions"
  },
  openGraph: {
    title: "Company Solutions | PayAi",
    description:
      "Production-ready customer operations UI covering onboarding, SLA-driven support, retention, and measurable impact dashboards.",
    url: absoluteUrl("/company-solutions")
  },
  twitter: {
    card: "summary_large_image",
    title: "Company Solutions | PayAi",
    description: "Enterprise customer workflow and impact dashboards built on PayAi."
  }
};

export default function CompanySolutionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
