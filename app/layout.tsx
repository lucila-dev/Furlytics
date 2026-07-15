import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Furlytics – Pet Behaviour & Health",
  description: "Log incidents, detect patterns, and prepare smart summaries for your vet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
