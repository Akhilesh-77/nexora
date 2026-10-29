import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Sparkles,
  X,
  Send,
  Bot,
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

export const NexoraAssistant: React.FC = () => {
  const {
    profile,
    setCurrentPage,
    assistantOpen,
    setAssistantOpen,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<AssistantFaqCategory | null>(null);
  const [selectedItem, setSelectedItem] = useState<AssistantFaqItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [speechState, setSpeechState] = useState<SpeechRecognitionState>('idle');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);

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

  // Text-To-Speech (TTS) for FAQ answer
  const handleToggleSpeak = (text: string) => {
    if (isPlayingAudio) {
      voiceService.stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      voiceService.speak(text, {
        onStart: () => setIsPlayingAudio(true),
        onEnd: () => setIsPlayingAudio(false),
      });
    }
  };

  // Stop audio whenever selection changes
  useEffect(() => {
    voiceService.stopSpeaking();
    setIsPlayingAudio(false);
    contentAreaRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedCategory, selectedItem]);

  // Navigate to Studio CTA
  const handleActionClick = (page?: NavPage) => {
    if (page) {
      setCurrentPage(page);
      setAssistantOpen(false);
    }
  };

  // Filtered Items across Search
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
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            )}
          </div>
        </button>
      </div>

      {/* 2. FLOATING ASSISTANT PANEL */}
      {assistantOpen && (
        <div className="fixed bottom-24 md:bottom-22 right-4 md:right-8 z-50 w-[calc(100vw-32px)] sm:w-[460px] max-h-[620px] h-[580px] bg-white dark:bg-[#141824] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 print:hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50/90 dark:bg-[#0D1017]/90 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#4F46E5] to-cyan-400 p-0.5 flex items-center justify-center shadow-xs">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-[#111827] dark:text-white">
                    NEXORA Assistant
                  </h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-50 text-[#4F46E5] dark:bg-indigo-950 dark:text-cyan-400 border border-indigo-200 dark:border-indigo-800">
                    Knowledge Base
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[240px]">
                  Grounded in RVCE placement curriculum
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
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

          {/* Search Bar & Voice Input */}
          <div className="p-3 bg-slate-50/60 dark:bg-[#0f131d]/60 border-b border-slate-200/80 dark:border-slate-800/80">
            <div className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search concepts, aptitude formulas, interview questions..."
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-white dark:bg-[#1a1e2b] border border-slate-200 dark:border-slate-700 text-xs text-[#111827] dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-[#4F46E5] transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Voice Search Button */}
              <button
                type="button"
                onClick={handleToggleMic}
                className={`p-2 rounded-xl transition-all cursor-pointer shrink-0 ${
                  speechState === 'listening'
                    ? 'bg-rose-500 text-white ring-2 ring-rose-400/40 animate-pulse'
                    : 'bg-white dark:bg-[#1a1e2b] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#4F46E5] dark:hover:text-cyan-400'
                }`}
                title={speechState === 'listening' ? 'Listening... click to stop' : 'Search with voice'}
              >
                {speechState === 'listening' ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>
            </div>

            {speechError && (
              <p className="mt-1.5 text-[11px] text-rose-500 font-medium px-1">
                {speechError}
              </p>
            )}
          </div>

          {/* Main Scrollable Body */}
          <div ref={contentAreaRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* VIEW A: Search Results Active */}
            {searchQuery.trim() ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Search Results ({searchResults.length})
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
                    <p className="text-[11px] text-slate-400 mt-1">
                      Try browsing the 8 placement categories below.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {searchResults.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSelectedItem(item);
                          setSearchQuery('');
                        }}
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
            ) : selectedItem ? (
              /* VIEW B: Specific FAQ Detail View */
              <div className="space-y-4">
                {/* Back to Category or Categories */}
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#4F46E5] dark:text-slate-400 dark:hover:text-cyan-400 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to {selectedCategory ? selectedCategory.title : 'All Categories'}</span>
                </button>

                {/* Question Title & TTS */}
                <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-sm font-extrabold text-[#111827] dark:text-white leading-snug">
                      {selectedItem.question}
                    </h4>
                    <button
                      type="button"
                      onClick={() => handleToggleSpeak(selectedItem.answer)}
                      className={`p-2 rounded-xl transition-colors shrink-0 cursor-pointer ${
                        isPlayingAudio
                          ? 'bg-rose-500 text-white shadow-xs'
                          : 'bg-white dark:bg-[#1a1e2b] text-slate-600 dark:text-slate-300 hover:text-[#4F46E5] dark:hover:text-cyan-400 shadow-xs'
                      }`}
                      title={isPlayingAudio ? 'Stop reading' : 'Read aloud with natural voice'}
                    >
                      {isPlayingAudio ? (
                        <VolumeX className="w-4 h-4 animate-pulse" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-indigo-600 dark:text-cyan-300 font-medium mt-1">
                    {selectedItem.shortSummary}
                  </p>
                </div>

                {/* Grounded Detailed Answer */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#171b26] border border-slate-200 dark:border-slate-800 text-xs leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line font-normal">
                  {selectedItem.answer}
                </div>

                {/* Action CTA Button */}
                {selectedItem.actionText && selectedItem.actionPage && (
                  <button
                    type="button"
                    onClick={() => handleActionClick(selectedItem.actionPage)}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#4F46E5] to-cyan-500 text-white font-semibold text-xs shadow-md hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{selectedItem.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Related Follow-Up Questions */}
                {selectedItem.relatedFaqIds && selectedItem.relatedFaqIds.length > 0 && (
                  <div className="pt-2">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Related Follow-ups
                    </p>
                    <div className="space-y-1.5">
                      {selectedItem.relatedFaqIds.map((relId) => {
                        const relItem = FAQ_ITEMS.find((f) => f.id === relId);
                        if (!relItem) return null;
                        return (
                          <button
                            key={relItem.id}
                            type="button"
                            onClick={() => setSelectedItem(relItem)}
                            className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1e2b] hover:bg-slate-100 dark:hover:bg-[#202535] border border-slate-200/80 dark:border-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-between"
                          >
                            <span className="truncate pr-2">{relItem.question}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : selectedCategory ? (
              /* VIEW C: Questions inside selected Category */
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

                <div className="space-y-2">
                  {FAQ_ITEMS.filter((item) => item.categoryId === selectedCategory.id).map(
                    (item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedItem(item)}
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
              /* VIEW D: Category Grid (8 Domains) */
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#171b26] border border-slate-200 dark:border-slate-800 text-center">
                  <p className="text-xs font-bold text-[#111827] dark:text-white">
                    Placement Knowledge Assistant
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Click a preparation category below or search above.
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
            )}
          </div>

          {/* Footer Transparency Notice */}
          <div className="px-4 py-2 bg-slate-50 dark:bg-[#0D1017] border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              Knowledge-Base Engine • Grounded in RVCE placement curriculum
            </p>
          </div>
        </div>
      )}
    </>
  );
};
