import { useState, useEffect, FormEvent } from "react";
import { GeneratedPrompt } from "../types";
import { Wand2, Sparkles, ArrowRight, Lightbulb, AlertCircle, BookOpen, GraduationCap, Users, Bookmark, Image } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AutoGeneratorProps {
  onPromptGenerated: (prompt: GeneratedPrompt) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const QUICK_TESTS_BY_CATEGORY = {
  Guru: [
    {
      label: "Modul Ajar / RPP Fotosintesis SMP",
      request: "Bikinkan saya RPP tentang fotosintesis untuk kelas 7 SMP dengan metode eksperimen sederhana Kurikulum Merdeka."
    },
    {
      label: "Rubrik Penilaian Sikap Kerja Kelompok",
      request: "Buat rubrik penilaian sikap gotong royong siswa saat kerja kelompok kelas SMP dalam bentuk tabel."
    },
    {
      label: "Strategi Diferensiasi Membaca SD",
      request: "Rancang strategi mengajar membaca di kelas 3 SD yang ada anak belum lancar mengeja dan yang sudah mahir pemahaman."
    }
  ],
  Dosen: [
    {
      label: "Evaluasi Sandwich Feedback Esai",
      request: "Berikan ulasan esai mahasiswa sosiologi digital mengenai dampak perubahan budaya akibat digitalisasi."
    },
    {
      label: "Kerangka RPS Sosiologi Komunitas",
      request: "Rancangkan RPS silabus kuliah Pengantar Sosiologi Komunitas semester 3 tingkat S1 Universitas."
    },
    {
      label: "Ulasan Kritis (Peer Review) Jurnal",
      request: "Lakukan telaah kritis draf naskah artikel ilmiah tentang partisipasi politik pemilih pemula di era digital."
    }
  ],
  Siswa: [
    {
      label: "Konsep Loops Python Anak SMP",
      request: "Jelaskan coding Python tentang perulangan (loops) buat anak SMP dengan analogi menarik."
    },
    {
      label: "Penjelasan Visual Logaritma",
      request: "Jelaskan logaritma dengan gampang secara visual agar saya tidak bingung menghafal sifat-sifat rumusnya."
    },
    {
      label: "Panduan IELTS Opinion Essay",
      request: "Bagaimana struktur menulis opinion essay bahasa inggris tentang peran teknologi di kelas menggunakan metode PEEL?"
    }
  ],
  Umum: [
    {
      label: "Analogi Ruang-Waktu & Gravitasi",
      request: "Jelaskan konsep gaya gravitasi dan kelengkungan ruang waktu Einstein kepada masyarakat awam."
    },
    {
      label: "Surel Formal Kolaborasi Magang",
      request: "Bikin draf email formal persuasif mengajukan kerja sama program magang mahasiswa ke perusahaan startup teknologi."
    },
    {
      label: "Naskah Video Reels/TikTok Edukatif",
      request: "Tulis naskah video berdurasi 60 detik tentang penjelasan sosiologi mengapa manusia senang bergosip."
    }
  ],
  Gambar: [
    {
      label: "Foto Sejarah Borobudur Realistik",
      request: "Buat prompt gambar rekonstruksi pembangunan Candi Borobudur abad ke-9 yang realistik, detail tinggi, golden hour lighting."
    },
    {
      label: "Ilustrasi Cat Air Metamorfosis",
      request: "Rancang prompt ilustrasi watercolor daur hidup kupu-kupu yang imut dan estetis untuk media belajar anak SD."
    },
    {
      label: "Maskot 3D Clay Burung Hantu",
      request: "Buat prompt karakter mainan 3D clay burung hantu pintar memakai kacamata memegang buku tebal dengan clean studio lighting."
    }
  ]
};

const PLACEHOLDERS_BY_CATEGORY = {
  Guru: "Contoh: Buatkan modul ajar interaktif fisika SMA tentang hukum Newton dengan aktivitas praktikum...",
  Dosen: "Contoh: Berikan umpan balik konstruktif akademik terhadap draf artikel jurnal sosiologi pembangunan mahasiswa...",
  Siswa: "Contoh: Jelaskan secara sederhana cara kerja listrik dinamis disertai analogi air mengalir untuk anak SMP...",
  Umum: "Contoh: Susun draf email formal pengajuan kemitraan program CSR universitas ke startup teknologi...",
  Gambar: "Contoh: Desain foto pemandangan pegunungan bersalju di Swiss, ultra-realistik, cinematic lighting, aspect ratio 16:9..."
};

const LOADING_STEPS = [
  "Menganalisis kebutuhan rekayasa prompt...",
  "Merumuskan Peran (Role) terbaik khusus untuk target kelompok...",
  "Menyusun instruksi Tugas (Task) terperinci dan mendalam...",
  "Menambahkan batasan Konteks (Context) pembelajaran yang pas...",
  "Merancang pola Format keluaran ideal siap salin...",
  "Menggabungkan ke dalam Prompt Super..."
];

// Heuristic Generator if backend is 404, offline, or unavailable (e.g. deployed on static platforms like Vercel)
export function generateLocalFallback(userRequest: string, category: "Guru" | "Dosen" | "Siswa" | "Umum" | "Gambar" = "Guru") {
  const reqLower = userRequest.toLowerCase();
  
  let role = "Bertindaklah sebagai pendidik profesional dan ahli materi pembelajaran yang kompeten.";
  let task = `Bantu saya menyusun rencana, materi, atau instrumen mengenai "${userRequest}".`;
  let context = "Target audiensnya adalah peserta didik/siswa yang membutuhkan penjelasan mendalam, ramah, dan mudah dipahami dengan analogi kontekstual.";
  let format = "Sajikan dalam format dokumen terstruktur yang rapi, lengkap dengan poin-poin penting, penjelasan bertahap, dan ringkasan interaktif.";
  let tips = "Tips: Anda dapat menyesuaikan tingkat kelas (misalnya SD/SMP/SMA) atau menambahkan durasi waktu pelaksanaan kegiatan agar lebih presisi.";

  // Use selected category to build a specialized base structure first
  if (category === "Guru") {
    role = "Bertindaklah sebagai Guru Senior dan Konsultan Pendidikan Sekolah yang ahli di bidang materi ajar Kurikulum Merdeka.";
    task = `Rancang modul ajar, rencana pembelajaran (RPP), materi ajar, atau instrumen asesmen yang berfokus pada: "${userRequest}".`;
    context = "Target audiensnya adalah siswa sekolah yang membutuhkan penjelasan interaktif, keterlibatan aktif, serta pertanyaan pemantik diskusi yang melatih berpikir kritis.";
    format = "Sajikan dalam format dokumen ajar/RPP yang terstruktur rapi, lengkap dengan poin-poin langkah kegiatan (Pendahuluan, Inti, Penutup), durasi waktu, alat bahan, serta instrumen penilaian.";
    tips = "Tips: Cantumkan kelompok umur, jenjang kelas (misal: SD/SMP/SMA), serta estimasi alokasi waktu pengajaran agar hasilnya lebih pas.";
  } else if (category === "Dosen") {
    role = "Bertindaklah sebagai Profesor/Dosen Senior sekaligus Peneliti Akademik berpengetahuan luas yang aktif menulis publikasi ilmiah.";
    task = `Susun panduan akademik, telaah kritis (peer review), kerangka silabus/RPS, atau ulasan ilmiah mendalam mengenai: "${userRequest}".`;
    context = "Target audiens adalah mahasiswa perguruan tinggi, sejawat akademisi, atau peneliti yang mengutamakan ketepatan teori sosiologi/pendidikan, keruntutan gagasan, kebaruan sains (novelty), serta referensi literatur valid.";
    format = "Sajikan dalam format draf tulisan akademis terstruktur dengan analisis teoretis tajam, argumen yang koheren, serta daftar masukan perbaikan secara profesional.";
    tips = "Tips: Sebutkan kerangka teori sosiologi/sains tertentu atau pedoman gaya penulisan jurnal (misal: APA/Harvard) yang ingin Anda pakai.";
  } else if (category === "Siswa") {
    role = "Bertindaklah sebagai Tutor Pembelajaran Efektif (Study Coach) yang asyik, sabar, seru, dan terampil melatih konsep akademis sulit menjadi gampang.";
    task = `Bantu saya memahami, merangkum, membuat peta pikiran (mind map), atau menyelesaikan materi belajar mandiri terkait: "${userRequest}".`;
    context = "Saya adalah seorang pelajar/murid yang ingin memahami konsep esensial secara menyeluruh, bersiap menghadapi ujian sekolah, dan menghindari hafalan buta.";
    format = "Sajikan penjelasan ramah bersahabat secara bertahap dengan analogi kreatif dari kehidupan nyata sehari-hari, batasi rumus-rumus rumit atau istilah kaku tanpa keterangan, dan selipkan satu kuis mini menyenangkan di akhir.";
    tips = "Tips: Anda bisa meminta tutor ini untuk memberikan jembatan keledai (metode mnemonik) unik agar mempermudah mengingat materi sulit.";
  } else if (category === "Umum") {
    role = "Bertindaklah sebagai Asisten Rekayasa Prompt Kreatif, Penulis Profesional, dan Ahli Komunikasi Bisnis yang terampil menyusun rencana taktis.";
    task = `Bantu saya merancang rencana kegiatan, draf korespondensi email formal, skenario naskah video edukatif, atau tulisan produktivitas mengenai: "${userRequest}".`;
    context = "Ditujukan untuk keperluan komunikasi umum, profesionalisme kerja, publikasi media sosial, atau penjelasan populer kepada masyarakat luas. Fokuskan pada kejelasan pesan dan persuasivitas yang memikat.";
    format = "Sajikan dalam draf tulisan siap pakai yang ringkas, berdaya pikat tinggi, mengalir logis, lengkap dengan instruksi teknis pelengkap (seperti petunjuk visual/audio naskah atau subjek surel).";
    tips = "Tips: Tambahkan info audiens target spesifik (misal: calon mitra usaha, penonton TikTok, atau pelanggan baru) dan batasan panjang tulisan.";
  } else if (category === "Gambar") {
    role = "Bertindaklah sebagai Art Director, Fotografer Profesional, dan Ahli Pengarah Gaya Visual Kecerdasan Buatan.";
    task = `Buatkan deskripsi visual/prompt bahasa Inggris yang sangat detail dan spesifik untuk AI Image Generator (seperti Midjourney atau DALL-E 3) mengenai: "${userRequest}".`;
    context = "Kebutuhan gambar adalah untuk menghasilkan visual berkualitas tinggi, tajam, dengan pencahayaan dramatis (misal: golden hour, volumetric lighting), komposisi sinematik, detail tekstur menawan, serta rasio aspek yang sesuai.";
    format = "Sajikan teks prompt bahasa Inggris utama yang siap disalin dalam sebuah blok kode (code block), lalu sertakan tips parameter teknis (misalnya rasio aspek --ar, style, quality) serta rekomendasi gaya seni pendukung dalam bahasa Indonesia.";
    tips = "Tips: Tentukan gaya seni (seperti 3D Render, Watercolor, Photorealistic, Cyberpunk, Oil Painting) agar kecocokan estetika visual makin sempurna.";
  }

  // Refine structures if we detect specific keyword matches
  if (reqLower.includes("rpp") || reqLower.includes("fotosintesis") || reqLower.includes("pelajaran") || reqLower.includes("rencana")) {
    role = "Bertindaklah sebagai ahli kurikulum dan Guru Senior yang berpengalaman dalam menyusun bahan ajar interaktif.";
    task = `Buatlah Rencana Pelaksanaan Pembelajaran (RPP) atau Modul Ajar lengkap untuk topik: "${userRequest}".`;
    context = "Target adalah siswa sekolah dengan fokus pembelajaran aktif. Rencana harus mencakup metode interaktif, pertanyaan pemantik, serta alat/bahan yang dibutuhkan.";
    format = "Sajikan secara terstruktur dengan bagian Pendahuluan, Kegiatan Inti (langkah demi langkah), Penutup, serta rubrik evaluasi sederhana.";
    tips = "Tips: Tambahkan alokasi waktu spesifik per sesi (misalnya 2x35 menit) dan metode pembelajaran tertentu seperti Discovery Learning.";
  } else if (reqLower.includes("soal") || reqLower.includes("kuis") || reqLower.includes("esai") || reqLower.includes("ujian") || reqLower.includes("test")) {
    role = "Bertindaklah sebagai Dosen atau Guru Senior pembuat instrumen evaluasi pendidikan yang terakreditasi.";
    task = `Susunlah daftar pertanyaan atau soal latihan mengenai: "${userRequest}".`;
    context = "Gunakan konsep berpikir kritis tingkat tinggi (HOTS - Higher Order Thinking Skills). Hindari pertanyaan yang sifatnya hanya hafalan teoritis belaka.";
    format = "Sajikan soal secara bernomor lengkap dengan petunjuk pengerjaan, kunci jawaban yang mendalam, serta kriteria penskoran yang jelas.";
    tips = "Tips: Anda dapat menentukan jumlah butir soal yang spesifik (misalnya 'buat 10 soal') dan tingkat kesulitan (mudah/sedang/sulit) dalam prompt Anda.";
  } else if (reqLower.includes("coding") || reqLower.includes("python") || reqLower.includes("program") || reqLower.includes("javascript") || reqLower.includes("html") || reqLower.includes("css")) {
    role = "Bertindaklah sebagai Mentor Coding senior yang asyik, santai, sabar, dan terampil menyederhanakan kode yang rumit.";
    task = `Jelaskan secara fundamental dengan contoh implementasi kode pemrograman mengenai: "${userRequest}".`;
    context = "Siswa adalah pemula yang baru pertama kali mengenal sintaks pemrograman. Gunakan analogi kreatif dari kehidupan nyata untuk menjelaskan konsep abstrak.";
    format = "Sajikan penjelasan singkat yang interaktif, diikuti baris potongan kode (code blocks) yang bersih disertai komentar baris, dan akhiri dengan tantangan praktis.";
    tips = "Tips: Anda bisa meminta bahasa pemrograman yang spesifik (seperti C++, Java, Python) atau fokus pada library tertentu pada prompt lanjutan.";
  } else if (reqLower.includes("jelaskan") || reqLower.includes("paham") || reqLower.includes("konsep") || reqLower.includes("apa itu")) {
    role = "Bertindaklah sebagai Komunikator Edukasi Sains populer yang ahli dalam menyederhanakan teori kompleks untuk publik.";
    task = `Buatlah penjelasan komprehensif yang mudah dipahami tentang: "${userRequest}".`;
    context = "Masyarakat atau siswa belum memiliki dasar keahlian di bidang ini. Gunakan kiasan atau skenario sehari-hari dan batasi jargon teknis yang berat.";
    format = "Sajikan dengan penjelasan naratif yang mengalir akrab, menggunakan poin-poin ringkas untuk kesimpulan, serta sebuah ilustrasi perbandingan visual.";
    tips = "Tips: Anda bisa menyematkan batasan kata (misalnya 'maksimal 300 kata') untuk mengontrol kerapatan informasi.";
  }

  const promptSiapPakai = `# PROMPT ASISTEN INTELLIGENT [OPTIMAL UNTUK GEMINI AI & NOTEBOOKLM]

### 🎭 PERAN (ROLE)
${role}

### 📋 TUGAS (TASK)
${task}

### 📌 KONTEKS (CONTEXT)
${context}${category !== "Gambar" ? '\n\n*(Catatan Khusus NotebookLM: Jika dijalankan di NotebookLM, asisten ini wajib memprioritaskan analisis berdasarkan file dokumen rujukan atau sumber data (sources) yang Anda unggah.)*' : ''}

### 📊 FORMAT OUTPUT (FORMAT)
${format}`;

  return {
    promptSiapPakai,
    struktur: { role, task, context, format },
    tips,
    isLocalFallback: true
  };
}

export default function AutoGenerator({
  onPromptGenerated,
  isLoading,
  setIsLoading,
}: AutoGeneratorProps) {
  const [selectedCategory, setSelectedCategory] = useState<"Guru" | "Dosen" | "Siswa" | "Umum" | "Gambar">("Guru");
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [progress, setProgress] = useState(0);

  // Cycle loading messages and progress percentage when loading
  useEffect(() => {
    let intervalSteps: NodeJS.Timeout;
    let intervalProgress: NodeJS.Timeout;

    if (isLoading) {
      setLoadingStep(0);
      setProgress(0);

      // Cycle loading text steps every 2 seconds
      intervalSteps = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 2000);

      // Decelerating progress simulation: starts fast, slows down as it approaches 99%
      intervalProgress = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 98) return 98; // Hold at 98% until finished
          const remainder = 100 - prev;
          const increment = Math.max(1, Math.floor(remainder * 0.12));
          return prev + increment;
        });
      }, 250);
    }

    return () => {
      clearInterval(intervalSteps);
      clearInterval(intervalProgress);
    };
  }, [isLoading]);

  const handleGenerate = async (textToGenerate: string, overrideCategory?: "Guru" | "Dosen" | "Siswa" | "Umum" | "Gambar") => {
    const targetCategory = overrideCategory || selectedCategory;
    if (!textToGenerate.trim()) return;
    setIsLoading(true);
    setError(null);

    let data;
    try {
      const response = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userRequest: textToGenerate.trim(),
          category: targetCategory
        }),
      });

      if (!response.ok) {
        // If it's a 404 (not found e.g. Vercel deployment without custom serverless routing) 
        // or a server error (500/502/503), trigger the client-side fallback gracefully instead of crashing
        if (response.status === 404 || response.status >= 500) {
          console.warn(`Server responded with status ${response.status}. Falling back to high-quality client-side prompt builder.`);
          data = generateLocalFallback(textToGenerate, targetCategory);
        } else {
          let errMsg = "Gagal menghubungi server untuk membuat prompt.";
          try {
            const errData = await response.json();
            errMsg = errData.error || errMsg;
          } catch (parseErr) {
            errMsg = `Server error (${response.status}): Gagal memproses permintaan AI.`;
          }
          throw new Error(errMsg);
        }
      } else {
        try {
          data = await response.json();
        } catch (parseErr) {
          throw new Error("Respons dari server tidak valid (bukan JSON).");
        }
      }
    } catch (err: any) {
      console.warn("API Call failed. Utilizing client-side heuristic generator fallback...", err);
      // Perfect seamless fallback for static platforms like Vercel or offline environments
      data = generateLocalFallback(textToGenerate, targetCategory);
    }

    try {
      const newPrompt: GeneratedPrompt = {
        id: Math.random().toString(36).substring(2, 9),
        userRequest: textToGenerate.trim(),
        promptSiapPakai: data.promptSiapPakai,
        struktur: data.struktur,
        tips: data.tips,
        createdAt: new Date().toISOString(),
        isFavorite: false
      };

      // Instantly set progress to 100% on success and delay closing for nice feedback
      setProgress(100);
      await new Promise((resolve) => setTimeout(resolve, 500));

      onPromptGenerated(newPrompt);
    } catch (err: any) {
      console.error(err);
      setError("Gagal merangkai hasil prompt. Silakan ulangi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleGenerate(input);
  };

  return (
    <div className="flex flex-col gap-6" id="auto-generator-panel">
      {/* Introduction Card */}
      <div className="p-5 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl border border-teal-100 flex gap-4 items-start shadow-sm">
        <div className="p-2.5 bg-teal-500 rounded-xl text-white shadow-md shadow-teal-500/20">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-teal-900 font-display">Asisten Kecerdasan Rekayasa Prompt AI</h3>
          <p className="text-xs text-teal-800 leading-relaxed">
            Rakit prompt bersertifikasi edukatif secara otomatis. Tentukan target sasaran asisten pembelajaran Anda di bawah ini, ketik ide dasar Anda, dan saksikan AI menstrukturkan instruksi berkualitas tinggi.
          </p>
        </div>
      </div>

      {/* Target User / Category Segmented Selector */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
          <Bookmark className="w-3.5 h-3.5 text-teal-600" />
          1. Pilih Target Sasaran Asisten
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200" id="generator-target-category">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("Guru");
              if (!input) setInput("");
            }}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === "Guru"
                ? "bg-white text-teal-700 shadow-sm"
                : "text-slate-600 hover:bg-slate-50/50"
            }`}
          >
            <BookOpen className="w-4 h-4 text-blue-500" />
            Guru
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("Dosen");
              if (!input) setInput("");
            }}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === "Dosen"
                ? "bg-white text-teal-700 shadow-sm"
                : "text-slate-600 hover:bg-slate-50/50"
            }`}
          >
            <GraduationCap className="w-4 h-4 text-purple-500" />
            Dosen
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("Siswa");
              if (!input) setInput("");
            }}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === "Siswa"
                ? "bg-white text-teal-700 shadow-sm"
                : "text-slate-600 hover:bg-slate-50/50"
            }`}
          >
            <Users className="w-4 h-4 text-teal-500" />
            Murid/Siswa
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("Umum");
              if (!input) setInput("");
            }}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === "Umum"
                ? "bg-white text-teal-700 shadow-sm"
                : "text-slate-600 hover:bg-slate-50/50"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Umum
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("Gambar");
              if (!input) setInput("");
            }}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer col-span-2 sm:col-span-1 ${
              selectedCategory === "Gambar"
                ? "bg-white text-teal-700 shadow-sm"
                : "text-slate-600 hover:bg-slate-50/50"
            }`}
          >
            <Image className="w-4 h-4 text-rose-500" />
            Gambar
          </button>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="user-topic" className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
            <Wand2 className="w-3.5 h-3.5 text-teal-600" />
            2. Ide Kasar atau Kebutuhan Instruksi
          </label>
          <div className="relative">
            <textarea
              id="user-topic"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={PLACEHOLDERS_BY_CATEGORY[selectedCategory]}
              disabled={isLoading}
              rows={4}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-all shadow-inner placeholder:text-slate-400 disabled:opacity-50 resize-none"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute bottom-3 right-3 flex items-center justify-center p-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 disabled:opacity-40 disabled:hover:bg-teal-600 transition-all shadow-md shadow-teal-600/10 cursor-pointer"
              title="Kirim ke AI"
              id="submit-generate-btn"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Generate Button */}
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="w-full flex items-center justify-center gap-2 py-3 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50 disabled:hover:bg-teal-600 transition-all shadow-md shadow-teal-600/10 cursor-pointer"
        >
          <Wand2 className="w-4 h-4" />
          Rakit Prompt Super Sekarang
        </button>
      </form>

      {/* Quick Test Recommendations filtered by category */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          💡 Contoh Cepat ({selectedCategory})
        </span>
        <div className="flex flex-col gap-2">
          {QUICK_TESTS_BY_CATEGORY[selectedCategory].map((test, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInput(test.request);
                handleGenerate(test.request, selectedCategory);
              }}
              disabled={isLoading}
              className="text-left px-4 py-2.5 bg-slate-50 hover:bg-teal-50/50 hover:text-teal-950 border border-slate-200 hover:border-teal-200 rounded-xl text-xs text-slate-700 transition-all duration-200 flex items-center justify-between group disabled:opacity-50"
              id={`quick-test-btn-${selectedCategory.toLowerCase()}-${idx}`}
            >
              <span className="font-semibold truncate">{test.label}</span>
              <span className="text-[10px] text-slate-400 group-hover:text-teal-600 transition-colors font-mono flex items-center gap-1 flex-shrink-0">
                Uji Coba <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 items-start"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-red-800">Gagal Memproses</span>
              <p className="text-xs text-red-700 leading-relaxed">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full border border-slate-100 shadow-2xl flex flex-col items-center text-center gap-5"
            >
              {/* Custom Circular Progress Spinner with Centered Percentage */}
              <div className="relative flex items-center justify-center w-24 h-24">
                {/* SVG Radial Progress Background and Path */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    className="stroke-slate-100"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="48"
                    cy="48"
                    r="40"
                    className="stroke-teal-500"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 40}
                    animate={{
                      strokeDashoffset: 2 * Math.PI * 40 * (1 - progress / 100)
                    }}
                    transition={{ ease: "easeInOut", duration: 0.2 }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-xl font-extrabold text-slate-800 font-mono tracking-tighter">
                    {progress}%
                  </span>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">
                    Proses
                  </span>
                </div>
                {/* Decorative pulse effect when 100% */}
                {progress === 100 && (
                  <div className="absolute inset-0 rounded-full border-4 border-emerald-400 animate-ping opacity-45"></div>
                )}
              </div>

              <div className="flex flex-col gap-2 w-full mt-2">
                <h4 className="font-bold text-slate-800 font-display text-base">
                  Mempersiapkan Prompt Super
                </h4>
                
                {/* Simulated Steps Carousel */}
                <div className="h-6 overflow-hidden relative">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={loadingStep}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-xs text-teal-600 font-semibold truncate"
                    >
                      {LOADING_STEPS[loadingStep]}
                    </motion.p>
                  </AnimatePresence>
                </div>

                {/* Horizontal progress bar line under the text */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                  <motion.div
                    className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full"
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "easeInOut", duration: 0.2 }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
