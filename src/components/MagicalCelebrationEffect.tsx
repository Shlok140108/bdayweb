import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useConfig } from '../context/ConfigContext';
import { magicAudio } from '../utils/audioSynth';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, X, Flower2 } from 'lucide-react';

export const triggerMagicalCelebration = () => {
  window.dispatchEvent(new CustomEvent('trigger-magical-celebration'));
};

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  swayRadius: number;
  swaySpeed: number;
  swayOffset: number;
  angleZ: number;
  angleZSpeed: number;
  angleY: number;
  angleYSpeed: number;
  color: string;
  darkColor: string;
  opacity: number;
}

interface LightParticle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  color: string;
  twinkleOffset: number;
  twinkleSpeed: number;
  isStar: boolean;
}

export const MagicalCelebrationEffect: React.FC = () => {
  const { config } = useConfig();
  const [isActive, setIsActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const timeoutIdRef = useRef<number | null>(null);

  const petalsRef = useRef<Petal[]>([]);
  const particlesRef = useRef<LightParticle[]>([]);

  // Sound & Confetti trigger
  const startCelebration = useCallback(() => {
    setIsActive(true);

    // Play grand fanfare sound
    magicAudio.playCelebrationFanfare();

    // Fire dual rose-heart confetti cannons
    confetti({
      particleCount: 70,
      angle: 60,
      spread: 65,
      origin: { x: 0, y: 0.65 },
      colors: ['#f43f5e', '#ec4899', '#fda4af', '#fbcfe8', '#ffe4e6', '#fef08a'],
    });

    confetti({
      particleCount: 70,
      angle: 120,
      spread: 65,
      origin: { x: 1, y: 0.65 },
      colors: ['#f43f5e', '#ec4899', '#fda4af', '#fbcfe8', '#ffe4e6', '#fef08a'],
    });

    // Populate petals and starlight particles
    const width = window.innerWidth;
    const height = window.innerHeight;

    const petalPalette = [
      { main: '#f43f5e', dark: '#be123c' },
      { main: '#fb7185', dark: '#e11d48' },
      { main: '#fda4af', dark: '#f43f5e' },
      { main: '#fecdd3', dark: '#fb7185' },
      { main: '#ff4d6d', dark: '#c9184a' },
      { main: '#ff758f', dark: '#a4133c' },
    ];

    const newPetals: Petal[] = [];
    const petalCount = width < 640 ? 50 : 85;

    for (let i = 0; i < petalCount; i++) {
      const palette = petalPalette[Math.floor(Math.random() * petalPalette.length)];
      newPetals.push({
        x: Math.random() * width,
        y: -30 - Math.random() * (height * 0.8), // Staggered entry from above
        size: 14 + Math.random() * 16,
        speedY: 1.8 + Math.random() * 2.2,
        speedX: (Math.random() - 0.5) * 1.2,
        swayRadius: 20 + Math.random() * 40,
        swaySpeed: 0.015 + Math.random() * 0.025,
        swayOffset: Math.random() * Math.PI * 2,
        angleZ: Math.random() * Math.PI * 2,
        angleZSpeed: (Math.random() - 0.5) * 0.03,
        angleY: Math.random() * Math.PI,
        angleYSpeed: (Math.random() - 0.5) * 0.04,
        color: palette.main,
        darkColor: palette.dark,
        opacity: 0.75 + Math.random() * 0.25,
      });
    }
    petalsRef.current = newPetals;

    // Sparkling starlight particles
    const newParticles: LightParticle[] = [];
    const particleColors = ['#fef08a', '#fde047', '#ffffff', '#fbcfe8', '#fda4af', '#fed7aa'];
    const particleCount = width < 640 ? 45 : 80;

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 2 + Math.random() * 4.5,
        speedY: -0.6 - Math.random() * 1.4, // Floating gently upwards or drifting
        speedX: (Math.random() - 0.5) * 0.8,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        twinkleOffset: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.04 + Math.random() * 0.06,
        isStar: Math.random() > 0.45,
      });
    }
    particlesRef.current = newParticles;

    // Reset auto-close timer (11 seconds)
    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    timeoutIdRef.current = window.setTimeout(() => {
      setIsActive(false);
    }, 11000);
  }, []);

  const stopCelebration = () => {
    setIsActive(false);
    if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
  };

  // Event listener for global triggers
  useEffect(() => {
    const handleEvent = () => startCelebration();
    window.addEventListener('trigger-magical-celebration', handleEvent);
    return () => {
      window.removeEventListener('trigger-magical-celebration', handleEvent);
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    };
  }, [startCelebration]);

  // Canvas render animation loop
  useEffect(() => {
    if (!isActive) {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let animationTime = 0;

    const render = () => {
      animationTime += 1;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw and update Sparkling Light Particles
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;

        // Wrap around
        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const twinkle = 0.4 + 0.6 * Math.sin(p.twinkleOffset + animationTime * p.twinkleSpeed);

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, twinkle));
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;

        if (p.isStar) {
          // Draw 4-point star sparkle ✦
          const arm = p.size * 1.8;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y - arm);
          ctx.quadraticCurveTo(p.x, p.y, p.x + arm, p.y);
          ctx.quadraticCurveTo(p.x, p.y, p.x, p.y + arm);
          ctx.quadraticCurveTo(p.x, p.y, p.x - arm, p.y);
          ctx.quadraticCurveTo(p.x, p.y, p.x, p.y - arm);
          ctx.fill();
        } else {
          // Soft circular glowing orb
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 2. Draw and update Rose Petals with 3D fluttering physics
      const petals = petalsRef.current;
      for (let i = 0; i < petals.length; i++) {
        const petal = petals[i];

        // Motion physics
        petal.y += petal.speedY;
        petal.x += petal.speedX + Math.sin(petal.swayOffset + animationTime * petal.swaySpeed) * 0.8;
        petal.angleZ += petal.angleZSpeed;
        petal.angleY += petal.angleYSpeed;

        // Wrap when reaching bottom
        if (petal.y > height + 40) {
          petal.y = -30;
          petal.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(petal.x, petal.y);
        ctx.rotate(petal.angleZ);

        // 3D perspective simulated via scaleY for tumbling
        const scaleY = Math.cos(petal.angleY);
        ctx.scale(1, scaleY);

        ctx.globalAlpha = petal.opacity;

        // Realistic curved rose petal geometry
        ctx.beginPath();
        ctx.moveTo(0, -petal.size);
        ctx.bezierCurveTo(
          petal.size * 0.8,
          -petal.size * 0.6,
          petal.size * 0.9,
          petal.size * 0.5,
          0,
          petal.size * 0.9
        );
        ctx.bezierCurveTo(
          -petal.size * 0.9,
          petal.size * 0.5,
          -petal.size * 0.8,
          -petal.size * 0.6,
          0,
          -petal.size
        );

        // Color shading based on tilt side (front vs back of petal)
        ctx.fillStyle = scaleY >= 0 ? petal.color : petal.darkColor;
        ctx.shadowColor = 'rgba(244, 63, 94, 0.3)';
        ctx.shadowBlur = 6;
        ctx.fill();

        // Subtle petal vein highlight
        ctx.beginPath();
        ctx.moveTo(0, -petal.size * 0.7);
        ctx.quadraticCurveTo(petal.size * 0.1, 0, 0, petal.size * 0.6);
        ctx.strokeStyle = scaleY >= 0 ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none select-none overflow-hidden">
      {/* 60fps Fullscreen Canvas for falling petals & sparkles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Romantic Celebration Top Banner */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-auto z-10 w-[92%] max-w-lg animate-slideDown">
        <div className="relative parchment-bg rounded-2xl sm:rounded-3xl border-2 border-rose-300 px-5 py-3.5 sm:px-6 sm:py-4 shadow-[0_15px_40px_rgba(244,63,94,0.35)] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 text-white flex items-center justify-center shadow-md animate-bounce">
              <Flower2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-cinzel text-xs font-bold text-rose-800 uppercase tracking-widest">
                <Sparkles className="w-3 h-3 text-rose-500" />
                <span>Magical Celebration Active</span>
                <Sparkles className="w-3 h-3 text-rose-500" />
              </div>
              <h3 className="font-cinzel text-base sm:text-lg font-bold text-rose-950">
                Showering Roses for {config.girlfriend.name} ♥
              </h3>
              <p className="font-romantic text-xs sm:text-sm text-rose-700 italic">
                May your whole world be as sweet and luminous as your smile.
              </p>
            </div>
          </div>

          <button
            onClick={stopCelebration}
            className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0"
            title="Close Celebration"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
