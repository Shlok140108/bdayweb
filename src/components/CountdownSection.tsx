import React, { useState, useEffect } from 'react';
import { useConfig } from '../context/ConfigContext';
import { magicAudio } from '../utils/audioSynth';
import { triggerMagicalCelebration } from './MagicalCelebrationEffect';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, Flame, Gift, Calendar, Hourglass } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

export const CountdownSection: React.FC = () => {
  const { config } = useConfig();
  const { girlfriend, countdown } = config;

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 1 });
  const [wishMade, setWishMade] = useState(false);
  const [simulatedCelebration, setSimulatedCelebration] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(girlfriend.birthDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, totalMs: difference });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [girlfriend.birthDate]);

  const isCelebrationActive = timeLeft.totalMs <= 0 || simulatedCelebration;

  const handleMakeWish = () => {
    setWishMade(true);
    magicAudio.playSnitchCatchSound();
    confetti({
      particleCount: 110,
      spread: 95,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#ec4899', '#f472b6', '#fb7185', '#fbcfe8', '#ffffff'],
    });
  };

  const triggerCelebrationConfetti = () => {
    confetti({
      particleCount: 85,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#f43f5e', '#ec4899', '#fbcfe8', '#ffffff', '#fda4af'],
    });
  };

  const targetDateDisplay = new Date(girlfriend.birthDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <section id="countdown" className="relative py-20 px-4 md:px-8 max-w-5xl mx-auto text-center">
      {/* Decorative Badge */}
      <div className="relative mb-6 inline-flex flex-col items-center">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-rose-300 text-rose-700 font-cinzel text-xs tracking-widest uppercase mb-3 shadow-[0_2px_12px_rgba(244,63,94,0.15)] font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>{countdown.badgeText}</span>
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
        </div>

        <h1 className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-bold text-rose-950 tracking-tight leading-tight">
          {isCelebrationActive ? countdown.celebrationTitle : countdown.title}
        </h1>

        <div className="flex items-center justify-center gap-3 mt-4 text-rose-800 font-cinzel text-sm sm:text-base tracking-widest uppercase font-semibold">
          <span>For {girlfriend.name}</span>
          <span>·</span>
          <span className="italic font-romantic lowercase tracking-normal text-rose-600 text-lg">"{girlfriend.nickname}"</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-rose-500" />
            {targetDateDisplay}
          </span>
        </div>

        <p className="font-romantic text-lg sm:text-xl text-rose-900/80 italic max-w-2xl mx-auto mt-4 leading-relaxed font-medium">
          {isCelebrationActive ? countdown.celebrationMessage : countdown.subtitle}
        </p>
      </div>

      {/* Countdown Clock or Celebration Mode */}
      {!isCelebrationActive ? (
        <div className="mt-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto">
            {/* Days */}
            <div className="relative p-5 sm:p-7 rounded-2xl bg-white/85 border border-rose-200/90 shadow-[0_10px_30px_rgba(244,63,94,0.1)] group hover:border-rose-400 hover:shadow-[0_12px_35px_rgba(244,63,94,0.2)] transition-all duration-300">
              <div className="font-cinzel text-4xl sm:text-6xl font-extrabold text-rose-600">
                {String(timeLeft.days).padStart(2, '0')}
              </div>
              <div className="font-cinzel text-xs uppercase tracking-widest text-rose-800 mt-2 font-bold">
                Days
              </div>
              <div className="absolute top-2.5 right-2.5 text-rose-300 group-hover:text-rose-500 transition-colors">
                <Hourglass className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Hours */}
            <div className="relative p-5 sm:p-7 rounded-2xl bg-white/85 border border-rose-200/90 shadow-[0_10px_30px_rgba(244,63,94,0.1)] group hover:border-rose-400 hover:shadow-[0_12px_35px_rgba(244,63,94,0.2)] transition-all duration-300">
              <div className="font-cinzel text-4xl sm:text-6xl font-extrabold text-rose-600">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <div className="font-cinzel text-xs uppercase tracking-widest text-rose-800 mt-2 font-bold">
                Hours
              </div>
              <div className="absolute top-2.5 right-2.5 text-rose-300 group-hover:text-rose-500 transition-colors">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Minutes */}
            <div className="relative p-5 sm:p-7 rounded-2xl bg-white/85 border border-rose-200/90 shadow-[0_10px_30px_rgba(244,63,94,0.1)] group hover:border-rose-400 hover:shadow-[0_12px_35px_rgba(244,63,94,0.2)] transition-all duration-300">
              <div className="font-cinzel text-4xl sm:text-6xl font-extrabold text-rose-600">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <div className="font-cinzel text-xs uppercase tracking-widest text-rose-800 mt-2 font-bold">
                Minutes
              </div>
              <div className="absolute top-2.5 right-2.5 text-rose-300 group-hover:text-rose-500 transition-colors">
                <Heart className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Seconds */}
            <div className="relative p-5 sm:p-7 rounded-2xl bg-white/85 border border-rose-200/90 shadow-[0_10px_30px_rgba(244,63,94,0.1)] group hover:border-rose-400 hover:shadow-[0_12px_35px_rgba(244,63,94,0.2)] transition-all duration-300">
              <div className="font-cinzel text-4xl sm:text-6xl font-extrabold text-rose-600">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <div className="font-cinzel text-xs uppercase tracking-widest text-rose-800 mt-2 font-bold">
                Seconds
              </div>
              <div className="absolute top-2.5 right-2.5 text-rose-300 group-hover:text-rose-500 transition-colors">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Magical Celebration Button (Falling Rose Petals & Sparkling Light Particles) */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => triggerMagicalCelebration()}
              className="group relative px-7 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-cinzel font-bold text-xs sm:text-sm tracking-widest uppercase hover:brightness-105 shadow-[0_8px_25px_rgba(244,63,94,0.4)] cursor-pointer inline-flex items-center gap-2.5 transform hover:scale-105 active:scale-95 transition-all ring-2 ring-rose-300/80 animate-pulse"
            >
              <Sparkles className="w-4 h-4 text-amber-200 group-hover:rotate-180 transition-transform duration-700" />
              <span>Magical Celebration</span>
              <Heart className="w-4 h-4 text-white fill-white" />
            </button>
          </div>

          {/* Test / Simulate celebration toggle */}
          <div className="mt-4 flex justify-center items-center gap-3">
            <button
              onClick={() => {
                setSimulatedCelebration(true);
                triggerCelebrationConfetti();
              }}
              className="text-xs font-romantic text-rose-700 hover:text-rose-900 hover:underline flex items-center gap-1.5 transition-colors cursor-pointer font-semibold"
            >
              <Gift className="w-3.5 h-3.5 text-rose-500" />
              <span>Preview Birthday Celebration Mode & Cake</span>
            </button>
          </div>
        </div>
      ) : (
        /* Birthday Arrived View */
        <div className="mt-8 max-w-xl mx-auto p-8 rounded-3xl bg-white/95 border-2 border-rose-300 shadow-[0_20px_50px_rgba(244,63,94,0.25)] animate-fadeIn">
          {/* Birthday Cake */}
          <div className="relative mb-6 flex flex-col items-center">
            {/* Cake Topper - Golden Snitch & Pink Starlight Heart */}
            <div className="flex items-center gap-3 mb-2 animate-bounce">
              <Sparkles className="w-5 h-5 text-rose-500 animate-spin" style={{ animationDuration: '6s' }} />
              <div className="px-3 py-1 rounded-full bg-rose-100 border border-rose-300 flex items-center gap-1.5 shadow-sm">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span className="font-cinzel text-xs font-bold text-rose-950 uppercase tracking-wider">
                  Always & Forever
                </span>
              </div>
              <Sparkles className="w-5 h-5 text-rose-500 animate-spin" style={{ animationDuration: '6s' }} />
            </div>

            {/* Cake Tiers */}
            <div className="w-44 h-11 bg-gradient-to-r from-rose-400 via-pink-300 to-rose-400 rounded-t-xl border-t-2 border-white shadow-md flex items-center justify-center">
              <span className="text-xs font-cinzel text-white font-bold tracking-widest uppercase">
                {girlfriend.name}
              </span>
            </div>
            <div className="w-60 h-14 bg-gradient-to-r from-rose-500 via-pink-400 to-rose-500 rounded-b-2xl border-t border-rose-200 shadow-lg flex items-center justify-around px-5">
              <Heart className="w-4 h-4 text-white fill-white" />
              <Sparkles className="w-4 h-4 text-white" />
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
          </div>

          <h3 className="font-cinzel text-2xl font-bold text-rose-950 mb-2">
            {wishMade ? '🌸 Your Wish Has Been Sealed with Magic! 🌸' : 'Make a Secret Birthday Wish'}
          </h3>

          <p className="font-romantic text-lg text-rose-900 leading-relaxed italic mb-6 font-medium">
            {wishMade
              ? 'The universe has received your wish. May every single day of this coming year bring you all the warmth, joy, and victory crowns you deserve.'
              : 'Close your eyes, think of your sweetest wish, and tap below to make your birthday wish!'}
          </p>

          {!wishMade ? (
            <button
              onClick={handleMakeWish}
              className="py-3 px-8 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-cinzel font-bold text-sm tracking-widest uppercase hover:brightness-105 shadow-[0_4px_20px_rgba(244,63,94,0.35)] cursor-pointer inline-flex items-center gap-2 transform hover:scale-105 transition-all"
            >
              <Heart className="w-4 h-4 text-white fill-white" />
              <span>{countdown.cakeWishText}</span>
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => triggerMagicalCelebration()}
                className="py-3 px-7 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-cinzel font-bold text-xs tracking-widest uppercase hover:brightness-105 shadow-[0_6px_20px_rgba(244,63,94,0.35)] cursor-pointer inline-flex items-center gap-2 transform hover:scale-105 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Trigger Magical Celebration</span>
                <Heart className="w-3.5 h-3.5 text-white fill-white" />
              </button>

              <button
                onClick={triggerCelebrationConfetti}
                className="py-2.5 px-5 rounded-xl bg-rose-100 border border-rose-300 text-rose-700 font-cinzel text-xs tracking-widest uppercase hover:bg-rose-200 cursor-pointer inline-flex items-center gap-2 transition-all font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span>Shower Sparks</span>
              </button>
            </div>
          )}

          {simulatedCelebration && timeLeft.totalMs > 0 && (
            <div className="mt-5">
              <button
                onClick={() => setSimulatedCelebration(false)}
                className="text-xs font-romantic text-rose-600 hover:text-rose-800 underline font-semibold"
              >
                Return to Live Ticking Countdown
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
