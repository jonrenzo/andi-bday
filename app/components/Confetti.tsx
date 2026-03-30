"use client";

import { useMemo } from "react";

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
  rotation: number;
  endRotation: number;
  shape: "circle" | "square" | "ribbon";
  wobble: number;
}

interface ConfettiProps {
  isActive: boolean;
}

const CONFETTI_COLORS = [
  "#FF6B9D",
  "#FFE66D",
  "#4ECDC4",
  "#A8E6CF",
  "#FF8B94",
  "#B8A9C9",
  "#F7DC6F",
  "#85C1E9",
  "#F8B500",
  "#FF6F61",
];

const SHAPES: ConfettiPiece["shape"][] = ["circle", "square", "ribbon"];

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function generateConfetti(count: number, seed: number): ConfettiPiece[] {
  const pieces: ConfettiPiece[] = [];
  
  for (let i = 0; i < count; i++) {
    const s1 = seededRandom(seed + i);
    const s2 = seededRandom(seed + i + 100);
    const s3 = seededRandom(seed + i + 200);
    const s4 = seededRandom(seed + i + 300);
    const s5 = seededRandom(seed + i + 400);
    const s6 = seededRandom(seed + i + 500);
    const s7 = seededRandom(seed + i + 600);

    const rotation = s1 * 360;
    const endRotation = rotation + 720 + s2 * 360;

    pieces.push({
      id: i,
      x: s3 * 100,
      color: CONFETTI_COLORS[Math.floor(s4 * CONFETTI_COLORS.length)],
      size: 8 + s5 * 12,
      delay: s6 * 0.8,
      duration: 2.5 + s7 * 2,
      rotation,
      endRotation,
      shape: SHAPES[Math.floor(s1 * SHAPES.length)],
      wobble: 20 + s2 * 40,
    });
  }
  
  return pieces;
}

export function Confetti({ isActive }: ConfettiProps) {
  const pieces = useMemo(() => isActive ? generateConfetti(80, 42) : [], [isActive]);

  if (!isActive) return null;

  return (
    <div className="confetti-container">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className={`confetti-piece confetti-${piece.shape}`}
          style={{
            left: `${piece.x}%`,
            backgroundColor: piece.color,
            width: piece.shape === "ribbon" ? `${piece.size * 0.4}px` : `${piece.size}px`,
            height: piece.shape === "ribbon" ? `${piece.size * 2}px` : `${piece.size}px`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            "--wobble": `${piece.wobble}px`,
            "--rotation": `${piece.rotation}deg`,
            "--end-rotation": `${piece.endRotation}deg`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
