export interface PromptStructure {
  role: string;
  task: string;
  context: string;
  format: string;
}

export interface GeneratedPrompt {
  id: string;
  userRequest?: string;
  promptSiapPakai: string;
  struktur: PromptStructure;
  tips: string;
  createdAt: string;
  isFavorite?: boolean;
}

export interface PresetTemplate {
  id: string;
  title: string;
  category: "Guru" | "Dosen" | "Siswa" | "Umum" | "Gambar";
  description: string;
  icon: string;
  userRequest: string;
  defaultStructure?: PromptStructure;
}
