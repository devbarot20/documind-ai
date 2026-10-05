import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import {
  Send,
  BrainCircuit,
  Plus,
  Loader2,
  Copy,
  Check,
  Sparkles,
  MessageSquare,
  BookOpen,
  Layers,
} from 'lucide-react';
import { chatApi, documentApi } from '../services/api';
import type { Conversation, Message, Document } from '../types';
import { SourceCard } from '../components/SourceCard';
import toast from 'react-hot-toast';

export const ChatPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const conversationIdFromUrl = searchParams.get('id');

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userDocuments, setUserDocuments] = useState<Document[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>('all');

  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        // Load documents
        const docsRes = await documentApi.list({ status: 'completed' });
        setUserDocuments(docsRes.documents);

        // Load conversations
        const convsRes = await chatApi.listConversations();
        setConversations(convsRes.conversations);

        if (conversationIdFromUrl) {
          await loadConversation(conversationIdFromUrl);
        } else if (convsRes.conversations.length > 0) {
          await loadConversation(convsRes.conversations[0].id);
        } else {
          await handleNewChat();
        }
      } catch (err) {
        console.error('Failed to init chat page:', err);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [conversationIdFromUrl]);

  const loadConversation = async (id: string) => {
    try {
      const detail = await chatApi.getConversation(id);
      setCurrentConversation(detail);
      setMessages(detail.messages);
      setSearchParams({ id });
    } catch (err) {
      console.error('Failed to load conversation:', err);
    }
  };

  const handleNewChat = async () => {
    try {
      const docIds = selectedDocId !== 'all' ? [selectedDocId] : undefined;
      const newConv = await chatApi.createConversation({
        title: 'New Session',
        document_ids: docIds,
      });

      setConversations([newConv, ...conversations]);
      setCurrentConversation(newConv);
      setMessages([]);
      setSearchParams({ id: newConv.id });
    } catch (err) {
      toast.error('Failed to create new conversation');
    }
  };

  const handleSendMessage = async (textOveride?: string) => {
    const textToSend = textOveride || input;
    if (!textToSend.trim() || sending || !currentConversation) return;

    const userText = textToSend.trim();
    setInput('');
    setSending(true);

    const tempUserMsg: Message = {
      id: `temp-${Date.now()}`,
      conversation_id: currentConversation.id,
      role: 'user',
      content: userText,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const response = await chatApi.sendMessage(currentConversation.id, userText);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempUserMsg.id),
        response.user_message,
        response.assistant_message,
      ]);

      chatApi.listConversations().then((res) => setConversations(res.conversations));
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to send message');
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
    } finally {
      setSending(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex h-[calc(100vh-6.5rem)] max-w-7xl mx-auto gap-4">
      {/* Sidebar - Sessions & Knowledge Scope */}
      <div className="hidden lg:flex flex-col w-72 bg-white rounded-2xl border border-slate-200 p-4 space-y-4 shadow-2xs">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl transition shadow-2xs active:scale-[0.98] text-xs uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" />
          <span>New Session</span>
        </button>

        {/* Scope selector */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 px-1">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>Document Scope</span>
          </label>
          <select
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-2.5 focus:outline-none focus:border-indigo-500 truncate"
          >
            <option value="all">All Documents ({userDocuments.length})</option>
            {userDocuments.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.original_filename}
              </option>
            ))}
          </select>
        </div>

        {/* History */}
        <div className="flex-1 overflow-y-auto space-y-1 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
            Past Conversations
          </span>
          {conversations.map((conv) => {
            const isActive = currentConversation?.id === conv.id;
            return (
              <button
                key={conv.id}
                onClick={() => loadConversation(conv.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left transition ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                <span className="truncate flex-1">{conv.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xs">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600 shrink-0">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                {currentConversation?.title || 'DocuMind Assistant'}
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="truncate">
                  {selectedDocId === 'all'
                    ? `Searching across ${userDocuments.length} ready documents`
                    : `Active Scope: ${userDocuments.find((d) => d.id === selectedDocId)?.original_filename || 'Selected Document'}`}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleNewChat}
            className="lg:hidden p-2 text-indigo-600 bg-indigo-50 rounded-xl border border-indigo-100"
            title="New Chat"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {loading ? (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs">
              <Loader2 className="w-4 h-4 animate-spin mr-2 text-indigo-600" />
              Loading conversation session...
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 max-w-sm mx-auto">
              <div className="p-3.5 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-600">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Ask your documents anything</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Type a natural-language question below to query your uploaded PDFs with source citations.
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={msg.id || index}
                className={`flex gap-3 md:gap-4 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-2xs">
                    <BrainCircuit className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] space-y-3 ${
                    msg.role === 'user'
                      ? 'bg-slate-900 text-white p-4 rounded-2xl rounded-tr-xs shadow-xs font-normal text-xs sm:text-sm'
                      : 'bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl rounded-tl-xs shadow-2xs text-slate-800 text-xs sm:text-sm'
                  }`}
                >
                  <div className={`prose-light max-w-none leading-relaxed ${msg.role === 'user' ? 'text-white' : ''}`}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>

                  {/* Sources section */}
                  {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                    <div className="pt-3 border-t border-slate-200/80 space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Source References ({msg.sources.length})</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.sources.map((citation) => (
                          <SourceCard key={citation.citation_number} citation={citation} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {msg.role === 'assistant' && (
                    <div className="flex items-center justify-end gap-2 pt-1 text-slate-400 text-xs">
                      <button
                        onClick={() => handleCopy(msg.content, index)}
                        className="hover:text-slate-700 transition flex items-center gap-1 text-[11px]"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600 font-medium">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {sending && (
            <div className="flex items-center gap-2.5 text-slate-500 text-xs py-2">
              <div className="w-7 h-7 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              </div>
              <span className="animate-pulse">Searching vector indexes & synthesizing response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3.5 border-t border-slate-100 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5 focus-within:border-indigo-500 transition"
          >
            <input
              type="text"
              placeholder="Ask a question about your documents..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={sending}
              className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || sending}
              className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shadow-2xs disabled:opacity-40 shrink-0"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
