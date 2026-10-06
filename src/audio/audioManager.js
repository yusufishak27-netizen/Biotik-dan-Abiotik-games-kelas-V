/**
 * audioManager.js — Modul pengelolaan audio game
 * Mengelola musik latar dan efek suara.
 * Audio menggunakan Web Audio API dan HTML5 Audio.
 *
 * Semua audio file bersifat opsional — game tetap berjalan tanpa file audio.
 * Ganti path file audio di bawah dengan aset audio yang tersedia.
 */



class AudioManager {
  constructor() {
    this.muted = CONFIG.audio.defaultMuted;
    this.musicVolume = CONFIG.audio.musicVolume;
    this.sfxVolume = CONFIG.audio.sfxVolume;
    this.currentMusic = null;
    this.audioContext = null;
    this.initialized = false;
  }

  /**
   * Inisialisasi AudioContext (harus dipanggil setelah interaksi user)
   */
  init() {
    if (this.initialized) return;
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API tidak tersedia:', e);
    }
  }

  /**
   * Toggle mute
   */
  toggleMute() {
    this.muted = !this.muted;
    if (this.currentMusic) {
      this.currentMusic.volume = this.muted ? 0 : this.musicVolume;
    }
    return this.muted;
  }

  /**
   * Set muted state
   */
  setMuted(muted) {
    this.muted = muted;
    if (this.currentMusic) {
      this.currentMusic.volume = this.muted ? 0 : this.musicVolume;
    }
  }

  /**
   * Mainkan musik latar
   * @param {string} type - Tipe musik: 'explore', 'challenge', 'final', 'victory'
   */
  playMusic(type) {
    // Hentikan musik sebelumnya
    this.stopMusic();

    // Path musik — ganti dengan file audio yang tersedia
    const musicPaths = {
      explore: 'assets/audio/music/explore.mp3',
      challenge: 'assets/audio/music/challenge.mp3',
      final: 'assets/audio/music/final.mp3',
      victory: 'assets/audio/music/victory.mp3',
    };

    const path = musicPaths[type];
    if (!path) return;

    try {
      const audio = new Audio(path);
      audio.loop = true;
      audio.volume = this.muted ? 0 : this.musicVolume;
      audio.play().catch(() => {
        // Audio autoplay dibatasi browser — abaikan error
      });
      this.currentMusic = audio;
    } catch (e) {
      // File audio tidak tersedia — abaikan
    }
  }

  /**
   * Hentikan musik
   */
  stopMusic() {
    if (this.currentMusic) {
      this.currentMusic.pause();
      this.currentMusic.currentTime = 0;
      this.currentMusic = null;
    }
  }

  /**
   * Mainkan efek suara
   * @param {string} type - Tipe SFX: 'correct', 'wrong', 'click', 'unlock', 'badge', 'complete', 'countdown'
   */
  playSFX(type) {
    if (this.muted) return;

    // Gunakan Web Audio API untuk SFX sederhana (tanpa file)
    this.init();
    if (!this.audioContext) return;

    const ctx = this.audioContext;

    try {
      switch (type) {
        case 'correct':
          this._playTone(ctx, [523.25, 659.25, 783.99], 0.15, 'sine');
          break;
        case 'wrong':
          this._playTone(ctx, [311.13, 277.18], 0.2, 'sawtooth');
          break;
        case 'click':
          this._playTone(ctx, [800], 0.05, 'sine');
          break;
        case 'unlock':
          this._playTone(ctx, [392, 523.25, 659.25, 783.99], 0.15, 'sine');
          break;
        case 'badge':
          this._playTone(ctx, [523.25, 659.25, 783.99, 1046.5], 0.2, 'sine');
          break;
        case 'complete':
          this._playTone(ctx, [523.25, 587.33, 659.25, 783.99, 1046.5], 0.15, 'sine');
          break;
        case 'countdown':
          this._playTone(ctx, [440], 0.08, 'square');
          break;
        default:
          this._playTone(ctx, [600], 0.05, 'sine');
      }
    } catch (e) {
      // Abaikan error audio
    }
  }

  /**
   * Mainkan nada sederhana menggunakan Web Audio API
   */
  _playTone(ctx, frequencies, duration, waveType) {
    const now = ctx.currentTime;
    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = waveType;
      oscillator.frequency.setValueAtTime(freq, now + i * duration);

      gainNode.gain.setValueAtTime(this.sfxVolume * 0.3, now + i * duration);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + (i + 1) * duration);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(now + i * duration);
      oscillator.stop(now + (i + 1) * duration + 0.1);
    });
  }
}

// Singleton instance
const audioManager = new AudioManager();
