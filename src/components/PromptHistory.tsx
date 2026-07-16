import { useState } from "react";
import { GeneratedPrompt } from "../types";
import PromptCard from "./PromptCard";
import { Trash2, Search, Heart, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PromptHistoryProps {
  history: GeneratedPrompt[];
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export default function PromptHistory({
  history,
  onToggleFavorite,
  onDelete,
  onClearAll,
}: PromptHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "favorites">("all");

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.promptSiapPakai.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.userRequest && item.userRequest.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterMode === "favorites") {
      return matchesSearch && item.isFavorite;
    }
    return matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6" id="prompt-history-panel">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kata kunci prompt..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl text-xs focus:outline-none transition-colors shadow-inner"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => setFilterMode("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
              filterMode === "all"
                ? "bg-teal-50 text-teal-700 border border-teal-100"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Semua ({history.length})
          </button>
          <button
            onClick={() => setFilterMode("favorites")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
              filterMode === "favorites"
                ? "bg-rose-50 text-rose-700 border border-rose-100"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
            Favorit ({history.filter((i) => i.isFavorite).length})
          </button>

          {history.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Apakah Anda yakin ingin menghapus seluruh riwayat prompt?")) {
                  onClearAll();
                }
              }}
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer text-xs font-medium flex items-center gap-1"
              title="Bersihkan Semua Riwayat"
              id="clear-all-history-btn"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bersihkan</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid List */}
      {filteredHistory.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="p-4 bg-slate-50 text-slate-400 rounded-full mb-3">
            <Search className="w-8 h-8" />
          </div>
          <h4 className="text-sm font-semibold text-slate-700 font-display">Tidak Ada Prompt Ditemukan</h4>
          <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
            {searchTerm || filterMode === "favorites"
              ? "Tidak ada hasil pencarian yang cocok dengan filter aktif Anda saat ini."
              : "Riwayat Anda kosong. Mulai rakit prompt menggunakan Generator AI atau Parameter Manual sekarang!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredHistory.map((prompt) => (
              <div key={prompt.id} className="h-full">
                <PromptCard
                  prompt={prompt}
                  onToggleFavorite={onToggleFavorite}
                  onDelete={onDelete}
                  showDelete={true}
                />
              </div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
