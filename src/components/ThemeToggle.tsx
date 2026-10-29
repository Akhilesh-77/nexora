import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ThemeToggle: React.FC<{ showLabel?: boolean; className?: string }> = ({
  showLabel = false,
  className = '',
}) => {
  const { effectiveTheme, setTheme } = useApp();
  const isDark = effectiveTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`group relative flex items-center gap-2 p-2 sm:px-3 sm:py-1.5 rounded-xl border transition-all duration-300 cursor-pointer ${
        isDark
          ? 'bg-[#151821] text-amber-300 border-slate-700/80 hover:border-amber-400/50 hover:bg-slate-800 shadow-sm'
          : 'bg-white text-slate-700 border-slate-200/90 hover:border-[#4F46E5]/40 hover:text-[#4F46E5] shadow-xs'
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400 rotate-0 transition-transform duration-300 group-hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-slate-700 group-hover:text-[#4F46E5] -rotate-12 transition-transform duration-300 group-hover:rotate-0" />
        )}
      </div>

      {showLabel && (
        <span className="text-xs font-semibold tracking-tight">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
};

