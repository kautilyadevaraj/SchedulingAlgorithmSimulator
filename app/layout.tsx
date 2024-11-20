import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/footer";
import { Analytics } from "@vercel/analytics/react";
import { cn } from "@/lib/utils";

const inter = JetBrains_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CPU Scheduling Algorithm Simulator",
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
    title: "CPU Scheduling Algorithm Simulator",
    description:
      "Test and learn CPU scheduling algorithms like SRTF, FCFS, and others with this interactive simulator.",
    url: "https://scheduling-algorithm-simulator.vercel.app/",
    siteName: "Scheduling Algorithm Simulator",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CPU Scheduling Algorithm Simulator",
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
      <meta
        name="google-site-verification"
        content="l7MqVL5_9AEbO8FaJpT-XLlxSLYCdbCoIrV0Y4G9IXw"
      />

      <body
        className={cn("antialiased" , inter.className)}
      >
        <div className="flex flex-col min-h-screen">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <main className="flex-grow">{children}</main>
          </ThemeProvider>
          <Footer />
        </div>
        <Analytics/>
      </body>
    </html>
  );
}
