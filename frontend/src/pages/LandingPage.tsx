import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BrainCircuit,
  UploadCloud,
  Layers,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  FileText,
  Search,
  Lock,
  ChevronDown,
  ChevronUp,
  Cpu,
  BookOpen,
  Check,
  X,
  Sparkles,
  Server,
  Activity,
} from 'lucide-react';
import {
  RagPipelineVector,
  DocumentAnalysisVector,
  SecurityVaultVector,
} from '../components/VectorIllustrations';

export const LandingPage: React.FC = () => {
  // Interactive Simulator State
  const [activeTab, setActiveTab] = useState<number>(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const demoScenarios = [
    {
      title: 'Commercial Lease Agreement',
      query: 'What is the penalty clause if the tenant terminates the lease early?',
      answer:
        'Under Section 14.3 (Early Termination), the tenant must provide 90 days written notice and pay a liquidated damages fee equivalent to 2 months of base rent ($14,500), plus forfeiture of the security deposit.',
      citations: [
        { doc: 'Commercial_Lease_Agreement_2025.pdf', page: 14, score: '99.1%' },
        { doc: 'Commercial_Lease_Agreement_2025.pdf', page: 15, score: '94.8%' },
      ],
    },
    {
      title: 'Q3 Financial & Earnings Report',
      query: 'What was the year-over-year revenue growth and adjusted EBITDA margin?',
      answer:
        'Total revenue grew 28.4% year-over-year to $48.2 million, driven by cloud software expansion. Adjusted EBITDA was $12.6 million, representing an EBITDA margin of 26.1% compared to 21.4% in the prior year.',
      citations: [
        { doc: 'Q3_Financial_Results_Final.pdf', page: 6, score: '98.7%' },
        { doc: 'Q3_Financial_Results_Final.pdf', page: 8, score: '95.2%' },
      ],
    },
    {
      title: 'Technical Infrastructure Spec',
      query: 'What are the encryption standards for data at rest and in transit?',
      answer:
        'Data at rest is encrypted using AES-256 with customer-managed keys rotated every 90 days. All data in transit across public networks enforces TLS 1.3 with strict HSTS policies.',
      citations: [
        { doc: 'Security_Architecture_v3.pdf', page: 22, score: '99.5%' },
      ],
    },
  ];

  const faqs = [
    {
      q: 'How does DocuMind eliminate hallucinations?',
      a: 'DocuMind uses strict Retrieval-Augmented Generation (RAG). Every prompt sent to the LLM is injected with high-precision text passages retrieved via pgvector cosine similarity. The model is explicitly constrained to answer only from the provided passages and cite the exact page numbers.',
    },
    {
      q: 'What file formats and sizes are supported?',
      a: 'We support PDF documents up to 50MB per file. Multi-page PDFs are asynchronously chunked using recursive character splitting with overlap to maintain semantic continuity.',
    },
    {
      q: 'Is my data private and isolated?',
      a: 'Yes. Every document, vector embedding, and conversation is strictly isolated per user account with row-level database filters. Your documents are never used to train global public models.',
    },
    {
      q: 'Can I query across multiple documents simultaneously?',
      a: 'Yes. You can choose to query your entire document library for cross-document synthesis or isolate your prompt to a single specific PDF.',
    },
    {
      q: 'How does the background processing queue work?',
      a: 'When you upload a PDF, a background task extracts text, creates semantic chunks, generates vector embeddings, and indexes them into the vector database. You can track real-time processing status directly on your dashboard.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-sm">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-slate-900 tracking-tight">DocuMind</span>
              <span className="text-[11px] px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-md font-bold uppercase border border-indigo-200/60">
                AI
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
            <a href="#pipeline" className="hover:text-slate-900 transition">RAG Architecture</a>
            <a href="#demo" className="hover:text-slate-900 transition">Live Demo</a>
            <a href="#features" className="hover:text-slate-900 transition">Capabilities</a>
            <a href="#comparison" className="hover:text-slate-900 transition">Comparison</a>
            <a href="#faq" className="hover:text-slate-900 transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3.5 py-2 transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 max-w-7xl mx-auto text-center">
        {/* Subtle status pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-slate-200 rounded-full text-slate-700 text-xs font-semibold shadow-xs mb-8">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Production RAG Architecture • pgvector Cosine Search</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
          Chat with your documents using{' '}
          <span className="text-indigo-600">verifiable AI intelligence</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Upload PDF files, ask complex natural-language questions, and receive accurate responses grounded in your text with page-level citations.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/register"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-7 rounded-xl transition shadow-md shadow-indigo-600/10 text-xs uppercase tracking-wider"
          >
            <span>Start Free Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#demo"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold py-3.5 px-7 rounded-xl transition text-xs uppercase tracking-wider shadow-xs"
          >
            <Search className="w-4 h-4 text-slate-500" />
            <span>Explore Interactive Demo</span>
          </a>
        </div>

        {/* Hero Vector Visualization */}
        <div className="mt-16 light-card rounded-3xl p-6 sm:p-10 border border-slate-200 max-w-5xl mx-auto bg-white">
          <div className="flex items-center justify-between pb-6 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-xs font-semibold text-slate-400 ml-2 font-mono">documind-rag-pipeline.svg</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <Server className="w-3.5 h-3.5 text-indigo-600" />
              <span>pgvector Cosine Retrieval Engine</span>
            </div>
          </div>
          <div className="pt-8">
            <RagPipelineVector className="w-full h-auto max-h-72" />
          </div>
        </div>
      </section>

      {/* Trust & Stats Bar */}
      <section className="border-y border-slate-200 bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">100%</div>
            <div className="text-xs font-medium text-slate-500 mt-1">Grounded in Uploaded Data</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-indigo-600 tracking-tight">&lt; 850ms</div>
            <div className="text-xs font-medium text-slate-500 mt-1">Vector Cosine Retrieval</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">50 MB</div>
            <div className="text-xs font-medium text-slate-500 mt-1">Max PDF File Capacity</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">0%</div>
            <div className="text-xs font-medium text-slate-500 mt-1">Public Model Training</div>
          </div>
        </div>
      </section>

      {/* Interactive Simulator / Live Demo */}
      <section id="demo" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Simulator</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            See how DocuMind answers from real documents
          </h2>
          <p className="text-slate-600 text-sm">
            Select a simulated document scenario below to observe how semantic search finds exact passage matches and generates cited responses.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {demoScenarios.map((scenario, index) => (
            <button
              key={scenario.title}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                activeTab === index
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <FileText className={`w-4 h-4 ${activeTab === index ? 'text-indigo-400' : 'text-slate-500'}`} />
              <span>{scenario.title}</span>
            </button>
          ))}
        </div>

        {/* Simulator Box */}
        <div className="light-card rounded-3xl border border-slate-200 overflow-hidden shadow-md max-w-4xl mx-auto bg-white">
          <div className="p-6 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">User Prompt</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{demoScenarios[activeTab].query}</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full w-fit">
              Vector Match Confirmed
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>Grounded AI Synthesis</span>
              </span>
              <p className="text-sm text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {demoScenarios[activeTab].answer}
              </p>
            </div>

            {/* Citations Grid */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                <span>Source Citations Extracted</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {demoScenarios[activeTab].citations.map((c, i) => (
                  <div
                    key={i}
                    className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 text-xs font-bold shrink-0">
                        {i + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">{c.doc}</p>
                        <p className="text-[11px] text-slate-500">Page {c.page}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                      {c.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RAG Deep-Dive Architecture Section */}
      <section id="pipeline" className="py-20 px-6 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              The 4-Stage RAG Pipeline Architecture
            </h2>
            <p className="text-slate-600 text-sm">
              Engineered with industrial rigor: from binary stream parsing to cosine similarity vector search.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="font-bold text-base text-slate-900">PDF Ingestion & Chunks</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Extracts raw text streams, preserves document metadata, and partitions passages into recursive 800-character segments with 150-character semantic overlaps.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="font-bold text-base text-slate-900">Vector Embeddings</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Transforms text passages into high-dimensional vector representations capturing deep syntactic and contextual semantics.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="font-bold text-base text-slate-900">pgvector Cosine Search</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Executes sub-second similarity queries across thousands of vectors using cosine distance scoring, retrieving only the top relevant document chunks.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold text-sm">
                04
              </div>
              <h3 className="font-bold text-base text-slate-900">Source Attributed Answers</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Synthesizes a response strictly bounded by retrieved context, returning verified page numbers, document names, and excerpt quotes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Vector Grid / Deep Dive */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-700 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verifiable Grounding</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Every word is backed by an exact page excerpt
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Standard AI chatbots guess and hallucinate answers. DocuMind highlights exact sentences within your source PDFs, allowing you to audit, verify, and cite with total confidence.
            </p>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Interactive source cards with collapsible full paragraph excerpts</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Cross-document similarity ranking and multi-page reference index</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>One-click copy formatted response with attribution references</span>
              </li>
            </ul>
          </div>

          <div className="light-card p-6 rounded-3xl border border-slate-200 bg-white shadow-md">
            <DocumentAnalysisVector className="w-full h-auto" />
          </div>
        </div>
      </section>

      {/* Enterprise Security Section */}
      <section className="py-20 px-6 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="order-2 lg:order-1 light-card p-6 rounded-3xl border border-slate-200 bg-white shadow-md">
            <SecurityVaultVector className="w-full h-auto" />
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-700 text-xs font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>Zero Data Leakage</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Strict per-user data isolation and tenant security
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Your confidential documents, proprietary reports, and conversation records are protected by database row-level isolation and JWT cryptographic tokens.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <h4 className="font-bold text-xs text-slate-900">Tenant-Scoped Vectors</h4>
                <p className="text-[11px] text-slate-600">Vector queries enforce strict <code className="text-indigo-600">WHERE user_id = :id</code> filters.</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <h4 className="font-bold text-xs text-slate-900">Zero Retention</h4>
                <p className="text-[11px] text-slate-600">Passages are sent ephemerally and never retained to train foundation models.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities Grid */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Engineered for precision and scale
          </h2>
          <p className="text-slate-600 text-sm">
            Everything you need to turn static documents into an interactive knowledge base.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl w-fit">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Sub-Second Vector Search</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Powered by pgvector indexes optimized for high-throughput cosine similarity lookups across dense embedding spaces.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl w-fit">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Multi-Document Synthesis</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Query your entire library at once or scope conversations to a specific PDF for laser-focused precision.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl w-fit">
              <UploadCloud className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Async Processing Queue</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Non-blocking background parsing with real-time UI status polling ensures smooth uploads even for 100+ page PDFs.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl w-fit">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Source Attribution Cards</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every assistant response includes verifiable citation cards with document names, page numbers, and exact passages.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl w-fit">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Enterprise Tenant Vault</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bcrypt hashed passwords, scoped JWT tokens, and strict database query boundaries keep customer data private.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl w-fit">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">FastAPI & Async Architecture</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              High-performance backend built on Python async SQLAlchemy, Pydantic validation, and clean RESTful API standards.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section id="comparison" className="py-20 px-6 bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              How DocuMind compares
            </h2>
            <p className="text-slate-600 text-sm">
              See why RAG vector retrieval outperforms keyword search and generic chatbots.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-2xl overflow-hidden bg-white">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">Capability</th>
                  <th className="py-4 px-6 text-indigo-600 bg-indigo-50/50">DocuMind AI</th>
                  <th className="py-4 px-6">Keyword Search (Ctrl+F)</th>
                  <th className="py-4 px-6">Generic Chatbots</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr>
                  <td className="py-4 px-6 font-semibold text-slate-900">Semantic Question Answering</td>
                  <td className="py-4 px-6 bg-indigo-50/30 text-indigo-700 font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" /> Full Natural Language
                  </td>
                  <td className="py-4 px-6 text-slate-500">Exact String Match Only</td>
                  <td className="py-4 px-6 text-slate-500">Prone to Hallucination</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-slate-900">Exact Page Source Citations</td>
                  <td className="py-4 px-6 bg-indigo-50/30 text-indigo-700 font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" /> Yes (Page & Excerpt)
                  </td>
                  <td className="py-4 px-6 text-slate-500">Page number only</td>
                  <td className="py-4 px-6 text-rose-500 flex items-center gap-1">
                    <X className="w-4 h-4" /> No Citations
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-slate-900">Multi-Document Cross Query</td>
                  <td className="py-4 px-6 bg-indigo-50/30 text-indigo-700 font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" /> Full Library Synthesis
                  </td>
                  <td className="py-4 px-6 text-slate-500">Single File Only</td>
                  <td className="py-4 px-6 text-slate-500">Context Window Limits</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-slate-900">Data Privacy & Zero Training</td>
                  <td className="py-4 px-6 bg-indigo-50/30 text-indigo-700 font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" /> Guaranteed Private
                  </td>
                  <td className="py-4 px-6 text-slate-500">Local</td>
                  <td className="py-4 px-6 text-slate-500">Often Used For Training</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-20 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-14 space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm">
            Everything you need to know about DocuMind RAG technology.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = expandedFaq === index;
            return (
              <div
                key={index}
                className="light-card rounded-2xl border border-slate-200 overflow-hidden bg-white"
              >
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-slate-900 hover:text-indigo-600 transition"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 px-6 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to unlock your documents?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Upload your PDFs today and experience verified, citation-grounded RAG intelligence in minutes.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 px-8 rounded-xl transition shadow-lg text-xs uppercase tracking-wider"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Clean Minimalist Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900">DocuMind AI</span>
            <span className="text-slate-400">• Retrieval-Augmented Generation</span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <Activity className="w-3 h-3 text-emerald-600" />
              API Operational
            </span>
            <Link to="/login" className="hover:text-slate-900 transition">Sign In</Link>
            <Link to="/register" className="hover:text-slate-900 transition">Register</Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-slate-100 text-center text-slate-400">
          © {new Date().getFullYear()} DocuMind AI. Built with FastAPI, pgvector, and React.
        </div>
      </footer>
    </div>
  );
};
