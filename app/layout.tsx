import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Interactive Scheduling Algorithm Simulator - SRTF, FCFS, and More",
  description:
    "Explore and simulate various CPU scheduling algorithms like Shortest Remaining Time First (SRTF), First Come First Serve (FCFS), and more. Perfect for learning and testing CPU scheduling concepts.",
  keywords: [
    "scheduling algorithm simulator",
    "SRTF",
    "FCFS",
    "CPU scheduling",
    "OS algorithms",
    "interactive simulator",
  ],
  openGraph: {
    title: "Interactive Scheduling Algorithm Simulator",
    description:
      "Test and learn CPU scheduling algorithms like SRTF, FCFS, and others with this interactive simulator.",
    url: "https://scheduling-algorithm-simulator.vercel.app/",
    siteName: "Scheduling Algorithm Simulator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Interactive Scheduling Algorithm Simulator",
    description:
      "Simulate various CPU scheduling algorithms for learning and testing.",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
