import React from 'react';
import { useConfig } from '../context/ConfigContext';
import { magicAudio } from '../utils/audioSynth';
import { Sparkles, Wand2, Heart } from 'lucide-react';

export const LoveSpellsSection: React.FC = () => {
  const { config } = useConfig();
  const { loveSpells } = config;

  const handleSpellClick = () => {
    magicAudio.playSparkleSound();
  };

  return (
    <section id="love-spells" className="relative py-20 px-4 md:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 border border-rose-300 text-rose-700 font-cinzel text-xs tracking-widest uppercase mb-3 shadow-[0_2px_12px_rgba(244,63,94,0.15)] font-semibold">
          <Wand2 className="w-3.5 h-3.5 text-rose-500" />
          <span>Charms & Enchantments</span>
        </div>
        <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-rose-950">
          The Spells You Cast Upon My Heart
        </h2>
        <p className="font-romantic text-lg sm:text-xl text-rose-800/90 italic mt-2 max-w-xl mx-auto font-medium">
          "Magic is real — I see it in your eyes every single day."
        </p>
      </div>

      {/* Spells Grid in Light Theme */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loveSpells.map((spellItem) => (
          <div
            key={spellItem.id}
            onClick={handleSpellClick}
            className="group relative bg-white/95 rounded-2xl border border-rose-200/90 p-7 shadow-[0_10px_30px_rgba(244,63,94,0.08)] hover:border-rose-400 hover:shadow-[0_15px_35px_rgba(244,63,94,0.18)] transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
          >
            {/* Corner Decorative Glyphs */}
            <div className="absolute top-3.5 right-3.5 text-rose-300 group-hover:text-rose-500 transition-colors">
              <Sparkles className="w-4 h-4" />
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center group-hover:bg-rose-200 transition-colors shadow-xs">
                <Heart className="w-5 h-5 text-rose-500 group-hover:scale-110 transition-transform fill-rose-500/30" />
              </div>
              <div>
                <h3 className="font-cinzel text-xl font-bold text-rose-950 group-hover:text-rose-700 transition-colors">
                  {spellItem.spell}
                </h3>
                <span className="font-cinzel text-[11px] uppercase tracking-wider text-rose-600 font-semibold">
                  {spellItem.meaning}
                </span>
              </div>
            </div>

            <p className="font-romantic text-lg text-rose-900 leading-relaxed italic font-medium">
              "{spellItem.reason}"
            </p>

            <div className="mt-5 pt-3 border-t border-rose-100 flex items-center justify-between text-[11px] font-cinzel text-rose-500 group-hover:text-rose-700 transition-colors font-semibold">
              <span>Charm Active</span>
              <span>Forever Enchanted</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
