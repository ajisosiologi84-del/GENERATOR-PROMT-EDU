import { useState, useEffect } from "react";
import { GeneratedPrompt } from "../types";
import { Sliders, Copy, Check, Save, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ManualBuilderProps {
  onPromptGenerated: (prompt: GeneratedPrompt) => void;
}

const ROLE_PRESETS = [
  { label: "Guru Fisika SMA (Ramah)", value: "Bertindaklah sebagai seorang guru fisika SMA yang ramah, asyik, dan senang mengajar menggunakan contoh kontekstual." },
  { label: "Dosen Sosiologi (Analitis)", value: "Bertindaklah sebagai dosen sosiologi universitas yang berpengetahuan luas, analitis, dan mendidik dengan pendekatan sosiologis." },
  { label: "Guru SD (Sabar & Kreatif)", value: "Bertindaklah sebagai guru sekolah dasar yang sangat sabar, kreatif, penuh energi, dan mengajar lewat cerita menyenangkan." },
  { label: "Mentor Coding (Santai)", value: "Bertindaklah sebagai mentor pemrograman komputer yang santai, menyukai humor teknologi, dan ahli menyederhanakan kode." },
  { label: "Konselor Sekolah (Empatis)", value: "Bertindaklah sebagai konselor sekolah atau guru bimbingan konseling yang empatis, hangat, ramah, dan bersahabat." },
  { label: "Siswa Belajar Mandiri", value: "Bertindaklah sebagai siswa berprestasi yang sedang merangkum materi secara mandiri dengan bahasa yang mudah diingat." }
];

const TASK_PRESETS = [
  { label: "Membuat RPP / Modul Ajar", value: "Buatlah rencana pelaksanaan pembelajaran (RPP) atau modul ajar yang detail untuk satu pertemuan pertemuan kelas." },
  { label: "Menyusun Soal Kuis (HOTS)", value: "Buatlah 5 butir soal pilihan ganda berbasis analisis kritis tingkat tinggi (HOTS - Higher Order Thinking Skills) lengkap dengan kunci jawaban." },
  { label: "Menjelaskan Konsep Rumit", value: "Jelaskan secara mendalam namun sederhana konsep sains/teoretis yang sering dianggap sulit oleh pelajar." },
  { label: "Memberikan Feedback Ulasan", value: "Berikan ulasan dan umpan balik yang membangun serta mendidik (sandwich feedback) untuk draf esai atau tugas penulisan." },
  { label: "Merancang Peta Pikiran", value: "Rancanglah struktur outline peta pikiran (mind map) yang logis dan terurut untuk memudahkan belajar mandiri menghadapi ujian." }
];

const CONTEXT_PRESETS = [
  { label: "Kurikulum Merdeka (SMP)", value: "Target audiensnya adalah siswa kelas 7 SMP yang menerapkan Kurikulum Merdeka. Gunakan istilah sederhana dan relevan dengan kehidupan mereka sehari-hari." },
  { label: "Siswa SMA Kelas 11 (Fokus)", value: "Target murid adalah kelas 11 SMA. Berikan tantangan pemikiran kritis yang sesuai dengan perkembangan kognitif mereka dan hindari hafalan murni." },
  { label: "Mahasiswa S1 (Akademis)", value: "Pembaca adalah mahasiswa S1 semester awal. Sertakan rujukan teoritis ringan namun dikemas secara menarik agar tidak kaku." },
  { label: "Umum / Orang Awam", value: "Targetnya adalah masyarakat umum yang belum memiliki latar belakang formal di bidang ini. Hindari rumus matematis atau jargon teknis yang membingungkan." }
];

const FORMAT_PRESETS = [
  { label: "Tabel Kegiatan Terstruktur", value: "Sajikan hasil akhir dalam format tabel yang rapi, memuat kolom rincian kegiatan pembelajaran, alokasi waktu, serta poin penting." },
  { label: "Daftar Poin-poin (Bullet)", value: "Sajikan dalam bentuk daftar butir-butir terurut (bullet points) yang ringkas, berbobot, mudah dibaca cepat, dan informatif." },
  { label: "Narasi Ringkas & Analogi", value: "Sajikan penjelasan dalam bentuk narasi pendek (maksimal 400 kata) yang mengalir secara bercerita dilengkapi analogi visual konkret." },
  { label: "Format Dokumen Resmi (Emoji)", value: "Sajikan sebagai laporan atau dokumen terstruktur formal dengan pembagian bab (Pendahuluan, Isi, Penutup) dilengkapi ikon emoji sebagai pemanis visual." }
];

export default function ManualBuilder({ onPromptGenerated }: ManualBuilderProps) {
  const [role, setRole] = useState(ROLE_PRESETS[0].value);
  const [task, setTask] = useState(TASK_PRESETS[0].value);
  const [context, setContext] = useState(CONTEXT_PRESETS[0].value);
  const [format, setFormat] = useState(FORMAT_PRESETS[0].value);

  const [customRole, setCustomRole] = useState("");
  const [customTask, setCustomTask] = useState("");
  const [customContext, setCustomContext] = useState("");
  const [customFormat, setCustomFormat] = useState("");

  const [useCustomRole, setUseCustomRole] = useState(false);
  const [useCustomTask, setUseCustomTask] = useState(false);
  const [useCustomContext, setUseCustomContext] = useState(false);
  const [useCustomFormat, setUseCustomFormat] = useState(false);

  const [compiledPrompt, setCompiledPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  // Compile prompt dynamically
  useEffect(() => {
    const finalRole = useCustomRole ? customRole : role;
    const finalTask = useCustomTask ? customTask : task;
    const finalContext = useCustomContext ? customContext : context;
    const finalFormat = useCustomFormat ? customFormat : format;

    const parts = [];
    parts.push("# PROMPT ASISTEN INTELLIGENT [OPTIMAL UNTUK GEMINI AI & NOTEBOOKLM]");
    if (finalRole.trim()) parts.push(`### 🎭 PERAN (ROLE)\n${finalRole.trim()}`);
    if (finalTask.trim()) parts.push(`### 📋 TUGAS (TASK)\n${finalTask.trim()}`);
    if (finalContext.trim()) parts.push(`### 📌 KONTEKS (CONTEXT)\n${finalContext.trim()}\n\n*(Catatan Khusus NotebookLM: Jika dijalankan di NotebookLM, asisten ini wajib memprioritaskan analisis berdasarkan file dokumen rujukan atau sumber data (sources) yang Anda unggah.)*`);
    if (finalFormat.trim()) parts.push(`### 📊 FORMAT OUTPUT (FORMAT)\n${finalFormat.trim()}`);

    setCompiledPrompt(parts.join("\n\n"));
  }, [
    role, task, context, format,
    customRole, customTask, customContext, customFormat,
    useCustomRole, useCustomTask, useCustomContext, useCustomFormat
  ]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(compiledPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = () => {
    setRole(ROLE_PRESETS[0].value);
    setTask(TASK_PRESETS[0].value);
    setContext(CONTEXT_PRESETS[0].value);
    setFormat(FORMAT_PRESETS[0].value);
    setUseCustomRole(false);
    setUseCustomTask(false);
    setUseCustomContext(false);
    setUseCustomFormat(false);
    setCustomRole("");
    setCustomTask("");
    setCustomContext("");
    setCustomFormat("");
  };

  const handleSave = () => {
    const newPrompt: GeneratedPrompt = {
      id: "manual-" + Math.random().toString(36).substring(2, 9),
      userRequest: "Tuning Manual",
      promptSiapPakai: compiledPrompt,
      struktur: {
        role: useCustomRole ? customRole : role,
        task: useCustomTask ? customTask : task,
        context: useCustomContext ? customContext : context,
        format: useCustomFormat ? customFormat : format,
      },
      tips: "Ini adalah prompt yang dirakit secara manual. Anda dapat menyuntingnya kembali sesuai kebutuhan kelas.",
      createdAt: new Date().toISOString(),
      isFavorite: true
    };
    onPromptGenerated(newPrompt);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-full" id="manual-builder-panel">
      {/* Configuration Controls (Left) */}
      <div className="xl:col-span-7 flex flex-col gap-5 bg-white p-5 rounded-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2 font-display">
            <Sliders className="w-4 h-4 text-indigo-500" />
            Parameter Pembentuk Prompt
          </h3>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-rose-600 transition-colors bg-slate-100 px-2 py-1 rounded"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Ulang
          </button>
        </div>

        {/* 1. ROLE */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-mono flex items-center justify-center">1</span>
              Peran (Role)
            </label>
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 cursor-pointer">
              <input
                type="checkbox"
                checked={useCustomRole}
                onChange={(e) => setUseCustomRole(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/30 w-3.5 h-3.5"
              />
              Teks Kustom
            </label>
          </div>
          {useCustomRole ? (
            <textarea
              value={customRole}
              onChange={(e) => setCustomRole(e.target.value)}
              placeholder="Contoh: Bertindaklah sebagai pakar sains populer..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 min-h-[60px] resize-none"
            />
          ) : (
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 cursor-pointer"
            >
              {ROLE_PRESETS.map((preset, i) => (
                <option key={i} value={preset.value}>{preset.label}</option>
              ))}
            </select>
          )}
        </div>

        {/* 2. TASK */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-teal-100 text-teal-700 text-[10px] font-mono flex items-center justify-center">2</span>
              Tugas (Task)
            </label>
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 cursor-pointer">
              <input
                type="checkbox"
                checked={useCustomTask}
                onChange={(e) => setUseCustomTask(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/30 w-3.5 h-3.5"
              />
              Teks Kustom
            </label>
          </div>
          {useCustomTask ? (
            <textarea
              value={customTask}
              onChange={(e) => setCustomTask(e.target.value)}
              placeholder="Contoh: Rancang skenario roleplay mitigasi bencana..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 min-h-[60px] resize-none"
            />
          ) : (
            <select
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 cursor-pointer"
            >
              {TASK_PRESETS.map((preset, i) => (
                <option key={i} value={preset.value}>{preset.label}</option>
              ))}
            </select>
          )}
        </div>

        {/* 3. CONTEXT */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 text-[10px] font-mono flex items-center justify-center">3</span>
              Konteks (Context)
            </label>
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 cursor-pointer">
              <input
                type="checkbox"
                checked={useCustomContext}
                onChange={(e) => setUseCustomContext(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/30 w-3.5 h-3.5"
              />
              Teks Kustom
            </label>
          </div>
          {useCustomContext ? (
            <textarea
              value={customContext}
              onChange={(e) => setCustomContext(e.target.value)}
              placeholder="Contoh: Target audiens adalah murid berkebutuhan khusus..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 min-h-[60px] resize-none"
            />
          ) : (
            <select
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 cursor-pointer"
            >
              {CONTEXT_PRESETS.map((preset, i) => (
                <option key={i} value={preset.value}>{preset.label}</option>
              ))}
            </select>
          )}
        </div>

        {/* 4. FORMAT */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-700 text-[10px] font-mono flex items-center justify-center">4</span>
              Format
            </label>
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 cursor-pointer">
              <input
                type="checkbox"
                checked={useCustomFormat}
                onChange={(e) => setUseCustomFormat(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/30 w-3.5 h-3.5"
              />
              Teks Kustom
            </label>
          </div>
          {useCustomFormat ? (
            <textarea
              value={customFormat}
              onChange={(e) => setCustomFormat(e.target.value)}
              placeholder="Contoh: Sajikan dalam format file markdown lengkap..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 min-h-[60px] resize-none"
            />
          ) : (
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 cursor-pointer"
            >
              {FORMAT_PRESETS.map((preset, i) => (
                <option key={i} value={preset.value}>{preset.label}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Realtime Live Preview (Right) */}
      <div className="xl:col-span-5 flex flex-col gap-4">
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl flex-1 flex flex-col gap-4 text-slate-100">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold tracking-wider uppercase text-teal-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              Live Preview Prompt
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                disabled={!compiledPrompt.trim()}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                  copied
                    ? "bg-teal-500 text-slate-950"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3" />
                    Tersalin
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Salin
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
            <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-300 min-h-[250px] selection:bg-slate-700">
              {compiledPrompt || "// Konfigurasikan parameter di sebelah kiri untuk melihat hasil rakitan di sini."}
            </pre>
          </div>

          <button
            onClick={handleSave}
            disabled={!compiledPrompt.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl disabled:opacity-50 disabled:hover:bg-teal-600 transition-all cursor-pointer shadow-md shadow-teal-950/25"
          >
            <Save className="w-4 h-4" />
            Simpan Hasil Rakitan ke Riwayat
          </button>
        </div>
      </div>
    </div>
  );
}
