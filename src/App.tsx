import { useState } from 'react';
import { ThemeProvider } from './components/ThemeContext';
import { PortfolioProvider, usePortfolio } from './components/PortfolioContext';
import LoadingScreen from './components/LoadingScreen';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Certifications from './components/Certifications';
import Testimonials from './components/Testimonials';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ResumeModal from './components/ResumeModal';
import AuthScreen from './components/AuthScreen';
import BuilderConsole from './components/BuilderConsole';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, Edit3, Settings } from 'lucide-react';

function PortfolioApp() {
  const [isLoading, setIsLoading] = useState(true);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const { 
    username, 
    isEditing, 
    setIsEditing, 
    isGuestMode, 
    setGuestMode, 
    login, 
    portfolioData, 
    savePortfolio, 
    logout, 
    activeViewPage
  } = usePortfolio();

  // 1. Initial Loader Screen
  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  // 2. Authentication Shield: If not logged in and not in guest preview mode
  if (!username && !isGuestMode) {
    return <AuthScreen onSuccess={login} onEnterGuestMode={() => setGuestMode(true)} />;
  }

  // Helper to render the selected discrete portfolio page in standard multipage mode
  const renderActivePage = () => {
    switch (activeViewPage) {
      case 'home':
        return <Hero />;
      case 'about':
        return <About onOpenResume={() => setIsResumeOpen(true)} />;
      case 'skills':
        return <Skills />;
      case 'projects':
        return <Projects />;
      case 'experience':
        return <Experience />;
      case 'certifications':
        return <Certifications />;
      case 'blog':
        return <Blog />;
      case 'contact':
        return <Contact />;
      default:
        return <Hero />;
    }
  };

  return (
    <>
      {/* Either render Cockpit Builder Console or Live View */}
      {username && isEditing ? (
        <BuilderConsole 
          portfolio={portfolioData}
          onSave={savePortfolio}
          onLogout={logout}
          onTogglePreview={() => setIsEditing(false)}
          username={username}
        />
      ) : (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 antialiased selection:bg-indigo-500 selection:text-white pb-6">
          {/* Main Navigation */}
          <Header />

          {/* Discrete Multipage Viewport Container */}
          <main className="min-h-[calc(100vh-280px)] pt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeViewPage}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {renderActivePage()}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Bottom Section */}
          <Footer />

          {/* Floating Utilities */}
          <ScrollToTop />

          {/* Floating Quick Action: Switch back to Console for logged in authors */}
          {username && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="fixed bottom-6 left-6 z-40 px-4 py-3 rounded-full shadow-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 flex items-center gap-2 font-bold text-xs font-mono border border-slate-700/20 hover:opacity-90 cursor-pointer"
              title="Return to Builder Panel"
            >
              <Settings className="w-4 h-4 animate-spin-slow" />
              <span>Builder Console</span>
            </motion.button>
          )}

          {/* Interactive Printable CV Preview Modal */}
          <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <ThemeProvider>
        <PortfolioApp />
      </ThemeProvider>
    </PortfolioProvider>
  );
}
