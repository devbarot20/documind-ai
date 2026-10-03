import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  MessageSquare,
  Sparkles,
  ArrowRight,
  HardDrive,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { documentApi, chatApi } from '../services/api';
import type { Document, DocumentStats, Conversation } from '../types';
import { UploadModal } from '../components/UploadModal';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [recentDocs, setRecentDocs] = useState<Document[]>([]);
  const [recentConvs, setRecentConvs] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, docsData, convsData] = await Promise.all([
        documentApi.getStats(),
        documentApi.list({ limit: 5, sort_by: 'created_at', sort_order: 'desc' }),
        chatApi.listConversations(5, 0),
      ]);
      setStats(statsData);
      setRecentDocs(docsData.documents);
      setRecentConvs(convsData.conversations);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      documentApi.list({ limit: 5 }).then((res) => {
        setRecentDocs(res.documents);
        const processingCount = res.documents.filter((d) => d.status === 'processing').length;
        if (processingCount > 0) {
          documentApi.getStats().then(setStats);
        }
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden glass-panel p-8 rounded-3xl border border-white/[0.08] shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-gradient-to-br from-indigo-600/15 via-purple-600/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>DocuMind Intelligence Hub</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Upload your documents, manage vector search indexes, and query your knowledge base.
            </p>
          </div>

          <button
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium py-3.5 px-6 rounded-2xl transition shadow-xl shadow-indigo-600/25 active:scale-[0.98] text-xs uppercase tracking-wider shrink-0"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-3xl border border-white/[0.08] glass-panel-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Files</span>
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-white tracking-tight">
              {loading ? '-' : stats?.total || 0}
            </span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-white/[0.08] glass-panel-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Processing</span>
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-3xl font-bold text-white tracking-tight">
              {loading ? '-' : stats?.processing || 0}
            </span>
            {stats?.processing ? stats.processing > 0 && (
              <span className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> In Progress
              </span>
            ) : null}
          </div>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-white/[0.08] glass-panel-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ready for Chat</span>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-white tracking-tight">
              {loading ? '-' : stats?.completed || 0}
            </span>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-white/[0.08] glass-panel-hover">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Storage Index</span>
            <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-2xl border border-purple-500/20">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-white tracking-tight">
              {loading ? '-' : formatFileSize(stats?.total_size || 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Lists Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Documents */}
        <div className="glass-panel p-6 rounded-3xl border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
                <FileText className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-white">Recent Documents</h2>
            </div>
            <button
              onClick={() => navigate('/app/documents')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500 text-xs">Loading documents...</div>
          ) : recentDocs.length === 0 ? (
            <div className="py-12 border border-dashed border-white/[0.08] rounded-2xl text-center p-6 space-y-3">
              <UploadCloud className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs font-semibold text-slate-300">No documents uploaded yet</p>
              <button
                onClick={() => setUploadModalOpen(true)}
                className="inline-flex items-center gap-2 text-xs font-semibold bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 px-4 py-2 rounded-xl hover:bg-indigo-600/30 transition"
              >
                Upload Document
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3.5 bg-[#0b0f19] border border-white/[0.06] rounded-2xl hover:border-white/[0.12] transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-200 truncate">
                        {doc.original_filename}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {doc.page_count ? `${doc.page_count} pages • ` : ''}
                        {formatFileSize(doc.file_size)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
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

                    {doc.status === 'completed' && (
                      <button
                        onClick={() => navigate('/app/chat')}
                        className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition"
                        title="Chat with document"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Conversations */}
        <div className="glass-panel p-6 rounded-3xl border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-white">Recent Conversations</h2>
            </div>
            <button
              onClick={() => navigate('/app/history')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500 text-xs">Loading conversations...</div>
          ) : recentConvs.length === 0 ? (
            <div className="py-12 border border-dashed border-white/[0.08] rounded-2xl text-center p-6 space-y-3">
              <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs font-semibold text-slate-300">No chat history yet</p>
              <button
                onClick={() => navigate('/app/chat')}
                className="inline-flex items-center gap-2 text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-2 rounded-xl hover:from-indigo-500 hover:to-violet-500 transition shadow-md shadow-indigo-600/20"
              >
                Start New Chat
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentConvs.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => navigate(`/app/chat?id=${conv.id}`)}
                  className="flex items-center justify-between p-3.5 bg-[#0b0f19] border border-white/[0.06] rounded-2xl hover:border-indigo-500/40 cursor-pointer transition group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-indigo-300 transition">
                        {conv.title}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {conv.message_count} messages •{' '}
                        {new Date(conv.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
};
