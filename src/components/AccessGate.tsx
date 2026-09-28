import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { Sparkles, KeyRound, Heart, Feather, ShieldCheck } from 'lucide-react';
import { magicAudio } from '../utils/audioSynth';

interface AccessGateProps {
  onUnlock: (isAdmin: boolean) => void;
}

export const AccessGate: React.FC<AccessGateProps> = ({ onUnlock }) => {
  const { config } = useConfig();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim().toLowerCase();

    // Check Admin access
    if (cleanPass === config.security.adminPassword.toLowerCase() || cleanPass === 'solemnlyswear') {
      setIsUnlocking(true);
      magicAudio.playSparkleSound();
      setTimeout(() => {
        if (rememberMe) {
          localStorage.setItem('magical_chamber_auth', 'admin');
        }
        onUnlock(true);
      }, 800);
      return;
    }

    // Check hardcoded base user access & custom config user access
    const validUsers = [
      config.security.userUsername.toLowerCase(),
      'always',
      'love',
      'her',
      config.girlfriend.name.toLowerCase(),
    ];

    const validPasswords = [
      config.security.userPassword.toLowerCase(),
      'after all this time',
      'alohomora',
      'always',
      'forever',
      'magic1408',
    ];

    const isUserValid = validUsers.some(u => cleanUser === u || cleanUser.includes(u));
    const isPassValid = validPasswords.includes(cleanPass);

    if (isUserValid && isPassValid) {
      setIsUnlocking(true);
      magicAudio.playSparkleSound();
      setTimeout(() => {
        if (rememberMe) {
          localStorage.setItem('magical_chamber_auth', 'user');
        }
        onUnlock(false);
      }, 800);
    } else {
      setError('The secret chamber remains sealed. Whisper the password or check the hint below.');
    }
  };

  const handleQuickUnlock = () => {
    setUsername('always');
    setPassword('after all this time');
    setIsUnlocking(true);
    magicAudio.playSparkleSound();
    setTimeout(() => {
      if (rememberMe) {
        localStorage.setItem('magical_chamber_auth', 'user');
      }
      onUnlock(false);
    }, 700);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-[#fff0f4] text-rose-950 overflow-hidden select-none">
      {/* Background Light Pink Gradient & Rose Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#ffe6ed] via-[#ffd6e2] to-[#ffc8d7] opacity-90" />
      
      {/* Floating Starlight Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/5 w-80 h-80 bg-white/70 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-rose-200/50 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Floating HP Scarf / Muffler in Corner */}
      <div className="absolute top-12 left-10 hidden md:block animate-muffler opacity-90">
        <img
          src={config.magicElements.mufflerPngUrl}
          alt="Scarf"
          className="w-20 h-16 object-contain drop-shadow-[0_4px_12px_rgba(244,63,94,0.3)]"
        />
      </div>

      {/* Floating BGMI Gun in Corner */}
      <div className="absolute top-16 right-12 hidden md:block animate-gun opacity-90">
        <img
          src={config.magicElements.gun1PngUrl}
          alt="Gun"
          className="w-24 h-12 object-contain drop-shadow-[0_4px_12px_rgba(244,63,94,0.3)]"
        />
      </div>

      {/* The Enchanted Chamber Card */}
      <div 
        className={`relative z-10 w-full max-w-md transition-all duration-700 ${
          isUnlocking ? 'scale-105 opacity-0 blur-sm' : 'scale-100 opacity-100'
        }`}
      >
        <div className="relative rounded-3xl bg-white/90 border-2 border-rose-300/80 p-8 shadow-[0_20px_60px_rgba(244,63,94,0.25)] backdrop-blur-md">
          
          {/* Top Decorative Crest */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative mb-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-100 to-pink-200 border-2 border-rose-400 flex items-center justify-center shadow-md">
                <Heart className="w-8 h-8 text-rose-500 animate-pulse fill-rose-500/40" />
              </div>
              <Sparkles className="w-5 h-5 text-rose-400 absolute -top-1 -right-1 animate-spin" style={{ animationDuration: '8s' }} />
            </div>

            <p className="font-cinzel tracking-[0.25em] text-xs uppercase text-rose-600 mb-1 font-semibold">
              Secret Chamber of Love
            </p>
            <h1 className="font-cinzel text-3xl font-bold text-rose-950">
              Alohomora
            </h1>
            <p className="font-romantic italic text-base text-rose-800 mt-1 max-w-xs font-medium">
              "From Hogwarts towers to Rozhok rooftops..."
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-cinzel text-xs uppercase tracking-wider text-rose-900 mb-1.5 font-semibold">
                Magical Identity (ID)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. always"
                  autoComplete="off"
                  className="w-full px-4 py-2.5 bg-rose-50/70 border border-rose-300 rounded-xl text-rose-950 placeholder-rose-400 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 font-romantic text-lg transition-all"
                  required
                />
                <Feather className="w-4 h-4 text-rose-400 absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block font-cinzel text-xs uppercase tracking-wider text-rose-900 mb-1.5 font-semibold">
                Secret Spell (Password)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Whisper the password..."
                  autoComplete="current-password"
                  className="w-full px-4 py-2.5 bg-rose-50/70 border border-rose-300 rounded-xl text-rose-950 placeholder-rose-400 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200 font-romantic text-lg transition-all"
                  required
                />
                <KeyRound className="w-4 h-4 text-rose-400 absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-100 border border-rose-400 rounded-xl text-rose-900 text-xs font-romantic text-center font-medium animate-shake">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between text-xs font-romantic text-rose-800 pt-1">
              <label className="flex items-center gap-2 cursor-pointer hover:text-rose-950">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-rose-400 text-rose-500 focus:ring-0 cursor-pointer"
                />
                <span>Remember this magical key</span>
              </label>

              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="underline hover:text-rose-600 transition-colors font-medium"
              >
                Whisper a hint
              </button>
            </div>

            {showHint && (
              <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl text-xs font-romantic text-rose-900 leading-relaxed space-y-1">
                <p className="font-semibold text-rose-700">Secret Parchment Hint:</p>
                <p>The sacred reply Severus Snape gave Dumbledore:</p>
                <div className="text-[11px] font-mono text-rose-950 bg-white p-2 rounded-lg border border-rose-200 mt-1">
                  ID: <span className="text-rose-700 font-bold">always</span>
                  <br />
                  Password: <span className="text-rose-700 font-bold">after all this time</span> (or <span className="text-rose-700 font-bold">alohomora</span>)
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isUnlocking}
              className="w-full mt-2 py-3 px-6 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-cinzel font-bold text-sm tracking-widest uppercase hover:brightness-105 active:scale-[0.99] transition-all duration-300 shadow-[0_4px_20px_rgba(244,63,94,0.35)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-white/20" />
              <span>{isUnlocking ? 'Opening Chamber...' : 'Enter Our Magical Realm'}</span>
            </button>
          </form>

          {/* Quick Unlock for her convenience */}
          <div className="mt-6 pt-5 border-t border-rose-200 text-center">
            <button
              type="button"
              onClick={handleQuickUnlock}
              className="text-xs text-rose-600 hover:text-rose-800 hover:underline font-romantic font-semibold flex items-center justify-center gap-1.5 mx-auto"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
              <span>One-Click Magical Entry for My Girl</span>
            </button>
          </div>
        </div>

        {/* Vintage Footer Quote */}
        <p className="text-center font-romantic italic text-xs text-rose-800/80 mt-4 tracking-wider font-medium">
          "Happiness can be found even in the darkest of times, if one only remembers to turn on the light."
        </p>
      </div>
    </div>
  );
};
