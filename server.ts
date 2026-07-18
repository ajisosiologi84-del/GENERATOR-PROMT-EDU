import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY tidak ditemukan di environment variables. Silakan tambahkan kunci API Anda di Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

app.use(express.json());

// API route for generating prompts using Gemini with robust fallbacks
app.post("/api/generate-prompt", async (req, res) => {
  try {
    const { userRequest, category = "Guru" } = req.body;
    if (!userRequest || typeof userRequest !== "string") {
      return res.status(400).json({ error: "Permintaan tidak boleh kosong." });
    }

    let categoryDirective = "";
    if (category === "Guru") {
      categoryDirective = "FOKUS AUDIENS: Guru (Pendidik Sekolah Dasar/Menengah). Gunakan pendekatan Kurikulum (seperti Kurikulum Merdeka), rencana modul ajar/RPP, pertanyaan pemantik, materi interaktif kelas, serta rubrik penilaian yang praktis. Optimalkan agar prompt ini sangat kuat ketika ditempelkan ke Gemini AI atau NotebookLM bersamaan dengan dokumen kurikulum/bahan ajar.";
    } else if (category === "Dosen") {
      categoryDirective = "FOKUS AUDIENS: Dosen (Akademisi Perguruan Tinggi). Gunakan pendekatan riset kritis, bimbingan penulisan karya ilmiah/skripsi, Rencana Pembelajaran Semester (RPS) komprehensif, analisis teoritis tinggi, serta peer-review yang konstruktif. Optimalkan asisten agar siap bekerja di NotebookLM guna menganalisis paper/literatur penelitian yang diunggah secara mendalam.";
    } else if (category === "Siswa") {
      categoryDirective = "FOKUS AUDIENS: Siswa/Murid (Pelajar). Gunakan penjelasan ramah, bahasa bersahabat, analogi visual kehidupan sehari-hari, metode mnemonik untuk ingatan, serta kuis latihan asyik untuk belajar mandiri. Rancang agar asisten siap dipakai di Gemini AI atau NotebookLM untuk membedah slide kuliah atau buku pelajaran yang diunggah.";
    } else if (category === "Gambar") {
      categoryDirective = "FOKUS AUDIENS: Pembuat Gambar / Kreator Media Visual (pengguna Midjourney, DALL-E, Stable Diffusion, Imagen). Bertindaklah sebagai Art Director senior. Susun draf prompt bahasa Inggris yang komprehensif, fotorealistik, sinematik, atau bergaya lukisan/art spesifik yang menakjubkan sesuai permintaan pengguna. Sertakan parameter teknis seperti aspek rasio (--ar), detail kamera, pencahayaan dramatis, jenis lensa, dan gaya seni. Sajikan draf utama bahasa Inggris di dalam blok kode (code block) agar mudah disalin, diikuti tips/pilihan kustomisasi bahasa Indonesia.";
    } else {
      categoryDirective = "FOKUS AUDIENS: Umum / Publik Produktif. Gunakan pendekatan produktivitas harian, penulisan email bisnis profesional formal, skenario naskah video edukatif, penjelasan populer, serta tips taktis sehari-hari. Sesuaikan agar asisten bekerja maksimal di Gemini AI untuk menyusun rencana kerja terstruktur atau draf korespondensi.";
    }

    const systemInstruction = `Anda adalah "Generator Prompt EDU", seorang Ahli Rekayasa Prompt (Prompt Engineer) tingkat lanjut yang berdedikasi khusus untuk dunia pendidikan (guru, dosen, pendidik, dan siswa) serta produktivitas edukatif umum, khususnya dalam menyusun prompt siap pakai yang dioptimalkan untuk GEMINI AI dan NOTEBOOKLM.
Tujuan utama Anda adalah mengubah AI dari sekadar mesin penjawab menjadi asisten pengajar atau asisten belajar yang tangguh bagi guru, dosen, siswa, maupun masyarakat umum.
Tugas Anda adalah merancang ulang permintaan sederhana pengguna menjadi sebuah Prompt Super yang siap disalin-tempel (copy-paste) ke dalam Gemini AI atau NotebookLM.

Setiap Prompt Super wajib dirangkai menggunakan struktur rapi berikut di dalam properti "promptSiapPakai":

# PROMPT ASISTEN INTELLIGENT [OPTIMAL UNTUK GEMINI AI & NOTEBOOKLM]

### 🎭 PERAN (ROLE)
[Detail peran di sini, misal: Bertindaklah sebagai seorang guru Fisika SMA senior...]

### 📋 TUGAS (TASK)
[Detail tugas spesifik dan mendalam di sini, misal: Buatkan kuis interaktif atau RPP...]

### 📌 KONTEKS (CONTEXT)
[Detail konteks, batasan, materi pendukung, dan karakteristik audiens di sini. Cantumkan catatan jika dijalankan di NotebookLM: "Jika dijalankan di NotebookLM, asisten ini akan mendasarkan seluruh analisis dan responnya secara mendalam pada file/sumber rujukan (sources) yang diunggah pengguna."]

### 📊 FORMAT OUTPUT (FORMAT)
[Detail format keluaran yang paling cocok, misal: tabel terstruktur, naskah dua kolom, dll.]

---
*(Catatan: Bagian di atas wajib digabungkan secara utuh dengan pembatas header markdown yang jelas di dalam properti "promptSiapPakai" agar pengguna tinggal klik tombol salin dan langsung menempelkannya di Gemini AI atau NotebookLM tanpa perlu menyunting lagi.)*

${categoryDirective}

Hasilkan respons dalam format JSON yang valid dengan struktur berikut:
{
  "promptSiapPakai": "[Teks prompt lengkap gabungan Role, Task, Context, dan Format yang sudah berformat Markdown super rapi seperti petunjuk di atas, siap dicopy-paste ke Gemini/NotebookLM]",
  "struktur": {
    "role": "[Penjelasan singkat Peran]",
    "task": "[Penjelasan singkat Tugas]",
    "context": "[Penjelasan singkat Konteks]",
    "format": "[Penjelasan singkat Format]"
  },
  "tips": "[Saran singkat kustomisasi prompt]"
}

Gunakan bahasa Indonesia yang sopan, profesional, ramah, dan mengedukasi sesuai sasaran audiens.`;

    let responseText = "";
    let usedModel = "gemini-3.5-flash";

    try {
      const ai = getAiClient();
      console.log(`Mencoba membuat prompt dengan gemini-3.5-flash untuk kategori ${category}...`);
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Buat prompt super untuk permintaan berikut: "${userRequest}"`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              promptSiapPakai: {
                type: Type.STRING,
                description: "Gabungan utuh dari Role, Task, Context, dan Format menjadi prompt siap salin"
              },
              struktur: {
                type: Type.OBJECT,
                properties: {
                  role: { type: Type.STRING, description: "Peran edukatif AI" },
                  task: { type: Type.STRING, description: "Tugas spesifik yang diperintahkan" },
                  context: { type: Type.STRING, description: "Konteks dan batasan pembelajaran" },
                  format: { type: Type.STRING, description: "Format output yang diminta" }
                },
                required: ["role", "task", "context", "format"]
              },
              tips: {
                type: Type.STRING,
                description: "Saran singkat untuk memodifikasi atau memperluas prompt tersebut"
              }
            },
            required: ["promptSiapPakai", "struktur", "tips"]
          }
        }
      });
      responseText = response.text || "";
    } catch (err35: any) {
      console.log("[Status] Model utama sibuk atau tidak tersedia. Mengaktifkan model cadangan...");
      usedModel = "gemini-2.5-flash";
      try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `Buat prompt super untuk permintaan berikut: "${userRequest}"`,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                promptSiapPakai: {
                  type: Type.STRING,
                  description: "Gabungan utuh dari Role, Task, Context, dan Format menjadi prompt siap salin"
                },
                struktur: {
                  type: Type.OBJECT,
                  properties: {
                    role: { type: Type.STRING, description: "Peran edukatif AI" },
                    task: { type: Type.STRING, description: "Tugas spesifik yang diperintahkan" },
                    context: { type: Type.STRING, description: "Konteks dan batasan pembelajaran" },
                    format: { type: Type.STRING, description: "Format output yang diminta" }
                  },
                  required: ["role", "task", "context", "format"]
                },
                tips: {
                  type: Type.STRING,
                  description: "Saran singkat untuk memodifikasi atau memperluas prompt tersebut"
                }
              },
              required: ["promptSiapPakai", "struktur", "tips"]
            }
          }
        });
        responseText = response.text || "";
      } catch (err25: any) {
        console.log("[Status] Model cadangan sibuk. Mengaktifkan algoritma heuristik lokal super cepat...");
        const fallbackObj = generateLocalFallback(userRequest, category);
        return res.json(fallbackObj);
      }
    }

    if (!responseText) {
      const fallbackObj = generateLocalFallback(userRequest, category);
      return res.json(fallbackObj);
    }

    const parsed = JSON.parse(responseText);
    res.json({ ...parsed, usedModel });

  } catch (error: any) {
    console.log("[Status] Terjadi pengecualian. Mengaktifkan algoritma heuristik lokal...");
    // Even if everything else crashes, we return a beautiful local fallback!
    try {
      const fallbackObj = generateLocalFallback(req.body.userRequest || "", req.body.category || "Guru");
      return res.json(fallbackObj);
    } catch (nestedErr) {
      res.status(500).json({ error: "Terjadi kesalahan fatal pada server." });
    }
  }
});

// Heuristic Generator if Gemini API is offline/busy
function generateLocalFallback(userRequest: string, category: string = "Guru") {
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
  } else if (category === "Siswa" || category === "Murid") {
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
  if (reqLower.includes("gambar") || reqLower.includes("foto") || reqLower.includes("ilustrasi") || reqLower.includes("render") || reqLower.includes("painting") || reqLower.includes("lukisan") || reqLower.includes("prompt")) {
    role = "Bertindaklah sebagai Art Director dan Desainer Karakter 3D yang piawai dalam rekayasa prompt gambar AI.";
    task = `Rancanglah sebuah prompt gambar bahasa Inggris yang detail, sinematik, dan memikat untuk topik: "${userRequest}".`;
    context = "Gunakan kata sifat visual yang hidup, deskripsi pencahayaan terperinci (golden hour/studio lighting), rasio aspek yang pas, dan penyebutan gaya seni tertentu (photorealistic/watercolor/3d clay render).";
    format = "Sajikan prompt bahasa Inggris siap pakai di dalam blok kode (code block), diiringi rincian parameter dan opsi variasi gaya di bagian bawah.";
    tips = "Tips: Anda bisa meminta rasio aspek yang berbeda (misalnya --ar 16:9 untuk pemandangan atau --ar 1:1 untuk ikon media sosial).";
  } else if (reqLower.includes("rpp") || reqLower.includes("fotosintesis") || reqLower.includes("pelajaran") || reqLower.includes("rencana")) {
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

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
