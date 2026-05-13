import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Generation Endpoint
  app.post("/api/generate", async (req, res) => {
    try {
      const { prompt, theme } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API Key is missing" });
      }

      const genAI = new GoogleGenAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const systemPrompt = `
        Anda adalah NivrixPlay AI, pakar UI/UX Designer dan Frontend Developer.
        Tugas Anda adalah membuat kode HTML lengkap dengan Tailwind CSS berdasarkan permintaan user dalam Bahasa Indonesia.
        
        ATURAN KETAT:
        1. Kembalikan HANYA kode HTML di dalam blok kode.
        2. Gunakan CDN Tailwind CSS: <script src="https://cdn.tailwindcss.com"></script>.
        3. Pastikan desain modern, keren, penuh animasi (gunakan library seperti Animate.css atau transisi Tailwind), dan responsif.
        4. Gunakan palet warna ${theme === 'dark' ? 'gelap dengan aksen ungu cerah' : 'terang dengan aksen ungu cerah'}.
        5. Kode harus fungsional dan 100% tanpa kesalahan sintaks.
        6. Sertakan font Google 'Plus Jakarta Sans'.
      `;

      const result = await model.generateContent([systemPrompt, prompt]);
      const response = await result.response;
      const text = response.text();

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
