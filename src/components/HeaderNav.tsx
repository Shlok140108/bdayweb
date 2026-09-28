import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Heart, Lock, Wand2, KeyRound, Sparkles, Crosshair } from 'lucide-react';
import { triggerMagicalCelebration } from './MagicalCelebrationEffect';

interface HeaderNavProps {
  onOpenAdmin: () => void;
  onLockChamber: () => void;
  onOpenBgmiModal: () => void;
  isAdmin: boolean;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ onOpenAdmin, onLockChamber, onOpenBgmiModal, isAdmin }) => {
  const { config } = useConfig();
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [enteredAdminPass, setEnteredAdminPass] = useState('');
  const [adminPassError, setAdminPassError] = useState(false);

  const handleAdminClick = () => {
    if (isAdmin) {
      onOpenAdmin();
    } else {
      setShowAdminPrompt(true);
      setAdminPassError(false);
    }
  };

  const handleAdminVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      enteredAdminPass.trim().toLowerCase() === config.security.adminPassword.toLowerCase() ||
      enteredAdminPass.trim().toLowerCase() === 'solemnlyswear'
    ) {
      setShowAdminPrompt(false);
      setEnteredAdminPass('');
      onOpenAdmin();
    } else {
      setAdminPassError(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/85 border-b border-rose-200/80 shadow-xs select-none">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Left: Title */}
          <a href="#countdown" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500/40" />
            </div>
            <div className="flex flex-col">
              <span className="font-cinzel text-sm sm:text-base font-bold text-rose-950 tracking-wider">
                {config.girlfriend.name}
              </span>
              <span className="font-romantic text-[11px] text-rose-600 -mt-0.5 italic font-semibold">
                Always & Forever
              </span>
            </div>
          </a>

          {/* Center: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            <a
              href="#countdown"
              className="text-xs font-cinzel uppercase tracking-widest text-rose-800 hover:text-rose-950 font-semibold transition-colors"
            >
              Countdown
            </a>
            <a
              href="#love-letter"
              className="text-xs font-cinzel uppercase tracking-widest text-rose-800 hover:text-rose-950 font-semibold transition-colors"
            >
              Our Letter
            </a>
            <a
              href="#special-realms"
              className="text-xs font-cinzel uppercase tracking-widest text-rose-800 hover:text-rose-950 font-semibold transition-colors"
            >
              Hogwarts & Rozhok
            </a>
            <a
              href="#moments-gallery"
              className="text-xs font-cinzel uppercase tracking-widest text-rose-800 hover:text-rose-950 font-semibold transition-colors"
            >
              Our Pensieve
            </a>
            <a
              href="#love-spells"
              className="text-xs font-cinzel uppercase tracking-widest text-rose-800 hover:text-rose-950 font-semibold transition-colors"
            >
              Love Charms
            </a>
          </nav>

          {/* Right: Admin & Lock Chamber */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* BGMI Duo Summon Button */}
            <button
              onClick={onOpenBgmiModal}
              className={`relative flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-cinzel tracking-wider uppercase transition-all cursor-pointer shadow-xs font-bold ${
                config.bgmi?.activePing?.status === 'active'
                  ? 'bg-rose-500 text-white border-rose-400 animate-pulse ring-2 ring-rose-300'
                  : 'bg-rose-50 hover:bg-rose-100 border-rose-300 text-rose-800'
              }`}
              title="Summon partner to play BGMI / View flare alert"
            >
              <Crosshair className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">BGMI Duo</span>
              <span className="sm:hidden">🪂</span>

              {config.bgmi?.activePing?.status === 'active' && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-white animate-ping" />
              )}
            </button>

            <button
              onClick={() => triggerMagicalCelebration()}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 border border-rose-300 text-rose-800 text-xs font-cinzel tracking-wider uppercase transition-all cursor-pointer shadow-xs font-bold"
              title="Trigger Screen-wide Falling Rose Petals & Sparks"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="hidden sm:inline">Celebration</span>
              <span className="sm:hidden">🌸</span>
            </button>

            <button
              onClick={handleAdminClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs font-cinzel tracking-wider uppercase hover:brightness-105 transition-all cursor-pointer shadow-xs font-semibold"
              title="Edit everything on this page (Admin Grimoire)"
            >
              <Wand2 className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">Admin Chamber</span>
              <span className="sm:hidden">Edit</span>
            </button>

            <button
              onClick={onLockChamber}
              className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Lock Chamber (Sign Out)"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Admin Password Prompt Modal */}
      {showAdminPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/40 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm rounded-2xl bg-white border-2 border-rose-300 p-6 text-center shadow-[0_15px_45px_rgba(244,63,94,0.3)]">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center">
              <KeyRound className="w-6 h-6 text-rose-500" />
            </div>
            <h3 className="font-cinzel text-lg font-bold text-rose-950 mb-1">
              Admin Spell Required
            </h3>
            <p className="font-romantic text-sm text-rose-700 italic mb-4 font-medium">
              "I solemnly swear that I am up to no good."
            </p>

            <form onSubmit={handleAdminVerify} className="space-y-3">
              <input
                type="password"
                placeholder="Whisper the admin password..."
                value={enteredAdminPass}
                onChange={(e) => {
                  setEnteredAdminPass(e.target.value);
                  setAdminPassError(false);
                }}
                autoFocus
                className="w-full px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-300 text-rose-950 text-sm font-romantic focus:border-rose-500 focus:outline-none"
              />

              {adminPassError && (
                <p className="text-xs text-rose-600 font-romantic font-semibold">
                  Incorrect admin spell. (Hint: <span className="font-mono">solemnlyswear</span>)
                </p>
              )}

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdminPrompt(false)}
                  className="px-3.5 py-1.5 text-xs font-cinzel text-rose-600 hover:text-rose-900 cursor-pointer font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-cinzel text-xs font-bold uppercase tracking-wider hover:brightness-105 cursor-pointer shadow-md"
                >
                  Open Chamber
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
