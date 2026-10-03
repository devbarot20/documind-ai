import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Search, Trash2, ArrowRight, MessageSquare, Calendar, Loader2 } from 'lucide-react';
import { chatApi } from '../services/api';
import type { Conversation } from '../types';
import toast from 'react-hot-toast';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await chatApi.listConversations();
      setConversations(res.conversations);
    } catch (err) {
      console.error('Failed to fetch history:', err);
      toast.error('Failed to load conversation history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Delete this conversation history?')) return;

    setDeletingId(id);
    try {
      await chatApi.deleteConversation(id);
      toast.success('Conversation deleted');
      setConversations(conversations.filter((c) => c.id !== id));
    } catch (err) {
      toast.error('Failed to delete conversation');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Conversation History</h1>
        <p className="text-slate-400 text-sm mt-0.5">
          View and reopen past natural-language document analysis sessions.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search chat titles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
        />
      </div>

      {/* History List */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 text-sm">Loading chat history...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-12 text-center space-y-3">
          <History className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-200">No chat history found</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            {search ? 'No matching conversation titles found.' : 'Start a chat to save conversation sessions.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((conv) => (
            <div
              key={conv.id}
              onClick={() => navigate(`/app/chat?id=${conv.id}`)}
              className="bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/50 rounded-2xl p-4 shadow-lg flex items-center justify-between cursor-pointer transition group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition">
                  <MessageSquare className="w-5 h-5" />
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-100 text-sm truncate group-hover:text-indigo-300 transition">
                    {conv.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {new Date(conv.updated_at).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>{conv.message_count} messages</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleDelete(conv.id, e)}
                  disabled={deletingId === conv.id}
                  className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                  title="Delete conversation"
                >
                  {deletingId === conv.id ? (
                    <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
