import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Folder, Github, ExternalLink, X, Tag, Sparkles, Play } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { usePortfolio } from './PortfolioContext';
import { Project } from '../types';
import ProjectLiveDemoModal from './ProjectLiveDemoModal';

export default function Projects() {
  const { activeAccent } = useTheme();
  const { portfolioData } = usePortfolio();
  const { projects } = portfolioData;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [liveDemoProject, setLiveDemoProject] = useState<Project | null>(null);

  // Derive unique categories from static data
  const categories = useMemo(() => {
    const list = new Set(projects.map((p) => p.category));
    return ['All', ...Array.from(list)];
  }, []);

  // Filter projects by search query and category
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        query === '' ||
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.tags.some((t) => t.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section
      id="projects"
      className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300 relative"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className={`text-xs font-black tracking-widest uppercase font-mono ${activeAccent.primaryText} mb-2`}>
            Portfolio
          </h2>
          <h3 className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
            Featured Projects
          </h3>
        </div>

        {/* Search and Filters Controller Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 pb-6 border-b border-slate-200/10">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2 text-sm bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200/15 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 flex flex-col items-center justify-center gap-4 border border-dashed border-slate-200/10 rounded-3xl"
          >
            <Folder className="w-12 h-12 text-slate-400" />
            <div>
              <p className="text-slate-800 dark:text-slate-200 font-bold">No projects matched your criteria</p>
              <p className="text-xs text-slate-400 mt-1">Try resetting the filters or typing a different keyword.</p>
            </div>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-2 text-xs font-bold text-indigo-500 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </motion.div>
        )}

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group flex flex-col bg-slate-50 dark:bg-slate-950/40 border border-slate-200/10 rounded-3xl overflow-hidden hover:shadow-xl hover:border-slate-300/10 transition-all cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                {/* Project Image Panel */}
                <div className="relative aspect-video overflow-hidden bg-slate-200 dark:bg-slate-900">
                  <img
                    src={project.image}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <span className="text-xs font-bold text-white/90 uppercase tracking-widest font-mono flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                      Explore Details
                    </span>
                  </div>
                  <span className={`absolute top-4 left-4 px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono tracking-wider uppercase text-white bg-slate-900/80 backdrop-blur-md`}>
                    {project.category}
                  </span>
                </div>

                {/* Info Block */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <h4 className="text-lg font-black tracking-tight text-slate-800 dark:text-white group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                      {project.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2.5 line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  {/* Technology Tags & Quick Live Demo Trigger */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mt-6 pt-4 border-t border-slate-200/10">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-100 dark:bg-slate-900 text-slate-500">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLiveDemoProject(project);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] tracking-wide flex items-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer transition-all hover:scale-[1.03] active:scale-[0.98]"
                      title="Launch interactive live demonstration"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Live Demo</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Expanded Project Details Overlay Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6" id="project-detail-overlay">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/10 shadow-2xl overflow-hidden z-10"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-slate-950/60 hover:bg-slate-950/80 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Graphic Banner */}
              <div className="relative aspect-video bg-slate-200 dark:bg-slate-900">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-4 left-4 px-3 py-1 bg-slate-950/60 backdrop-blur-md text-white text-[10px] font-bold font-mono tracking-widest uppercase rounded-lg">
                  {selectedProject.category}
                </span>

                {/* Direct quick live demo button on image */}
                <button
                  type="button"
                  onClick={() => setLiveDemoProject(selectedProject)}
                  className="absolute bottom-4 right-4 px-3.5 py-1.5 bg-indigo-600/90 hover:bg-indigo-600 text-white text-xs font-bold font-mono rounded-xl flex items-center gap-1.5 shadow-lg shadow-indigo-600/40 backdrop-blur-md cursor-pointer transition-transform hover:scale-105 active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Interactive Demonstration</span>
                </button>
              </div>

              {/* Content Box */}
              <div className="p-8">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {selectedProject.title}
                </h3>

                <div className="flex flex-wrap gap-1.5 mt-4">
                  {selectedProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold font-mono rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    >
                      <Tag className="w-3 h-3 text-slate-400" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>

                <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300 mt-6 pt-6 border-t border-slate-200/10">
                  {selectedProject.longDescription || selectedProject.description}
                </p>

                {/* External Actions Footer */}
                <div className="flex flex-col sm:flex-row items-center gap-3 mt-8 pt-6 border-t border-slate-200/10">
                  <button
                    type="button"
                    onClick={() => {
                      setLiveDemoProject(selectedProject);
                    }}
                    className="w-full sm:flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>View Live Demonstration</span>
                  </button>

                  <div className="w-full sm:flex-1 flex items-center gap-2">
                    <a
                      href={selectedProject.github}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-100 font-bold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Github className="w-4 h-4" />
                      <span>Code</span>
                    </a>
                    {selectedProject.demo && selectedProject.demo !== '#' && (
                      <a
                        href={selectedProject.demo}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800/60 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>External</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive Live Project Demonstration Runner */}
      <ProjectLiveDemoModal
        project={liveDemoProject}
        isOpen={!!liveDemoProject}
        onClose={() => setLiveDemoProject(null)}
      />
    </section>
  );
}
