import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Convite",
  description: "Você foi convidado para acompanhar uma jornada no +Fortes.",
  openGraph: {
    title: "+Fortes — Convite",
    description: "Alguém quer compartilhar uma jornada de mudança com você.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  robots: { index: false, follow: false },
};

export default function InviteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
