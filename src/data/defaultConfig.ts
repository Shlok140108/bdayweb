import { SiteConfig } from '../types';
import {
  DEFAULT_MUFFLER_PNG,
  DEFAULT_GUN1_PNG,
  DEFAULT_GUN2_PNG,
  DEFAULT_SNITCH_PNG,
  DEFAULT_AIRDROP_PNG,
  DEFAULT_HELMET_PNG,
} from './defaultPngAssets';

export const HARDCODED_DEFAULTS: SiteConfig = {
  girlfriend: {
    name: 'My Enchanting Witch',
    nickname: 'My Pink Golden Snitch',
    birthDate: '2026-10-14T00:00:00',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  },
  countdown: {
    badgeText: 'A Fairytale Birthday Countdown',
    title: 'Counting Down Every Sweet Second Until Your Birthday',
    subtitle: 'From cozy warm Hogwarts mufflers to our favorite sunset rooftop in Rozhok, every second waiting for you is filled with pure love.',
    celebrationTitle: '🌸 Happy Birthday, My Whole World! 🎂',
    celebrationMessage: 'Today the sweetest soul was born. May your year be draped in cherry blossoms, magical adventures, and victory crowns. Close your eyes and make your secret birthday wish!',
    cakeWishText: 'Make a Sweet Birthday Wish',
  },
  letter: {
    sealMonogram: '♥',
    sealColor: '#f43f5e',
    recipientAddress: 'To My Favorite Girl, Room of Requirement & Rozhok Hilltop, With All My Love',
    salutation: 'Dearest Baby,',
    paragraphs: [
      'If I had a Pensieve to preserve our love story, every memory would shimmer in soft rose-pink light. From the quiet evenings where you wrap my oversized scarf around your neck, to the chaotic laughter when we are running side-by-side through the blue zone in Erangel.',
      'You are my real-life magic. You turn ordinary days into enchanted adventures, and even when the whole world feels loud or overwhelming, hearing your voice in my ear is the only safe haven I ever need.',
      'Whether we are wearing our Hogwarts mufflers against the winter chill or holding down the rooftops of Rozhok together with our pink M416s, I promise to always be your number one teammate, your protector, and the boy who loves you unconditionally.',
      'Happy early birthday to my sweet queen, my favorite gamer girl, and the prettiest witch in all the realms.'
    ],
    signOff: 'After all this time? Always & Forever,',
    senderName: 'Your Devoted Player One ♥',
    postscript: 'P.S. Tap the floating scarf, guns, or the pink airdrop drifting across the screen for secret love messages.',
  },
  magicElements: {
    showMuffler: true,
    mufflerPngUrl: DEFAULT_MUFFLER_PNG,
    showGuns: true,
    gun1Name: 'Pink M416 Heart Skin',
    gun1PngUrl: DEFAULT_GUN1_PNG,
    gun2Name: 'Pink Flare Gun',
    gun2PngUrl: DEFAULT_GUN2_PNG,
    showSnitch: true,
    snitchPngUrl: DEFAULT_SNITCH_PNG,
    showPinkAirdrop: true,
    airdropPngUrl: DEFAULT_AIRDROP_PNG,
    showLvl3Helmet: true,
    helmetPngUrl: DEFAULT_HELMET_PNG,
    showLetters: true,
    showPatronus: true,
    showSparklesOnCursor: true,
    magicIntensity: 'magical',
  },
  hedwig: {
    enabled: true,
    name: 'Hedwig',
    customMessage: 'Hoo! A special delivery just for you: "You are the sweetest part of my day, my favorite person, and my happiest memory. Always." ♥',
    messages: [
      'Hoo! Special owl post: "Every second with you is pure magic. I love you to Hogwarts, Rozhok, and back!" ♥',
      'Hoo hoo! Letter delivery: "Wrapped together in our Hogwarts muffler so you never feel cold. My heart is forever yours."',
      'Gentle nuzzle! "In BGMI or in real life, I will always share my Level 3 vest and protect you with everything I have."',
      'Owl delivery: "You are the Golden Snitch I was lucky enough to catch. Happy early birthday, my whole world! 🌸"',
      'Hoo! Secret parchment: "Hearing your sweet voice is my favorite sanctuary in this whole wide universe."',
      'Hedwig drops a tiny pink flower in your palm: "After all this time? Always and unconditionally."',
    ],
    followCursor: true,
  },
  bgmi: {
    enabled: true,
    boyfriendIgn: 'DevotedPlayerOne',
    boyfriendId: '5123456789',
    girlfriendIgn: 'PrincessRozhok',
    girlfriendId: '5987654321',
    defaultFlareMessage: 'Firing the Pink Flare Gun! 🪂 Grab your Level 3 helmet, let’s drop into Rozhok and get our Chicken Dinner! ♥',
    preferredDropLocation: 'Rozhok Water City & Warehouse',
    whatsappNumber: '',
    activePing: null,
  },
  audio: {
    enableBgm: true,
    useSynthHogwartsTheme: true,
    customAudioUrl: '',
    songTitle: 'Hedwig’s Pink Celesta Waltz',
    artist: 'Enchanted Music Box',
  },
  specialPlaces: [
    {
      id: 'place-hogwarts-school',
      name: 'Hogwarts School of Witchcraft and Wizardry',
      realm: 'hogwarts',
      tag: 'The Realm of Infinite Magic',
      imageUrl: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?auto=format&fit=crop&w=900&q=80',
      romanticStory: 'Wrapped together in our Hogwarts muffler, walking through the Great Hall and down the corridors to the Room of Requirement. To me, Hogwarts represents the wonder you brought into my life — the reminder that miracles exist because you exist.',
      symbolIcon: 'Castle',
      cozyDetail: 'Cozy pink scarf, warm Great Hall feast, & midnight strolls across the moving staircases.',
    },
    {
      id: 'place-astronomy-hogsmeade',
      name: 'The Astronomy Tower & Hogsmeade Village',
      realm: 'special_place',
      tag: 'Our Secret Starlit Hideaway',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80',
      romanticStory: 'High above the clouds at the Astronomy Tower, stargazing while wrapped in an oversized warm pink knitted scarf. Followed by a quiet walk down the snow-covered cobblestone lanes of Hogsmeade, sharing a steaming mug of Butterbeer with you.',
      symbolIcon: 'Stars',
      cozyDetail: 'Stargazing telescope, warm pink lanterns, sweet marshmallow treats, and holding cold hands.',
    },
    {
      id: 'place-rozhok-erangel',
      name: 'Rozhok — Erangel Map',
      realm: 'bgmi_erangel',
      tag: 'Our Legendary BGMI Hot-Drop',
      imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80',
      romanticStory: 'Our absolute sacred drop spot in Erangel! The water city canal, the three-story roof overlooking the river, and the warehouse hillside. We’ve shared Level 3 helmets here, fired our pink flare gun, passed each other the M416 with 10 HP left, revived each other in the smoke, and watched the pink sunset skies before taking the buggy to the final safe zone.',
      symbolIcon: 'Crosshair',
      cozyDetail: 'Rozhok water canal, rooftop sniper perch, shared Level 3 backpack, pink flare gun drop, and our sweetest duo chicken dinners.',
    }
  ],
  memories: [
    {
      id: 'mem-1',
      title: 'The Day Everything Changed',
      date: 'The Beginning of Us',
      chapter: 'First Spark',
      imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80',
      caption: 'The very first moment our eyes locked across the room. Like a spark from an elder wand, I knew right then my heart had found its home.',
      location: 'The Cozy Corner Cafe',
      magicalSpell: 'Lumos',
    },
    {
      id: 'mem-2',
      title: 'Under the Starlit Sky',
      date: 'Autumn Stroll',
      chapter: 'Magical Dates',
      imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
      caption: 'Walking together wrapped in our favorite warm scarf, laughing about silly things under fairy lights that felt just like the Astronomy Tower.',
      location: 'The Old Bridge',
      magicalSpell: 'Aresto Momentum',
    },
    {
      id: 'mem-3',
      title: 'Your Contagious Laugh',
      date: 'Sunny Afternoon',
      chapter: 'Little Moments',
      imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
      caption: 'You were laughing so hard you couldn’t speak. That sound is my absolute favorite symphony in all the magical and battleground worlds.',
      location: 'Park Bench & Ice Cream',
      magicalSpell: 'Riddikulus',
    },
    {
      id: 'mem-4',
      title: 'Our Rainy Day Reading Sanctuary',
      date: 'Winter Evening',
      chapter: 'Everyday Magic',
      imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
      caption: 'Hot cinnamon cocoa, heavy rain tapping on the window panes, and you curled up beside me playing duo matches and reading books.',
      location: 'Our Cozy Living Room',
      magicalSpell: 'Protego',
    },
    {
      id: 'mem-5',
      title: 'The Secret We Shared',
      date: 'Late Night Talks',
      chapter: 'Magical Dates',
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      caption: 'Talking until 3:00 AM about our biggest dreams, our fears, and the life we want to build together. Time ceased to exist.',
      location: 'Car Dashboard Under Stars',
      magicalSpell: 'Colloportus',
    },
    {
      id: 'mem-6',
      title: 'Looking at You Looking at the World',
      date: 'Weekend Getaway',
      chapter: 'Adventures',
      imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
      caption: 'You were looking out at the mountain horizon, the wind playing with your hair and scarf. I couldn’t take my eyes off you.',
      location: 'Hilltop Overlook',
      magicalSpell: 'Expecto Patronum',
    }
  ],
  loveSpells: [
    {
      id: 'spell-1',
      spell: 'Lumos Maxima',
      meaning: 'The Infinite Light',
      reason: 'Because even on my heaviest, gloomiest days, one single smile from you instantly fills my whole world with blinding warmth and comfort.'
    },
    {
      id: 'spell-2',
      spell: 'Expecto Patronum',
      meaning: 'The Purest Joy',
      reason: 'Whenever I search my soul for my happiest memory to conquer any darkness, every single memory that surfaces is you.'
    },
    {
      id: 'spell-3',
      spell: 'Amortentia',
      meaning: 'The Irresistible Love',
      reason: 'You are my ultimate love potion — smelling like fresh rain, sweet vanilla, and the safety of home whenever you wrap your arms around me.'
    },
    {
      id: 'spell-4',
      spell: 'Alohomora',
      meaning: 'The Key to My Soul',
      reason: 'I used to keep my feelings locked behind thick steel gates, but you unlocked every guarded chamber of my heart without ever forcing a key.'
    },
    {
      id: 'spell-5',
      spell: 'Accio Heart',
      meaning: 'The Irrevocable Pull',
      reason: 'No matter where I go or how far apart we might be, every beat of my heart pulls relentlessly in your direction.'
    },
    {
      id: 'spell-6',
      spell: 'Fidelius Charm',
      meaning: 'The Secret Keeper',
      reason: 'You are the keeper of my quietest dreams, my most vulnerable thoughts, and the keeper of my entire future.'
    }
  ],
  theme: {
    ambientPreset: 'light_rose_quartz',
    quote: 'From Hogwarts castles to Rozhok rooftops, every battleground and every dream begins with you.',
    quoteAuthor: 'After all this time? Always & Winner Winner Chicken Dinner ♥',
  },
  security: {
    userUsername: 'always',
    userPassword: 'after all this time',
    adminPassword: 'solemnlyswear',
  }
};
