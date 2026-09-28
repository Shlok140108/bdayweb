import React, { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { MemoryItem, LoveSpellItem, SpecialPlaceItem } from '../types';
import { triggerMagicalCelebration } from './MagicalCelebrationEffect';
import {
  DEFAULT_MUFFLER_PNG,
  DEFAULT_GUN1_PNG,
  DEFAULT_GUN2_PNG,
  DEFAULT_SNITCH_PNG,
  DEFAULT_AIRDROP_PNG,
  DEFAULT_HELMET_PNG,
} from '../data/defaultPngAssets';
import {
  X,
  Sparkles,
  Heart,
  Image as ImageIcon,
  Mail,
  Music,
  Shield,
  Sliders,
  RotateCcw,
  Download,
  Upload,
  Plus,
  Trash2,
  Wand2,
  Castle,
  Feather,
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType =
  | 'girlfriend'
  | 'letter'
  | 'special_places'
  | 'gallery'
  | 'spells'
  | 'magic'
  | 'hedwig'
  | 'music_theme'
  | 'security'
  | 'backup';

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const {
    config,
    updateGirlfriend,
    updateCountdown,
    updateLetter,
    updateMagicElements,
    updateHedwig,
    updateAudio,
    updateTheme,
    updateSecurity,
    addMemory,
    updateMemory,
    deleteMemory,
    addLoveSpell,
    updateLoveSpell,
    deleteLoveSpell,
    addSpecialPlace,
    updateSpecialPlace,
    deleteSpecialPlace,
    resetToDefaults,
    exportConfigJson,
    importConfigJson,
    saveStatus,
    isCloudSynced,
  } = useConfig();

  const [activeTab, setActiveTab] = useState<TabType>('girlfriend');

  // New Memory Form State
  const [newMemory, setNewMemory] = useState<Omit<MemoryItem, 'id'>>({
    title: '',
    date: '',
    imageUrl: '',
    caption: '',
    chapter: 'Magical Dates',
    location: '',
    magicalSpell: 'Lumos',
  });
  const [showAddMemoryForm, setShowAddMemoryForm] = useState(false);

  // New Spell Form State
  const [newSpell, setNewSpell] = useState<Omit<LoveSpellItem, 'id'>>({
    spell: '',
    meaning: '',
    reason: '',
  });
  const [showAddSpellForm, setShowAddSpellForm] = useState(false);

  // New Place Form State
  const [newPlace, setNewPlace] = useState<Omit<SpecialPlaceItem, 'id'>>({
    name: '',
    realm: 'hogwarts',
    tag: '',
    imageUrl: '',
    romanticStory: '',
    symbolIcon: 'Castle',
    cozyDetail: '',
  });
  const [showAddPlaceForm, setShowAddPlaceForm] = useState(false);

  // New Paragraph in Letter State
  const [newParagraphText, setNewParagraphText] = useState('');
  const [newHedwigNoteText, setNewHedwigNoteText] = useState('');
  const [importStatus, setImportStatus] = useState<string>('');

  if (!isOpen) return null;

  // Helper for image upload to base64
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2.5 * 1024 * 1024) {
        alert('Please choose an image under 2.5MB so it stores smoothly in memory.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) callback(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMemorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemory.title || !newMemory.imageUrl) {
      alert('Please provide at least a title and an image.');
      return;
    }
    addMemory(newMemory);
    setNewMemory({
      title: '',
      date: '',
      imageUrl: '',
      caption: '',
      chapter: 'Magical Dates',
      location: '',
      magicalSpell: 'Lumos',
    });
    setShowAddMemoryForm(false);
  };

  const handleAddSpellSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpell.spell || !newSpell.reason) {
      alert('Please provide a spell incantation and reason.');
      return;
    }
    addLoveSpell(newSpell);
    setNewSpell({ spell: '', meaning: '', reason: '' });
    setShowAddSpellForm(false);
  };

  const handleAddPlaceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlace.name || !newPlace.romanticStory) {
      alert('Please provide place name and romantic story.');
      return;
    }
    addSpecialPlace(newPlace);
    setNewPlace({
      name: '',
      realm: 'hogwarts',
      tag: '',
      imageUrl: '',
      romanticStory: '',
      symbolIcon: 'Castle',
      cozyDetail: '',
    });
    setShowAddPlaceForm(false);
  };

  const handleAddParagraph = () => {
    if (!newParagraphText.trim()) return;
    updateLetter({
      paragraphs: [...config.letter.paragraphs, newParagraphText.trim()],
    });
    setNewParagraphText('');
  };

  const handleRemoveParagraph = (idx: number) => {
    updateLetter({
      paragraphs: config.letter.paragraphs.filter((_, i) => i !== idx),
    });
  };

  const handleUpdateParagraph = (idx: number, text: string) => {
    const updated = [...config.letter.paragraphs];
    updated[idx] = text;
    updateLetter({ paragraphs: updated });
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          const success = importConfigJson(text);
          if (success) {
            setImportStatus('Grimoire successfully imported!');
            setTimeout(() => setImportStatus(''), 3000);
          } else {
            setImportStatus('Invalid grimoire JSON file format.');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-rose-950/40 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[92vh] flex flex-col bg-white rounded-3xl border-2 border-rose-300 shadow-[0_20px_60px_rgba(244,63,94,0.3)] text-rose-950 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-200 bg-rose-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center shadow-xs">
              <Wand2 className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h2 className="font-cinzel text-lg sm:text-xl font-bold text-rose-950">
                Chamber of Edits (Admin Grimoire)
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs font-romantic text-rose-700 font-semibold">
                <span>Everything is editable in real-time</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-sans font-medium border border-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{saveStatus}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => triggerMagicalCelebration()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 border border-rose-300 text-rose-800 text-xs font-cinzel font-bold tracking-wider uppercase transition-all cursor-pointer shadow-xs"
              title="Test Screen-wide Falling Rose Petals & Sparkling Particles"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="hidden sm:inline">Test Celebration</span>
              <span className="sm:hidden">🌸 Test</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-rose-100 border border-rose-200 text-rose-700 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto px-6 py-2.5 border-b border-rose-200 bg-rose-50/40 scrollbar-none">
          {[
            { id: 'girlfriend', label: '🎂 Girlfriend & Date', icon: Heart },
            { id: 'letter', label: '💌 Love Letter', icon: Mail },
            { id: 'special_places', label: '🏰 Hogwarts & Rozhok', icon: Castle },
            { id: 'gallery', label: '📸 Moments Gallery', icon: ImageIcon },
            { id: 'spells', label: '✨ Love Charms', icon: Wand2 },
            { id: 'magic', label: '🧣 Muffler, Guns & PNGs', icon: Sliders },
            { id: 'hedwig', label: '🦉 Hedwig Owl Post', icon: Feather },
            { id: 'music_theme', label: '🎵 Music & Ambiance', icon: Music },
            { id: 'security', label: '🔐 Passwords & Base', icon: Shield },
            { id: 'backup', label: '💾 Backup & Reset', icon: Download },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-cinzel whitespace-nowrap transition-all cursor-pointer font-semibold ${
                  isActive
                    ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-xs'
                    : 'text-rose-800 hover:text-rose-950 hover:bg-rose-100/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">

          {/* TAB 1: GIRLFRIEND & BIRTHDAY */}
          {activeTab === 'girlfriend' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-rose-950 mb-1">
                  Girlfriend's Identity & Birthday Target
                </h3>
                <p className="font-romantic text-sm text-rose-700 italic font-medium">
                  Change the name, sweet nickname, and the exact birthday countdown target date & time.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-cinzel uppercase tracking-wider text-rose-900 mb-1 font-semibold">
                    Her Full / Special Name
                  </label>
                  <input
                    type="text"
                    value={config.girlfriend.name}
                    onChange={(e) => updateGirlfriend({ name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-rose-50/60 border border-rose-300 text-rose-950 text-sm font-romantic focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-cinzel uppercase tracking-wider text-rose-900 mb-1 font-semibold">
                    Her Cute Nickname
                  </label>
                  <input
                    type="text"
                    value={config.girlfriend.nickname}
                    onChange={(e) => updateGirlfriend({ nickname: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-rose-50/60 border border-rose-300 text-rose-950 text-sm font-romantic focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-cinzel uppercase tracking-wider text-rose-900 mb-1 font-semibold">
                    Exact Birthday Date & Time (Countdown Target)
                  </label>
                  <input
                    type="datetime-local"
                    value={config.girlfriend.birthDate.substring(0, 16)}
                    onChange={(e) => updateGirlfriend({ birthDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-rose-50/60 border border-rose-300 text-rose-950 text-sm font-romantic focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Countdown Messaging */}
              <div className="pt-4 border-t border-rose-200 space-y-4">
                <h4 className="font-cinzel text-sm font-bold text-rose-950">
                  Countdown Screen Headings
                </h4>

                <div>
                  <label className="block text-xs font-cinzel uppercase tracking-wider text-rose-900 mb-1 font-semibold">
                    Top Badge Text
                  </label>
                  <input
                    type="text"
                    value={config.countdown.badgeText}
                    onChange={(e) => updateCountdown({ badgeText: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-rose-50/60 border border-rose-300 text-rose-950 text-sm font-romantic"
                  />
                </div>

                <div>
                  <label className="block text-xs font-cinzel uppercase tracking-wider text-rose-900 mb-1 font-semibold">
                    Main Countdown Title
                  </label>
                  <input
                    type="text"
                    value={config.countdown.title}
                    onChange={(e) => updateCountdown({ title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-rose-50/60 border border-rose-300 text-rose-950 text-sm font-romantic"
                  />
                </div>

                <div>
                  <label className="block text-xs font-cinzel uppercase tracking-wider text-rose-900 mb-1 font-semibold">
                    Romantic Subtitle Note
                  </label>
                  <textarea
                    rows={2}
                    value={config.countdown.subtitle}
                    onChange={(e) => updateCountdown({ subtitle: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-rose-50/60 border border-rose-300 text-rose-950 text-sm font-romantic"
                  />
                </div>
              </div>

              {/* Celebration Mode Customization */}
              <div className="pt-4 border-t border-rose-200 space-y-4">
                <h4 className="font-cinzel text-sm font-bold text-rose-950">
                  Birthday Day Celebration Message (When Countdown Hits 0)
                </h4>

                <div>
                  <label className="block text-xs font-cinzel uppercase tracking-wider text-rose-900 mb-1 font-semibold">
                    Celebration Headline
                  </label>
                  <input
                    type="text"
                    value={config.countdown.celebrationTitle}
                    onChange={(e) => updateCountdown({ celebrationTitle: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-rose-50/60 border border-rose-300 text-rose-950 text-sm font-romantic"
                  />
                </div>

                <div>
                  <label className="block text-xs font-cinzel uppercase tracking-wider text-rose-900 mb-1 font-semibold">
                    Heartfelt Birthday Message
                  </label>
                  <textarea
                    rows={3}
                    value={config.countdown.celebrationMessage}
                    onChange={(e) => updateCountdown({ celebrationMessage: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-rose-50/60 border border-rose-300 text-rose-950 text-sm font-romantic"
                  />
                </div>

                <div>
                  <label className="block text-xs font-cinzel uppercase tracking-wider text-rose-900 mb-1 font-semibold">
                    Cake Wish Button Label
                  </label>
                  <input
                    type="text"
                    value={config.countdown.cakeWishText}
                    onChange={(e) => updateCountdown({ cakeWishText: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-rose-50/60 border border-rose-300 text-rose-950 text-sm font-romantic"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LOVE LETTER */}
          {activeTab === 'letter' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-rose-950 mb-1">
                  Enchanted Parchment Love Letter
                </h3>
                <p className="font-romantic text-sm text-rose-700 italic font-medium">
                  Customize the wax seal, recipient address, every single paragraph, and romantic signature.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-cinzel uppercase tracking-wider text-rose-900 mb-1 font-semibold">
                    Wax Seal Monogram Initial
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={config.letter.sealMonogram}
                    onChange={(e) => updateLetter({ sealMonogram: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-rose-50/60 border border-rose-300 text-rose-950 text-sm font-romantic"
                  />
                </div>

                <div>
                  <label className="block text-xs font-cinzel uppercase tracking-wider text-rose-900 mb-1 font-semibold">
                    Wax Seal Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={config.letter.sealColor}
                      onChange={(e) => updateLetter({ sealColor: e.target.value })}
                      className="w-10 h-10 rounded border border-rose-300 bg-transparent cursor-pointer"
                    />
                    <span className="text-xs font-mono text-rose-800">{config.letter.sealColor}</span>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-cinzel uppercase tracking-wider text-rose-900 mb-1 font-semibold">
                    Recipient Address Line
                  </label>
                  <input
                    type="text"
                    value={config.letter.recipientAddress}
                    onChange={(e) => updateLetter({ recipientAddress: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-rose-50/60 border border-rose-300 text-rose-950 text-sm font-romantic"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-cinzel uppercase tracking-wider text-rose-900 mb-1 font-semibold">
                    Salutation
                  </label>
                  <input
                    type="text"
                    value={config.letter.salutation}
                    onChange={(e) => updateLetter({ salutation: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-rose-50/60 border border-rose-300 text-rose-950 text-sm font-romantic"
                  />
                </div>
              </div>

              {/* Letter Paragraphs List */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-cinzel uppercase tracking-wider text-rose-900 font-semibold">
                  Letter Paragraphs ({config.letter.paragraphs.length})
                </label>
                {config.letter.paragraphs.map((para, idx) => (
                  <div key={idx} className="flex gap-2 items-start bg-rose-50/60 p-3 rounded-xl border border-rose-200">
                    <span className="text-xs font-cinzel text-rose-700 font-semibold mt-1">#{idx + 1}</span>
                    <textarea
                      rows={3}
                      value={para}
                      onChange={(e) => handleUpdateParagraph(idx, e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-rose-200 text-rose-950 text-sm font-romantic leading-relaxed"
                    />
                    <button
                      onClick={() => handleRemoveParagraph(idx)}
                      className="text-rose-500 hover:text-rose-800 p-1 cursor-pointer"
                      title="Delete Paragraph"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Add new paragraph */}
                <div className="p-3 bg-rose-50/40 rounded-xl border border-dashed border-rose-300 space-y-2">
                  <textarea
                    rows={2}
                    placeholder="Write a new romantic paragraph to add to the parchment..."
                    value={newParagraphText}
                    onChange={(e) => setNewParagraphText(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-rose-200 text-rose-950 text-sm font-romantic placeholder-rose-400"
                  />
                  <button
                    onClick={handleAddParagraph}
                    disabled={!newParagraphText.trim()}
                    className="px-4 py-1.5 rounded-lg bg-rose-100 border border-rose-300 text-rose-800 text-xs font-cinzel uppercase tracking-wider hover:bg-rose-200 flex items-center gap-1.5 cursor-pointer disabled:opacity-40 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Paragraph</span>
                  </button>
                </div>
              </div>

              {/* Sign Off & Signature */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-rose-200">
                <div>
                  <label className="block text-xs font-cinzel uppercase tracking-wider text-rose-900 mb-1 font-semibold">
                    Sign-Off Phrase
                  </label>
                  <input
                    type="text"
                    value={config.letter.signOff}
                    onChange={(e) => updateLetter({ signOff: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-rose-50/60 border border-rose-300 text-rose-950 text-sm font-romantic"
                  />
                </div>

                <div>
                  <label className="block text-xs font-cinzel uppercase tracking-wider text-rose-900 mb-1 font-semibold">
                    Sender Signature
                  </label>
                  <input
                    type="text"
                    value={config.letter.senderName}
                    onChange={(e) => updateLetter({ senderName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-rose-50/60 border border-rose-300 text-rose-950 text-sm font-romantic"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-cinzel uppercase tracking-wider text-rose-900 mb-1 font-semibold">
                    Postscript (P.S.)
                  </label>
                  <input
                    type="text"
                    value={config.letter.postscript}
                    onChange={(e) => updateLetter({ postscript: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-rose-50/60 border border-rose-300 text-rose-950 text-sm font-romantic"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SPECIAL PLACES */}
          {activeTab === 'special_places' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-rose-950 mb-1">
                    Hogwarts School, HP Landmarks & Rozhok in Erangel
                  </h3>
                  <p className="font-romantic text-sm text-rose-700 italic font-medium">
                    Customize your sacred places: Hogwarts castle, special HP sanctuaries, and your favorite Rozhok hot-drop in BGMI.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddPlaceForm(!showAddPlaceForm)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-cinzel text-xs font-bold uppercase tracking-wider hover:brightness-105 flex items-center gap-1.5 self-start cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showAddPlaceForm ? 'Close Add Form' : 'Add Landmark'}</span>
                </button>
              </div>

              {/* Add New Place Form */}
              {showAddPlaceForm && (
                <form
                  onSubmit={handleAddPlaceSubmit}
                  className="p-5 rounded-2xl bg-rose-50/70 border-2 border-rose-300 space-y-4 animate-fadeIn"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-cinzel uppercase text-rose-900 mb-1 font-semibold">
                        Place / Landmark Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rozhok Hilltop & Canal"
                        value={newPlace.name}
                        onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-rose-300 text-sm text-rose-950"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-cinzel uppercase text-rose-900 mb-1 font-semibold">
                        Realm Category
                      </label>
                      <select
                        value={newPlace.realm}
                        onChange={(e) =>
                          setNewPlace({
                            ...newPlace,
                            realm: e.target.value as 'hogwarts' | 'bgmi_erangel' | 'special_place',
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white border border-rose-300 text-sm text-rose-950 font-cinzel"
                      >
                        <option value="hogwarts">Hogwarts School</option>
                        <option value="bgmi_erangel">BGMI Erangel Map</option>
                        <option value="special_place">Special HP Landmark</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-cinzel uppercase text-rose-900 mb-1 font-semibold">
                        Subtitle / Tag
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Our Sacred Hot-Drop"
                        value={newPlace.tag}
                        onChange={(e) => setNewPlace({ ...newPlace, tag: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-rose-300 text-sm text-rose-950"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-cinzel uppercase text-rose-900 mb-1 font-semibold">
                        Cozy Detail / Memory Highlights
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Shared Medkits & Level 3 Helmets"
                        value={newPlace.cozyDetail}
                        onChange={(e) => setNewPlace({ ...newPlace, cozyDetail: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-rose-300 text-sm text-rose-950"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-cinzel uppercase text-rose-900 mb-1 font-semibold">
                        Landmark Photo URL or File Upload
                      </label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Image URL"
                          value={newPlace.imageUrl}
                          onChange={(e) => setNewPlace({ ...newPlace, imageUrl: e.target.value })}
                          className="flex-1 px-3 py-2 rounded-xl bg-white border border-rose-300 text-sm text-rose-950"
                        />
                        <label className="px-3.5 py-2 rounded-xl bg-rose-100 border border-rose-300 text-rose-800 text-xs font-cinzel uppercase cursor-pointer hover:bg-rose-200 whitespace-nowrap font-semibold">
                          <Upload className="w-3.5 h-3.5 inline mr-1" />
                          <span>Upload File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleImageFileUpload(e, (base64) =>
                                setNewPlace((prev) => ({ ...prev, imageUrl: base64 }))
                              )
                            }
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-cinzel uppercase text-rose-900 mb-1 font-semibold">
                        Romantic Story / Connection with Her
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="What makes this place special for you two?..."
                        value={newPlace.romanticStory}
                        onChange={(e) => setNewPlace({ ...newPlace, romanticStory: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-rose-300 text-sm text-rose-950 font-romantic text-base"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddPlaceForm(false)}
                      className="px-4 py-1.5 rounded text-xs font-cinzel text-rose-700 hover:text-rose-950 cursor-pointer font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-cinzel text-xs font-bold uppercase tracking-wider hover:brightness-105 cursor-pointer shadow-md"
                    >
                      Save Landmark
                    </button>
                  </div>
                </form>
              )}

              {/* Existing Places List for Editing */}
              <div className="space-y-4">
                {config.specialPlaces.map((pl) => (
                  <div
                    key={pl.id}
                    className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 flex flex-col md:flex-row gap-4 items-start"
                  >
                    <div className="w-28 h-24 rounded-xl overflow-hidden bg-rose-100 border border-rose-200 shrink-0">
                      <img src={pl.imageUrl} alt={pl.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={pl.name}
                          onChange={(e) => updateSpecialPlace(pl.id, { name: e.target.value })}
                          className="px-2.5 py-1 rounded-lg bg-white border border-rose-300 text-xs font-cinzel font-bold text-rose-950"
                        />
                        <input
                          type="text"
                          value={pl.tag}
                          onChange={(e) => updateSpecialPlace(pl.id, { tag: e.target.value })}
                          className="px-2.5 py-1 rounded-lg bg-white border border-rose-300 text-xs font-cinzel text-rose-700 font-semibold"
                        />
                        <select
                          value={pl.realm}
                          onChange={(e) =>
                            updateSpecialPlace(pl.id, {
                              realm: e.target.value as 'hogwarts' | 'bgmi_erangel' | 'special_place',
                            })
                          }
                          className="px-2.5 py-1 rounded-lg bg-white border border-rose-300 text-xs font-cinzel text-rose-800"
                        >
                          <option value="hogwarts">Hogwarts School</option>
                          <option value="bgmi_erangel">BGMI Erangel Map</option>
                          <option value="special_place">Special HP Landmark</option>
                        </select>
                      </div>

                      <textarea
                        rows={2}
                        value={pl.romanticStory}
                        onChange={(e) => updateSpecialPlace(pl.id, { romanticStory: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-rose-200 text-xs font-romantic text-rose-950"
                      />

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Image URL"
                          value={pl.imageUrl}
                          onChange={(e) => updateSpecialPlace(pl.id, { imageUrl: e.target.value })}
                          className="flex-1 px-2.5 py-1 rounded-lg bg-white border border-rose-200 text-xs text-rose-950"
                        />
                        <label className="px-2.5 py-1 rounded-lg bg-rose-100 border border-rose-300 text-rose-800 text-xs font-cinzel uppercase cursor-pointer hover:bg-rose-200 whitespace-nowrap font-semibold">
                          <span>Replace</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleImageFileUpload(e, (base64) =>
                                updateSpecialPlace(pl.id, { imageUrl: base64 })
                              )
                            }
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteSpecialPlace(pl.id)}
                      className="p-2 text-rose-400 hover:text-rose-700 transition-colors cursor-pointer"
                      title="Remove Place"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MOMENTS GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-rose-950 mb-1">
                    The Pensieve Gallery ({config.memories.length} Moments)
                  </h3>
                  <p className="font-romantic text-sm text-rose-700 italic font-medium">
                    Add photos of your dates and memories directly via file upload or image link.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddMemoryForm(!showAddMemoryForm)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-cinzel text-xs font-bold uppercase tracking-wider hover:brightness-105 flex items-center gap-1.5 self-start cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showAddMemoryForm ? 'Close Add Form' : 'Add New Memory'}</span>
                </button>
              </div>

              {/* Add New Memory Form */}
              {showAddMemoryForm && (
                <form
                  onSubmit={handleAddMemorySubmit}
                  className="p-5 rounded-2xl bg-rose-50/70 border-2 border-rose-300 space-y-4 animate-fadeIn"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-cinzel uppercase text-rose-900 mb-1 font-semibold">
                        Memory Title
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Starry Night Walk"
                        value={newMemory.title}
                        onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-rose-300 text-sm text-rose-950"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-cinzel uppercase text-rose-900 mb-1 font-semibold">
                        Date / Period
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Autumn 2025"
                        value={newMemory.date}
                        onChange={(e) => setNewMemory({ ...newMemory, date: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-rose-300 text-sm text-rose-950"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-cinzel uppercase text-rose-900 mb-1 font-semibold">
                        Chapter / Category
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. First Spark, Magical Dates, Adventures"
                        value={newMemory.chapter}
                        onChange={(e) => setNewMemory({ ...newMemory, chapter: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-rose-300 text-sm text-rose-950"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-cinzel uppercase text-rose-900 mb-1 font-semibold">
                        Location / Setting
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. The Quiet Cafe by the Lake"
                        value={newMemory.location}
                        onChange={(e) => setNewMemory({ ...newMemory, location: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-rose-300 text-sm text-rose-950"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-cinzel uppercase text-rose-900 mb-1 font-semibold">
                        Memory Photo (Upload from device or paste image URL)
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3 items-center">
                        <input
                          type="text"
                          placeholder="Paste image URL (https://...)"
                          value={newMemory.imageUrl}
                          onChange={(e) => setNewMemory({ ...newMemory, imageUrl: e.target.value })}
                          className="flex-1 px-3 py-2 rounded-xl bg-white border border-rose-300 text-sm text-rose-950"
                        />
                        <span className="text-xs text-rose-500 font-cinzel font-semibold">or</span>
                        <label className="px-3.5 py-2 rounded-xl bg-rose-100 border border-rose-300 text-rose-800 text-xs font-cinzel uppercase cursor-pointer hover:bg-rose-200 whitespace-nowrap font-semibold">
                          <Upload className="w-3.5 h-3.5 inline mr-1" />
                          <span>Upload File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleImageFileUpload(e, (base64) =>
                                setNewMemory((prev) => ({ ...prev, imageUrl: base64 }))
                              )
                            }
                            className="hidden"
                          />
                        </label>
                      </div>
                      {newMemory.imageUrl && (
                        <div className="mt-2 w-20 h-20 rounded-xl border border-rose-300 overflow-hidden">
                          <img src={newMemory.imageUrl} alt="preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-cinzel uppercase text-rose-900 mb-1 font-semibold">
                        Romantic Caption / Story Behind this Moment
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Tell the sweet emotional story of this memory..."
                        value={newMemory.caption}
                        onChange={(e) => setNewMemory({ ...newMemory, caption: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-rose-300 text-sm text-rose-950 font-romantic text-base"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddMemoryForm(false)}
                      className="px-4 py-1.5 rounded text-xs font-cinzel text-rose-700 hover:text-rose-950 cursor-pointer font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-cinzel text-xs font-bold uppercase tracking-wider hover:brightness-105 cursor-pointer shadow-md"
                    >
                      Save into Pensieve
                    </button>
                  </div>
                </form>
              )}

              {/* Existing Memories List */}
              <div className="space-y-4">
                {config.memories.map((mem) => (
                  <div
                    key={mem.id}
                    className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 flex flex-col md:flex-row gap-4 items-start"
                  >
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-rose-100 border border-rose-200 shrink-0">
                      <img src={mem.imageUrl} alt={mem.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          value={mem.title}
                          onChange={(e) => updateMemory(mem.id, { title: e.target.value })}
                          className="px-2.5 py-1 rounded-lg bg-white border border-rose-300 text-xs font-cinzel text-rose-950 font-semibold"
                        />
                        <input
                          type="text"
                          value={mem.date}
                          onChange={(e) => updateMemory(mem.id, { date: e.target.value })}
                          className="px-2.5 py-1 rounded-lg bg-white border border-rose-300 text-xs font-cinzel text-rose-950"
                        />
                        <input
                          type="text"
                          value={mem.chapter}
                          onChange={(e) => updateMemory(mem.id, { chapter: e.target.value })}
                          className="px-2.5 py-1 rounded-lg bg-white border border-rose-300 text-xs font-cinzel text-rose-950"
                        />
                      </div>

                      <textarea
                        rows={2}
                        value={mem.caption}
                        onChange={(e) => updateMemory(mem.id, { caption: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-rose-200 text-xs font-romantic text-rose-950"
                      />

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Image URL"
                          value={mem.imageUrl}
                          onChange={(e) => updateMemory(mem.id, { imageUrl: e.target.value })}
                          className="flex-1 px-2.5 py-1 rounded-lg bg-white border border-rose-200 text-xs text-rose-950"
                        />
                        <label className="px-2.5 py-1 rounded-lg bg-rose-100 border border-rose-300 text-rose-800 text-xs font-cinzel uppercase cursor-pointer hover:bg-rose-200 whitespace-nowrap font-semibold">
                          <span>Replace</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleImageFileUpload(e, (base64) =>
                                updateMemory(mem.id, { imageUrl: base64 })
                              )
                            }
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteMemory(mem.id)}
                      className="p-2 text-rose-400 hover:text-rose-700 transition-colors cursor-pointer"
                      title="Remove Memory"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: LOVE SPELLS */}
          {activeTab === 'spells' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-rose-950 mb-1">
                    Love Charms & Reasons Why I Love You
                  </h3>
                  <p className="font-romantic text-sm text-rose-700 italic font-medium">
                    Magical incantations representing everything you cherish about her.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddSpellForm(!showAddSpellForm)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-cinzel text-xs font-bold uppercase tracking-wider hover:brightness-105 flex items-center gap-1.5 self-start cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showAddSpellForm ? 'Close Add Form' : 'Add New Spell'}</span>
                </button>
              </div>

              {/* Add spell form */}
              {showAddSpellForm && (
                <form
                  onSubmit={handleAddSpellSubmit}
                  className="p-5 rounded-2xl bg-rose-50/70 border-2 border-rose-300 space-y-4 animate-fadeIn"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-cinzel uppercase text-rose-900 mb-1 font-semibold">
                        Spell Incantation
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lumos Maxima"
                        value={newSpell.spell}
                        onChange={(e) => setNewSpell({ ...newSpell, spell: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-rose-300 text-sm text-rose-950"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-cinzel uppercase text-rose-900 mb-1 font-semibold">
                        Meaning / Title
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. The Infinite Light"
                        value={newSpell.meaning}
                        onChange={(e) => setNewSpell({ ...newSpell, meaning: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-rose-300 text-sm text-rose-950"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-cinzel uppercase text-rose-900 mb-1 font-semibold">
                        Emotional Reason
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Why does she cast this spell on you?..."
                        value={newSpell.reason}
                        onChange={(e) => setNewSpell({ ...newSpell, reason: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-rose-300 text-sm text-rose-950 font-romantic text-base"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddSpellForm(false)}
                      className="px-4 py-1.5 rounded text-xs font-cinzel text-rose-700 hover:text-rose-950 cursor-pointer font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-cinzel text-xs font-bold uppercase tracking-wider hover:brightness-105 cursor-pointer shadow-md"
                    >
                      Cast Charm
                    </button>
                  </div>
                </form>
              )}

              {/* Existing Spells List */}
              <div className="space-y-4">
                {config.loveSpells.map((s) => (
                  <div
                    key={s.id}
                    className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={s.spell}
                          onChange={(e) => updateLoveSpell(s.id, { spell: e.target.value })}
                          className="px-3 py-1.5 rounded-lg bg-white border border-rose-300 text-xs font-cinzel font-bold text-rose-950"
                        />
                        <input
                          type="text"
                          value={s.meaning}
                          onChange={(e) => updateLoveSpell(s.id, { meaning: e.target.value })}
                          className="px-3 py-1.5 rounded-lg bg-white border border-rose-300 text-xs font-cinzel text-rose-700 font-semibold"
                        />
                      </div>
                      <button
                        onClick={() => deleteLoveSpell(s.id)}
                        className="p-2 text-rose-400 hover:text-rose-700 cursor-pointer"
                        title="Delete Charm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      value={s.reason}
                      onChange={(e) => updateLoveSpell(s.id, { reason: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-rose-200 text-xs font-romantic text-rose-950"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: FLOATING ITEMS & BGMI GUNS (ALL PNGS EDITABLE) */}
          {activeTab === 'magic' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-rose-950 mb-1">
                  Harry Potter Muffler & BGMI Guns (Editable PNGs)
                </h3>
                <p className="font-romantic text-sm text-rose-700 italic font-medium">
                  Candles have been removed. You can toggle each item and upload or replace any PNG URL directly!
                </p>
              </div>

              <div className="space-y-6">
                {/* 1. HP Muffler / Scarf */}
                <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-cinzel text-sm font-bold text-rose-950">
                        Harry Potter Cozy Muffler / Scarf
                      </h4>
                      <p className="font-romantic text-xs text-rose-700">
                        Floats and waves gently in the air with interactive warm love message
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.magicElements.showMuffler}
                      onChange={(e) => updateMagicElements({ showMuffler: e.target.checked })}
                      className="w-5 h-5 accent-rose-500 cursor-pointer"
                    />
                  </div>

                  {config.magicElements.showMuffler && (
                    <div className="pt-2 border-t border-rose-200/80 space-y-2">
                      <label className="block text-xs font-cinzel uppercase text-rose-900 font-semibold">
                        Muffler PNG Image (Upload file or paste URL)
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-14 rounded-lg bg-white border border-rose-300 p-1 flex items-center justify-center shrink-0">
                          <img
                            src={config.magicElements.mufflerPngUrl}
                            alt="Muffler"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Paste PNG URL..."
                          value={config.magicElements.mufflerPngUrl}
                          onChange={(e) => updateMagicElements({ mufflerPngUrl: e.target.value })}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-rose-300 text-xs text-rose-950"
                        />
                        <label className="px-3 py-1.5 rounded-lg bg-rose-100 border border-rose-300 text-rose-800 text-xs font-cinzel uppercase cursor-pointer hover:bg-rose-200 whitespace-nowrap font-semibold">
                          <Upload className="w-3.5 h-3.5 inline mr-1" />
                          <span>Upload PNG</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleImageFileUpload(e, (base64) =>
                                updateMagicElements({ mufflerPngUrl: base64 })
                              )
                            }
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => updateMagicElements({ mufflerPngUrl: DEFAULT_MUFFLER_PNG })}
                          className="px-2.5 py-1.5 rounded-lg border border-rose-300 text-rose-700 text-xs font-cinzel hover:bg-rose-100"
                          title="Reset to default muffler PNG"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. BGMI Gun 1 (Pink M416) */}
                <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-cinzel text-sm font-bold text-rose-950">
                        BGMI Gun 1 (Assault Rifle / M416)
                      </h4>
                      <p className="font-romantic text-xs text-rose-700">
                        Floats on the right side with tactical duo devotion
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.magicElements.showGuns}
                      onChange={(e) => updateMagicElements({ showGuns: e.target.checked })}
                      className="w-5 h-5 accent-rose-500 cursor-pointer"
                    />
                  </div>

                  {config.magicElements.showGuns && (
                    <div className="pt-2 border-t border-rose-200/80 space-y-3">
                      <div>
                        <label className="block text-xs font-cinzel uppercase text-rose-900 font-semibold mb-1">
                          Gun 1 Name
                        </label>
                        <input
                          type="text"
                          value={config.magicElements.gun1Name}
                          onChange={(e) => updateMagicElements({ gun1Name: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-rose-300 text-xs text-rose-950"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-cinzel uppercase text-rose-900 font-semibold mb-1">
                          Gun 1 PNG Image (Upload file or paste URL)
                        </label>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-10 rounded-lg bg-white border border-rose-300 p-1 flex items-center justify-center shrink-0">
                            <img
                              src={config.magicElements.gun1PngUrl}
                              alt="Gun 1"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <input
                            type="text"
                            placeholder="Paste PNG URL..."
                            value={config.magicElements.gun1PngUrl}
                            onChange={(e) => updateMagicElements({ gun1PngUrl: e.target.value })}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-rose-300 text-xs text-rose-950"
                          />
                          <label className="px-3 py-1.5 rounded-lg bg-rose-100 border border-rose-300 text-rose-800 text-xs font-cinzel uppercase cursor-pointer hover:bg-rose-200 whitespace-nowrap font-semibold">
                            <Upload className="w-3.5 h-3.5 inline mr-1" />
                            <span>Upload PNG</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleImageFileUpload(e, (base64) =>
                                  updateMagicElements({ gun1PngUrl: base64 })
                                )
                              }
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => updateMagicElements({ gun1PngUrl: DEFAULT_GUN1_PNG })}
                            className="px-2.5 py-1.5 rounded-lg border border-rose-300 text-rose-700 text-xs font-cinzel hover:bg-rose-100"
                            title="Reset to default Gun 1 PNG"
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. BGMI Gun 2 (Flare Gun / AWM) */}
                {config.magicElements.showGuns && (
                  <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3">
                    <h4 className="font-cinzel text-sm font-bold text-rose-950">
                      BGMI Gun 2 (Flare Gun / Sniper)
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-cinzel uppercase text-rose-900 font-semibold mb-1">
                          Gun 2 Name
                        </label>
                        <input
                          type="text"
                          value={config.magicElements.gun2Name}
                          onChange={(e) => updateMagicElements({ gun2Name: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-rose-300 text-xs text-rose-950"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-cinzel uppercase text-rose-900 font-semibold mb-1">
                          Gun 2 PNG Image (Upload file or paste URL)
                        </label>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-10 rounded-lg bg-white border border-rose-300 p-1 flex items-center justify-center shrink-0">
                            <img
                              src={config.magicElements.gun2PngUrl}
                              alt="Gun 2"
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <input
                            type="text"
                            placeholder="Paste PNG URL..."
                            value={config.magicElements.gun2PngUrl}
                            onChange={(e) => updateMagicElements({ gun2PngUrl: e.target.value })}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-rose-300 text-xs text-rose-950"
                          />
                          <label className="px-3 py-1.5 rounded-lg bg-rose-100 border border-rose-300 text-rose-800 text-xs font-cinzel uppercase cursor-pointer hover:bg-rose-200 whitespace-nowrap font-semibold">
                            <Upload className="w-3.5 h-3.5 inline mr-1" />
                            <span>Upload PNG</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleImageFileUpload(e, (base64) =>
                                  updateMagicElements({ gun2PngUrl: base64 })
                                )
                              }
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => updateMagicElements({ gun2PngUrl: DEFAULT_GUN2_PNG })}
                            className="px-2.5 py-1.5 rounded-lg border border-rose-300 text-rose-700 text-xs font-cinzel hover:bg-rose-100"
                            title="Reset to default Gun 2 PNG"
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Golden Snitch PNG */}
                <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-cinzel text-sm font-bold text-rose-950">
                        Golden Snitch
                      </h4>
                      <p className="font-romantic text-xs text-rose-700">
                        Flutters across the screen and gives a secret love message when caught
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.magicElements.showSnitch}
                      onChange={(e) => updateMagicElements({ showSnitch: e.target.checked })}
                      className="w-5 h-5 accent-rose-500 cursor-pointer"
                    />
                  </div>

                  {config.magicElements.showSnitch && (
                    <div className="pt-2 border-t border-rose-200/80 space-y-2">
                      <label className="block text-xs font-cinzel uppercase text-rose-900 font-semibold">
                        Snitch PNG Image
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-10 rounded-lg bg-white border border-rose-300 p-1 flex items-center justify-center shrink-0">
                          <img
                            src={config.magicElements.snitchPngUrl}
                            alt="Snitch"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <input
                          type="text"
                          value={config.magicElements.snitchPngUrl}
                          onChange={(e) => updateMagicElements({ snitchPngUrl: e.target.value })}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-rose-300 text-xs text-rose-950"
                        />
                        <label className="px-3 py-1.5 rounded-lg bg-rose-100 border border-rose-300 text-rose-800 text-xs font-cinzel uppercase cursor-pointer hover:bg-rose-200 whitespace-nowrap font-semibold">
                          <Upload className="w-3.5 h-3.5 inline mr-1" />
                          <span>Upload PNG</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleImageFileUpload(e, (base64) =>
                                updateMagicElements({ snitchPngUrl: base64 })
                              )
                            }
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => updateMagicElements({ snitchPngUrl: DEFAULT_SNITCH_PNG })}
                          className="px-2.5 py-1.5 rounded-lg border border-rose-300 text-rose-700 text-xs font-cinzel hover:bg-rose-100"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. BGMI Airdrop PNG */}
                <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-cinzel text-sm font-bold text-rose-950">
                        BGMI Pink Airdrop
                      </h4>
                      <p className="font-romantic text-xs text-rose-700">
                        Erangel supply crate dropping love loot
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.magicElements.showPinkAirdrop}
                      onChange={(e) => updateMagicElements({ showPinkAirdrop: e.target.checked })}
                      className="w-5 h-5 accent-rose-500 cursor-pointer"
                    />
                  </div>

                  {config.magicElements.showPinkAirdrop && (
                    <div className="pt-2 border-t border-rose-200/80 space-y-2">
                      <label className="block text-xs font-cinzel uppercase text-rose-900 font-semibold">
                        Airdrop PNG Image
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-14 rounded-lg bg-white border border-rose-300 p-1 flex items-center justify-center shrink-0">
                          <img
                            src={config.magicElements.airdropPngUrl}
                            alt="Airdrop"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <input
                          type="text"
                          value={config.magicElements.airdropPngUrl}
                          onChange={(e) => updateMagicElements({ airdropPngUrl: e.target.value })}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-rose-300 text-xs text-rose-950"
                        />
                        <label className="px-3 py-1.5 rounded-lg bg-rose-100 border border-rose-300 text-rose-800 text-xs font-cinzel uppercase cursor-pointer hover:bg-rose-200 whitespace-nowrap font-semibold">
                          <Upload className="w-3.5 h-3.5 inline mr-1" />
                          <span>Upload PNG</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleImageFileUpload(e, (base64) =>
                                updateMagicElements({ airdropPngUrl: base64 })
                              )
                            }
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => updateMagicElements({ airdropPngUrl: DEFAULT_AIRDROP_PNG })}
                          className="px-2.5 py-1.5 rounded-lg border border-rose-300 text-rose-700 text-xs font-cinzel hover:bg-rose-100"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 6. Level 3 Helmet PNG */}
                <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-cinzel text-sm font-bold text-rose-950">
                        BGMI Level 3 Helmet
                      </h4>
                      <p className="font-romantic text-xs text-rose-700">
                        Cute helmet with pink ribbon protecting your girl's heart
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.magicElements.showLvl3Helmet}
                      onChange={(e) => updateMagicElements({ showLvl3Helmet: e.target.checked })}
                      className="w-5 h-5 accent-rose-500 cursor-pointer"
                    />
                  </div>

                  {config.magicElements.showLvl3Helmet && (
                    <div className="pt-2 border-t border-rose-200/80 space-y-2">
                      <label className="block text-xs font-cinzel uppercase text-rose-900 font-semibold">
                        Helmet PNG Image
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 rounded-lg bg-white border border-rose-300 p-1 flex items-center justify-center shrink-0">
                          <img
                            src={config.magicElements.helmetPngUrl}
                            alt="Helmet"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <input
                          type="text"
                          value={config.magicElements.helmetPngUrl}
                          onChange={(e) => updateMagicElements({ helmetPngUrl: e.target.value })}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-rose-300 text-xs text-rose-950"
                        />
                        <label className="px-3 py-1.5 rounded-lg bg-rose-100 border border-rose-300 text-rose-800 text-xs font-cinzel uppercase cursor-pointer hover:bg-rose-200 whitespace-nowrap font-semibold">
                          <Upload className="w-3.5 h-3.5 inline mr-1" />
                          <span>Upload PNG</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleImageFileUpload(e, (base64) =>
                                updateMagicElements({ helmetPngUrl: base64 })
                              )
                            }
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => updateMagicElements({ helmetPngUrl: DEFAULT_HELMET_PNG })}
                          className="px-2.5 py-1.5 rounded-lg border border-rose-300 text-rose-700 text-xs font-cinzel hover:bg-rose-100"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 7. Wand Sparkles on Cursor */}
                <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 flex items-center justify-between">
                  <div>
                    <h4 className="font-cinzel text-sm font-bold text-rose-950">
                      Wand Pink Sparks on Cursor / Touch
                    </h4>
                    <p className="font-romantic text-xs text-rose-700">
                      Leaves pink starlight dust behind the wand cursor as you move
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.magicElements.showSparklesOnCursor}
                    onChange={(e) => updateMagicElements({ showSparklesOnCursor: e.target.checked })}
                    className="w-5 h-5 accent-rose-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: HEDWIG OWL POST */}
          {activeTab === 'hedwig' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-rose-950 mb-1">
                  Hedwig Interactive Owl Post (Cursor Companion)
                </h3>
                <p className="font-romantic text-sm text-rose-700 italic font-medium">
                  Hedwig gracefully follows the mouse cursor or touch pointer across the screen with a wax-sealed love scroll in her beak. Tapping her produces an owl hoot, magical confetti, and delivers your personalized love message!
                </p>
              </div>

              {/* Main Hedwig Toggles */}
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 flex items-center justify-between">
                  <div>
                    <h4 className="font-cinzel text-sm font-bold text-rose-950">
                      Enable Hedwig Owl Companion
                    </h4>
                    <p className="font-romantic text-xs text-rose-700">
                      Displays the animated snowy owl character on the webpage
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.hedwig?.enabled ?? true}
                    onChange={(e) =>
                      updateHedwig({
                        ...config.hedwig,
                        enabled: e.target.checked,
                      })
                    }
                    className="w-5 h-5 accent-rose-500 cursor-pointer"
                  />
                </div>

                <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 flex items-center justify-between">
                  <div>
                    <h4 className="font-cinzel text-sm font-bold text-rose-950">
                      Follow Cursor & Touch Point
                    </h4>
                    <p className="font-romantic text-xs text-rose-700">
                      Hedwig flies smoothly behind your mouse or finger as you move
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.hedwig?.followCursor ?? true}
                    onChange={(e) =>
                      updateHedwig({
                        ...config.hedwig,
                        followCursor: e.target.checked,
                      })
                    }
                    className="w-5 h-5 accent-rose-500 cursor-pointer"
                  />
                </div>

                {/* Owl Name */}
                <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2">
                  <label className="block text-xs font-cinzel uppercase text-rose-900 font-semibold">
                    Owl Companion Name
                  </label>
                  <input
                    type="text"
                    value={config.hedwig?.name || 'Hedwig'}
                    onChange={(e) =>
                      updateHedwig({
                        ...config.hedwig,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-rose-300 text-rose-950 text-sm font-romantic"
                  />
                </div>

                {/* Primary Delivered Message */}
                <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2">
                  <label className="block text-xs font-cinzel uppercase text-rose-900 font-semibold">
                    Primary Personalized Delivery Message (When Clicked)
                  </label>
                  <p className="font-romantic text-xs text-rose-700 italic">
                    The heartfelt message that unfurls from Hedwig's scroll when your girlfriend taps her
                  </p>
                  <textarea
                    rows={3}
                    value={config.hedwig?.customMessage || ''}
                    onChange={(e) =>
                      updateHedwig({
                        ...config.hedwig,
                        customMessage: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-rose-300 text-rose-950 text-sm font-romantic"
                  />
                </div>

                {/* Additional Delivery Notes (Rotated on "Another Note" click) */}
                <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-4">
                  <div>
                    <h4 className="font-cinzel text-sm font-bold text-rose-950">
                      Additional Owl Post Notes
                    </h4>
                    <p className="font-romantic text-xs text-rose-700 italic">
                      Extra love notes that your girlfriend can cycle through when tapping "Another Note"
                    </p>
                  </div>

                  {/* Add New Note */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Write a sweet new love note for Hedwig to deliver..."
                      value={newHedwigNoteText}
                      onChange={(e) => setNewHedwigNoteText(e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-rose-300 text-rose-950 text-xs font-romantic"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newHedwigNoteText.trim()) return;
                        const existing = config.hedwig?.messages || [];
                        updateHedwig({
                          ...config.hedwig,
                          messages: [...existing, newHedwigNoteText.trim()],
                        });
                        setNewHedwigNoteText('');
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-cinzel text-xs font-bold uppercase tracking-wider hover:brightness-105 transition-all shadow-xs cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Note</span>
                    </button>
                  </div>

                  {/* List of existing notes */}
                  <div className="space-y-2">
                    {(config.hedwig?.messages || []).map((msg, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-3 rounded-xl bg-white border border-rose-200"
                      >
                        <input
                          type="text"
                          value={msg}
                          onChange={(e) => {
                            const updated = [...(config.hedwig?.messages || [])];
                            updated[idx] = e.target.value;
                            updateHedwig({
                              ...config.hedwig,
                              messages: updated,
                            });
                          }}
                          className="flex-1 bg-transparent border-none text-xs font-romantic text-rose-950 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (config.hedwig?.messages || []).filter((_, i) => i !== idx);
                            updateHedwig({
                              ...config.hedwig,
                              messages: updated,
                            });
                          }}
                          className="p-1 text-rose-400 hover:text-rose-700 cursor-pointer"
                          title="Delete note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: MUSIC & AMBIANCE */}
          {activeTab === 'music_theme' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-rose-950 mb-1">
                  Music & Light Pink Ambiance
                </h3>
                <p className="font-romantic text-sm text-rose-700 italic font-medium">
                  Control the background soundtrack, quotes, and light pink ambiance presets.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 flex items-center justify-between">
                  <div>
                    <h4 className="font-cinzel text-sm font-bold text-rose-950">
                      Enable Background Melody Player
                    </h4>
                    <p className="font-romantic text-xs text-rose-700">
                      Allows girlfriend to play soft romantic music box audio
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.audio.enableBgm}
                    onChange={(e) => updateAudio({ enableBgm: e.target.checked })}
                    className="w-5 h-5 accent-rose-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-cinzel uppercase text-rose-900 mb-1 font-semibold">
                    Custom Audio Stream URL (Optional MP3)
                  </label>
                  <input
                    type="text"
                    placeholder="Leave empty to use built-in Hedwig's Celesta Lullaby"
                    value={config.audio.customAudioUrl}
                    onChange={(e) => updateAudio({ customAudioUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-rose-300 text-sm text-rose-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-cinzel uppercase text-rose-900 mb-1 font-semibold">
                    Displayed Song Title
                  </label>
                  <input
                    type="text"
                    value={config.audio.songTitle}
                    onChange={(e) => updateAudio({ songTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-rose-300 text-sm text-rose-950 font-romantic"
                  />
                </div>

                {/* Light Pink Ambient Theme Preset */}
                <div className="pt-4 border-t border-rose-200 space-y-3">
                  <h4 className="font-cinzel text-sm font-bold text-rose-950">
                    Light Pink Ambiance Background Preset
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: 'light_rose_quartz', name: 'Light Rose Quartz', desc: 'Soft glowing rosy crystal aura' },
                      { id: 'light_blush_garden', name: 'Light Blush Garden', desc: 'Gentle blush pastel warmth' },
                      { id: 'light_cherry_blossom', name: 'Light Cherry Blossom', desc: 'Sakura pink petal bliss' },
                      { id: 'light_cotton_candy', name: 'Light Cotton Candy', desc: 'Whimsical sweet pink dream' },
                    ].map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => updateTheme({ ambientPreset: preset.id as any })}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          config.theme.ambientPreset === preset.id
                            ? 'bg-rose-100 border-rose-500 shadow-sm ring-2 ring-rose-300'
                            : 'bg-white border-rose-200 hover:border-rose-300 hover:bg-rose-50/50'
                        }`}
                      >
                        <div className="font-cinzel text-xs font-bold text-rose-950">
                          {preset.name}
                        </div>
                        <div className="font-romantic text-xs text-rose-700 italic">
                          {preset.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Footer Quote */}
                <div className="pt-4 border-t border-rose-200 space-y-4">
                  <h4 className="font-cinzel text-sm font-bold text-rose-950">
                    Footer Romantic Quote
                  </h4>

                  <div>
                    <label className="block text-xs font-cinzel uppercase text-rose-900 mb-1 font-semibold">
                      Quote Text
                    </label>
                    <input
                      type="text"
                      value={config.theme.quote}
                      onChange={(e) => updateTheme({ quote: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-rose-300 text-sm text-rose-950 font-romantic"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-cinzel uppercase text-rose-900 mb-1 font-semibold">
                      Quote Attribution / Author
                    </label>
                    <input
                      type="text"
                      value={config.theme.quoteAuthor}
                      onChange={(e) => updateTheme({ quoteAuthor: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-rose-300 text-sm text-rose-950 font-romantic"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: SECURITY & BASE PASSWORDS */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-rose-950 mb-1">
                  Access Gate & Base Passwords
                </h3>
                <p className="font-romantic text-sm text-rose-700 italic font-medium">
                  The website is locked behind hardcoded base credentials. You can also customize your preferred login spell here.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 space-y-3">
                <div className="text-xs font-cinzel text-rose-900 uppercase tracking-wider font-bold">
                  Default Base Hardcoded Credentials:
                </div>
                <div className="text-xs font-mono text-rose-900 space-y-1 bg-white p-3 rounded-xl border border-rose-200">
                  <div>Girlfriend ID: <span className="text-rose-700 font-bold">always</span></div>
                  <div>Girlfriend Spell: <span className="text-rose-700 font-bold">after all this time</span> (or <span className="text-rose-700 font-bold">alohomora</span>)</div>
                  <div>Admin Spell: <span className="text-rose-700 font-bold">solemnlyswear</span></div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-cinzel uppercase tracking-wider text-rose-900 mb-1 font-semibold">
                    Custom Girlfriend ID
                  </label>
                  <input
                    type="text"
                    value={config.security.userUsername}
                    onChange={(e) => updateSecurity({ userUsername: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-rose-300 text-rose-950 text-sm font-romantic"
                  />
                </div>

                <div>
                  <label className="block text-xs font-cinzel uppercase tracking-wider text-rose-900 mb-1 font-semibold">
                    Custom Girlfriend Password / Spell
                  </label>
                  <input
                    type="text"
                    value={config.security.userPassword}
                    onChange={(e) => updateSecurity({ userPassword: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-rose-300 text-rose-950 text-sm font-romantic"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-cinzel uppercase tracking-wider text-rose-900 mb-1 font-semibold">
                    Admin Password (To Open This Chamber)
                  </label>
                  <input
                    type="text"
                    value={config.security.adminPassword}
                    onChange={(e) => updateSecurity({ adminPassword: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-rose-300 text-rose-950 text-sm font-romantic"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: BACKUP & RESET */}
          {activeTab === 'backup' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-rose-950 mb-1">
                  Grimoire Backup & Memory Archival
                </h3>
                <p className="font-romantic text-sm text-rose-700 italic font-medium">
                  Download a complete backup of everything you wrote, import an existing file, or reset to original defaults.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Export */}
                <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 flex flex-col justify-between">
                  <div>
                    <h4 className="font-cinzel text-sm font-bold text-rose-950 mb-1">
                      Export Grimoire (JSON)
                    </h4>
                    <p className="font-romantic text-xs text-rose-700 mb-4 font-medium">
                      Download a single file containing all photos, love letters, special landmarks, muffler, guns, and dates.
                    </p>
                  </div>
                  <button
                    onClick={exportConfigJson}
                    className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-cinzel text-xs font-bold uppercase tracking-wider hover:brightness-105 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Backup JSON</span>
                  </button>
                </div>

                {/* Import */}
                <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 flex flex-col justify-between">
                  <div>
                    <h4 className="font-cinzel text-sm font-bold text-rose-950 mb-1">
                      Import Grimoire
                    </h4>
                    <p className="font-romantic text-xs text-rose-700 mb-4 font-medium">
                      Restore all memories, landmarks, and PNG items from an exported JSON file.
                    </p>
                  </div>
                  <label className="py-2.5 px-4 rounded-xl bg-white border border-rose-300 text-rose-800 font-cinzel text-xs font-bold uppercase tracking-wider hover:bg-rose-50 flex items-center justify-center gap-2 cursor-pointer shadow-xs">
                    <Upload className="w-4 h-4" />
                    <span>Select JSON File</span>
                    <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
                  </label>
                  {importStatus && (
                    <p className="text-xs font-romantic text-emerald-600 mt-2 text-center font-bold">{importStatus}</p>
                  )}
                </div>
              </div>

              {/* Reset Defaults */}
              <div className="pt-6 border-t border-rose-200">
                <div className="p-5 rounded-2xl bg-rose-50/80 border border-rose-300 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="font-cinzel text-sm font-bold text-rose-900">
                      Reset to Default Romantic Light Pink, Muffler & Guns Settings
                    </h4>
                    <p className="font-romantic text-xs text-rose-700 font-medium">
                      Erases custom modifications and restores original preloaded love letters, photos, landmarks, muffler, and guns.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to reset everything back to original defaults?')) {
                        resetToDefaults();
                      }
                    }}
                    className="py-2 px-4 rounded-xl bg-rose-600 border border-rose-400 text-white font-cinzel text-xs font-semibold uppercase tracking-wider hover:bg-rose-700 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 shadow-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset to Defaults</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-rose-200 bg-rose-50/80 flex items-center justify-between text-xs font-cinzel text-rose-700 font-semibold">
          <span>All edits take immediate effect on the live website</span>
          <button
            onClick={onClose}
            className="py-2 px-6 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold uppercase tracking-wider hover:brightness-105 cursor-pointer shadow-md"
          >
            Close & View Website
          </button>
        </div>
      </div>
    </div>
  );
};
