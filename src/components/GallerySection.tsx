import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { MemoryItem } from '../types';
import { magicAudio } from '../utils/audioSynth';
import { Sparkles, Calendar, MapPin, X, ChevronLeft, ChevronRight, Wand2, Heart } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const { config } = useConfig();
  const { memories, girlfriend } = config;

  const [activeChapter, setActiveChapter] = useState<string>('All');
  const [selectedMemoryIndex, setSelectedMemoryIndex] = useState<number | null>(null);

  // Extract unique chapters
  const chapters = ['All', ...Array.from(new Set(memories.map((m) => m.chapter).filter(Boolean)))];

  const filteredMemories =
    activeChapter === 'All' ? memories : memories.filter((m) => m.chapter === activeChapter);

  const openLightbox = (index: number) => {
    magicAudio.playSparkleSound();
    setSelectedMemoryIndex(index);
  };

  const closeLightbox = () => {
    setSelectedMemoryIndex(null);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedMemoryIndex === null) return;
    const prev = (selectedMemoryIndex - 1 + filteredMemories.length) % filteredMemories.length;
    setSelectedMemoryIndex(prev);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedMemoryIndex === null) return;
    const next = (selectedMemoryIndex + 1) % filteredMemories.length;
    setSelectedMemoryIndex(next);
  };

  const currentMemory: MemoryItem | null =
    selectedMemoryIndex !== null ? filteredMemories[selectedMemoryIndex] || null : null;

  return (
    <section id="moments-gallery" className="relative py-20 px-4 md:px-8 max-w-6xl mx-auto">
      {/* Section Title */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 border border-rose-300 text-rose-700 font-cinzel text-xs tracking-widest uppercase mb-3 shadow-[0_2px_12px_rgba(244,63,94,0.15)] font-semibold">
          <Wand2 className="w-3.5 h-3.5 text-rose-500" />
          <span>The Pensieve of Us</span>
        </div>
        <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-rose-950">
          Revisit Our Moments
        </h2>
        <p className="font-romantic text-lg sm:text-xl text-rose-800/90 italic mt-2 max-w-xl mx-auto font-medium">
          "Dumbledore kept memories in his Pensieve. I keep all of mine right here, forever glowing with you."
        </p>
      </div>

      {/* Chapters Filter Tabs */}
      {chapters.length > 2 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {chapters.map((ch) => (
            <button
              key={ch}
              onClick={() => setActiveChapter(ch)}
              className={`px-4 py-1.5 rounded-xl text-xs font-cinzel tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                activeChapter === ch
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold shadow-md'
                  : 'bg-white/80 border border-rose-200 text-rose-700 hover:text-rose-950 hover:border-rose-300 font-medium'
              }`}
            >
              {ch}
            </button>
          ))}
        </div>
      )}

      {/* Memories Grid in Light Theme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMemories.map((memory, idx) => (
          <div
            key={memory.id}
            onClick={() => openLightbox(idx)}
            className="group cursor-pointer relative bg-white/95 rounded-2xl border border-rose-200/90 p-4 shadow-[0_10px_30px_rgba(244,63,94,0.08)] hover:border-rose-400 hover:shadow-[0_15px_40px_rgba(244,63,94,0.2)] transition-all duration-500 transform hover:-translate-y-1.5"
          >
            {/* Top Rose Pin Accent */}
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-gradient-to-br from-rose-200 via-rose-400 to-pink-500 shadow-md border-2 border-white z-10" />

            {/* Photo Container */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-rose-50 mb-4 border border-rose-100">
              <img
                src={memory.imageUrl}
                alt={memory.title}
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80';
                }}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-106"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

              {/* Magical spell / tag */}
              {memory.magicalSpell && (
                <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-xs border border-rose-300 text-[10px] font-cinzel text-rose-800 font-semibold shadow-xs">
                  {memory.magicalSpell}
                </div>
              )}

              {/* Chapter Tag */}
              <div className="absolute bottom-2 left-2 text-[11px] font-cinzel text-white font-medium drop-shadow-md">
                {memory.chapter}
              </div>
            </div>

            {/* Content info */}
            <div>
              <div className="flex items-center justify-between text-xs text-rose-600 font-romantic mb-1.5 font-semibold">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-rose-500" />
                  {memory.date}
                </span>
                {memory.location && (
                  <span className="flex items-center gap-1 text-[11px]">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    {memory.location}
                  </span>
                )}
              </div>

              <h3 className="font-cinzel text-lg font-bold text-rose-950 group-hover:text-rose-600 transition-colors line-clamp-1 mb-2">
                {memory.title}
              </h3>

              <p className="font-romantic text-sm text-rose-800 line-clamp-2 leading-relaxed italic font-medium">
                "{memory.caption}"
              </p>

              <div className="mt-4 pt-3 border-t border-rose-100 flex items-center justify-between text-xs text-rose-600 group-hover:text-rose-800 transition-colors font-cinzel font-semibold">
                <span>View Memory</span>
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMemories.length === 0 && (
        <div className="text-center py-16 p-6 rounded-2xl border border-dashed border-rose-300 bg-white/60">
          <p className="font-romantic text-lg text-rose-700 italic font-medium">
            No memories under this chapter yet. You can add more in the secret Admin chamber!
          </p>
        </div>
      )}

      {/* Lightbox / Pensieve Fullscreen Memory Modal */}
      {currentMemory && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/40 backdrop-blur-md animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-white rounded-3xl border-2 border-rose-300 p-6 md:p-8 shadow-[0_20px_60px_rgba(244,63,94,0.3)] flex flex-col md:flex-row gap-6 max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all cursor-pointer shadow-xs"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left: Image Container */}
            <div className="relative md:w-1/2 flex items-center justify-center bg-rose-50 rounded-2xl overflow-hidden min-h-[280px]">
              <img
                src={currentMemory.imageUrl}
                alt={currentMemory.title}
                className="max-h-[70vh] w-full object-contain rounded-xl"
              />

              {/* Prev / Next controls */}
              {filteredMemories.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 border border-rose-300 text-rose-800 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all cursor-pointer shadow-md"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 border border-rose-300 text-rose-800 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all cursor-pointer shadow-md"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Right: Emotional Story */}
            <div className="md:w-1/2 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-cinzel text-rose-600 mb-2 font-semibold">
                  <span>{currentMemory.chapter}</span>
                  {currentMemory.magicalSpell && (
                    <>
                      <span>·</span>
                      <span className="text-rose-700">{currentMemory.magicalSpell}</span>
                    </>
                  )}
                </div>

                <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-rose-950 mb-3">
                  {currentMemory.title}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs font-romantic text-rose-700 mb-6 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-rose-500" />
                    {currentMemory.date}
                  </span>
                  {currentMemory.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-rose-500" />
                      {currentMemory.location}
                    </span>
                  )}
                </div>

                <div className="p-5 rounded-2xl bg-rose-50/80 border border-rose-200 font-romantic text-lg sm:text-xl text-rose-950 leading-relaxed italic mb-6 font-medium">
                  "{currentMemory.caption}"
                </div>
              </div>

              <div className="border-t border-rose-100 pt-4 flex items-center justify-between text-xs font-cinzel text-rose-800 font-semibold">
                <span className="flex items-center gap-1 text-rose-600">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  <span>Always with {girlfriend.name}</span>
                </span>
                <span>
                  {selectedMemoryIndex !== null ? selectedMemoryIndex + 1 : 1} of {filteredMemories.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
