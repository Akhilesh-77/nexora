import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Sparkles,
  X,
  Send,
  ArrowRight,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Search,
  ArrowLeft,
  HelpCircle,
  Compass,
  CalendarCheck,
  Cpu,
  Calculator,
  Code2,
  MessageSquareCode,
  FileText,
  Award,
  ChevronRight,
  BookOpen,
  RotateCcw,
  MessageCircle,
  Lightbulb,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NavPage } from '../types';
import { voiceService, SpeechRecognitionState } from '../services/voiceService';
import {
  FAQ_CATEGORIES,
  FAQ_ITEMS,
  AssistantFaqCategory,
  AssistantFaqItem,
} from '../data/assistantFaqData';
import { api } from '../services/api';
import { BotFace, BotMood } from './BotFace';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionText?: string;
  actionPage?: NavPage;
  actionPayload?: string;
  relatedFaqIds?: string[];
}

export const NexoraAssistant: React.FC = () => {
  const {
    profile,
    setCurrentPage,
    assistantOpen,
    setAssistantOpen,
  } = useApp();

  // Assistant & Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [botMood, setBotMood] = useState<BotMood>('idle');
  const [activeTab, setActiveTab] = useState<'chat' | 'library'>('chat');
  const [selectedCategory, setSelectedCategory] = useState<AssistantFaqCategory | null>(null);

  // Search & Speech State
  const [searchQuery, setSearchQuery] = useState('');
  const [speechState, setSpeechState] = useState<SpeechRecognitionState>('idle');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Predefined Quick Questions
  const QUICK_PROMPTS = useMemo(() => [
    { label: 'What should I study next?', icon: '🎯' },
    { label: 'Show my progress and streak', icon: '📊' },
    { label: 'Explain Deadlock vs Starvation', icon: '⚡' },
    { label: 'How to answer "Tell me about yourself"?', icon: '💼' },
    { label: 'Top Quantitative Aptitude Formulas', icon: '📐' },
    { label: 'How to optimize resume bullet points?', icon: '📝' },
  ], []);

  // Setup Voice Service Callbacks
  useEffect(() => {
    voiceService.setCallbacks({
      onStateChange: (state) => {
        setSpeechState(state);
        if (state === 'listening') {
          setSpeechError(null);
        }
      },
      onTranscript: (transcript) => {
        setInputText(transcript);
        setSearchQuery(transcript);
      },
      onError: (err) => {
        setSpeechError(err);
      },
    });

    return () => {
      voiceService.stopListening();
      voiceService.stopSpeaking();
    };
  }, []);

  // Voice Input Toggle (STT)
  const handleToggleMic = () => {
    if (speechState === 'listening' || speechState === 'requesting') {
      voiceService.stopListening();
    } else {
      setSpeechError(null);
      const started = voiceService.startListening();
      if (!started) {
        setSpeechError('Microphone not available in this browser.');
      }
    }
  };

  // Text-To-Speech (TTS) for an answer
  const handleToggleSpeak = (msgId: string, text: string) => {
    if (playingAudioId === msgId) {
      voiceService.stopSpeaking();
      setPlayingAudioId(null);
      setBotMood('idle');
    } else {
      voiceService.stopSpeaking();
      setPlayingAudioId(msgId);
      setBotMood('speaking');
      voiceService.speak(text, {
        onStart: () => {
          setPlayingAudioId(msgId);
          setBotMood('speaking');
        },
        onEnd: () => {
          setPlayingAudioId(null);
          setBotMood('idle');
        },
      });
    }
  };

  // Stop speech when assistant closes
  useEffect(() => {
    if (!assistantOpen) {
      voiceService.stopSpeaking();
      voiceService.stopListening();
      setPlayingAudioId(null);
      setBotMood('idle');
    }
  }, [assistantOpen]);

  // Navigate to Studio CTA
  const handleActionClick = (page?: NavPage) => {
    if (page) {
      setCurrentPage(page);
      setAssistantOpen(false);
    }
  };

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatScrollRef.current) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      }
    }, 60);
  };

  // Handle Asking a Question (Predefined or Custom)
  const handleAskQuestion = async (questionText: string, matchedFaq?: AssistantFaqItem) => {
    const trimmed = questionText.trim();
    if (!trimmed || isThinking) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setSearchQuery('');
    setActiveTab('chat');
    setIsThinking(true);
    setBotMood('thinking');
    scrollToBottom();

    const startTime = Date.now();

    try {
      let replyText = '';
      let actionPage: NavPage | undefined = undefined;
      let actionText: string | undefined = undefined;
      let relatedFaqIds: string[] | undefined = undefined;

      // 1. Direct matched FAQ item provided
      if (matchedFaq) {
        replyText = matchedFaq.answer;
        actionPage = matchedFaq.actionPage;
        actionText = matchedFaq.actionText;
        relatedFaqIds = matchedFaq.relatedFaqIds;
      } else {
        // 2. Search local FAQ knowledge base for high-confidence match
        const qLower = trimmed.toLowerCase();
        const localMatch = FAQ_ITEMS.find((f) => {
          const fqLower = f.question.toLowerCase().replace(/[?.,]/g, '');
          const cleanQ = qLower.replace(/[?.,]/g, '');
          return (
            cleanQ === fqLower ||
            cleanQ.includes(fqLower) ||
            fqLower.includes(cleanQ) ||
            f.tags.some((t) => cleanQ.includes(t.toLowerCase()))
          );
        });

        if (localMatch) {
          replyText = localMatch.answer;
          actionPage = localMatch.actionPage;
          actionText = localMatch.actionText;
          relatedFaqIds = localMatch.relatedFaqIds;
        } else {
          // 3. Fallback to server intelligence route
          const res = await api.assistant.query(trimmed);
          if (res.data?.reply) {
            replyText = res.data.reply;
            actionPage = res.data.actionPage as NavPage;
            actionText = actionPage ? `Open ${actionPage.replace('-', ' ')}` : undefined;
          } else {
            replyText = `I analyzed your inquiry about **"${trimmed}"**. Based on your target role (${profile.targetRole || 'Software Developer'}) and branch (${profile.branch || 'Engineering'}), I recommend reviewing foundational modules in Learning Studio or choosing a topic below.`;
            actionPage = 'learning-studio';
            actionText = 'Open Learning Studio';
          }
        }
      }

      // Ensure thoughtful thinking animation displays for minimum 850ms
      const elapsed = Date.now() - startTime;
      const remainingDelay = Math.max(0, 850 - elapsed);
      if (remainingDelay > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingDelay));
      }

      const assistantMsg: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionPage,
        actionText,
        relatedFaqIds,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setBotMood('happy');
      setTimeout(() => {
        setBotMood((curr) => (curr === 'happy' ? 'idle' : curr));
      }, 2500);
    } catch (err) {
      console.warn('[NEXORA Assistant] Query failed, using fallback:', err);
      const fallbackMsg: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'assistant',
        text: `Here is the verified guidance for **${trimmed}**: Make sure to structure your technical answer with a clear concept definition, state key trade-offs, and reference a concrete project.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionPage: 'learning-studio',
        actionText: 'Review in Learning Studio',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      setBotMood('idle');
    } finally {
      setIsThinking(false);
      scrollToBottom();
    }
  };

  // Search filter across FAQ items
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return FAQ_ITEMS.filter((item) => {
      return (
        item.question.toLowerCase().includes(q) ||
        item.shortSummary.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [searchQuery]);

  // Category Icon Resolver
  const renderCategoryIcon = (iconName: string, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'Compass':
        return <Compass className={className} />;
      case 'CalendarCheck':
        return <CalendarCheck className={className} />;
      case 'Cpu':
        return <Cpu className={className} />;
      case 'Calculator':
        return <Calculator className={className} />;
      case 'Code2':
        return <Code2 className={className} />;
      case 'MessageSquareCode':
        return <MessageSquareCode className={className} />;
      case 'FileText':
        return <FileText className={className} />;
      case 'Award':
        return <Award className={className} />;
      default:
        return <BookOpen className={className} />;
    }
  };

  // Clear conversation history
  const handleClearChat = () => {
    voiceService.stopSpeaking();
    setPlayingAudioId(null);
    setMessages([]);
    setBotMood('idle');
  };

  return (
    <>
      {/* 1. FLOATING LAUNCHER TRIGGER (Bottom-Right, non-colliding) */}
      <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-40 print:hidden">
        <button
          type="button"
          onClick={() => setAssistantOpen(!assistantOpen)}
          aria-expanded={assistantOpen}
          aria-label={assistantOpen ? 'Close NEXORA Assistant' : 'Open NEXORA Assistant'}
          title="NEXORA Placement Assistant"
          className="group relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-tr from-[#4F46E5] via-[#4338CA] to-cyan-400 text-white shadow-xl hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <span className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-[#4F46E5] to-cyan-400 opacity-40 blur-xs group-hover:opacity-75 transition-opacity pointer-events-none" />

          <div className="relative z-10 flex items-center justify-center">
            {assistantOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <BotFace mood="idle" size="xs" />
            )}
          </div>
        </button>
      </div>

      {/* 2. FLOATING ASSISTANT PANEL */}
      {assistantOpen && (
        <div className="fixed bottom-24 md:bottom-22 right-4 md:right-8 z-50 w-[calc(100vw-32px)] sm:w-[460px] max-h-[640px] h-[600px] bg-white dark:bg-[#141824] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 print:hidden">
          
          {/* Header with Live Bot Face Avatar */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50/90 dark:bg-[#0D1017]/90 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              {/* Animated Bot Face in Header */}
              <div className="relative">
                <BotFace mood={botMood} size="sm" />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#0D1017] ${
                    isThinking
                      ? 'bg-cyan-400 animate-ping'
                      : botMood === 'speaking'
                      ? 'bg-indigo-500'
                      : 'bg-emerald-500'
                  }`}
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-[#111827] dark:text-white">
                    NEXORA AI
                  </h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-50 text-[#4F46E5] dark:bg-indigo-950 dark:text-cyan-400 border border-indigo-200 dark:border-indigo-800">
                    {isThinking ? 'Thinking...' : botMood === 'speaking' ? 'Speaking...' : 'Online'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[210px]">
                  Campus Placement Mentor • RVCE Curriculum
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearChat}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Clear chat history"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="button"
                onClick={() => setAssistantOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Sub-Tabs: AI Chat vs Knowledge Topics */}
          <div className="flex items-center px-3 pt-2 pb-1.5 bg-slate-50/60 dark:bg-[#0f131d]/60 border-b border-slate-200/80 dark:border-slate-800/80 gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('chat');
                setSelectedCategory(null);
              }}
              className={`flex-1 py-1 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-white dark:bg-[#1f2433] text-[#4F46E5] dark:text-cyan-400 shadow-xs border border-slate-200 dark:border-slate-700'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>AI Chat</span>
              {messages.length > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('library');
                setSelectedCategory(null);
              }}
              className={`flex-1 py-1 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'library'
                  ? 'bg-white dark:bg-[#1f2433] text-[#4F46E5] dark:text-cyan-400 shadow-xs border border-slate-200 dark:border-slate-700'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Knowledge Topics</span>
            </button>
          </div>

          {/* Main Scrollable View Area */}
          <div
            ref={chatScrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
          >
            {/* VIEW 1: SEARCH ACTIVE */}
            {searchQuery.trim() ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Matches ({searchResults.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-[11px] text-[#4F46E5] dark:text-cyan-400 font-semibold hover:underline"
                  >
                    Clear Search
                  </button>
                </div>

                {searchResults.length === 0 ? (
                  <div className="p-6 text-center rounded-2xl bg-slate-50 dark:bg-[#191d2a] border border-dashed border-slate-200 dark:border-slate-800">
                    <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      No matching verified FAQs found for "{searchQuery}".
                    </p>
                    <button
                      type="button"
                      onClick={() => handleAskQuestion(searchQuery)}
                      className="mt-3 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#4F46E5] to-cyan-500 text-white text-xs font-bold shadow-xs hover:scale-105 transition-all inline-flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Ask NEXORA AI directly</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {searchResults.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleAskQuestion(item.question, item)}
                        className="w-full text-left p-3 rounded-2xl bg-slate-50 dark:bg-[#1a1e2b] hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-800 transition-all cursor-pointer group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-bold text-[#111827] dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-cyan-400 transition-colors">
                              {item.question}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                              {item.shortSummary}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#4F46E5] dark:group-hover:text-cyan-400 shrink-0 mt-0.5" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : activeTab === 'library' ? (
              /* VIEW 2: KNOWLEDGE TOPICS & CATEGORIES */
              selectedCategory ? (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(null)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#4F46E5] dark:text-slate-400 dark:hover:text-cyan-400 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>All Categories</span>
                  </button>

                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-50 to-indigo-50/50 dark:from-[#171b26] dark:to-[#1e2335] border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${selectedCategory.color} text-white flex items-center justify-center shrink-0 shadow-xs`}
                    >
                      {renderCategoryIcon(selectedCategory.iconName, 'w-5 h-5')}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#111827] dark:text-white">
                        {selectedCategory.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {selectedCategory.description}
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                    Click any topic to ask the AI:
                  </p>

                  <div className="space-y-2">
                    {FAQ_ITEMS.filter((item) => item.categoryId === selectedCategory.id).map(
                      (item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleAskQuestion(item.question, item)}
                          className="w-full text-left p-3 rounded-2xl bg-slate-50 dark:bg-[#1a1e2b] hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-800 transition-all cursor-pointer group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-xs font-bold text-[#111827] dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-cyan-400 transition-colors">
                                {item.question}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                                {item.shortSummary}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#4F46E5] dark:group-hover:text-cyan-400 shrink-0 mt-0.5" />
                          </div>
                        </button>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#171b26] border border-slate-200 dark:border-slate-800 text-center">
                    <p className="text-xs font-bold text-[#111827] dark:text-white">
                      Placement Knowledge Library
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Select a curriculum domain to explore verified interview prep topics.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {FAQ_CATEGORIES.map((cat) => {
                      const count = FAQ_ITEMS.filter((i) => i.categoryId === cat.id).length;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedCategory(cat)}
                          className="text-left p-3 rounded-2xl bg-slate-50 dark:bg-[#171b26] hover:bg-slate-100 dark:hover:bg-[#1e2335] border border-slate-200 dark:border-slate-800 hover:border-indigo-400/60 dark:hover:border-indigo-500/60 transition-all cursor-pointer group flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div
                                className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center shadow-xs`}
                              >
                                {renderCategoryIcon(cat.iconName, 'w-4 h-4')}
                              </div>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                {count} topics
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-[#111827] dark:text-white group-hover:text-[#4F46E5] dark:group-hover:text-cyan-400 transition-colors">
                              {cat.title}
                            </h4>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                              {cat.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )
            ) : (
              /* VIEW 3: INTERACTIVE AI CHAT STREAM */
              <div className="space-y-4">
                {/* Initial Welcome Hero Card with Animated Bot Face */}
                {messages.length === 0 && (
                  <div className="p-4 rounded-3xl bg-gradient-to-b from-indigo-50/80 to-slate-50/60 dark:from-indigo-950/30 dark:to-[#171b26] border border-indigo-100 dark:border-indigo-900/40 text-center space-y-3">
                    <BotFace
                      mood={botMood}
                      size="md"
                      showStatusText
                    />
                    <div>
                      <h4 className="text-sm font-extrabold text-[#111827] dark:text-white">
                        Hi {profile.name ? profile.name.split(' ')[0] : 'there'}! I'm NEXORA AI
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        I specialize in engineering placement preparation, algorithms, STAR interview answers, and study roadmaps.
                      </p>
                    </div>

                    {/* Predefined Quick Prompts Chips */}
                    <div className="pt-2">
                      <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                        <span>Suggested Questions</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 justify-center">
                        {QUICK_PROMPTS.map((prompt, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleAskQuestion(prompt.label)}
                            className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1a1e2b] hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-slate-200/80 dark:border-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-200 shadow-2xs hover:scale-102 hover:border-indigo-400 transition-all cursor-pointer flex items-center gap-1"
                          >
                            <span>{prompt.icon}</span>
                            <span>{prompt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Conversation History Messages */}
                {messages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  const isSpeaking = playingAudioId === msg.id;

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {/* Assistant Avatar */}
                      {!isUser && (
                        <div className="shrink-0 mt-1">
                          <BotFace mood={isSpeaking ? 'speaking' : 'idle'} size="xs" />
                        </div>
                      )}

                      {/* Message Content Bubble */}
                      <div
                        className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-2 shadow-xs ${
                          isUser
                            ? 'bg-gradient-to-r from-[#4F46E5] to-[#4338CA] text-white rounded-br-xs'
                            : 'bg-white dark:bg-[#1a1e2b] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-xs'
                        }`}
                      >
                        {/* Text */}
                        <div className="whitespace-pre-line font-normal">
                          {msg.text}
                        </div>

                        {/* Assistant Footer Actions */}
                        {!isUser && (
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                            {/* Read Aloud Button */}
                            <button
                              type="button"
                              onClick={() => handleToggleSpeak(msg.id, msg.text)}
                              className={`p-1.5 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                                isSpeaking
                                  ? 'bg-rose-500 text-white'
                                  : 'text-slate-500 dark:text-slate-400 hover:text-[#4F46E5] dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                              }`}
                              title={isSpeaking ? 'Stop speaking' : 'Read aloud with AI voice'}
                            >
                              {isSpeaking ? (
                                <>
                                  <VolumeX className="w-3.5 h-3.5 animate-pulse" />
                                  <span>Stop</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-3.5 h-3.5" />
                                  <span>Listen</span>
                                </>
                              )}
                            </button>

                            {/* Action CTA Button */}
                            {msg.actionText && msg.actionPage && (
                              <button
                                type="button"
                                onClick={() => handleActionClick(msg.actionPage)}
                                className="py-1 px-3 rounded-lg bg-gradient-to-r from-[#4F46E5] to-cyan-500 text-white font-bold text-[11px] shadow-xs hover:scale-102 transition-all flex items-center gap-1 cursor-pointer ml-auto"
                              >
                                <span>{msg.actionText}</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        )}

                        {/* Related Follow-Up Question Chips */}
                        {!isUser && msg.relatedFaqIds && msg.relatedFaqIds.length > 0 && (
                          <div className="pt-1 space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Explore further:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {msg.relatedFaqIds.map((relId) => {
                                const relItem = FAQ_ITEMS.find((f) => f.id === relId);
                                if (!relItem) return null;
                                return (
                                  <button
                                    key={relItem.id}
                                    type="button"
                                    onClick={() => handleAskQuestion(relItem.question, relItem)}
                                    className="px-2 py-1 rounded-md bg-slate-50 dark:bg-[#12151f] hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200/80 dark:border-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-300 hover:text-[#4F46E5] dark:hover:text-cyan-400 transition-colors text-left"
                                  >
                                    • {relItem.question}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* THE THINKING STATE ANIMATION */}
                {isThinking && (
                  <div className="flex items-start gap-2.5 animate-in fade-in duration-200">
                    <div className="shrink-0 mt-1">
                      <BotFace mood="thinking" size="xs" />
                    </div>

                    <div className="p-3.5 rounded-2xl rounded-tl-xs bg-white dark:bg-[#1a1e2b] border border-cyan-400/40 dark:border-cyan-500/30 shadow-md space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#4F46E5] dark:text-cyan-400 flex items-center gap-1">
                          <span>NEXORA AI is thinking</span>
                          <span className="inline-flex gap-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                          </span>
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        Analyzing placement syllabus, algorithms & interview criteria...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Chat Input Bar & Mic Trigger */}
          <div className="p-3 bg-slate-50/90 dark:bg-[#0f131d]/90 border-t border-slate-200 dark:border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskQuestion(inputText);
              }}
              className="relative flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    setSearchQuery(e.target.value);
                  }}
                  placeholder="Ask a question or search concepts..."
                  disabled={isThinking}
                  className="w-full pl-3 pr-8 py-2 rounded-xl bg-white dark:bg-[#1a1e2b] border border-slate-200 dark:border-slate-700 text-xs text-[#111827] dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-[#4F46E5] transition-colors disabled:opacity-60"
                />
                {inputText && (
                  <button
                    type="button"
                    onClick={() => {
                      setInputText('');
                      setSearchQuery('');
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Voice Input Button */}
              <button
                type="button"
                onClick={handleToggleMic}
                className={`p-2 rounded-xl transition-all cursor-pointer shrink-0 ${
                  speechState === 'listening'
                    ? 'bg-rose-500 text-white ring-2 ring-rose-400/40 animate-pulse'
                    : 'bg-white dark:bg-[#1a1e2b] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#4F46E5] dark:hover:text-cyan-400'
                }`}
                title={speechState === 'listening' ? 'Listening... click to stop' : 'Ask with voice'}
              >
                {speechState === 'listening' ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputText.trim() || isThinking}
                className="p-2 rounded-xl bg-gradient-to-r from-[#4F46E5] to-cyan-500 text-white shadow-xs hover:shadow-indigo-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
                title="Send inquiry"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {speechError && (
              <p className="mt-1 text-[11px] text-rose-500 font-medium px-1">
                {speechError}
              </p>
            )}
          </div>

          {/* Footer Transparency Notice */}
          <div className="px-4 py-1.5 bg-slate-100/80 dark:bg-[#0A0D14] border-t border-slate-200/80 dark:border-slate-800 text-center">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              Grounded in RVCE placement curriculum • Deterministic & Verified Intelligence
            </p>
          </div>
        </div>
      )}
    </>
  );
};
