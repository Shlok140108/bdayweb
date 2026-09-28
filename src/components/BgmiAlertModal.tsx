import React, { useState, useEffect } from 'react';
import { useConfig } from '../context/ConfigContext';
import { magicAudio } from '../utils/audioSynth';
import confetti from 'canvas-confetti';
import {
  Crosshair,
  Sparkles,
  Heart,
  X,
  Share2,
  Copy,
  Check,
  Send,
  MessageCircle,
  Shield,
  Gamepad2,
  MapPin,
  BellRing,
} from 'lucide-react';

interface BgmiAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BgmiAlertModal: React.FC<BgmiAlertModalProps> = ({ isOpen, onClose }) => {
  const { config, sendBgmiFlarePing, respondToBgmiPing } = useConfig();
  const { girlfriend, bgmi } = config;

  const [senderName, setSenderName] = useState<string>('Your Devoted Player One');
  const [matchType, setMatchType] = useState<string>('Rozhok Duo Match');
  const [customMessage, setCustomMessage] = useState<string>(
    bgmi?.defaultFlareMessage ||
      'Firing the Pink Flare Gun! 🪂 Grab your Level 3 helmet, let’s drop into Rozhok and get our Chicken Dinner! ♥'
  );
  const [isFiring, setIsFiring] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [hasNotifiedThisPing, setHasNotifiedThisPing] = useState<string | null>(null);

  const activePing = bgmi?.activePing;

  // Detect incoming ping from partner in real-time
  useEffect(() => {
    if (activePing && activePing.status === 'active' && activePing.id !== hasNotifiedThisPing) {
      setHasNotifiedThisPing(activePing.id || 'ping');
      magicAudio.playFlareGunSound();
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.4 },
        colors: ['#f43f5e', '#ec4899', '#fbcfe8', '#fda4af', '#f59e0b'],
      });
    }
  }, [activePing, hasNotifiedThisPing]);

  const handleCopyId = (id: string, label: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(label);
    magicAudio.playSparkleSound();
    setTimeout(() => setCopiedId(null), 2200);
  };

  const handleFireFlare = async () => {
    setIsFiring(true);
    magicAudio.playFlareGunSound();

    confetti({
      particleCount: 75,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#f43f5e', '#ec4899', '#fb7185', '#fef08a'],
    });

    try {
      await sendBgmiFlarePing(senderName, customMessage, matchType);
    } catch (err) {
      console.error('Error firing flare ping', err);
    } finally {
      setTimeout(() => setIsFiring(false), 800);
    }
  };

  const handleAcceptMatch = async () => {
    magicAudio.playCelebrationFanfare();
    confetti({
      particleCount: 60,
      spread: 75,
      origin: { y: 0.5 },
      colors: ['#f43f5e', '#ec4899', '#fbcfe8', '#ffffff'],
    });

    await respondToBgmiPing('accepted', 'Accepted! Opening BGMI right now. Meet you in the lobby! 🪂');

    // Copy partner's ID automatically for convenience
    const partnerId =
      activePing?.sender === girlfriend.name || activePing?.sender === girlfriend.nickname
        ? bgmi.boyfriendId
        : bgmi.girlfriendId;
    if (partnerId) {
      navigator.clipboard.writeText(partnerId);
    }
  };

  const handleReplyDelay = async () => {
    magicAudio.playSparkleSound();
    await respondToBgmiPing('accepted', 'Give me 5 mins! Getting my headset and water ready. ♥');
  };

  const handleDismiss = async () => {
    await respondToBgmiPing('dismissed');
    onClose();
  };

  // WhatsApp Invite Link generator
  const getWhatsAppInviteUrl = () => {
    const text = encodeURIComponent(
      `🪂 *PINK FLARE FIRED!* 🔫\n\nHey my sweet queen ${girlfriend.name}!\n${customMessage}\n\n📍 Drop Location: ${bgmi?.preferredDropLocation || 'Rozhok'}\n🎮 My In-Game Name: ${bgmi?.boyfriendIgn || 'DevotedPlayerOne'}\n🆔 Character ID: ${bgmi?.boyfriendId || ''}\n\nLet’s get our romantic Chicken Dinner! ♥`
    );
    const cleanNumber = (bgmi?.whatsappNumber || '').replace(/[^\d+]/g, '');
    return cleanNumber
      ? `https://wa.me/${cleanNumber}?text=${text}`
      : `https://api.whatsapp.com/send?text=${text}`;
  };

  if (!isOpen && (!activePing || activePing.status !== 'active')) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-rose-950/45 backdrop-blur-xs animate-fadeIn select-none">
      <div className="relative w-full max-w-lg parchment-bg rounded-3xl border-2 border-rose-300 p-6 sm:p-7 shadow-[0_25px_60px_rgba(244,63,94,0.35)] animate-scaleUp max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={activePing?.status === 'active' ? handleDismiss : onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-rose-100 border border-rose-200 text-rose-700 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
        >
          <X className="w-4 h-4" />
        </button>

        {/* =================================================================== */}
        {/* CASE 1: INCOMING ACTIVE PING FROM PARTNER                           */}
        {/* =================================================================== */}
        {activePing && activePing.status === 'active' ? (
          <div className="space-y-5 text-center">
            {/* Animated Flare Beacon */}
            <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping" />
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-lg border-2 border-white">
                <Crosshair className="w-8 h-8 animate-spin" style={{ animationDuration: '8s' }} />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 border border-rose-300 text-rose-700 text-xs font-cinzel font-bold tracking-widest uppercase mb-2">
                <BellRing className="w-3.5 h-3.5 text-rose-500 animate-bounce" />
                <span>Pink Flare Gun Active</span>
              </div>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-rose-950">
                {activePing.sender} is Summoning You!
              </h3>
              <p className="font-romantic text-xs sm:text-sm text-rose-700 italic">
                Mode: {activePing.matchType} · Dropping into Rozhok
              </p>
            </div>

            {/* Flare Message */}
            <div className="p-4 rounded-2xl bg-white/90 border border-rose-200 shadow-inner text-left">
              <p className="font-romantic text-base sm:text-lg text-rose-950 italic leading-relaxed font-medium">
                "{activePing.message}"
              </p>
            </div>

            {/* Quick Partner Character ID for Fast Search */}
            <div className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200 flex items-center justify-between text-left">
              <div>
                <div className="text-[10px] font-cinzel uppercase text-rose-600 font-bold tracking-wider">
                  Partner's BGMI Character ID
                </div>
                <div className="font-mono text-sm font-bold text-rose-950">
                  {bgmi.boyfriendIgn} · {bgmi.boyfriendId}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopyId(bgmi.boyfriendId, 'boyfriend')}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-rose-300 text-rose-700 text-xs font-cinzel font-semibold hover:bg-rose-100 flex items-center gap-1 cursor-pointer"
              >
                {copiedId === 'boyfriend' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'boyfriend' ? 'Copied!' : 'Copy ID'}</span>
              </button>
            </div>

            {/* Reply / Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleAcceptMatch}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-cinzel font-bold text-sm tracking-wider uppercase hover:brightness-105 shadow-[0_6px_25px_rgba(244,63,94,0.35)] cursor-pointer flex items-center justify-center gap-2 transform hover:scale-102 transition-all"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Accept Match & Launch BGMI</span>
                <Heart className="w-4 h-4 fill-white" />
              </button>

              <button
                type="button"
                onClick={handleReplyDelay}
                className="w-full py-2.5 rounded-xl bg-white border border-rose-300 text-rose-800 font-cinzel font-semibold text-xs tracking-wider uppercase hover:bg-rose-50 cursor-pointer transition-colors"
              >
                ⏱️ Give Me 5 Mins (Grabbing Water & Headset)
              </button>
            </div>
          </div>
        ) : (
          /* =================================================================== */
          /* CASE 2: SEND A FLARE GUN PING TO PARTNER                            */
          /* =================================================================== */
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-rose-200 pb-3">
              <div className="w-12 h-12 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-600 shadow-xs">
                <Crosshair className="w-6 h-6" />
              </div>
              <div>
                <div className="font-cinzel text-xs font-bold text-rose-700 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-rose-500" />
                  <span>BGMI Partner Duo Summon</span>
                </div>
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-rose-950">
                  Fire the Pink Flare Gun
                </h3>
              </div>
            </div>

            <p className="font-romantic text-xs sm:text-sm text-rose-700 italic">
              Send an instant real-time notification to your partner's screen calling them to drop into Rozhok and play BGMI with you!
            </p>

            {/* Who is sending */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSenderName('Your Devoted Player One')}
                className={`p-2.5 rounded-xl border text-xs font-cinzel font-bold text-center cursor-pointer transition-all ${
                  senderName === 'Your Devoted Player One'
                    ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                    : 'bg-white border-rose-200 text-rose-800 hover:bg-rose-50'
                }`}
              >
                👨 Boyfriend Ping
              </button>
              <button
                type="button"
                onClick={() => setSenderName(girlfriend.name || 'Princess Rozhok')}
                className={`p-2.5 rounded-xl border text-xs font-cinzel font-bold text-center cursor-pointer transition-all ${
                  senderName !== 'Your Devoted Player One'
                    ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                    : 'bg-white border-rose-200 text-rose-800 hover:bg-rose-50'
                }`}
              >
                👸 {girlfriend.nickname || girlfriend.name} Ping
              </button>
            </div>

            {/* Match Type */}
            <div>
              <label className="block text-[11px] font-cinzel uppercase text-rose-900 font-bold mb-1">
                Target Game Mode
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {['Rozhok Duo Squad', 'Erangel Romantic Tour', 'Custom 1v1 Room'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setMatchType(mode)}
                    className={`py-1.5 px-2 rounded-xl border text-[11px] font-cinzel font-semibold cursor-pointer truncate transition-all ${
                      matchType === mode
                        ? 'bg-rose-100 border-rose-400 text-rose-950 font-bold shadow-xs'
                        : 'bg-white border-rose-200 text-rose-700 hover:bg-rose-50'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Flare Message */}
            <div>
              <label className="block text-[11px] font-cinzel uppercase text-rose-900 font-bold mb-1">
                Romantic Flare Message
              </label>
              <textarea
                rows={2}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-rose-300 text-rose-950 text-xs font-romantic focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Player IDs Quick Card */}
            <div className="p-3 rounded-2xl bg-white/80 border border-rose-200 space-y-2 text-xs">
              <div className="flex items-center justify-between text-rose-900">
                <span className="font-cinzel font-bold flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-rose-500" />
                  <span>Boyfriend: {bgmi.boyfriendIgn}</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyId(bgmi.boyfriendId, 'bf')}
                  className="px-2 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 cursor-pointer flex items-center gap-1 font-mono text-[11px]"
                >
                  {copiedId === 'bf' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{bgmi.boyfriendId}</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-rose-900 border-t border-rose-100 pt-2">
                <span className="font-cinzel font-bold flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  <span>Girlfriend: {bgmi.girlfriendIgn}</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyId(bgmi.girlfriendId, 'gf')}
                  className="px-2 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 cursor-pointer flex items-center gap-1 font-mono text-[11px]"
                >
                  {copiedId === 'gf' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{bgmi.girlfriendId}</span>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleFireFlare}
                disabled={isFiring}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white font-cinzel font-bold text-xs sm:text-sm tracking-wider uppercase hover:brightness-105 shadow-[0_6px_25px_rgba(244,63,94,0.35)] cursor-pointer flex items-center justify-center gap-2 transform hover:scale-102 active:scale-98 transition-all disabled:opacity-50"
              >
                <Crosshair className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
                <span>{isFiring ? 'Firing Flare Skyward...' : '🚀 Fire Flare Gun (Notify In Real-Time)'}</span>
              </button>

              <a
                href={getWhatsAppInviteUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-cinzel font-semibold text-xs tracking-wider uppercase shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Send WhatsApp BGMI Invite</span>
              </a>
            </div>

            {/* Past reply status if available */}
            {activePing && activePing.status === 'accepted' && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-center animate-fadeIn">
                <span className="text-xs font-romantic font-bold text-emerald-800">
                  🎉 Match Accepted! "{activePing.reply || 'Ready to drop into Rozhok!'}"
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
