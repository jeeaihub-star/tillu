// Procedural Web Audio API Lo-Fi Music Engine
// Ultra-peaceful, automatic random progression with soft electric piano & rain warmth

class LofiAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private vinylGain: GainNode | null = null;
  private rainGain: GainNode | null = null;
  private timerId: number | null = null;
  private volume: number = 0.22; // Very gentle background volume
  private lastChordIdx: number = -1;
  private listeners: Array<(playing: boolean) => void> = [];

  // Heavenly, velvety jazz lo-fi chords (frequencies in Hz)
  private chords = [
    // 0: Fmaj7 (Warm & peaceful)
    {
      bass: 87.31, // F2
      notes: [174.61, 220.0, 261.63, 329.63], // F3, A3, C4, E4
      melody: [440.0, 523.25, 392.0],
    },
    // 1: Am9 (Tender & reflective)
    {
      bass: 110.0, // A2
      notes: [196.0, 261.63, 329.63, 493.88], // G3, C4, E4, B4
      melody: [659.25, 587.33, 493.88],
    },
    // 2: Dm9 (Dreamy & soft)
    {
      bass: 73.42, // D2
      notes: [174.61, 220.0, 261.63, 329.63], // F3, A3, C4, E4
      melody: [440.0, 392.0, 349.23],
    },
    // 3: Bbmaj7 (Comforting resolution)
    {
      bass: 58.27, // Bb1
      notes: [174.61, 233.08, 293.66, 349.23], // F3, Bb3, D4, F4
      melody: [523.25, 440.0, 392.0],
    },
    // 4: Ebmaj7 (Floating in clouds)
    {
      bass: 77.78, // Eb2
      notes: [155.56, 196.0, 233.08, 293.66], // Eb3, G3, Bb3, D4
      melody: [392.0, 466.16, 349.23],
    },
    // 5: Gm7 (Gentle nostalgia)
    {
      bass: 98.0, // G2
      notes: [174.61, 220.0, 261.63, 349.23], // F3, A3, C4, F4
      melody: [392.0, 440.0, 329.63],
    },
    // 6: C13sus (Warm tea sip)
    {
      bass: 65.41, // C2
      notes: [174.61, 220.0, 261.63, 329.63], // F3, A3, C4, E4
      melody: [523.25, 440.0, 329.63],
    },
    // 7: Dbmaj7 (Velvet night sky)
    {
      bass: 69.3, // Db2
      notes: [138.59, 174.61, 207.65, 261.63], // Db3, F3, Ab3, C4
      melody: [349.23, 415.3, 523.25],
    },
  ];

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public subscribe(fn: (playing: boolean) => void) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.isPlaying));
  }

  // Soft vinyl warmth
  private startVinylNoise() {
    if (!this.ctx || !this.masterGain) return;

    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        const crackle = Math.random() > 0.999 ? (Math.random() - 0.5) * 0.15 : 0;
        output[i] = (b0 + b1 + b2) * 0.015 + crackle;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
      filter.Q.setValueAtTime(0.7, this.ctx.currentTime);

      this.vinylGain = this.ctx.createGain();
      this.vinylGain.gain.setValueAtTime(0.025, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(this.vinylGain);
      this.vinylGain.connect(this.masterGain);

      whiteNoise.start();
    } catch {
      // Audio fallback
    }
  }

  // Soothing rain drizzle texture
  private startRainNoise() {
    if (!this.ctx || !this.masterGain) return;

    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.04;
      }

      const rainSource = this.ctx.createBufferSource();
      rainSource.buffer = noiseBuffer;
      rainSource.loop = true;

      const lowpass = this.ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(650, this.ctx.currentTime);

      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.setValueAtTime(0.02, this.ctx.currentTime);

      rainSource.connect(lowpass);
      lowpass.connect(this.rainGain);
      this.rainGain.connect(this.masterGain);

      rainSource.start();
    } catch {
      // Audio fallback
    }
  }

  // Velvety Rhodes Piano Chord
  private playVelvetyChord(chord: { bass: number; notes: number[]; melody: number[] }) {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;

    const now = this.ctx.currentTime;
    const duration = 3.6;

    // 1. Deep round acoustic sub-bass
    const bassOsc = this.ctx.createOscillator();
    const bassGain = this.ctx.createGain();
    const bassFilter = this.ctx.createBiquadFilter();

    bassOsc.type = 'sine';
    bassOsc.frequency.setValueAtTime(chord.bass, now);

    bassFilter.type = 'lowpass';
    bassFilter.frequency.setValueAtTime(160, now);

    bassGain.gain.setValueAtTime(0.18, now);
    bassGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    bassOsc.connect(bassFilter);
    bassFilter.connect(bassGain);
    bassGain.connect(this.masterGain);

    bassOsc.start(now);
    bassOsc.stop(now + duration);

    // 2. Warm Electric Piano Notes
    chord.notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;

      const strumOffset = idx * 0.04; // organic thumb strum
      const noteTime = now + strumOffset;

      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Pure triangle with heavy low-pass gives iconic warm lofi piano tone
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      // Lowpass cutoff at 550Hz eliminates digital brightness
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(550, noteTime);
      filter.Q.setValueAtTime(0.8, noteTime);

      // Slow envelope
      noteGain.gain.setValueAtTime(0.001, noteTime);
      noteGain.gain.linearRampToValueAtTime(0.065, noteTime + 0.08);
      noteGain.gain.exponentialRampToValueAtTime(0.001, noteTime + duration - strumOffset);

      osc.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(this.masterGain);

      osc.start(noteTime);
      osc.stop(noteTime + duration);
    });

    // 3. Soft pentatonic bell accent
    if (Math.random() > 0.3) {
      const melodyFreq = chord.melody[Math.floor(Math.random() * chord.melody.length)];
      const melodyTime = now + 1.4;

      const bellOsc = this.ctx.createOscillator();
      const bellGain = this.ctx.createGain();
      const bellFilter = this.ctx.createBiquadFilter();

      bellOsc.type = 'sine';
      bellOsc.frequency.setValueAtTime(melodyFreq, melodyTime);

      bellFilter.type = 'lowpass';
      bellFilter.frequency.setValueAtTime(800, melodyTime);

      bellGain.gain.setValueAtTime(0.001, melodyTime);
      bellGain.gain.linearRampToValueAtTime(0.035, melodyTime + 0.06);
      bellGain.gain.exponentialRampToValueAtTime(0.001, melodyTime + 1.8);

      bellOsc.connect(bellFilter);
      bellFilter.connect(bellGain);
      bellGain.connect(this.masterGain);

      bellOsc.start(melodyTime);
      bellOsc.stop(melodyTime + 1.9);
    }
  }

  // Automatic Smooth Random Progression
  private scheduleNextLoop() {
    if (!this.isPlaying) return;

    // Pick a smooth harmonic chord (avoid repeating exact same chord)
    let nextIdx = Math.floor(Math.random() * this.chords.length);
    if (nextIdx === this.lastChordIdx) {
      nextIdx = (nextIdx + 1) % this.chords.length;
    }
    this.lastChordIdx = nextIdx;

    const chord = this.chords[nextIdx];
    this.playVelvetyChord(chord);

    // Dynamic duration between 3.5s and 4.0s
    const nextInterval = 3500 + Math.random() * 500;
    this.timerId = window.setTimeout(() => {
      this.scheduleNextLoop();
    }, nextInterval);
  }

  public play() {
    this.initCtx();
    if (!this.ctx) return;

    if (this.isPlaying) return;
    this.isPlaying = true;

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    this.startVinylNoise();
    this.startRainNoise();

    this.scheduleNextLoop();
    this.notify();
  }

  public pause() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.masterGain && this.ctx) {
      try {
        this.masterGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
        setTimeout(() => {
          this.masterGain?.disconnect();
          this.masterGain = null;
        }, 350);
      } catch {
        this.masterGain = null;
      }
    }
    this.notify();
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
    return this.isPlaying;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const lofiMusic = new LofiAudioEngine();
