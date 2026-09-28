import React from 'react';
import { useConfig } from '../context/ConfigContext';
import { magicAudio } from '../utils/audioSynth';
import { Castle, Crosshair, Sparkles, Heart, Compass } from 'lucide-react';

interface SpecialPlacesSectionProps {
  onOpenBgmiModal?: () => void;
}

export const SpecialPlacesSection: React.FC<SpecialPlacesSectionProps> = ({ onOpenBgmiModal }) => {
  const { config } = useConfig();
  const { specialPlaces } = config;

  const handlePlaceCardClick = () => {
    magicAudio.playSparkleSound();
  };

  const getRealmBadge = (realm: string) => {
    switch (realm) {
      case 'hogwarts':
        return {
          label: 'Hogwarts School',
          icon: Castle,
          color: 'bg-rose-100 border-rose-300 text-rose-800',
        };
      case 'bgmi_erangel':
        return {
          label: 'BGMI Erangel Map',
          icon: Crosshair,
          color: 'bg-pink-100 border-pink-300 text-pink-800',
        };
      case 'special_place':
      default:
        return {
          label: 'Enchanted Landmark',
          icon: Compass,
          color: 'bg-fuchsia-100 border-fuchsia-300 text-fuchsia-800',
        };
    }
  };

  return (
    <section id="special-realms" className="relative py-20 px-4 md:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 border border-rose-300 text-rose-700 font-cinzel text-xs tracking-widest uppercase mb-3 shadow-[0_2px_12px_rgba(244,63,94,0.15)] font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>Our Sacred Landmarks</span>
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
        </div>

        <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-rose-950">
          From Hogwarts to Rozhok
        </h2>

        <p className="font-romantic text-lg sm:text-xl text-rose-800/90 italic mt-3 max-w-2xl mx-auto leading-relaxed font-medium">
          "The castle where magic was sparked, and the battleground rooftop where we stood back-to-back. Every map in the universe only leads straight to you."
        </p>
      </div>

      {/* Places Cards Grid in Light Theme */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {specialPlaces.map((place) => {
          const badge = getRealmBadge(place.realm);
          const BadgeIcon = badge.icon;

          return (
            <div
              key={place.id}
              onClick={handlePlaceCardClick}
              className="group relative flex flex-col justify-between bg-white/90 rounded-2xl border border-rose-200/90 p-5 shadow-[0_10px_30px_rgba(244,63,94,0.1)] hover:border-rose-400 hover:shadow-[0_15px_40px_rgba(244,63,94,0.2)] transition-all duration-500 cursor-pointer transform hover:-translate-y-2"
            >
              {/* Top Image with Badge */}
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-rose-50 mb-5 border border-rose-200">
                <img
                  src={place.imageUrl}
                  alt={place.name}
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

                {/* Realm Badge */}
                <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full border text-[11px] font-cinzel flex items-center gap-1.5 backdrop-blur-md shadow-xs font-semibold ${badge.color}`}>
                  <BadgeIcon className="w-3.5 h-3.5" />
                  <span>{badge.label}</span>
                </div>

                {/* Tag */}
                <div className="absolute bottom-2.5 left-3 text-xs font-romantic text-white italic drop-shadow-md font-semibold">
                  {place.tag}
                </div>
              </div>

              {/* Text Information */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-cinzel text-xl font-bold text-rose-950 group-hover:text-rose-600 transition-colors mb-3">
                    {place.name}
                  </h3>

                  <p className="font-romantic text-base text-rose-900 leading-relaxed italic mb-4 font-medium">
                    "{place.romanticStory}"
                  </p>
                </div>

                {/* Cozy Detail Footer */}
                <div className="pt-4 border-t border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-start gap-2 text-xs font-romantic text-rose-700 font-medium">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-400 shrink-0 mt-0.5" />
                    <span>{place.cozyDetail}</span>
                  </div>

                  {place.realm === 'bgmi_erangel' && onOpenBgmiModal && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenBgmiModal();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-cinzel text-xs font-bold uppercase tracking-wider hover:brightness-105 transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0 cursor-pointer self-start sm:self-auto"
                    >
                      <Crosshair className="w-3.5 h-3.5" />
                      <span>Notify to Play BGMI</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
