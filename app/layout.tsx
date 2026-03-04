import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/footer";
import { Analytics } from "@vercel/analytics/react";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const inter = JetBrains_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Simulador de Planificación de CPU para Dummies",
  description:
    "Explora y compará algoritmos de planificación de CPU (SRTF, RRV, MLFQ) en tiempo real. Diseñado para aprender conceptos de sistemas operativos de forma visual.",
  keywords: [
    "simulador de algoritmos de planificación",
    "CPU Scheduling",
    "SRTF",
    "Round Robin Virtual",
    "MLFQ",
    "sistemas operativos",
  ],
  openGraph: {
    title: "Simulador de Planificación de CPU para Dummies",
    description:
      "Aprendé y compará SRTF, Round Robin Virtual y MLFQ con este simulador interactivo.",
    url: "https://scheduling-algorithm-simulator.vercel.app/",
    siteName: "Simulador de Planificación de CPU",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Simulador de Planificación de CPU para Dummies",
    description:
      "Simulá y compará algoritmos de planificación de CPU de forma visual y sencilla.",
  },
  
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
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
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="flex-grow">{children}</main>
            <Toaster richColors position="top-center" />
          </ThemeProvider>
          <Footer />
        </div>
        <Analytics/>
      </body>
    </html>
  );
}
