import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, ChevronLeft, ChevronRight, MessageSquareCode } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { testimonials } from '../data';

export default function Testimonials() {
  const { activeAccent } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const current = testimonials[currentIndex];

  return (
    <section
      id="testimonials"
      className="py-24 bg-slate-50 dark:bg-slate-950/50 transition-colors duration-300 relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className={`text-xs font-black tracking-widest uppercase font-mono ${activeAccent.primaryText} mb-2`}>
            Endorsements
          </h2>
          <h3 className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
            Client Testimonials
          </h3>
        </div>

        {/* Carousel Slide Area */}
        <div className="relative min-h-[300px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full text-center flex flex-col items-center"
            >
              <Quote className="w-12 h-12 text-slate-200 dark:text-slate-800 mb-6 shrink-0" />
              
              <blockquote className="text-base sm:text-lg lg:text-xl font-medium leading-relaxed text-slate-700 dark:text-slate-300 max-w-2xl px-6">
                "{current.content}"
              </blockquote>

              {/* Author Info */}
              <div className="mt-8 flex items-center gap-3.5">
                <img
                  src={current.avatar}
                  alt={current.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-md"
                />
                <div className="text-left">
                  <h4 className="text-sm font-extrabold text-slate-800 dark:text-white">
                    {current.name}
                  </h4>
                  <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider mt-0.5">
                    {current.role} &middot; <span className={activeAccent.primaryText}>{current.company}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Dot/Arrows Row */}
        <div className="flex items-center justify-center gap-6 mt-12">
          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            className="p-2.5 rounded-xl border border-slate-200/20 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors shadow-sm cursor-pointer"
            aria-label="Previous Testimonial"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  i === currentIndex
                    ? 'w-6 bg-slate-800 dark:bg-white'
                    : 'w-2 bg-slate-300 dark:bg-slate-700'
                }`}
                aria-label={`Go to testimonial slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            className="p-2.5 rounded-xl border border-slate-200/20 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors shadow-sm cursor-pointer"
            aria-label="Next Testimonial"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
