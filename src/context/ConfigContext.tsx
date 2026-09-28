import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { SiteConfig, MemoryItem, LoveSpellItem, SpecialPlaceItem } from '../types';
import { HARDCODED_DEFAULTS } from '../data/defaultConfig';
import { db } from '../lib/firebase';
import {
  doc,
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';

interface ConfigContextType {
  config: SiteConfig;
  updateGirlfriend: (data: Partial<SiteConfig['girlfriend']>) => void;
  updateCountdown: (data: Partial<SiteConfig['countdown']>) => void;
  updateLetter: (data: Partial<SiteConfig['letter']>) => void;
  updateMagicElements: (data: Partial<SiteConfig['magicElements']>) => void;
  updateHedwig: (data: Partial<SiteConfig['hedwig']>) => void;
  updateBgmi: (data: Partial<SiteConfig['bgmi']>) => void;
  sendBgmiFlarePing: (senderName: string, customMsg?: string, matchType?: string) => Promise<void>;
  respondToBgmiPing: (response: 'accepted' | 'dismissed', replyText?: string) => Promise<void>;
  updateAudio: (data: Partial<SiteConfig['audio']>) => void;
  updateTheme: (data: Partial<SiteConfig['theme']>) => void;
  updateSecurity: (data: Partial<SiteConfig['security']>) => void;
  // Memories management
  addMemory: (memory: Omit<MemoryItem, 'id'>) => void;
  updateMemory: (id: string, memory: Partial<MemoryItem>) => void;
  deleteMemory: (id: string) => void;
  reorderMemories: (newMemories: MemoryItem[]) => void;
  // Love Spells management
  addLoveSpell: (spell: Omit<LoveSpellItem, 'id'>) => void;
  updateLoveSpell: (id: string, spell: Partial<LoveSpellItem>) => void;
  deleteLoveSpell: (id: string) => void;
  // Special Places management
  addSpecialPlace: (place: Omit<SpecialPlaceItem, 'id'>) => void;
  updateSpecialPlace: (id: string, place: Partial<SpecialPlaceItem>) => void;
  deleteSpecialPlace: (id: string) => void;
  // Overall state management
  resetToDefaults: () => void;
  exportConfigJson: () => void;
  importConfigJson: (jsonString: string) => boolean;
  saveStatus: string;
  isCloudSynced: boolean;
}

const STORAGE_KEY = 'magical_birthday_config_cloud_v5';
const validLightPresets = ['light_rose_quartz', 'light_blush_garden', 'light_cherry_blossom', 'light_cotton_candy'];

const ConfigContext = createContext<ConfigContextType | null>(null);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from local cache or defaults
  const [config, setConfig] = useState<SiteConfig>(() => {
    try {
      // Check current key or previous versions to preserve user's local mobile edits
      const saved =
        localStorage.getItem(STORAGE_KEY) ||
        localStorage.getItem('magical_birthday_config_light_pink_publish_v4') ||
        localStorage.getItem('magical_birthday_config_light_pink_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        const resolvedPreset = validLightPresets.includes(parsed.theme?.ambientPreset)
          ? parsed.theme.ambientPreset
          : HARDCODED_DEFAULTS.theme.ambientPreset;

        return {
          ...HARDCODED_DEFAULTS,
          ...parsed,
          girlfriend: { ...HARDCODED_DEFAULTS.girlfriend, ...(parsed.girlfriend || {}) },
          countdown: { ...HARDCODED_DEFAULTS.countdown, ...(parsed.countdown || {}) },
          letter: { ...HARDCODED_DEFAULTS.letter, ...(parsed.letter || {}) },
          magicElements: { ...HARDCODED_DEFAULTS.magicElements, ...(parsed.magicElements || {}) },
          hedwig: { ...HARDCODED_DEFAULTS.hedwig, ...(parsed.hedwig || {}) },
          bgmi: { ...HARDCODED_DEFAULTS.bgmi, ...(parsed.bgmi || {}) },
          audio: { ...HARDCODED_DEFAULTS.audio, ...(parsed.audio || {}) },
          theme: { ...HARDCODED_DEFAULTS.theme, ...(parsed.theme || {}), ambientPreset: resolvedPreset },
          security: { ...HARDCODED_DEFAULTS.security, ...(parsed.security || {}) },
          memories: Array.isArray(parsed.memories) && parsed.memories.length > 0 ? parsed.memories : HARDCODED_DEFAULTS.memories,
          loveSpells: Array.isArray(parsed.loveSpells) && parsed.loveSpells.length > 0 ? parsed.loveSpells : HARDCODED_DEFAULTS.loveSpells,
          specialPlaces: Array.isArray(parsed.specialPlaces) && parsed.specialPlaces.length > 0 ? parsed.specialPlaces : HARDCODED_DEFAULTS.specialPlaces,
        };
      }
    } catch (e) {
      console.error('Failed to load initial cache', e);
    }
    return HARDCODED_DEFAULTS;
  });

  const [saveStatus, setSaveStatus] = useState<string>('Syncing with Cloud...');
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);

  // Keep a ref to current config for event handlers and listeners
  const configRef = useRef(config);
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  // Persist to local cache whenever config changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('Local cache storage warning', e);
    }
  }, [config]);

  // =========================================================================
  // REAL-TIME FIRESTORE SYNCHRONIZATION ACROSS ALL DEVICES
  // =========================================================================
  useEffect(() => {
    let isSubscribed = true;

    // 1. Listen to global appConfig document (girlfriend, countdown, letter, magic, audio, theme, security)
    const appConfigRef = doc(db, 'appConfig', 'main');
    const unsubAppConfig = onSnapshot(
      appConfigRef,
      (docSnap) => {
        if (!isSubscribed) return;

        if (docSnap.exists()) {
          const data = docSnap.data();
          setIsCloudSynced(true);
          setSaveStatus('Cloud Synced across all devices');

          setConfig((prev) => {
            const resolvedPreset = validLightPresets.includes(data.theme?.ambientPreset)
              ? data.theme.ambientPreset
              : prev.theme.ambientPreset;

            return {
              ...prev,
              girlfriend: { ...prev.girlfriend, ...(data.girlfriend || {}) },
              countdown: { ...prev.countdown, ...(data.countdown || {}) },
              letter: { ...prev.letter, ...(data.letter || {}) },
              magicElements: { ...prev.magicElements, ...(data.magicElements || {}) },
              hedwig: { ...prev.hedwig, ...(data.hedwig || {}) },
              bgmi: { ...prev.bgmi, ...(data.bgmi || {}) },
              audio: { ...prev.audio, ...(data.audio || {}) },
              theme: { ...prev.theme, ...(data.theme || {}), ambientPreset: resolvedPreset },
              security: { ...prev.security, ...(data.security || {}) },
            };
          });
        } else {
          // If cloud document does not exist yet, seed it with current local/default values
          const initialData = {
            girlfriend: configRef.current.girlfriend,
            countdown: configRef.current.countdown,
            letter: configRef.current.letter,
            magicElements: configRef.current.magicElements,
            hedwig: configRef.current.hedwig,
            bgmi: configRef.current.bgmi,
            audio: configRef.current.audio,
            theme: configRef.current.theme,
            security: configRef.current.security,
            updatedAt: new Date().toISOString(),
          };
          setDoc(appConfigRef, initialData).catch((err) =>
            console.error('Error seeding initial appConfig in cloud', err)
          );
        }
      },
      (error) => {
        console.warn('Real-time appConfig listener notice:', error.message);
        setSaveStatus('Saved locally (Offline)');
      }
    );

    // 2. Listen to memories collection in real-time
    const memoriesColRef = collection(db, 'memories');
    const unsubMemories = onSnapshot(
      memoriesColRef,
      (querySnap) => {
        if (!isSubscribed) return;

        if (querySnap.empty) {
          // Seed cloud memories from current state/defaults
          const currentMems = configRef.current.memories.length > 0 ? configRef.current.memories : HARDCODED_DEFAULTS.memories;
          currentMems.forEach((m, idx) => {
            setDoc(doc(db, 'memories', m.id), { ...m, order: idx }).catch((e) =>
              console.error('Error seeding memory to cloud', e)
            );
          });
        } else {
          const loadedMemories: MemoryItem[] = [];
          querySnap.forEach((docItem) => {
            const data = docItem.data() as MemoryItem & { order?: number };
            loadedMemories.push({
              id: docItem.id,
              title: data.title || '',
              date: data.date || '',
              imageUrl: data.imageUrl || '',
              caption: data.caption || '',
              chapter: data.chapter || 'Magical Dates',
              location: data.location || '',
              magicalSpell: data.magicalSpell || '',
            });
          });
          setConfig((prev) => ({ ...prev, memories: loadedMemories }));
        }
      },
      (error) => {
        console.warn('Memories cloud sync notice:', error.message);
      }
    );

    // 3. Listen to loveSpells collection in real-time
    const spellsColRef = collection(db, 'loveSpells');
    const unsubSpells = onSnapshot(
      spellsColRef,
      (querySnap) => {
        if (!isSubscribed) return;

        if (querySnap.empty) {
          const currentSpells = configRef.current.loveSpells.length > 0 ? configRef.current.loveSpells : HARDCODED_DEFAULTS.loveSpells;
          currentSpells.forEach((s, idx) => {
            setDoc(doc(db, 'loveSpells', s.id), { ...s, order: idx }).catch((e) =>
              console.error('Error seeding spell to cloud', e)
            );
          });
        } else {
          const loadedSpells: LoveSpellItem[] = [];
          querySnap.forEach((docItem) => {
            const data = docItem.data() as LoveSpellItem;
            loadedSpells.push({
              id: docItem.id,
              spell: data.spell || '',
              meaning: data.meaning || '',
              reason: data.reason || '',
            });
          });
          setConfig((prev) => ({ ...prev, loveSpells: loadedSpells }));
        }
      },
      (error) => {
        console.warn('Love spells cloud sync notice:', error.message);
      }
    );

    // 4. Listen to specialPlaces collection in real-time
    const placesColRef = collection(db, 'specialPlaces');
    const unsubPlaces = onSnapshot(
      placesColRef,
      (querySnap) => {
        if (!isSubscribed) return;

        if (querySnap.empty) {
          const currentPlaces = configRef.current.specialPlaces.length > 0 ? configRef.current.specialPlaces : HARDCODED_DEFAULTS.specialPlaces;
          currentPlaces.forEach((p, idx) => {
            setDoc(doc(db, 'specialPlaces', p.id), { ...p, order: idx }).catch((e) =>
              console.error('Error seeding place to cloud', e)
            );
          });
        } else {
          const loadedPlaces: SpecialPlaceItem[] = [];
          querySnap.forEach((docItem) => {
            const data = docItem.data() as SpecialPlaceItem;
            loadedPlaces.push({
              id: docItem.id,
              name: data.name || '',
              realm: data.realm || 'hogwarts',
              tag: data.tag || '',
              imageUrl: data.imageUrl || '',
              romanticStory: data.romanticStory || '',
              symbolIcon: data.symbolIcon || 'Castle',
              cozyDetail: data.cozyDetail || '',
            });
          });
          setConfig((prev) => ({ ...prev, specialPlaces: loadedPlaces }));
        }
      },
      (error) => {
        console.warn('Special places cloud sync notice:', error.message);
      }
    );

    return () => {
      isSubscribed = false;
      unsubAppConfig();
      unsubMemories();
      unsubSpells();
      unsubPlaces();
    };
  }, []);

  // Helper to sync main appConfig sections to Firestore
  const syncAppConfigField = async (field: keyof SiteConfig, value: any) => {
    setSaveStatus('Saving & syncing with cloud...');
    try {
      await setDoc(doc(db, 'appConfig', 'main'), { [field]: value, updatedAt: new Date().toISOString() }, { merge: true });
      setSaveStatus('Cloud Synced across all devices');
      setIsCloudSynced(true);
    } catch (e) {
      console.error(`Failed to sync ${field} to cloud`, e);
      setSaveStatus('Saved locally (Offline)');
    }
  };

  // Section updaters
  const updateGirlfriend = (data: Partial<SiteConfig['girlfriend']>) => {
    const updated = { ...config.girlfriend, ...data };
    setConfig((prev) => ({ ...prev, girlfriend: updated }));
    syncAppConfigField('girlfriend', updated);
  };

  const updateCountdown = (data: Partial<SiteConfig['countdown']>) => {
    const updated = { ...config.countdown, ...data };
    setConfig((prev) => ({ ...prev, countdown: updated }));
    syncAppConfigField('countdown', updated);
  };

  const updateLetter = (data: Partial<SiteConfig['letter']>) => {
    const updated = { ...config.letter, ...data };
    setConfig((prev) => ({ ...prev, letter: updated }));
    syncAppConfigField('letter', updated);
  };

  const updateMagicElements = (data: Partial<SiteConfig['magicElements']>) => {
    const updated = { ...config.magicElements, ...data };
    setConfig((prev) => ({ ...prev, magicElements: updated }));
    syncAppConfigField('magicElements', updated);
  };

  const updateHedwig = (data: Partial<SiteConfig['hedwig']>) => {
    const updated = { ...config.hedwig, ...data };
    setConfig((prev) => ({ ...prev, hedwig: updated }));
    syncAppConfigField('hedwig', updated);
  };

  const updateBgmi = (data: Partial<SiteConfig['bgmi']>) => {
    const updated = { ...config.bgmi, ...data };
    setConfig((prev) => ({ ...prev, bgmi: updated }));
    syncAppConfigField('bgmi', updated);
  };

  const sendBgmiFlarePing = async (senderName: string, customMsg?: string, matchType = 'Rozhok Duo Squad') => {
    const pingData: BgmiPingData = {
      id: 'flare-' + Date.now(),
      sender: senderName,
      message: customMsg || config.bgmi?.defaultFlareMessage || 'Firing the Pink Flare Gun! Get your Level 3 vest ready, let’s drop into Rozhok! 🪂🔫',
      timestamp: new Date().toISOString(),
      matchType,
      status: 'active',
    };
    const updatedBgmi = { ...config.bgmi, activePing: pingData };
    setConfig((prev) => ({ ...prev, bgmi: updatedBgmi }));
    await syncAppConfigField('bgmi', updatedBgmi);
  };

  const respondToBgmiPing = async (response: 'accepted' | 'dismissed', replyText?: string) => {
    if (!config.bgmi?.activePing) return;
    const updatedPing: BgmiPingData = {
      ...config.bgmi.activePing,
      status: response,
      reply: replyText,
    };
    const updatedBgmi = {
      ...config.bgmi,
      activePing: response === 'dismissed' ? null : updatedPing,
    };
    setConfig((prev) => ({ ...prev, bgmi: updatedBgmi }));
    await syncAppConfigField('bgmi', updatedBgmi);
  };

  const updateAudio = (data: Partial<SiteConfig['audio']>) => {
    const updated = { ...config.audio, ...data };
    setConfig((prev) => ({ ...prev, audio: updated }));
    syncAppConfigField('audio', updated);
  };

  const updateTheme = (data: Partial<SiteConfig['theme']>) => {
    const updated = { ...config.theme, ...data };
    setConfig((prev) => ({ ...prev, theme: updated }));
    syncAppConfigField('theme', updated);
  };

  const updateSecurity = (data: Partial<SiteConfig['security']>) => {
    const updated = { ...config.security, ...data };
    setConfig((prev) => ({ ...prev, security: updated }));
    syncAppConfigField('security', updated);
  };

  // Memory actions
  const addMemory = async (memory: Omit<MemoryItem, 'id'>) => {
    const newMemory: MemoryItem = {
      ...memory,
      id: 'mem-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    };
    // Optimistic local update
    setConfig((prev) => ({ ...prev, memories: [newMemory, ...prev.memories] }));
    setSaveStatus('Uploading photo & syncing with cloud...');

    try {
      await setDoc(doc(db, 'memories', newMemory.id), { ...newMemory, createdAt: new Date().toISOString() });
      setSaveStatus('Cloud Synced across all devices');
      setIsCloudSynced(true);
    } catch (e) {
      console.error('Failed to add memory to cloud', e);
      setSaveStatus('Saved locally (Storage limit check)');
    }
  };

  const updateMemory = async (id: string, updatedFields: Partial<MemoryItem>) => {
    setConfig((prev) => ({
      ...prev,
      memories: prev.memories.map((m) => (m.id === id ? { ...m, ...updatedFields } : m)),
    }));
    try {
      await setDoc(doc(db, 'memories', id), updatedFields, { merge: true });
      setSaveStatus('Cloud Synced across all devices');
    } catch (e) {
      console.error('Failed to update memory in cloud', e);
    }
  };

  const deleteMemory = async (id: string) => {
    setConfig((prev) => ({
      ...prev,
      memories: prev.memories.filter((m) => m.id !== id),
    }));
    try {
      await deleteDoc(doc(db, 'memories', id));
      setSaveStatus('Cloud Synced across all devices');
    } catch (e) {
      console.error('Failed to delete memory in cloud', e);
    }
  };

  const reorderMemories = (newMemories: MemoryItem[]) => {
    setConfig((prev) => ({ ...prev, memories: newMemories }));
    const batch = writeBatch(db);
    newMemories.forEach((mem, index) => {
      batch.set(doc(db, 'memories', mem.id), { order: index }, { merge: true });
    });
    batch.commit().catch((e) => console.error('Failed to update memory order', e));
  };

  // Love Spell actions
  const addLoveSpell = async (spell: Omit<LoveSpellItem, 'id'>) => {
    const newSpell: LoveSpellItem = {
      ...spell,
      id: 'spell-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    };
    setConfig((prev) => ({ ...prev, loveSpells: [...prev.loveSpells, newSpell] }));
    try {
      await setDoc(doc(db, 'loveSpells', newSpell.id), newSpell);
      setSaveStatus('Cloud Synced across all devices');
      setIsCloudSynced(true);
    } catch (e) {
      console.error('Failed to add spell in cloud', e);
    }
  };

  const updateLoveSpell = async (id: string, spell: Partial<LoveSpellItem>) => {
    setConfig((prev) => ({
      ...prev,
      loveSpells: prev.loveSpells.map((s) => (s.id === id ? { ...s, ...spell } : s)),
    }));
    try {
      await setDoc(doc(db, 'loveSpells', id), spell, { merge: true });
      setSaveStatus('Cloud Synced across all devices');
    } catch (e) {
      console.error('Failed to update spell in cloud', e);
    }
  };

  const deleteLoveSpell = async (id: string) => {
    setConfig((prev) => ({
      ...prev,
      loveSpells: prev.loveSpells.filter((s) => s.id !== id),
    }));
    try {
      await deleteDoc(doc(db, 'loveSpells', id));
      setSaveStatus('Cloud Synced across all devices');
    } catch (e) {
      console.error('Failed to delete spell in cloud', e);
    }
  };

  // Special Places actions
  const addSpecialPlace = async (place: Omit<SpecialPlaceItem, 'id'>) => {
    const newPlace: SpecialPlaceItem = {
      ...place,
      id: 'place-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    };
    setConfig((prev) => ({ ...prev, specialPlaces: [...prev.specialPlaces, newPlace] }));
    try {
      await setDoc(doc(db, 'specialPlaces', newPlace.id), newPlace);
      setSaveStatus('Cloud Synced across all devices');
      setIsCloudSynced(true);
    } catch (e) {
      console.error('Failed to add place in cloud', e);
    }
  };

  const updateSpecialPlace = async (id: string, place: Partial<SpecialPlaceItem>) => {
    setConfig((prev) => ({
      ...prev,
      specialPlaces: prev.specialPlaces.map((p) => (p.id === id ? { ...p, ...place } : p)),
    }));
    try {
      await setDoc(doc(db, 'specialPlaces', id), place, { merge: true });
      setSaveStatus('Cloud Synced across all devices');
    } catch (e) {
      console.error('Failed to update place in cloud', e);
    }
  };

  const deleteSpecialPlace = async (id: string) => {
    setConfig((prev) => ({
      ...prev,
      specialPlaces: prev.specialPlaces.filter((p) => p.id !== id),
    }));
    try {
      await deleteDoc(doc(db, 'specialPlaces', id));
      setSaveStatus('Cloud Synced across all devices');
    } catch (e) {
      console.error('Failed to delete place in cloud', e);
    }
  };

  // Reset to default data
  const resetToDefaults = async () => {
    setConfig(HARDCODED_DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
      await setDoc(doc(db, 'appConfig', 'main'), {
        girlfriend: HARDCODED_DEFAULTS.girlfriend,
        countdown: HARDCODED_DEFAULTS.countdown,
        letter: HARDCODED_DEFAULTS.letter,
        magicElements: HARDCODED_DEFAULTS.magicElements,
        hedwig: HARDCODED_DEFAULTS.hedwig,
        bgmi: HARDCODED_DEFAULTS.bgmi,
        audio: HARDCODED_DEFAULTS.audio,
        theme: HARDCODED_DEFAULTS.theme,
        security: HARDCODED_DEFAULTS.security,
        updatedAt: new Date().toISOString(),
      });
      setSaveStatus('Reset to defaults and synced to cloud');
    } catch (e) {
      console.error('Error resetting cloud config', e);
    }
  };

  // Export JSON backup
  const exportConfigJson = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute(
        'download',
        `magical-birthday-${config.girlfriend.name.toLowerCase().replace(/\s+/g, '-')}-backup.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      console.error('Failed to export configuration', e);
    }
  };

  // Import JSON backup and upload to cloud
  const importConfigJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object') {
        const merged: SiteConfig = {
          ...config,
          ...parsed,
          girlfriend: { ...config.girlfriend, ...(parsed.girlfriend || {}) },
          countdown: { ...config.countdown, ...(parsed.countdown || {}) },
          letter: { ...config.letter, ...(parsed.letter || {}) },
          magicElements: { ...config.magicElements, ...(parsed.magicElements || {}) },
          hedwig: { ...config.hedwig, ...(parsed.hedwig || {}) },
          bgmi: { ...config.bgmi, ...(parsed.bgmi || {}) },
          audio: { ...config.audio, ...(parsed.audio || {}) },
          theme: { ...config.theme, ...(parsed.theme || {}) },
          security: { ...config.security, ...(parsed.security || {}) },
          memories: Array.isArray(parsed.memories) ? parsed.memories : config.memories,
          loveSpells: Array.isArray(parsed.loveSpells) ? parsed.loveSpells : config.loveSpells,
          specialPlaces: Array.isArray(parsed.specialPlaces) ? parsed.specialPlaces : config.specialPlaces,
        };

        setConfig(merged);

        // Upload imported data to cloud
        setDoc(doc(db, 'appConfig', 'main'), {
          girlfriend: merged.girlfriend,
          countdown: merged.countdown,
          letter: merged.letter,
          magicElements: merged.magicElements,
          hedwig: merged.hedwig,
          bgmi: merged.bgmi,
          audio: merged.audio,
          theme: merged.theme,
          security: merged.security,
          updatedAt: new Date().toISOString(),
        }).catch((e) => console.error('Error syncing imported config to cloud', e));

        if (Array.isArray(parsed.memories)) {
          parsed.memories.forEach((mem: MemoryItem) => {
            setDoc(doc(db, 'memories', mem.id), mem).catch((e) => console.error(e));
          });
        }

        setSaveStatus('Cloud Synced across all devices');
        return true;
      }
    } catch (e) {
      console.error('Failed to parse imported json', e);
    }
    return false;
  };

  return (
    <ConfigContext.Provider
      value={{
        config,
        updateGirlfriend,
        updateCountdown,
        updateLetter,
        updateMagicElements,
        updateHedwig,
        updateBgmi,
        sendBgmiFlarePing,
        respondToBgmiPing,
        updateAudio,
        updateTheme,
        updateSecurity,
        addMemory,
        updateMemory,
        deleteMemory,
        reorderMemories,
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
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
