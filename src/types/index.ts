export interface MemoryItem {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
  caption: string;
  chapter: string;
  location?: string;
  magicalSpell?: string;
}

export interface LoveSpellItem {
  id: string;
  spell: string;
  meaning: string;
  reason: string;
}

export interface SpecialPlaceItem {
  id: string;
  name: string;
  realm: 'hogwarts' | 'bgmi_erangel' | 'special_place';
  tag: string;
  imageUrl: string;
  romanticStory: string;
  symbolIcon: string;
  cozyDetail: string;
}

export interface HedwigConfig {
  enabled: boolean;
  name: string;
  customMessage: string;
  messages: string[];
  followCursor: boolean;
}

export interface BgmiPingData {
  id?: string;
  sender: string;
  message: string;
  timestamp: string;
  matchType: string;
  status: 'active' | 'accepted' | 'dismissed';
  reply?: string;
}

export interface BgmiConfig {
  enabled: boolean;
  boyfriendIgn: string;
  boyfriendId: string;
  girlfriendIgn: string;
  girlfriendId: string;
  defaultFlareMessage: string;
  preferredDropLocation: string;
  whatsappNumber: string;
  activePing?: BgmiPingData | null;
}

export interface SiteConfig {
  girlfriend: {
    name: string;
    nickname: string;
    birthDate: string; // ISO 8601 string or YYYY-MM-DDTHH:mm:ss
    avatarUrl?: string;
  };
  countdown: {
    badgeText: string;
    title: string;
    subtitle: string;
    celebrationTitle: string;
    celebrationMessage: string;
    cakeWishText: string;
  };
  letter: {
    sealMonogram: string;
    sealColor: string;
    recipientAddress: string;
    salutation: string;
    paragraphs: string[];
    signOff: string;
    senderName: string;
    postscript: string;
  };
  magicElements: {
    showMuffler: boolean;
    mufflerPngUrl: string;
    showGuns: boolean;
    gun1Name: string;
    gun1PngUrl: string;
    gun2Name: string;
    gun2PngUrl: string;
    showSnitch: boolean;
    snitchPngUrl: string;
    showPinkAirdrop: boolean;
    airdropPngUrl: string;
    showLvl3Helmet: boolean;
    helmetPngUrl: string;
    showLetters: boolean;
    showPatronus: boolean;
    showSparklesOnCursor: boolean;
    magicIntensity: 'gentle' | 'magical' | 'lumos_maxima';
  };
  hedwig: HedwigConfig;
  bgmi: BgmiConfig;
  audio: {
    enableBgm: boolean;
    useSynthHogwartsTheme: boolean;
    customAudioUrl: string;
    songTitle: string;
    artist: string;
  };
  memories: MemoryItem[];
  loveSpells: LoveSpellItem[];
  specialPlaces: SpecialPlaceItem[];
  theme: {
    ambientPreset: 'light_rose_quartz' | 'light_blush_garden' | 'light_cherry_blossom' | 'light_cotton_candy';
    quote: string;
    quoteAuthor: string;
  };
  security: {
    userUsername: string;
    userPassword: string;
    adminPassword: string;
  };
}
