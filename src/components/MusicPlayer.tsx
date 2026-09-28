import React, { useState, useEffect, useRef } from 'react';
import { useConfig } from '../context/ConfigContext';
import { magicAudio } from '../utils/audioSynth';
import { Volume2, VolumeX, Music, Disc } from 'lucide-react';

export const MusicPlayer: React.FC = () => {
  const { config } = useConfig();
  const { audio } = config;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audio.enableBgm) {
      if (isPlaying) {
        magicAudio.stopMelodyLoop();
        if (audioRef.current) audioRef.current.pause();
        setIsPlaying(false);
      }
      return;
    }
  }, [audio.enableBgm]);

  const togglePlay = () => {
    if (isPlaying) {
      if (audio.customAudioUrl && audioRef.current) {
        audioRef.current.pause();
      } else {
        magicAudio.stopMelodyLoop();
      }
      setIsPlaying(false);
    } else {
      if (audio.customAudioUrl) {
        if (!audioRef.current) {
          audioRef.current = new Audio(audio.customAudioUrl);
          audioRef.current.loop = true;
        }
        audioRef.current.play().catch((err) => console.log('Custom audio play error', err));
      } else {
        magicAudio.startMelodyLoop();
      }
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      magicAudio.setVolume(0.25);
      if (audioRef.current) audioRef.current.muted = false;
      setIsMuted(false);
    } else {
      magicAudio.setVolume(0);
      if (audioRef.current) audioRef.current.muted = true;
      setIsMuted(true);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 select-none">
      {/* Floating Light Pink Music Widget */}
      <div className="flex items-center gap-2.5 p-2 pr-3.5 rounded-full bg-white/95 border border-rose-300 shadow-[0_4px_20px_rgba(244,63,94,0.2)] backdrop-blur-md">
        <button
          onClick={togglePlay}
          className="relative w-9 h-9 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-xs hover:brightness-105 active:scale-95 transition-all cursor-pointer"
          title={isPlaying ? 'Pause Music' : 'Play Enchanted Theme'}
        >
          {isPlaying ? (
            <Disc className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
          ) : (
            <Music className="w-4 h-4" />
          )}
        </button>

        <div className="hidden sm:flex flex-col text-left">
          <span className="font-cinzel text-[11px] font-bold text-rose-950 leading-tight">
            {audio.songTitle || 'Hedwig’s Pink Celesta Waltz'}
          </span>
          <span className="font-romantic text-[10px] text-rose-600 italic font-semibold">
            {isPlaying ? 'Now Playing Magic' : 'Click to Play'}
          </span>
        </div>

        <button
          onClick={toggleMute}
          className="text-rose-500 hover:text-rose-800 transition-colors p-1 cursor-pointer"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
