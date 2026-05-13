/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Sparkles, 
  Layout, 
  Code2, 
  Eye, 
  Smartphone, 
  Monitor, 
  Moon, 
  Sun, 
  Cpu, 
  ChevronRight,
  Terminal,
  Zap,
  Layers,
  Crown,
  X,
  Check,
  Youtube
} from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [showPricing, setShowPricing] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    { 
      role: 'ai', 
      content: 'Halo! Saya **NivrixPlay AI**. Siap mendesain UI/UX modern dan membangun aplikasi fungsional untuk Anda hari ini. Apa yang bisa saya bantu?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [generatedCode, setGeneratedCode] = useState<string>(`
    <div class="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-400 p-10 text-center font-sans">
      <div class="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 animate-pulse">
        <svg xmlns="http://www.w3.org/2000/svg" class="text-purple-600" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
      </div>
      <h2 class="text-2xl font-bold text-slate-800">Menunggu Instruksi Desain</h2>
      <p class="mt-2 max-w-md">Ketik perintah di panel kiri untuk mulai membuat desain UI, mockup landing page, atau aplikasi fungsional.</p>
    </div>
  `);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    const userMessage = { 
      role: 'user', 
      content: prompt,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMessage]);
    const currentPrompt = prompt;
    setPrompt('');
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentPrompt, theme })
      });

      const data = await response.json();
      if (data.code) {
        setGeneratedCode(data.code);
        setMessages(prev => [...prev, { 
          role: 'ai', 
          content: 'Desain telah diperbarui secara instan. Silakan tinjau hasilnya di panel pratinjau.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        throw new Error(data.error || 'Terjadi kesalahan saat generate.');
      }
    } catch (error: any) {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: `Error: ${error.message}. Coba lagi nanti.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`flex h-screen w-full transition-colors duration-500 overflow-hidden font-sans ${theme === 'dark' ? 'bg-[#0a0a0c] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Sidebar Navigation */}
      <aside className={`w-20 hidden lg:flex flex-col items-center py-8 border-r transition-colors duration-500 ${theme === 'dark' ? 'bg-[#111114] border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-600/40 mb-12 transform hover:scale-110 transition-transform duration-300">
          <Sparkles className="text-white" size={24} />
        </div>
        <div className="flex-1 space-y-8 text-slate-400">
          <Layout className="hover:text-purple-500 cursor-pointer transition-colors" size={22} />
          <Zap className="hover:text-purple-500 cursor-pointer transition-colors" size={22} />
          <Layers className="hover:text-purple-500 cursor-pointer transition-colors" size={22} />
          <Terminal className="hover:text-purple-500 cursor-pointer transition-colors" size={22} />
          <Crown className="hover:text-purple-500 cursor-pointer transition-colors" size={22} onClick={() => setShowPricing(true)} />
        </div>
        <button onClick={toggleTheme} className={`p-3 rounded-xl transition-all ${theme === 'dark' ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </aside>

      {/* Main Chat Panel */}
      <section className={`w-full lg:w-[450px] flex flex-col border-r transition-colors duration-500 ${theme === 'dark' ? 'bg-[#121217] border-slate-800' : 'bg-white border-slate-200'}`}>
        <header className="p-6 border-b border-inherit flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="lg:hidden w-10 h-10 bg-gradient-to-br from-purple-600 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-fuchsia-500">NivrixPlay</h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">AI UI/UX Designer</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowPricing(true)}
              className="mr-2 text-xs font-bold bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white px-3 py-1 rounded-full shadow-lg hover:scale-105 transition-transform"
            >
              Upgrade Pro
            </button>
            <span className={`w-2 h-2 rounded-full ${isGenerating ? 'bg-purple-500 animate-ping' : 'bg-green-500 animate-pulse'}`} />
            <span className="text-xs text-slate-500 font-medium">{isGenerating ? 'Merancang...' : 'Online'}</span>
          </div>
        </header>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${msg.role === 'user' 
                  ? 'bg-gradient-to-br from-purple-600 to-fuchsia-500 text-white rounded-tr-none shadow-purple-500/20' 
                  : theme === 'dark' ? 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700' : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
                <span className="text-[10px] text-slate-500 mt-2 px-1 uppercase tracking-tighter">{msg.time}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          {isGenerating && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-purple-500">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" />
              </div>
              <span className="text-xs font-semibold animate-pulse">Nivrix sedang merancang kode...</span>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className={`p-6 border-t transition-colors duration-500 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
          <div className={`relative group transition-all duration-300 rounded-2xl p-1 ${theme === 'dark' ? 'bg-slate-800/50 hover:bg-slate-800' : 'bg-slate-100 hover:bg-slate-200 shadow-inner'}`}>
            <textarea
              className="w-full bg-transparent border-none rounded-xl p-4 pr-14 text-sm focus:ring-0 focus:outline-none resize-none min-h-[100px]"
              placeholder="Jelaskan desain UI/UX atau aplikasi yang ingin Anda buat..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
            />
            <button 
              onClick={handleGenerate}
              className={`absolute bottom-4 right-4 p-3 rounded-xl transition-all shadow-lg ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:scale-105 hover:shadow-purple-500/40 active:scale-95'}`}
            >
              <Send size={18} className="text-white" />
            </button>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {['Landing Page Toko', 'Dashboard Admin', 'Form Login Kreatif'].map((preset) => (
                <button 
                  key={preset}
                  onClick={() => setPrompt(`Buatlah desain ${preset} yang modern dan keren.`)}
                  className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all ${theme === 'dark' ? 'border-slate-700 text-slate-500 hover:border-purple-500 hover:text-purple-400' : 'border-slate-200 text-slate-400 hover:border-purple-500 hover:text-purple-600'}`}
                >
                  {preset}
                </button>
              ))}
            </div>
            <div className="flex gap-4 items-center pl-2">
              <a href="https://youtube.com/@mrnivrixx?si=hrh3wPXuT38iD2d7" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-red-500 transition-colors" title="YouTube Channel">
                <Youtube size={18} />
              </a>
              <a href="https://t.me/MrNivriix" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-500 transition-colors" title="Telegram">
                <Send size={18} className="transform -rotate-45" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Panel */}
      <section className={`hidden md:flex flex-1 flex-col transition-colors duration-500 ${theme === 'dark' ? 'bg-[#0f0f12]' : 'bg-slate-100/50'}`}>
        <header className={`h-20 border-b flex items-center justify-between px-8 transition-colors duration-500 ${theme === 'dark' ? 'border-slate-800 bg-[#121217]' : 'border-slate-200 bg-white shadow-sm'}`}>
          <div className="flex items-center gap-6">
            <button className={`flex items-center gap-2 text-sm font-bold border-b-2 h-20 transition-all ${theme === 'dark' ? 'border-purple-500 text-purple-400' : 'border-purple-600 text-purple-600'}`}>
              <Eye size={16} /> Liveset Pratinjau
            </button>
            <button className="flex items-center gap-2 text-sm font-medium text-slate-500 h-20 hover:text-purple-500 transition-all">
              <Code2 size={16} /> Kode Sumber
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex p-1 rounded-xl items-center ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <button className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm text-purple-600"><Monitor size={18} /></button>
              <button className="p-2 text-slate-400 hover:text-purple-500"><Smartphone size={18} /></button>
            </div>
            <button className="bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-purple-600/30 hover:scale-105 transition-all active:scale-95">
              Download Kode
            </button>
          </div>
        </header>

        <div className="flex-1 p-10 overflow-hidden flex justify-center items-center">
          <motion.div 
            key={generatedCode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className={`w-full h-full max-w-6xl rounded-2xl overflow-hidden shadow-2xl border transition-colors duration-500 ${theme === 'dark' ? 'border-slate-800 shadow-purple-900/10' : 'border-slate-200 bg-white'}`}
          >
            <iframe
              title="Preview UI/UX NivrixPlay"
              className="w-full h-full"
              srcDoc={`
                <!DOCTYPE html>
                <html>
                  <head>
                    <meta charset="UTF-8">
                    <script>
                      const originalWarn = console.warn;
                      console.warn = (...args) => {
                        if (args[0] && typeof args[0] === 'string' && args[0].includes('cdn.tailwindcss.com should not be used in production')) return;
                        originalWarn(...args);
                      };
                    </script>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
                    <style>
                      ::-webkit-scrollbar { width: 8px; }
                      ::-webkit-scrollbar-track { background: transparent; }
                      ::-webkit-scrollbar-thumb { background: #d946ef40; border-radius: 10px; }
                      ::-webkit-scrollbar-thumb:hover { background: #d946ef80; }
                      body { font-family: 'Plus Jakarta Sans', sans-serif; }
                    </style>
                  </head>
                  <body>${generatedCode}</body>
                </html>
              `}
            />
          </motion.div>
        </div>
      </section>

      {/* Full Screen Loading Overlay */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              backgroundColor: ["rgba(0,0,0,0.6)", "rgba(88,28,135,0.4)", "rgba(0,0,0,0.6)"]
            }}
            exit={{ opacity: 0 }}
            transition={{
              backgroundColor: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center backdrop-blur-md"
          >
            <div className="w-20 h-20 relative">
              <div className="absolute inset-0 border-4 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)] border-t-transparent rounded-full animate-spin" />
              <div className="absolute inset-4 border-4 border-fuchsia-400/50 border-b-transparent rounded-full animate-spin [animation-direction:reverse]" />
            </div>
            <motion.p 
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [0.95, 1.05, 0.95],
                textShadow: ["0px 0px 5px rgba(168,85,247,0.2)", "0px 0px 15px rgba(168,85,247,0.8)", "0px 0px 5px rgba(168,85,247,0.2)"]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="mt-8 text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400"
            >
              Nivrix sedang merancang kode...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pricing Modal */}
      <AnimatePresence>
        {showPricing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowPricing(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl ${theme === 'dark' ? 'bg-[#121217] border border-slate-800' : 'bg-white border border-slate-200'}`}
              onClick={e => e.stopPropagation()}
            >
               <div className="p-8 text-center relative">
                  <button onClick={() => setShowPricing(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <X size={24} />
                  </button>
                  <h2 className="text-3xl font-extrabold mb-2">Upgrade ke <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-fuchsia-500">NivrixPlay Pro</span></h2>
                  <p className="text-slate-500 dark:text-slate-400 mb-8">Dapatkan akses tak terbatas ke semua fitur AI desain super canggih.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 1 Hari */}
                    <div className={`p-6 rounded-2xl border-2 transition-all ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700 hover:border-purple-500' : 'bg-slate-50 border-slate-200 hover:border-purple-500'}`}>
                      <h3 className="text-lg font-bold mb-2">Paket Harian</h3>
                      <div className="text-4xl font-extrabold text-purple-500 mb-4">Rp 500<span className="text-sm text-slate-500 font-normal">/hari</span></div>
                      <ul className="text-sm space-y-3 mb-6 text-left text-slate-600 dark:text-slate-300">
                        <li className="flex gap-2"><Check size={16} className="text-green-500" /> Akses AI 24 Jam</li>
                        <li className="flex gap-2"><Check size={16} className="text-green-500" /> Generate Kode Unlimited</li>
                      </ul>
                      <a href="mailto:chandrafmx5@gmail.com?subject=Pembelian%20Paket%20Harian%20NivrixPlay" className="block w-full py-3 rounded-xl bg-purple-600/10 text-purple-600 hover:bg-purple-600 hover:text-white transition-all font-bold">
                        Beli Sekarang
                      </a>
                    </div>

                    {/* 1 Tahun */}
                    <div className={`p-6 rounded-2xl border-2 border-purple-500 relative ${theme === 'dark' ? 'bg-slate-800/80 shadow-purple-900/20 shadow-2xl' : 'bg-white shadow-purple-500/10 shadow-2xl'}`}>
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Paling Hemat</div>
                      <h3 className="text-lg font-bold mb-2">Paket Tahunan</h3>
                      <div className="text-4xl font-extrabold text-purple-500 mb-4">Rp 5.000<span className="text-sm text-slate-500 font-normal">/tahun</span></div>
                      <ul className="text-sm space-y-3 mb-6 text-left text-slate-600 dark:text-slate-300">
                        <li className="flex gap-2"><Check size={16} className="text-green-500" /> Akses AI 1 Tahun Penuh</li>
                        <li className="flex gap-2"><Check size={16} className="text-green-500" /> Generate Kode Unlimited</li>
                        <li className="flex gap-2"><Check size={16} className="text-green-500" /> Dukungan Prioritas</li>
                      </ul>
                      <a href="mailto:chandrafmx5@gmail.com?subject=Pembelian%20Paket%20Tahunan%20NivrixPlay" className="block w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white hover:scale-105 hover:shadow-purple-500/30 transition-all font-bold">
                        Beli Sekarang
                      </a>
                    </div>
                  </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
