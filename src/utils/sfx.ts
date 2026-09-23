// Web Audio API procedural sound effects synthesizer
// Zero external assets required, lightweight and fully responsive.

export type SfxName =
  | 'whoosh'
  | 'pop'
  | 'flip'
  | 'typewriter'
  | 'paper-slide'
  | 'seal-break'
  | 'click'
  | 'camera-shutter'
  | 'vinyl-scratch';

class SfxManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private volume = 0.8; // Master SFX volume multiplier

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  // Create temporary white noise buffer
  private createNoiseBuffer(duration: number): AudioBuffer | null {
    const ctx = this.getContext();
    if (!ctx) return null;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  public play(name: SfxName) {
    try {
      const ctx = this.getContext();
      if (!ctx || !this.masterGain) return;
      const now = ctx.currentTime;

      switch (name) {
        case 'typewriter': {
          // Crisp, mechanical key tick
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(2200, now);
          filter.Q.setValueAtTime(3.5, now);

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(800 + Math.random() * 300, now);
          osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);

          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

          // Add a tiny noise burst for mechanical click texture
          const noiseBuffer = this.createNoiseBuffer(0.02);
          if (noiseBuffer) {
            const noise = ctx.createBufferSource();
            noise.buffer = noiseBuffer;
            const noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(0.18, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
            noise.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(this.masterGain);
            noise.start(now);
          }

          osc.connect(gain);
          gain.connect(this.masterGain);
          osc.start(now);
          osc.stop(now + 0.045);
          break;
        }

        case 'paper-slide': {
          // Smooth friction sweep of paper gliding
          const duration = 0.45;
          const noiseBuffer = this.createNoiseBuffer(duration);
          if (!noiseBuffer) return;

          const noise = ctx.createBufferSource();
          noise.buffer = noiseBuffer;

          const filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(450, now);
          filter.frequency.exponentialRampToValueAtTime(1400, now + duration * 0.6);
          filter.frequency.exponentialRampToValueAtTime(350, now + duration);
          filter.Q.setValueAtTime(2.0, now);

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.3, now + 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

          noise.connect(filter);
          filter.connect(gain);
          gain.connect(this.masterGain);

          noise.start(now);
          noise.stop(now + duration);
          break;
        }

        case 'seal-break': {
          // Crisp snap/burst of wax seal breaking + low resonant thump
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(900, now);
          osc.frequency.exponentialRampToValueAtTime(90, now + 0.22);

          oscGain.gain.setValueAtTime(0.38, now);
          oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

          osc.connect(oscGain);
          oscGain.connect(this.masterGain);
          osc.start(now);
          osc.stop(now + 0.25);

          // Crunchy crackle burst
          const noiseBuffer = this.createNoiseBuffer(0.12);
          if (noiseBuffer) {
            const noise = ctx.createBufferSource();
            noise.buffer = noiseBuffer;
            const filter = ctx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.setValueAtTime(1800, now);
            const noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(0.35, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

            noise.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(this.masterGain);
            noise.start(now);
          }
          break;
        }

        case 'whoosh': {
          // Smooth air whoosh for scroll reveals
          const duration = 0.32;
          const noiseBuffer = this.createNoiseBuffer(duration);
          if (!noiseBuffer) return;

          const noise = ctx.createBufferSource();
          noise.buffer = noiseBuffer;

          const filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(250, now);
          filter.frequency.exponentialRampToValueAtTime(1600, now + duration * 0.45);
          filter.frequency.exponentialRampToValueAtTime(180, now + duration);
          filter.Q.setValueAtTime(1.8, now);

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.28, now + 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

          noise.connect(filter);
          filter.connect(gain);
          gain.connect(this.masterGain);

          noise.start(now);
          noise.stop(now + duration);
          break;
        }

        case 'pop': {
          // Cheerful bubbly pop sound (confetti, finish counters)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(680, now);
          osc.frequency.exponentialRampToValueAtTime(180, now + 0.14);

          gain.gain.setValueAtTime(0.35, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

          osc.connect(gain);
          gain.connect(this.masterGain);
          osc.start(now);
          osc.stop(now + 0.15);
          break;
        }

        case 'flip': {
          // Card flip sound (short snap + resonant woosh)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(550, now);
          osc.frequency.exponentialRampToValueAtTime(220, now + 0.12);

          gain.gain.setValueAtTime(0.28, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

          osc.connect(gain);
          gain.connect(this.masterGain);
          osc.start(now);
          osc.stop(now + 0.13);

          // Subtle friction rustle
          const noiseBuffer = this.createNoiseBuffer(0.08);
          if (noiseBuffer) {
            const noise = ctx.createBufferSource();
            noise.buffer = noiseBuffer;
            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(900, now);
            const noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(0.18, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

            noise.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(this.masterGain);
            noise.start(now);
          }
          break;
        }

        case 'click': {
          // Precise clean UI click
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(1400, now);
          osc.frequency.exponentialRampToValueAtTime(300, now + 0.035);

          gain.gain.setValueAtTime(0.24, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

          osc.connect(gain);
          gain.connect(this.masterGain);
          osc.start(now);
          osc.stop(now + 0.04);
          break;
        }

        case 'camera-shutter': {
          // Two-stage retro camera shutter sound
          // Click 1: Mirror slap
          const osc1 = ctx.createOscillator();
          const gain1 = ctx.createGain();
          osc1.type = 'triangle';
          osc1.frequency.setValueAtTime(950, now);
          osc1.frequency.exponentialRampToValueAtTime(180, now + 0.04);
          gain1.gain.setValueAtTime(0.3, now);
          gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          osc1.connect(gain1);
          gain1.connect(this.masterGain);
          osc1.start(now);
          osc1.stop(now + 0.045);

          // Click 2: Shutter curtain (delay 65ms)
          const t2 = now + 0.065;
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(1200, t2);
          osc2.frequency.exponentialRampToValueAtTime(240, t2 + 0.05);
          gain2.gain.setValueAtTime(0.28, t2);
          gain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.05);
          osc2.connect(gain2);
          gain2.connect(this.masterGain);
          osc2.start(t2);
          osc2.stop(t2 + 0.055);
          break;
        }

        case 'vinyl-scratch': {
          // Stylus landing on vinyl groove
          const duration = 0.28;
          const noiseBuffer = this.createNoiseBuffer(duration);
          if (!noiseBuffer) return;

          const noise = ctx.createBufferSource();
          noise.buffer = noiseBuffer;

          const filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(1800, now);
          filter.frequency.exponentialRampToValueAtTime(450, now + duration);
          filter.Q.setValueAtTime(3.0, now);

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.22, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

          noise.connect(filter);
          filter.connect(gain);
          gain.connect(this.masterGain);

          noise.start(now);
          noise.stop(now + duration);
          break;
        }
      }
    } catch {
      // AudioContext could be blocked by browser policy prior to interaction
    }
  }
}

export const sfx = new SfxManager();
