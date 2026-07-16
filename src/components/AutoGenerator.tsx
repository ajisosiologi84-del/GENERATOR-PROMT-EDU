import { useState, useEffect, FormEvent } from "react";
import { GeneratedPrompt } from "../types";
import { Wand2, Sparkles, ArrowRight, Lightbulb, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AutoGeneratorProps {
  onPromptGenerated: (prompt: GeneratedPrompt) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const QUICK_TESTS = [
  {
    label: "RPP Fotosintesis (SMP)",
    request: "Bikinkan saya RPP tentang fotosintesis untuk kelas 7 SMP dengan metode eksperimen sederhana."
  },
  {
    label: "Soal Esai Sejarah Kemerdekaan",
    request: "Saya mau bikin soal esai sejarah kemerdekaan Indonesia yang menantang berpikir kritis siswa SMA."
  },
  {
    label: "Coding Python Anak SMP",
    request: "Jelaskan coding Python tentang perulangan (loops) buat anak SMP dengan cara yang menyenangkan."
  }
];

const LOADING_STEPS = [
  "Menganalisis konsep pembelajaran...",
  "Merumuskan Peran (Role) terbaik...",
  "Menyusun instruksi Tugas (Task) terperinci...",
  "Menambahkan batasan Konteks (Context)...",
  "Merancang pola Format keluaran ideal...",
  "Menggabungkan ke dalam Prompt Super..."
];

// Heuristic Generator if backend is 404, offline, or unavailable (e.g. deployed on static platforms like Vercel)
function generateLocalFallback(userRequest: string) {
  const reqLower = userRequest.toLowerCase();
  
  let role = "Bertindaklah sebagai pendidik profesional dan ahli materi pembelajaran yang kompeten.";
  let task = `Bantu saya menyusun rencana, materi, atau instrumen mengenai "${userRequest}".`;
  let context = "Target audiensnya adalah peserta didik/siswa yang membutuhkan penjelasan mendalam, ramah, dan mudah dipahami dengan analogi kontekstual.";
  let format = "Sajikan dalam format dokumen terstruktur yang rapi, lengkap dengan poin-poin penting, penjelasan bertahap, dan ringkasan interaktif.";
  let tips = "Tips: Anda dapat menyesuaikan tingkat kelas (misalnya SD/SMP/SMA) atau menambahkan durasi waktu pelaksanaan kegiatan agar lebih presisi.";

  if (reqLower.includes("rpp") || reqLower.includes("fotosintesis") || reqLower.includes("kurikulum") || reqLower.includes("pelajaran") || reqLower.includes("rencana")) {
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

  const promptSiapPakai = `${role}\n\n${task}\n\n${context}\n\n${format}`;

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

  const handleGenerate = async (textToGenerate: string) => {
    if (!textToGenerate.trim()) return;
    setIsLoading(true);
    setError(null);

    let data;
    try {
      const response = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userRequest: textToGenerate.trim() }),
      });

      if (!response.ok) {
        // If it's a 404 (not found e.g. Vercel deployment without custom serverless routing) 
        // or a server error (500/502/503), trigger the client-side fallback gracefully instead of crashing
        if (response.status === 404 || response.status >= 500) {
          console.warn(`Server responded with status ${response.status}. Falling back to high-quality client-side prompt builder.`);
          data = generateLocalFallback(textToGenerate);
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
      data = generateLocalFallback(textToGenerate);
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
          <h3 className="text-sm font-semibold text-teal-900 font-display">Rakit Prompt Instan dengan AI</h3>
          <p className="text-xs text-teal-800 leading-relaxed">
            Masukkan ide kasar, topik, atau kebutuhan materi ajar Anda. AI akan merangkumnya menjadi formula
            <strong> Peran, Tugas, Konteks, dan Format</strong> siap pakai secara otomatis.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="user-topic" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Topik Pembelajaran / Kebutuhan Anda
          </label>
          <div className="relative">
            <textarea
              id="user-topic"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Contoh: Buatkan kuis interaktif fisika SMA tentang gaya gesek..."
              disabled={isLoading}
              rows={4}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-all shadow-inner placeholder:text-slate-400 disabled:opacity-50 resize-none"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute bottom-3 right-3 flex items-center justify-center p-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-40 disabled:hover:bg-teal-600 transition-all shadow-md shadow-teal-600/10 cursor-pointer"
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

      {/* Quick Test Recommendations */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          💡 Rekomendasi Contoh Cepat
        </span>
        <div className="flex flex-col gap-2">
          {QUICK_TESTS.map((test, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInput(test.request);
                handleGenerate(test.request);
              }}
              disabled={isLoading}
              className="text-left px-4 py-2.5 bg-slate-50 hover:bg-teal-50/50 hover:text-teal-900 border border-slate-200 hover:border-teal-200 rounded-xl text-xs text-slate-700 transition-all duration-200 flex items-center justify-between group disabled:opacity-50"
              id={`quick-test-btn-${idx}`}
            >
              <span className="font-medium truncate">{test.label}</span>
              <span className="text-[10px] text-slate-400 group-hover:text-teal-600 transition-colors font-mono flex items-center gap-1">
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
