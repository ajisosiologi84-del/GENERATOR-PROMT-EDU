import { PresetTemplate } from "./types";

export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: "rpp-fotosintesis",
    title: "Modul Ajar / RPP Fotosintesis",
    category: "Guru",
    description: "Buat Rencana Pembelajaran interaktif tentang fotosintesis dengan metode praktikum.",
    icon: "BookOpen",
    userRequest: "Bikinkan saya RPP tentang fotosintesis untuk kelas 7 SMP dengan metode eksperimen sederhana.",
    defaultStructure: {
      role: "Bertindaklah sebagai Guru IPA SMP yang berpengalaman dalam Kurikulum Merdeka.",
      task: "Buatlah rencana pelaksanaan pembelajaran (RPP) / Modul Ajar satu pertemuan mengenai proses Fotosintesis.",
      context: "Target murid adalah kelas 7 SMP dengan tingkat pemahaman dasar. RPP harus menyertakan metode eksperimen praktis menggunakan daun dan air, serta pertanyaan pemantik yang merangsang nalar kritis murid.",
      format: "Sajikan dalam format dokumen rencana terstruktur dengan poin-poin kegiatan (Pendahuluan, Inti, Penutup), durasi waktu, alat bahan, serta rubrik penilaian sederhana."
    }
  },
  {
    id: "kuis-sejarah",
    title: "Kuis Sejarah HOTS (Analitis)",
    category: "Guru",
    description: "Buat soal pilihan ganda berpikir kritis tentang kemerdekaan Indonesia.",
    icon: "GraduationCap",
    userRequest: "Saya mau bikin soal esai sejarah kemerdekaan Indonesia yang menantang berpikir kritis.",
    defaultStructure: {
      role: "Bertindaklah sebagai Dosen atau Guru Sejarah Indonesia tingkat lanjut.",
      task: "Susunlah 5 soal esai berbasis berpikir kritis tingkat tinggi (HOTS - Higher Order Thinking Skills) tentang momentum Proklamasi Kemerdekaan Indonesia.",
      context: "Target audiens adalah siswa SMA Kelas 11 yang sedang mempelajari perjuangan kemerdekaan. Soal tidak boleh hanya hafalan tanggal, tetapi harus menanyakan analisis sebab-akibat dan relevansinya bagi generasi masa kini.",
      format: "Sajikan soal secara berurutan, diikuti dengan kunci jawaban detail serta rubrik penilaian objektif untuk masing-masing soal."
    }
  },
  {
    id: "coding-smp",
    title: "Dasar Pemrograman Python",
    category: "Siswa",
    description: "Penjelasan coding yang seru dan mudah dipahami anak usia SMP.",
    icon: "Code2",
    userRequest: "Jelaskan coding Python tentang perulangan (loops) buat anak SMP.",
    defaultStructure: {
      role: "Bertindaklah sebagai Mentor Coding anak muda yang asyik, interaktif, dan penuh humor.",
      task: "Jelaskan konsep perulangan (loops - 'for' dan 'while') dalam bahasa pemrograman Python secara sangat sederhana.",
      context: "Target audiens adalah anak-anak usia SMP (12-15 tahun) yang belum pernah belajar pemrograman sebelumnya. Gunakan analogi dunia nyata (seperti mencuci piring atau bermain game) untuk mempermudah pemahaman.",
      format: "Tulis penjelasan singkat interaktif dengan potongan kode Python sederhana yang mudah dipraktikkan, diakhiri dengan satu tantangan (challenge) kecil untuk dicoba."
    }
  },
  {
    id: "analogi-fisika",
    title: "Analogi Fisika (Gaya Gravitasi)",
    category: "Umum",
    description: "Menjelaskan konsep Fisika abstrak lewat analogi dunia nyata sehari-hari.",
    icon: "Sparkles",
    userRequest: "Jelaskan konsep gaya gravitasi dan kelengkungan ruang waktu kepada orang awam.",
    defaultStructure: {
      role: "Bertindaklah sebagai Komunikator Sains populer yang piawai menyederhanakan konsep fisika teoretis yang rumit.",
      task: "Jelaskan teori relativitas umum Einstein mengenai kelengkungan ruang-waktu dan bagaimana itu menyebabkan gaya gravitasi.",
      context: "Target pembaca adalah masyarakat awam atau anak-anak tanpa latar belakang fisika/matematika lanjut. Hindari rumus matematis sama sekali.",
      format: "Gunakan analogi visual (seperti kasur busa atau kain elastis yang ditindih bola berat) dengan gaya bahasa yang penuh antusiasme, santai, dan imajinatif."
    }
  },
  {
    id: "ulas-tugas",
    title: "Umpan Balik Tugas Penulisan",
    category: "Dosen",
    description: "Evaluasi esai atau karya tulis ilmiah mahasiswa dengan ramah dan konstruktif.",
    icon: "FileCheck",
    userRequest: "Berikan ulasan esai mahasiswa tentang perubahan sosial budaya di era digital.",
    defaultStructure: {
      role: "Bertindaklah sebagai Dosen Sosiologi yang suportif, analitis, dan mendidik.",
      task: "Berikan ulasan akademis dan umpan balik yang konstruktif untuk draf artikel/esai ilmiah mahasiswa mengenai dampak perubahan sosial budaya akibat digitalisasi.",
      context: "Draf ditulis oleh mahasiswa S1 semester awal. Fokuskan evaluasi pada kekuatan argumen, keruntutan gagasan, ketepatan teori, serta penggunaan referensi akademis.",
      format: "Gunakan metode 'sandwich feedback' (apresiasi kelebihan, sampaikan rekomendasi perbaikan esensial, akhiri dengan kalimat penyemangat), sajikan dalam bentuk poin-poin yang mudah dibaca."
    }
  },
  {
    id: "peta-pikiran",
    title: "Peta Pikiran (Mind Map) Belajar",
    category: "Siswa",
    description: "Membuat rencana kerangka belajar mandiri yang sistematis untuk ujian.",
    icon: "Network",
    userRequest: "Bantu saya merancang peta pikiran untuk belajar sejarah perang dunia kedua.",
    defaultStructure: {
      role: "Bertindaklah sebagai Tutor Pembelajaran Efektif (Study Coach) berspesialisasi dalam teknik Mind Mapping.",
      task: "Rancanglah struktur peta pikiran (Mind Map) komprehensif untuk memahami dinamika Perang Dunia II.",
      context: "Siswa akan menggunakan peta pikiran ini untuk mempersiapkan ujian akhir semester. Fokuskan pada 4 cabang utama: Latar Belakang/Sebab, Aliansi/Blok, Pertempuran Kunci, dan Dampak Global pasca-perang.",
      format: "Sajikan dalam bentuk pohon hierarkis teks berinden yang jelas (menggunakan emoji penanda), lengkap dengan saran kode warna atau kata kunci penting untuk memudahkan memori visual."
    }
  }
];
