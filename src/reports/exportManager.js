/**
 * exportManager.js — Modul export laporan
 * Menyediakan export CSV, JSON, dan HTML/PDF
 */



/**
 * Generate laporan sebagai objek data
 */
function generateReportData(state) {
  const accuracy = calculateAccuracy(state.totalCorrect, state.totalQuestions);
  const category = getCategory(accuracy);
  const competencies = calculateCompetencyScores(state.answers);
  const badges = getEarnedBadges(state.xp);
  const playTime = formatPlayTime(state.startTime, state.endTime);

  return {
    identity: state.identity,
    character: state.selectedCharacter,
    date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
    xp: state.xp,
    accuracy,
    category,
    playTime,
    completedMaps: state.completedMaps,
    badges,
    totalCorrect: state.totalCorrect,
    totalWrong: state.totalWrong,
    totalQuestions: state.totalQuestions,
    competencies,
    reflection: state.reflection,
    finalMissionCompleted: state.finalMissionCompleted,
  };
}

/**
 * Export ke CSV
 */
function exportCSV(state) {
  const report = generateReportData(state);

  // Header
  let csv = 'Nama,Kelas,No Absen,Karakter,Tanggal,Total XP,Akurasi (%),Kategori,Waktu Bermain,Map Selesai,Badge,Jawaban Benar,Jawaban Salah,Total Soal,Final Mission\n';

  // Data row
  csv += `"${report.identity?.name || ''}","${report.identity?.kelas || ''}","${report.identity?.absen || ''}",`;
  csv += `"${report.character?.name || ''}","${report.date}",`;
  csv += `${report.xp},${report.accuracy},"${report.category.label}",`;
  csv += `"${report.playTime}","${report.completedMaps.join(', ')}",`;
  csv += `"${report.badges.map(b => b.name).join(', ')}",`;
  csv += `${report.totalCorrect},${report.totalWrong},${report.totalQuestions},`;
  csv += `"${report.finalMissionCompleted ? 'Ya' : 'Belum'}"`;

  // Kompetensi
  csv += '\n\nKompetensi,Benar,Total,Akurasi (%),Kategori\n';
  Object.values(report.competencies).forEach(comp => {
    const acc = comp.total > 0 ? Math.round((comp.correct / comp.total) * 100) : 0;
    const cat = getCategory(acc);
    csv += `"${comp.label}",${comp.correct},${comp.total},${acc},"${cat.label}"\n`;
  });

  // Refleksi
  if (report.reflection) {
    csv += '\nRefleksi\n';
    csv += `"Pemahaman","${report.reflection.understanding || ''}"\n`;
    if (report.reflection.answers) {
      Object.entries(report.reflection.answers).forEach(([q, a]) => {
        csv += `"${q}","${a}"\n`;
      });
    }
  }

  return csv;
}

/**
 * Export ke JSON
 */
function exportJSON(state) {
  return JSON.stringify(generateReportData(state), null, 2);
}

/**
 * Trigger download file
 */
function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Download CSV
 */
function downloadCSV(state) {
  const csv = exportCSV(state);
  const name = state.identity?.name?.replace(/\s+/g, '_') || 'murid';
  downloadFile(csv, `Laporan_EcoAdventure_${name}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Download JSON
 */
function downloadJSON(state) {
  const json = exportJSON(state);
  const name = state.identity?.name?.replace(/\s+/g, '_') || 'murid';
  downloadFile(json, `Laporan_EcoAdventure_${name}.json`, 'application/json');
}

/**
 * Generate dan download laporan HTML (dapat dicetak sebagai PDF)
 */
function downloadHTMLReport(state) {
  const report = generateReportData(state);

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Laporan Eco Adventure - ${report.identity?.name || 'Murid'}</title>
<style>
  body { font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #333; }
  h1 { color: #2E7D32; text-align: center; border-bottom: 3px solid #4CAF50; padding-bottom: 10px; }
  h2 { color: #1B5E20; margin-top: 30px; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 15px 0; }
  .info-item { background: #F1F8E9; padding: 12px; border-radius: 8px; }
  .info-label { font-size: 12px; color: #666; text-transform: uppercase; }
  .info-value { font-size: 18px; font-weight: bold; color: #2E7D32; }
  table { width: 100%; border-collapse: collapse; margin: 15px 0; }
  th { background: #4CAF50; color: white; padding: 10px; text-align: left; }
  td { padding: 10px; border-bottom: 1px solid #E0E0E0; }
  tr:nth-child(even) { background: #F5F5F5; }
  .badge { display: inline-block; background: #FFF3E0; padding: 5px 12px; border-radius: 20px; margin: 3px; font-size: 14px; }
  .category { display: inline-block; padding: 4px 12px; border-radius: 12px; color: white; font-weight: bold; }
  .footer { text-align: center; margin-top: 40px; color: #999; font-size: 12px; border-top: 1px solid #E0E0E0; padding-top: 10px; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
<h1>🌿 LAPORAN HASIL PETUALANGAN<br>ECO ADVENTURE</h1>

<div class="info-grid">
  <div class="info-item"><div class="info-label">Nama</div><div class="info-value">${report.identity?.name || '-'}</div></div>
  <div class="info-item"><div class="info-label">Kelas</div><div class="info-value">${report.identity?.kelas || '-'}</div></div>
  <div class="info-item"><div class="info-label">No. Absen</div><div class="info-value">${report.identity?.absen || '-'}</div></div>
  <div class="info-item"><div class="info-label">Karakter</div><div class="info-value">${report.character?.emoji || ''} ${report.character?.name || '-'}</div></div>
  <div class="info-item"><div class="info-label">Tanggal</div><div class="info-value">${report.date}</div></div>
  <div class="info-item"><div class="info-label">Waktu Bermain</div><div class="info-value">${report.playTime}</div></div>
  <div class="info-item"><div class="info-label">Total XP</div><div class="info-value">${report.xp} XP</div></div>
  <div class="info-item"><div class="info-label">Akurasi</div><div class="info-value">${report.accuracy}%</div></div>
</div>

<h2>🏆 Badge</h2>
<div>${report.badges.map(b => `<span class="badge">${b.emoji} ${b.name}</span>`).join(' ')}</div>

<h2>📊 Hasil per Kompetensi</h2>
<table>
  <tr><th>Kompetensi</th><th>Benar</th><th>Total</th><th>Akurasi</th><th>Kategori</th></tr>
  ${Object.values(report.competencies).map(c => {
    const acc = c.total > 0 ? Math.round((c.correct / c.total) * 100) : 0;
    const cat = getCategory(acc);
    return `<tr><td>${c.label}</td><td>${c.correct}</td><td>${c.total}</td><td>${acc}%</td><td><span class="category" style="background:${cat.color}">${cat.label}</span></td></tr>`;
  }).join('')}
</table>

<h2>📝 Ringkasan</h2>
<table>
  <tr><td>Jawaban Benar</td><td><strong>${report.totalCorrect}</strong></td></tr>
  <tr><td>Jawaban Salah</td><td><strong>${report.totalWrong}</strong></td></tr>
  <tr><td>Total Soal</td><td><strong>${report.totalQuestions}</strong></td></tr>
  <tr><td>Map Selesai</td><td><strong>${report.completedMaps.length} / 5</strong></td></tr>
  <tr><td>Final Mission</td><td><strong>${report.finalMissionCompleted ? '✅ Selesai' : '❌ Belum'}</strong></td></tr>
  <tr><td>Kategori Akhir</td><td><span class="category" style="background:${report.category.color}">${report.category.emoji} ${report.category.label}</span></td></tr>
</table>

${report.reflection ? `
<h2>💭 Refleksi</h2>
<table>
  ${report.reflection.understanding ? `<tr><td>Tingkat Pemahaman</td><td>${report.reflection.understanding}</td></tr>` : ''}
  ${report.reflection.answers ? Object.entries(report.reflection.answers).map(([q, a]) => `<tr><td>${q}</td><td>${a}</td></tr>`).join('') : ''}
</table>
` : ''}

<div class="footer">
  <p>ECO ADVENTURE — Misi Menjaga Keseimbangan Ekosistem</p>
  <p>IPAS Kelas V | MIN 1 Gorontalo Utara</p>
</div>
</body>
</html>`;

  const name = report.identity?.name?.replace(/\s+/g, '_') || 'murid';
  downloadFile(html, `Laporan_EcoAdventure_${name}.html`, 'text/html');
}
