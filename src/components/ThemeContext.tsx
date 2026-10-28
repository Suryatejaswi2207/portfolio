import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark';
export type AccentColor = 'indigo' | 'emerald' | 'amber' | 'rose' | 'violet';

export interface AccentStyle {
  primaryText: string;
  primaryBg: string;
  primaryBorder: string;
  gradientFrom: string;
  gradientTo: string;
  focusRing: string;
  badgeBg: string;
  badgeText: string;
  accentColor: AccentColor;
}

export const accentStyles: Record<AccentColor, AccentStyle> = {
  indigo: {
    primaryText: "text-indigo-600 dark:text-indigo-400",
    primaryBg: "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white",
    primaryBorder: "border-indigo-500/20 dark:border-indigo-400/20 focus:border-indigo-500",
    gradientFrom: "from-indigo-600 dark:from-indigo-500",
    gradientTo: "to-violet-600 dark:to-violet-500",
    focusRing: "focus:ring-indigo-500 dark:focus:ring-indigo-400",
    badgeBg: "bg-indigo-500/10 dark:bg-indigo-400/10",
    badgeText: "text-indigo-700 dark:text-indigo-300",
    accentColor: "indigo"
  },
  emerald: {
    primaryText: "text-emerald-600 dark:text-emerald-400",
    primaryBg: "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white",
    primaryBorder: "border-emerald-500/20 dark:border-emerald-400/20 focus:border-emerald-500",
    gradientFrom: "from-emerald-600 dark:from-emerald-500",
    gradientTo: "to-teal-600 dark:to-teal-500",
    focusRing: "focus:ring-emerald-500 dark:focus:ring-emerald-400",
    badgeBg: "bg-emerald-500/10 dark:bg-emerald-400/10",
    badgeText: "text-emerald-700 dark:text-emerald-300",
    accentColor: "emerald"
  },
  amber: {
    primaryText: "text-amber-600 dark:text-amber-400",
    primaryBg: "bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white",
    primaryBorder: "border-amber-500/20 dark:border-amber-400/20 focus:border-amber-500",
    gradientFrom: "from-amber-600 dark:from-amber-500",
    gradientTo: "to-orange-600 dark:to-orange-500",
    focusRing: "focus:ring-amber-500 dark:focus:ring-amber-400",
    badgeBg: "bg-amber-500/10 dark:bg-amber-400/10",
    badgeText: "text-amber-700 dark:text-amber-300",
    accentColor: "amber"
  },
  rose: {
    primaryText: "text-rose-600 dark:text-rose-400",
    primaryBg: "bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 text-white",
    primaryBorder: "border-rose-500/20 dark:border-rose-400/20 focus:border-rose-500",
    gradientFrom: "from-rose-600 dark:from-rose-500",
    gradientTo: "to-pink-600 dark:to-pink-500",
    focusRing: "focus:ring-rose-500 dark:focus:ring-rose-400",
    badgeBg: "bg-rose-500/10 dark:bg-rose-400/10",
    badgeText: "text-rose-700 dark:text-rose-300",
    accentColor: "rose"
  },
  violet: {
    primaryText: "text-violet-600 dark:text-violet-400",
    primaryBg: "bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 text-white",
    primaryBorder: "border-violet-500/20 dark:border-violet-400/20 focus:border-violet-500",
    gradientFrom: "from-violet-600 dark:from-violet-500",
    gradientTo: "to-fuchsia-600 dark:to-fuchsia-500",
    focusRing: "focus:ring-violet-500 dark:focus:ring-violet-400",
    badgeBg: "bg-violet-500/10 dark:bg-violet-400/10",
    badgeText: "text-violet-700 dark:text-violet-300",
    accentColor: "violet"
  }
};

interface ThemeContextType {
  mode: ThemeMode;
  accent: AccentColor;
  activeAccent: AccentStyle;
  toggleTheme: () => void;
  setAccent: (accent: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('portfolio-theme-mode');
    return (saved as ThemeMode) || 'dark'; // Let's default to dark theme for that immersive Apple/Stripe feel!
  });

  const [accent, setAccentState] = useState<AccentColor>(() => {
    const saved = localStorage.getItem('portfolio-theme-accent');
    return (saved as AccentColor) || 'indigo';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('portfolio-theme-mode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('portfolio-theme-accent', accent);
  }, [accent]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setAccent = (newAccent: AccentColor) => {
    setAccentState(newAccent);
  };

  const activeAccent = accentStyles[accent];

  return (
    <ThemeContext.Provider value={{ mode, accent, activeAccent, toggleTheme, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
