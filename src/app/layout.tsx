import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ResourceProvider } from "@/contexts/resource-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "iWinV API Manager",
  description: "iWinV API Manager Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <ResourceProvider>
          {children}
        </ResourceProvider>
      </body>
    </html>
  );
}
