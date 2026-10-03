import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Trash2,
  MessageSquare,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { documentApi } from '../services/api';
import type { Document } from '../types';
import { UploadModal } from '../components/UploadModal';
import toast from 'react-hot-toast';

export const DocumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await documentApi.list({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: search || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
      });
      setDocuments(res.documents);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [search, statusFilter, sortBy, sortOrder]);

  useEffect(() => {
    const hasProcessing = documents.some((d) => d.status === 'processing');
    if (!hasProcessing) return;

    const interval = setInterval(async () => {
      const res = await documentApi.list({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: search || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
      });
      setDocuments(res.documents);
    }, 3000);

    return () => clearInterval(interval);
  }, [documents, statusFilter, search, sortBy, sortOrder]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    setDeletingId(id);
    try {
      await documentApi.delete(id);
      toast.success('Document deleted successfully');
      setDocuments(documents.filter((d) => d.id !== id));
    } catch (err) {
      toast.error('Failed to delete document');
    } finally {
      setDeletingId(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Document Library</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Manage your PDF documents and vector search indexes.
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium py-3 px-5 rounded-2xl transition shadow-lg shadow-indigo-600/20 text-xs uppercase tracking-wider active:scale-[0.98]"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload PDF</span>
        </button>
      </div>

      {/* Control Bar */}
      <div className="glass-panel p-4 rounded-3xl border border-white/[0.08] flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documents by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0b0f19] border border-white/[0.08] rounded-xl text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0b0f19] border border-white/[0.08] text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Ready</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#0b0f19] border border-white/[0.08] text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="created_at">Date Uploaded</option>
            <option value="original_filename">Name</option>
            <option value="file_size">Size</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="p-2 bg-[#0b0f19] border border-white/[0.08] rounded-xl text-slate-400 hover:text-white transition text-xs font-mono"
          >
            {sortOrder === 'desc' ? 'DESC' : 'ASC'}
          </button>

          <button
            onClick={fetchDocuments}
            className="p-2 bg-[#0b0f19] border border-white/[0.08] rounded-xl text-slate-400 hover:text-white transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 text-xs">Loading document library...</div>
      ) : documents.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-white/[0.08] text-center space-y-4">
          <FileText className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-200">No documents found</h3>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-indigo-500 transition"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="glass-panel p-5 rounded-3xl border border-white/[0.08] glass-panel-hover flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>

                  {doc.status === 'completed' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      Ready
                    </span>
                  )}
                  {doc.status === 'processing' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Processing
                    </span>
                  )}
                  {doc.status === 'failed' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      <AlertCircle className="w-3 h-3" />
                      Failed
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-slate-100 text-xs truncate" title={doc.original_filename}>
                    {doc.original_filename}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400">
                    {doc.page_count && <span>{doc.page_count} pages</span>}
                    {doc.page_count && <span>•</span>}
                    <span>{formatFileSize(doc.file_size)}</span>
                  </div>
                </div>

                {doc.processing_error && (
                  <p className="text-[11px] text-rose-400 bg-rose-500/10 p-2 rounded-xl border border-rose-500/20 line-clamp-2">
                    {doc.processing_error}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
                <button
                  onClick={() => handleDelete(doc.id, doc.original_filename)}
                  disabled={deletingId === doc.id}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition text-xs flex items-center gap-1.5"
                >
                  {deletingId === doc.id ? (
                    <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  <span>Delete</span>
                </button>

                {doc.status === 'completed' && (
                  <button
                    onClick={() => navigate('/app/chat')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white rounded-xl text-xs font-semibold transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSuccess={fetchDocuments}
      />
    </div>
  );
};
