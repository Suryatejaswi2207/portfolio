import { motion } from 'motion/react';
import { Calendar, MapPin, Briefcase, ChevronRight } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { usePortfolio } from './PortfolioContext';

export default function Experience() {
  const { activeAccent } = useTheme();
  const { portfolioData } = usePortfolio();
  const { experiences } = portfolioData;

  return (
    <section
      id="experience"
      className="py-24 bg-slate-50 dark:bg-slate-950/50 transition-colors duration-300 relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-xl mx-auto mb-20">
          <h2 className={`text-xs font-black tracking-widest uppercase font-mono ${activeAccent.primaryText} mb-2`}>
            Milestones
          </h2>
          <h3 className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
            Professional Experience
          </h3>
        </div>

        {/* Timeline Path */}
        <div className="relative border-l border-slate-200 dark:border-slate-800/80 pl-6 md:pl-10 ml-4 flex flex-col gap-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Timeline Bullet Node with Pulse Ring */}
              <div className="absolute left-[-31px] md:left-[-49px] top-1.5 flex items-center justify-center">
                <span className={`absolute inline-flex h-4 w-4 rounded-full opacity-75 animate-ping ${activeAccent.primaryBg.split(' ')[0]}`} />
                <span className={`relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-white dark:border-slate-900 shadow-sm ${activeAccent.primaryBg.split(' ')[0]}`} />
              </div>

              {/* Card Container */}
              <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/30 dark:border-white/10 bg-white/40 dark:bg-slate-950/40 shadow-lg relative overflow-hidden group hover:shadow-xl transition-all">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                  {/* Title block */}
                  <div>
                    <h4 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                      {exp.role}
                    </h4>
                    <span className={`text-sm font-semibold tracking-wide ${activeAccent.primaryText}`}>
                      {exp.company}
                    </span>
                  </div>

                  {/* Date & Location Indicators */}
                  <div className="flex flex-row md:flex-col gap-3 md:gap-1 text-xs text-slate-400 font-mono font-bold">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{exp.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 md:justify-end">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{exp.location}</span>
                    </div>
                  </div>
                </div>

                {/* Accomplishments Lists */}
                <ul className="flex flex-col gap-3">
                  {exp.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      <ChevronRight className={`w-4 h-4 mt-0.5 shrink-0 ${activeAccent.primaryText}`} />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
