/**
 * maps.js — Data peta/wilayah petualangan
 * Setiap map memiliki id, nama, deskripsi, ikon, materi pengantar, dan tipe challenge.
 */

const MAPS = [
  {
    id: 1,
    name: 'Gerbang Ekosistem',
    description: 'Kenali komponen biotik dan abiotik dalam ekosistem.',
    icon: '🌍',
    bgColor: '#E8F5E9',
    accentColor: '#4CAF50',
    challengeType: 'classification', // drag & drop klasifikasi
    material: {
      title: 'Mengenal Komponen Ekosistem',
      awareness: 'Apa itu komponen biotik dan abiotik? Mari kita pelajari bersama!',
      sections: [
        {
          title: 'Komponen Biotik',
          content: 'Komponen biotik adalah <strong>makhluk hidup</strong> yang terdapat dalam suatu ekosistem.',
          examples: ['Manusia', 'Hewan', 'Tumbuhan', 'Mikroorganisme'],
          icon: '🌱',
        },
        {
          title: 'Komponen Abiotik',
          content: 'Komponen abiotik adalah <strong>benda atau faktor tak hidup</strong> yang memengaruhi kehidupan dalam ekosistem.',
          examples: ['Air', 'Tanah', 'Udara', 'Cahaya matahari', 'Suhu', 'Batu'],
          icon: '☀️',
        },
      ],
      summary: 'Komponen biotik dan abiotik saling berinteraksi membentuk suatu ekosistem yang seimbang.',
    },
  },
  {
    id: 2,
    name: 'Hutan Kehidupan',
    description: 'Temukan hubungan antara makhluk hidup dan lingkungannya.',
    icon: '🌳',
    bgColor: '#F1F8E9',
    accentColor: '#8BC34A',
    challengeType: 'matching', // pasangkan hubungan
    material: {
      title: 'Hubungan Biotik dan Abiotik',
      awareness: 'Bagaimana makhluk hidup bergantung pada lingkungannya? Ayo temukan jawabannya!',
      sections: [
        {
          title: 'Kebutuhan Tumbuhan',
          content: 'Tumbuhan membutuhkan komponen abiotik untuk bertahan hidup dan tumbuh.',
          examples: ['Air untuk fotosintesis', 'Tanah sebagai tempat tumbuh', 'Cahaya matahari untuk energi', 'Udara (CO₂) untuk fotosintesis'],
          icon: '🌿',
        },
        {
          title: 'Kebutuhan Hewan',
          content: 'Hewan juga bergantung pada komponen abiotik dan biotik di sekitarnya.',
          examples: ['Air untuk minum', 'Udara untuk bernapas', 'Makanan (tumbuhan/hewan lain)', 'Tempat hidup (habitat)'],
          icon: '🦋',
        },
      ],
      summary: 'Setiap makhluk hidup membutuhkan komponen abiotik untuk bertahan hidup. Hubungan ini membentuk keseimbangan ekosistem.',
    },
  },
  {
    id: 3,
    name: 'Sungai yang Berubah',
    description: 'Analisis dampak perubahan komponen abiotik terhadap ekosistem.',
    icon: '🏞️',
    bgColor: '#E3F2FD',
    accentColor: '#2196F3',
    challengeType: 'scenario', // cerita interaktif + pilihan
    material: {
      title: 'Dampak Perubahan Komponen Abiotik',
      awareness: 'Apa yang terjadi jika komponen abiotik berubah? Simaklah cerita berikut!',
      sections: [
        {
          title: 'Perubahan di Sungai',
          content: 'Sungai di dekat hutan mengalami kekeringan. Air semakin sedikit. Beberapa tumbuhan mulai layu dan ikan mulai berkurang.',
          examples: [],
          icon: '💧',
        },
        {
          title: 'Rantai Dampak',
          content: 'Perubahan pada satu komponen abiotik dapat memengaruhi seluruh ekosistem secara berantai.',
          examples: [
            'Air berkurang → Tumbuhan terdampak',
            'Tumbuhan berkurang → Hewan kehilangan makanan',
            'Hewan berkurang → Rantai makanan terganggu',
            'Keseimbangan ekosistem terganggu',
          ],
          icon: '⚠️',
        },
      ],
      summary: 'Perubahan komponen abiotik dapat menimbulkan dampak berantai yang mengganggu keseimbangan ekosistem.',
    },
  },
  {
    id: 4,
    name: 'Misi Menyelamatkan Ekosistem',
    description: 'Pecahkan masalah lingkungan dan temukan solusinya.',
    icon: '🔧',
    bgColor: '#FFF3E0',
    accentColor: '#FF9800',
    challengeType: 'problem_solving', // analisis dampak
    material: {
      title: 'Menyelamatkan Ekosistem',
      awareness: 'Ekosistem sedang terancam! Bisakah kamu menemukan solusinya?',
      sections: [
        {
          title: 'Penebangan Pohon',
          content: 'Banyak pohon di suatu kawasan ditebang untuk berbagai keperluan manusia. Hal ini dapat menimbulkan berbagai dampak terhadap ekosistem.',
          examples: [
            'Hewan kehilangan habitat',
            'Tanah lebih mudah mengalami erosi',
            'Suhu lingkungan dapat meningkat',
            'Kadar oksigen berkurang',
          ],
          icon: '🪓',
        },
        {
          title: 'Pencemaran Sungai',
          content: 'Limbah pabrik dan sampah yang dibuang ke sungai dapat mencemari air dan merusak kehidupan di dalamnya.',
          examples: [
            'Ikan mati atau berpindah',
            'Tumbuhan air rusak',
            'Air tidak layak digunakan manusia',
            'Hewan sekitar sungai terganggu',
          ],
          icon: '🏭',
        },
      ],
      summary: 'Tindakan manusia dapat memengaruhi keseimbangan ekosistem. Kita harus bijak dalam menjaga lingkungan.',
    },
  },
  {
    id: 5,
    name: 'Penjaga Keseimbangan',
    description: 'Prediksi dan jaga keseimbangan ekosistem.',
    icon: '⚖️',
    bgColor: '#F3E5F5',
    accentColor: '#9C27B0',
    challengeType: 'simulation', // simulasi ekosistem
    material: {
      title: 'Menjaga Keseimbangan Ekosistem',
      awareness: 'Ekosistem membutuhkan keseimbangan. Apa yang akan kamu lakukan untuk menjaganya?',
      sections: [
        {
          title: 'Komponen Ekosistem Seimbang',
          content: 'Ekosistem yang sehat memiliki komponen biotik dan abiotik yang seimbang dan saling mendukung.',
          examples: [
            '☀️ Matahari memberikan energi',
            '🌳 Tumbuhan menghasilkan oksigen',
            '🐛 Serangga membantu penyerbukan',
            '🐦 Burung mengendalikan populasi serangga',
            '💧 Air mendukung kehidupan',
            '🪨 Tanah menyediakan nutrisi',
          ],
          icon: '🌏',
        },
        {
          title: 'Prediksi Perubahan',
          content: 'Jika salah satu komponen berubah, kita perlu memprediksi dampaknya agar dapat mengambil tindakan yang tepat.',
          examples: [
            'Curah hujan menurun → air berkurang → tumbuhan layu',
            'Populasi predator berkurang → populasi mangsa meningkat',
            'Suhu meningkat → es mencair → habitat berubah',
          ],
          icon: '🔮',
        },
      ],
      summary: '"Alam merupakan ciptaan Allah Swt. yang harus kita syukuri dan jaga." Menjaga keseimbangan ekosistem adalah tanggung jawab kita bersama.',
    },
  },
];
