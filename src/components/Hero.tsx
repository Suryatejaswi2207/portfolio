import { useState, useEffect, useRef, MouseEvent } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight, Github, Linkedin, Twitter, Mail, Sparkles, BookOpen } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { usePortfolio } from './PortfolioContext';

// Custom CountUp Component for premium stat counting
function CountUp({ value, suffix, label }: { value: number; suffix: string; label: string; key?: any }) {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(countRef, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 1500; // ms
      const incrementTime = Math.max(Math.floor(duration / value), 20);
      const step = value > 50 ? Math.ceil(value / 50) : 1;

      const timer = setInterval(() => {
        start += step;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <div ref={countRef} className="flex flex-col items-center justify-center p-6 rounded-3xl border border-slate-200/30 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-md shadow-lg transition-transform duration-300 hover:scale-105">
      <div className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white flex items-baseline">
        <span className="bg-gradient-to-r from-slate-900 to-slate-750 dark:from-white dark:to-slate-300 bg-clip-text">{count}</span>
        <span className="text-indigo-500 dark:text-indigo-400 font-black ml-0.5">{suffix}</span>
      </div>
      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1.5 uppercase tracking-widest font-mono">
        {label}
      </p>
    </div>
  );
}

export default function Hero() {
  const { activeAccent } = useTheme();
  const { portfolioData, setActiveViewPage } = usePortfolio();
  const { personalInfo, stats } = portfolioData;
  
  // Typing Animation Configuration
  const roles = [
    personalInfo.title || "Software Engineer",
    "Creative Interface Architect",
    "Systems & Automation Integrator",
    "High-Performance Web Developer"
  ];
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (roles.length === 0) return;
    const activeRole = roles[currentRoleIndex] || "";
    let typingSpeed = isDeleting ? 30 : 70;

    if (!isDeleting && currentText === activeRole) {
      typingSpeed = 2000; // Hold full phrase
      setIsDeleting(true);
    } else if (isDeleting && currentText === "") {
      setIsDeleting(false);
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
      typingSpeed = 500; // Small delay before typing next
    }

    const timer = setTimeout(() => {
      setCurrentText((prev) => {
        if (isDeleting) {
          return activeRole.substring(0, prev.length - 1);
        } else {
          return activeRole.substring(0, prev.length + 1);
        }
      });
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentRoleIndex, personalInfo.title]);

  const handleSmoothScroll = (e: MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      const top = (target as HTMLElement).offsetTop - 80;
      window.scrollTo({
        top,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center items-center pt-24 pb-16 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300"
    >
      {/* Mesh Background Blobs */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-3xl animate-float-slow`} />
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-violet-500/10 dark:bg-violet-500/5 blur-3xl animate-float-medium`} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full flex flex-col items-center">
        {/* Launcher Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200/25 glass-panel text-xs text-slate-600 dark:text-slate-300 mb-6 shadow-sm"
        >
          <Sparkles className={`w-3.5 h-3.5 ${activeAccent.primaryText} animate-pulse-slow`} />
          <span className="font-semibold tracking-wide">Available for selective contract projects</span>
        </motion.div>

        {/* Profile Avatar with Hover Visual Ripple */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.1 }}
          className="relative w-28 h-28 mb-8 group"
        >
          <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${activeAccent.gradientFrom} ${activeAccent.gradientTo} opacity-30 blur-md group-hover:opacity-60 transition-opacity duration-300`} />
          <img
            src={personalInfo.avatar}
            alt={personalInfo.name}
            referrerPolicy="no-referrer"
            className="w-full h-full rounded-full object-cover border-4 border-white dark:border-slate-900 shadow-md relative z-10"
          />
        </motion.div>

        {/* Dynamic Headers */}
        <div className="text-center max-w-3xl mb-10 flex flex-col items-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xs font-black uppercase tracking-widest font-mono text-indigo-500 dark:text-indigo-400 mb-3"
          >
            Creative Technologist
          </motion.h2>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl sm:text-7xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-6"
          >
            Hi, I'm <span className={`bg-gradient-to-r ${activeAccent.gradientFrom} ${activeAccent.gradientTo} bg-clip-text text-transparent`}>{personalInfo.name}</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg sm:text-xl font-bold text-slate-700 dark:text-slate-300 h-10 tracking-tight flex items-center justify-center font-mono"
          >
            <span>{currentText}</span>
            <span className={`w-1 h-6 ml-1 animate-pulse ${activeAccent.primaryBg.split(' ')[0]}`} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400 mt-6 max-w-2xl px-4"
          >
            {personalInfo.tagline}
          </motion.p>
        </div>

        {/* Dynamic Buttons Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-3.5 mb-14 relative z-20 w-full sm:w-auto"
        >
          <button
            onClick={() => setActiveViewPage('projects')}
            className={`w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-sm tracking-wide shadow-lg cursor-pointer flex items-center justify-center gap-2 transition-transform duration-300 hover:scale-102 ${activeAccent.primaryBg}`}
          >
            <span>View Projects</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveViewPage('blog')}
            className="w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-sm tracking-wide border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Read Blog</span>
            {portfolioData.blogPosts && portfolioData.blogPosts.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-mono font-bold">
                {portfolioData.blogPosts.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveViewPage('contact')}
            className="w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-sm tracking-wide border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-900/40 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors shadow-sm cursor-pointer flex items-center justify-center"
          >
            <span>Contact Me</span>
          </button>
        </motion.div>

        {/* Statistics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat, i) => (
            <CountUp key={i} value={stat.value} suffix={stat.suffix} label={stat.label} />
          ))}
        </motion.div>

        {/* Latest Insight Teaser Strip */}
        {portfolioData.blogPosts && portfolioData.blogPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            onClick={() => setActiveViewPage('blog')}
            className="mt-10 p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 hover:border-indigo-500/40 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl w-full backdrop-blur-md group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 shrink-0 group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-500">
                    Latest Thought Piece
                  </span>
                  <span className="text-slate-400 text-xs font-mono">&bull;</span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {portfolioData.blogPosts[0].date}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-500 transition-colors mt-0.5">
                  {portfolioData.blogPosts[0].title}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-500 shrink-0 group-hover:translate-x-1 transition-transform">
              <span>Read Article</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
