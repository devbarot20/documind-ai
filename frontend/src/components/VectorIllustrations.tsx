import React from 'react';

/**
 * High-precision Minimal Vector SVG Illustrations
 * Clean light aesthetic with indigo & slate accents
 */

export const RagPipelineVector: React.FC<{ className?: string }> = ({ className = "w-full h-auto" }) => (
  <svg viewBox="0 0 840 320" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="ragLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#818CF8" stopOpacity="0.3" />
        <stop offset="50%" stopColor="#4F46E5" />
        <stop offset="100%" stopColor="#818CF8" stopOpacity="0.3" />
      </linearGradient>
      <linearGradient id="nodeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F8FAFC" />
      </linearGradient>
      <filter id="subtleShadow" x="-10%" y="-10%" width="120%" height="130%" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0F172A" floodOpacity="0.06" />
      </filter>
    </defs>

    {/* Connecting Flow Lines */}
    <path d="M150 160 H260" stroke="url(#ragLineGrad)" strokeWidth="2" strokeDasharray="4 4" />
    <path d="M370 160 H470" stroke="url(#ragLineGrad)" strokeWidth="2" strokeDasharray="4 4" />
    <path d="M580 160 H690" stroke="url(#ragLineGrad)" strokeWidth="2" strokeDasharray="4 4" />

    {/* Node 1: PDF Document Ingestion */}
    <g transform="translate(40, 70)" filter="url(#subtleShadow)">
      <rect width="110" height="180" rx="16" fill="url(#nodeGrad)" stroke="#E2E8F0" strokeWidth="1.5" />
      <rect x="18" y="24" width="74" height="6" rx="3" fill="#E2E8F0" />
      <rect x="18" y="38" width="54" height="6" rx="3" fill="#E2E8F0" />
      
      <circle cx="55" cy="85" r="24" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1.5" />
      <path d="M47 80 L55 74 L63 80 V92 L55 96 L47 92 Z" stroke="#4F46E5" strokeWidth="1.5" fill="#E0E7FF" />
      <path d="M55 74 V96" stroke="#4F46E5" strokeWidth="1.5" />

      <text x="55" y="132" textAnchor="middle" fill="#0F172A" fontSize="12" fontWeight="700" fontFamily="sans-serif">PDF Upload</text>
      <text x="55" y="148" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="sans-serif">Text Chunks</text>
    </g>

    {/* Node 2: Vector Embedding & pgvector */}
    <g transform="translate(260, 70)" filter="url(#subtleShadow)">
      <rect width="110" height="180" rx="16" fill="url(#nodeGrad)" stroke="#C7D2FE" strokeWidth="1.5" />
      <circle cx="55" cy="85" r="24" fill="#EEF2FF" stroke="#818CF8" strokeWidth="1.5" />
      {/* 3D vector axes icon */}
      <circle cx="55" cy="85" r="5" fill="#4F46E5" />
      <path d="M55 85 L70 73 M55 85 L40 73 M55 85 V102" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" />

      <text x="55" y="132" textAnchor="middle" fill="#0F172A" fontSize="12" fontWeight="700" fontFamily="sans-serif">Embeddings</text>
      <text x="55" y="148" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="sans-serif">pgvector Index</text>
      <rect x="25" y="156" width="60" height="14" rx="7" fill="#F1F5F9" />
      <text x="55" y="166" textAnchor="middle" fill="#475569" fontSize="9" fontWeight="600" fontFamily="monospace">COSINE</text>
    </g>

    {/* Node 3: Similarity Search & Reranking */}
    <g transform="translate(470, 70)" filter="url(#subtleShadow)">
      <rect width="110" height="180" rx="16" fill="url(#nodeGrad)" stroke="#E2E8F0" strokeWidth="1.5" />
      <circle cx="55" cy="85" r="24" fill="#F0FDF4" stroke="#BBF7D0" strokeWidth="1.5" />
      <circle cx="52" cy="82" r="10" stroke="#16A34A" strokeWidth="1.5" />
      <path d="M60 90 L68 98" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" />

      <text x="55" y="132" textAnchor="middle" fill="#0F172A" fontSize="12" fontWeight="700" fontFamily="sans-serif">RAG Search</text>
      <text x="55" y="148" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="sans-serif">Top-K Context</text>
      <rect x="25" y="156" width="60" height="14" rx="7" fill="#DCFCE7" />
      <text x="55" y="166" textAnchor="middle" fill="#15803D" fontSize="9" fontWeight="600" fontFamily="monospace">TOP 4</text>
    </g>

    {/* Node 4: Cited Synthesis */}
    <g transform="translate(690, 70)" filter="url(#subtleShadow)">
      <rect width="110" height="180" rx="16" fill="url(#nodeGrad)" stroke="#4F46E5" strokeWidth="1.5" />
      <circle cx="55" cy="85" r="24" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="1.5" />
      <path d="M47 85 L53 91 L64 78" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      <text x="55" y="132" textAnchor="middle" fill="#0F172A" fontSize="12" fontWeight="700" fontFamily="sans-serif">Cited Output</text>
      <text x="55" y="148" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="sans-serif">Zero-Hallucination</text>
      <rect x="20" y="156" width="70" height="14" rx="7" fill="#EEF2FF" />
      <text x="55" y="166" textAnchor="middle" fill="#4338CA" fontSize="9" fontWeight="600" fontFamily="sans-serif">PAGE 4, 12</text>
    </g>
  </svg>
);

export const DocumentAnalysisVector: React.FC<{ className?: string }> = ({ className = "w-full h-auto" }) => (
  <svg viewBox="0 0 500 360" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <filter id="docShadow" x="-10%" y="-10%" width="120%" height="130%" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#0F172A" floodOpacity="0.08" />
      </filter>
    </defs>

    {/* Background page 2 */}
    <rect x="80" y="40" width="340" height="280" rx="16" fill="#F1F5F9" stroke="#E2E8F0" strokeWidth="1.5" />
    
    {/* Main Front Document */}
    <g filter="url(#docShadow)">
      <rect x="60" y="20" width="340" height="300" rx="16" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
      
      {/* Document Header bar */}
      <rect x="85" y="45" width="140" height="12" rx="4" fill="#0F172A" />
      <rect x="330" y="45" width="45" height="12" rx="6" fill="#EEF2FF" />
      <rect x="85" y="70" width="290" height="1" fill="#F1F5F9" />

      {/* Text Lines */}
      <rect x="85" y="88" width="290" height="8" rx="4" fill="#E2E8F0" />
      <rect x="85" y="104" width="240" height="8" rx="4" fill="#E2E8F0" />
      <rect x="85" y="120" width="270" height="8" rx="4" fill="#E2E8F0" />

      {/* Highlighted Vector Chunk Match */}
      <rect x="80" y="142" width="300" height="74" rx="8" fill="#EEF2FF" stroke="#818CF8" strokeWidth="1.5" />
      <rect x="95" y="156" width="200" height="8" rx="4" fill="#4F46E5" />
      <rect x="95" y="172" width="260" height="8" rx="4" fill="#6366F1" fillOpacity="0.7" />
      <rect x="95" y="188" width="180" height="8" rx="4" fill="#6366F1" fillOpacity="0.7" />

      {/* Floating Citation Badge */}
      <g transform="translate(265, 130)">
        <rect width="125" height="26" rx="13" fill="#1E1B4B" />
        <circle cx="14" cy="13" r="5" fill="#10B981" />
        <text x="26" y="17" fill="#FFFFFF" fontSize="10" fontWeight="700" fontFamily="sans-serif">98.4% Match [p. 3]</text>
      </g>

      {/* Remaining Text Lines */}
      <rect x="85" y="232" width="280" height="8" rx="4" fill="#E2E8F0" />
      <rect x="85" y="248" width="200" height="8" rx="4" fill="#E2E8F0" />
      <rect x="85" y="264" width="250" height="8" rx="4" fill="#E2E8F0" />
      <rect x="85" y="280" width="140" height="8" rx="4" fill="#E2E8F0" />
    </g>
  </svg>
);

export const SecurityVaultVector: React.FC<{ className?: string }> = ({ className = "w-full h-auto" }) => (
  <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <filter id="vaultShadow" x="-10%" y="-10%" width="120%" height="130%" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#0F172A" floodOpacity="0.07" />
      </filter>
    </defs>
    <g filter="url(#vaultShadow)">
      <rect x="50" y="40" width="300" height="220" rx="20" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
      
      {/* Outer Shield Container */}
      <circle cx="200" cy="130" r="50" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
      <circle cx="200" cy="130" r="38" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1.5" />
      
      {/* Keyhole / Lock */}
      <rect x="193" y="126" width="14" height="18" rx="3" fill="#4F46E5" />
      <circle cx="200" cy="120" r="8" stroke="#4F46E5" strokeWidth="3" fill="none" />
      
      <text x="200" y="208" textAnchor="middle" fill="#0F172A" fontSize="13" fontWeight="700" fontFamily="sans-serif">Tenant-Isolated RAG</text>
      <text x="200" y="226" textAnchor="middle" fill="#64748B" fontSize="11" fontFamily="sans-serif">Row-Level Security & Encrypted Chunks</text>
    </g>
  </svg>
);
