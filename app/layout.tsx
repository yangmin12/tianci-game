import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crossword Clue Solver - Find Answers Fast",
  description: "The fastest way to find crossword clue answers. Search by clue, pattern, or length. Updated daily with new clues from major newspapers.",
  keywords: "crossword clue solver, crossword answers, crossword help, puzzle solver",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
