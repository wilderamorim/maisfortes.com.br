import type { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { ServiceWorkerRegistration } from "@/components/layout/ServiceWorkerRegistration";
import { CookieConsent } from "@/components/layout/CookieConsent";
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
    "Plataforma gratuita de acompanhamento com rede de apoio. Check-in diário, streak, conquistas e rede de apoio — ninguém muda sozinho.",
  manifest: "/manifest.json",
  openGraph: {
    title: "+Fortes — Juntos, somos mais fortes",
    description: "Ninguém muda sozinho. +Fortes conecta você com quem te apoia.",
    url: "https://maisfortes.com.br",
    siteName: "+Fortes",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "+Fortes — Juntos, somos mais fortes",
    description: "Ninguém muda sozinho. +Fortes conecta você com quem te apoia.",
  },
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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme')||'light';document.documentElement.setAttribute('data-theme',t)})()`,
          }}
        />
      </head>
      <body className="min-h-dvh antialiased">
        <ThemeProvider>
          {children}
          <CookieConsent />
          <ServiceWorkerRegistration />
        </ThemeProvider>
      </body>
    </html>
  );
}
