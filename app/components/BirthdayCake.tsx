"use client";

interface BirthdayCakeProps {
  name: string;
  isBlowing: boolean;
  blowIntensity: number;
  isExtinguished: boolean;
}

const SPRINKLES = [
  { x: 22, y: 35, r: 45, c: "#FF6B9D", w: 4, h: 11 },
  { x: 45, y: 20, r: 128, c: "#FFE66D", w: 5, h: 13 },
  { x: 60, y: 55, r: 234, c: "#4ECDC4", w: 4, h: 10 },
  { x: 73, y: 40, r: 67, c: "#A8E6CF", w: 5, h: 12 },
  { x: 35, y: 70, r: 189, c: "#FF8B94", w: 5, h: 13 },
  { x: 15, y: 60, r: 312, c: "#B8A9C9", w: 4, h: 9 },
  { x: 83, y: 30, r: 156, c: "#FF6B9D", w: 5, h: 11 },
  { x: 50, y: 80, r: 89, c: "#FFE66D", w: 3, h: 8 },
  { x: 28, y: 50, r: 267, c: "#4ECDC4", w: 5, h: 14 },
  { x: 66, y: 75, r: 201, c: "#A8E6CF", w: 4, h: 10 },
  { x: 78, y: 65, r: 78, c: "#FF8B94", w: 4, h: 10 },
  { x: 40, y: 25, r: 145, c: "#B8A9C9", w: 5, h: 12 },
];

function Sprinkles({ layer }: { layer: number }) {
  return (
    <>
      {SPRINKLES.map((s, i) => (
        <div
          key={`${layer}-${i}`}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.w,
            height: s.h,
            backgroundColor: s.c,
            borderRadius: 9999,
            transform: `rotate(${s.r + layer * 37}deg)`,
            pointerEvents: "none",
          }}
        />
      ))}
    </>
  );
}

function CakeLayer({
  width,
  height,
  bodyColor,
  frostColor,
  shadowColor,
  drips,
  dripColor,
  sprinkleOffset,
  delay,
}: {
  width: number;
  height: number;
  bodyColor: string;
  frostColor: string;
  shadowColor: string;
  drips: number[];
  dripColor: string;
  sprinkleOffset: number;
  delay: string;
}) {
  return (
    <div
      style={{
        width,
        position: "relative",
        animation: `cakeDrop 0.45s cubic-bezier(0.34,1.4,0.64,1) ${delay} both`,
        zIndex: 1,
      }}
    >
      {/* Frosting top */}
      <div
        style={{
          position: "relative",
          height: 18,
          background: frostColor,
          borderRadius: "8px 8px 0 0",
          zIndex: 2,
          boxShadow: `0 -2px 0 rgba(255,255,255,0.6)`,
        }}
      >
        {/* Drips */}
        {drips.map((pos, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 12,
              left: `${pos}%`,
              width: 14,
              height: 16 + (i % 3) * 6,
              background: dripColor,
              borderRadius: "0 0 50% 50%",
              zIndex: 1,
            }}
          />
        ))}
      </div>

      {/* Cake body */}
      <div
        style={{
          height,
          background: `linear-gradient(to right, ${bodyColor}cc, ${bodyColor}, ${bodyColor}dd)`,
          position: "relative",
          overflow: "hidden",
          boxShadow: `inset -6px 0 14px ${shadowColor}, inset 0 -4px 10px rgba(0,0,0,0.06)`,
        }}
      >
        {/* Subtle highlight */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "30%",
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)",
            pointerEvents: "none",
          }}
        />
        <Sprinkles layer={sprinkleOffset} />
      </div>

      {/* Layer shadow line */}
      <div
        style={{
          height: 4,
          background: `linear-gradient(to bottom, ${shadowColor}, transparent)`,
        }}
      />
    </div>
  );
}

export default function BirthdayCake({
  name,
  isBlowing,
  blowIntensity,
  isExtinguished,
}: BirthdayCakeProps) {
  const flameOpacity = isExtinguished
    ? 0
    : isBlowing
      ? 1 - blowIntensity * 0.4
      : 1;
  const flameSkew = isBlowing ? blowIntensity * 35 : 0;
  const flameScale = isBlowing ? 1 - blowIntensity * 0.45 : 1;

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        userSelect: "none",
      }}
    >
      {/* ── CAKE ── */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* CANDLE + FLAME */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: -2,
          }}
        >
          {/* Flame */}
          <div
            style={{
              width: 22,
              height: 34,
              position: "relative",
              marginBottom: -2,
              opacity: flameOpacity,
              transform: `skewX(${flameSkew}deg) scale(${flameScale})`,
              transition: "opacity 0.2s, transform 0.1s",
              animation:
                !isExtinguished && !isBlowing
                  ? "flicker 0.9s ease-in-out infinite"
                  : "none",
            }}
          >
            {/* Outer flame */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: 18,
                height: 30,
                background:
                  "radial-gradient(ellipse at 50% 70%, #ffcc00 0%, #ff8800 50%, #ff4400 100%)",
                borderRadius: "50% 50% 30% 30% / 60% 60% 40% 40%",
              }}
            />
            {/* Inner flame */}
            <div
              style={{
                position: "absolute",
                bottom: 3,
                left: "50%",
                transform: "translateX(-50%)",
                width: 10,
                height: 20,
                background:
                  "radial-gradient(ellipse at 50% 70%, #fff5a0 0%, #ffdd00 60%, transparent 100%)",
                borderRadius: "50% 50% 30% 30% / 60% 60% 40% 40%",
              }}
            />
            {/* Glow */}
            <div
              style={{
                position: "absolute",
                bottom: -4,
                left: "50%",
                transform: "translateX(-50%)",
                width: 36,
                height: 36,
                background:
                  "radial-gradient(circle, rgba(255,200,50,0.35) 0%, transparent 70%)",
                borderRadius: "50%",
                animation: !isExtinguished
                  ? "glow 0.9s ease-in-out infinite"
                  : "none",
              }}
            />
          </div>

          {/* Smoke */}
          {isExtinguished && (
            <div
              style={{
                position: "absolute",
                bottom: 30,
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="smoke-particle"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    left: `${(i - 1) * 5}px`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Candle */}
          <div
            style={{
              width: 16,
              height: 52,
              background:
                "linear-gradient(to right, #ff4d8f, #ff69a4, #ff8fbf, #ff4d8f)",
              borderRadius: "3px 3px 2px 2px",
              position: "relative",
              overflow: "hidden",
              boxShadow:
                "inset -3px 0 6px rgba(0,0,0,0.12), 1px 2px 4px rgba(0,0,0,0.15)",
              zIndex: 2,
            }}
          >
            {/* Stripes */}
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: `${18 + i * 10}px`,
                  height: 5,
                  background: "rgba(255,255,255,0.35)",
                  transform: "skewY(-6deg)",
                }}
              />
            ))}
            {/* Wick */}
            <div
              style={{
                position: "absolute",
                top: -4,
                left: "50%",
                transform: "translateX(-50%)",
                width: 2,
                height: 7,
                background: "#2a1a0e",
                borderRadius: 1,
              }}
            />
          </div>
        </div>

        {/* Cake layers wrapper for overlay positioning */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* TOP LAYER */}
          <CakeLayer
            width={170}
            height={62}
            bodyColor="#fff9c2"
            frostColor="#fffde0"
            shadowColor="rgba(200,190,80,0.18)"
            drips={[22, 42, 62, 82]}
            dripColor="#fffbcc"
            sprinkleOffset={15}
            delay="0.05s"
          />

          {/* MIDDLE LAYER */}
          <CakeLayer
            width={230}
            height={72}
            bodyColor="#b2ede8"
            frostColor="#d4f5f2"
            shadowColor="rgba(60,180,170,0.15)"
            drips={[15, 33, 52, 70, 88]}
            dripColor="#c8f0ed"
            sprinkleOffset={32}
            delay="0.1s"
          />

          {/* BOTTOM LAYER */}
          <CakeLayer
            width={295}
            height={82}
            bodyColor="#ffb3c8"
            frostColor="#ffd0df"
            shadowColor="rgba(255,80,140,0.15)"
            drips={[10, 24, 40, 57, 73, 88]}
            dripColor="#ffc8d8"
            sprinkleOffset={0}
            delay="0.15s"
          />

          {/* Name banner - overlays the front of the cake */}
          <div
            style={{
              position: "absolute",
              bottom: -10,
              left: "23%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              animation:
                "bannerPop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.3s both",
              zIndex: 10,
              filter: "drop-shadow(0 3px 8px rgba(220,60,120,0.25))",
            }}
          >
            {/* Left arrow */}
            <div
              style={{
                width: 0,
                height: 0,
                borderTop: "18px solid transparent",
                borderBottom: "18px solid transparent",
                borderRight: "20px solid #e8155e",
              }}
            />
            <div
              style={{
                background: "#f0286a",
                padding: "10px 26px",
                minWidth: 120,
                textAlign: "center",
              }}
            >
              <span
                style={{
                  color: "#fff",
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 900,
                  fontSize: 20,
                  letterSpacing: "0.04em",
                  textShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }}
              >
                {name}
              </span>
            </div>
            {/* Right arrow */}
            <div
              style={{
                width: 0,
                height: 0,
                borderTop: "18px solid transparent",
                borderBottom: "18px solid transparent",
                borderLeft: "20px solid #e8155e",
              }}
            />
          </div>
        </div>

        {/* Plate */}
        <div
          style={{
            animation: "plateSlide 0.4s ease 0.35s both",
            position: "relative",
            zIndex: 0,
          }}
        >
          <div
            style={{
              width: 340,
              height: 16,
              background: "linear-gradient(to bottom, #f8f0f4, #eedde8)",
              borderRadius: "50%",
              marginTop: 6,
              boxShadow:
                "0 4px 16px rgba(200,100,150,0.18), 0 1px 0 rgba(255,255,255,0.8) inset",
            }}
          />
          <div
            style={{
              width: 280,
              height: 10,
              background: "linear-gradient(to bottom, #e8d5e2, #d9c4d5)",
              borderRadius: "0 0 50% 50%",
              margin: "0 auto",
              boxShadow: "0 3px 8px rgba(180,100,150,0.15)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
