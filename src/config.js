/**
 * config.js — Konfigurasi utama game ECO ADVENTURE
 * Ubah nilai di sini untuk menyesuaikan game.
 */

const CONFIG = {
  // === INFORMASI PENGEMBANG ===
  developer: {
    name: '[ISI NAMA PENGEMBANG]', // Ganti dengan nama pengembang
    school: 'MIN 1 Gorontalo Utara',
    subject: 'IPAS',
    grade: 'V',
    topic: 'Hubungan Komponen Biotik dan Abiotik',
    curriculum: 'Kurikulum Merdeka / Kurikulum Berbasis Cinta',
  },

  // === PENGATURAN GAME ===
  game: {
    title: 'ECO ADVENTURE',
    subtitle: 'Misi Menjaga Keseimbangan Ekosistem',
    splashDuration: 4000, // ms
    finalMissionTimer: 90, // detik
    version: '1.0.0',
  },

  // === XP REWARDS ===
  xp: {
    materialRead: 10,
    correctAnswer: 10,
    challengeComplete: 25,
    mapComplete: 50,
    finalMission: 100,
  },

  // === AUDIO VOLUMES ===
  audio: {
    musicVolume: 0.3,
    sfxVolume: 0.5,
    defaultMuted: false,
  },

  // === LOCAL STORAGE KEYS ===
  storageKeys: {
    gameState: 'eco_adventure_state',
    identity: 'eco_adventure_identity',
    progress: 'eco_adventure_progress',
    audioPreference: 'eco_adventure_audio',
  },
};
