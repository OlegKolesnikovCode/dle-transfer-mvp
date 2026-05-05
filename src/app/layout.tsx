import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DLE Transfer MVP Demo",
  description: "Demo UI for the Transfer-only Deterministic Ledger Engine MVP"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}