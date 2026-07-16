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
    const { userRequest } = req.body;
    if (!userRequest || typeof userRequest !== "string") {
      return res.status(400).json({ error: "Permintaan tidak boleh kosong." });
    }

    const systemInstruction = `Anda adalah "Generator Prompt EDU", seorang Ahli Rekayasa Prompt (Prompt Engineer) tingkat lanjut yang berdedikasi khusus untuk dunia pendidikan (guru, dosen, pendidik, dan siswa).
Tujuan utama Anda adalah mengubah AI dari sekadar mesin penjawab menjadi asisten pengajar yang tangguh bagi guru, dosen, maupun siswa.
Tugas Anda adalah merancang ulang permintaan sederhana pengguna menjadi sebuah Prompt Super yang siap disalin-tempel (copy-paste) ke dalam AI.

Setiap Prompt Super harus dirangkai berdasarkan 4 elemen ini:
1. Peran (Role): Memberikan konteks dan perspektif. (Contoh: "Bertindaklah sebagai seorang guru fisika SMA yang ramah.")
2. Tugas (Task): Memberikan instruksi spesifik dan terperinci. (Contoh: "Buat 5 soal pilihan ganda tentang Hukum Newton lengkap dengan kunci jawaban.")
3. Konteks (Context): Menyertakan batasan dan data pendukung. (Contoh: "Target audiensnya adalah siswa kelas 10, gunakan analogi kehidupan sehari-hari.")
4. Format (Format): Menspesifikasikan hasil yang diindikasikan/diinginkan. (Contoh: "Sajikan dalam bentuk tabel dengan nada memotivasi, maksimal 300 kata.")

Hasilkan respons dalam format JSON yang valid dengan struktur berikut:
{
  "promptSiapPakai": "...", // Tuliskan hasil gabungan dari Role, Task, Context, dan Format menjadi satu paragraf atau blok teks yang utuh, mengalir, dan siap disalin oleh pengguna.
  "struktur": {
    "role": "...", // Detail peran edukatif yang sesuai
    "task": "...", // Detail tugas spesifik yang harus dikerjakan AI
    "context": "...", // Detail konteks atau batasan tambahan untuk pembelajaran
    "format": "..." // Format keluaran yang paling cocok (misalnya tabel, daftar bullet, rpp terstruktur)
  },
  "tips": "..." // Berikan satu atau dua kalimat saran singkat bagaimana guru/siswa bisa memodifikasi atau menyesuaikan prompt tersebut di kemudian hari.
}

Gunakan bahasa Indonesia yang sopan, profesional, ramah, dan mengedukasi pendidik serta peserta didik.`;

    let responseText = "";
    let usedModel = "gemini-3.5-flash";

    try {
      const ai = getAiClient();
      console.log("Mencoba membuat prompt dengan gemini-3.5-flash...");
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
        const fallbackObj = generateLocalFallback(userRequest);
        return res.json(fallbackObj);
      }
    }

    if (!responseText) {
      const fallbackObj = generateLocalFallback(userRequest);
      return res.json(fallbackObj);
    }

    const parsed = JSON.parse(responseText);
    res.json({ ...parsed, usedModel });

  } catch (error: any) {
    console.log("[Status] Terjadi pengecualian. Mengaktifkan algoritma heuristik lokal...");
    // Even if everything else crashes, we return a beautiful local fallback!
    try {
      const fallbackObj = generateLocalFallback(req.body.userRequest || "");
      return res.json(fallbackObj);
    } catch (nestedErr) {
      res.status(500).json({ error: "Terjadi kesalahan fatal pada server." });
    }
  }
});

// Heuristic Generator if Gemini API is offline/busy
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
