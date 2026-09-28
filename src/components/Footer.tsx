import React from 'react';
import { useConfig } from '../context/ConfigContext';
import { Heart, Sparkles, Feather } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { config } = useConfig();
  const { girlfriend, theme } = config;

  return (
    <footer className="relative border-t border-rose-200/90 bg-gradient-to-b from-[#fff0f4] to-[#ffdce6] py-16 px-4 text-center select-none">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Hogwarts & BGMI Motif */}
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-rose-300" />
          <div className="w-10 h-10 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center shadow-xs">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-400 animate-pulse" />
          </div>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-rose-300" />
        </div>

        {/* Romantic Quote */}
        <div className="space-y-2">
          <blockquote className="font-cinzel text-xl sm:text-2xl font-bold text-rose-950 tracking-wide">
            "{theme.quote}"
          </blockquote>
          <p className="font-romantic italic text-sm text-rose-700 font-semibold">
            — {theme.quoteAuthor}
          </p>
        </div>

        {/* Emotional dedication */}
        <p className="font-romantic text-base text-rose-900 leading-relaxed italic max-w-lg mx-auto font-medium">
          Crafted with every drop of magic and love for {girlfriend.name} ({girlfriend.nickname}). From the starry skies above Hogwarts Castle to our shared rooftop victory in Rozhok, my heart is yours forever.
        </p>

        {/* Marauder's Map Secret Admin Link */}
        <div className="pt-6 border-t border-rose-200/80 flex flex-col sm:flex-row items-center justify-between text-xs font-romantic text-rose-600 gap-2 font-medium">
          <div className="flex items-center gap-1.5">
            <Feather className="w-3.5 h-3.5 text-rose-500" />
            <span>Mischief Managed · Winner Winner Birthday Dinner</span>
          </div>

          <button
            onClick={onOpenAdmin}
            className="hover:text-rose-900 hover:underline flex items-center gap-1 cursor-pointer transition-colors font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Open Admin Chamber to Edit Anything</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
