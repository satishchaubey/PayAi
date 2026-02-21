import type { Metadata } from "next";
import { absoluteUrl } from "@/app/seo";

export const metadata: Metadata = {
  title: "BBPS AI Assistant",
  description:
    "AI assistant for BBPS operations with contextual chat, PDF extraction, image OCR, and guidance for payment failures, refunds, and settlements.",
  alternates: {
    canonical: "/bbps-assistant"
  },
  openGraph: {
    title: "BBPS AI Assistant | PayAi",
    description:
      "Use PayAi BBPS Assistant to understand bill validation, payment lifecycle, settlement, reversals, and operational recovery steps.",
    url: absoluteUrl("/bbps-assistant")
  },
  twitter: {
    card: "summary_large_image",
    title: "BBPS AI Assistant | PayAi",
    description:
      "AI support for BBPS payment operations with PDF and image context."
  }
};

export default function BBPSAssistantLayout({ children }: { children: React.ReactNode }) {
  return children;
}
