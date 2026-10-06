/**
 * storage.js — Modul penyimpanan data menggunakan localStorage
 * Mengelola state game, identitas, progres, dan preferensi audio.
 */



const KEYS = CONFIG.storageKeys;

/**
 * Simpan data ke localStorage
 */
function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.warn('Gagal menyimpan data:', e);
    return false;
  }
}

/**
 * Ambil data dari localStorage
 */
function loadData(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('Gagal memuat data:', e);
    return null;
  }
}

/**
 * Hapus data dari localStorage
 */
function removeData(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn('Gagal menghapus data:', e);
  }
}

/**
 * State game default
 */
function getDefaultGameState() {
  return {
    currentScreen: 'splash',
    identity: null,
    selectedCharacter: null,
    unlockedMaps: [1], // Map 1 terbuka secara default
    completedMaps: [],
    currentMap: null,
    xp: 0,
    answers: {},        // { questionId: { answer, correct, timestamp } }
    totalCorrect: 0,
    totalWrong: 0,
    totalQuestions: 0,
    badges: [],
    startTime: null,
    endTime: null,
    mapTimes: {},       // { mapId: { start, end } }
    reflection: null,
    finalMissionCompleted: false,
    audioMuted: CONFIG.audio.defaultMuted,
  };
}

/**
 * Simpan state game
 */
function saveGameState(state) {
  return saveData(KEYS.gameState, state);
}

/**
 * Muat state game
 */
function loadGameState() {
  return loadData(KEYS.gameState) || getDefaultGameState();
}

/**
 * Reset game (untuk mulai baru)
 */
function resetGame() {
  removeData(KEYS.gameState);
  return getDefaultGameState();
}

/**
 * Simpan preferensi audio
 */
function saveAudioPreference(muted) {
  saveData(KEYS.audioPreference, { muted });
}

/**
 * Muat preferensi audio
 */
function loadAudioPreference() {
  const data = loadData(KEYS.audioPreference);
  return data ? data.muted : CONFIG.audio.defaultMuted;
}

// ===== TEACHER DASHBOARD DATA =====

const TEACHER_KEY = 'eco_adventure_teacher_data';

/**
 * Simpan data murid ke kumpulan data guru
 */
function saveStudentToTeacherData(studentState) {
  const teacherData = loadData(TEACHER_KEY) || { students: [] };
  // Cek apakah murid sudah ada (berdasarkan nama + kelas + absen)
  const existingIndex = teacherData.students.findIndex(
    s => s.identity?.name === studentState.identity?.name &&
         s.identity?.kelas === studentState.identity?.kelas &&
         s.identity?.absen === studentState.identity?.absen
  );
  if (existingIndex >= 0) {
    teacherData.students[existingIndex] = studentState;
  } else {
    teacherData.students.push(studentState);
  }
  saveData(TEACHER_KEY, teacherData);
}

/**
 * Muat semua data murid untuk dashboard guru
 */
function loadTeacherData() {
  return loadData(TEACHER_KEY) || { students: [] };
}
