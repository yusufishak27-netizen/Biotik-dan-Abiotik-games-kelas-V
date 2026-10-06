/**
 * questions.js — Bank soal untuk setiap Map dan Final Mission
 * Soal disimpan terpisah agar mudah ditambah/diedit tanpa mengubah engine game.
 *
 * Tipe soal:
 * - classification : drag & drop klasifikasi (biotik/abiotik)
 * - matching       : pasangkan hubungan
 * - scenario       : pilihan ganda berbasis cerita
 * - problem_solving: analisis dampak (bisa multi-select)
 * - simulation     : prediksi dampak perubahan
 * - final          : gabungan semua kompetensi
 */

const QUESTIONS = {
  // ===== MAP 1: GERBANG EKOSISTEM — Klasifikasi =====
  map1: [
    {
      id: 'm1-q1',
      map: 1,
      type: 'classification',
      instruction: 'Seret setiap objek ke kelompok yang benar: BIOTIK atau ABIOTIK.',
      items: [
        { id: 'pohon', label: 'Pohon', emoji: '🌳', category: 'biotik', explanation: 'Pohon adalah makhluk hidup yang dapat tumbuh dan berkembang biak.' },
        { id: 'ikan', label: 'Ikan', emoji: '🐟', category: 'biotik', explanation: 'Ikan adalah makhluk hidup yang bernapas, makan, dan berkembang biak.' },
        { id: 'air', label: 'Air', emoji: '💧', category: 'abiotik', explanation: 'Air bukan makhluk hidup, tetapi sangat penting bagi kehidupan.' },
        { id: 'matahari', label: 'Matahari', emoji: '☀️', category: 'abiotik', explanation: 'Matahari adalah sumber energi utama, tetapi bukan makhluk hidup.' },
        { id: 'batu', label: 'Batu', emoji: '🪨', category: 'abiotik', explanation: 'Batu bukan makhluk hidup karena tidak bernapas, makan, atau berkembang biak.' },
        { id: 'kupu', label: 'Kupu-kupu', emoji: '🦋', category: 'biotik', explanation: 'Kupu-kupu adalah serangga yang merupakan makhluk hidup.' },
        { id: 'tanah', label: 'Tanah', emoji: '🟤', category: 'abiotik', explanation: 'Tanah adalah komponen abiotik yang menjadi tempat tumbuh tanaman.' },
        { id: 'burung', label: 'Burung', emoji: '🐦', category: 'biotik', explanation: 'Burung adalah makhluk hidup yang bernapas, makan, dan dapat terbang.' },
      ],
      xp: 10,
    },
  ],

  // ===== MAP 2: HUTAN KEHIDUPAN — Pasangkan Hubungan =====
  map2: [
    {
      id: 'm2-q1',
      map: 2,
      type: 'matching',
      instruction: 'Pasangkan setiap makhluk hidup dengan komponen abiotik yang paling dibutuhkannya.',
      pairs: [
        {
          left: { id: 'pohon', label: 'Pohon', emoji: '🌳' },
          right: { id: 'cahaya', label: 'Cahaya Matahari', emoji: '☀️' },
          explanation: 'Pohon membutuhkan cahaya matahari untuk proses fotosintesis.',
        },
        {
          left: { id: 'ikan', label: 'Ikan', emoji: '🐟' },
          right: { id: 'air', label: 'Air', emoji: '💧' },
          explanation: 'Ikan hidup di dalam air dan membutuhkan air untuk bernapas melalui insang.',
        },
        {
          left: { id: 'tumbuhan', label: 'Tumbuhan', emoji: '🌱' },
          right: { id: 'tanah', label: 'Tanah', emoji: '🟤' },
          explanation: 'Tumbuhan membutuhkan tanah sebagai tempat tumbuh dan sumber nutrisi.',
        },
        {
          left: { id: 'burung', label: 'Burung', emoji: '🐦' },
          right: { id: 'udara', label: 'Udara', emoji: '💨' },
          explanation: 'Burung membutuhkan udara untuk bernapas dan terbang.',
        },
      ],
      xp: 10,
    },
  ],

  // ===== MAP 3: SUNGAI YANG BERUBAH — Cerita Interaktif =====
  map3: [
    {
      id: 'm3-q1',
      map: 3,
      type: 'scenario',
      story: 'Sungai di dekat hutan mengalami kekeringan selama berminggu-minggu. Air semakin sedikit. Beberapa tumbuhan di sekitar sungai mulai layu.',
      question: 'Apa yang mungkin terjadi pada ikan di sungai jika air berkurang drastis?',
      options: [
        { id: 'a', text: 'Ikan semakin banyak', correct: false, explanation: 'Jika air berkurang, ruang hidup ikan semakin sempit sehingga ikan tidak akan bertambah banyak.' },
        { id: 'b', text: 'Ikan kesulitan hidup', correct: true, explanation: 'Benar! Ikan membutuhkan air untuk hidup. Jika air berkurang, ikan akan kesulitan bernapas dan mencari makanan.' },
        { id: 'c', text: 'Tumbuhan tumbuh lebih cepat', correct: false, explanation: 'Tumbuhan juga membutuhkan air. Jika air berkurang, tumbuhan justru akan layu.' },
        { id: 'd', text: 'Ekosistem tidak berubah', correct: false, explanation: 'Air merupakan komponen abiotik yang sangat penting. Perubahannya pasti memengaruhi ekosistem.' },
      ],
      xp: 10,
    },
    {
      id: 'm3-q2',
      map: 3,
      type: 'scenario',
      story: 'Karena kekeringan berlanjut, tumbuhan di sekitar sungai semakin banyak yang layu. Hewan-hewan mulai berpindah mencari sumber air lain.',
      question: 'Apa dampak berantai yang paling mungkin terjadi?',
      options: [
        { id: 'a', text: 'Hewan kembali ke sungai karena rindu', correct: false, explanation: 'Hewan berpindah karena kebutuhan hidup, bukan karena perasaan rindu.' },
        { id: 'b', text: 'Keseimbangan ekosistem tetap terjaga', correct: false, explanation: 'Jika komponen berubah secara drastis, keseimbangan ekosistem pasti terganggu.' },
        { id: 'c', text: 'Rantai makanan terganggu karena produsen berkurang', correct: true, explanation: 'Tepat! Tumbuhan adalah produsen. Jika tumbuhan berkurang, seluruh rantai makanan akan terganggu.' },
        { id: 'd', text: 'Batu di sungai akan menjadi lunak', correct: false, explanation: 'Kekeringan tidak membuat batu menjadi lunak. Batu adalah komponen abiotik yang tidak berubah dalam waktu singkat.' },
      ],
      xp: 10,
    },
    {
      id: 'm3-q3',
      map: 3,
      type: 'scenario',
      story: 'Warga desa mulai menanam pohon di sekitar sungai dan membuat bendungan kecil untuk menampung air hujan.',
      question: 'Mengapa tindakan warga tersebut dapat membantu memulihkan ekosistem?',
      options: [
        { id: 'a', text: 'Pohon membuat sungai terlihat indah saja', correct: false, explanation: 'Meskipun benar pohon memperindah lingkungan, fungsi utamanya bagi ekosistem lebih dari itu.' },
        { id: 'b', text: 'Pohon membantu menyimpan air tanah dan bendungan menampung air', correct: true, explanation: 'Benar! Akar pohon membantu menyerap dan menyimpan air di dalam tanah, sementara bendungan menampung air untuk kebutuhan ekosistem.' },
        { id: 'c', text: 'Batu di sungai akan berubah menjadi tanah', correct: false, explanation: 'Batu tidak berubah menjadi tanah dalam waktu singkat. Pelapukan batu membutuhkan waktu sangat lama.' },
        { id: 'd', text: 'Ikan akan muncul sendiri tanpa air', correct: false, explanation: 'Ikan membutuhkan air untuk hidup. Ikan tidak dapat muncul tanpa adanya air yang cukup.' },
      ],
      xp: 10,
    },
  ],

  // ===== MAP 4: MISI MENYELAMATKAN EKOSISTEM — Problem Solving =====
  map4: [
    {
      id: 'm4-q1',
      map: 4,
      type: 'problem_solving',
      scenario: 'Banyak pohon di suatu kawasan hutan ditebang untuk membuka lahan pertanian.',
      question: 'Pilih dampak yang mungkin terjadi akibat penebangan pohon! (Pilih semua yang benar)',
      options: [
        { id: 'a', text: 'Hewan kehilangan habitat', correct: true, explanation: 'Pohon adalah tempat tinggal banyak hewan. Jika ditebang, hewan kehilangan rumahnya.' },
        { id: 'b', text: 'Tanah lebih mudah mengalami erosi', correct: true, explanation: 'Akar pohon menahan tanah. Tanpa pohon, tanah mudah terbawa air hujan.' },
        { id: 'c', text: 'Suhu lingkungan dapat meningkat', correct: true, explanation: 'Pohon memberikan keteduhan dan menyerap panas. Tanpa pohon, suhu bisa meningkat.' },
        { id: 'd', text: 'Udara menjadi lebih bersih', correct: false, explanation: 'Justru sebaliknya! Pohon menyerap karbon dioksida dan menghasilkan oksigen. Tanpa pohon, kualitas udara menurun.' },
      ],
      xp: 10,
    },
    {
      id: 'm4-q2',
      map: 4,
      type: 'problem_solving',
      scenario: 'Sungai di dekat pemukiman warga tercemar oleh limbah pabrik. Air sungai berubah warna dan berbau tidak sedap.',
      question: 'Apa dampak pencemaran sungai terhadap ekosistem? (Pilih semua yang benar)',
      options: [
        { id: 'a', text: 'Ikan dan hewan air mati atau berpindah', correct: true, explanation: 'Limbah membuat air tercemar sehingga ikan dan hewan air tidak dapat bertahan hidup.' },
        { id: 'b', text: 'Tumbuhan air rusak', correct: true, explanation: 'Limbah mengandung zat berbahaya yang merusak tumbuhan air.' },
        { id: 'c', text: 'Air tidak layak digunakan manusia', correct: true, explanation: 'Air tercemar berbahaya bagi kesehatan manusia jika digunakan untuk minum atau mandi.' },
        { id: 'd', text: 'Sungai menjadi lebih dalam', correct: false, explanation: 'Pencemaran tidak membuat sungai lebih dalam. Justru limbah dapat mengendap dan membuat sungai dangkal.' },
      ],
      xp: 10,
    },
    {
      id: 'm4-q3',
      map: 4,
      type: 'problem_solving',
      scenario: 'Untuk menyelamatkan ekosistem sungai yang tercemar, warga dan pemerintah harus bekerja sama.',
      question: 'Tindakan apa yang tepat untuk menyelamatkan ekosistem sungai? (Pilih semua yang benar)',
      options: [
        { id: 'a', text: 'Menghentikan pembuangan limbah ke sungai', correct: true, explanation: 'Menghentikan sumber pencemaran adalah langkah pertama yang paling penting.' },
        { id: 'b', text: 'Menanam tumbuhan di sekitar sungai', correct: true, explanation: 'Tumbuhan membantu menyaring air dan menjaga kelembapan tanah di sekitar sungai.' },
        { id: 'c', text: 'Membuang lebih banyak limbah agar sungai terbiasa', correct: false, explanation: 'Sungai tidak dapat "terbiasa" dengan limbah. Justru akan semakin merusak ekosistem.' },
        { id: 'd', text: 'Membersihkan sungai secara rutin', correct: true, explanation: 'Membersihkan sungai membantu memulihkan kualitas air dan ekosistem di dalamnya.' },
      ],
      xp: 10,
    },
  ],

  // ===== MAP 5: PENJAGA KESEIMBANGAN — Simulasi/Prediksi =====
  map5: [
    {
      id: 'm5-q1',
      map: 5,
      type: 'simulation',
      setup: {
        title: 'Simulasi Ekosistem',
        components: [
          { emoji: '☀️', name: 'Matahari', type: 'abiotik' },
          { emoji: '🌳', name: 'Tumbuhan', type: 'biotik' },
          { emoji: '🐛', name: 'Serangga', type: 'biotik' },
          { emoji: '🐦', name: 'Burung', type: 'biotik' },
          { emoji: '💧', name: 'Air', type: 'abiotik' },
          { emoji: '🪨', name: 'Tanah', type: 'abiotik' },
        ],
      },
      change: 'Curah hujan menurun drastis selama beberapa minggu.',
      question: 'Apa yang akan terjadi pada ekosistem ini?',
      predictions: [
        { id: 'a', text: 'Tumbuhan kekurangan air dan mulai layu', correct: true, explanation: 'Benar! Tumbuhan membutuhkan air. Tanpa hujan yang cukup, tumbuhan akan layu.' },
        { id: 'b', text: 'Burung mendapatkan lebih banyak makanan', correct: false, explanation: 'Jika tumbuhan layu, serangga berkurang, sehingga burung justru kekurangan makanan.' },
        { id: 'c', text: 'Serangga berkurang karena tumbuhan layu', correct: true, explanation: 'Benar! Serangga bergantung pada tumbuhan. Jika tumbuhan berkurang, populasi serangga juga menurun.' },
        { id: 'd', text: 'Ekosistem tetap seimbang', correct: false, explanation: 'Perubahan komponen abiotik yang drastis pasti memengaruhi keseimbangan ekosistem.' },
      ],
      xp: 10,
    },
    {
      id: 'm5-q2',
      map: 5,
      type: 'simulation',
      setup: {
        title: 'Simulasi Ekosistem Sawah',
        components: [
          { emoji: '☀️', name: 'Matahari', type: 'abiotik' },
          { emoji: '🌾', name: 'Padi', type: 'biotik' },
          { emoji: '🐸', name: 'Katak', type: 'biotik' },
          { emoji: '🐍', name: 'Ular', type: 'biotik' },
          { emoji: '💧', name: 'Air', type: 'abiotik' },
          { emoji: '🦗', name: 'Belalang', type: 'biotik' },
        ],
      },
      change: 'Petani menggunakan pestisida berlebihan yang membunuh banyak serangga termasuk belalang.',
      question: 'Apa dampaknya terhadap ekosistem sawah?',
      predictions: [
        { id: 'a', text: 'Katak kekurangan makanan karena belalang berkurang', correct: true, explanation: 'Benar! Katak memakan belalang. Jika belalang berkurang, katak akan kesulitan mencari makanan.' },
        { id: 'b', text: 'Padi tumbuh lebih baik tanpa hama', correct: false, explanation: 'Meskipun hama berkurang, hilangnya serangga penyerbuk dan predator alami justru dapat merugikan ekosistem dalam jangka panjang.' },
        { id: 'c', text: 'Ular kekurangan makanan karena katak berkurang', correct: true, explanation: 'Benar! Ini adalah dampak berantai. Ular memakan katak, jika katak berkurang, ular juga terdampak.' },
        { id: 'd', text: 'Tanah menjadi lebih subur', correct: false, explanation: 'Pestisida berlebihan justru dapat merusak organisme tanah yang membantu menyuburkan tanah.' },
      ],
      xp: 10,
    },
    {
      id: 'm5-q3',
      map: 5,
      type: 'simulation',
      setup: {
        title: 'Aksi Menjaga Keseimbangan',
        components: [],
      },
      change: 'Sebagai penjaga keseimbangan, kamu harus memilih tindakan yang tepat.',
      question: 'Tindakan apa yang paling baik untuk menjaga keseimbangan ekosistem? (Pilih semua yang benar)',
      predictions: [
        { id: 'a', text: 'Menanam pohon dan menjaga kebersihan sungai', correct: true, explanation: 'Benar! Menanam pohon membantu menjaga udara dan habitat, sementara sungai bersih mendukung kehidupan air.' },
        { id: 'b', text: 'Mengurangi penggunaan bahan kimia berbahaya', correct: true, explanation: 'Benar! Bahan kimia berbahaya dapat mencemari tanah dan air, merusak ekosistem.' },
        { id: 'c', text: 'Membuang sampah sembarangan', correct: false, explanation: 'Membuang sampah sembarangan justru merusak lingkungan dan ekosistem.' },
        { id: 'd', text: 'Menghemat air dan menjaga kebersihan lingkungan', correct: true, explanation: 'Benar! Menghemat air dan menjaga kebersihan lingkungan membantu menjaga keseimbangan ekosistem.' },
      ],
      xp: 10,
    },
  ],

  // ===== FINAL MISSION: SELAMATKAN EKOSISTEM =====
  finalMission: [
    {
      id: 'fm-q1',
      type: 'final',
      competency: 'identify_biotic',
      question: 'Manakah yang termasuk komponen biotik?',
      options: [
        { id: 'a', text: 'Jamur', correct: true, explanation: 'Jamur adalah makhluk hidup sehingga termasuk komponen biotik.' },
        { id: 'b', text: 'Batu', correct: false, explanation: 'Batu adalah benda mati sehingga termasuk komponen abiotik.' },
        { id: 'c', text: 'Angin', correct: false, explanation: 'Angin adalah faktor tak hidup sehingga termasuk komponen abiotik.' },
        { id: 'd', text: 'Sinar matahari', correct: false, explanation: 'Sinar matahari bukan makhluk hidup sehingga termasuk komponen abiotik.' },
      ],
      xp: 10,
    },
    {
      id: 'fm-q2',
      type: 'final',
      competency: 'identify_abiotic',
      question: 'Manakah yang termasuk komponen abiotik?',
      options: [
        { id: 'a', text: 'Rumput', correct: false, explanation: 'Rumput adalah tumbuhan (makhluk hidup) sehingga termasuk komponen biotik.' },
        { id: 'b', text: 'Suhu udara', correct: true, explanation: 'Suhu udara adalah faktor fisik tak hidup sehingga termasuk komponen abiotik.' },
        { id: 'c', text: 'Semut', correct: false, explanation: 'Semut adalah hewan (makhluk hidup) sehingga termasuk komponen biotik.' },
        { id: 'd', text: 'Bakteri', correct: false, explanation: 'Bakteri adalah makhluk hidup (mikroorganisme) sehingga termasuk komponen biotik.' },
      ],
      xp: 10,
    },
    {
      id: 'fm-q3',
      type: 'final',
      competency: 'explain_relationship',
      question: 'Mengapa tumbuhan membutuhkan cahaya matahari?',
      options: [
        { id: 'a', text: 'Untuk bernapas', correct: false, explanation: 'Tumbuhan bernapas menggunakan oksigen, bukan cahaya matahari.' },
        { id: 'b', text: 'Untuk proses fotosintesis menghasilkan makanan', correct: true, explanation: 'Benar! Cahaya matahari dibutuhkan tumbuhan untuk fotosintesis, yaitu proses membuat makanan sendiri.' },
        { id: 'c', text: 'Untuk bergerak', correct: false, explanation: 'Tumbuhan tidak bergerak secara aktif. Cahaya matahari bukan untuk bergerak.' },
        { id: 'd', text: 'Untuk berkembang biak', correct: false, explanation: 'Tumbuhan berkembang biak melalui biji, spora, atau vegetatif, bukan langsung oleh cahaya matahari.' },
      ],
      xp: 10,
    },
    {
      id: 'fm-q4',
      type: 'final',
      competency: 'analyze_impact',
      question: 'Jumlah pohon di hutan berkurang drastis. Suhu udara di sekitar hutan meningkat menjadi $35°C$. Apa penyebab utamanya?',
      options: [
        { id: 'a', text: 'Pohon menyerap panas, tanpa pohon suhu meningkat', correct: true, explanation: 'Benar! Pohon memberikan keteduhan dan mengurangi suhu melalui transpirasi. Tanpa pohon, suhu lingkungan meningkat.' },
        { id: 'b', text: 'Batu di hutan mengeluarkan panas', correct: false, explanation: 'Batu menyerap panas matahari, tetapi bukan penyebab utama peningkatan suhu ketika pohon hilang.' },
        { id: 'c', text: 'Hewan berlari semakin cepat', correct: false, explanation: 'Kecepatan lari hewan tidak memengaruhi suhu lingkungan.' },
        { id: 'd', text: 'Sungai menghasilkan lebih banyak uap', correct: false, explanation: 'Uap air dari sungai justru membantu menurunkan suhu, bukan meningkatkannya.' },
      ],
      xp: 10,
    },
    {
      id: 'fm-q5',
      type: 'final',
      competency: 'find_solution',
      question: 'Ekosistem sungai tercemar, ikan berkurang $60\\%$, dan tumbuhan air rusak. Tindakan apa yang paling tepat?',
      options: [
        { id: 'a', text: 'Membiarkan saja karena alam akan pulih sendiri', correct: false, explanation: 'Meskipun alam memiliki kemampuan pulih, pencemaran berat membutuhkan tindakan manusia untuk diperbaiki.' },
        { id: 'b', text: 'Menghentikan sumber pencemaran dan merehabilitasi sungai', correct: true, explanation: 'Benar! Langkah pertama adalah menghentikan sumber pencemaran, kemudian membersihkan dan menanam kembali tumbuhan air.' },
        { id: 'c', text: 'Memindahkan semua ikan ke akuarium', correct: false, explanation: 'Memindahkan ikan ke akuarium bukan solusi jangka panjang untuk ekosistem sungai.' },
        { id: 'd', text: 'Menambah limbah agar ekosistem terbiasa', correct: false, explanation: 'Menambah limbah justru akan semakin merusak ekosistem sungai.' },
      ],
      xp: 10,
    },
  ],
};

/**
 * BADGES — Badge yang dapat diperoleh murid berdasarkan pencapaian XP
 */
const BADGES = [
  { id: 'pemula', name: 'Pemula Ekosistem', emoji: '🌱', minXP: 0, description: 'Baru memulai petualangan.' },
  { id: 'penjelajah', name: 'Penjelajah Alam', emoji: '🌿', minXP: 50, description: 'Mulai memahami ekosistem.' },
  { id: 'ilmuwan', name: 'Ilmuwan Cilik', emoji: '🔬', minXP: 150, description: 'Mampu menganalisis ekosistem.' },
  { id: 'penjaga', name: 'Penjaga Lingkungan', emoji: '🌏', minXP: 250, description: 'Peduli terhadap lingkungan.' },
  { id: 'master', name: 'Master Ekosistem', emoji: '🏆', minXP: 350, description: 'Menguasai keseimbangan ekosistem.' },
];
