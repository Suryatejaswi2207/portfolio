import { motion } from 'motion/react';
import { FileText, MapPin, Briefcase, GraduationCap, Calendar, Compass, User } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { usePortfolio } from './PortfolioContext';

interface AboutProps {
  onOpenResume: () => void;
}

export default function About({ onOpenResume }: AboutProps) {
  const { activeAccent } = useTheme();
  const { portfolioData } = usePortfolio();
  const { personalInfo } = portfolioData;
  const education = portfolioData.education || [];

  return (
    <section
      id="about"
      className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className={`text-xs font-black tracking-widest uppercase font-mono ${activeAccent.primaryText} mb-2`}>
            Overview
          </h2>
          <h3 className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
            About Me
          </h3>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Main Biography (Spans 2 columns on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2 p-8 rounded-3xl border border-slate-200/10 bg-slate-50 dark:bg-slate-950/40 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-6">
                <User className={`w-5 h-5 ${activeAccent.primaryText}`} />
                <span className="font-mono text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Professional Biography
                </span>
              </div>
              <h4 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800 dark:text-white mb-4">
                Pioneering high-fidelity user experiences.
              </h4>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                {personalInfo.bio}
              </p>
            </div>
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-200/10 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-400" />
                <span>Based in {personalInfo.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-amber-400" />
                <span>Full-Stack & Creative Engineering</span>
              </div>
            </div>
          </motion.div>

          {/* 2. Interactive Resume / CV Launcher Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`p-8 rounded-3xl text-white flex flex-col justify-between relative overflow-hidden group shadow-md bg-gradient-to-tr ${activeAccent.gradientFrom} ${activeAccent.gradientTo}`}
          >
            {/* Background glowing rings */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-300" />
            
            <div>
              <div className="flex items-center gap-2 mb-6 text-white/80">
                <FileText className="w-5 h-5" />
                <span className="font-mono text-xs font-bold uppercase tracking-widest">Curriculum Vitae</span>
              </div>
              <h4 className="text-xl font-bold tracking-tight mb-3">
                Curious about my formal path?
              </h4>
              <p className="text-xs text-white/80 leading-relaxed mb-6">
                Preview my comprehensive chronological history, specific technical stack matrices, and easily print/download as an offline PDF.
              </p>
            </div>

            <button
              onClick={onOpenResume}
              className="w-full py-3.5 bg-white text-slate-900 dark:text-slate-950 hover:bg-slate-100 font-bold text-xs tracking-wider uppercase rounded-xl transition-transform duration-300 hover:scale-102 cursor-pointer shadow-sm flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Preview Resume</span>
            </button>
          </motion.div>

          {/* 3. Education / Academic Card (Spans 2 columns on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-2 p-8 rounded-3xl border border-slate-200/10 bg-slate-50 dark:bg-slate-950/40 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-6">
              <GraduationCap className={`w-5 h-5 ${activeAccent.primaryText}`} />
              <span className="font-mono text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Academic Background
              </span>
            </div>

            <div className="flex flex-col gap-6">
              {education.map((edu) => (
                <div
                  key={edu.id}
                  className="relative pl-6 border-l-2 border-slate-200/40 dark:border-slate-800/60 last:border-0 pb-2"
                >
                  <div className={`absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full ${activeAccent.primaryBg.split(' ')[0]}`} />
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800 dark:text-white">
                        {edu.degree}
                      </h4>
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                        {edu.institution}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{edu.duration}</span>
                    </div>
                  </div>
                  {edu.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* 4. Core Objectives */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-8 rounded-3xl border border-slate-200/10 bg-slate-50 dark:bg-slate-950/40 shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center gap-2 mb-6">
              <Compass className={`w-5 h-5 ${activeAccent.primaryText}`} />
              <span className="font-mono text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Mission / Purpose
              </span>
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-800 dark:text-white mb-3">
                Bridging Design & Complexity
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {personalInfo.objective}
              </p>
            </div>
            <div className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest mt-4">
              ★ Stripe / Apple Vibe
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
