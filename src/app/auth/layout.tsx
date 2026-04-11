import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Faça login ou crie sua conta no +Fortes. Plataforma gratuita de acompanhamento com rede de apoio.",
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
