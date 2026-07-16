import { useState, useEffect } from "react";
import { GeneratedPrompt, PresetTemplate } from "./types";
import AutoGenerator from "./components/AutoGenerator";
import ManualBuilder from "./components/ManualBuilder";
import PresetList from "./components/PresetList";
import PromptHistory from "./components/PromptHistory";
import EducationGuide from "./components/EducationGuide";
import PromptCard from "./components/PromptCard";
import { 
  GraduationCap, Wand2, Sliders, Sparkles, History, 
  HelpCircle, BookOpen, Heart, ArrowRight, Lightbulb, BookmarkCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"auto" | "manual" | "preset" | "history" | "guide">("auto");
  const [activePrompt, setActivePrompt] = useState<GeneratedPrompt | null>(null);
  const [history, setHistory] = useState<GeneratedPrompt[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Load history from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("edu_prompt_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Gagal memuat riwayat dari localStorage", err);
    }
  }, []);

  // Save history to local storage when changed
  const saveToHistory = (newHistory: GeneratedPrompt[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem("edu_prompt_history", JSON.stringify(newHistory));
    } catch (err) {
      console.error("Gagal menyimpan riwayat ke localStorage", err);
    }
  };

  // Callback when a new prompt is created (AI or Manual)
  const handlePromptGenerated = (prompt: GeneratedPrompt) => {
    setActivePrompt(prompt);
    
    // Add to history if not already there (avoid duplication based on prompt string)
    const exists = history.some(item => item.promptSiapPakai === prompt.promptSiapPakai);
    if (!exists) {
      const updated = [prompt, ...history];
      saveToHistory(updated);
    }
  };

  // Toggle favorite status of a prompt in history
  const handleToggleFavorite = (id: string) => {
    const updated = history.map(item => {
      if (item.id === id) {
        const nextFav = !item.isFavorite;
        // If we are favoriting/unfavoriting the currently active prompt, update its state too
        if (activePrompt && activePrompt.id === id) {
          setActivePrompt({ ...activePrompt, isFavorite: nextFav });
        }
        return { ...item, isFavorite: nextFav };
      }
      return item;
    });
    saveToHistory(updated);
  };

  // Delete prompt from history
  const handleDeletePrompt = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    saveToHistory(updated);
    if (activePrompt && activePrompt.id === id) {
      setActivePrompt(null);
    }
  };

  // Update prompt contents from structural edits
  const handleUpdatePrompt = (updatedPrompt: GeneratedPrompt) => {
    setActivePrompt(updatedPrompt);
    const updatedHistory = history.map(item => {
      if (item.id === updatedPrompt.id) {
        return updatedPrompt;
      }
      return item;
    });
    saveToHistory(updatedHistory);
  };

  // Clear all history
  const handleClearHistory = () => {
    saveToHistory([]);
    setActivePrompt(null);
  };

  // Handle preset blueprint selection
  const handleSelectPreset = (preset: PresetTemplate) => {
    // 1. Create a prompt object directly from default structure
    if (preset.defaultStructure) {
      const generated: GeneratedPrompt = {
        id: preset.id,
        userRequest: preset.title,
        promptSiapPakai: `${preset.defaultStructure.role}\n\n${preset.defaultStructure.task}\n\n${preset.defaultStructure.context}\n\n${preset.defaultStructure.format}`,
        struktur: preset.defaultStructure,
        tips: "Ini adalah blueprint terstruktur untuk mempercepat pembuatan prompt Anda. Salin dan sesuaikan isinya.",
        createdAt: new Date().toISOString(),
        isFavorite: false
      };
      setActivePrompt(generated);
    }

    // 2. Switch tab to auto-generator so they see they can also run it with AI or customize it
    setActiveTab("auto");
  };

  // Handlers for quick start recommendation clicks on empty state
  const handleQuickStart = (requestText: string) => {
    setActiveTab("auto");
    // Trigger focus or pass state to auto generator
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" id="app-container">
      {/* Dynamic Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="p-3 bg-gradient-to-tr from-teal-400 to-emerald-500 rounded-2xl text-slate-950 shadow-lg shadow-teal-500/20">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl font-bold font-display tracking-tight text-white">Generator Prompt EDU</h1>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-teal-500/25 text-teal-400 px-2 py-0.5 rounded-full border border-teal-500/35">v1.5</span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Asisten kecerdasan rekayasa prompt (Prompt Engineering) khusus untuk merancang instruksi asisten pembelajaran guru, dosen, dan murid.
              </p>
            </div>
          </div>
          
          {/* Decorative stats/info */}
          <div className="hidden md:flex items-center gap-4 bg-slate-800/40 p-3 rounded-2xl border border-slate-800">
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Formula Wajib</span>
              <span className="text-xs font-semibold text-slate-300">Role + Task + Context + Format</span>
            </div>
            <div className="w-px h-8 bg-slate-800"></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tersimpan</span>
              <span className="text-xs font-semibold text-teal-400 font-mono">{history.length} prompt</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        {/* Navigation Tabs Bar */}
        <div className="flex overflow-x-auto pb-1 gap-2 custom-scrollbar border-b border-slate-200">
          <button
            onClick={() => setActiveTab("auto")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
              activeTab === "auto"
                ? "bg-teal-600 text-white shadow-md shadow-teal-600/10"
                : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
            }`}
            id="tab-auto"
          >
            <Wand2 className="w-4 h-4" />
            AI Generator (Instan)
          </button>
          <button
            onClick={() => setActiveTab("manual")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
              activeTab === "manual"
                ? "bg-teal-600 text-white shadow-md shadow-teal-600/10"
                : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
            }`}
            id="tab-manual"
          >
            <Sliders className="w-4 h-4" />
            Tuning Manual
          </button>
          <button
            onClick={() => setActiveTab("preset")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
              activeTab === "preset"
                ? "bg-teal-600 text-white shadow-md shadow-teal-600/10"
                : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
            }`}
            id="tab-preset"
          >
            <Sparkles className="w-4 h-4" />
            Inspirasi Template
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
              activeTab === "history"
                ? "bg-teal-600 text-white shadow-md shadow-teal-600/10"
                : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
            }`}
            id="tab-history"
          >
            <History className="w-4 h-4" />
            Riwayat Prompt ({history.length})
          </button>
          <button
            onClick={() => setActiveTab("guide")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
              activeTab === "guide"
                ? "bg-teal-600 text-white shadow-md shadow-teal-600/10"
                : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
            }`}
            id="tab-guide"
          >
            <HelpCircle className="w-4 h-4" />
            Panduan Prompting
          </button>
        </div>

        {/* Dashboard Grid Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Workspace Left Side (Controls / Forms) */}
          <div className={`lg:col-span-7 h-full ${activeTab === "manual" || activeTab === "history" || activeTab === "guide" ? "lg:col-span-12" : ""}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {activeTab === "auto" && (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <AutoGenerator 
                      onPromptGenerated={handlePromptGenerated} 
                      isLoading={isAiLoading}
                      setIsLoading={setIsAiLoading}
                    />
                  </div>
                )}
                {activeTab === "manual" && (
                  <ManualBuilder onPromptGenerated={handlePromptGenerated} />
                )}
                {activeTab === "preset" && (
                  <PresetList onSelectPreset={handleSelectPreset} />
                )}
                {activeTab === "history" && (
                  <PromptHistory 
                    history={history}
                    onToggleFavorite={handleToggleFavorite}
                    onDelete={handleDeletePrompt}
                    onClearAll={handleClearHistory}
                  />
                )}
                {activeTab === "guide" && (
                  <EducationGuide />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Workspace Right Side (Output Super Prompt Workspace) - Hidden in Manual, History, and Guide to give full-width */}
          {activeTab !== "manual" && activeTab !== "history" && activeTab !== "guide" && (
            <div className="lg:col-span-5 flex flex-col h-full lg:sticky lg:top-6">
              {activePrompt ? (
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-1.5 mb-2 px-1">
                    <BookmarkCheck className="w-4 h-4 text-teal-600" />
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Workspace Prompt Aktif</span>
                  </div>
                  <PromptCard 
                    prompt={activePrompt}
                    onToggleFavorite={handleToggleFavorite}
                    onDelete={handleDeletePrompt}
                    onUpdatePrompt={handleUpdatePrompt}
                    showDelete={false}
                  />
                </div>
              ) : (
                /* Beautiful empty state workspace */
                <div className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col items-center justify-center text-center gap-6 h-[450px] shadow-sm">
                  <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shadow-inner">
                    <Lightbulb className="w-8 h-8 animate-pulse" />
                  </div>
                  <div className="flex flex-col gap-2 max-w-sm">
                    <h3 className="text-base font-bold text-slate-800 font-display">Ruang Desain Prompt</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Belum ada prompt aktif yang sedang didesain. Gunakan AI Generator di sebelah kiri atau pilih blueprint dari tab <strong>Inspirasi Template</strong> untuk memulai penyusunan.
                    </p>
                  </div>

                  {/* Core Test Cases Shortcuts */}
                  <div className="w-full border-t border-slate-100 pt-5 mt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Mulai dengan Satu Klik:</span>
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => handleSelectPreset({
                          id: "rpp-fotosintesis",
                          title: "RPP Fotosintesis (SMP)",
                          category: "Guru",
                          description: "",
                          icon: "BookOpen",
                          userRequest: "",
                          defaultStructure: {
                            role: "Bertindaklah sebagai Guru IPA SMP yang berpengalaman.",
                            task: "Buatlah Rencana Pelaksanaan Pembelajaran (RPP) satu pertemuan tentang Fotosintesis.",
                            context: "Untuk siswa kelas 7 SMP Kurikulum Merdeka dengan metode eksperimen sederhana menggunakan tanaman air.",
                            format: "Sajikan terstruktur dengan alokasi waktu per sesi, instrumen penilaian, dan pertanyaan pemantik."
                          }
                        })}
                        className="text-left w-full px-4 py-2.5 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-100 rounded-xl text-xs text-slate-700 font-medium transition-all flex items-center justify-between group cursor-pointer"
                        id="start-shortcut-fotosintesis"
                      >
                        <span>RPP Fotosintesis SMP</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
                      </button>
                      <button 
                        onClick={() => handleSelectPreset({
                          id: "kuis-sejarah",
                          title: "Kuis Sejarah Indonesia",
                          category: "Guru",
                          description: "",
                          icon: "GraduationCap",
                          userRequest: "",
                          defaultStructure: {
                            role: "Bertindaklah sebagai Ahli Sejarah Kemerdekaan Indonesia sekaligus pendidik kritis.",
                            task: "Susunlah 5 soal esai sejarah kemerdekaan Indonesia yang menuntut analisis mendalam siswa.",
                            context: "Untuk siswa SMA kelas 11. Pertanyaan fokus pada hubungan sebab-akibat peristiwa proklamasi dibanding sekedar hafalan tahun.",
                            format: "Sajikan soal dilanjutkan kunci jawaban lengkap serta kriteria rubrik penilaian nilai maksimal."
                          }
                        })}
                        className="text-left w-full px-4 py-2.5 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-100 rounded-xl text-xs text-slate-700 font-medium transition-all flex items-center justify-between group cursor-pointer"
                        id="start-shortcut-sejarah"
                      >
                        <span>Kuis Sejarah Indonesia</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-2">
          <p className="font-medium text-slate-500 font-display">
            Generator Prompt EDU &copy; 2026
          </p>
          <p className="text-[11px] text-slate-400">
            Didesain khusus untuk meningkatkan kualitas pengajaran berbasis AI dengan formula terstruktur.
          </p>
          <div className="mt-2 pt-2 border-t border-slate-100 w-full max-w-xs flex justify-center">
            <a
              href="https://lynk.id/ajisosiologi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-100 text-xs font-semibold text-slate-600 hover:text-teal-700 transition-all shadow-sm"
              id="credit-author-link"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
              Created by <span className="font-bold">@ajisosiologi</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
