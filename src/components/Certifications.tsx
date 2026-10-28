import { motion } from 'motion/react';
import { ExternalLink, Award, Calendar, ShieldCheck } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { usePortfolio } from './PortfolioContext';

export default function Certifications() {
  const { activeAccent } = useTheme();
  const { portfolioData } = usePortfolio();
  const { certifications } = portfolioData;

  return (
    <section
      id="certifications"
      className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300 relative"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className={`text-xs font-black tracking-widest uppercase font-mono ${activeAccent.primaryText} mb-2`}>
            Credentials
          </h2>
          <h3 className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
            Licenses & Certifications
          </h3>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group bg-white/40 dark:bg-slate-950/40 border border-slate-200/30 dark:border-white/10 rounded-3xl overflow-hidden hover:shadow-xl transition-all"
            >
              {/* Image banner */}
              <div className="relative aspect-video bg-slate-100 dark:bg-slate-900 overflow-hidden border-b border-slate-200/5">
                <img
                  src={cert.image}
                  alt={cert.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 opacity-90 dark:opacity-80"
                />
                <div className="absolute top-3 left-3 p-1.5 rounded-lg bg-slate-950/70 backdrop-blur-md text-white">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
              </div>

              {/* Text content block */}
              <div className="p-6 flex flex-col justify-between h-48">
                <div>
                  <h4 className="text-sm font-black tracking-tight text-slate-800 dark:text-white group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                    {cert.title}
                  </h4>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1.5 font-mono uppercase tracking-wider">
                    {cert.issuer}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200/10">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{cert.date}</span>
                  </div>
                  <a
                    href={cert.verificationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Verify</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
