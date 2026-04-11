"use client";

import { useEffect, useState } from "react";

const COLORS = ["#2D6A4F", "#F4845F", "#FFB703", "#8ECAE6", "#E53E3B"];

export function Confetti({ count = 30 }: { count?: number }) {
  const [particles, setParticles] = useState<{ id: number; x: number; color: string; delay: number; size: number }[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: COLORS[i % COLORS.length],
        delay: Math.random() * 0.5,
        size: 4 + Math.random() * 6,
      }))
    );
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9998]" aria-hidden>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: -10,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.size > 7 ? "50%" : "1px",
            animation: `confetti-fall 2.5s ${p.delay}s ease-out forwards`,
          }}
        />
      ))}
    </div>
  );
}
