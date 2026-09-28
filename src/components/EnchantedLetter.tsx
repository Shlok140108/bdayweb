import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { magicAudio } from '../utils/audioSynth';
import { Mail, Sparkles, Heart } from 'lucide-react';

export const EnchantedLetter: React.FC = () => {
  const { config } = useConfig();
  const { letter, girlfriend } = config;
  const [isOpen, setIsOpen] = useState(true);

  const toggleLetter = () => {
    magicAudio.playSparkleSound();
    setIsOpen(!isOpen);
  };

  return (
    <section id="love-letter" className="relative py-16 px-4 md:px-8 max-w-4xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 border border-rose-300 text-rose-700 font-cinzel text-xs tracking-widest uppercase mb-3 shadow-[0_2px_12px_rgba(244,63,94,0.15)] font-semibold">
          <Mail className="w-3.5 h-3.5 text-rose-500" />
          <span>An Enchanted Post Delivery</span>
        </div>
        <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-rose-950">
          The Pink Enchanted Parchment
        </h2>
        <p className="font-romantic text-lg sm:text-xl text-rose-800/90 italic mt-2 max-w-xl mx-auto font-medium">
          "Penned with rose-quartz ink, sealed for eternity"
        </p>
      </div>

      {/* Parchment Container */}
      <div className="relative mx-auto transition-all duration-700">
        
        {/* Envelope Preview when closed */}
        {!isOpen ? (
          <div
            onClick={toggleLetter}
            className="cursor-pointer group relative max-w-lg mx-auto p-10 parchment-bg rounded-2xl border-2 border-rose-300 shadow-[0_15px_40px_rgba(244,63,94,0.15)] transform hover:scale-[1.02] transition-all text-center"
          >
            {/* Monogram stamp */}
            <div className="absolute top-4 right-4 border border-rose-500/40 p-1 rounded">
              <span className="font-cinzel text-[10px] text-rose-600 tracking-widest uppercase">Love Post Express</span>
            </div>

            <div className="my-6">
              <p className="font-cinzel text-xs text-rose-800 uppercase tracking-wider mb-2">
                Deliver into the hands of:
              </p>
              <h3 className="font-cinzel text-2xl font-bold text-[#3d1329]">
                {girlfriend.name}
              </h3>
              <p className="font-romantic italic text-base text-[#612744] mt-1 max-w-xs mx-auto">
                {letter.recipientAddress}
              </p>
            </div>

            {/* Pink Wax Seal Button */}
            <div className="mt-8 flex flex-col items-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform cursor-pointer border-2 border-pink-200"
                style={{ backgroundColor: letter.sealColor || '#f43f5e' }}
              >
                <span className="font-cinzel text-2xl text-white font-bold">
                  {letter.sealMonogram || '♥'}
                </span>
              </div>
              <span className="font-cinzel text-xs text-rose-800 uppercase tracking-widest mt-3 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                Break the Pink Wax Seal to Read
              </span>
            </div>
          </div>
        ) : (
          /* Unfurled Pink Parchment Letter */
          <div className="relative parchment-bg rounded-2xl border-2 border-rose-300 p-8 sm:p-12 md:p-16 shadow-[0_20px_60px_rgba(244,63,94,0.18)]">
            
            {/* Top Ornamental Ribbon & Wax Seal */}
            <div className="flex items-center justify-between border-b border-rose-200 pb-6 mb-8">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-md border-2 border-white"
                  style={{ backgroundColor: letter.sealColor || '#f43f5e' }}
                >
                  <span className="font-cinzel text-xl text-white font-bold">
                    {letter.sealMonogram || '♥'}
                  </span>
                </div>
                <div>
                  <div className="font-cinzel text-xs uppercase tracking-widest text-rose-800 font-semibold">
                    Sealed for My Girl
                  </div>
                  <div className="font-romantic text-sm italic text-rose-900 font-medium">
                    To: {girlfriend.name} ({letter.recipientAddress})
                  </div>
                </div>
              </div>

              <button
                onClick={toggleLetter}
                className="text-xs font-cinzel uppercase tracking-wider text-rose-700 hover:text-rose-900 underline flex items-center gap-1 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Fold Letter</span>
              </button>
            </div>

            {/* Salutation */}
            <h3 className="font-serif-display text-2xl sm:text-3xl text-[#3d1228] font-bold mb-6 italic">
              {letter.salutation}
            </h3>

            {/* Letter Body Paragraphs */}
            <div className="space-y-5 text-[#3b1527] font-romantic text-lg sm:text-xl leading-relaxed tracking-wide">
              {letter.paragraphs.map((paragraph, idx) => (
                <p key={idx} className="indent-4 sm:indent-8 first-letter:text-3xl first-letter:font-cinzel first-letter:font-bold first-letter:text-rose-600 first-letter:mr-1">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Sign Off & Signature */}
            <div className="mt-10 pt-6 border-t border-pink-300/60 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="font-romantic text-base text-[#5c243f] italic">
                  {letter.signOff}
                </p>
                <p className="font-script text-3xl sm:text-4xl text-rose-600 mt-1">
                  {letter.senderName}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-cinzel text-rose-800">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>After all this time? Always.</span>
              </div>
            </div>

            {/* Postscript */}
            {letter.postscript && (
              <div className="mt-8 pt-4 border-t border-dashed border-pink-300/80">
                <p className="font-romantic text-base italic text-[#54213a]">
                  {letter.postscript}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
