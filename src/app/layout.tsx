import type { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { ServiceWorkerRegistration } from "@/components/layout/ServiceWorkerRegistration";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { PWAInstallBanner } from "@/components/layout/PWAInstallBanner";
import { Analytics } from "@/components/layout/Analytics";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "+Fortes — Juntos, somos mais fortes",
    template: "%s | +Fortes",
  },
  description:
    "Plataforma gratuita de acompanhamento com rede de apoio. Check-in diário, streak, conquistas e rede de apoio — +forte a cada dia.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  metadataBase: new URL("https://maisfortes.com.br"),
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    title: "+Fortes — Juntos, somos mais fortes",
    description: "Plataforma gratuita de acompanhamento com rede de apoio. Check-in diário, streak, conquistas e rede de apoio — +forte a cada dia.",
    url: "https://maisfortes.com.br",
    siteName: "+Fortes",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "+Fortes — +Forte a cada dia." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "+Fortes — Juntos, somos mais fortes",
    description: "Plataforma gratuita de acompanhamento com rede de apoio — +forte a cada dia.",
    images: ["/og-twitter.png"],
  },
  category: "health",
  creator: "MaisFortes",
  publisher: "MaisFortes",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0D1117" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      data-theme="light"
      className={`${outfit.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* iOS PWA */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="+Fortes" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body className="min-h-dvh antialiased" suppressHydrationWarning>
        <ThemeProvider>
          {children}
          <CookieConsent />
          <PWAInstallBanner />
          <ServiceWorkerRegistration />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
