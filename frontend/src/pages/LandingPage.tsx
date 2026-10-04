import React from 'react';
import { Link } from 'react-router-dom';
import {
  BrainCircuit,
  UploadCloud,
  Cpu,
  MessageSquare,
  Lock,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  Sparkles,
  Zap,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Header */}
      <header className="border-b border-white/[0.08] glass-panel sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 rounded-2xl shadow-lg shadow-indigo-500/25">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl text-white tracking-tight">DocuMind AI</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-xs font-semibold text-slate-300 hover:text-white px-4 py-2 transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-5 py-2.5 rounded-2xl transition shadow-lg shadow-indigo-600/25 active:scale-[0.98] uppercase tracking-wider"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-24 px-6 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-transparent blur-[140px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-xs font-semibold mb-8">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Retrieval-Augmented Generation & pgvector Engine</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-[1.15]">
          Chat with your documents using <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">AI Intelligence</span>
        </h1>

        <p className="mt-6 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Upload PDF files, ask natural-language questions, and get precise responses backed by exact page source citations.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3.5 px-8 rounded-2xl transition shadow-xl shadow-indigo-600/25 text-xs uppercase tracking-wider active:scale-[0.98]"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto flex items-center justify-center gap-2 glass-panel hover:bg-white/[0.04] border border-white/[0.08] text-slate-300 font-semibold py-3.5 px-8 rounded-2xl transition text-xs uppercase tracking-wider"
          >
            <span>Sign In</span>
          </Link>
        </div>

        {/* Pipeline Diagram */}
        <div className="mt-16 p-8 glass-panel border border-white/[0.08] rounded-3xl shadow-2xl max-w-4xl mx-auto">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
            RAG Processing Pipeline
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#0b0f19] p-5 rounded-2xl border border-white/[0.06] flex flex-col items-center text-center space-y-2">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
                <UploadCloud className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs text-slate-200">1. Upload PDF</span>
              <p className="text-[11px] text-slate-400">User-scoped storage</p>
            </div>

            <div className="bg-[#0b0f19] p-5 rounded-2xl border border-white/[0.06] flex flex-col items-center text-center space-y-2">
              <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs text-slate-200">2. Embed Vectors</span>
              <p className="text-[11px] text-slate-400">Cosine similarity index</p>
            </div>

            <div className="bg-[#0b0f19] p-5 rounded-2xl border border-white/[0.06] flex flex-col items-center text-center space-y-2">
              <div className="p-3 bg-pink-500/10 text-pink-400 rounded-xl">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs text-slate-200">3. Natural Query</span>
              <p className="text-[11px] text-slate-400">Ask any question</p>
            </div>

            <div className="bg-[#0b0f19] p-5 rounded-2xl border border-white/[0.06] flex flex-col items-center text-center space-y-2">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs text-slate-200">4. Cited Answer</span>
              <p className="text-[11px] text-slate-400">Page references</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Built for accuracy and speed</h2>
          <p className="text-slate-400 text-sm">
            Answers are grounded in your uploaded documents with source attribution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/[0.08] glass-panel-hover space-y-3">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl w-fit">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Retrieval-Augmented Generation</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Tokenizes PDF passages into vector embeddings and retrieves top relevant context using pgvector cosine search.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-white/[0.08] glass-panel-hover space-y-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl w-fit">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Strict Source Citations</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Every answer includes source cards showing exact file names, page numbers, and passage excerpts.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-white/[0.08] glass-panel-hover space-y-3">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl w-fit">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">Per-User Data Isolation</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              All vector queries and database resources are strictly filtered by user ID. Your documents remain private.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/[0.08] py-8 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} DocuMind AI. All rights reserved.</p>
      </footer>
    </div>
  );
};
