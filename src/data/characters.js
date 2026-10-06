/**
 * characters.js — Data karakter yang dapat dipilih murid
 * Setiap karakter memiliki id, nama, deskripsi, emoji, dan warna tema.
 * Ganti properti 'image' dengan path ke aset gambar karakter jika tersedia.
 */

const CHARACTERS = [
  {
    id: 'explorer',
    name: 'Penjelajah Rimba',
    description: 'Berani menjelajahi hutan dan sungai untuk menemukan rahasia ekosistem.',
    emoji: '🌿',
    color: '#2E7D32',
    // image: '/assets/images/characters/explorer.png' // Ganti dengan aset karakter
  },
  {
    id: 'researcher',
    name: 'Peneliti Alam',
    description: 'Mengamati dan mencatat setiap perubahan di lingkungan sekitar.',
    emoji: '🔬',
    color: '#1565C0',
    // image: '/assets/images/characters/researcher.png'
  },
  {
    id: 'guardian',
    name: 'Penjaga Ekosistem',
    description: 'Melindungi keseimbangan alam dari berbagai ancaman.',
    emoji: '🛡️',
    color: '#F57F17',
    // image: '/assets/images/characters/guardian.png'
  },
  {
    id: 'scientist',
    name: 'Ilmuwan Cilik',
    description: 'Menggunakan ilmu pengetahuan untuk memecahkan masalah lingkungan.',
    emoji: '🧪',
    color: '#7B1FA2',
    // image: '/assets/images/characters/scientist.png'
  },
];
