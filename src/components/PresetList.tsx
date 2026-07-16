import { PresetTemplate } from "../types";
import { PRESET_TEMPLATES } from "../presets";
import { BookOpen, GraduationCap, Code2, Sparkles, FileCheck, Network, ArrowUpRight } from "lucide-react";

interface PresetListProps {
  onSelectPreset: (preset: PresetTemplate) => void;
}

const ICON_MAP: Record<string, any> = {
  BookOpen: BookOpen,
  GraduationCap: GraduationCap,
  Code2: Code2,
  Sparkles: Sparkles,
  FileCheck: FileCheck,
  Network: Network,
};

export default function PresetList({ onSelectPreset }: PresetListProps) {
  return (
    <div className="flex flex-col gap-6" id="preset-list-panel">
      {/* Intro Header */}
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-slate-800 font-display">Inspirasi Template Siap Pakai</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Pilih dari koleksi modul bimbingan edukatif yang paling sering dicari guru dan siswa. Klik untuk memuat rancangan dasar secara instan.
        </p>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PRESET_TEMPLATES.map((preset) => {
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
                  <div className={`p-2 rounded-xl text-slate-700 bg-slate-100 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors`}>
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
                    {preset.category}
                  </span>
                </div>

                {/* Info */}
                <div className="flex flex-col gap-1">
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-teal-900 transition-colors font-display">
                    {preset.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
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
    </div>
  );
}
