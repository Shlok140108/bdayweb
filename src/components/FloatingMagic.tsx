import React, { useState, useEffect } from 'react';
import { useConfig } from '../context/ConfigContext';
import { magicAudio } from '../utils/audioSynth';
import confetti from 'canvas-confetti';
import { Sparkles, X, Mail, Package, Shield, Heart } from 'lucide-react';

interface FloatingEnvelope {
  id: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
  message: string;
}

const SECRET_LOVE_NOTES = [
  "You are the Golden Snitch I've been chasing my whole life. Caught forever.",
  "Wrapped in our Hogwarts muffler so you never feel cold. My arms are your home.",
  "You don't need Felix Felicis when you already have the sweetest girl in the universe.",
  "Take my Level 3 vest, my medkit, and every heartbeat in my chest.",
  "Landing in Rozhok with you beats winning a hundred Chicken Dinners alone.",
  "My M416 only fires single-tap love letters straight into your heart.",
  "Are you a flare gun? Because you shoot pure light into my darkest skies.",
];

export const FloatingMagic: React.FC = () => {
  const { config } = useConfig();
  const {
    showMuffler,
    mufflerPngUrl,
    showGuns,
    gun1Name,
    gun1PngUrl,
    gun2Name,
    gun2PngUrl,
    showSnitch,
    snitchPngUrl,
    showPinkAirdrop,
    airdropPngUrl,
    showLvl3Helmet,
    helmetPngUrl,
    showLetters,
    showPatronus,
    showSparklesOnCursor,
  } = config.magicElements;

  const [snitchPos, setSnitchPos] = useState({ x: 75, y: 22 });
  const [snitchCaught, setSnitchCaught] = useState(false);
  const [snitchMessage, setSnitchMessage] = useState('');
  const [activeLetterNote, setActiveLetterNote] = useState<string | null>(null);
  const [airdropOpened, setAirdropOpened] = useState(false);
  const [cursorSparkles, setCursorSparkles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);

  // Snitch roaming animation
  useEffect(() => {
    if (!showSnitch) return;
    const interval = setInterval(() => {
      const nextX = Math.floor(10 + Math.random() * 80);
      const nextY = Math.floor(12 + Math.random() * 75);
      setSnitchPos({ x: nextX, y: nextY });
    }, 4500);

    return () => clearInterval(interval);
  }, [showSnitch]);

  // Wand Cursor Sparkles in pastel rose tones
  useEffect(() => {
    if (!showSparklesOnCursor) return;

    let sparkId = 0;
    const pinkColors = ['#f43f5e', '#fb7185', '#f472b6', '#fda4af', '#ec4899'];

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (Math.random() > 0.4) {
        const newSparkle = {
          id: ++sparkId,
          x: clientX,
          y: clientY,
          color: pinkColors[Math.floor(Math.random() * pinkColors.length)],
        };
        setCursorSparkles((prev) => [...prev.slice(-18), newSparkle]);

        setTimeout(() => {
          setCursorSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id));
        }, 800);
      }
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, [showSparklesOnCursor]);

  const handleCatchSnitch = (e: React.MouseEvent) => {
    e.stopPropagation();
    magicAudio.playSnitchCatchSound();
    
    confetti({
      particleCount: 55,
      spread: 75,
      origin: { x: snitchPos.x / 100, y: snitchPos.y / 100 },
      colors: ['#f43f5e', '#ec4899', '#fbcfe8', '#fda4af', '#fb7185'],
    });

    setSnitchCaught(true);
    setSnitchMessage(SECRET_LOVE_NOTES[Math.floor(Math.random() * SECRET_LOVE_NOTES.length)]);
  };

  const handleOpenAirdrop = (e: React.MouseEvent) => {
    e.stopPropagation();
    magicAudio.playSparkleSound();
    confetti({
      particleCount: 60,
      spread: 85,
      origin: { x: 0.88, y: 0.35 },
      colors: ['#f43f5e', '#ec4899', '#f472b6', '#ffffff'],
    });
    setAirdropOpened(true);
  };

  const handleInteractItem = (message: string, originX: number, originY: number) => {
    magicAudio.playSparkleSound();
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { x: originX, y: originY },
      colors: ['#f43f5e', '#fb7185', '#fce7f3'],
    });
    setActiveLetterNote(message);
  };

  // Floating letters positions
  const letters: FloatingEnvelope[] = [
    { id: 1, left: 6, top: 26, duration: 8.5, delay: 0, message: SECRET_LOVE_NOTES[0] },
    { id: 2, left: 90, top: 52, duration: 9.2, delay: 2, message: SECRET_LOVE_NOTES[2] },
    { id: 3, left: 10, top: 72, duration: 8.0, delay: 1.5, message: SECRET_LOVE_NOTES[4] },
    { id: 4, left: 86, top: 80, duration: 10.0, delay: 3, message: SECRET_LOVE_NOTES[6] },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden select-none">
      {/* 1. Wand Cursor Pink Sparkles */}
      {showSparklesOnCursor &&
        cursorSparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2 animate-ping"
            style={{
              left: `${sparkle.x}px`,
              top: `${sparkle.y}px`,
              width: '6px',
              height: '6px',
              backgroundColor: sparkle.color,
              boxShadow: `0 0 10px ${sparkle.color}`,
              animationDuration: '0.75s',
            }}
          />
        ))}

      {/* 2. Floating Harry Potter Muffler / Scarf (Replaces Candles) */}
      {showMuffler && mufflerPngUrl && (
        <div
          onClick={() =>
            handleInteractItem(
              "Our Hogwarts Muffler! Keeping you cozy, warm, and cherished forever. No winter storm or cold wind can touch us.",
              0.15,
              0.18
            )
          }
          className="absolute top-16 left-6 md:left-14 pointer-events-auto cursor-pointer group z-30 animate-muffler transition-transform hover:scale-110"
          title="Harry Potter Cozy Muffler - Tap for warmth"
        >
          <div className="relative flex flex-col items-center">
            <img
              src={mufflerPngUrl}
              alt="Harry Potter Muffler"
              className="w-16 h-14 sm:w-20 sm:h-18 object-contain drop-shadow-[0_4px_12px_rgba(244,63,94,0.35)]"
            />
            <span className="text-[10px] font-cinzel text-rose-800 bg-white/90 px-2 py-0.5 rounded-full border border-rose-300 shadow-xs -mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
              HP Muffler
            </span>
          </div>
        </div>
      )}

      {/* 3. Floating BGMI Gun 1 (Pink M416 Heart Skin) */}
      {showGuns && gun1PngUrl && (
        <div
          onClick={() =>
            handleInteractItem(
              `Equipped ${gun1Name}! Loaded with pure devotion. Standing by your side to defend our duo squad till the final circle!`,
              0.85,
              0.22
            )
          }
          className="absolute top-24 right-6 md:right-16 pointer-events-auto cursor-pointer group z-30 animate-gun transition-transform hover:scale-110"
          title={`${gun1Name} - Tap to inspect weapon`}
        >
          <div className="relative flex flex-col items-center">
            <img
              src={gun1PngUrl}
              alt={gun1Name}
              className="w-20 h-10 sm:w-28 sm:h-12 object-contain drop-shadow-[0_4px_12px_rgba(244,63,94,0.35)]"
            />
            <span className="text-[10px] font-cinzel text-rose-800 bg-white/90 px-2 py-0.5 rounded-full border border-rose-300 shadow-xs -mt-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {gun1Name}
            </span>
          </div>
        </div>
      )}

      {/* 4. Floating BGMI Gun 2 (Pink Flare Gun) */}
      {showGuns && gun2PngUrl && (
        <div
          onClick={() =>
            handleInteractItem(
              `Fired the ${gun2Name}! Calling in an infinite supply drop of kisses, hugs, and lifelong happiness straight to you!`,
              0.12,
              0.55
            )
          }
          className="absolute top-[48%] left-4 md:left-10 pointer-events-auto cursor-pointer group z-30 animate-gun transition-transform hover:scale-110"
          title={`${gun2Name} - Tap to fire flare`}
        >
          <div className="relative flex flex-col items-center">
            <img
              src={gun2PngUrl}
              alt={gun2Name}
              className="w-16 h-12 sm:w-22 sm:h-16 object-contain drop-shadow-[0_4px_12px_rgba(244,63,94,0.35)]"
            />
            <span className="text-[10px] font-cinzel text-rose-800 bg-white/90 px-2 py-0.5 rounded-full border border-rose-300 shadow-xs -mt-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {gun2Name}
            </span>
          </div>
        </div>
      )}

      {/* 5. Golden Pink Snitch */}
      {showSnitch && snitchPngUrl && (
        <div
          onClick={handleCatchSnitch}
          className="absolute pointer-events-auto cursor-pointer transition-all duration-3000 ease-in-out group z-30"
          style={{
            left: `${snitchPos.x}%`,
            top: `${snitchPos.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          title="Catch the Golden Snitch!"
        >
          <div className="relative flex items-center justify-center">
            <img
              src={snitchPngUrl}
              alt="Golden Snitch"
              className="w-16 h-8 sm:w-20 sm:h-10 object-contain drop-shadow-[0_4px_12px_rgba(244,63,94,0.4)] group-hover:scale-125 transition-transform"
            />
            <span className="absolute -bottom-5 text-[10px] font-cinzel text-rose-800 bg-white/95 px-2 py-0.5 rounded-full border border-rose-300 shadow-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Catch Me!
            </span>
          </div>
        </div>
      )}

      {/* 6. BGMI Romantic Pink Airdrop */}
      {showPinkAirdrop && airdropPngUrl && (
        <div
          onClick={handleOpenAirdrop}
          className="absolute top-44 right-6 md:right-10 pointer-events-auto cursor-pointer group z-30 animate-airdrop"
          title="Tap to loot the Romantic Erangel Airdrop!"
        >
          <div className="relative flex flex-col items-center">
            <img
              src={airdropPngUrl}
              alt="Love Airdrop"
              className="w-14 h-16 sm:w-18 sm:h-20 object-contain drop-shadow-[0_4px_14px_rgba(244,63,94,0.4)] group-hover:scale-110 transition-transform"
            />
            <span className="text-[9px] font-cinzel text-rose-800 uppercase tracking-widest bg-white/95 px-2 py-0.5 rounded-full border border-rose-300 shadow-xs -mt-1 opacity-80 group-hover:opacity-100">
              Love Drop
            </span>
          </div>
        </div>
      )}

      {/* 7. BGMI Cute Level 3 Helmet */}
      {showLvl3Helmet && helmetPngUrl && (
        <div
          onClick={() =>
            handleInteractItem(
              "Level 3 Helmet equipped! No sniper in the world can pierce through the armor of my love for you.",
              0.88,
              0.68
            )
          }
          className="absolute top-[66%] right-6 md:right-12 pointer-events-auto cursor-pointer group z-30 animate-float-slow"
          title="Level 3 Helmet of Protection"
        >
          <div className="relative flex flex-col items-center">
            <img
              src={helmetPngUrl}
              alt="Level 3 Helmet"
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain drop-shadow-[0_4px_12px_rgba(244,63,94,0.35)] group-hover:scale-110 transition-transform"
            />
            <span className="text-[9px] font-cinzel text-rose-800 tracking-wider bg-white/95 px-2 py-0.5 rounded-full border border-rose-300 shadow-xs -mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
              Lvl 3 Helmet
            </span>
          </div>
        </div>
      )}

      {/* 8. Floating Love Letters */}
      {showLetters &&
        letters.map((ltr) => (
          <div
            key={ltr.id}
            onClick={() => {
              magicAudio.playSparkleSound();
              setActiveLetterNote(ltr.message);
            }}
            className="absolute pointer-events-auto cursor-pointer group transition-transform hover:scale-110"
            style={{
              left: `${ltr.left}%`,
              top: `${ltr.top}%`,
              animation: `magicalFloatAlt ${ltr.duration}s ease-in-out infinite`,
              animationDelay: `${ltr.delay}s`,
            }}
            title="Read this floating enchanted note"
          >
            <div className="relative w-11 h-8 bg-white border border-rose-300 rounded-xs shadow-[0_4px_14px_rgba(244,63,94,0.2)] flex items-center justify-center -rotate-6 group-hover:rotate-0 transition-transform">
              <div className="w-3.5 h-3.5 rounded-full bg-rose-500 border border-rose-200 flex items-center justify-center shadow-xs">
                <span className="text-[7px] text-white font-serif font-bold">♥</span>
              </div>
              <span className="absolute -bottom-4 text-[9px] font-romantic text-rose-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white/90 px-1 rounded border border-rose-200">
                Open Note
              </span>
            </div>
          </div>
        ))}

      {/* Snitch Caught Dialog Modal */}
      {snitchCaught && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/40 backdrop-blur-xs pointer-events-auto animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-2xl bg-white border-2 border-rose-300 p-6 text-center shadow-[0_10px_40px_rgba(244,63,94,0.3)]">
            <button
              onClick={() => setSnitchCaught(false)}
              className="absolute top-3 right-3 text-rose-400 hover:text-rose-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center shadow-xs">
              <Sparkles className="w-6 h-6 text-rose-500" />
            </div>
            <h3 className="font-cinzel text-lg font-bold text-rose-950 mb-1">
              Golden Snitch Captured!
            </h3>
            <p className="font-cinzel text-xs text-rose-600 mb-3 tracking-widest uppercase">
              +150 Points for My Heart
            </p>
            <p className="font-romantic text-lg italic text-rose-900 leading-relaxed mb-4 font-medium">
              "{snitchMessage}"
            </p>
            <button
              onClick={() => setSnitchCaught(false)}
              className="py-2 px-5 rounded-lg bg-gradient-to-r from-rose-500 to-pink-600 text-white font-cinzel text-xs font-bold uppercase tracking-wider hover:brightness-110 cursor-pointer shadow-md"
            >
              Keep Forever in My Heart
            </button>
          </div>
        </div>
      )}

      {/* Airdrop Opened Modal */}
      {airdropOpened && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/40 backdrop-blur-xs pointer-events-auto animate-fadeIn">
          <div className="relative w-full max-w-md rounded-2xl bg-white border-2 border-rose-300 p-6 text-center shadow-[0_10px_50px_rgba(244,63,94,0.35)]">
            <button
              onClick={() => setAirdropOpened(false)}
              className="absolute top-3 right-3 text-rose-400 hover:text-rose-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center">
              <Package className="w-7 h-7 text-rose-600" />
            </div>
            <h3 className="font-cinzel text-xl font-bold text-rose-950 mb-1">
              Erangel Special Airdrop Looted!
            </h3>
            <p className="font-cinzel text-xs text-rose-600 mb-4 tracking-widest uppercase">
              From Rozhok With Love
            </p>
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-left space-y-2 mb-5 text-sm font-romantic text-rose-950">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>Level 3 Heart: 100% Unbreakable devotion</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-rose-500" />
                <span>Pink Flare Gun: Calling down infinite hugs</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-500" />
                <span>8x Scope: To gaze at you across any distance</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🍗</span>
                <span className="font-cinzel text-xs text-rose-800 font-semibold">Winner Winner Birthday Dinner!</span>
              </div>
            </div>
            <button
              onClick={() => setAirdropOpened(false)}
              className="py-2.5 px-6 rounded-lg bg-gradient-to-r from-rose-500 to-pink-600 text-white font-cinzel text-xs font-bold uppercase tracking-wider hover:brightness-110 cursor-pointer shadow-md"
            >
              Claim Our Victory
            </button>
          </div>
        </div>
      )}

      {/* Floating Note Modal */}
      {activeLetterNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/40 backdrop-blur-xs pointer-events-auto animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-xl parchment-bg border-2 border-rose-300 p-6 text-center shadow-[0_10px_40px_rgba(244,63,94,0.3)]">
            <button
              onClick={() => setActiveLetterNote(null)}
              className="absolute top-3 right-3 text-rose-600 hover:text-rose-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center">
              <Mail className="w-5 h-5 text-rose-600" />
            </div>
            <p className="font-cinzel text-xs uppercase tracking-widest text-rose-800 mb-1">
              Whispered Secret
            </p>
            <p className="font-romantic text-lg italic text-rose-950 leading-relaxed my-3 font-semibold">
              "{activeLetterNote}"
            </p>
            <p className="font-script text-2xl text-rose-600 mt-2">
              Always yours ♥
            </p>
            <button
              onClick={() => setActiveLetterNote(null)}
              className="mt-4 py-1.5 px-4 rounded bg-rose-600 text-white font-cinzel text-xs font-semibold uppercase tracking-wider hover:bg-rose-700 cursor-pointer shadow-xs"
            >
              Fold Letter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
