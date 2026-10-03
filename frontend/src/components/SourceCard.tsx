import React, { useState } from 'react';
import type { SourceCitation } from '../types';
import { FileText, ChevronDown, ChevronUp, Quote } from 'lucide-react';

interface SourceCardProps {
  citation: SourceCitation;
}

export const SourceCard: React.FC<SourceCardProps> = ({ citation }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 transition text-xs space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex items-center justify-center shrink-0 w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-[11px] border border-indigo-500/30">
            {citation.citation_number}
          </span>
          <div className="flex items-center gap-1.5 min-w-0">
            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-200 truncate">{citation.document_name}</span>
          </div>
        </div>

        {citation.page_number && (
          <span className="shrink-0 px-2 py-0.5 bg-slate-800 text-slate-400 rounded-md font-mono text-[11px]">
            Page {citation.page_number}
          </span>
        )}
      </div>

      <div className="relative pl-3 border-l-2 border-indigo-500/40 text-slate-300 bg-slate-950/40 rounded-r-lg p-2 font-sans leading-relaxed">
        <Quote className="w-3 h-3 text-slate-500 absolute -top-1 right-2 opacity-50" />
        <p className={expanded ? '' : 'line-clamp-2'}>{citation.excerpt}</p>
        {citation.excerpt.length > 120 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-1 flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium text-[11px] transition"
          >
            <span>{expanded ? 'Show less' : 'Read full excerpt'}</span>
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}
      </div>
    </div>
  );
};
