import React, { useState } from 'react';
import { ConfigProvider, useConfig } from './context/ConfigContext';
import { AccessGate } from './components/AccessGate';
import { FloatingMagic } from './components/FloatingMagic';
import { HedwigCompanion } from './components/HedwigCompanion';
import { MagicalCelebrationEffect } from './components/MagicalCelebrationEffect';
import { BgmiAlertModal } from './components/BgmiAlertModal';
import { HeaderNav } from './components/HeaderNav';
import { CountdownSection } from './components/CountdownSection';
import { EnchantedLetter } from './components/EnchantedLetter';
import { SpecialPlacesSection } from './components/SpecialPlacesSection';
import { GallerySection } from './components/GallerySection';
import { LoveSpellsSection } from './components/LoveSpellsSection';
import { MusicPlayer } from './components/MusicPlayer';
import { Footer } from './components/Footer';
import { AdminModal } from './components/AdminModal';

function MainChamber() {
  const { config } = useConfig();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('magical_chamber_auth');
      return !!stored;
    } catch {
      return false;
    }
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem('magical_chamber_auth') === 'admin';
    } catch {
      return false;
    }
  });

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isBgmiModalOpen, setIsBgmiModalOpen] = useState(false);

  const handleUnlock = (adminMode: boolean) => {
    setIsAuthenticated(true);
    setIsAdmin(adminMode);
    if (adminMode) {
      setIsAdminModalOpen(true);
    }
  };

  const handleLockChamber = () => {
    localStorage.removeItem('magical_chamber_auth');
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  // If not unlocked, show the magical Alohomora access gate
  if (!isAuthenticated) {
    return <AccessGate onUnlock={handleUnlock} />;
  }

  // Dynamic light pink background style based on theme
  const getThemeBackground = () => {
    switch (config.theme.ambientPreset) {
      case 'light_blush_garden':
        return 'bg-gradient-to-b from-[#fff5f8] via-[#feedf2] to-[#fedfe7]';
      case 'light_cherry_blossom':
        return 'bg-gradient-to-b from-[#fff0f4] via-[#ffdce6] to-[#ffccd9]';
      case 'light_cotton_candy':
        return 'bg-gradient-to-b from-[#fff6f9] via-[#ffedf4] to-[#ffe4ef]';
      case 'light_rose_quartz':
      default:
        return 'bg-gradient-to-b from-[#fff2f5] via-[#ffebf0] to-[#ffe4eb]';
    }
  };

  return (
    <div className={`min-h-screen text-rose-950 relative overflow-x-hidden ${getThemeBackground()}`}>
      {/* Delicate Light Pink Starlight Ambiance */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:28px_28px] opacity-20" />
      </div>

      {/* Floating Harry Potter Muffler & BGMI Guns (Editable PNGs), Snitch, Airdrop, Wand Sparks */}
      <FloatingMagic />

      {/* Interactive Hedwig Companion (Follows cursor, delivers personalized message) */}
      <HedwigCompanion />

      {/* Screen-Wide Magical Celebration (Falling Rose Petals & Sparkling Light Particles) */}
      <MagicalCelebrationEffect />

      {/* Navigation Bar */}
      <HeaderNav
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onOpenBgmiModal={() => setIsBgmiModalOpen(true)}
        onLockChamber={handleLockChamber}
        isAdmin={isAdmin}
      />

      {/* Main Content Sections */}
      <main className="relative z-10 space-y-16 sm:space-y-24">
        {/* 1. Birthday Countdown & Celebration */}
        <CountdownSection />

        {/* 2. Pink Parchment Love Letter */}
        <EnchantedLetter />

        {/* 3. Special Landmarks Section: Hogwarts School, Special HP Landmark, Rozhok in Erangel */}
        <SpecialPlacesSection onOpenBgmiModal={() => setIsBgmiModalOpen(true)} />

        {/* 4. Pensieve of Memories Gallery */}
        <GallerySection />

        {/* 5. Love Charms & Spells */}
        <LoveSpellsSection />
      </main>

      {/* Footer with Quotes */}
      <Footer onOpenAdmin={() => setIsAdminModalOpen(true)} />

      {/* Background Music Player */}
      <MusicPlayer />

      {/* BGMI Duo Partner Summon Modal */}
      <BgmiAlertModal
        isOpen={isBgmiModalOpen}
        onClose={() => setIsBgmiModalOpen(false)}
      />

      {/* Full Admin Modal (Editing Everything) */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ConfigProvider>
      <MainChamber />
    </ConfigProvider>
  );
}
