/**
 * Web Audio API synthesizer for enchanted Celesta / Music Box melodies
 * Generates an ethereal, romantic, nostalgic Harry Potter-esque lullaby.
 */

class MagicAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timerId: number | null = null;
  private volume: number = 0.25;

  // Notes sequence: romantic, magical waltz in B minor / D major with bell-like intervals
  // Frequency helper
  private note(name: string): number {
    const notes: Record<string, number> = {
      'B3': 246.94, 'C#4': 277.18, 'D4': 293.66, 'E4': 329.63, 'F#4': 369.99,
      'G4': 392.00, 'A4': 440.00, 'B4': 493.88, 'C#5': 554.37, 'D5': 587.33,
      'E5': 659.25, 'F#5': 739.99, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
      'C#6': 1108.73, 'D6': 1174.66, 'REST': 0
    };
    return notes[name] || 440;
  }

  // Melodic phrase resembling a delicate enchanted celesta theme
  private melody: Array<{ note: string; dur: number; delay: number }> = [
    { note: 'B4', dur: 0.6, delay: 0 },
    { note: 'E5', dur: 0.8, delay: 0.7 },
    { note: 'G5', dur: 0.5, delay: 1.6 },
    { note: 'F#5', dur: 0.9, delay: 2.2 },
    { note: 'E5', dur: 0.6, delay: 3.2 },
    { note: 'B5', dur: 0.9, delay: 3.9 },
    { note: 'A5', dur: 1.4, delay: 5.0 },
    { note: 'F#5', dur: 1.2, delay: 6.6 },
    { note: 'E5', dur: 0.8, delay: 8.0 },
    { note: 'G5', dur: 0.5, delay: 8.9 },
    { note: 'F#5', dur: 0.8, delay: 9.5 },
    { note: 'D#4', dur: 0.9, delay: 10.4 },
    { note: 'F4', dur: 0.8, delay: 11.5 },
    { note: 'B3', dur: 1.6, delay: 12.5 },
    // Romantic continuation
    { note: 'B4', dur: 0.6, delay: 14.5 },
    { note: 'E5', dur: 0.8, delay: 15.2 },
    { note: 'G5', dur: 0.5, delay: 16.1 },
    { note: 'F#5', dur: 0.8, delay: 16.7 },
    { note: 'E5', dur: 0.6, delay: 17.6 },
    { note: 'B5', dur: 0.8, delay: 18.3 },
    { note: 'D6', dur: 1.1, delay: 19.3 },
    { note: 'C#6', dur: 0.9, delay: 20.6 },
    { note: 'C6', dur: 1.2, delay: 21.7 },
    { note: 'G#5', dur: 0.8, delay: 23.1 },
    { note: 'C6', dur: 0.8, delay: 24.0 },
    { note: 'B5', dur: 0.8, delay: 24.9 },
    { note: 'Bb5', dur: 0.8, delay: 25.8 },
    { note: 'B4', dur: 1.0, delay: 26.8 },
    { note: 'G5', dur: 1.2, delay: 28.0 },
    { note: 'E5', dur: 2.2, delay: 29.4 },
  ];

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a single bell/celesta note
  public playCelestaNote(freq: number, startTime: number, duration: number) {
    if (!this.ctx || freq <= 0) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(freq, startTime);
    osc2.frequency.setValueAtTime(freq * 2.002, startTime); // harmonic overtone

    // Celesta envelope: instant chime attack, long shimmering decay
    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.exponentialRampToValueAtTime(this.volume * 0.4, startTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, startTime + duration + 1.2);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration + 1.3);
    osc2.stop(startTime + duration + 1.3);
  }

  // Play sparkle sound effect for wand / snitch catch
  public playSparkleSound() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const arpeggio = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
    arpeggio.forEach((f, idx) => {
      this.playCelestaNote(f, now + idx * 0.06, 0.4);
    });
  }

  public playSnitchCatchSound() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const fanfare = [440, 554.37, 659.25, 880, 1108.73];
    fanfare.forEach((f, idx) => {
      this.playCelestaNote(f, now + idx * 0.08, 0.6);
    });
  }

  // Play gentle, adorable Hedwig owl double-hoot (Hoo... hooo!)
  public playOwlHootSound() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const playHoot = (startTime: number, duration: number, startFreq: number, peakFreq: number, endFreq: number) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      // Pitch curve for natural soft owl vocalization
      osc.frequency.setValueAtTime(startFreq, startTime);
      osc.frequency.exponentialRampToValueAtTime(peakFreq, startTime + duration * 0.35);
      osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration);

      // Lowpass warmth
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, startTime);

      // Smooth attack and soft breathy release
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(this.volume * 0.38, startTime + duration * 0.25);
      gain.gain.exponentialRampToValueAtTime(0.00001, startTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    };

    // First hoot: brief soft "Hoo"
    playHoot(now, 0.22, 540, 620, 520);
    // Second hoot: warm lingering "Hoooo"
    playHoot(now + 0.28, 0.42, 510, 600, 480);

    // Subtle magical bell chime accompany
    this.playCelestaNote(1046.5, now + 0.35, 0.5);
  }

  // Play grand magical celebration fanfare
  public playCelebrationFanfare() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const chimeArpeggio = [440, 554.37, 659.25, 880, 1108.73, 1318.51, 1760, 2217.46];
    chimeArpeggio.forEach((f, idx) => {
      this.playCelestaNote(f, now + idx * 0.055, 0.55);
    });

    // Warm bass root harmonic
    this.playCelestaNote(220, now + 0.1, 1.2);
    this.playCelestaNote(329.63, now + 0.15, 1.1);
  }

  // Play BGMI Pink Flare Gun launch & skyburst sound
  public playFlareGunSound() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // 1. Rocket flare whistle rising into the sky
    const whistleOsc = this.ctx.createOscillator();
    const whistleGain = this.ctx.createGain();
    whistleOsc.type = 'sawtooth';
    whistleOsc.frequency.setValueAtTime(320, now);
    whistleOsc.frequency.exponentialRampToValueAtTime(1480, now + 0.55);

    whistleGain.gain.setValueAtTime(0.0001, now);
    whistleGain.gain.exponentialRampToValueAtTime(this.volume * 0.35, now + 0.1);
    whistleGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.56);

    whistleOsc.connect(whistleGain);
    whistleGain.connect(this.ctx.destination);
    whistleOsc.start(now);
    whistleOsc.stop(now + 0.58);

    // 2. Flare skyburst pop
    const burstTime = now + 0.55;
    const popOsc = this.ctx.createOscillator();
    const popGain = this.ctx.createGain();
    popOsc.type = 'triangle';
    popOsc.frequency.setValueAtTime(260, burstTime);
    popOsc.frequency.exponentialRampToValueAtTime(70, burstTime + 0.3);

    popGain.gain.setValueAtTime(this.volume * 0.5, burstTime);
    popGain.gain.exponentialRampToValueAtTime(0.0001, burstTime + 0.4);

    popOsc.connect(popGain);
    popGain.connect(this.ctx.destination);
    popOsc.start(burstTime);
    popOsc.stop(burstTime + 0.42);

    // 3. Romantic victory duo fanfare arpeggio
    const fanfareTime = burstTime + 0.15;
    const notes = [587.33, 739.99, 880, 1174.66]; // D5, F#5, A5, D6
    notes.forEach((freq, idx) => {
      this.playCelestaNote(freq, fanfareTime + idx * 0.08, 0.6);
    });
  }

  public startMelodyLoop() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;

    const loopDurationMs = 33000;

    const schedulePhrase = () => {
      if (!this.isPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;
      this.melody.forEach((item) => {
        const freq = this.note(item.note);
        this.playCelestaNote(freq, now + item.delay, item.dur);
      });

      this.timerId = window.setTimeout(() => {
        if (this.isPlaying) {
          schedulePhrase();
        }
      }, loopDurationMs);
    };

    schedulePhrase();
  }

  public stopMelodyLoop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const magicAudio = new MagicAudioEngine();
