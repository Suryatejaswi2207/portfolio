import { useState, ComponentType } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Lucide from 'lucide-react';
import { useTheme } from './ThemeContext';
import { usePortfolio } from './PortfolioContext';
import { Skill } from '../types';

// Map icon string names safely to standard Lucide components
const iconMap: Record<string, ComponentType<any>> = {
  Code2: Lucide.Code2,
  FileCode: Lucide.FileCode,
  Palette: Lucide.Palette,
  Sparkles: Lucide.Sparkles,
  Layers: Lucide.Layers,
  Server: Lucide.Server,
  Terminal: Lucide.Terminal,
  GitMerge: Lucide.GitMerge,
  Cpu: Lucide.Cpu,
  Database: Lucide.Database,
  FolderOpen: Lucide.FolderOpen,
  Zap: Lucide.Zap,
  Flame: Lucide.Flame,
  Container: Lucide.Box, // Safeguard mapping 'Container' to 'Box'
  Cloud: Lucide.Cloud,
  Hammer: Lucide.Hammer,
  GitBranch: Lucide.GitBranch,
  PenTool: Lucide.PenTool,
};

function SkillCard({ skill }: { skill: Skill; key?: any }) {
  const { activeAccent } = useTheme();
  const IconComponent = iconMap[skill.iconName] || Lucide.Code;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="p-5 rounded-3xl border border-slate-200/30 dark:border-white/10 bg-white/40 dark:bg-slate-950/40 hover:bg-white dark:hover:bg-slate-900 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl ${activeAccent.badgeBg} ${activeAccent.primaryText} group-hover:scale-110 transition-transform duration-300`}>
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-800 dark:text-white">
              {skill.name}
            </h4>
            <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest capitalize">
              {skill.category}
            </span>
          </div>
        </div>
        <span className={`text-xs font-bold font-mono ${activeAccent.primaryText}`}>
          {skill.percentage}%
        </span>
      </div>

      {/* Dynamic Progress Indicator */}
      <div className="w-full h-1.5 bg-slate-200/50 dark:bg-slate-800/60 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${activeAccent.gradientFrom} ${activeAccent.gradientTo} rounded-full`}
        />
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const { activeAccent } = useTheme();
  const { portfolioData } = usePortfolio();
  const { skills } = portfolioData;
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'frontend' | 'backend' | 'databases' | 'tools'>('all');

  const categories = [
    { key: 'all', label: 'All Stack' },
    { key: 'frontend', label: 'Frontend' },
    { key: 'backend', label: 'Backend' },
    { key: 'databases', label: 'Databases' },
    { key: 'tools', label: 'Tools / DevOps' },
  ];

  const filteredSkills = selectedCategory === 'all'
    ? skills
    : skills.filter(skill => skill.category === selectedCategory);

  return (
    <section
      id="skills"
      className="py-24 bg-slate-50 dark:bg-slate-950/50 transition-colors duration-300 relative"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className={`text-xs font-black tracking-widest uppercase font-mono ${activeAccent.primaryText} mb-2`}>
            Capabilities
          </h2>
          <h3 className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
            Technical Competencies
          </h3>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key as any)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider font-mono cursor-pointer transition-all duration-300 relative ${
                  isSelected
                    ? 'text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="activeSkillCategory"
                    className={`absolute inset-0 rounded-full bg-gradient-to-r ${activeAccent.gradientFrom} ${activeAccent.gradientTo}`}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Skills Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill) => (
              <SkillCard key={skill.name} skill={skill} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
