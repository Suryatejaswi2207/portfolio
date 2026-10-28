import { useState, useEffect, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Sun, Moon, Sparkles, Palette, Check, Settings, Eye } from 'lucide-react';
import { useTheme, AccentColor, accentStyles } from './ThemeContext';
import { usePortfolio } from './PortfolioContext';
import { PortfolioData } from '../lib/portfolioStore';

const allNavLinks = [
  { key: 'home', label: 'Home' },
  { key: 'about', label: 'About' },
  { key: 'skills', label: 'Skills' },
  { key: 'projects', label: 'Projects' },
  { key: 'experience', label: 'Experience' },
  { key: 'certifications', label: 'Credentials' },
  { key: 'blog', label: 'Blog' },
  { key: 'contact', label: 'Contact' },
];

export const isPageEntered = (key: string, data: PortfolioData): boolean => {
  switch (key) {
    case 'home':
      return true; // Always visible
    case 'about':
      return !!data.personalInfo.bio && data.personalInfo.bio.trim().length > 10;
    case 'skills':
      return !!data.skills && data.skills.length > 0;
    case 'projects':
      return !!data.projects && data.projects.length > 0;
    case 'experience':
      return !!data.experiences && data.experiences.length > 0;
    case 'certifications':
      return !!data.certifications && data.certifications.length > 0;
    case 'blog':
      return !!data.blogPosts && data.blogPosts.length > 0;
    case 'contact':
      return !!data.personalInfo.email;
    default:
      return false;
  }
};

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isThemePanelOpen, setIsThemePanelOpen] = useState(false);
  const { mode, accent, activeAccent, toggleTheme, setAccent } = useTheme();
  
  const { 
    portfolioData, 
    username, 
    isEditing, 
    setIsEditing, 
    activeViewPage, 
    setActiveViewPage,
    logout
  } = usePortfolio();

  const { personalInfo } = portfolioData;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter links dynamically based on entered data
  const navLinks = allNavLinks.filter(link => isPageEntered(link.key, portfolioData));

  const handlePageClick = (key: string) => {
    setActiveViewPage(key);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'glass-nav shadow-lg py-3 dark:bg-slate-950/80 bg-white/80 border-b border-slate-200/10'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <motion.a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handlePageClick('home');
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className={`p-1.5 rounded-lg bg-gradient-to-tr ${activeAccent.gradientFrom} ${activeAccent.gradientTo} text-white`}>
            <Sparkles className="w-4 h-4 animate-pulse-slow" />
          </div>
          <span className="font-sans font-bold tracking-tight text-lg text-slate-800 dark:text-white group-hover:opacity-80 transition-opacity">
            {personalInfo.name || "My Portfolio"}
          </span>
        </motion.a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100/50 dark:bg-slate-900/40 p-1.5 rounded-full border border-slate-200/10 backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive = activeViewPage === link.key;
            return (
              <a
                key={link.key}
                href={`#${link.key}`}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageClick(link.key);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 relative ${
                  isActive
                    ? 'text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className={`absolute inset-0 rounded-full bg-gradient-to-r -z-10 ${activeAccent.gradientFrom} ${activeAccent.gradientTo}`}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Actions (Theme Switches) */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Accent Color Trigger */}
          <div className="relative">
            <button
              onClick={() => setIsThemePanelOpen(!isThemePanelOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Change Accent Color"
            >
              <Palette className="w-4 h-4" />
            </button>

            {/* Accent Select Floating panel */}
            <AnimatePresence>
              {isThemePanelOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsThemePanelOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/20 shadow-xl z-20 flex flex-col gap-2.5 min-w-[150px]"
                  >
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                      Accent Theme
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {(Object.keys(accentStyles) as AccentColor[]).map((col) => {
                        const style = accentStyles[col];
                        const isSelected = accent === col;
                        const bgClass = style.primaryBg.split(' ')[0];
                        return (
                          <button
                            key={col}
                            onClick={() => {
                              setAccent(col);
                              setIsThemePanelOpen(false);
                            }}
                            className={`w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-110 ${bgClass}`}
                            title={`Select ${col}`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer mr-1"
            title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {mode === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Admin Back to Editor Control */}
          {username && (
            <div className="flex items-center gap-1.5 border-l border-slate-200/10 pl-3">
              <button
                onClick={() => setIsEditing(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide flex items-center gap-1 transition-transform duration-200 hover:scale-103 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-250 dark:hover:bg-slate-700 cursor-pointer`}
                title="Return to Builder Panel"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Console</span>
              </button>
              <button
                onClick={logout}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-colors cursor-pointer"
                title="Log Out Session"
              >
                Exit
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburguer Toggler */}
        <div className="flex lg:hidden items-center gap-2">
          {/* Quick Console switch for mobile if logged in */}
          {username && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Return to Builder Panel"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

          {/* Quick theme change for mobile */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {mode === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden w-full bg-white dark:bg-slate-950 border-b border-slate-200/10 shadow-lg overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {/* Accent Color Row */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-400 font-mono">Accent Style</span>
                <div className="flex gap-2">
                  {(Object.keys(accentStyles) as AccentColor[]).map((col) => {
                    const style = accentStyles[col];
                    const isSelected = accent === col;
                    const bgClass = style.primaryBg.split(' ')[0];
                    return (
                      <button
                        key={col}
                        onClick={() => setAccent(col)}
                        className={`w-5.5 h-5.5 rounded-full flex items-center justify-center cursor-pointer transition-transform duration-200 ${bgClass}`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Links */}
              {navLinks.map((link) => {
                const isActive = activeViewPage === link.key;
                return (
                  <button
                    key={link.key}
                    onClick={() => handlePageClick(link.key)}
                    className={`py-2 text-left text-sm font-semibold tracking-wide transition-colors cursor-pointer w-full flex items-center justify-between ${
                      isActive ? activeAccent.primaryText : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}

              {/* Mobile Logout option if logged in */}
              {username && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="py-2.5 text-left text-sm font-bold text-rose-500 border-t border-slate-100 dark:border-slate-800/60 mt-2 w-full cursor-pointer"
                >
                  Log Out Session
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
