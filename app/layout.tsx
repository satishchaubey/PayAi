import type { Metadata } from "next";
import "./globals.css";
import AppHeader from "@/components/AppHeader";
import { METADATA_BASE, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_NAME, SITE_URL, absoluteUrl } from "@/app/seo";

export const metadata: Metadata = {
  metadataBase: METADATA_BASE,
  title: {
    default: "PayAi | Payment Intelligence Platform",
    template: "%s | PayAi"
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: SITE_KEYWORDS,
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    url: absoluteUrl("/"),
    siteName: SITE_NAME,
    title: "PayAi | Payment Intelligence Platform",
    description: SITE_DESCRIPTION,
    locale: "en_US"
  },
  twitter: {
    card: "summary_large_image",
    title: "PayAi | Payment Intelligence Platform",
    description: SITE_DESCRIPTION
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: SITE_URL,
    description: SITE_DESCRIPTION
  };

  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <AppHeader />
        <div className="app-main">{children}</div>
      </body>
    </html>
  );
}
