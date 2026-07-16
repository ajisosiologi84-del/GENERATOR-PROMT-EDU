import { HelpCircle, Sparkles, BookOpen, User, ClipboardList, Target, Layers } from "lucide-react";

export default function EducationGuide() {
  return (
    <div className="flex flex-col gap-6" id="education-guide-panel">
      {/* Intro Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row gap-5 items-center">
        <div className="p-4 bg-teal-500 rounded-2xl text-slate-950 flex-shrink-0 shadow-lg shadow-teal-500/20">
          <HelpCircle className="w-8 h-8" />
        </div>
        <div className="flex flex-col gap-1.5 text-center md:text-left">
          <h3 className="text-base font-bold font-display text-teal-400">Apa itu Prompt Engineering untuk Edukasi?</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Prompt adalah instruksi atau pertanyaan yang diberikan kepada AI (seperti Gemini). Kualitas hasil yang Anda terima sangat bergantung pada kualitas instruksi ini. Dengan menggunakan metode <strong>4 Elemen Utama</strong>, Anda dapat merubah AI dari sekadar mesin pencari/penjawab pasif menjadi asisten pengajar pribadi yang cerdas dan mendalam.
          </p>
        </div>
      </div>

      {/* The 4 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Role */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3 hover:border-teal-200 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-xs font-bold text-slate-900">Peran (Role)</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Memberikan identitas, kualifikasi, atau perspektif khusus kepada AI. Mengarahkan nada bicara dan keahlian spesifik.
            </p>
            <span className="text-[10px] bg-blue-50 text-blue-800 font-medium px-2 py-1 rounded mt-2">
              Contoh: &quot;Bertindaklah sebagai Guru Sejarah SMA...&quot;
            </span>
          </div>
        </div>

        {/* Task */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3 hover:border-teal-200 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-xs font-bold text-slate-900">Tugas (Task)</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Instruksi inti yang mendikte aktivitas apa yang harus dikerjakan AI secara terperinci.
            </p>
            <span className="text-[10px] bg-teal-50 text-teal-800 font-medium px-2 py-1 rounded mt-2">
              Contoh: &quot;Buatkan 5 soal analisis kritis...&quot;
            </span>
          </div>
        </div>

        {/* Context */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3 hover:border-teal-200 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Target className="w-5 h-5" />
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-xs font-bold text-slate-900">Konteks (Context)</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Menyertakan profil peserta didik, materi prasyarat, analogi yang disukai, atau batasan kurikulum.
            </p>
            <span className="text-[10px] bg-amber-50 text-amber-800 font-medium px-2 py-1 rounded mt-2">
              Contoh: &quot;Target murid adalah kelas 7 SMP Kurikulum Merdeka...&quot;
            </span>
          </div>
        </div>

        {/* Format */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3 hover:border-teal-200 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-xs font-bold text-slate-900">Format</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Spesifikasi tampilan hasil akhir (tabel, butir poin, skenario narasi, mind map) agar langsung siap digunakan.
            </p>
            <span className="text-[10px] bg-purple-50 text-purple-800 font-medium px-2 py-1 rounded mt-2">
              Contoh: &quot;Sajikan dalam bentuk tabel 3 kolom...&quot;
            </span>
          </div>
        </div>
      </div>

      {/* Why it works */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-5">
        <div className="flex-1 flex flex-col gap-2">
          <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 font-display">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Mengapa Formula Ini Bekerja?
          </h4>
          <ul className="space-y-2 text-xs text-slate-600 leading-relaxed list-disc list-inside">
            <li><strong>Fokus Sempit:</strong> Meminimalkan risiko AI berasumsi bebas yang dapat memicu hoaks ilmiah (halusinasi AI).</li>
            <li><strong>Sesuai Tingkat Kelas:</strong> Menjamin materi tidak terlalu sulit untuk anak SD dan tidak terlalu kekanak-kanakan untuk mahasiswa.</li>
            <li><strong>Mudah Diadopsi:</strong> Output terformat tabel atau modul pelajaran menghemat waktu penyusunan administrasi guru hingga 80%.</li>
          </ul>
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 font-display">
            <BookOpen className="w-4 h-4 text-teal-500" />
            Rekomendasi bagi Pendidik
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Selalu gunakan metode interaktif! Misalnya, perintahkan AI untuk mengajukan pertanyaan satu per satu kepada Anda (sebagai guru) sebelum memberikan hasil akhir, agar materi ajar benar-benar selaras dengan karakter kelas Anda.
          </p>
        </div>
      </div>
    </div>
  );
}
