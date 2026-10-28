import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState('');
  const fullText = 'npx create-portfolio-website --author Rivera...';

  useEffect(() => {
    let index = 0;
    const textInterval = setInterval(() => {
      if (index < fullText.length) {
        setText((prev) => prev + fullText.charAt(index));
        index++;
      } else {
        clearInterval(textInterval);
      }
    }, 45);

    return () => clearInterval(textInterval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500); // Small buffer before finishing
          return 100;
        }
        // Random incremental steps for natural loading sensation
        const increment = Math.floor(Math.random() * 15) + 5;
        return Math.min(prev + increment, 100);
      });
    }, 150);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        id="loading-container"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white font-mono"
      >
        <div className="w-full max-w-md px-6 flex flex-col gap-4">
          {/* Mock Console Header */}
          <div className="flex items-center gap-2 text-slate-500 text-xs border-b border-slate-800 pb-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>developer-console.sh</span>
            <div className="ml-auto flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/50"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/50"></span>
            </div>
          </div>

          {/* Typing Command */}
          <div className="text-slate-200 text-sm md:text-base leading-relaxed h-8">
            <span className="text-emerald-400 mr-2">$</span>
            {text}
            <span className="animate-pulse">|</span>
          </div>

          {/* Load logs */}
          {progress > 15 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-slate-400 flex flex-col gap-1 mt-2"
            >
              <div>✔ Loaded modules successfully</div>
              {progress > 45 && <div>✔ Compiling modern layouts...</div>}
              {progress > 75 && <div>✔ Launching interactive portfolio...</div>}
            </motion.div>
          )}

          {/* Progress Bar */}
          <div className="mt-6 flex flex-col gap-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Initializing workspace...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                style={{ width: `${progress}%` }}
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
