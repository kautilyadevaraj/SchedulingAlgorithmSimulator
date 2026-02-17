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
  title: "Simulador de Planificación de CPU SJF",
  description:
    "Explora y simula el algoritmo de planificación de CPU Shortest Job First (SJF). Perfecto para aprender y probar conceptos de planificación de CPU.",
  keywords: [
    "simulador de algoritmos de planificación",
    "SJF",
    "planificación de CPU",
    "algoritmos de SO",
    "simulador interactivo",
  ],
  openGraph: {
    title: "Simulador de Planificación de CPU SJF",
    description:
      "Prueba y aprende el algoritmo de planificación de CPU SJF con este simulador interactivo.",
    url: "https://scheduling-algorithm-simulator.vercel.app/",
    siteName: "Simulador de Planificación SJF",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Simulador de Planificación de CPU SJF",
    description:
      "Simula el algoritmo de planificación de CPU SJF para aprender y probar.",
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
