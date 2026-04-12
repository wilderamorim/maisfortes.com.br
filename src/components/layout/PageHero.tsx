import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function PageHero({
  title,
  subtitle,
  backHref = "/",
  icon,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #2D6A4F 0%, #1B4332 50%, #081C15 100%)" }}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute" style={{ width: 500, height: 500, top: -200, right: -100, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />
        <div className="absolute" style={{ width: 300, height: 300, bottom: -100, left: -50, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16 relative">
        <Link href={backHref} className="inline-flex items-center gap-1 text-xs mb-8 transition-opacity hover:opacity-70" style={{ color: "rgba(255,255,255,0.5)" }}>
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar
        </Link>

        <div className="flex items-center gap-4">
          {icon && (
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.12)" }}>
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
