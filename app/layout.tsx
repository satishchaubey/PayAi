import type { Metadata } from "next";
import "./globals.css";
import AppHeader from "@/components/AppHeader";

export const metadata: Metadata = {
  title: "JS Internals Visualizer",
  description: "Visual playground for understanding JavaScript internals"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppHeader />
        <div className="app-main">{children}</div>
      </body>
    </html>
  );
}
