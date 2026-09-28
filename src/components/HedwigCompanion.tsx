import React, { useState, useEffect, useRef } from 'react';
import { useConfig } from '../context/ConfigContext';
import { magicAudio } from '../utils/audioSynth';
import confetti from 'canvas-confetti';
import { Mail, Heart, Sparkles, X, ChevronRight, Feather } from 'lucide-react';

export const HedwigCompanion: React.FC = () => {
  const { config } = useConfig();
  const hedwigConfig = config.hedwig || {
    enabled: true,
    name: 'Hedwig',
    customMessage: 'Hoo! A special delivery just for you: "You are the sweetest part of my day, my favorite person, and my happiest memory. Always." ♥',
    messages: [
      'Hoo! Special owl post: "Every second with you is pure magic. I love you to Hogwarts, Rozhok, and back!" ♥',
      'Hoo hoo! Letter delivery: "Wrapped together in our Hogwarts muffler so you never feel cold. My heart is forever yours."',
      'Gentle nuzzle! "In BGMI or in real life, I will always share my Level 3 vest and protect you with everything I have."',
      'Owl delivery: "You are the Golden Snitch I was lucky enough to catch. Happy early birthday, my whole world! 🌸"',
    ],
    followCursor: true,
  };

  // Perch position on the side of the screen
  const [perchPos, setPerchPos] = useState(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const h = typeof window !== 'undefined' ? window.innerHeight : 768;
    return {
      x: Math.max(50, w - (w < 640 ? 52 : 72)),
      y: Math.max(160, Math.min(h * 0.42, 360)),
    };
  });

  const [currentPos, setCurrentPos] = useState({ x: perchPos.x, y: perchPos.y });
  const [facingRight, setFacingRight] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const [isPerched, setIsPerched] = useState(true);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const targetPosRef = useRef({ x: perchPos.x, y: perchPos.y });
  const animFrameRef = useRef<number | null>(null);
  const lastMoveTimeRef = useRef(Date.now() - 5000); // Start settled on perch
  const isPerchedRef = useRef(true);

  // Keep perchPos updated on window resize
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const newPos = {
        x: Math.max(50, w - (w < 640 ? 52 : 72)),
        y: Math.max(160, Math.min(h * 0.42, 360)),
      };
      setPerchPos(newPos);
      if (isPerchedRef.current) {
        targetPosRef.current = newPos;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Periodic blinking eyes
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 220);
    }, 4200);

    return () => clearInterval(blinkInterval);
  }, []);

  // Cursor & touch motion tracking
  useEffect(() => {
    if (!hedwigConfig.enabled) return;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      lastMoveTimeRef.current = Date.now();
      isPerchedRef.current = false;
      setIsPerched(false);

      if (hedwigConfig.followCursor) {
        // Offset Hedwig smoothly from cursor
        const targetX = Math.min(Math.max(40, clientX + 46), window.innerWidth - 85);
        const targetY = Math.min(Math.max(40, clientY - 45), window.innerHeight - 85);
        targetPosRef.current = { x: targetX, y: targetY };
      }
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, [hedwigConfig.enabled, hedwigConfig.followCursor]);

  // Smooth flight interpolation & return to perch logic
  useEffect(() => {
    if (!hedwigConfig.enabled) return;

    let posX = currentPos.x;
    let posY = currentPos.y;
    const IDLE_TIME_BEFORE_RETURN_MS = 3200; // 3.2 seconds of stillness before returning to perch

    const loop = () => {
      const now = Date.now();
      const idleTime = now - lastMoveTimeRef.current;

      // If user hasn't moved cursor for a while, set target to the resting perch
      if (idleTime > IDLE_TIME_BEFORE_RETURN_MS) {
        targetPosRef.current = { x: perchPos.x, y: perchPos.y };
      }

      const target = targetPosRef.current;
      const dx = target.x - posX;
      const dy = target.y - posY;
      const distance = Math.hypot(dx, dy);

      // Check if arriving at perch
      const isAtPerch =
        idleTime > IDLE_TIME_BEFORE_RETURN_MS &&
        Math.hypot(posX - perchPos.x, posY - perchPos.y) < 3.5;

      if (isAtPerch) {
        posX = perchPos.x;
        posY = perchPos.y;
        setIsFlying(false);
        setIsPerched(true);
        isPerchedRef.current = true;
        setFacingRight(false); // Face inward toward the webpage content while roosting
      } else if (distance > 1.2) {
        // Flying towards target
        posX += dx * 0.065;
        posY += dy * 0.065;
        setIsFlying(true);
        setIsPerched(false);
        isPerchedRef.current = false;
        if (Math.abs(dx) > 1.2) {
          setFacingRight(dx > 0);
        }
      } else {
        setIsFlying(false);
      }

      // Cozy breathing / gentle hover bobbing
      const idleHover = isAtPerch
        ? Math.sin(now / 550) * 1.5 // subtle breathing while perched
        : idleTime > 500
        ? Math.sin(now / 420) * 3.5 // floating hover
        : 0;

      setCurrentPos({
        x: posX,
        y: posY + idleHover,
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [hedwigConfig.enabled, perchPos]);

  if (!hedwigConfig.enabled) return null;

  const handleHedwigClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Adorable owl hoot and confetti
    magicAudio.playOwlHootSound();
    confetti({
      particleCount: 40,
      spread: 70,
      origin: {
        x: Math.min(Math.max(0.1, currentPos.x / window.innerWidth), 0.9),
        y: Math.min(Math.max(0.1, currentPos.y / window.innerHeight), 0.9),
      },
      colors: ['#ffffff', '#f43f5e', '#fbcfe8', '#fda4af', '#fcd34d'],
    });

    setIsLetterOpen(true);
  };

  const handlePerchClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    magicAudio.playSparkleSound();
    // Return Hedwig to perch immediately
    lastMoveTimeRef.current = 0;
  };

  const allMessages =
    hedwigConfig.messages && hedwigConfig.messages.length > 0
      ? [hedwigConfig.customMessage, ...hedwigConfig.messages]
      : [hedwigConfig.customMessage];

  const currentMessage = allMessages[currentMessageIndex % allMessages.length];

  const handleNextMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    magicAudio.playSparkleSound();
    setCurrentMessageIndex((prev) => (prev + 1) % allMessages.length);
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. RESTING PERCH STAND ON THE SIDE OF THE SCREEN                           */}
      {/* ========================================================================= */}
      <div
        onClick={handlePerchClick}
        className="fixed z-35 select-none pointer-events-auto cursor-pointer group"
        style={{
          left: `${perchPos.x}px`,
          top: `${perchPos.y + 24}px`, // Aligned right under Hedwig's claws
          transform: 'translate(-50%, 0)',
        }}
        title="Hedwig's Resting Roost (Click to summon Hedwig to her perch)"
      >
        <div className="relative flex flex-col items-center">
          {/* Perch Roost Bar (Wooden / Antique Brass) */}
          <div className="relative w-24 sm:w-28 h-3.5 rounded-full bg-gradient-to-r from-amber-700 via-amber-500 to-amber-800 shadow-[0_4px_12px_rgba(245,158,11,0.35)] border border-amber-300 flex items-center justify-between px-1">
            {/* Left Gold Finial Cap */}
            <div className="w-2.5 h-2.5 rounded-full bg-amber-300 border border-amber-600 shadow-xs" />
            {/* Cozy Rose Velvet Roost Cushion for Hedwig */}
            <div className="w-14 sm:w-16 h-1.5 rounded-full bg-rose-400/80 shadow-inner" />
            {/* Right Gold Finial Cap */}
            <div className="w-2.5 h-2.5 rounded-full bg-amber-300 border border-amber-600 shadow-xs" />
          </div>

          {/* Vertical Brass Stand Column */}
          <div className="w-2 h-14 bg-gradient-to-b from-amber-500 via-amber-600 to-amber-800 shadow-xs border-x border-amber-400" />

          {/* Ornate Wall/Side Mounting Bracket */}
          <div className="relative w-10 h-6 bg-gradient-to-r from-amber-600 to-amber-800 rounded-b-xl border border-amber-400 shadow-md flex items-center justify-center">
            {/* Tiny Golden Hogwarts Charm / Bell */}
            <div className="w-2.5 h-2.5 rounded-full bg-amber-300 border border-amber-500 animate-pulse shadow-xs" />
          </div>

          {/* Delicate Roost Name Plate */}
          <div className="mt-1 px-2 py-0.5 rounded-full bg-white/90 border border-amber-300/80 text-[9px] font-cinzel font-bold text-amber-900 shadow-xs whitespace-nowrap opacity-75 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            <Sparkles className="w-2 h-2 text-amber-500" />
            <span>{isPerched ? "Hedwig's Roost · Resting" : "Hedwig's Roost"}</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. FLOATING & PERCHING HEDWIG CHARACTER                                   */}
      {/* ========================================================================= */}
      <div
        onClick={handleHedwigClick}
        className="fixed z-40 cursor-pointer select-none group"
        style={{
          left: `${currentPos.x}px`,
          top: `${currentPos.y}px`,
          transform: 'translate(-50%, -50%)',
          transition: 'filter 0.2s ease',
        }}
        title={`${hedwigConfig.name} - ${isPerched ? 'Resting on perch' : 'Following you'} (Tap for Owl Post!)`}
      >
        <div
          className="relative flex flex-col items-center"
          style={{
            transform: `scaleX(${facingRight ? 1 : -1})`,
            transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {/* Snowy Owl SVG Character */}
          <div className="relative w-18 h-18 sm:w-20 sm:h-20 drop-shadow-[0_8px_16px_rgba(244,63,94,0.3)] filter group-hover:brightness-105 transition-all">
            <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
              {/* Back / Tail feathers */}
              <path
                d="M40 70 C40 88, 48 95, 50 98 C52 95, 60 88, 60 70 Z"
                fill="#f8fafc"
                stroke="#fda4af"
                strokeWidth="1.5"
              />
              <path d="M46 75 L46 90" stroke="#f472b6" strokeWidth="1.2" opacity="0.6" />
              <path d="M54 75 L54 90" stroke="#f472b6" strokeWidth="1.2" opacity="0.6" />

              {/* Left Wing */}
              <g
                className={isFlying ? 'origin-[35px_45px] animate-wing-left' : 'origin-[35px_45px]'}
                style={{
                  animationDuration: isFlying ? '0.18s' : '1.4s',
                }}
              >
                <path
                  d="M36 38 C18 42, 10 58, 14 74 C24 72, 34 60, 38 48 Z"
                  fill="#ffffff"
                  stroke="#fda4af"
                  strokeWidth="1.8"
                />
                {/* Feathers markings */}
                <path d="M22 52 C26 56, 30 54, 32 50" stroke="#fb7185" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M20 62 C24 66, 28 64, 30 60" stroke="#fb7185" strokeWidth="1.5" strokeLinecap="round" />
              </g>

              {/* Right Wing */}
              <g
                className={isFlying ? 'origin-[65px_45px] animate-wing-right' : 'origin-[65px_45px]'}
                style={{
                  animationDuration: isFlying ? '0.18s' : '1.4s',
                }}
              >
                <path
                  d="M64 38 C82 42, 90 58, 86 74 C76 72, 66 60, 62 48 Z"
                  fill="#ffffff"
                  stroke="#fda4af"
                  strokeWidth="1.8"
                />
                <path d="M78 52 C74 56, 70 54, 68 50" stroke="#fb7185" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M80 62 C76 66, 72 64, 70 60" stroke="#fb7185" strokeWidth="1.5" strokeLinecap="round" />
              </g>

              {/* Owl Body */}
              <ellipse
                cx="50"
                cy="52"
                rx="22"
                ry="26"
                fill="#ffffff"
                stroke="#fda4af"
                strokeWidth="2"
              />

              {/* Chest feather accents in gentle rose flecks */}
              <path d="M44 46 C47 48, 53 48, 56 46" stroke="#fda4af" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M42 54 C46 57, 54 57, 58 54" stroke="#fda4af" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M44 62 C48 65, 52 65, 56 62" stroke="#fda4af" strokeWidth="1.5" strokeLinecap="round" />

              {/* Cozy Pink & Gryffindor Ribbon Muffler around neck */}
              <path
                d="M34 38 C42 42, 58 42, 66 38 C68 43, 64 47, 50 47 C36 47, 32 43, 34 38 Z"
                fill="#f43f5e"
                stroke="#fda4af"
                strokeWidth="1.5"
              />
              <path d="M42 39 L40 46" stroke="#ffe4e6" strokeWidth="2.5" />
              <path d="M50 40 L50 47" stroke="#ffe4e6" strokeWidth="2.5" />
              <path d="M58 39 L60 46" stroke="#ffe4e6" strokeWidth="2.5" />
              {/* Muffler Tail */}
              <path
                d="M48 45 L45 58 L53 58 L52 45 Z"
                fill="#f43f5e"
                stroke="#fda4af"
                strokeWidth="1"
              />
              <path d="M46 51 L52 51" stroke="#ffe4e6" strokeWidth="2" />
              <path d="M45 55 L53 55" stroke="#ffe4e6" strokeWidth="2" />

              {/* Owl Head */}
              <circle
                cx="50"
                cy="28"
                r="18"
                fill="#ffffff"
                stroke="#fda4af"
                strokeWidth="2"
              />

              {/* Feather tufts on top */}
              <path d="M46 11 C48 8, 52 8, 54 11" stroke="#fda4af" strokeWidth="1.8" strokeLinecap="round" fill="none" />

              {/* Left Eye */}
              <circle cx="41" cy="25" r="6" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.2" />
              {isBlinking ? (
                <line x1="36" y1="25" x2="46" y2="25" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <>
                  <circle cx="41.5" cy="25" r="3.2" fill="#451a03" />
                  <circle cx="43" cy="23.5" r="1.3" fill="#ffffff" />
                </>
              )}

              {/* Right Eye */}
              <circle cx="59" cy="25" r="6" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.2" />
              {isBlinking ? (
                <line x1="54" y1="25" x2="64" y2="25" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <>
                  <circle cx="58.5" cy="25" r="3.2" fill="#451a03" />
                  <circle cx="60" cy="23.5" r="1.3" fill="#ffffff" />
                </>
              )}

              {/* Cute Amber Beak */}
              <polygon points="50,28 46,34 54,34" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />

              {/* Little Rolled Love Letter / Scroll in beak */}
              <rect
                x="37"
                y="33"
                width="26"
                height="8"
                rx="3"
                fill="#fff1f2"
                stroke="#f43f5e"
                strokeWidth="1.2"
              />
              <line x1="42" y1="37" x2="58" y2="37" stroke="#fb7185" strokeWidth="1" />
              {/* Pink Wax Seal on scroll */}
              <circle cx="50" cy="37" r="3" fill="#f43f5e" />
              <path
                d="M50 35.5 C50 35, 48.5 35, 48.5 36 C48.5 37, 50 38, 50 38 C50 38, 51.5 37, 51.5 36 C51.5 35, 50 35, 50 35.5 Z"
                fill="#ffffff"
              />

              {/* Tiny Claws gripping the roost */}
              <path d="M43 78 L41 83 M45 78 L45 84 M47 78 L49 83" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
              <path d="M53 78 L51 83 M55 78 L55 84 M57 78 L59 83" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          {/* Little Name / Tap prompt badge */}
          <div
            className="mt-1 px-2 py-0.5 rounded-full bg-white/95 border border-rose-300 text-[10px] font-cinzel text-rose-800 font-bold shadow-xs whitespace-nowrap opacity-80 group-hover:opacity-100 transition-opacity flex items-center gap-1"
            style={{
              transform: `scaleX(${facingRight ? 1 : -1})`,
            }}
          >
            <Sparkles className="w-2.5 h-2.5 text-rose-500" />
            <span>{isPerched ? `${hedwigConfig.name} · Resting` : `${hedwigConfig.name} · Tap me`}</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. POP-UP MESSAGE MODAL / PARCHMENT SPEECH BUBBLE                         */}
      {/* ========================================================================= */}
      {isLetterOpen && (
        <div
          onClick={() => setIsLetterOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/30 backdrop-blur-xs animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md parchment-bg rounded-3xl border-2 border-rose-300 p-6 sm:p-8 shadow-[0_20px_50px_rgba(244,63,94,0.3)] animate-scaleUp"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsLetterOpen(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-rose-100 text-rose-700 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
              title="Close Letter"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header with Owl & Wax Seal */}
            <div className="flex items-center gap-3 border-b border-rose-200 pb-4 mb-5">
              <div className="w-12 h-12 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center shadow-xs">
                <Feather className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <div className="font-cinzel text-xs uppercase tracking-widest text-rose-700 font-bold flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-rose-500" />
                  <span>Owl Post Special Delivery</span>
                </div>
                <h4 className="font-cinzel text-lg font-bold text-rose-950">
                  A Message from {hedwigConfig.name}
                </h4>
              </div>
            </div>

            {/* Message Content */}
            <div className="p-5 rounded-2xl bg-white/80 border border-rose-200 shadow-inner mb-6">
              <p className="font-romantic text-lg sm:text-xl text-rose-950 leading-relaxed italic font-medium">
                "{currentMessage}"
              </p>
            </div>

            {/* Actions: Next note & Sign off */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-xs font-romantic text-rose-700 italic font-semibold">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                <span>Delivered with pure love ♥</span>
              </div>

              {allMessages.length > 1 && (
                <button
                  type="button"
                  onClick={handleNextMessage}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-cinzel text-xs font-bold uppercase tracking-wider hover:brightness-105 transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>Another Note</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
