import { Github, Linkedin, Twitter, Sparkles } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { usePortfolio } from './PortfolioContext';
import { isPageEntered } from './Header';

export default function Footer() {
  const { activeAccent } = useTheme();
  const { portfolioData, setActiveViewPage } = usePortfolio();
  const { personalInfo } = portfolioData;
  const currentYear = new Date().getFullYear();

  const handlePageClick = (key: string) => {
    setActiveViewPage(key);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const allFooterLinks = [
    { key: 'home', label: 'Home' },
    { key: 'about', label: 'About' },
    { key: 'skills', label: 'Skills' },
    { key: 'projects', label: 'Projects' },
    { key: 'experience', label: 'Experience' },
    { key: 'certifications', label: 'Credentials' },
    { key: 'blog', label: 'Blog' },
    { key: 'contact', label: 'Contact' },
  ];

  const footerLinks = allFooterLinks.filter(link => isPageEntered(link.key, portfolioData));

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200/10 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        {/* Left Side: Brand Logo and Copyright */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <button
            onClick={() => handlePageClick('home')}
            className="flex items-center gap-1.5 font-bold tracking-tight text-slate-800 dark:text-white group cursor-pointer bg-transparent border-0"
          >
            <div className={`p-1 rounded-md bg-gradient-to-tr ${activeAccent.gradientFrom} ${activeAccent.gradientTo} text-white`}>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span>{personalInfo.name || "My Portfolio"}</span>
          </button>
          <p className="text-[11px] text-slate-400 font-mono mt-1.5">
            &copy; {currentYear} {personalInfo.name || "Alex Rivera"}. All rights reserved. Built with React & Tailwind CSS.
          </p>
        </div>

        {/* Center: Anchor Links */}
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
          {footerLinks.map((link) => (
            <button
              key={link.key}
              onClick={() => handlePageClick(link.key)}
              className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer bg-transparent border-0"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right Side: Social Icons */}
        <div className="flex items-center gap-4">
          {personalInfo.github && (
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              aria-label="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
          {personalInfo.linkedin && (
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {personalInfo.twitter && (
            <a
              href={personalInfo.twitter}
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Twitter Profile"
            >
              <Twitter className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
