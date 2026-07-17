import { useState } from "react";
import { PresetTemplate } from "../types";
import { PRESET_TEMPLATES } from "../presets";
import { 
  BookOpen, GraduationCap, Code2, Sparkles, FileCheck, Network, 
  ArrowUpRight, Layers, Compass, PenTool, Mail, Share2, Users, Search
} from "lucide-react";

interface PresetListProps {
  onSelectPreset: (preset: PresetTemplate) => void;
}

const ICON_MAP: Record<string, any> = {
  BookOpen,
  GraduationCap,
  Code2,
  Sparkles,
  FileCheck,
  Network,
  Layers,
  Compass,
  PenTool,
  Mail,
  Share2,
  Users
};

export default function PresetList({ onSelectPreset }: PresetListProps) {
  const [selectedFilter, setSelectedFilter] = useState<"Semua" | "Guru" | "Dosen" | "Siswa" | "Umum">("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const categories: Array<"Semua" | "Guru" | "Dosen" | "Siswa" | "Umum"> = [
    "Semua", "Guru", "Dosen", "Siswa", "Umum"
  ];

  const filteredTemplates = PRESET_TEMPLATES.filter((preset) => {
    const matchesCategory = selectedFilter === "Semua" || preset.category === selectedFilter;
    const matchesSearch = 
      preset.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      preset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.userRequest.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6" id="preset-list-panel">
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1 max-w-xl">
          <h3 className="text-sm font-semibold text-slate-800 font-display">Inspirasi Template Siap Pakai</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Eksplorasi blueprint prompt edukatif terstruktur yang dirancang khusus untuk memenuhi standar keahlian pengajaran, kepenulisan akademis, bimbingan, hingga produktivitas harian.
          </p>
        </div>
      </div>

      {/* Control Tools (Search and Category Filter) */}
      <div className="flex flex-col gap-4 bg-slate-100/50 p-4 rounded-2xl border border-slate-200/80">
        {/* Search Input */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kata kunci template (misal: RPP, esai, python, kuis, email...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-all shadow-sm placeholder:text-slate-400"
            id="preset-search-input"
          />
        </div>

        {/* Categories Tabs list */}
        <div className="flex flex-wrap gap-1.5" id="preset-category-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                selectedFilter === cat
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-white hover:bg-slate-200 text-slate-600 border border-slate-200"
              }`}
              id={`preset-tab-${cat.toLowerCase()}`}
            >
              {cat === "Semua" ? "✨ Semua Kategori" : cat === "Guru" ? "🎭 Guru (Sekolah)" : cat === "Dosen" ? "🎓 Dosen (Akademis)" : cat === "Siswa" ? "📖 Murid / Siswa" : "🌍 Umum (Produktif)"}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((preset) => {
            const IconComponent = ICON_MAP[preset.icon] || BookOpen;
            
            return (
              <div
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className="group bg-white rounded-2xl border border-slate-200 hover:border-teal-400 p-5 shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col justify-between gap-4 h-full"
                id={`preset-card-${preset.id}`}
              >
                <div className="flex flex-col gap-3">
                  {/* Header Badge & Icon */}
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl text-slate-700 bg-slate-100 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors shadow-inner">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      preset.category === "Guru"
                        ? "bg-blue-50 text-blue-700 border border-blue-100"
                        : preset.category === "Dosen"
                        ? "bg-purple-50 text-purple-700 border border-purple-100"
                        : preset.category === "Siswa"
                        ? "bg-teal-50 text-teal-700 border border-teal-100"
                        : "bg-amber-50 text-amber-700 border border-amber-100"
                    }`}>
                      {preset.category === "Guru" ? "Guru (Sekolah)" : preset.category === "Dosen" ? "Dosen (Kampus)" : preset.category === "Siswa" ? "Murid / Siswa" : "Umum / Publik"}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col gap-1">
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-teal-900 transition-colors font-display">
                      {preset.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">
                      {preset.description}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-[10px] font-bold text-slate-400 group-hover:text-teal-600 transition-colors">
                  <span>Gunakan Blueprint</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-10 text-center flex flex-col items-center justify-center gap-3">
          <div className="p-3 bg-white rounded-xl shadow-sm text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h4 className="text-xs font-bold text-slate-700">Template Tidak Ditemukan</h4>
          <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
            Tidak ada blueprint prompt yang cocok dengan pencarian "{searchQuery}" pada kategori "{selectedFilter}". Coba kata kunci yang lain.
          </p>
        </div>
      )}
    </div>
  );
}
