/**
 * app.js — Engine utama game ECO ADVENTURE
 * Mengelola state, navigasi antar layar, dan integrasi semua modul.
 */










// ===== GLOBAL STATE =====
let gameState = loadGameState();
let currentChallengeIndex = 0;
let classificationState = {}; // Untuk challenge drag & drop
let matchingState = {};       // Untuk challenge matching
let doubleClickGuard = false; // Cegah double click

// ===== DOM HELPERS =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const app = () => $('#app');

function createElement(tag, className, innerHTML) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (innerHTML) el.innerHTML = innerHTML;
  return el;
}

// ===== MathJax Rerender =====
function rerenderMathJax() {
  if (window.MathJax && window.MathJax.typeset) {
    try { window.MathJax.typeset(); } catch (e) { /* ignore */ }
  }
}

// ===== SAVE STATE =====
function saveState() {
  saveGameState(gameState);
}

// ===== ANTI DOUBLE CLICK =====
function guardClick(fn) {
  return function (...args) {
    if (doubleClickGuard) return;
    doubleClickGuard = true;
    setTimeout(() => { doubleClickGuard = false; }, 500);
    fn.apply(this, args);
  };
}

// ===== AUDIO BUTTON =====
function renderAudioButton() {
  let btn = $('#audio-toggle');
  if (!btn) {
    btn = createElement('button', 'audio-toggle-btn');
    btn.id = 'audio-toggle';
    btn.title = 'Suara ON/OFF';
    document.body.appendChild(btn);
  }
  btn.innerHTML = gameState.audioMuted ? '🔇' : '🔊';
  btn.onclick = () => {
    audioManager.init();
    gameState.audioMuted = audioManager.toggleMute();
    saveAudioPreference(gameState.audioMuted);
    btn.innerHTML = gameState.audioMuted ? '🔇' : '🔊';
    saveState();
  };
}

// ===== XP BAR =====
function renderXPBar() {
  let bar = $('#xp-bar');
  if (!bar) {
    bar = createElement('div', 'xp-bar-container');
    bar.id = 'xp-bar';
    document.body.appendChild(bar);
  }
  const badge = calculateBadge(gameState.xp);
  bar.innerHTML = `
    <div class="xp-info">
      <span class="xp-badge-emoji">${badge.emoji}</span>
      <span class="xp-amount">${gameState.xp} XP</span>
    </div>
  `;
  bar.style.display = (gameState.currentScreen === 'splash' || gameState.currentScreen === 'menu') ? 'none' : 'flex';
}

// ===== ADD XP =====
function addXP(amount) {
  const oldBadge = calculateBadge(gameState.xp);
  gameState.xp += amount;
  const newBadge = calculateBadge(gameState.xp);
  saveState();
  renderXPBar();

  // Animasi XP
  showXPPopup(amount);

  // Cek badge baru
  if (newBadge.id !== oldBadge.id) {
    setTimeout(() => showBadgePopup(newBadge), 800);
  }
}

function showXPPopup(amount) {
  const popup = createElement('div', 'xp-popup', `+${amount} XP`);
  document.body.appendChild(popup);
  requestAnimationFrame(() => popup.classList.add('show'));
  setTimeout(() => {
    popup.classList.remove('show');
    setTimeout(() => popup.remove(), 300);
  }, 1200);
}

function showBadgePopup(badge) {
  audioManager.playSFX('badge');
  const overlay = createElement('div', 'modal-overlay badge-modal');
  overlay.innerHTML = `
    <div class="modal-content badge-popup-content">
      <div class="badge-popup-emoji">${badge.emoji}</div>
      <h2>Badge Baru!</h2>
      <h3>${badge.name}</h3>
      <p>${badge.description}</p>
      <button class="btn btn-primary" id="badge-ok">Keren!</button>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('show'));
  overlay.querySelector('#badge-ok').onclick = () => {
    overlay.classList.remove('show');
    setTimeout(() => overlay.remove(), 300);
  };
}

// ===== NAVIGATE =====
function navigate(screen, data) {
  gameState.currentScreen = screen;
  saveState();
  renderScreen(screen, data);
  renderAudioButton();
  renderXPBar();
  window.scrollTo(0, 0);
}

// ===== SCREEN ROUTER =====
function renderScreen(screen, data) {
  switch (screen) {
    case 'splash': renderSplash(); break;
    case 'menu': renderMenu(); break;
    case 'identity': renderIdentity(); break;
    case 'character': renderCharacterSelect(); break;
    case 'objectives': renderObjectives(); break;
    case 'guide': renderGuide(); break;
    case 'developer': renderDeveloper(); break;
    case 'map': renderMainMap(); break;
    case 'material': renderMaterial(data); break;
    case 'challenge': renderChallenge(data); break;
    case 'challenge_result': renderChallengeResult(data); break;
    case 'map_unlock': renderMapUnlock(data); break;
    case 'final_mission': renderFinalMission(); break;
    case 'victory': renderVictory(); break;
    case 'reflection': renderReflection(); break;
    case 'report': renderReport(); break;
    case 'teacher': renderTeacherDashboard(); break;
    default: renderMenu();
  }
}

// ================================================================
// 1. SPLASH SCREEN
// ================================================================
function renderSplash() {
  app().innerHTML = `
    <div class="splash-screen">
      <div class="splash-bg">
        <div class="cloud cloud-1">☁️</div>
        <div class="cloud cloud-2">☁️</div>
        <div class="cloud cloud-3">⛅</div>
        <div class="sun-glow">☀️</div>
        <div class="bird bird-1">🕊️</div>
        <div class="bird bird-2">🐦</div>
        <div class="leaf leaf-1">🍃</div>
        <div class="leaf leaf-2">🌿</div>
        <div class="leaf leaf-3">🍂</div>
        <div class="water-wave">🌊</div>
      </div>
      <div class="splash-content">
        <div class="splash-icon">🌍</div>
        <h1 class="splash-title">ECO ADVENTURE</h1>
        <p class="splash-subtitle">Misi Menjaga Keseimbangan Ekosistem</p>
        <div class="splash-loader">
          <div class="splash-loader-bar"></div>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => navigate('menu'), CONFIG.game.splashDuration);
}

// ================================================================
// 2. MAIN MENU / COVER
// ================================================================
function renderMenu() {
  app().innerHTML = `
    <div class="menu-screen">
      <div class="menu-bg-scene">
        <div class="menu-mountain">⛰️</div>
        <div class="menu-tree menu-tree-1">🌳</div>
        <div class="menu-tree menu-tree-2">🌲</div>
        <div class="menu-tree menu-tree-3">🌴</div>
        <div class="menu-river">〰️💧〰️</div>
        <div class="menu-animal menu-animal-1">🦋</div>
        <div class="menu-animal menu-animal-2">🐦</div>
        <div class="menu-animal menu-animal-3">🦌</div>
        <div class="cloud cloud-1">☁️</div>
        <div class="cloud cloud-2">⛅</div>
        <div class="sun-glow">☀️</div>
      </div>
      <div class="menu-content">
        <div class="menu-logo">🌍</div>
        <h1 class="menu-title">ECO ADVENTURE</h1>
        <p class="menu-subtitle">Misi Menjaga Keseimbangan Ekosistem</p>
        <div class="menu-buttons">
          <button class="btn btn-primary btn-large btn-glow" id="btn-play">
            🎮 MULAI BERMAIN
          </button>
          ${gameState.identity ? `<button class="btn btn-secondary" id="btn-continue">▶️ Lanjutkan Permainan</button>` : ''}
          <button class="btn btn-outline" id="btn-objectives">📚 Tujuan Pembelajaran</button>
          <button class="btn btn-outline" id="btn-guide">📖 Panduan</button>
          <button class="btn btn-outline" id="btn-developer">ℹ️ Informasi Pengembang</button>
          <button class="btn btn-outline btn-small" id="btn-teacher">👩‍🏫 Dashboard Guru</button>
          <button class="btn btn-text btn-small" id="btn-reset">🔄 Mulai Baru</button>
        </div>
      </div>
    </div>
  `;

  $('#btn-play').onclick = guardClick(() => {
    audioManager.init();
    audioManager.playSFX('click');
    navigate('identity');
  });

  if ($('#btn-continue')) {
    $('#btn-continue').onclick = guardClick(() => {
      audioManager.init();
      audioManager.playSFX('click');
      navigate('map');
    });
  }

  $('#btn-objectives').onclick = guardClick(() => {
    audioManager.playSFX('click');
    navigate('objectives');
  });

  $('#btn-guide').onclick = guardClick(() => {
    audioManager.playSFX('click');
    navigate('guide');
  });

  $('#btn-developer').onclick = guardClick(() => {
    audioManager.playSFX('click');
    navigate('developer');
  });

  $('#btn-teacher').onclick = guardClick(() => {
    audioManager.playSFX('click');
    navigate('teacher');
  });

  $('#btn-reset').onclick = guardClick(() => {
    if (confirm('Yakin ingin menghapus semua progres dan mulai baru?')) {
      gameState = resetGame();
      navigate('menu');
    }
  });
}

// ================================================================
// 3. IDENTITY INPUT
// ================================================================
function renderIdentity() {
  app().innerHTML = `
    <div class="screen identity-screen">
      <div class="screen-card">
        <div class="screen-icon">🎒</div>
        <h1>SELAMAT DATANG, PENJELAJAH!</h1>
        <p class="screen-desc">Masukkan identitasmu untuk memulai petualangan.</p>
        <form id="identity-form" class="identity-form">
          <div class="form-group">
            <label for="input-name">📝 Nama Lengkap</label>
            <input type="text" id="input-name" placeholder="Masukkan nama lengkap" value="${gameState.identity?.name || ''}" required autocomplete="off" />
            <span class="form-error" id="error-name"></span>
          </div>
          <div class="form-group">
            <label for="input-kelas">🏫 Kelas</label>
            <select id="input-kelas" required>
              <option value="">— Pilih Kelas —</option>
              <option value="V-A" ${gameState.identity?.kelas === 'V-A' ? 'selected' : ''}>V-A</option>
              <option value="V-B" ${gameState.identity?.kelas === 'V-B' ? 'selected' : ''}>V-B</option>
              <option value="V-C" ${gameState.identity?.kelas === 'V-C' ? 'selected' : ''}>V-C</option>
              <option value="V-D" ${gameState.identity?.kelas === 'V-D' ? 'selected' : ''}>V-D</option>
              <option value="V" ${gameState.identity?.kelas === 'V' ? 'selected' : ''}>V</option>
            </select>
            <span class="form-error" id="error-kelas"></span>
          </div>
          <div class="form-group">
            <label for="input-absen">🔢 Nomor Absen</label>
            <input type="number" id="input-absen" placeholder="Masukkan nomor absen" min="1" max="50" value="${gameState.identity?.absen || ''}" required />
            <span class="form-error" id="error-absen"></span>
          </div>
          <button type="submit" class="btn btn-primary btn-large">LANJUTKAN ➜</button>
        </form>
        <button class="btn btn-text" id="btn-back-menu">← Kembali</button>
      </div>
    </div>
  `;

  $('#identity-form').onsubmit = (e) => {
    e.preventDefault();
    const name = $('#input-name').value.trim();
    const kelas = $('#input-kelas').value;
    const absen = $('#input-absen').value;
    let valid = true;

    // Validasi
    if (!name) { $('#error-name').textContent = 'Nama tidak boleh kosong.'; valid = false; }
    else { $('#error-name').textContent = ''; }

    if (!kelas) { $('#error-kelas').textContent = 'Pilih kelas.'; valid = false; }
    else { $('#error-kelas').textContent = ''; }

    if (!absen || absen < 1 || absen > 50) { $('#error-absen').textContent = 'Nomor absen harus antara 1-50.'; valid = false; }
    else { $('#error-absen').textContent = ''; }

    if (valid) {
      audioManager.playSFX('click');
      gameState.identity = { name, kelas, absen: parseInt(absen) };
      if (!gameState.startTime) gameState.startTime = Date.now();
      saveState();
      navigate('character');
    }
  };

  $('#btn-back-menu').onclick = guardClick(() => navigate('menu'));
}

// ================================================================
// 4. CHARACTER SELECTION
// ================================================================
function renderCharacterSelect() {
  app().innerHTML = `
    <div class="screen character-screen">
      <div class="screen-card wide-card">
        <div class="screen-icon">🦸</div>
        <h1>PILIH KARAKTERMU</h1>
        <p class="screen-desc">Pilih karakter yang akan menemanimu berpetualang!</p>
        <div class="character-grid">
          ${CHARACTERS.map(c => `
            <div class="character-card ${gameState.selectedCharacter?.id === c.id ? 'selected' : ''}"
                 data-id="${c.id}"
                 style="--accent: ${c.color}">
              <div class="character-avatar" style="background: ${c.color}20; border-color: ${c.color}">
                <span class="character-emoji">${c.emoji}</span>
              </div>
              <h3 class="character-name">${c.name}</h3>
              <p class="character-desc">${c.description}</p>
              ${gameState.selectedCharacter?.id === c.id ? '<div class="character-selected-badge">✓ Dipilih</div>' : ''}
            </div>
          `).join('')}
        </div>
        <button class="btn btn-primary btn-large ${gameState.selectedCharacter ? '' : 'btn-disabled'}" id="btn-start-adventure">
          🚀 MULAI PETUALANGAN
        </button>
        <button class="btn btn-text" id="btn-back-identity">← Kembali</button>
      </div>
    </div>
  `;

  $$('.character-card').forEach(card => {
    card.onclick = () => {
      audioManager.playSFX('click');
      const charId = card.dataset.id;
      const character = CHARACTERS.find(c => c.id === charId);
      gameState.selectedCharacter = character;
      saveState();
      // Update UI
      $$('.character-card').forEach(c => {
        c.classList.remove('selected');
        const badge = c.querySelector('.character-selected-badge');
        if (badge) badge.remove();
      });
      card.classList.add('selected');
      const badge = createElement('div', 'character-selected-badge', '✓ Dipilih');
      card.appendChild(badge);
      $('#btn-start-adventure').classList.remove('btn-disabled');
    };
  });

  $('#btn-start-adventure').onclick = guardClick(() => {
    if (!gameState.selectedCharacter) return;
    audioManager.playSFX('complete');
    navigate('map');
  });

  $('#btn-back-identity').onclick = guardClick(() => navigate('identity'));
}

// ================================================================
// 5. TUJUAN PEMBELAJARAN
// ================================================================
function renderObjectives() {
  app().innerHTML = `
    <div class="screen objectives-screen">
      <div class="screen-card">
        <div class="screen-icon">📚</div>
        <h1>TUJUAN PEMBELAJARAN</h1>
        <p class="screen-desc">Setelah menyelesaikan game ini, kamu diharapkan mampu:</p>
        <ol class="objectives-list">
          <li>
            <span class="obj-icon">🔍</span>
            <span>Mengidentifikasi komponen biotik dan abiotik.</span>
          </li>
          <li>
            <span class="obj-icon">🔗</span>
            <span>Menjelaskan hubungan komponen biotik dan abiotik.</span>
          </li>
          <li>
            <span class="obj-icon">📊</span>
            <span>Menganalisis dampak perubahan komponen biotik atau abiotik terhadap keseimbangan ekosistem.</span>
          </li>
          <li>
            <span class="obj-icon">🔮</span>
            <span>Memprediksi perubahan yang terjadi dalam suatu ekosistem.</span>
          </li>
          <li>
            <span class="obj-icon">💡</span>
            <span>Menentukan tindakan yang dapat membantu menjaga keseimbangan ekosistem.</span>
          </li>
        </ol>
        <div class="islamic-value">
          <span>🤲</span>
          <p>"Belajar menjaga alam merupakan salah satu bentuk rasa syukur kepada Allah Swt."</p>
        </div>
        <button class="btn btn-primary" id="btn-back-objectives">← Kembali</button>
      </div>
    </div>
  `;
  $('#btn-back-objectives').onclick = guardClick(() => navigate('menu'));
}

// ================================================================
// 6. PANDUAN BERMAIN
// ================================================================
function renderGuide() {
  app().innerHTML = `
    <div class="screen guide-screen">
      <div class="screen-card">
        <div class="screen-icon">📖</div>
        <h1>PANDUAN BERMAIN</h1>
        <div class="guide-steps">
          <div class="guide-step"><span class="step-num">1</span> Masukkan identitasmu (nama, kelas, nomor absen).</div>
          <div class="guide-step"><span class="step-num">2</span> Pilih karakter petualanganmu.</div>
          <div class="guide-step"><span class="step-num">3</span> Masuk ke Map 1 dan baca materi pengantar.</div>
          <div class="guide-step"><span class="step-num">4</span> Selesaikan tantangan di setiap map.</div>
          <div class="guide-step"><span class="step-num">5</span> Dapatkan XP dan badge dari setiap tantangan.</div>
          <div class="guide-step"><span class="step-num">6</span> Map berikutnya terbuka jika tantangan berhasil.</div>
          <div class="guide-step"><span class="step-num">7</span> Selesaikan semua map dan Final Mission.</div>
          <div class="guide-step"><span class="step-num">8</span> Isi refleksi dan lihat laporan hasil belajar.</div>
        </div>
        <div class="guide-legend">
          <h3>Legenda</h3>
          <div class="legend-grid">
            <div class="legend-item"><span>🔒</span> Terkunci</div>
            <div class="legend-item"><span>🔓</span> Terbuka</div>
            <div class="legend-item"><span>⭐</span> Tantangan</div>
            <div class="legend-item"><span>🏆</span> Final Mission</div>
            <div class="legend-item"><span>❤️</span> Refleksi</div>
            <div class="legend-item"><span>✅</span> Selesai</div>
          </div>
        </div>
        <button class="btn btn-primary" id="btn-back-guide">← Kembali</button>
      </div>
    </div>
  `;
  $('#btn-back-guide').onclick = guardClick(() => navigate('menu'));
}

// ================================================================
// 7. INFORMASI PENGEMBANG
// ================================================================
function renderDeveloper() {
  const dev = CONFIG.developer;
  app().innerHTML = `
    <div class="screen developer-screen">
      <div class="screen-card">
        <div class="screen-icon">ℹ️</div>
        <h1>INFORMASI PENGEMBANG</h1>
        <div class="dev-info">
          <div class="dev-row"><span class="dev-label">Nama Pengembang</span><span class="dev-value">${dev.name}</span></div>
          <div class="dev-row"><span class="dev-label">Satuan Pendidikan</span><span class="dev-value">${dev.school}</span></div>
          <div class="dev-row"><span class="dev-label">Mata Pelajaran</span><span class="dev-value">${dev.subject}</span></div>
          <div class="dev-row"><span class="dev-label">Kelas</span><span class="dev-value">${dev.grade}</span></div>
          <div class="dev-row"><span class="dev-label">Materi</span><span class="dev-value">${dev.topic}</span></div>
          <div class="dev-row"><span class="dev-label">Kurikulum</span><span class="dev-value">${dev.curriculum}</span></div>
        </div>
        <div class="dev-footer">
          <p>ECO ADVENTURE v${CONFIG.game.version}</p>
          <p>Game Edukasi IPAS Kelas V Madrasah Ibtidaiyah</p>
        </div>
        <button class="btn btn-primary" id="btn-back-dev">← Kembali</button>
      </div>
    </div>
  `;
  $('#btn-back-dev').onclick = guardClick(() => navigate('menu'));
}

// ================================================================
// 8. MAIN MAP
// ================================================================
function renderMainMap() {
  const character = gameState.selectedCharacter;
  audioManager.playMusic('explore');

  app().innerHTML = `
    <div class="screen map-screen">
      <div class="map-header">
        <div class="map-header-left">
          <span class="character-mini">${character?.emoji || '🧑'}</span>
          <span class="player-name">${gameState.identity?.name || 'Penjelajah'}</span>
        </div>
        <div class="map-header-right">
          <span class="xp-display">${calculateBadge(gameState.xp).emoji} ${gameState.xp} XP</span>
        </div>
      </div>
      <h1 class="map-title">🗺️ Peta Petualangan</h1>
      <div class="map-container">
        <div class="map-path">
          ${MAPS.map((m, i) => {
            const unlocked = gameState.unlockedMaps.includes(m.id);
            const completed = gameState.completedMaps.includes(m.id);
            const status = completed ? 'completed' : (unlocked ? 'unlocked' : 'locked');
            return `
              <div class="map-node ${status}" data-map="${m.id}" style="--accent: ${m.accentColor}">
                <div class="map-node-icon">
                  ${completed ? '✅' : (unlocked ? m.icon : '🔒')}
                </div>
                <div class="map-node-info">
                  <span class="map-node-label">MAP ${m.id}</span>
                  <span class="map-node-name">${m.name}</span>
                </div>
                ${i < MAPS.length - 1 ? '<div class="map-connector"></div>' : ''}
              </div>
            `;
          }).join('')}
          <div class="map-node ${gameState.finalMissionCompleted ? 'completed' : (gameState.completedMaps.length >= 5 ? 'unlocked' : 'locked')}" data-map="final">
            <div class="map-node-icon map-node-final">
              ${gameState.finalMissionCompleted ? '✅' : (gameState.completedMaps.length >= 5 ? '🏆' : '🔒')}
            </div>
            <div class="map-node-info">
              <span class="map-node-label">FINAL</span>
              <span class="map-node-name">Final Mission</span>
            </div>
          </div>
        </div>
      </div>
      <div class="map-footer">
        <button class="btn btn-text" id="btn-back-to-menu">← Menu Utama</button>
      </div>
    </div>
  `;

  // Event handlers for map nodes
  $$('.map-node').forEach(node => {
    node.onclick = guardClick(() => {
      const mapId = node.dataset.map;

      if (mapId === 'final') {
        if (gameState.completedMaps.length >= 5 && !gameState.finalMissionCompleted) {
          audioManager.playSFX('click');
          navigate('final_mission');
        } else if (gameState.finalMissionCompleted) {
          audioManager.playSFX('click');
          navigate('victory');
        }
        return;
      }

      const id = parseInt(mapId);
      const unlocked = gameState.unlockedMaps.includes(id);
      const completed = gameState.completedMaps.includes(id);

      if (!unlocked) {
        // Tampilkan pesan map terkunci
        showToast('🔒 Map ini masih terkunci. Selesaikan map sebelumnya terlebih dahulu!');
        return;
      }

      audioManager.playSFX('click');

      if (completed) {
        // Bisa diulang — langsung ke challenge
        navigate('material', { mapId: id });
      } else {
        // Pertama kali — ke materi dulu
        navigate('material', { mapId: id });
      }
    });
  });

  $('#btn-back-to-menu').onclick = guardClick(() => navigate('menu'));
}

function showToast(message) {
  const existing = $('.toast');
  if (existing) existing.remove();
  const toast = createElement('div', 'toast', message);
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ================================================================
// 9. MATERI PENGANTAR
// ================================================================
function renderMaterial(data) {
  const mapData = MAPS.find(m => m.id === data.mapId);
  if (!mapData) return navigate('map');

  const material = mapData.material;

  app().innerHTML = `
    <div class="screen material-screen" style="--accent: ${mapData.accentColor}">
      <div class="screen-card wide-card">
        <div class="material-header">
          <span class="material-map-badge">MAP ${mapData.id}</span>
          <span class="material-map-icon">${mapData.icon}</span>
        </div>
        <div class="awareness-box">
          <span>🧠</span>
          <p><strong>Apa yang akan kita pelajari?</strong><br>${material.awareness}</p>
        </div>
        <h1>${material.title}</h1>
        <div class="material-sections">
          ${material.sections.map(s => `
            <div class="material-card">
              <div class="material-card-header">
                <span class="material-card-icon">${s.icon}</span>
                <h3>${s.title}</h3>
              </div>
              <p>${s.content}</p>
              ${s.examples.length > 0 ? `
                <div class="material-examples">
                  ${s.examples.map(ex => `<span class="example-tag">${ex}</span>`).join('')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
        <div class="material-summary">
          <strong>📌 Ringkasan:</strong> ${material.summary}
        </div>
        <button class="btn btn-primary btn-large" id="btn-start-challenge">
          ⭐ Mulai Tantangan
        </button>
        <button class="btn btn-text" id="btn-back-map">← Kembali ke Peta</button>
      </div>
    </div>
  `;

  rerenderMathJax();

  // Catat waktu mulai map
  if (!gameState.mapTimes[data.mapId]) {
    gameState.mapTimes[data.mapId] = { start: Date.now() };
  }
  addXP(CONFIG.xp.materialRead);

  $('#btn-start-challenge').onclick = guardClick(() => {
    audioManager.playSFX('click');
    audioManager.playMusic('challenge');
    currentChallengeIndex = 0;
    navigate('challenge', { mapId: data.mapId });
  });

  $('#btn-back-map').onclick = guardClick(() => navigate('map'));
}

// ================================================================
// 10. CHALLENGE ENGINE
// ================================================================
function renderChallenge(data) {
  const mapId = data.mapId;
  const questions = QUESTIONS[`map${mapId}`];
  if (!questions || currentChallengeIndex >= questions.length) {
    // Semua pertanyaan selesai
    return finishMapChallenge(mapId);
  }

  const q = questions[currentChallengeIndex];

  switch (q.type) {
    case 'classification':
      renderClassificationChallenge(q, mapId);
      break;
    case 'matching':
      renderMatchingChallenge(q, mapId);
      break;
    case 'scenario':
      renderScenarioChallenge(q, mapId);
      break;
    case 'problem_solving':
      renderProblemSolvingChallenge(q, mapId);
      break;
    case 'simulation':
      renderSimulationChallenge(q, mapId);
      break;
    default:
      renderScenarioChallenge(q, mapId);
  }
}

// --- CLASSIFICATION CHALLENGE (Map 1) ---
function renderClassificationChallenge(q, mapId) {
  classificationState = {
    biotik: [],
    abiotik: [],
    remaining: [...q.items],
    results: {},
  };

  function render() {
    app().innerHTML = `
      <div class="screen challenge-screen">
        <div class="challenge-header">
          <span class="challenge-map-badge">MAP ${mapId} — Tantangan</span>
          <h2>🧪 ${q.instruction || 'BIO ATAU ABIOTIK?'}</h2>
        </div>
        <div class="classification-area">
          <div class="classification-items" id="items-pool">
            ${classificationState.remaining.map(item => `
              <div class="drag-item" data-id="${item.id}" draggable="true">
                <span class="drag-emoji">${item.emoji}</span>
                <span class="drag-label">${item.label}</span>
              </div>
            `).join('')}
            ${classificationState.remaining.length === 0 ? '<p class="empty-pool">Semua objek sudah dikelompokkan!</p>' : ''}
          </div>
          <div class="classification-zones">
            <div class="drop-zone drop-biotik" id="zone-biotik">
              <h3>🌱 BIOTIK</h3>
              <p class="zone-hint">Makhluk Hidup</p>
              <div class="zone-items">
                ${classificationState.biotik.map(item => `
                  <div class="placed-item ${classificationState.results[item.id] === true ? 'correct' : (classificationState.results[item.id] === false ? 'wrong' : '')}">
                    ${item.emoji} ${item.label}
                    ${classificationState.results[item.id] !== undefined ?
                      (classificationState.results[item.id] ? ' ✅' : ' ❌') : ''}
                  </div>
                `).join('')}
              </div>
            </div>
            <div class="drop-zone drop-abiotik" id="zone-abiotik">
              <h3>☀️ ABIOTIK</h3>
              <p class="zone-hint">Bukan Makhluk Hidup</p>
              <div class="zone-items">
                ${classificationState.abiotik.map(item => `
                  <div class="placed-item ${classificationState.results[item.id] === true ? 'correct' : (classificationState.results[item.id] === false ? 'wrong' : '')}">
                    ${item.emoji} ${item.label}
                    ${classificationState.results[item.id] !== undefined ?
                      (classificationState.results[item.id] ? ' ✅' : ' ❌') : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
        <div id="feedback-area"></div>
        ${classificationState.remaining.length === 0 ? `
          <button class="btn btn-primary btn-large" id="btn-next-challenge">Lanjut ➜</button>
        ` : ''}
      </div>
    `;

    // Drag & Drop + Click to classify
    setupDragDrop(q, mapId);

    if ($('#btn-next-challenge')) {
      $('#btn-next-challenge').onclick = guardClick(() => {
        currentChallengeIndex++;
        navigate('challenge', { mapId });
      });
    }
  }

  render();

  function setupDragDrop(q, mapId) {
    // Drag events
    $$('.drag-item').forEach(el => {
      el.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', el.dataset.id);
        el.classList.add('dragging');
      });
      el.addEventListener('dragend', () => el.classList.remove('dragging'));

      // Mobile: tap to select, then tap zone
      el.addEventListener('click', () => {
        $$('.drag-item').forEach(d => d.classList.remove('selected-item'));
        el.classList.add('selected-item');
      });
    });

    // Drop zones
    $$('.drop-zone').forEach(zone => {
      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('drag-over');
      });
      zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        const itemId = e.dataTransfer.getData('text/plain');
        classifyItem(itemId, zone.id === 'zone-biotik' ? 'biotik' : 'abiotik', q, mapId);
      });

      // Mobile: tap zone to place selected item
      zone.addEventListener('click', () => {
        const selected = document.querySelector('.drag-item.selected-item');
        if (selected) {
          classifyItem(selected.dataset.id, zone.id === 'zone-biotik' ? 'biotik' : 'abiotik', q, mapId);
        }
      });
    });
  }

  function classifyItem(itemId, targetZone, q, mapId) {
    const item = q.items.find(i => i.id === itemId);
    if (!item) return;
    if (classificationState.results[itemId] !== undefined) return; // Sudah dijawab

    const correct = item.category === targetZone;
    classificationState.results[itemId] = correct;
    classificationState[targetZone].push(item);
    classificationState.remaining = classificationState.remaining.filter(i => i.id !== itemId);

    // Record answer
    gameState.totalQuestions++;
    if (correct) {
      gameState.totalCorrect++;
      addXP(CONFIG.xp.correctAnswer);
      audioManager.playSFX('correct');
    } else {
      gameState.totalWrong++;
      audioManager.playSFX('wrong');
    }
    gameState.answers[`${q.id}-${itemId}`] = { answer: targetZone, correct, timestamp: Date.now() };
    saveState();

    // Show feedback
    const feedbackArea = $('#feedback-area');
    if (feedbackArea) {
      feedbackArea.innerHTML = `
        <div class="feedback ${correct ? 'feedback-correct' : 'feedback-wrong'}">
          <span>${correct ? '✅ Hebat!' : '❌ Belum tepat.'}</span>
          <p>${item.explanation}</p>
        </div>
      `;
    }

    // Re-render
    render();
  }
}

// --- MATCHING CHALLENGE (Map 2) ---
function renderMatchingChallenge(q, mapId) {
  matchingState = {
    pairs: q.pairs.map(p => ({ ...p, matched: false })),
    selectedLeft: null,
    selectedRight: null,
    matchedCount: 0,
  };

  function render() {
    const allMatched = matchingState.matchedCount >= matchingState.pairs.length;

    app().innerHTML = `
      <div class="screen challenge-screen">
        <div class="challenge-header">
          <span class="challenge-map-badge">MAP ${mapId} — Tantangan</span>
          <h2>🔗 ${q.instruction || 'PASANGKAN HUBUNGANNYA'}</h2>
        </div>
        <div class="matching-area">
          <div class="matching-column matching-left">
            <h3>Makhluk Hidup</h3>
            ${matchingState.pairs.map((p, i) => `
              <div class="match-card ${p.matched ? 'matched' : ''} ${matchingState.selectedLeft === i ? 'selected' : ''}"
                   data-side="left" data-index="${i}">
                <span>${p.left.emoji}</span> ${p.left.label}
                ${p.matched ? ' ✅' : ''}
              </div>
            `).join('')}
          </div>
          <div class="matching-column matching-right">
            <h3>Komponen Abiotik</h3>
            ${shuffleWithSeed(matchingState.pairs.map((p, i) => ({ ...p, origIndex: i })), 42).map(p => `
              <div class="match-card ${p.matched ? 'matched' : ''} ${matchingState.selectedRight === p.origIndex ? 'selected' : ''}"
                   data-side="right" data-index="${p.origIndex}">
                <span>${p.right.emoji}</span> ${p.right.label}
                ${p.matched ? ' ✅' : ''}
              </div>
            `).join('')}
          </div>
        </div>
        <div id="feedback-area"></div>
        ${allMatched ? `<button class="btn btn-primary btn-large" id="btn-next-challenge">Lanjut ➜</button>` : ''}
      </div>
    `;

    // Event handlers
    $$('.match-card').forEach(card => {
      card.onclick = () => {
        if (card.classList.contains('matched')) return;
        const side = card.dataset.side;
        const index = parseInt(card.dataset.index);

        if (side === 'left') {
          matchingState.selectedLeft = index;
          $$('.match-card[data-side="left"]').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
        } else {
          matchingState.selectedRight = index;
          $$('.match-card[data-side="right"]').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
        }

        // Check if both selected
        if (matchingState.selectedLeft !== null && matchingState.selectedRight !== null) {
          const correct = matchingState.selectedLeft === matchingState.selectedRight;
          const pair = matchingState.pairs[matchingState.selectedLeft];

          gameState.totalQuestions++;
          if (correct) {
            matchingState.pairs[matchingState.selectedLeft].matched = true;
            matchingState.matchedCount++;
            gameState.totalCorrect++;
            addXP(CONFIG.xp.correctAnswer);
            audioManager.playSFX('correct');
          } else {
            gameState.totalWrong++;
            audioManager.playSFX('wrong');
          }

          const explanation = correct ? pair.explanation : `Coba perhatikan kembali. ${pair.left.label} memiliki hubungan khusus dengan komponen abiotik yang tepat.`;
          gameState.answers[`${q.id}-${matchingState.selectedLeft}`] = {
            answer: matchingState.selectedRight,
            correct,
            timestamp: Date.now(),
          };
          saveState();

          matchingState.selectedLeft = null;
          matchingState.selectedRight = null;

          setTimeout(() => {
            render();
            const feedbackArea = $('#feedback-area');
            if (feedbackArea) {
              feedbackArea.innerHTML = `
                <div class="feedback ${correct ? 'feedback-correct' : 'feedback-wrong'}">
                  <span>${correct ? '✅ Pasangan tepat!' : '❌ Belum tepat.'}</span>
                  <p>${explanation}</p>
                </div>
              `;
            }
          }, 300);
        }
      };
    });

    if ($('#btn-next-challenge')) {
      $('#btn-next-challenge').onclick = guardClick(() => {
        currentChallengeIndex++;
        navigate('challenge', { mapId });
      });
    }
  }

  render();
}

// --- SCENARIO CHALLENGE (Map 3) ---
function renderScenarioChallenge(q, mapId) {
  let answered = false;

  app().innerHTML = `
    <div class="screen challenge-screen">
      <div class="challenge-header">
        <span class="challenge-map-badge">MAP ${mapId} — Tantangan ${currentChallengeIndex + 1}</span>
        <h2>📖 Cerita Interaktif</h2>
      </div>
      <div class="scenario-story">
        <div class="story-card">
          <p>${q.story}</p>
        </div>
      </div>
      <div class="scenario-question">
        <h3>${q.question}</h3>
        <div class="options-grid" id="options-grid">
          ${q.options.map(opt => `
            <button class="option-btn" data-id="${opt.id}" id="opt-${opt.id}">
              <span class="option-letter">${opt.id.toUpperCase()}</span>
              <span class="option-text">${opt.text}</span>
            </button>
          `).join('')}
        </div>
      </div>
      <div id="feedback-area"></div>
      <div id="next-area"></div>
    </div>
  `;

  rerenderMathJax();

  $$('.option-btn').forEach(btn => {
    btn.onclick = guardClick(() => {
      if (answered) return;
      answered = true;

      const optId = btn.dataset.id;
      const opt = q.options.find(o => o.id === optId);
      const correct = opt.correct;

      gameState.totalQuestions++;
      if (correct) {
        gameState.totalCorrect++;
        addXP(CONFIG.xp.correctAnswer);
        audioManager.playSFX('correct');
        btn.classList.add('option-correct');
      } else {
        gameState.totalWrong++;
        audioManager.playSFX('wrong');
        btn.classList.add('option-wrong');
        // Highlight correct
        const correctOpt = q.options.find(o => o.correct);
        $(`#opt-${correctOpt.id}`).classList.add('option-correct');
      }

      gameState.answers[q.id] = { answer: optId, correct, timestamp: Date.now() };
      saveState();

      // Disable all options
      $$('.option-btn').forEach(b => b.disabled = true);

      // Feedback
      $('#feedback-area').innerHTML = `
        <div class="feedback ${correct ? 'feedback-correct' : 'feedback-wrong'}">
          <span>${correct ? '✅ Hebat!' : '❌ Belum tepat.'}</span>
          <p>${opt.explanation}</p>
        </div>
      `;

      // Show chain visualization for map 3
      if (mapId === 3 && q.id === 'm3-q1') {
        $('#feedback-area').innerHTML += `
          <div class="chain-viz">
            <div class="chain-step">💧 Air berkurang</div>
            <div class="chain-arrow">↓</div>
            <div class="chain-step">🌿 Tumbuhan terdampak</div>
            <div class="chain-arrow">↓</div>
            <div class="chain-step">🐟 Hewan kehilangan sumber makanan/habitat</div>
            <div class="chain-arrow">↓</div>
            <div class="chain-step">⚠️ Keseimbangan ekosistem terganggu</div>
          </div>
        `;
      }

      $('#next-area').innerHTML = `<button class="btn btn-primary btn-large" id="btn-next-q">Lanjut ➜</button>`;
      $('#btn-next-q').onclick = guardClick(() => {
        currentChallengeIndex++;
        navigate('challenge', { mapId });
      });
    });
  });
}

// --- PROBLEM SOLVING CHALLENGE (Map 4) ---
function renderProblemSolvingChallenge(q, mapId) {
  let selectedOptions = new Set();
  let answered = false;

  app().innerHTML = `
    <div class="screen challenge-screen">
      <div class="challenge-header">
        <span class="challenge-map-badge">MAP ${mapId} — Tantangan ${currentChallengeIndex + 1}</span>
        <h2>🔧 Analisis Dampak</h2>
      </div>
      <div class="scenario-story">
        <div class="story-card">
          <p>${q.scenario}</p>
        </div>
      </div>
      <div class="scenario-question">
        <h3>${q.question}</h3>
        <div class="options-grid multi-select" id="options-grid">
          ${q.options.map(opt => `
            <button class="option-btn option-multi" data-id="${opt.id}" id="opt-${opt.id}">
              <span class="option-checkbox">☐</span>
              <span class="option-text">${opt.text}</span>
            </button>
          `).join('')}
        </div>
      </div>
      <button class="btn btn-primary" id="btn-submit-answer" style="margin-top:16px;">✔ Periksa Jawaban</button>
      <div id="feedback-area"></div>
      <div id="next-area"></div>
    </div>
  `;

  $$('.option-multi').forEach(btn => {
    btn.onclick = () => {
      if (answered) return;
      const optId = btn.dataset.id;
      if (selectedOptions.has(optId)) {
        selectedOptions.delete(optId);
        btn.classList.remove('selected');
        btn.querySelector('.option-checkbox').textContent = '☐';
      } else {
        selectedOptions.add(optId);
        btn.classList.add('selected');
        btn.querySelector('.option-checkbox').textContent = '☑';
      }
    };
  });

  $('#btn-submit-answer').onclick = guardClick(() => {
    if (answered || selectedOptions.size === 0) {
      if (selectedOptions.size === 0) showToast('Pilih minimal satu jawaban!');
      return;
    }
    answered = true;
    $('#btn-submit-answer').style.display = 'none';

    // Check each option
    let allCorrect = true;
    const correctIds = q.options.filter(o => o.correct).map(o => o.id);
    const selectedArr = Array.from(selectedOptions);

    // Check if selected = correct
    const isFullyCorrect = correctIds.length === selectedArr.length && correctIds.every(id => selectedArr.includes(id));

    q.options.forEach(opt => {
      const btn = $(`#opt-${opt.id}`);
      btn.disabled = true;
      if (opt.correct) {
        btn.classList.add('option-correct');
      }
      if (selectedOptions.has(opt.id) && !opt.correct) {
        btn.classList.add('option-wrong');
      }
    });

    gameState.totalQuestions++;
    if (isFullyCorrect) {
      gameState.totalCorrect++;
      addXP(CONFIG.xp.correctAnswer);
      audioManager.playSFX('correct');
    } else {
      gameState.totalWrong++;
      audioManager.playSFX('wrong');
    }

    gameState.answers[q.id] = { answer: selectedArr, correct: isFullyCorrect, timestamp: Date.now() };
    saveState();

    // Feedback
    let feedbackHTML = `<div class="feedback ${isFullyCorrect ? 'feedback-correct' : 'feedback-wrong'}">
      <span>${isFullyCorrect ? '✅ Sempurna!' : '❌ Belum sepenuhnya tepat.'}</span>
    </div>`;
    feedbackHTML += '<div class="explanations">';
    q.options.forEach(opt => {
      feedbackHTML += `<div class="explanation-item ${opt.correct ? 'correct' : 'wrong'}">
        <strong>${opt.correct ? '✅' : '❌'} ${opt.text}</strong>
        <p>${opt.explanation}</p>
      </div>`;
    });
    feedbackHTML += '</div>';

    $('#feedback-area').innerHTML = feedbackHTML;

    $('#next-area').innerHTML = `<button class="btn btn-primary btn-large" id="btn-next-q">Lanjut ➜</button>`;
    $('#btn-next-q').onclick = guardClick(() => {
      currentChallengeIndex++;
      navigate('challenge', { mapId });
    });
  });
}

// --- SIMULATION CHALLENGE (Map 5) ---
function renderSimulationChallenge(q, mapId) {
  let selectedPredictions = new Set();
  let answered = false;

  app().innerHTML = `
    <div class="screen challenge-screen">
      <div class="challenge-header">
        <span class="challenge-map-badge">MAP ${mapId} — Tantangan ${currentChallengeIndex + 1}</span>
        <h2>⚖️ Simulasi Ekosistem</h2>
      </div>
      ${q.setup.components.length > 0 ? `
        <div class="simulation-display">
          <h3>${q.setup.title}</h3>
          <div class="ecosystem-components">
            ${q.setup.components.map(c => `
              <div class="eco-component" data-type="${c.type}">
                <span class="eco-emoji">${c.emoji}</span>
                <span class="eco-name">${c.name}</span>
                <span class="eco-type-badge ${c.type}">${c.type === 'biotik' ? 'Biotik' : 'Abiotik'}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
      <div class="change-alert">
        <span>⚠️</span>
        <p><strong>Perubahan:</strong> ${q.change}</p>
      </div>
      <div class="scenario-question">
        <h3>${q.question}</h3>
        <div class="options-grid multi-select" id="options-grid">
          ${q.predictions.map(pred => `
            <button class="option-btn option-multi" data-id="${pred.id}" id="opt-${pred.id}">
              <span class="option-checkbox">☐</span>
              <span class="option-text">${pred.text}</span>
            </button>
          `).join('')}
        </div>
      </div>
      <button class="btn btn-primary" id="btn-confirm-prediction" style="margin-top:16px;">✔ Konfirmasi Prediksi</button>
      <div id="feedback-area"></div>
      <div id="next-area"></div>
    </div>
  `;

  $$('.option-multi').forEach(btn => {
    btn.onclick = () => {
      if (answered) return;
      const predId = btn.dataset.id;
      if (selectedPredictions.has(predId)) {
        selectedPredictions.delete(predId);
        btn.classList.remove('selected');
        btn.querySelector('.option-checkbox').textContent = '☐';
      } else {
        selectedPredictions.add(predId);
        btn.classList.add('selected');
        btn.querySelector('.option-checkbox').textContent = '☑';
      }
    };
  });

  $('#btn-confirm-prediction').onclick = guardClick(() => {
    if (answered || selectedPredictions.size === 0) {
      if (selectedPredictions.size === 0) showToast('Pilih minimal satu prediksi!');
      return;
    }
    answered = true;
    $('#btn-confirm-prediction').style.display = 'none';

    const correctIds = q.predictions.filter(p => p.correct).map(p => p.id);
    const selectedArr = Array.from(selectedPredictions);
    const isFullyCorrect = correctIds.length === selectedArr.length && correctIds.every(id => selectedArr.includes(id));

    q.predictions.forEach(pred => {
      const btn = $(`#opt-${pred.id}`);
      btn.disabled = true;
      if (pred.correct) btn.classList.add('option-correct');
      if (selectedPredictions.has(pred.id) && !pred.correct) btn.classList.add('option-wrong');
    });

    gameState.totalQuestions++;
    if (isFullyCorrect) {
      gameState.totalCorrect++;
      addXP(CONFIG.xp.correctAnswer);
      audioManager.playSFX('correct');
    } else {
      gameState.totalWrong++;
      audioManager.playSFX('wrong');
    }

    gameState.answers[q.id] = { answer: selectedArr, correct: isFullyCorrect, timestamp: Date.now() };
    saveState();

    let feedbackHTML = `<div class="feedback ${isFullyCorrect ? 'feedback-correct' : 'feedback-wrong'}">
      <span>${isFullyCorrect ? '✅ Prediksi tepat!' : '❌ Belum sepenuhnya tepat.'}</span>
    </div><div class="explanations">`;
    q.predictions.forEach(pred => {
      feedbackHTML += `<div class="explanation-item ${pred.correct ? 'correct' : 'wrong'}">
        <strong>${pred.correct ? '✅' : '❌'} ${pred.text}</strong>
        <p>${pred.explanation}</p>
      </div>`;
    });
    feedbackHTML += '</div>';
    $('#feedback-area').innerHTML = feedbackHTML;

    $('#next-area').innerHTML = `<button class="btn btn-primary btn-large" id="btn-next-q">Lanjut ➜</button>`;
    $('#btn-next-q').onclick = guardClick(() => {
      currentChallengeIndex++;
      navigate('challenge', { mapId });
    });
  });
}

// --- Finish Map Challenge ---
function finishMapChallenge(mapId) {
  // Mark map as completed
  if (!gameState.completedMaps.includes(mapId)) {
    gameState.completedMaps.push(mapId);
    addXP(CONFIG.xp.challengeComplete + CONFIG.xp.mapComplete);
  }

  // Record map end time
  if (gameState.mapTimes[mapId]) {
    gameState.mapTimes[mapId].end = Date.now();
  }

  // Unlock next map
  const nextMapId = mapId + 1;
  if (nextMapId <= 5 && !gameState.unlockedMaps.includes(nextMapId)) {
    gameState.unlockedMaps.push(nextMapId);
    saveState();
    audioManager.playSFX('unlock');
    navigate('map_unlock', { mapId: nextMapId });
  } else {
    saveState();
    navigate('challenge_result', { mapId });
  }
}

// ================================================================
// 11. CHALLENGE RESULT
// ================================================================
function renderChallengeResult(data) {
  const mapData = MAPS.find(m => m.id === data.mapId);
  audioManager.playSFX('complete');
  audioManager.playMusic('explore');

  app().innerHTML = `
    <div class="screen result-screen">
      <div class="screen-card">
        <div class="result-icon">🎉</div>
        <h1>Tantangan Selesai!</h1>
        <h2>${mapData ? mapData.name : `Map ${data.mapId}`}</h2>
        <div class="result-stats">
          <div class="stat-card">
            <span class="stat-value">${gameState.xp}</span>
            <span class="stat-label">Total XP</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">${calculateAccuracy(gameState.totalCorrect, gameState.totalQuestions)}%</span>
            <span class="stat-label">Akurasi</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">${calculateBadge(gameState.xp).emoji}</span>
            <span class="stat-label">${calculateBadge(gameState.xp).name}</span>
          </div>
        </div>
        <button class="btn btn-primary btn-large" id="btn-back-to-map">🗺️ Kembali ke Peta</button>
      </div>
    </div>
  `;

  $('#btn-back-to-map').onclick = guardClick(() => navigate('map'));
}

// ================================================================
// 12. MAP UNLOCK
// ================================================================
function renderMapUnlock(data) {
  const mapData = MAPS.find(m => m.id === data.mapId);

  app().innerHTML = `
    <div class="screen unlock-screen">
      <div class="screen-card">
        <div class="unlock-animation">
          <div class="unlock-lock">🔒</div>
          <div class="unlock-sparkle">✨</div>
          <div class="unlock-open">🔓</div>
        </div>
        <h1>Map Baru Terbuka!</h1>
        <div class="unlock-map-info" style="--accent: ${mapData?.accentColor || '#4CAF50'}">
          <span class="unlock-icon">${mapData?.icon || '🗺️'}</span>
          <h2>MAP ${data.mapId}</h2>
          <h3>${mapData?.name || ''}</h3>
          <p>${mapData?.description || ''}</p>
        </div>
        <button class="btn btn-primary btn-large" id="btn-go-map">🗺️ Lihat Peta</button>
      </div>
    </div>
  `;

  audioManager.playSFX('unlock');

  $('#btn-go-map').onclick = guardClick(() => navigate('map'));
}

// ================================================================
// 13. FINAL MISSION
// ================================================================
function renderFinalMission() {
  audioManager.playMusic('final');
  let currentQ = 0;
  const questions = QUESTIONS.finalMission;
  let timeLeft = CONFIG.game.finalMissionTimer;
  let timerInterval = null;
  let finished = false;

  function renderQuestion() {
    if (currentQ >= questions.length || finished) {
      clearInterval(timerInterval);
      finishFinalMission();
      return;
    }

    const q = questions[currentQ];
    let answered = false;

    app().innerHTML = `
      <div class="screen challenge-screen final-mission-screen">
        <div class="final-header">
          <div class="final-title">🏆 FINAL MISSION — Selamatkan Ekosistem!</div>
          <div class="final-timer" id="final-timer">
            <span class="timer-icon">⏱️</span>
            <span class="timer-value" id="timer-value">${timeLeft}</span>
            <span class="timer-label">detik</span>
          </div>
          <div class="final-progress">Soal ${currentQ + 1} / ${questions.length}</div>
        </div>
        <div class="scenario-question">
          <h3>${q.question}</h3>
          <div class="options-grid" id="options-grid">
            ${q.options.map(opt => `
              <button class="option-btn" data-id="${opt.id}" id="opt-${opt.id}">
                <span class="option-letter">${opt.id.toUpperCase()}</span>
                <span class="option-text">${opt.text}</span>
              </button>
            `).join('')}
          </div>
        </div>
        <div id="feedback-area"></div>
        <div id="next-area"></div>
      </div>
    `;

    rerenderMathJax();

    $$('.option-btn').forEach(btn => {
      btn.onclick = guardClick(() => {
        if (answered) return;
        answered = true;

        const optId = btn.dataset.id;
        const opt = q.options.find(o => o.id === optId);
        const correct = opt.correct;

        gameState.totalQuestions++;
        if (correct) {
          gameState.totalCorrect++;
          addXP(CONFIG.xp.correctAnswer);
          audioManager.playSFX('correct');
          btn.classList.add('option-correct');
        } else {
          gameState.totalWrong++;
          audioManager.playSFX('wrong');
          btn.classList.add('option-wrong');
          const correctOpt = q.options.find(o => o.correct);
          $(`#opt-${correctOpt.id}`).classList.add('option-correct');
        }

        gameState.answers[q.id] = {
          answer: optId,
          correct,
          competency: q.competency,
          timestamp: Date.now(),
        };
        saveState();

        $$('.option-btn').forEach(b => b.disabled = true);

        $('#feedback-area').innerHTML = `
          <div class="feedback ${correct ? 'feedback-correct' : 'feedback-wrong'}">
            <span>${correct ? '✅ Benar!' : '❌ Belum tepat.'}</span>
            <p>${opt.explanation}</p>
          </div>
        `;

        $('#next-area').innerHTML = `<button class="btn btn-primary" id="btn-next-final">Soal Berikutnya ➜</button>`;
        $('#btn-next-final').onclick = guardClick(() => {
          currentQ++;
          renderQuestion();
        });
      });
    });
  }

  // Start timer
  timerInterval = setInterval(() => {
    timeLeft--;
    const timerEl = $('#timer-value');
    if (timerEl) {
      timerEl.textContent = timeLeft;
      if (timeLeft <= 10) {
        timerEl.classList.add('timer-warning');
        audioManager.playSFX('countdown');
      }
    }
    if (timeLeft <= 0) {
      finished = true;
      clearInterval(timerInterval);
      finishFinalMission();
    }
  }, 1000);

  renderQuestion();

  function finishFinalMission() {
    clearInterval(timerInterval);
    gameState.finalMissionCompleted = true;
    gameState.endTime = Date.now();
    addXP(CONFIG.xp.finalMission);
    saveStudentToTeacherData(gameState);
    saveState();
    audioManager.playSFX('complete');
    navigate('victory');
  }
}

// ================================================================
// 14. VICTORY SCREEN
// ================================================================
function renderVictory() {
  audioManager.playMusic('victory');
  const accuracy = calculateAccuracy(gameState.totalCorrect, gameState.totalQuestions);
  const badge = calculateBadge(gameState.xp);
  const playTime = formatPlayTime(gameState.startTime, gameState.endTime);

  app().innerHTML = `
    <div class="screen victory-screen">
      <div class="screen-card">
        <div class="victory-confetti">🎉🎊✨🌟⭐</div>
        <div class="victory-icon">🏆</div>
        <h1>SELAMAT!</h1>
        <h2>ANDA TELAH MENYELESAIKAN TANTANGAN</h2>
        <p class="victory-message">"Ekosistem berhasil diselamatkan!"</p>
        <div class="victory-stats">
          <div class="stat-card"><span class="stat-value">${gameState.xp}</span><span class="stat-label">Total XP</span></div>
          <div class="stat-card"><span class="stat-value">${badge.emoji}</span><span class="stat-label">${badge.name}</span></div>
          <div class="stat-card"><span class="stat-value">${gameState.completedMaps.length + 1}</span><span class="stat-label">Map Selesai</span></div>
          <div class="stat-card"><span class="stat-value">${accuracy}%</span><span class="stat-label">Akurasi</span></div>
          <div class="stat-card"><span class="stat-value">${playTime}</span><span class="stat-label">Waktu</span></div>
        </div>
        <div class="victory-badges">
          ${getEarnedBadges(gameState.xp).map(b => `
            <div class="earned-badge">
              <span>${b.emoji}</span>
              <span>${b.name}</span>
            </div>
          `).join('')}
        </div>
        <button class="btn btn-primary btn-large" id="btn-to-reflection">❤️ Lanjut ke Refleksi</button>
      </div>
    </div>
  `;

  $('#btn-to-reflection').onclick = guardClick(() => navigate('reflection'));
}

// ================================================================
// 15. REFLECTION
// ================================================================
function renderReflection() {
  app().innerHTML = `
    <div class="screen reflection-screen">
      <div class="screen-card wide-card">
        <div class="screen-icon">💭</div>
        <h1>REFLEKSI PEMBELAJARAN</h1>
        <p class="screen-desc">Renungkan apa yang telah kamu pelajari hari ini.</p>
        <form id="reflection-form" class="reflection-form">
          <div class="reflection-question">
            <label>1. Apa hal baru yang saya pelajari?</label>
            <textarea id="ref-q1" rows="3" placeholder="Tuliskan di sini..."></textarea>
          </div>
          <div class="reflection-question">
            <label>2. Apa hubungan komponen biotik dan abiotik?</label>
            <textarea id="ref-q2" rows="3" placeholder="Tuliskan di sini..."></textarea>
          </div>
          <div class="reflection-question">
            <label>3. Apa yang terjadi jika salah satu komponen berubah?</label>
            <textarea id="ref-q3" rows="3" placeholder="Tuliskan di sini..."></textarea>
          </div>
          <div class="reflection-question">
            <label>4. Bagaimana cara saya menjaga lingkungan?</label>
            <textarea id="ref-q4" rows="3" placeholder="Tuliskan di sini..."></textarea>
          </div>
          <div class="reflection-question">
            <label>5. Apa tindakan nyata yang dapat saya lakukan di sekolah?</label>
            <textarea id="ref-q5" rows="3" placeholder="Tuliskan di sini..."></textarea>
          </div>
          <div class="reflection-question">
            <label>Bagaimana tingkat pemahamanmu?</label>
            <div class="emoji-select" id="emoji-select">
              <button type="button" class="emoji-btn" data-value="Saya sangat memahami">😊<br><small>Sangat memahami</small></button>
              <button type="button" class="emoji-btn" data-value="Saya cukup memahami">🙂<br><small>Cukup memahami</small></button>
              <button type="button" class="emoji-btn" data-value="Saya masih perlu belajar">😐<br><small>Perlu belajar</small></button>
              <button type="button" class="emoji-btn" data-value="Saya membutuhkan bantuan">😟<br><small>Butuh bantuan</small></button>
            </div>
          </div>
          <button type="submit" class="btn btn-primary btn-large">📊 Lihat Laporan</button>
        </form>
      </div>
    </div>
  `;

  let selectedUnderstanding = '';

  $$('.emoji-btn').forEach(btn => {
    btn.onclick = () => {
      $$('.emoji-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedUnderstanding = btn.dataset.value;
    };
  });

  $('#reflection-form').onsubmit = (e) => {
    e.preventDefault();
    audioManager.playSFX('click');

    gameState.reflection = {
      understanding: selectedUnderstanding,
      answers: {
        'Hal baru yang dipelajari': $('#ref-q1').value,
        'Hubungan biotik dan abiotik': $('#ref-q2').value,
        'Dampak perubahan komponen': $('#ref-q3').value,
        'Cara menjaga lingkungan': $('#ref-q4').value,
        'Tindakan nyata di sekolah': $('#ref-q5').value,
      },
    };

    saveStudentToTeacherData(gameState);
    saveState();
    navigate('report');
  };
}

// ================================================================
// 16. LEARNING REPORT
// ================================================================
function renderReport() {
  const report = generateReportData(gameState);

  app().innerHTML = `
    <div class="screen report-screen">
      <div class="screen-card wide-card">
        <div class="screen-icon">📊</div>
        <h1>LAPORAN HASIL PETUALANGAN</h1>

        <div class="report-grid">
          <div class="report-item"><span class="report-label">Nama</span><span class="report-value">${report.identity?.name || '-'}</span></div>
          <div class="report-item"><span class="report-label">Kelas</span><span class="report-value">${report.identity?.kelas || '-'}</span></div>
          <div class="report-item"><span class="report-label">No. Absen</span><span class="report-value">${report.identity?.absen || '-'}</span></div>
          <div class="report-item"><span class="report-label">Karakter</span><span class="report-value">${report.character?.emoji || ''} ${report.character?.name || '-'}</span></div>
          <div class="report-item"><span class="report-label">Tanggal</span><span class="report-value">${report.date}</span></div>
          <div class="report-item"><span class="report-label">Waktu Bermain</span><span class="report-value">${report.playTime}</span></div>
          <div class="report-item highlight"><span class="report-label">Total XP</span><span class="report-value">${report.xp} XP</span></div>
          <div class="report-item highlight">
            <span class="report-label">Akurasi</span>
            <span class="report-value">$\\frac{${report.totalCorrect}}{${report.totalQuestions}} \\times 100\\% = ${report.accuracy}\\%$</span>
          </div>
        </div>

        <h2>🏆 Badge</h2>
        <div class="report-badges">
          ${report.badges.map(b => `<div class="report-badge"><span>${b.emoji}</span><span>${b.name}</span></div>`).join('')}
        </div>

        <h2>📊 Kemampuan per Kompetensi</h2>
        <div class="competency-table">
          <div class="comp-row comp-header">
            <span>Kompetensi</span><span>Hasil</span><span>Kategori</span>
          </div>
          ${Object.values(report.competencies).map(c => {
            const acc = c.total > 0 ? Math.round((c.correct / c.total) * 100) : 0;
            const cat = getCategory(acc);
            return `
              <div class="comp-row">
                <span>${c.label}</span>
                <span>${c.correct}/${c.total}</span>
                <span class="comp-category" style="background:${cat.color}">${cat.emoji} ${cat.label}</span>
              </div>
            `;
          }).join('')}
        </div>

        <div class="report-category-final">
          <h3>Kategori Akhir</h3>
          <div class="final-category" style="background:${report.category.color}">
            ${report.category.emoji} ${report.category.label}
          </div>
        </div>

        <div class="islamic-value">
          <span>🤲</span>
          <p>"Alam merupakan ciptaan Allah Swt. yang harus kita syukuri dan jaga."</p>
        </div>

        <h2>📥 Export Laporan</h2>
        <div class="export-buttons">
          <button class="btn btn-outline" id="btn-download-html">📄 Download Laporan (HTML)</button>
          <button class="btn btn-outline" id="btn-download-csv">📊 Export CSV</button>
          <button class="btn btn-outline" id="btn-download-json">💾 Export JSON</button>
        </div>

        <div class="report-actions">
          <button class="btn btn-primary" id="btn-back-menu-report">🏠 Menu Utama</button>
          <button class="btn btn-secondary" id="btn-play-again">🔄 Main Lagi</button>
        </div>
      </div>
    </div>
  `;

  rerenderMathJax();

  $('#btn-download-html').onclick = guardClick(() => downloadHTMLReport(gameState));
  $('#btn-download-csv').onclick = guardClick(() => downloadCSV(gameState));
  $('#btn-download-json').onclick = guardClick(() => downloadJSON(gameState));
  $('#btn-back-menu-report').onclick = guardClick(() => navigate('menu'));
  $('#btn-play-again').onclick = guardClick(() => {
    if (confirm('Yakin ingin bermain ulang? Progres akan direset.')) {
      gameState = resetGame();
      navigate('menu');
    }
  });
}

// ================================================================
// 17. TEACHER DASHBOARD
// ================================================================
function renderTeacherDashboard() {
  const teacherData = loadTeacherData();
  const students = teacherData.students || [];

  const totalStudents = students.length;
  const completedStudents = students.filter(s => s.finalMissionCompleted).length;
  const avgXP = totalStudents > 0 ? Math.round(students.reduce((a, s) => a + (s.xp || 0), 0) / totalStudents) : 0;
  const avgAccuracy = totalStudents > 0 ? Math.round(students.reduce((a, s) => {
    return a + calculateAccuracy(s.totalCorrect || 0, s.totalQuestions || 0);
  }, 0) / totalStudents) : 0;

  app().innerHTML = `
    <div class="screen teacher-screen">
      <div class="screen-card wide-card">
        <div class="screen-icon">👩‍🏫</div>
        <h1>DASHBOARD GURU</h1>

        <div class="teacher-stats">
          <div class="stat-card"><span class="stat-value">${totalStudents}</span><span class="stat-label">Total Murid</span></div>
          <div class="stat-card"><span class="stat-value">${completedStudents}</span><span class="stat-label">Selesai</span></div>
          <div class="stat-card"><span class="stat-value">${totalStudents - completedStudents}</span><span class="stat-label">Belum Selesai</span></div>
          <div class="stat-card"><span class="stat-value">${avgXP}</span><span class="stat-label">Rata-rata XP</span></div>
          <div class="stat-card"><span class="stat-value">${avgAccuracy}%</span><span class="stat-label">Rata-rata Akurasi</span></div>
        </div>

        ${students.length > 0 ? `
          <h2>📋 Data Murid</h2>
          <div class="teacher-table-wrapper">
            <table class="teacher-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Kelas</th>
                  <th>Absen</th>
                  <th>XP</th>
                  <th>Akurasi</th>
                  <th>Map</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${students.map((s, i) => `
                  <tr>
                    <td>${i + 1}</td>
                    <td>${s.identity?.name || '-'}</td>
                    <td>${s.identity?.kelas || '-'}</td>
                    <td>${s.identity?.absen || '-'}</td>
                    <td>${s.xp || 0}</td>
                    <td>${calculateAccuracy(s.totalCorrect || 0, s.totalQuestions || 0)}%</td>
                    <td>${(s.completedMaps || []).length}/5</td>
                    <td>${s.finalMissionCompleted ? '✅ Selesai' : '⏳ Berlangsung'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="export-buttons">
            <button class="btn btn-outline" id="btn-export-all-csv">📊 Export Semua (CSV)</button>
          </div>
        ` : '<p class="empty-message">Belum ada data murid. Data akan muncul setelah murid menyelesaikan Final Mission atau refleksi.</p>'}

        <button class="btn btn-primary" id="btn-back-teacher">← Kembali</button>
      </div>
    </div>
  `;

  if ($('#btn-export-all-csv')) {
    $('#btn-export-all-csv').onclick = guardClick(() => {
      let csv = 'No,Nama,Kelas,Absen,XP,Akurasi (%),Map Selesai,Final Mission,Waktu Bermain\n';
      students.forEach((s, i) => {
        const acc = calculateAccuracy(s.totalCorrect || 0, s.totalQuestions || 0);
        const time = formatPlayTime(s.startTime, s.endTime);
        csv += `${i + 1},"${s.identity?.name || ''}","${s.identity?.kelas || ''}","${s.identity?.absen || ''}",${s.xp || 0},${acc},${(s.completedMaps || []).length},"${s.finalMissionCompleted ? 'Ya' : 'Belum'}","${time}"\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'EcoAdventure_Data_Semua_Murid.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  $('#btn-back-teacher').onclick = guardClick(() => navigate('menu'));
}

// ===== UTILITY FUNCTIONS =====
function shuffleWithSeed(array, seed) {
  const arr = [...array];
  let s = seed;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 16807) % 2147483647;
    const j = s % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ===== INITIALIZE =====
function initApp() {
  // Load audio preference
  gameState.audioMuted = loadAudioPreference();
  audioManager.setMuted(gameState.audioMuted);

  // Start at appropriate screen
  if (gameState.currentScreen === 'splash') {
    navigate('splash');
  } else {
    navigate(gameState.currentScreen || 'menu');
  }
}
