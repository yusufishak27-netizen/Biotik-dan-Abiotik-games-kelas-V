/**
 * scoring.js — Sistem penilaian, XP, dan badge
 */




/**
 * Hitung badge berdasarkan XP
 */
function calculateBadge(xp) {
  let currentBadge = BADGES[0];
  for (const badge of BADGES) {
    if (xp >= badge.minXP) {
      currentBadge = badge;
    }
  }
  return currentBadge;
}

/**
 * Hitung semua badge yang telah diperoleh
 */
function getEarnedBadges(xp) {
  return BADGES.filter(b => xp >= b.minXP);
}

/**
 * Hitung akurasi
 */
function calculateAccuracy(correct, total) {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

/**
 * Tentukan kategori kemampuan
 */
function getCategory(accuracy) {
  if (accuracy >= 90) return { label: 'Sangat Baik', color: '#4CAF50', emoji: '⭐' };
  if (accuracy >= 75) return { label: 'Baik', color: '#8BC34A', emoji: '👍' };
  if (accuracy >= 60) return { label: 'Cukup', color: '#FF9800', emoji: '📖' };
  return { label: 'Perlu Penguatan', color: '#F44336', emoji: '💪' };
}

/**
 * Hitung waktu bermain dalam format yang mudah dibaca
 */
function formatPlayTime(startTime, endTime) {
  if (!startTime) return '0 menit';
  const end = endTime || Date.now();
  const diffMs = end - startTime;
  const diffMins = Math.floor(diffMs / 60000);
  const diffSecs = Math.floor((diffMs % 60000) / 1000);
  if (diffMins === 0) return `${diffSecs} detik`;
  return `${diffMins} menit ${diffSecs} detik`;
}

/**
 * Hitung skor per kompetensi untuk laporan
 */
function calculateCompetencyScores(answers) {
  const competencies = {
    identify_biotic: { correct: 0, total: 0, label: 'Mengidentifikasi biotik' },
    identify_abiotic: { correct: 0, total: 0, label: 'Mengidentifikasi abiotik' },
    explain_relationship: { correct: 0, total: 0, label: 'Menjelaskan hubungan' },
    analyze_impact: { correct: 0, total: 0, label: 'Menganalisis dampak' },
    predict_change: { correct: 0, total: 0, label: 'Memprediksi perubahan' },
    find_solution: { correct: 0, total: 0, label: 'Menentukan solusi' },
  };

  // Map pertanyaan ke kompetensi berdasarkan map
  Object.entries(answers).forEach(([qId, data]) => {
    if (qId.startsWith('m1')) {
      competencies.identify_biotic.total++;
      competencies.identify_abiotic.total++;
      if (data.correct) {
        competencies.identify_biotic.correct++;
        competencies.identify_abiotic.correct++;
      }
    } else if (qId.startsWith('m2')) {
      competencies.explain_relationship.total++;
      if (data.correct) competencies.explain_relationship.correct++;
    } else if (qId.startsWith('m3')) {
      competencies.analyze_impact.total++;
      if (data.correct) competencies.analyze_impact.correct++;
    } else if (qId.startsWith('m4')) {
      competencies.find_solution.total++;
      if (data.correct) competencies.find_solution.correct++;
    } else if (qId.startsWith('m5')) {
      competencies.predict_change.total++;
      if (data.correct) competencies.predict_change.correct++;
    } else if (qId.startsWith('fm')) {
      // Final mission — berdasarkan competency field di data soal
      if (data.competency) {
        const comp = competencies[data.competency];
        if (comp) {
          comp.total++;
          if (data.correct) comp.correct++;
        }
      }
    }
  });

  return competencies;
}
