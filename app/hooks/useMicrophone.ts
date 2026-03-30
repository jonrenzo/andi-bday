"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface UseMicrophoneReturn {
  isListening: boolean;
  isBlowing: boolean;
  blowIntensity: number;
  hasPermission: boolean | null;
  error: string | null;
  startListening: () => Promise<void>;
  stopListening: () => void;
}

const VOLUME_THRESHOLD = 15;
const BLOW_CONFIRMATION_TIME = 150;
const EXTINGUISH_THRESHOLD = 0.6;
const EXTINGUISH_DURATION = 400;

export function useMicrophone(onExtinguish?: () => void): UseMicrophoneReturn {
  const [isListening, setIsListening] = useState(false);
  const [isBlowing, setIsBlowing] = useState(false);
  const [blowIntensity, setBlowIntensity] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const blowStartTimeRef = useRef<number | null>(null);
  const sustainedBlowStartRef = useRef<number | null>(null);
  const hasExtinguishedRef = useRef(false);
  const onExtinguishRef = useRef(onExtinguish);

  useEffect(() => {
    onExtinguishRef.current = onExtinguish;
  }, [onExtinguish]);

  const stopListening = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    blowStartTimeRef.current = null;
    sustainedBlowStartRef.current = null;

    setIsListening(false);
    setIsBlowing(false);
    setBlowIntensity(0);
  }, []);

  const startListening = useCallback(async () => {
    try {
      setError(null);
      hasExtinguishedRef.current = false;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      streamRef.current = stream;
      setHasPermission(true);

      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();

      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.3;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      setIsListening(true);

      const analyzeAudio = () => {
        if (!analyserRef.current || hasExtinguishedRef.current) return;

        const analyzer = analyserRef.current;
        const bufferLength = analyzer.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        analyzer.getByteFrequencyData(dataArray);

        const lowFreqEnd = Math.floor(bufferLength * 0.15);
        let lowFreqSum = 0;
        for (let i = 0; i < lowFreqEnd; i++) {
          lowFreqSum += dataArray[i];
        }
        const lowFreqAverage = lowFreqSum / lowFreqEnd;

        let totalSum = 0;
        for (let i = 0; i < bufferLength; i++) {
          totalSum += dataArray[i];
        }
        const overallAverage = totalSum / bufferLength;

        const rawIntensity = Math.min(
          1,
          Math.max(
            0,
            (overallAverage - VOLUME_THRESHOLD) / (100 - VOLUME_THRESHOLD),
          ),
        );

        const now = Date.now();

        if (
          lowFreqAverage > VOLUME_THRESHOLD &&
          overallAverage > VOLUME_THRESHOLD * 0.8
        ) {
          if (!blowStartTimeRef.current) {
            blowStartTimeRef.current = now;
          }

          if (now - blowStartTimeRef.current > BLOW_CONFIRMATION_TIME) {
            setIsBlowing(true);
            setBlowIntensity(rawIntensity);

            if (rawIntensity > EXTINGUISH_THRESHOLD) {
              if (!sustainedBlowStartRef.current) {
                sustainedBlowStartRef.current = now;
              } else if (
                now - sustainedBlowStartRef.current >
                EXTINGUISH_DURATION
              ) {
                hasExtinguishedRef.current = true;
                setIsBlowing(false);
                setBlowIntensity(0);
                onExtinguishRef.current?.();
                return;
              }
            } else {
              sustainedBlowStartRef.current = null;
            }
          }
        } else {
          blowStartTimeRef.current = null;
          sustainedBlowStartRef.current = null;
          setIsBlowing(false);
          setBlowIntensity((prev) => Math.max(0, prev - 0.1));
        }

        animationFrameRef.current = requestAnimationFrame(analyzeAudio);
      };

      animationFrameRef.current = requestAnimationFrame(analyzeAudio);
    } catch (err) {
      setHasPermission(false);
      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          setError(
            "Microphone access denied. Please allow microphone access to blow out the candle!",
          );
        } else if (err.name === "NotFoundError") {
          setError(
            "No microphone found. Please connect a microphone to blow out the candle!",
          );
        } else {
          setError(`Microphone error: ${err.message}`);
        }
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  const reset = useCallback(() => {
    hasExtinguishedRef.current = false;
    stopListening();
  }, [stopListening]);

  return {
    isListening,
    isBlowing,
    blowIntensity,
    hasPermission,
    error,
    startListening,
    stopListening: reset,
  };
}
