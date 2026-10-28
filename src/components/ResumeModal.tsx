import { motion, AnimatePresence } from 'motion/react';
import { X, Printer, Download, Mail, MapPin, Phone, Github, Linkedin, Calendar, Briefcase, GraduationCap } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { usePortfolio } from './PortfolioContext';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const { activeAccent } = useTheme();
  const { portfolioData } = usePortfolio();
  const { personalInfo, experiences, skills } = portfolioData;
  const education = portfolioData.education || [];

  const handlePrint = () => {
    window.print();
  };

  // Triggers a download of a clean Markdown/Text CV for a developer's fast consumption
  const handleDownloadText = () => {
    const divider = '='.repeat(60);
    const textContent = `
${personalInfo.name.toUpperCase()}
${personalInfo.title}
${personalInfo.location} | ${personalInfo.email}

${divider}
CAREER OBJECTIVE
${divider}
${personalInfo.objective}

${divider}
PROFESSIONAL EXPERIENCE
${divider}
${experiences.map(exp => `
- ${exp.role} | ${exp.company}
  ${exp.duration} | ${exp.location}
  Responsibilities:
  ${exp.responsibilities.map(resp => `  * ${resp}`).join('\n')}
`).join('\n')}

${divider}
EDUCATION
${divider}
${education.map(edu => `
- ${edu.degree}
  ${edu.institution} | ${edu.duration}
  ${edu.description || ''}
`).join('\n')}

${divider}
CORE SKILLS
${divider}
${['frontend', 'backend', 'databases', 'tools'].map(cat => `
${cat.toUpperCase()}:
${skills.filter(s => s.category === cat).map(s => `  - ${s.name} (${s.percentage}%)`).join('\n')}
`).join('\n')}

${divider}
Generated via ${personalInfo.name}'s Portfolio
${divider}
    `.trim();

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${personalInfo.name.replace(/\s+/g, '_')}_Resume.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" id="resume-modal-overlay">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Content */}
          <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl rounded-2xl border border-slate-200/20 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden print:p-0 print:border-0 print:shadow-none"
            >
              {/* Header Action Bar (Hidden when printing) */}
              <div className="flex items-center justify-between border-b border-slate-200/20 px-6 py-4 bg-slate-50 dark:bg-slate-950 print:hidden">
                <div className="flex items-center gap-2">
                  <Briefcase className={`w-5 h-5 ${activeAccent.primaryText}`} />
                  <span className="font-semibold text-slate-800 dark:text-slate-100">Curriculum Vitae</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
                    title="Print PDF of resume"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print / PDF</span>
                  </button>
                  <button
                    onClick={handleDownloadText}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
                    title="Download clean text file"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download TXT</span>
                  </button>
                  {personalInfo.resumeUrl && personalInfo.resumeUrl !== '#' && (
                    <a
                      href={personalInfo.resumeUrl}
                      download={`Resume_${personalInfo.name.replace(/\s+/g, '_')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 hover:text-white transition-colors cursor-pointer"
                      title="Download the uploaded resume document"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Original</span>
                    </a>
                  )}
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Physical Resume Paper Layout */}
              <div 
                id="printable-resume-area" 
                className="p-8 sm:p-12 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 print:text-black print:bg-white overflow-y-auto max-h-[80vh] print:max-h-none print:p-0"
              >
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-start border-b-2 border-slate-100 dark:border-slate-800 pb-6 print:border-slate-300">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white print:text-black tracking-tight">
                      {personalInfo.name}
                    </h1>
                    <p className={`text-lg font-medium mt-1 ${activeAccent.primaryText} print:text-slate-700`}>
                      {personalInfo.title}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 mt-4 md:mt-0 text-sm text-slate-500 dark:text-slate-400 print:text-slate-600 font-mono">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{personalInfo.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{personalInfo.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      <span>Remote / Relocation</span>
                    </div>
                  </div>
                </div>

                {/* Grid Layout: Main Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                  {/* Left Column: Bio & Experience */}
                  <div className="md:col-span-2 flex flex-col gap-8">
                    {/* Professional Objective */}
                    <div>
                      <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-3 font-mono print:text-slate-500">
                        Professional Profile
                      </h2>
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 print:text-slate-800">
                        {personalInfo.objective}
                      </p>
                    </div>

                    {/* Experience List */}
                    <div>
                      <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-4 font-mono print:text-slate-500">
                        Experience Timeline
                      </h2>
                      <div className="flex flex-col gap-6">
                        {experiences.map((exp) => (
                          <div key={exp.id} className="border-l-2 border-slate-100 dark:border-slate-800 pl-4 py-1 print:border-slate-200">
                            <div className="flex justify-between items-start flex-wrap gap-2">
                              <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white print:text-black">
                                  {exp.role}
                                </h3>
                                <p className={`text-sm font-medium ${activeAccent.primaryText} print:text-slate-700`}>
                                  {exp.company}
                                </p>
                              </div>
                              <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 print:text-slate-600 font-mono text-right">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>{exp.duration}</span>
                                </div>
                                <span className="text-[10px]">{exp.location}</span>
                              </div>
                            </div>
                            <ul className="list-disc list-outside text-xs text-slate-600 dark:text-slate-400 print:text-slate-800 mt-3 space-y-1.5 pl-4">
                              {exp.responsibilities.map((resp, i) => (
                                <li key={i}>{resp}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Skills, Education */}
                  <div className="flex flex-col gap-8 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-8 md:pt-0 md:pl-8 print:border-slate-200">
                    {/* Technical Competencies */}
                    <div>
                      <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-4 font-mono print:text-slate-500">
                        Technical Stack
                      </h2>
                      <div className="flex flex-col gap-4">
                        {(['frontend', 'backend', 'databases', 'tools'] as const).map((category) => (
                          <div key={category}>
                            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 print:text-slate-600 capitalize mb-1.5">
                              {category}
                            </h3>
                            <div className="flex flex-wrap gap-1.5">
                              {skills
                                .filter((s) => s.category === category)
                                .map((s) => (
                                  <span
                                    key={s.name}
                                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 print:bg-slate-100 print:text-slate-800"
                                  >
                                    {s.name}
                                  </span>
                                ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Academic Accomplishments */}
                    <div>
                      <h2 className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-4 font-mono print:text-slate-500">
                        Education
                      </h2>
                      <div className="flex flex-col gap-4">
                        {education.map((edu) => (
                          <div key={edu.id} className="flex flex-col">
                            <h3 className="text-xs font-bold text-slate-900 dark:text-white print:text-black">
                              {edu.degree}
                            </h3>
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 print:text-slate-700">
                              {edu.institution}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 print:text-slate-500 font-mono mt-0.5">
                              {edu.duration}
                            </span>
                            {edu.description && (
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 print:text-slate-600 mt-1.5 leading-relaxed">
                                {edu.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer info (Only shown when printing) */}
                <div className="hidden print:block border-t border-slate-300 mt-12 pt-4 text-center text-[10px] text-slate-500 font-mono">
                  Resume generated dynamically from {personalInfo.name}'s Web Portfolio.
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
