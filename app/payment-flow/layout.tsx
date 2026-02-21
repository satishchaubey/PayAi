import type { Metadata } from "next";
import { absoluteUrl } from "@/app/seo";

export const metadata: Metadata = {
  title: "Payment Flow Graph",
  description:
    "Interactive graph for BBPS and blockchain payment flows, including token generation, bill fetch, validation, payment, status, and complaint workflows.",
  alternates: {
    canonical: "/payment-flow"
  },
  openGraph: {
    title: "Payment Flow Graph | PayAi",
    description:
      "Explore API and operational flow from authentication to settlement and complaint handling in BBPS-style payment systems.",
    url: absoluteUrl("/payment-flow")
  },
  twitter: {
    card: "summary_large_image",
    title: "Payment Flow Graph | PayAi",
    description: "Visualize BBPS and blockchain payment lifecycles with interactive graph layers."
  }
};

export default function PaymentFlowLayout({ children }: { children: React.ReactNode }) {
  return children;
}
