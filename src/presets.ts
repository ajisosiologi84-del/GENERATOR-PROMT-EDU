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
    id: "rubrik-sikap",
    title: "Rubrik Penilaian Sikap Kolaboratif",
    category: "Guru",
    description: "Panduan instrumen penilaian profil pelajar Pancasila dimensi gotong royong.",
    icon: "FileCheck",
    userRequest: "Buat rubrik penilaian sikap gotong royong siswa saat kerja kelompok kelas SMP.",
    defaultStructure: {
      role: "Bertindaklah sebagai Guru Ahli Evaluasi Pendidikan dan Pembentukan Karakter Siswa.",
      task: "Rancang instrumen rubrik penilaian sikap gotong royong (kolaborasi) siswa untuk tugas proyek kelompok.",
      context: "Mengacu pada dimensi Profil Pelajar Pancasila. Ditujukan untuk siswa jenjang SMP agar bersikap asertif, berbagi tugas dengan adil, dan saling membantu.",
      format: "Sajikan rubrik dalam bentuk tabel dengan kriteria: Belum Berkembang (BB), Mulai Berkembang (MB), Berkembang Sesuai Harapan (BSH), dan Sangat Berkembang (SB), lengkap dengan deskriptor indikator perilaku yang konkret."
    }
  },
  {
    id: "diferensiasi-baca",
    title: "Strategi Diferensiasi Membaca SD",
    category: "Guru",
    description: "Strategi ajar membaca untuk 3 tingkat kemampuan siswa yang berbeda dalam satu kelas.",
    icon: "Network",
    userRequest: "Ide mengajar membaca di kelas yang ada anak belum lancar membaca dan yang sudah mahir.",
    defaultStructure: {
      role: "Bertindaklah sebagai Konsultan Pembelajaran Berdiferensiasi (Differentiated Learning Coach) Sekolah Dasar.",
      task: "Susun strategi langkah pembelajaran membaca yang disesuaikan (diferensiasi) untuk satu sesi pelajaran bahasa.",
      context: "Siswa kelas 3 SD dengan variasi kemampuan ekstrim: Kelompok A (belum lancar mengeja suku kata), Kelompok B (lancar membaca kata namun kurang paham arti kalimat), dan Kelompok C (sudah sangat mahir membaca pemahaman teks panjang).",
      format: "Sajikan strategi konkret berupa aktivitas paralel terpisah untuk masing-masing kelompok, didahului pengantar klasikal singkat dan diakhiri dengan evaluasi penilaian formatif mandiri."
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
      context: "Draf ditulis oleh mahasiswa S1 semester awal. Fokuskan evaluasi pada kekuatan argumen, keruntutan gagasan, ketepatan teori sosiologi yang digunakan, serta penggunaan referensi akademis.",
      format: "Gunakan metode 'sandwich feedback' (apresiasi kelebihan, sampaikan rekomendasi perbaikan esensial, akhiri dengan kalimat penyemangat), sajikan dalam bentuk poin-poin yang mudah dibaca cepat."
    }
  },
  {
    id: "rps-sosiologi",
    title: "Rencana Pembelajaran Semester (RPS)",
    category: "Dosen",
    description: "Rancangan Rencana Pembelajaran Semester (RPS) kuliah 16 minggu tingkat universitas.",
    icon: "Layers",
    userRequest: "Rancangkan RPS mata kuliah Pengantar Sosiologi Komunitas semester 3.",
    defaultStructure: {
      role: "Bertindaklah sebagai Ketua Program Studi dan Ahli Pengembang Kurikulum Pendidikan Tinggi yang berpengalaman.",
      task: "Rancang kerangka dasar Rencana Pembelajaran Semester (RPS) mata kuliah 'Sosiologi Komunitas'.",
      context: "Ditujukan untuk mahasiswa S1 semester 3 dengan bobot 3 SKS. RPS harus memuat Capaian Pembelajaran Lulusan (CPL) aspek pengetahuan dan keterampilan, serta tabel pembagian topik kuliah selama 16 minggu (termasuk UTS di minggu ke-8 dan UAS di minggu ke-16).",
      format: "Sajikan dalam draf terstruktur meliputi: Identitas Mata Kuliah, Capaian Pembelajaran, daftar mingguan teratur (Topik Utama, Bentuk Pembelajaran, Metode Asesmen), serta rekomendasi minimal 3 buku rujukan akademis utama."
    }
  },
  {
    id: "reviewer-jurnal",
    title: "Pendamping Reviewer Jurnal Akademis",
    category: "Dosen",
    description: "Formulasi sistematis untuk mengulas draf manuskrip artikel ilmiah mahasiswa atau rekan sejawat.",
    icon: "BookOpen",
    userRequest: "Review draf artikel jurnal sosiologi tentang partisipasi politik pemilih pemuda.",
    defaultStructure: {
      role: "Bertindaklah sebagai Peer Reviewer Senior dari jurnal ilmiah terakreditasi nasional sinta-2.",
      task: "Lakukan telaah kritis (academic peer review) yang objektif, mendalam, dan mendidik terhadap draf manuskrip artikel ilmiah tentang partisipasi politik pemilih pemula di era digital.",
      context: "Bantu penulis meningkatkan kelayakan terbit naskah mereka. Fokuskan penelaahan pada aspek orisinalitas (novelty), keselarasan metodologi dengan temuan riset, analisis diskusi teoretis, dan kerapian format sitasi.",
      format: "Sajikan komentar review secara sistematis: (1) Abstrak & Pengenalan, (2) Kelebihan Utama Metodologi, (3) Rekomendasi Perbaikan Mayor (metode/argumen), (4) Catatan Minor (sitasi, tata bahasa, dan typo)."
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
  },
  {
    id: "rumus-matematika",
    title: "Penjelas Logika Rumus Logaritma",
    category: "Siswa",
    description: "Memahami konsep matematika logaritma melalui penalaran logika visual tanpa hafalan buta.",
    icon: "Compass",
    userRequest: "Jelaskan logaritma dengan gampang biar saya tidak bingung rumusnya.",
    defaultStructure: {
      role: "Bertindaklah sebagai Tutor Matematika Kreatif yang menekankan konsep pemahaman mendalam.",
      task: "Jelaskan konsep dasar operasi logaritma dan sifat-sifat utamanya agar mudah dipahami secara visual.",
      context: "Siswa kelas 10 SMA yang mengalami kecemasan belajar matematika (math anxiety). Hubungkan logaritma dengan operasi kebalikan dari eksponen secara analogis (seperti pembelahan bakteri atau skala gempa Richter).",
      format: "Sajikan penjelasan dengan: (1) Sejarah mengapa logaritma diciptakan, (2) Penjelasan visual, (3) Arti simbol di dalam rumus, (4) 2 contoh kasus nyata disertai solusi pengerjaan langkah demi langkah."
    }
  },
  {
    id: "belajar-esai",
    title: "Pendamping Esai Academic Inggris",
    category: "Siswa",
    description: "Struktur penyusunan esai opini akademik berbahasa Inggris secara sistematis (Metode PEEL).",
    icon: "PenTool",
    userRequest: "Bagaimana cara menulis opinion essay bahasa inggris tentang teknologi di sekolah?",
    defaultStructure: {
      role: "Bertindaklah sebagai Pelatih Penulisan Akademis (IELTS Academic Writing Coach) bersertifikat.",
      task: "Buat panduan penyusunan dan draf kerangka (outline) penulisan 'Opinion Essay' dengan topik 'The Role of Technology in Modern Classrooms'.",
      context: "Ditujukan untuk pelajar yang bersiap mengikuti ujian kemampuan bahasa Inggris atau tugas sekolah menengah atas. Fokuskan penjelasan pada pembentukan Kalimat Tesis (Thesis Statement) yang kuat serta penggunaan paragraf kohesif.",
      format: "Sajikan panduan terstruktur: (1) Struktur Pendahuluan + Tesis, (2) Paragraf Isi menggunakan formula PEEL (Point, Explanation, Example, Link), (3) Paragraf Kesimpulan yang meresumasi, serta (4) Daftar 5 frasa transisi akademis tingkat lanjut."
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
    id: "email-profesional",
    title: "Asisten Surel Hubungan Profesional",
    category: "Umum",
    description: "Draf korespondensi email formal yang taktis, persuasif, sopan, dan berorientasi win-win.",
    icon: "Mail",
    userRequest: "Bikin draf email formal minta kerja sama magang mahasiswa ke perusahaan startup.",
    defaultStructure: {
      role: "Bertindaklah sebagai Manajer Hubungan Masyarakat (PR Manager) dan Pakar Komunikasi Bisnis Korporat.",
      task: "Tulis draf email formal persuasif untuk mengajukan proposal kemitraan program magang industri universitas kepada CEO startup teknologi.",
      context: "Surel dikirim atas nama institusi atau mahasiswa tingkat akhir. Nada bahasa harus sangat sopan, profesional, percaya diri, ringkas, dan membeberkan nilai keuntungan mutualisme bagi perusahaan penerima magang.",
      format: "Sajikan draf email siap kirim lengkap dengan: Baris Subjek (Subject Line) yang menarik, Salam Hormat, Paragraf Pembuka, Nilai Tambah Kolaborasi (dalam poin-poin tebal), Call to Action (CTA) konfirmasi pertemuan virtual, dan Salam Penutup."
    }
  },
  {
    id: "konten-edukasi",
    title: "Pembuat Script Konten Edukasi",
    category: "Umum",
    description: "Naskah video berdurasi pendek (TikTok/Reels) yang edukatif, berdaya pikat tinggi, dan berbasis sains.",
    icon: "Share2",
    userRequest: "Bikin naskah video tiktok edukasi sosiologi tentang kenapa orang suka gosip.",
    defaultStructure: {
      role: "Bertindaklah sebagai Pembuat Konten Edukatif (Edu-Creator) berpengaruh dan Sosiolog Populer.",
      task: "Susun naskah skenario video pendek berdurasi 60 detik yang menjelaskan fenomena psikologi sosial mengapa manusia senang bergosip.",
      context: "Platform target adalah TikTok atau Instagram Reels dengan demografi audiens milenial dan Gen-Z. Naskah harus diawali dengan 'Hook' emosional/pertanyaan pemantik 3 detik pertama untuk menahan atensi penonton agar tidak berpindah video.",
      format: "Sajikan naskah dalam format naskah dua kolom: (1) Kolom Petunjuk Visual (pergerakan kamera, ekspresi, transisi), (2) Kolom Audio (kalimat lisan narator, efek suara, backsound), diakhiri dengan ajakan bertindak (CTA) interaksi kolom komentar."
    }
  }
];
