import { useState, useEffect } from "react";
import { GeneratedPrompt } from "../types";
import { Copy, Check, Info, Heart, Trash2, Calendar, Edit3, Save, Download, BookOpen, Sparkles, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PromptCardProps {
  prompt: GeneratedPrompt;
  onToggleFavorite?: (id: string) => void;
  onDelete?: (id: string) => void;
  onUpdatePrompt?: (updated: GeneratedPrompt) => void;
  showDelete?: boolean;
}

export default function PromptCard({
  prompt,
  onToggleFavorite,
  onDelete,
  onUpdatePrompt,
  showDelete = false,
}: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  // Local state for the editable fields
  const [roleText, setRoleText] = useState(prompt.struktur.role);
  const [taskText, setTaskText] = useState(prompt.struktur.task);
  const [contextText, setContextText] = useState(prompt.struktur.context);
  const [formatText, setFormatText] = useState(prompt.struktur.format);
  const [promptText, setPromptText] = useState(prompt.promptSiapPakai);
  
  // Local state for dynamic variables/placeholders filled by user
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});

  // Sync with prompt prop when it changes (e.g. loading a different preset or new generation)
  useEffect(() => {
    setRoleText(prompt.struktur.role);
    setTaskText(prompt.struktur.task);
    setContextText(prompt.struktur.context);
    setFormatText(prompt.struktur.format);
    setPromptText(prompt.promptSiapPakai);
    setVariableValues({}); // Reset filled variables on prompt change
  }, [prompt]);

  // Extract bracketed placeholders [Mata Pelajaran], [Kelas], etc.
  const placeholders = (() => {
    const regex = /\[([^\]\n]+)\]/g;
    const found: string[] = [];
    let match;
    while ((match = regex.exec(promptText)) !== null) {
      const val = match[1].trim();
      // Skip standard labels, system warnings, and long paragraphs that might use brackets
      if (
        val.length > 50 ||
        val.toLowerCase().includes("catatan") ||
        val.toLowerCase().includes("optimal untuk") ||
        val.toLowerCase().includes("peran") ||
        val.toLowerCase().includes("tugas") ||
        val.toLowerCase().includes("konteks") ||
        val.toLowerCase().includes("format")
      ) {
        continue;
      }
      if (!found.includes(val)) {
        found.push(val);
      }
    }
    return found;
  })();

  // Dynamically replace variables inside promptText with values entered by user
  const getModifiedPromptText = () => {
    let result = promptText;
    Object.entries(variableValues).forEach(([placeholder, val]) => {
      const stringVal = String(val);
      if (stringVal.trim()) {
        const escaped = placeholder.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`\\[${escaped}\\]`, 'g');
        result = result.replace(regex, stringVal);
      }
    });
    return result;
  };

  const modifiedPrompt = getModifiedPromptText();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(modifiedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin teks", err);
    }
  };

  const handleExport = (type: "txt" | "md") => {
    const titleClean = prompt.userRequest ? prompt.userRequest.replace(/[^a-zA-Z0-9]/g, "_") : "prompt";
    const fileName = `${titleClean}_prompt.${type}`;
    const contentType = type === "txt" ? "text/plain;charset=utf-8" : "text/markdown;charset=utf-8";
    
    let content = modifiedPrompt;
    if (type === "md") {
      content = `<!-- Dioptimalkan untuk Gemini AI & NotebookLM -->\n\n${modifiedPrompt}`;
    }
    
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleFieldChange = (field: "role" | "task" | "context" | "format", value: string) => {
    let r = roleText;
    let t = taskText;
    let c = contextText;
    let f = formatText;

    if (field === "role") { r = value; setRoleText(value); }
    if (field === "task") { t = value; setTaskText(value); }
    if (field === "context") { c = value; setContextText(value); }
    if (field === "format") { f = value; setFormatText(value); }

    // Combine into final Prompt text with structured headings for Gemini & NotebookLM
    const combined = `# PROMPT ASISTEN INTELLIGENT [OPTIMAL UNTUK GEMINI AI & NOTEBOOKLM]

### 🎭 PERAN (ROLE)
${r.trim()}

### 📋 TUGAS (TASK)
${t.trim()}

### 📌 KONTEKS (CONTEXT)
${c.trim()}

### 📊 FORMAT OUTPUT (FORMAT)
${f.trim()}`;
    setPromptText(combined);

    // Propagate changes up if the parent supports updates
    if (onUpdatePrompt) {
      onUpdatePrompt({
        ...prompt,
        promptSiapPakai: combined,
        struktur: {
          role: r,
          task: t,
          context: c,
          format: f
        }
      });
    }
  };

  const formattedDate = new Date(prompt.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full"
      id={`prompt-card-${prompt.id}`}
    >
      {/* Top Bar */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-500 font-mono">{formattedDate}</span>
          {prompt.userRequest && (
            <span className="text-xs font-medium bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full truncate max-w-[150px] sm:max-w-[250px]">
              Topik: {prompt.userRequest}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(prompt.id)}
              className={`p-2 rounded-lg transition-colors hover:bg-slate-200 ${
                prompt.isFavorite ? "text-rose-500" : "text-slate-400 hover:text-slate-600"
              }`}
              title={prompt.isFavorite ? "Hapus dari Favorit" : "Simpan ke Favorit"}
              id={`fav-btn-${prompt.id}`}
            >
              <Heart className={`w-4 h-4 ${prompt.isFavorite ? "fill-current" : ""}`} />
            </button>
          )}
          {showDelete && onDelete && (
            <button
              onClick={() => onDelete(prompt.id)}
              className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Hapus Prompt"
              id={`delete-btn-${prompt.id}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
        {/* Super Prompt Section */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h4 className="text-sm font-semibold tracking-wider text-teal-700 uppercase flex items-center gap-1.5 font-display">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></span>
              1. 🎯 Prompt Siap Pakai
            </h4>
            
            <div className="flex items-center gap-2 self-end sm:self-auto">
              {/* Export Buttons */}
              <button
                onClick={() => handleExport("txt")}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors cursor-pointer shadow-sm"
                title="Ekspor sebagai file TXT"
                id={`export-txt-${prompt.id}`}
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>TXT</span>
              </button>
              <button
                onClick={() => handleExport("md")}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors cursor-pointer shadow-sm"
                title="Ekspor sebagai file Markdown"
                id={`export-md-${prompt.id}`}
              >
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>MD</span>
              </button>

              {/* Copy Button */}
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer ${
                  copied
                    ? "bg-teal-600 text-white border border-teal-600"
                    : "bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200/60"
                }`}
                id={`copy-btn-${prompt.id}`}
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.span
                      key="copied"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.8 }}
                      className="flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Tersalin!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.8 }}
                      className="flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Salin Prompt
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/* Interactive Placeholder Form (Langkah 1) */}
          {placeholders.length > 0 && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: "3s" }} />
                <span>Kustomisasi Variabel Prompt ({placeholders.length})</span>
              </div>
              <p className="text-[11px] text-slate-500 -mt-1 leading-relaxed">
                Prompt ini mengandung parameter dinamis. Isi form di bawah untuk mengganti nilai variabel secara otomatis sebelum Anda menyalin!
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                {placeholders.map((ph) => (
                  <div key={ph} className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                      {ph}
                    </label>
                    <input
                      type="text"
                      placeholder={`Isi ${ph}...`}
                      value={variableValues[ph] || ""}
                      onChange={(e) =>
                        setVariableValues({ ...variableValues, [ph]: e.target.value })
                      }
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 rounded-lg text-xs focus:outline-none transition-colors shadow-inner"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="relative group">
            <pre className="whitespace-pre-wrap font-sans text-sm bg-slate-900 text-slate-100 p-5 rounded-xl border border-slate-800 leading-relaxed shadow-inner overflow-x-auto select-all max-h-[250px] custom-scrollbar">
              {modifiedPrompt}
            </pre>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] py-1 px-2 rounded pointer-events-none">
              Klik 2x untuk memblokir semua teks
            </div>
          </div>
        </div>

        {/* Structural Breakdown */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
            <h4 className="text-sm font-semibold tracking-wider text-indigo-700 uppercase flex items-center gap-1.5 font-display">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              2. 🧩 Bedah Struktur Prompt
            </h4>
            
            {/* Interactive Edit Toggle Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                isEditing
                  ? "bg-teal-600 border-teal-600 text-white hover:bg-teal-700 shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
              }`}
              id={`edit-mode-toggle-${prompt.id}`}
            >
              {isEditing ? (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Selesai Mengedit
                </>
              ) : (
                <>
                  <Edit3 className="w-3.5 h-3.5" />
                  Sunting Struktur
                </>
              )}
            </button>
          </div>

          {/* Quick Informational Banner when in Edit Mode */}
          {isEditing && (
            <div className="p-2.5 bg-indigo-50 border border-indigo-100/70 rounded-xl flex items-center gap-2 text-[11px] text-indigo-800">
              <Info className="w-3.5 h-3.5 text-indigo-500" />
              <span>Anda sedang mengedit parameter prompt ini. Perubahan disinkronkan langsung ke Prompt Siap Pakai di atas!</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Role */}
            <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex flex-col">
              <span className="text-xs font-bold text-blue-700 block mb-1">🎭 Peran (Role)</span>
              {isEditing ? (
                <textarea
                  value={roleText}
                  onChange={(e) => handleFieldChange("role", e.target.value)}
                  className="w-full text-xs text-slate-800 bg-white border border-blue-200/60 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-none min-h-[80px]"
                />
              ) : (
                <p className="text-xs text-slate-700 leading-relaxed flex-1">{roleText}</p>
              )}
            </div>

            {/* Task */}
            <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100 flex flex-col">
              <span className="text-xs font-bold text-teal-700 block mb-1">📋 Tugas (Task)</span>
              {isEditing ? (
                <textarea
                  value={taskText}
                  onChange={(e) => handleFieldChange("task", e.target.value)}
                  className="w-full text-xs text-slate-800 bg-white border border-teal-200/60 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 resize-none min-h-[80px]"
                />
              ) : (
                <p className="text-xs text-slate-700 leading-relaxed flex-1">{taskText}</p>
              )}
            </div>

            {/* Context */}
            <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 flex flex-col">
              <span className="text-xs font-bold text-amber-700 block mb-1">📌 Konteks (Context)</span>
              {isEditing ? (
                <textarea
                  value={contextText}
                  onChange={(e) => handleFieldChange("context", e.target.value)}
                  className="w-full text-xs text-slate-800 bg-white border border-amber-200/60 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 resize-none min-h-[80px]"
                />
              ) : (
                <p className="text-xs text-slate-700 leading-relaxed flex-1">{contextText}</p>
              )}
            </div>

            {/* Format */}
            <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 flex flex-col">
              <span className="text-xs font-bold text-purple-700 block mb-1">📊 Format</span>
              {isEditing ? (
                <textarea
                  value={formatText}
                  onChange={(e) => handleFieldChange("format", e.target.value)}
                  className="w-full text-xs text-slate-800 bg-white border border-purple-200/60 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 resize-none min-h-[80px]"
                />
              ) : (
                <p className="text-xs text-slate-700 leading-relaxed flex-1">{formatText}</p>
              )}
            </div>
          </div>
        </div>

        {/* Integration Guide Section (Langkah 3) */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            id={`guide-toggle-${prompt.id}`}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>Cara Pakai di Gemini AI & NotebookLM</span>
            </div>
            {showGuide ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </button>
          
          <AnimatePresence>
            {showGuide && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden border-t border-slate-100"
              >
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-slate-600">
                  {/* Gemini Column */}
                  <div className="p-3 bg-teal-50/45 border border-teal-100/70 rounded-lg flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 font-bold text-teal-800">
                      <Sparkles className="w-4 h-4 text-teal-600" />
                      <span>Langkah untuk Gemini AI</span>
                    </div>
                    <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-700">
                      <li>Salin prompt terstruktur dengan mengeklik tombol <strong>Salin Prompt</strong> di atas.</li>
                      <li>Buka <strong><a href="https://gemini.google.com" target="_blank" rel="noreferrer" className="text-teal-600 hover:underline font-semibold">gemini.google.com</a></strong> di tab baru.</li>
                      <li>Tempelkan prompt sebagai pesan pertama Anda untuk memprogram peran dan instruksi asisten.</li>
                      <li>Mulai kirimkan topik Anda atau lakukan sesi tanya jawab interaktif!</li>
                    </ol>
                  </div>

                  {/* NotebookLM Column */}
                  <div className="p-3 bg-indigo-50/45 border border-indigo-100/70 rounded-lg flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 font-bold text-indigo-800">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span>Langkah untuk NotebookLM</span>
                    </div>
                    <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-700">
                      <li>Buka <strong>NotebookLM</strong> dan buatlah notebook baru untuk topik Anda.</li>
                      <li>Unggah dokumen rujukan, artikel, PDF, slide, atau salinan materi ajar Anda.</li>
                      <li>Salin prompt di atas, lalu tempelkan ke kolom chat interaktif NotebookLM.</li>
                      <li>AI akan bertindak sebagai asisten pintar dan menganalisis materi Anda dengan perspektif peran tersebut!</li>
                    </ol>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tips Section */}
        {prompt.tips && (
          <div className="mt-auto p-4 bg-teal-50 rounded-xl border border-teal-100/70 flex gap-3 items-start">
            <div className="p-1 bg-teal-500 rounded-lg text-white">
              <Info className="w-4 h-4" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-teal-900">💡 Tips Tambahan</span>
              <p className="text-xs text-teal-800 leading-relaxed">{prompt.tips}</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
