import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rankwell — SEO that runs itself",
  description:
    "Audits, keyword research, AI-search visibility, backlinks and reporting in one SEO platform.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
