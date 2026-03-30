"use client";

import { useState, useCallback } from "react";
import BirthdayCake from "./components/BirthdayCake";
import { Confetti } from "./components/Confetti";
import { useMicrophone } from "./hooks/useMicrophone";

type GameState = "idle" | "listening" | "extinguished";

function Modal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-[fade-in_0.3s_ease-out]"
        onClick={onClose}
      />

      {/* Modal card */}
      <div
        className="relative bg-gradient-to-br from-white to-[#FFF5F7] rounded-3xl shadow-2xl
                      p-8 md:p-10 max-w-md w-full text-center
                      animate-[modal-entrance_0.5s_cubic-bezier(0.34,1.56,0.64,1)_forwards]
                      border-4 border-[#FF6B9D]/20"
      >
        {/* Decorative corners */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-[#FF6B9D]/30 rounded-tl-xl" />
        <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-[#FF6B9D]/30 rounded-tr-xl" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-[#FF6B9D]/30 rounded-bl-xl" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-[#FF6B9D]/30 rounded-br-xl" />

        {/* Cake emoji decoration */}
        <div className="text-6xl md:text-7xl mb-4 animate-[bounce_1s_ease-in-out_infinite]">
          🎂
        </div>

        {/* Birthday message */}
        <h1
          className="font-[family-name:var(--font-display)] font-bold text-3xl md:text-4xl
                       text-[#FF6B9D] mb-2
                       drop-shadow-[0_2px_4px_rgba(255,107,157,0.3)]"
        >
          Happy Birthday!
        </h1>
        <h2
          className="font-[family-name:var(--font-display)] text-2xl md:text-3xl
                       text-[#5D4037] mb-6"
        >
          Andi
        </h2>

        {/* Wish text */}
        <p className="font-[family-name:var(--font-body)] text-[#6D5D53] mb-8 text-base md:text-lg leading-relaxed">
          Happy Birthday baby! Congrattts babyyy!! May youuu achieve what you
          want to achieve in your life! &nbsp; Thank youuu for being the most
          amazingg person, so lucky ko to have u! Enjoy your day, baby! mwah
          mwah mwah
        </p>

        {/* Close button */}
        <button
          onClick={onClose}
          className="font-[family-name:var(--font-display)] font-semibold text-white
                     bg-gradient-to-br from-[#FF6B9D] to-[#E85A8A]
                     px-8 py-3 rounded-full cursor-pointer
                     shadow-[0_4px_15px_rgba(232,90,138,0.4)]
                     hover:shadow-[0_6px_20px_rgba(232,90,138,0.5)]
                     hover:scale-105 hover:-translate-y-0.5
                     active:scale-100 active:translate-y-0
                     transition-all duration-300 ease-out
                     text-lg touch-manipulation"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [showConfetti, setShowConfetti] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleExtinguish = useCallback(() => {
    setGameState("extinguished");
    setShowConfetti(true);
    setTimeout(() => setShowModal(true), 500);
  }, []);

  const {
    isListening,
    isBlowing,
    blowIntensity,
    error,
    startListening,
    stopListening,
  } = useMicrophone(handleExtinguish);

  const handleStart = async () => {
    await startListening();
    setGameState("listening");
  };

  const handleReset = () => {
    stopListening();
    setShowConfetti(false);
    setShowModal(false);
    setGameState("idle");
  };

  return (
    <div
      className="min-h-screen min-h-dvh flex flex-col items-center justify-center p-6
                    bg-gradient-to-br from-[#FFF5E6] via-[#FFE5EC] to-[#E8F4F8] relative overflow-hidden"
    >
      {/* Decorative floating shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#FFB6C1] opacity-15
                        animate-[shape-float_15s_ease-in-out_infinite]"
        />
        <div
          className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-[#98D8C8] opacity-15
                        animate-[shape-float_15s_ease-in-out_infinite_5s]"
        />
        <div
          className="absolute top-1/3 left-4 w-36 h-36 rounded-full bg-[#FFEAA7] opacity-15
                        animate-[shape-float_15s_ease-in-out_infinite_10s] hidden md:block"
        />
        <div
          className="absolute bottom-1/5 right-10 w-24 h-24 rounded-full bg-[#FF8B94] opacity-15
                        animate-[shape-float_15s_ease-in-out_infinite_7s] hidden md:block"
        />
      </div>

      {/* Confetti celebration */}
      <Confetti isActive={showConfetti} />

      {/* Modal */}
      {showModal && <Modal onClose={handleReset} />}

      {/* Main content */}
      <div className="flex flex-col items-center relative z-10 w-full max-w-full">
        {/* Instruction text */}
        {gameState === "idle" && (
          <p
            className="font-[family-name:var(--font-display)] text-xl md:text-2xl text-[#5D4037]
                         text-center mb-10 animate-[fade-in-up_0.6s_ease-out_0.5s_both]
                         drop-shadow-[0_2px_4px_rgba(255,255,255,0.5)] pt-20"
          >
            Make a wish and blow out the candle!
          </p>
        )}

        {gameState === "listening" && (
          <p
            className="font-[family-name:var(--font-display)] text-xl md:text-2xl text-[#5D4037]
                         text-center mb-8 animate-[pulse-text_2s_ease-in-out_infinite]
                         drop-shadow-[0_2px_4px_rgba(255,255,255,0.5)]"
          >
            Blow into your microphone...
          </p>
        )}

        {/* The cake - always visible */}
        <BirthdayCake
          name="Andi"
          isBlowing={isBlowing}
          blowIntensity={blowIntensity}
          isExtinguished={gameState === "extinguished"}
        />

        {/* Action buttons */}
        {gameState === "idle" && (
          <button
            onClick={handleStart}
            type="button"
            className="font-[family-name:var(--font-display)] font-semibold text-white
                       bg-gradient-to-br from-[#FF6B9D] to-[#E85A8A]
                       px-10 py-4 rounded-full cursor-pointer
                       shadow-[0_6px_20px_rgba(232,90,138,0.4),0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.3)]
                       hover:shadow-[0_10px_30px_rgba(232,90,138,0.5),0_4px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.4)]
                       hover:-translate-y-1 hover:scale-105
                       active:translate-y-0 active:scale-[1.02]
                       transition-all duration-300 ease-out
                       animate-[fade-in-up_0.6s_ease-out_0.7s_both]
                       text-lg md:text-xl mt-8 md:mt-10 touch-manipulation"
          >
            Light the Candle
          </button>
        )}

        {/* Microphone listening indicator */}
        {isListening && gameState === "listening" && (
          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 font-[family-name:var(--font-body)] text-sm text-[#5D4037] opacity-70">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-[mic-pulse_1.5s_ease-in-out_infinite]" />
              <span>Microphone active</span>
            </div>

            {/* Blow intensity indicator */}
            <div className="w-48 md:w-56 h-2 bg-black/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 via-yellow-400 to-orange-500 rounded-full
                           transition-all duration-100 ease-out"
                style={{ width: `${blowIntensity * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div
            className="font-[family-name:var(--font-body)] text-base text-red-700 bg-red-100/50
                          px-5 py-3 rounded-lg mt-6 text-center max-w-md animate-[shake_0.5s_ease-in-out]"
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
