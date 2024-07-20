import type { Metadata } from "next";
import { Inter, Play } from "next/font/google";
import "./globals.css";
import Provider from "@/utils/provider";

const inter = Inter({ subsets: ["latin"] });
const play = Play({ subsets: ["latin"], weight: "400" });
export const metadata: Metadata = {
  title: "Quizzy",
  description: "Quizzy",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dim">
      <Provider>
        <body className={`${play.className} `}>{children}</body>
      </Provider>
    </html>
  );
}
