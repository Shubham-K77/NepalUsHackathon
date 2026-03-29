import { useRef, useState, useEffect, useCallback } from "react";

interface AudioButtonProps {
  src: string;
  autoPlay?: boolean;
  compact?: boolean;
}

export function AudioButton({ src, autoPlay = true, compact = false }: AudioButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);

  // Auto-play on mount (once per question)
  useEffect(() => {
    if (autoPlay && !hasAutoPlayed && src) {
      const audio = new Audio(src);
      audioRef.current = audio;

      audio.addEventListener("ended", () => setIsPlaying(false));
      audio.addEventListener("error", () => setIsPlaying(false));

      audio.play().then(() => {
        setIsPlaying(true);
        setHasAutoPlayed(true);
      }).catch(() => {
        // Browser may block auto-play — user can tap to play
        setHasAutoPlayed(true);
      });

      return () => {
        audio.pause();
        audio.removeEventListener("ended", () => setIsPlaying(false));
        audio.removeEventListener("error", () => setIsPlaying(false));
      };
    }
  }, [src, autoPlay, hasAutoPlayed]);

  // Reset auto-play flag when src changes
  useEffect(() => {
    setHasAutoPlayed(false);
  }, [src]);

  const handleReplay = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(src);
    audioRef.current = audio;

    audio.addEventListener("ended", () => setIsPlaying(false));
    audio.play().then(() => setIsPlaying(true)).catch(() => {});
  }, [src]);

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleReplay}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-200 min-h-[36px]
          ${isPlaying
            ? "border-white/60 bg-white/20 text-white"
            : "border-white/40 bg-white/10 text-white hover:bg-white/25"
          }`}
        aria-label="फेरि सुन्नुहोस्"
      >
        <svg
          width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          className={isPlaying ? "animate-pulse" : ""}
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          {isPlaying && <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />}
          {!isPlaying && <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />}
        </svg>
        <span className="text-[13px] font-medium">
          {isPlaying ? "बजिरहेको..." : "सुन्नुस्"}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleReplay}
      className={`flex items-center gap-2 px-5 py-3 rounded-full border-2 transition-all duration-200 min-h-[48px]
        ${isPlaying
          ? "border-[#1F7A7A] bg-[#E8F5F0] text-[#1F7A7A]"
          : "border-[#E0E0E0] bg-white text-[#3B3B3B] hover:border-[#1F7A7A] hover:bg-[#F2FBF7]"
        }`}
      aria-label="फेरि सुन्नुहोस्"
    >
      {/* Speaker icon */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={isPlaying ? "animate-pulse" : ""}
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        {isPlaying && (
          <>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </>
        )}
        {!isPlaying && (
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        )}
      </svg>
      <span className="text-[16px] font-medium">
        {isPlaying ? "बजिरहेको छ..." : "फेरि सुन्नुहोस्"}
      </span>
    </button>
  );
}
