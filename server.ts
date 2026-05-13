import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // AI Generation Endpoint
  app.post("/api/generate", async (req, res) => {
    try {
      const { prompt, theme } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API Key is missing" });
      }

      const ai = new GoogleGenAI({ apiKey });

      const systemPrompt = `
        Anda adalah NivrixPlay AI, pakar UI/UX Designer dan Frontend Developer.
        Tugas Anda adalah membuat kode HTML tunggal dan lengkap dengan Tailwind CSS berdasarkan permintaan user dalam Bahasa Indonesia.
        
        ATURAN KETAT:
        1. Kembalikan HANYA kode HTML di dalam blok kode \`\`\`html ... \`\`\`. Jangan tambahkan penjelasan.
        2. Gunakan CDN Tailwind CSS: <script src="https://cdn.tailwindcss.com"></script>.
        3. WAJIB menggunakan warna UNGU CERAH (seperti purple-500, fuchsia-500, atau violet-600) untuk elemen kunci, aksen, tombol, dan dekorasi.
        4. Desain HARUS FULL ANIMASI yang terlihat keren dan modern! Gunakan transisi hover Tailwind (hover:-translate-y-1, hover:scale-105, duration-300) dan animasi masuk (fade-in, slide-up). Anda dapat menggunakan class dari Animate.css (seperti animate__animated animate__fadeInUp) karena library ini sudah dimuat.
        5. Terapkan palet warna ${theme === 'dark' ? 'GELAP (latar slate-900/black)' : 'TERANG (latar putih/slate-50)'} sesuai permintaan UI/UX.
        6. Kode harus 100% tanpa kesalahan (error-free) dan sangat responsif di semua perangkat (mobile & desktop).
        7. Sertakan font Google 'Plus Jakarta Sans' sebagai font utama halaman.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: [systemPrompt, prompt],
      });

      const text = response.text || "";

      // Extract code from markdown blocks if present
      const codeMatch = text.match(/```html?([\s\S]*?)```/) || [null, text];
      const code = codeMatch[1].trim();

      res.json({ code });
    } catch (error: any) {
      console.error("AI Generation Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
