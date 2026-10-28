import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Lock, Sparkles, UserPlus, LogIn, AlertCircle, 
  CheckCircle2, Eye, EyeOff, ArrowRight, ArrowLeft, Mail, 
  Check, Briefcase, MapPin, Phone, Globe, Github, Linkedin, 
  Plus, X, Award, FileText
} from 'lucide-react';
import { 
  getAccounts, 
  saveAccounts, 
  setActiveSession, 
  defaultPortfolioData, 
  sanitizePortfolioData,
  UserAccount, 
  findAccountByIdentifier 
} from '../lib/portfolioStore';
import { Skill } from '../types';
import ForgotPasswordModal from './ForgotPasswordModal';

interface AuthScreenProps {
  onSuccess: (username: string) => void;
  onEnterGuestMode: () => void;
}

const POPULAR_SKILLS = [
  'React', 'TypeScript', 'Node.js', 'Python', 'Tailwind CSS', 
  'PostgreSQL', 'Docker', 'AWS', 'Next.js', 'GraphQL', 'Framer Motion', 'MongoDB'
];

export default function AuthScreen({ onSuccess, onEnterGuestMode }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [signupStep, setSignupStep] = useState<'credentials' | 'details'>('credentials');
  
  // Login fields
  const [identifier, setIdentifier] = useState(''); // Accepts username OR registered Gmail
  
  // Registration credentials
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Registration profile details (New User Onboarding Form)
  const [fullName, setFullName] = useState('');
  const [profTitle, setProfTitle] = useState('Full-Stack Engineer & Creative Developer');
  const [tagline, setTagline] = useState('Crafting high-performance web applications and fluid digital experiences.');
  const [bio, setBio] = useState('Passionate software engineer focused on building clean, accessible, and resilient digital architectures.');
  const [objective, setObjective] = useState('To engineer scalable applications that solve real-world problems and deliver delight.');
  const [location, setLocation] = useState('San Francisco, CA');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [yearsExperience, setYearsExperience] = useState(4);
  const [projectsCompleted, setProjectsCompleted] = useState(16);

  // Skills management
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL'
  ]);
  const [customSkillInput, setCustomSkillInput] = useState('');

  // Modals & alerts
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleAddCustomSkill = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customSkillInput.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills(prev => [...prev, trimmed]);
      setCustomSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills(prev => prev.filter(s => s !== skill));
  };

  // Switch between Login and Register
  const toggleAuthMode = () => {
    setIsLogin(prev => !prev);
    setSignupStep('credentials');
    setError('');
    setNotice('');
  };

  // Step 1 validation before advancing to details step
  const handleProceedToDetails = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');

    const cleanUsername = regUsername.trim().toLowerCase();
    const cleanEmail = regEmail.trim().toLowerCase();

    if (!cleanUsername || !cleanEmail || !password) {
      setError('Please fill in username, email, and password.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError('Please enter a valid email address (e.g., yourname@gmail.com).');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    const accounts = getAccounts();
    if (accounts[cleanUsername]) {
      setError(`Username "${cleanUsername}" is already taken. Please choose another username or sign in.`);
      return;
    }

    const existingEmail = Object.values(accounts).find(
      acc => acc.email?.toLowerCase() === cleanEmail || acc.portfolio?.personalInfo?.email?.toLowerCase() === cleanEmail
    );
    if (existingEmail) {
      setError(`An account is already registered with "${cleanEmail}". Please sign in or reset your password.`);
      return;
    }

    // Pre-fill Name & social links intelligently
    if (!fullName) {
      setFullName(regUsername.charAt(0).toUpperCase() + regUsername.slice(1));
    }
    if (!githubUrl) {
      setGithubUrl(`https://github.com/${cleanUsername}`);
    }
    if (!linkedinUrl) {
      setLinkedinUrl(`https://linkedin.com/in/${cleanUsername}`);
    }

    setSignupStep('details');
  };

  // Final submission of details and account creation
  const handleCompleteRegistration = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const cleanUsername = regUsername.trim().toLowerCase();
    const cleanEmail = regEmail.trim().toLowerCase();

    const accounts = getAccounts();

    // Map selected skills to Skill objects
    const formattedSkills: Skill[] = selectedSkills.map((name, index) => {
      const lower = name.toLowerCase();
      let category: 'frontend' | 'backend' | 'databases' | 'tools' = 'frontend';
      let iconName = 'Code2';

      if (['node.js', 'express', 'python', 'go', 'java', 'ruby', 'c#', 'php'].includes(lower)) {
        category = 'backend';
        iconName = 'Server';
      } else if (['postgresql', 'mysql', 'mongodb', 'redis', 'sqlite', 'supabase'].includes(lower)) {
        category = 'databases';
        iconName = 'Database';
      } else if (['docker', 'kubernetes', 'aws', 'git', 'gcp', 'ci/cd', 'linux'].includes(lower)) {
        category = 'tools';
        iconName = 'Container';
      } else if (['tailwind css', 'framer motion', 'css'].includes(lower)) {
        iconName = 'Palette';
      }

      return {
        name,
        category,
        percentage: Math.max(75, 95 - (index * 2)),
        iconName
      };
    });

    // Assemble personalized portfolio data
    const personalizedPortfolio = {
      personalInfo: {
        name: fullName.trim() || cleanUsername,
        title: profTitle.trim() || 'Software Engineer',
        tagline: tagline.trim() || 'Welcome to my developer portfolio.',
        bio: bio.trim() || 'Passionate software engineer building modern applications.',
        objective: objective.trim() || 'To engineer robust, intuitive, and scalable software solutions.',
        email: cleanEmail,
        location: location.trim() || 'Remote',
        github: githubUrl.trim() || `https://github.com/${cleanUsername}`,
        linkedin: linkedinUrl.trim() || `https://linkedin.com/in/${cleanUsername}`,
        twitter: websiteUrl.trim() || `https://twitter.com/${cleanUsername}`,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400',
        resumeUrl: '#',
      },
      stats: [
        { value: yearsExperience || 4, suffix: '+', label: 'Years Experience' },
        { value: projectsCompleted || 16, suffix: '', label: 'Projects Completed' },
        { value: 99, suffix: '%', label: 'Client Satisfaction' },
        { value: 380, suffix: 'k+', label: 'Lines of Code' }
      ],
      skills: formattedSkills.length > 0 ? formattedSkills : defaultPortfolioData.skills,
      projects: defaultPortfolioData.projects,
      experiences: [
        {
          id: 'exp1',
          company: 'Tech Solutions Inc.',
          role: profTitle.trim() || 'Software Engineer',
          location: location.trim() || 'Remote',
          duration: 'Jan 2023 - Present',
          responsibilities: [
            'Spearheaded development of core web features and interactive component libraries.',
            'Optimized application performance and streamlined automated build processes.',
            'Collaborated with design and engineering teams to ship pixel-perfect user interfaces.'
          ]
        }
      ],
      certifications: defaultPortfolioData.certifications,
      blogPosts: defaultPortfolioData.blogPosts,
      education: defaultPortfolioData.education,
      inboxMessages: []
    };

    const sanitized = sanitizePortfolioData(personalizedPortfolio);

    const newAccount: UserAccount = {
      username: cleanUsername,
      email: cleanEmail,
      passwordHash: password,
      portfolio: sanitized,
      hasCompletedOnboarding: true
    };

    accounts[cleanUsername] = newAccount;
    saveAccounts(accounts);
    setActiveSession(cleanUsername);

    // Directly view page preview Home page
    onSuccess(cleanUsername);
  };

  // Sign In Flow (Direct to Page Preview)
  const handleSignIn = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');

    const cleanIdentifier = identifier.trim().toLowerCase();
    if (!cleanIdentifier || !password) {
      setError('Please provide your username/Gmail and password.');
      return;
    }

    setIsSubmitting(true);
    const account = findAccountByIdentifier(cleanIdentifier);

    if (!account) {
      setIsSubmitting(false);
      setError(`No account found matching "${cleanIdentifier}". If you are new here, please Sign Up.`);
      return;
    }

    if (account.passwordHash !== password) {
      setIsSubmitting(false);
      setError('Incorrect password. If you forgot your password, reset it via registered email.');
      return;
    }

    // Direct sign in -> immediately sets session and displays page preview directly
    setActiveSession(account.username);
    onSuccess(account.username);
  };

  // Quick Gmail sign-in helper
  const handleQuickGmailLogin = () => {
    if (!identifier && !regEmail) {
      setIsLogin(true);
      setError('');
      setNotice('Enter your registered Gmail address below to sign in or recover your password.');
      return;
    }
    const testEmail = (identifier || regEmail).trim().toLowerCase();
    const account = findAccountByIdentifier(testEmail);
    if (account) {
      setIdentifier(account.email || account.username);
      setIsLogin(true);
      setError('');
      setNotice(`Found account for ${account.email || account.username}. Enter your password or click "Forgot Password?".`);
    } else {
      setIsLogin(true);
      setError(`No account registered with "${testEmail}". Switch to Sign Up to register this Gmail address.`);
    }
  };

  const isDetailsStep = !isLogin && signupStep === 'details';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`w-full ${
          isDetailsStep ? 'max-w-3xl' : 'max-w-md'
        } bg-slate-900/95 backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-3xl shadow-2xl relative z-10 transition-all duration-300 max-h-[92vh] overflow-y-auto`}
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-lg shadow-indigo-500/20 mb-3">
            P
          </div>
          <h1 className="text-2xl font-black tracking-tight leading-none mb-1.5">
            {isDetailsStep ? 'ENTER YOUR PORTFOLIO DETAILS' : 'PORTFOLIO ENGINE'}
          </h1>
          <p className="text-xs text-slate-400 font-medium max-w-md">
            {isLogin 
              ? 'Sign in to jump straight to your live page preview.' 
              : isDetailsStep
                ? 'Fill in your details below so your portfolio is customized before launching the preview.'
                : 'Create your account to personalize and publish your live developer portfolio.'}
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up (only on Step 1) */}
        {!isDetailsStep && (
          <div className="grid grid-cols-2 p-1 bg-slate-950/80 border border-white/10 rounded-2xl mb-5">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setSignupStep('credentials');
                setError('');
                setNotice('');
              }}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                isLogin 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setSignupStep('credentials');
                setError('');
                setNotice('');
              }}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                !isLogin 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </button>
          </div>
        )}

        {/* Stepper Indicator for Sign Up */}
        {!isLogin && (
          <div className="flex items-center justify-center gap-2 mb-6 select-none">
            <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 ${
              signupStep === 'credentials' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              <Check className="w-3 h-3" />
              <span>1. Credentials</span>
            </span>
            <div className="w-6 h-[1px] bg-white/20" />
            <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 ${
              signupStep === 'details' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                : 'bg-slate-800 text-slate-500'
            }`}>
              <FileText className="w-3 h-3" />
              <span>2. Enter All Details</span>
            </span>
          </div>
        )}

        {/* Quick Sign In with Registered Gmail (in Sign In mode) */}
        {isLogin && (
          <div className="mb-5">
            <button
              type="button"
              onClick={handleQuickGmailLogin}
              className="w-full py-2.5 px-4 rounded-xl border border-white/10 hover:border-white/20 bg-slate-950/60 hover:bg-slate-950 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-sm group"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign in with Registered Gmail</span>
            </button>
            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-[1px] bg-white/10" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">or credentials</span>
              <div className="flex-1 h-[1px] bg-white/10" />
            </div>
          </div>
        )}

        {/* Error Notification */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5 overflow-hidden"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <div className="flex-1 font-medium leading-relaxed">
                {error}
                {isLogin && error.includes('Incorrect password') && (
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(true)}
                    className="block mt-1.5 text-indigo-400 hover:text-indigo-300 underline font-semibold cursor-pointer"
                  >
                    Forgot your password? Reset it here &rarr;
                  </button>
                )}
                {isLogin && error.includes('No account found') && (
                  <button
                    type="button"
                    onClick={toggleAuthMode}
                    className="block mt-1.5 text-indigo-400 hover:text-indigo-300 underline font-semibold cursor-pointer"
                  >
                    Switch to Sign Up now &rarr;
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notice Notification */}
        <AnimatePresence>
          {notice && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs flex items-start gap-2.5 overflow-hidden"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-indigo-400" />
              <span className="font-medium leading-relaxed">{notice}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* =========================================================================
            VIEW 1: SIGN IN FORM
            Directly logs user in -> loads portfolio -> page preview directly
           ========================================================================= */}
        {isLogin && (
          <form onSubmit={handleSignIn} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-slate-300 tracking-wide flex items-center justify-between">
                <span>Username or Gmail</span>
                <span className="text-[10px] text-slate-500 font-normal">Use either to sign in</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  autoFocus
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter username or name@gmail.com"
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-white/10 bg-slate-950/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-[11px] font-semibold text-slate-300 tracking-wide">
                <span>Password</span>
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordOpen(true)}
                  className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-11 py-3 text-sm rounded-xl border border-white/10 bg-slate-950/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:scale-[1.01] active:scale-[0.99] mt-2 disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In & View Portfolio</span>
            </button>
          </form>
        )}

        {/* =========================================================================
            VIEW 2: SIGN UP - STEP 1 (Credentials)
           ========================================================================= */}
        {!isLogin && signupStep === 'credentials' && (
          <form onSubmit={handleProceedToDetails} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-slate-300 tracking-wide">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  autoFocus
                  autoComplete="username"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="Choose a username (e.g. dev_alex)"
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-white/10 bg-slate-950/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-slate-300 tracking-wide flex items-center justify-between">
                <span>Gmail / Email Address</span>
                <span className="text-[10px] text-indigo-400 font-medium">For recovery & sign-in</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-white/10 bg-slate-950/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-slate-300 tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create password (min. 6 characters)"
                  className="w-full pl-10 pr-11 py-3 text-sm rounded-xl border border-white/10 bg-slate-950/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:scale-[1.01] active:scale-[0.99] mt-2"
            >
              <span>Next: Enter Your Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* =========================================================================
            VIEW 3: SIGN UP - STEP 2 (Enter All Portfolio Details First)
           ========================================================================= */}
        {!isLogin && signupStep === 'details' && (
          <form onSubmit={handleCompleteRegistration} className="space-y-6">
            {/* Identity & Personal Info */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>1. Personal & Professional Identity</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-slate-300">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-white/10 bg-slate-950/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-slate-300">Professional Title / Headline *</label>
                  <input
                    type="text"
                    required
                    value={profTitle}
                    onChange={(e) => setProfTitle(e.target.value)}
                    placeholder="e.g. Senior Full-Stack Engineer"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-white/10 bg-slate-950/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-300">Hero Tagline Hook</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Crafting high-performance web applications and fluid UI."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-white/10 bg-slate-950/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-300">Bio / About Me Summary *</label>
                <textarea
                  rows={3}
                  required
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write a brief intro highlighting your technical journey and strengths..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-white/10 bg-slate-950/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Location / City</span>
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. San Francisco, CA"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-white/10 bg-slate-950/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Phone Number (Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. +1 (555) 019-2834"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-white/10 bg-slate-950/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Core Skills Selector */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest font-mono flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>2. Core Technical Skills</span>
                </span>
                <span className="text-[10px] text-slate-400 lowercase font-sans">{selectedSkills.length} selected</span>
              </h3>

              {/* Popular skills toggle chips */}
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_SKILLS.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-950/80 text-slate-400 hover:text-white border border-white/10'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      <span>{skill}</span>
                    </button>
                  );
                })}
              </div>

              {/* Custom skill adder */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomSkill();
                    }
                  }}
                  placeholder="Type any other skill (e.g. Rust, Vue, Terraform) & press Enter"
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-white/10 bg-slate-950/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                />
                <button
                  type="button"
                  onClick={() => handleAddCustomSkill()}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {/* Selected skills badges */}
              <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-slate-950/40 border border-white/5">
                {selectedSkills.map(skill => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium bg-slate-800 text-indigo-300 flex items-center gap-1.5"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-400 hover:text-rose-400 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Social Links & Experience Stats */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>3. Social Profiles & Quick Stats</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                    <Github className="w-3.5 h-3.5 text-slate-400" />
                    <span>GitHub URL</span>
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/yourhandle"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-950/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                    <Linkedin className="w-3.5 h-3.5 text-slate-400" />
                    <span>LinkedIn URL</span>
                  </label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/yourhandle"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-950/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <span>Website / Twitter</span>
                  </label>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-950/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-slate-300">Years of Experience</label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-white/10 bg-slate-950/60 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-slate-300">Projects Completed</label>
                  <input
                    type="number"
                    min={0}
                    max={500}
                    value={projectsCompleted}
                    onChange={(e) => setProjectsCompleted(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-white/10 bg-slate-950/60 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setSignupStep('credentials')}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-white/10 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Credentials</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:flex-1 py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg shadow-indigo-600/30 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete Setup & View Live Portfolio</span>
              </button>
            </div>
          </form>
        )}

        {/* Toggle between Sign In / Sign Up (only if on credentials view) */}
        {!isDetailsStep && (
          <div className="mt-5 text-center">
            {isLogin ? (
              <p className="text-xs text-slate-400">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={toggleAuthMode}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer transition-colors inline-flex items-center gap-0.5"
                >
                  <span>Sign Up</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={toggleAuthMode}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer transition-colors inline-flex items-center gap-0.5"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </p>
            )}
          </div>
        )}

        {/* Guest Demo Mode */}
        {!isDetailsStep && (
          <div className="mt-6 pt-5 border-t border-white/10 text-center flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={onEnterGuestMode}
              className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer py-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Explore Demo Portfolio (Guest Mode)</span>
            </button>
          </div>
        )}
      </motion.div>

      {/* Forgot Password Flow Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        initialIdentifier={identifier || regEmail || regUsername}
        onSuccessLogin={(user) => {
          onSuccess(user);
        }}
        onContinueForNow={(user) => {
          onSuccess(user);
        }}
      />
    </div>
  );
}
