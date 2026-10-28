import { useState, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Save, LogOut, ChevronRight, User, BookOpen, Cpu, 
  Briefcase, Award, FileText, Mail, Trash2, Plus, RefreshCw, 
  ArrowLeftRight, Inbox, Eye, Settings, HelpCircle, CheckCircle2,
  Upload, GraduationCap, Edit2, Code, List, Hash, Type, RotateCcw,
  Reply, Send, ExternalLink, ShieldCheck, Lock, Check, X,
  Mic, MicOff, Volume2, Radio, AlertCircle
} from 'lucide-react';
import { usePortfolio } from './PortfolioContext';
import { PortfolioData, sampleBlogPosts } from '../lib/portfolioStore';
import { Skill, Project, Experience, Certification, BlogPost, Education, InboxMessage } from '../types';
import { dispatchSecureEmail, getGmailComposeUrl, getOutlookComposeUrl, getMailtoUrl } from '../lib/secureEmailService';
import AccountSecurityModal from './AccountSecurityModal';
import { useSpeechRecognition } from '../lib/useSpeechRecognition';



interface FileUploaderProps {
  onUpload: (base64: string) => void;
  accept?: string;
  label?: string;
}

function FileUploader({ onUpload, accept = "image/*", label = "Choose File" }: FileUploaderProps) {
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onUpload(event.target.result as string);
      }
      setLoading(false);
    };
    reader.onerror = () => {
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center gap-2">
      <label className="px-3.5 py-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 select-none">
        <Upload className="w-3.5 h-3.5" />
        <span>{loading ? "Reading..." : label}</span>
        <input 
          type="file" 
          accept={accept} 
          onChange={handleChange} 
          className="hidden" 
          disabled={loading}
        />
      </label>
    </div>
  );
}

interface BuilderConsoleProps {
  portfolio: PortfolioData;
  onSave: (updatedPortfolio: PortfolioData) => void;
  onLogout: () => void;
  onTogglePreview: () => void;
  username: string;
}

type TabType = 'home' | 'about' | 'skills' | 'projects' | 'experience' | 'credentials' | 'blog' | 'contact' | 'inbox';

export default function BuilderConsole({ portfolio, onSave, onLogout, onTogglePreview, username }: BuilderConsoleProps) {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [localData, setLocalData] = useState<PortfolioData>(JSON.parse(JSON.stringify(portfolio)));
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);


  // New Skill Temp Form State
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<'frontend' | 'backend' | 'databases' | 'tools'>('frontend');
  const [newSkillPercentage, setNewSkillPercentage] = useState(85);
  const [newSkillIcon, setNewSkillIcon] = useState('Code2');

  // New Project Temp Form State
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjLongDesc, setNewProjLongDesc] = useState('');
  const [newProjCategory, setNewProjCategory] = useState('');
  const [newProjTags, setNewProjTags] = useState('');
  const [newProjImage, setNewProjImage] = useState('');
  const [newProjGithub, setNewProjGithub] = useState('');
  const [newProjDemo, setNewProjDemo] = useState('');

  // New Experience Temp Form State
  const [newExpCompany, setNewExpCompany] = useState('');
  const [newExpRole, setNewExpRole] = useState('');
  const [newExpLocation, setNewExpLocation] = useState('');
  const [newExpDuration, setNewExpDuration] = useState('');
  const [newExpResp, setNewExpResp] = useState('');

  // New Certification Temp Form State
  const [newCertTitle, setNewCertTitle] = useState('');
  const [newCertIssuer, setNewCertIssuer] = useState('');
  const [newCertDate, setNewCertDate] = useState('');
  const [newCertUrl, setNewCertUrl] = useState('');
  const [newCertImage, setNewCertImage] = useState('');

  // New Blog Temp Form State
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [showBlogPreview, setShowBlogPreview] = useState<boolean>(false);
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogSummary, setNewBlogSummary] = useState('');
  const [newBlogContent, setNewBlogContent] = useState('');
  const [newBlogCategory, setNewBlogCategory] = useState('');
  const [newBlogDate, setNewBlogDate] = useState('');
  const [newBlogReadTime, setNewBlogReadTime] = useState('');
  const [newBlogImage, setNewBlogImage] = useState('');
  const [newBlogTags, setNewBlogTags] = useState('');

  // Speech Recognition for Blog Content in BuilderConsole
  const handleBuilderBlogSpeech = (chunk: string, isFinal: boolean) => {
    if (isFinal) {
      setNewBlogContent(prev => {
        if (!prev || prev.trim() === '') {
          return chunk.trim();
        }
        const needsSpace = !prev.endsWith(' ') && !prev.endsWith('\n');
        return prev + (needsSpace ? ' ' : '') + chunk.trim();
      });
    }
  };

  const {
    isListening: isBlogDictating,
    interimTranscript: blogInterimTranscript,
    errorMessage: blogSpeechError,
    setErrorMessage: setBlogSpeechError,
    startListening: startBlogDictation,
    stopListening: stopBlogDictation
  } = useSpeechRecognition({
    onTranscriptChange: handleBuilderBlogSpeech
  });

  // New Education Temp Form State
  const [newEduInstitution, setNewEduInstitution] = useState('');
  const [newEduDegree, setNewEduDegree] = useState('');
  const [newEduDuration, setNewEduDuration] = useState('');
  const [newEduDescription, setNewEduDescription] = useState('');

  // Email reply and dispatch state
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replySending, setReplySending] = useState(false);
  const [replySuccessMessage, setReplySuccessMessage] = useState<string | null>(null);

  // Direct compose modal state
  const [showDirectComposer, setShowDirectComposer] = useState(false);
  const [directRecipient, setDirectRecipient] = useState('');
  const [directSubject, setDirectSubject] = useState('');
  const [directBody, setDirectBody] = useState('');
  const [directSending, setDirectSending] = useState(false);
  const [directSuccessMessage, setDirectSuccessMessage] = useState<string | null>(null);

  const triggerSave = (updated: PortfolioData) => {
    onSave(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const updatePersonalInfo = (field: string, value: string) => {
    const updated = {
      ...localData,
      personalInfo: {
        ...localData.personalInfo,
        [field]: value
      }
    };
    setLocalData(updated);
    triggerSave(updated);
  };

  const updateStat = (index: number, field: 'value' | 'suffix' | 'label', value: any) => {
    const updatedStats = [...localData.stats];
    updatedStats[index] = {
      ...updatedStats[index],
      [field]: field === 'value' ? Number(value) : value
    };
    const updated = { ...localData, stats: updatedStats };
    setLocalData(updated);
    triggerSave(updated);
  };

  const addSkill = () => {
    if (!newSkillName.trim()) return;
    const newSkill: Skill = {
      name: newSkillName.trim(),
      category: newSkillCategory,
      percentage: newSkillPercentage,
      iconName: newSkillIcon
    };
    const updated = {
      ...localData,
      skills: [...localData.skills, newSkill]
    };
    setLocalData(updated);
    triggerSave(updated);
    // Reset inputs
    setNewSkillName('');
    setNewSkillPercentage(85);
  };

  const removeSkill = (index: number) => {
    const updatedSkills = localData.skills.filter((_, i) => i !== index);
    const updated = { ...localData, skills: updatedSkills };
    setLocalData(updated);
    triggerSave(updated);
  };

  const addProject = () => {
    if (!newProjTitle.trim()) return;
    const newProj: Project = {
      id: 'proj_' + Date.now(),
      title: newProjTitle.trim(),
      description: newProjDesc.trim(),
      longDescription: newProjLongDesc.trim() || undefined,
      category: newProjCategory.trim() || 'General',
      tags: newProjTags.split(',').map(t => t.trim()).filter(Boolean),
      image: newProjImage.trim() || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800&h=600',
      github: newProjGithub.trim() || '#',
      demo: newProjDemo.trim() || '#',
      featured: true
    };
    const updated = {
      ...localData,
      projects: [...localData.projects, newProj]
    };
    setLocalData(updated);
    triggerSave(updated);
    // Reset fields
    setNewProjTitle('');
    setNewProjDesc('');
    setNewProjLongDesc('');
    setNewProjCategory('');
    setNewProjTags('');
    setNewProjImage('');
    setNewProjGithub('');
    setNewProjDemo('');
  };

  const removeProject = (id: string) => {
    const updatedProjects = localData.projects.filter(p => p.id !== id);
    const updated = { ...localData, projects: updatedProjects };
    setLocalData(updated);
    triggerSave(updated);
  };

  const addExperience = () => {
    if (!newExpCompany.trim() || !newExpRole.trim()) return;
    const newExp: Experience = {
      id: 'exp_' + Date.now(),
      company: newExpCompany.trim(),
      role: newExpRole.trim(),
      location: newExpLocation.trim() || 'Remote',
      duration: newExpDuration.trim() || 'Present',
      responsibilities: newExpResp.split('\n').map(r => r.trim()).filter(Boolean)
    };
    const updated = {
      ...localData,
      experiences: [...localData.experiences, newExp]
    };
    setLocalData(updated);
    triggerSave(updated);
    // Reset fields
    setNewExpCompany('');
    setNewExpRole('');
    setNewExpLocation('');
    setNewExpDuration('');
    setNewExpResp('');
  };

  const removeExperience = (id: string) => {
    const updatedExp = localData.experiences.filter(e => e.id !== id);
    const updated = { ...localData, experiences: updatedExp };
    setLocalData(updated);
    triggerSave(updated);
  };

  const addCertification = () => {
    if (!newCertTitle.trim() || !newCertIssuer.trim()) return;
    const newCert: Certification = {
      id: 'cert_' + Date.now(),
      title: newCertTitle.trim(),
      issuer: newCertIssuer.trim(),
      date: newCertDate.trim() || '2026',
      verificationUrl: newCertUrl.trim() || '#',
      image: newCertImage.trim() || 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&q=80&w=400&h=300'
    };
    const updated = {
      ...localData,
      certifications: [...localData.certifications, newCert]
    };
    setLocalData(updated);
    triggerSave(updated);
    // Reset fields
    setNewCertTitle('');
    setNewCertIssuer('');
    setNewCertDate('');
    setNewCertUrl('');
    setNewCertImage('');
  };

  const removeCertification = (id: string) => {
    const updatedCerts = localData.certifications.filter(c => c.id !== id);
    const updated = { ...localData, certifications: updatedCerts };
    setLocalData(updated);
    triggerSave(updated);
  };

  const startEditBlogPost = (post: BlogPost) => {
    setEditingBlogId(post.id);
    setNewBlogTitle(post.title);
    setNewBlogSummary(post.summary);
    setNewBlogContent(post.content);
    setNewBlogCategory(post.category);
    setNewBlogDate(post.date);
    setNewBlogReadTime(post.readTime);
    setNewBlogImage(post.image);
    setNewBlogTags(post.tags?.join(', ') || '');
    setShowBlogPreview(false);
  };

  const cancelEditBlogPost = () => {
    setEditingBlogId(null);
    setNewBlogTitle('');
    setNewBlogSummary('');
    setNewBlogContent('');
    setNewBlogCategory('');
    setNewBlogDate('');
    setNewBlogReadTime('');
    setNewBlogImage('');
    setNewBlogTags('');
    setShowBlogPreview(false);
  };

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    setNewBlogContent(prev => {
      if (prev.length > 0 && !prev.endsWith('\n')) {
        return prev + '\n\n' + prefix + (suffix ? ' ' + suffix : '');
      }
      return prev + prefix + (suffix ? ' ' + suffix : '');
    });
  };

  const autoCalculateReadTime = () => {
    const words = newBlogContent.trim().split(/\s+/).filter(Boolean).length;
    const mins = Math.max(1, Math.ceil(words / 180));
    setNewBlogReadTime(`${mins} min read`);
  };

  const addOrUpdateBlogPost = () => {
    if (!newBlogTitle.trim() || !newBlogSummary.trim()) return;

    if (editingBlogId) {
      const updatedPosts = localData.blogPosts.map(post => {
        if (post.id === editingBlogId) {
          return {
            ...post,
            title: newBlogTitle.trim(),
            summary: newBlogSummary.trim(),
            content: newBlogContent.trim() || 'Post body goes here.',
            category: newBlogCategory.trim() || 'Tech',
            date: newBlogDate.trim() || post.date || 'Today',
            readTime: newBlogReadTime.trim() || post.readTime || '5 min read',
            image: newBlogImage.trim() || post.image,
            tags: newBlogTags.split(',').map(t => t.trim()).filter(Boolean)
          };
        }
        return post;
      });

      const updated = { ...localData, blogPosts: updatedPosts };
      setLocalData(updated);
      triggerSave(updated);
      cancelEditBlogPost();
    } else {
      const newPost: BlogPost = {
        id: 'blog_' + Date.now(),
        title: newBlogTitle.trim(),
        summary: newBlogSummary.trim(),
        content: newBlogContent.trim() || 'Post body goes here.',
        category: newBlogCategory.trim() || 'Tech',
        date: newBlogDate.trim() || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        readTime: newBlogReadTime.trim() || '5 min read',
        image: newBlogImage.trim() || 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800&h=450',
        tags: newBlogTags.split(',').map(t => t.trim()).filter(Boolean),
        likes: 0,
        comments: []
      };
      const updated = {
        ...localData,
        blogPosts: [...localData.blogPosts, newPost]
      };
      setLocalData(updated);
      triggerSave(updated);
      cancelEditBlogPost();
    }
  };

  const restoreSampleArticles = () => {
    const updated = {
      ...localData,
      blogPosts: [...sampleBlogPosts]
    };
    setLocalData(updated);
    triggerSave(updated);
  };

  const removeBlogPost = (id: string) => {
    if (editingBlogId === id) {
      cancelEditBlogPost();
    }
    const updatedPosts = localData.blogPosts.filter(b => b.id !== id);
    const updated = { ...localData, blogPosts: updatedPosts };
    setLocalData(updated);
    triggerSave(updated);
  };

  const clearInboxMessage = (id: string) => {
    const updatedMessages = (localData.inboxMessages || []).filter(m => m.id !== id);
    const updated = { ...localData, inboxMessages: updatedMessages };
    setLocalData(updated);
    triggerSave(updated);
  };

  const handleStartReply = (msg: InboxMessage) => {
    setReplyingToId(msg.id);
    setReplyText(`Hi ${msg.senderName},\n\nThank you for reaching out through my portfolio.\n\nBest regards,\n${localData.personalInfo.name}`);
    setReplySuccessMessage(null);
  };

  const handleSendReply = async (msg: InboxMessage) => {
    if (!replyText.trim()) return;
    setReplySending(true);

    try {
      await dispatchSecureEmail({
        senderName: localData.personalInfo.name,
        senderEmail: localData.personalInfo.email,
        recipientEmail: msg.senderEmail,
        subject: `Re: ${msg.subject || 'Portfolio Inquiry'}`,
        message: replyText.trim()
      });

      const timestamp = new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      const updatedMessages = (localData.inboxMessages || []).map(m => {
        if (m.id === msg.id) {
          return {
            ...m,
            status: 'replied' as const,
            replyMessage: replyText.trim(),
            replyTimestamp: timestamp
          };
        }
        return m;
      });

      const updated = { ...localData, inboxMessages: updatedMessages };
      setLocalData(updated);
      triggerSave(updated);

      setReplySuccessMessage(`Secure reply transmitted to ${msg.senderEmail}!`);
      setTimeout(() => {
        setReplyingToId(null);
        setReplySuccessMessage(null);
      }, 2500);
    } catch (err: any) {
      console.error('Failed to dispatch reply:', err);
    } finally {
      setReplySending(false);
    }
  };

  const handleSendDirectEmail = async () => {
    if (!directRecipient.trim() || !directSubject.trim() || !directBody.trim()) return;
    setDirectSending(true);

    try {
      const receipt = await dispatchSecureEmail({
        senderName: localData.personalInfo.name,
        senderEmail: localData.personalInfo.email,
        recipientEmail: directRecipient.trim(),
        subject: directSubject.trim(),
        message: directBody.trim()
      });

      const timestamp = new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      const newOutboundMessage: InboxMessage = {
        id: 'out_' + Date.now(),
        senderName: `${localData.personalInfo.name} (Outbound)`,
        senderEmail: localData.personalInfo.email,
        recipientEmail: directRecipient.trim(),
        subject: directSubject.trim(),
        message: directBody.trim(),
        timestamp,
        status: 'replied',
        securityHash: receipt.securityHash
      };

      const updated = {
        ...localData,
        inboxMessages: [newOutboundMessage, ...(localData.inboxMessages || [])]
      };
      setLocalData(updated);
      triggerSave(updated);

      setDirectSuccessMessage(`Secure email dispatched to ${directRecipient.trim()}!`);
      setTimeout(() => {
        setShowDirectComposer(false);
        setDirectSuccessMessage(null);
        setDirectRecipient('');
        setDirectSubject('');
        setDirectBody('');
      }, 2000);
    } catch (err: any) {
      console.error('Direct dispatch failure:', err);
    } finally {
      setDirectSending(false);
    }
  };

  const addEducation = () => {
    if (!newEduInstitution.trim() || !newEduDegree.trim()) return;
    const newEdu: Education = {
      id: 'edu_' + Date.now(),
      institution: newEduInstitution.trim(),
      degree: newEduDegree.trim(),
      duration: newEduDuration.trim() || '2022 - 2026',
      description: newEduDescription.trim()
    };
    const updated = {
      ...localData,
      education: [...(localData.education || []), newEdu]
    };
    setLocalData(updated);
    triggerSave(updated);
    // Reset fields
    setNewEduInstitution('');
    setNewEduDegree('');
    setNewEduDuration('');
    setNewEduDescription('');
  };

  const removeEducation = (id: string) => {
    const updatedEdus = (localData.education || []).filter(e => e.id !== id);
    const updated = { ...localData, education: updatedEdus };
    setLocalData(updated);
    triggerSave(updated);
  };

  const menuItems = [
    { id: 'home', label: 'Home', icon: User },
    { id: 'about', label: 'About', icon: BookOpen },
    { id: 'skills', label: 'Skills', icon: Cpu },
    { id: 'projects', label: 'Projects', icon: Sparkles },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'credentials', label: 'Credentials', icon: Award },
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'contact', label: 'Contact Info', icon: Mail },
    { id: 'inbox', label: 'Visitor Inbox', icon: Inbox, badge: localData.inboxMessages?.length || 0 }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Banner Control Console */}
      <nav className="flex flex-col sm:flex-row justify-between items-center px-8 py-5 bg-slate-900 border-b border-white/10 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center font-black text-white shadow-xl">
            PE
          </div>
          <div>
            <span className="font-mono text-[10px] font-bold text-indigo-400 block tracking-widest uppercase">Console Mode</span>
            <span className="font-black text-lg tracking-tight uppercase">PORTFOLIO COCKPIT ({username})</span>
          </div>
        </div>

        <div className="flex items-center gap-3.5 flex-wrap">
          {/* Real-time saving status badge */}
          <AnimatePresence mode="wait">
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>SAVED SUCCESSFULLY</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => triggerSave(localData)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer border border-emerald-500/20"
            title="Explicitly save all inputs now"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>

          <button
            onClick={onTogglePreview}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold transition-all border border-white/10 flex items-center gap-2 cursor-pointer"
            title="View full normal web page preview"
          >
            <Eye className="w-4 h-4" />
            <span>Page Preview</span>
          </button>

          <button
            onClick={() => setShowSecurityModal(true)}
            className="px-3.5 py-2.5 bg-indigo-600/15 hover:bg-indigo-600/25 border border-indigo-500/30 text-indigo-300 hover:text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            title="Manage Account Security and Password"
          >
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Security</span>
          </button>

          <button
            onClick={onLogout}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-mono transition-all flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>

      <div className="flex-1 grid grid-cols-12 min-h-0">
        {/* Left Drawer / Nav Rails */}
        <div className="col-span-12 lg:col-span-3 bg-slate-950/75 border-b lg:border-b-0 lg:border-r border-white/10 p-6 flex flex-col gap-2">
          <div className="text-slate-500 text-[10px] uppercase font-mono font-bold tracking-widest px-3 mb-2 flex items-center justify-between">
            <span>Portfolio Pages</span>
            <span className="text-indigo-400/80 font-normal">Click to edit</span>
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-xl scale-[1.02]' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-black ${
                    isActive ? 'bg-white text-indigo-600' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Active Editor Form Fields */}
        <main className="col-span-12 lg:col-span-9 p-8 bg-slate-950 overflow-y-auto max-h-[calc(100vh-80px)]">
          <div className="max-w-3xl">
            
            {/* Home Section */}
            {activeTab === 'home' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase mb-1">Home Core Parameters</h2>
                  <p className="text-xs text-slate-400">Configure your primary name, title, splash tagline, and key developer performance metrics.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest">Full Professional Name</label>
                    <input
                      type="text"
                      value={localData.personalInfo.name}
                      onChange={(e) => updatePersonalInfo('name', e.target.value)}
                      placeholder="e.g. Johnathan Doe"
                      className="w-full px-4 py-3 text-sm rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest">Job Title / Focus</label>
                    <input
                      type="text"
                      value={localData.personalInfo.title}
                      onChange={(e) => updatePersonalInfo('title', e.target.value)}
                      placeholder="e.g. Lead Devops Architect"
                      className="w-full px-4 py-3 text-sm rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest">Tagline / Splash Mantra</label>
                  <textarea
                    rows={2}
                    value={localData.personalInfo.tagline}
                    onChange={(e) => updatePersonalInfo('tagline', e.target.value)}
                    placeholder="e.g. I build secure decentralized API systems..."
                    className="w-full px-4 py-3 text-sm rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest flex justify-between items-center">
                      <span>Avatar Photo / Profile Image</span>
                      <span className="text-[9px] text-indigo-400 font-normal lowercase">URL or local file</span>
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={localData.personalInfo.avatar}
                        onChange={(e) => updatePersonalInfo('avatar', e.target.value)}
                        placeholder="e.g. https://domain.com/photo.jpg"
                        className="flex-1 px-4 py-3 text-sm rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                      <FileUploader 
                        label="Upload Photo" 
                        onUpload={(base64) => updatePersonalInfo('avatar', base64)} 
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest flex justify-between items-center">
                      <span>Resume Link / Document</span>
                      <span className="text-[9px] text-indigo-400 font-normal lowercase">URL or local file</span>
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={localData.personalInfo.resumeUrl}
                        onChange={(e) => updatePersonalInfo('resumeUrl', e.target.value)}
                        placeholder="e.g. # or google-drive-pdf-link"
                        className="flex-1 px-4 py-3 text-sm rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                      <FileUploader 
                        label="Upload Resume" 
                        accept=".pdf,.doc,.docx" 
                        onUpload={(base64) => updatePersonalInfo('resumeUrl', base64)} 
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-4">
                  <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest font-mono">Custom Counters & Stats Dashboard</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {localData.stats.map((stat, i) => (
                      <div key={i} className="flex flex-col gap-2 p-3.5 rounded-xl bg-slate-900 border border-white/5">
                        <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Stat #{i + 1}</div>
                        <input
                          type="number"
                          value={stat.value}
                          onChange={(e) => updateStat(i, 'value', e.target.value)}
                          placeholder="Value"
                          className="px-2 py-1 bg-white/5 border border-white/10 text-sm text-white rounded focus:outline-none"
                        />
                        <input
                          type="text"
                          value={stat.suffix}
                          onChange={(e) => updateStat(i, 'suffix', e.target.value)}
                          placeholder="Suffix (e.g. +)"
                          className="px-2 py-1 bg-white/5 border border-white/10 text-xs text-white rounded focus:outline-none"
                        />
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => updateStat(i, 'label', e.target.value)}
                          placeholder="Label (e.g. Certs)"
                          className="px-2 py-1 bg-white/5 border border-white/10 text-xs text-slate-400 rounded focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section Save Option */}
                <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-4">
                  <div className="text-xs text-slate-500 font-mono">
                    Any modifications to your Home parameters are stored instantly.
                  </div>
                  <button
                    type="button"
                    onClick={() => triggerSave(localData)}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer border border-indigo-500/10"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* About Section */}
            {activeTab === 'about' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase mb-1">About Narrative Builder</h2>
                  <p className="text-xs text-slate-400">Share your journey, professional philosophy, location parameters, and core objectives.</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest">Professional Bio</label>
                  <textarea
                    rows={6}
                    value={localData.personalInfo.bio}
                    onChange={(e) => updatePersonalInfo('bio', e.target.value)}
                    placeholder="Introduce yourself to prospective recruiters or clients..."
                    className="w-full px-4 py-3 text-sm rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest">Career Objective</label>
                  <textarea
                    rows={3}
                    value={localData.personalInfo.objective}
                    onChange={(e) => updatePersonalInfo('objective', e.target.value)}
                    placeholder="What are your immediate hiring objectives?"
                    className="w-full px-4 py-3 text-sm rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest">Operational Base (Location)</label>
                  <input
                    type="text"
                    value={localData.personalInfo.location}
                    onChange={(e) => updatePersonalInfo('location', e.target.value)}
                    placeholder="e.g. San Francisco, California"
                    className="w-full px-4 py-3 text-sm rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>

                {/* Education Section inside About */}
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col gap-5 mt-6">
                  <div>
                    <h3 className="text-sm font-black tracking-tight text-indigo-400 uppercase font-mono flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-indigo-400" />
                      <span>Educational Insights & Background</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1">Add or update your formal degrees, specializations, and academic milestones shown in your About narrative.</p>
                  </div>

                  {/* Add New Education Subform */}
                  <div className="p-5 rounded-2xl bg-slate-900 border border-white/5 flex flex-col gap-4">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">Add Education Record</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-bold text-slate-400 font-mono uppercase">Degree / Specialization</label>
                        <input
                          type="text"
                          value={newEduDegree}
                          onChange={(e) => setNewEduDegree(e.target.value)}
                          placeholder="e.g. Master of Science in Computer Science"
                          className="px-3.5 py-2 text-xs rounded-xl border border-white/10 bg-slate-950 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-bold text-slate-400 font-mono uppercase">Institution / School</label>
                        <input
                          type="text"
                          value={newEduInstitution}
                          onChange={(e) => setNewEduInstitution(e.target.value)}
                          placeholder="e.g. Stanford University"
                          className="px-3.5 py-2 text-xs rounded-xl border border-white/10 bg-slate-950 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-bold text-slate-400 font-mono uppercase">Duration / Period</label>
                        <input
                          type="text"
                          value={newEduDuration}
                          onChange={(e) => setNewEduDuration(e.target.value)}
                          placeholder="e.g. 2018 - 2020 or Sept 2022 - Jun 2026"
                          className="px-3.5 py-2 text-xs rounded-xl border border-white/10 bg-slate-950 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-bold text-slate-400 font-mono uppercase">Academic Highlights / Insights</label>
                        <textarea
                          rows={2}
                          value={newEduDescription}
                          onChange={(e) => setNewEduDescription(e.target.value)}
                          placeholder="Specializations, thesis titles, key research papers, honors..."
                          className="px-3.5 py-2 text-xs rounded-xl border border-white/10 bg-slate-950 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={addEducation}
                      className="self-end px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer border border-indigo-500/10 mt-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Academic Record</span>
                    </button>
                  </div>

                  {/* List of current Education */}
                  <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Current Education List</h4>
                    {(!localData.education || localData.education.length === 0) ? (
                      <div className="text-xs text-slate-500 italic py-3 text-center border border-dashed border-white/10 rounded-2xl">
                        No education records listed yet. Use the form above to add one.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {localData.education.map((edu) => (
                          <div 
                            key={edu.id} 
                            className="p-4 rounded-2xl bg-slate-900 border border-white/5 flex items-start justify-between gap-4 group hover:border-indigo-500/30 transition-all"
                          >
                            <div className="flex-1">
                              <h5 className="text-xs font-extrabold text-white">{edu.degree}</h5>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[11px] font-bold text-indigo-400">{edu.institution}</span>
                                <span className="text-slate-600">•</span>
                                <span className="text-[10px] font-mono text-slate-500">{edu.duration}</span>
                              </div>
                              {edu.description && (
                                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed bg-slate-950/40 p-2.5 rounded-xl border border-white/5">{edu.description}</p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeEducation(edu.id)}
                              className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
                              title="Delete education record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Section Save Option */}
                <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-4">
                  <div className="text-xs text-slate-500 font-mono">
                    Any modifications to your About parameters are stored instantly.
                  </div>
                  <button
                    type="button"
                    onClick={() => triggerSave(localData)}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer border border-indigo-500/10"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Skills Section */}
            {activeTab === 'skills' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase mb-1">Skills Ledger</h2>
                  <p className="text-xs text-slate-400">Add technical stack fluencies, sliders, and map categories (Frontend, Backend, Databases, Tools).</p>
                </div>

                {/* Add Skill Mini Form */}
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col gap-4">
                  <h3 className="text-sm font-black tracking-tight flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-indigo-400" />
                    <span>Append New Skill</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-slate-400 font-mono uppercase">Skill Name</label>
                      <input
                        type="text"
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                        placeholder="e.g. GraphQL or Rust"
                        className="px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-900 text-white placeholder-slate-600"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-slate-400 font-mono uppercase">Stack Category</label>
                      <select
                        value={newSkillCategory}
                        onChange={(e) => setNewSkillCategory(e.target.value as any)}
                        className="px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-900 text-white focus:outline-none"
                      >
                        <option value="frontend">Frontend Stack</option>
                        <option value="backend">Backend Systems</option>
                        <option value="databases">Databases & Caching</option>
                        <option value="tools">Infrastructure & Devops</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-slate-400 font-mono uppercase">Fluency Percentage ({newSkillPercentage}%)</label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={newSkillPercentage}
                        onChange={(e) => setNewSkillPercentage(Number(e.target.value))}
                        className="w-full accent-indigo-500 cursor-pointer"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-slate-400 font-mono uppercase">Lucide Icon Class</label>
                      <input
                        type="text"
                        value={newSkillIcon}
                        onChange={(e) => setNewSkillIcon(e.target.value)}
                        placeholder="e.g. Code2, Server, Database, Sparkles, Terminal"
                        className="px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-900 text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={addSkill}
                    className="self-start px-5 py-2 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 transition-all cursor-pointer mt-2"
                  >
                    Add Skill Node
                  </button>
                </div>

                {/* Display Current Skills List */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Current Registered Skills</h3>
                  {localData.skills.length === 0 ? (
                    <div className="text-center p-8 border border-white/5 rounded-2xl text-xs text-slate-500 font-mono">
                      No skill nodes currently cataloged. Appended nodes will render live.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {localData.skills.map((skill, index) => (
                        <div key={index} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-sm text-white">{skill.name}</span>
                            <div className="text-[10px] font-mono text-slate-400 mt-0.5 uppercase tracking-wide">
                              {skill.category} • {skill.percentage}% • Icon: {skill.iconName}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSkill(index)}
                            className="p-2 text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section Save Option */}
                <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-4">
                  <div className="text-xs text-slate-500 font-mono">
                    Any modifications to your Skills are saved to your account.
                  </div>
                  <button
                    type="button"
                    onClick={() => triggerSave(localData)}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer border border-indigo-500/10"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Projects Section */}
            {activeTab === 'projects' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase mb-1">Featured Works</h2>
                  <p className="text-xs text-slate-400">Append visual app builds, describe their system architectures, and paste link logs.</p>
                </div>

                {/* Add Project Form */}
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col gap-4">
                  <h3 className="text-sm font-black tracking-tight flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-indigo-400" />
                    <span>Catalog New Project</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-slate-400 font-mono uppercase">Title</label>
                      <input
                        type="text"
                        value={newProjTitle}
                        onChange={(e) => setNewProjTitle(e.target.value)}
                        placeholder="e.g. FinTech Smart Ledger"
                        className="px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-900 text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-slate-400 font-mono uppercase">Category</label>
                      <input
                        type="text"
                        value={newProjCategory}
                        onChange={(e) => setNewProjCategory(e.target.value)}
                        placeholder="e.g. Fintech, AI/ML, Creative Tech"
                        className="px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-900 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-slate-400 font-mono uppercase">Brief Summary Description</label>
                    <input
                      type="text"
                      value={newProjDesc}
                      onChange={(e) => setNewProjDesc(e.target.value)}
                      placeholder="Short hook to capture interest..."
                      className="px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-900 text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-slate-400 font-mono uppercase">In-Depth Case Study Explanation</label>
                    <textarea
                      rows={3}
                      value={newProjLongDesc}
                      onChange={(e) => setNewProjLongDesc(e.target.value)}
                      placeholder="Comprehensive system configuration, architecture bottlenecks resolved, or data flow structures..."
                      className="px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-900 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-slate-400 font-mono uppercase">Tech Stack Tags (Comma separated)</label>
                      <input
                        type="text"
                        value={newProjTags}
                        onChange={(e) => setNewProjTags(e.target.value)}
                        placeholder="e.g. React, Node.js, WebGL"
                        className="px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-900 text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-slate-400 font-mono uppercase">Cover Image URL / Upload</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={newProjImage}
                          onChange={(e) => setNewProjImage(e.target.value)}
                          placeholder="e.g. https://unsplash.com/... or blank"
                          className="flex-1 px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-900 text-white"
                        />
                        <FileUploader 
                          label="Upload Cover" 
                          onUpload={(base64) => setNewProjImage(base64)} 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-slate-400 font-mono uppercase">GitHub Repository Link</label>
                      <input
                        type="text"
                        value={newProjGithub}
                        onChange={(e) => setNewProjGithub(e.target.value)}
                        placeholder="https://github.com/..."
                        className="px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-900 text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-slate-400 font-mono uppercase">Live Hosting Link</label>
                      <input
                        type="text"
                        value={newProjDemo}
                        onChange={(e) => setNewProjDemo(e.target.value)}
                        placeholder="https://app.com/..."
                        className="px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-900 text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={addProject}
                    className="self-start px-5 py-2 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 transition-all cursor-pointer mt-2"
                  >
                    Catalog Project
                  </button>
                </div>

                {/* Display projects */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Cataloged Projects</h3>
                  {localData.projects.length === 0 ? (
                    <div className="text-center p-8 border border-white/5 rounded-2xl text-xs text-slate-500 font-mono">
                      No project catalogs registered.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3.5">
                      {localData.projects.map((proj) => (
                        <div key={proj.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3.5">
                            <img 
                              src={proj.image} 
                              alt="" 
                              className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0" 
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=80&h=80';
                              }}
                            />
                            <div>
                              <span className="font-bold text-sm text-white block">{proj.title}</span>
                              <span className="text-[10px] font-mono text-indigo-400 block uppercase mt-0.5">{proj.category}</span>
                              <p className="text-[11px] text-slate-400 line-clamp-1 mt-1 max-w-xl">{proj.description}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeProject(proj.id)}
                            className="p-2.5 text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition-all cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section Save Option */}
                <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-4">
                  <div className="text-xs text-slate-500 font-mono">
                    Any modifications to your Projects are saved to your account.
                  </div>
                  <button
                    type="button"
                    onClick={() => triggerSave(localData)}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer border border-indigo-500/10"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Experience Section */}
            {activeTab === 'experience' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase mb-1">Career Timeline</h2>
                  <p className="text-xs text-slate-400">Chronicle employment parameters, organizational bases, and daily milestone responsibilities.</p>
                </div>

                {/* Add Experience Form */}
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col gap-4">
                  <h3 className="text-sm font-black tracking-tight flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-indigo-400" />
                    <span>Append Work Event</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-slate-400 font-mono uppercase">Company / Organization</label>
                      <input
                        type="text"
                        value={newExpCompany}
                        onChange={(e) => setNewExpCompany(e.target.value)}
                        placeholder="e.g. Horizon Labs"
                        className="px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-900 text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-slate-400 font-mono uppercase">Role / Rank</label>
                      <input
                        type="text"
                        value={newExpRole}
                        onChange={(e) => setNewExpRole(e.target.value)}
                        placeholder="e.g. Senior Backend Engineer"
                        className="px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-900 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-slate-400 font-mono uppercase">Location</label>
                      <input
                        type="text"
                        value={newExpLocation}
                        onChange={(e) => setNewExpLocation(e.target.value)}
                        placeholder="e.g. Cupertino, CA or Remote"
                        className="px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-900 text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-slate-400 font-mono uppercase">Duration Window</label>
                      <input
                        type="text"
                        value={newExpDuration}
                        onChange={(e) => setNewExpDuration(e.target.value)}
                        placeholder="e.g. May 2024 - Present"
                        className="px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-900 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-slate-400 font-mono uppercase">Core Responsibilities (One task per line)</label>
                    <textarea
                      rows={3}
                      value={newExpResp}
                      onChange={(e) => setNewExpResp(e.target.value)}
                      placeholder="e.g. Developed scalable server systems&#10;Mentored 4 junior engineers"
                      className="px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-900 text-white font-sans"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={addExperience}
                    className="self-start px-5 py-2 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 transition-all cursor-pointer mt-2"
                  >
                    Commit Work Event
                  </button>
                </div>

                {/* Display Current Experience */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Current Timeline Milestones</h3>
                  {localData.experiences.length === 0 ? (
                    <div className="text-center p-8 border border-white/5 rounded-2xl text-xs text-slate-500 font-mono">
                      No career milestone events logged.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3.5">
                      {localData.experiences.map((exp) => (
                        <div key={exp.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start justify-between gap-4">
                          <div>
                            <span className="font-bold text-sm text-white block">{exp.role} @ <span className="text-indigo-400">{exp.company}</span></span>
                            <span className="text-[10px] font-mono text-slate-400 block mt-0.5">{exp.duration} • {exp.location}</span>
                            <ul className="list-disc list-inside mt-2 flex flex-col gap-1 text-xs text-slate-300">
                              {exp.responsibilities.map((r, i) => (
                                <li key={i} className="line-clamp-1">{r}</li>
                              ))}
                            </ul>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeExperience(exp.id)}
                            className="p-2.5 text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition-all cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section Save Option */}
                <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-4">
                  <div className="text-xs text-slate-500 font-mono">
                    Any modifications to your Experiences are saved to your account.
                  </div>
                  <button
                    type="button"
                    onClick={() => triggerSave(localData)}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer border border-indigo-500/10"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Credentials / Certifications Section */}
            {activeTab === 'credentials' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase mb-1">Licenses & Certifications</h2>
                  <p className="text-xs text-slate-400">Append verify links and credential badges to highlight your verified professional authority.</p>
                </div>

                {/* Add Cert Form */}
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col gap-4">
                  <h3 className="text-sm font-black tracking-tight flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-indigo-400" />
                    <span>Catalog New License/Credential</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-slate-400 font-mono uppercase">Certification Name</label>
                      <input
                        type="text"
                        value={newCertTitle}
                        onChange={(e) => setNewCertTitle(e.target.value)}
                        placeholder="e.g. Google Cloud Architect"
                        className="px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-900 text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-slate-400 font-mono uppercase">Issuing Authority</label>
                      <input
                        type="text"
                        value={newCertIssuer}
                        onChange={(e) => setNewCertIssuer(e.target.value)}
                        placeholder="e.g. Google Cloud Platform"
                        className="px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-900 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-slate-400 font-mono uppercase">Issue Date</label>
                      <input
                        type="text"
                        value={newCertDate}
                        onChange={(e) => setNewCertDate(e.target.value)}
                        placeholder="e.g. May 2025"
                        className="px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-900 text-white"
                      />
                    </div>
                    <div className="col-span-2 flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-slate-400 font-mono uppercase">Verification Link / ID</label>
                      <input
                        type="text"
                        value={newCertUrl}
                        onChange={(e) => setNewCertUrl(e.target.value)}
                        placeholder="https://..."
                        className="px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-900 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-slate-400 font-mono uppercase">Credential Graphic Banner/Image URL / Upload</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={newCertImage}
                        onChange={(e) => setNewCertImage(e.target.value)}
                        placeholder="e.g. https://images.unsplash.com/... or blank"
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-900 text-white"
                      />
                      <FileUploader 
                        label="Upload Banner" 
                        onUpload={(base64) => setNewCertImage(base64)} 
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={addCertification}
                    className="self-start px-5 py-2 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 transition-all cursor-pointer mt-2"
                  >
                    Catalog Credential
                  </button>
                </div>

                {/* Display Current Certs */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Cataloged Credentials</h3>
                  {localData.certifications.length === 0 ? (
                    <div className="text-center p-8 border border-white/5 rounded-2xl text-xs text-slate-500 font-mono">
                      No licenses or credentials logged.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3.5">
                      {localData.certifications.map((cert) => (
                        <div key={cert.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={cert.image} 
                              alt="" 
                              className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0" 
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&q=80&w=60&h=60';
                              }}
                            />
                            <div>
                              <span className="font-bold text-sm text-white block">{cert.title}</span>
                              <span className="text-[10px] font-mono text-slate-400 block mt-0.5">{cert.issuer} • {cert.date}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeCertification(cert.id)}
                            className="p-2.5 text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition-all cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section Save Option */}
                <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-4">
                  <div className="text-xs text-slate-500 font-mono">
                    Any modifications to your Credentials are saved to your account.
                  </div>
                  <button
                    type="button"
                    onClick={() => triggerSave(localData)}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer border border-indigo-500/10"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Blog Section */}
            {activeTab === 'blog' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase mb-1">Insights & Writings</h2>
                    <p className="text-xs text-slate-400">Write thought pieces, technical deep dives, or notes on design system configurations.</p>
                  </div>
                  <button
                    type="button"
                    onClick={restoreSampleArticles}
                    className="px-3.5 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                    title="Load pre-built rich technical articles"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Load Sample Articles</span>
                  </button>
                </div>

                {/* Edit or Add Blog Form */}
                <div className={`p-6 rounded-3xl bg-white/5 border transition-all flex flex-col gap-4 ${editingBlogId ? 'border-amber-500/50 ring-1 ring-amber-500/30' : 'border-white/10'}`}>
                  
                  {/* Form Header */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <h3 className="text-sm font-black tracking-tight flex items-center gap-2">
                      {editingBlogId ? (
                        <>
                          <Edit2 className="w-4 h-4 text-amber-400" />
                          <span className="text-amber-300">Editing Article: {newBlogTitle || 'Untitled'}</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 text-indigo-400" />
                          <span>Publish New Thought Article</span>
                        </>
                      )}
                    </h3>

                    {editingBlogId && (
                      <button
                        type="button"
                        onClick={cancelEditBlogPost}
                        className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-slate-400 font-mono uppercase">Article Title *</label>
                      <input
                        type="text"
                        value={newBlogTitle}
                        onChange={(e) => setNewBlogTitle(e.target.value)}
                        placeholder="e.g. Designing Fluid Interfaces with Motion"
                        className="px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-900 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-slate-400 font-mono uppercase">Category</label>
                      <input
                        type="text"
                        value={newBlogCategory}
                        onChange={(e) => setNewBlogCategory(e.target.value)}
                        placeholder="e.g. Design Systems, Engineering, AI & ML"
                        className="px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-900 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-slate-400 font-mono uppercase">Summary / Abstract *</label>
                    <input
                      type="text"
                      value={newBlogSummary}
                      onChange={(e) => setNewBlogSummary(e.target.value)}
                      placeholder="One-to-two sentence catchy preview of the article..."
                      className="px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-900 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Markdown Body with Toolbar and Preview Toggle */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[9px] font-bold text-slate-400 font-mono uppercase">
                        Article Content (Markdown Supported)
                      </label>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setShowBlogPreview(!showBlogPreview)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-colors cursor-pointer flex items-center gap-1 ${
                            showBlogPreview 
                              ? 'bg-indigo-600 text-white font-bold' 
                              : 'bg-slate-800 text-slate-300 hover:text-white'
                          }`}
                        >
                          <Eye className="w-3 h-3" />
                          <span>{showBlogPreview ? 'Show Editor' : 'Live Preview'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Markdown Quick-Actions Toolbar */}
                    {!showBlogPreview && (
                      <div className="flex flex-wrap items-center gap-1 p-1.5 rounded-xl bg-slate-900/80 border border-white/5">
                        <button
                          type="button"
                          onClick={() => insertMarkdown('### Section Title')}
                          className="px-2 py-1 rounded hover:bg-slate-800 text-slate-300 text-[11px] font-mono flex items-center gap-1"
                          title="Add Heading 3"
                        >
                          <Hash className="w-3 h-3 text-indigo-400" />
                          <span>H3</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('#### Subtitle')}
                          className="px-2 py-1 rounded hover:bg-slate-800 text-slate-300 text-[11px] font-mono"
                          title="Add Subtitle"
                        >
                          H4
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('**bold text**')}
                          className="px-2 py-1 rounded hover:bg-slate-800 text-slate-300 text-[11px] font-bold"
                          title="Bold text"
                        >
                          B
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('*italic text*')}
                          className="px-2 py-1 rounded hover:bg-slate-800 text-slate-300 text-[11px] italic"
                          title="Italic text"
                        >
                          I
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('```tsx\n// code block\n```')}
                          className="px-2 py-1 rounded hover:bg-slate-800 text-slate-300 text-[11px] font-mono flex items-center gap-1"
                          title="Insert Code Block"
                        >
                          <Code className="w-3 h-3 text-emerald-400" />
                          <span>Code</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('- List item 1\n- List item 2')}
                          className="px-2 py-1 rounded hover:bg-slate-800 text-slate-300 text-[11px] font-mono flex items-center gap-1"
                          title="Insert Bullet List"
                        >
                          <List className="w-3 h-3 text-sky-400" />
                          <span>List</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => insertMarkdown('| Column 1 | Column 2 |\n| :--- | :--- |\n| Value A | Value B |')}
                          className="px-2 py-1 rounded hover:bg-slate-800 text-slate-300 text-[11px] font-mono"
                          title="Insert Markdown Table"
                        >
                          Table
                        </button>

                        <div className="flex-1" />

                        {/* Microphone Dictation Button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (isBlogDictating) {
                              stopBlogDictation();
                            } else {
                              startBlogDictation();
                            }
                          }}
                          className={`px-2.5 py-1 rounded text-[11px] font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                            isBlogDictating
                              ? 'bg-rose-500 text-white animate-pulse font-bold shadow-md shadow-rose-500/30'
                              : 'bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 hover:text-white border border-indigo-500/30'
                          }`}
                          title={isBlogDictating ? "Stop recording speech" : "Enable microphone to dictate article content"}
                        >
                          {isBlogDictating ? (
                            <>
                              <MicOff className="w-3.5 h-3.5" />
                              <span>Stop Dictation</span>
                            </>
                          ) : (
                            <>
                              <Mic className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Dictate (Mic)</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Builder Dictation Live Stream Banner */}
                    {isBlogDictating && (
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
                        <span className="font-bold shrink-0">Listening:</span>
                        <span className="text-white italic truncate">
                          {blogInterimTranscript ? `"${blogInterimTranscript}"` : 'Speak into your microphone...'}
                        </span>
                      </div>
                    )}

                    {blogSpeechError && (
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono flex items-center justify-between">
                        <span>{blogSpeechError}</span>
                        <button type="button" onClick={() => setBlogSpeechError(null)} className="text-amber-400 hover:text-white">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Editor or Preview Pane */}
                    {showBlogPreview ? (
                      <div className="p-4 rounded-xl border border-white/10 bg-slate-950 text-slate-300 text-xs min-h-[180px] max-h-[350px] overflow-y-auto font-sans leading-relaxed">
                        {newBlogContent.trim() ? (
                          <div className="space-y-3">
                            {newBlogContent.split('\n\n').map((chunk, idx) => {
                              if (chunk.startsWith('### ')) {
                                return <h4 key={idx} className="text-base font-bold text-white border-b border-white/10 pb-1">{chunk.replace('### ', '')}</h4>;
                              }
                              if (chunk.startsWith('```')) {
                                return <pre key={idx} className="p-3 rounded-lg bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto"><code>{chunk.replace(/```/g, '')}</code></pre>;
                              }
                              return <p key={idx} className="text-slate-300">{chunk}</p>;
                            })}
                          </div>
                        ) : (
                          <p className="text-slate-500 italic">No content written yet. Switch back to editor to begin.</p>
                        )}
                      </div>
                    ) : (
                      <textarea
                        rows={8}
                        value={newBlogContent}
                        onChange={(e) => setNewBlogContent(e.target.value)}
                        placeholder="Write your article narrative with markdown headings (###), code blocks (```), tables, and bullet points..."
                        className="px-3.5 py-3 text-xs rounded-xl border border-white/10 bg-slate-900 text-white font-mono leading-relaxed focus:outline-none focus:border-indigo-500"
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[9px] font-bold text-slate-400 font-mono uppercase">Read Time</label>
                        <button
                          type="button"
                          onClick={autoCalculateReadTime}
                          className="text-[9px] font-mono text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                        >
                          Auto Calc
                        </button>
                      </div>
                      <input
                        type="text"
                        value={newBlogReadTime}
                        onChange={(e) => setNewBlogReadTime(e.target.value)}
                        placeholder="e.g. 5 min read"
                        className="px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-900 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-slate-400 font-mono uppercase">Publish Date</label>
                      <input
                        type="text"
                        value={newBlogDate}
                        onChange={(e) => setNewBlogDate(e.target.value)}
                        placeholder="e.g. Jun 24, 2026"
                        className="px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-900 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-slate-400 font-mono uppercase">Tags (comma-separated)</label>
                      <input
                        type="text"
                        value={newBlogTags}
                        onChange={(e) => setNewBlogTags(e.target.value)}
                        placeholder="e.g. React, UI/UX, Performance"
                        className="px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-900 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-slate-400 font-mono uppercase">Cover Image URL / Upload</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={newBlogImage}
                        onChange={(e) => setNewBlogImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-white/10 bg-slate-900 text-white focus:outline-none focus:border-indigo-500"
                      />
                      <FileUploader 
                        label="Upload Cover" 
                        onUpload={(base64) => setNewBlogImage(base64)} 
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <button
                      type="button"
                      onClick={addOrUpdateBlogPost}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-lg ${
                        editingBlogId 
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950' 
                          : 'bg-white hover:bg-slate-100 text-slate-950'
                      }`}
                    >
                      {editingBlogId ? 'Update Article' : 'Publish Article'}
                    </button>

                    {editingBlogId && (
                      <button
                        type="button"
                        onClick={cancelEditBlogPost}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold text-xs transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Display Current Articles */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                      Published Articles ({localData.blogPosts.length})
                    </h3>
                  </div>

                  {localData.blogPosts.length === 0 ? (
                    <div className="text-center p-10 border border-white/5 rounded-3xl bg-white/2 text-xs text-slate-500 font-mono flex flex-col items-center gap-3">
                      <FileText className="w-8 h-8 opacity-40 text-slate-400" />
                      <span>No blog articles published yet. Use the form above or click "Load Sample Articles".</span>
                      <button
                        type="button"
                        onClick={restoreSampleArticles}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer mt-1"
                      >
                        Populate Sample Articles
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3.5">
                      {localData.blogPosts.map((post) => (
                        <div 
                          key={post.id} 
                          className={`p-4 rounded-2xl bg-white/5 border transition-all flex items-center justify-between gap-4 ${
                            editingBlogId === post.id ? 'border-amber-500/50 bg-amber-500/5' : 'border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <img 
                              src={post.image} 
                              alt="" 
                              className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0" 
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=80&h=80';
                              }}
                            />
                            <div className="min-w-0">
                              <span className="font-bold text-sm text-white block truncate">{post.title}</span>
                              <span className="text-[10px] font-mono text-indigo-400 block mt-0.5">
                                {post.category} &bull; {post.date} &bull; {post.readTime}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => startEditBlogPost(post)}
                              className="p-2.5 text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-xl transition-all cursor-pointer"
                              title="Edit Article"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeBlogPost(post.id)}
                              className="p-2.5 text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition-all cursor-pointer"
                              title="Delete Article"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section Save Option */}
                <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-4">
                  <div className="text-xs text-slate-500 font-mono">
                    Any modifications to your Blog Posts are saved to your account.
                  </div>
                  <button
                    type="button"
                    onClick={() => triggerSave(localData)}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer border border-indigo-500/10"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Contact Parameters Section */}
            {activeTab === 'contact' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase mb-1">Contact Parameters</h2>
                  <p className="text-xs text-slate-400">Configure public correspondence parameters, direct email nodes, and socials.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest">Direct Correspondence Email</label>
                    <input
                      type="email"
                      value={localData.personalInfo.email}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                      placeholder="e.g. alex@domain.com"
                      className="w-full px-4 py-3 text-sm rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest">GitHub Link</label>
                    <input
                      type="text"
                      value={localData.personalInfo.github}
                      onChange={(e) => updatePersonalInfo('github', e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full px-4 py-3 text-sm rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest">LinkedIn Profile Link</label>
                    <input
                      type="text"
                      value={localData.personalInfo.linkedin}
                      onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full px-4 py-3 text-sm rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest">Twitter / X Link</label>
                    <input
                      type="text"
                      value={localData.personalInfo.twitter}
                      onChange={(e) => updatePersonalInfo('twitter', e.target.value)}
                      placeholder="https://twitter.com/..."
                      className="w-full px-4 py-3 text-sm rounded-xl border border-white/10 bg-white/5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {/* Section Save Option */}
                <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-4">
                  <div className="text-xs text-slate-500 font-mono">
                    Any modifications to your Contact details are saved to your account.
                  </div>
                  <button
                    type="button"
                    onClick={() => triggerSave(localData)}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer border border-indigo-500/10"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Visitor Inbox Messages Section */}
            {activeTab === 'inbox' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-3xl font-black tracking-tighter uppercase">Visitor Inquiries Inbox</h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-mono text-xs font-bold">
                        {localData.inboxMessages?.length || 0} Total
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      All direct correspondence received or dispatched is securely archived and verifiable with TLS 1.3 cryptographic receipts.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDirectComposer(!showDirectComposer)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold text-xs font-mono flex items-center gap-2 shadow-lg transition-transform hover:scale-102 cursor-pointer self-start sm:self-auto"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{showDirectComposer ? 'Hide Dispatcher' : 'Compose Secure Email'}</span>
                  </button>
                </div>

                {/* Direct Email Dispatcher Modal / Card */}
                <AnimatePresence>
                  {showDirectComposer && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 rounded-3xl bg-slate-900 border border-indigo-500/30 shadow-2xl flex flex-col gap-4">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-indigo-400" />
                            <h3 className="font-bold text-white text-sm uppercase tracking-wide">
                              Direct Secure Email Dispatcher
                            </h3>
                          </div>
                          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
                            TLS 1.3 Authenticated
                          </span>
                        </div>

                        {directSuccessMessage && (
                          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 font-mono">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>{directSuccessMessage}</span>
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold text-slate-400 font-mono uppercase">
                              Recipient Email Address *
                            </label>
                            <input
                              type="email"
                              value={directRecipient}
                              onChange={(e) => setDirectRecipient(e.target.value)}
                              placeholder="e.g. client@company.com"
                              className="px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-bold text-slate-400 font-mono uppercase">
                              Email Subject *
                            </label>
                            <input
                              type="text"
                              value={directSubject}
                              onChange={(e) => setDirectSubject(e.target.value)}
                              placeholder="e.g. Follow-up regarding software development inquiry"
                              className="px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-slate-400 font-mono uppercase">
                            Message Content *
                          </label>
                          <textarea
                            rows={4}
                            value={directBody}
                            onChange={(e) => setDirectBody(e.target.value)}
                            placeholder="Draft your secure correspondence..."
                            className="px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 resize-none font-sans"
                          />
                        </div>

                        {/* Quick Webmail launch links if recipient is filled */}
                        {directRecipient && (
                          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                            <span className="text-[10px] text-slate-400 font-mono uppercase">Quick Webmail Launch:</span>
                            <a
                              href={getGmailComposeUrl(directRecipient, directSubject, directBody)}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-mono flex items-center gap-1 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Gmail</span>
                            </a>
                            <a
                              href={getOutlookComposeUrl(directRecipient, directSubject, directBody)}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-[11px] font-mono flex items-center gap-1 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Outlook</span>
                            </a>
                            <a
                              href={getMailtoUrl(directRecipient, directSubject, directBody)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-[11px] font-mono flex items-center gap-1 transition-colors"
                            >
                              <Mail className="w-3 h-3" />
                              <span>Default Mail</span>
                            </a>
                          </div>
                        )}

                        <div className="flex justify-end gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setShowDirectComposer(false)}
                            className="px-4 py-2 rounded-xl border border-white/10 text-slate-400 hover:text-white text-xs font-mono transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={directSending || !directRecipient || !directSubject || !directBody}
                            onClick={handleSendDirectEmail}
                            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs font-mono flex items-center gap-2 shadow-lg transition-transform hover:scale-101 cursor-pointer"
                          >
                            {directSending ? (
                              <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            ) : (
                              <Send className="w-3.5 h-3.5" />
                            )}
                            <span>Transmit Secure Email</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {(!localData.inboxMessages || localData.inboxMessages.length === 0) ? (
                  <div className="text-center p-12 border border-white/10 rounded-3xl bg-white/5 flex flex-col items-center gap-3">
                    <Mail className="w-8 h-8 text-slate-600 animate-bounce" />
                    <div>
                      <span className="font-bold text-slate-300 block">Inbox Clear</span>
                      <p className="text-xs text-slate-500 font-mono mt-1">Once visitors or clients submit messages, they will log instantly below.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {localData.inboxMessages.map((msg) => (
                      <div key={msg.id} className="p-6 rounded-3xl bg-slate-900 border border-white/10 flex flex-col gap-4 relative group hover:border-white/20 transition-all">
                        {/* Message Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-white text-base">{msg.senderName}</span>
                              {msg.status === 'replied' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold">
                                  <Check className="w-3 h-3" />
                                  Replied
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-mono text-[10px] font-bold">
                                  <ShieldCheck className="w-3 h-3" />
                                  Secure Inquiry
                                </span>
                              )}
                              {msg.securityHash && (
                                <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">
                                  {msg.securityHash}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                              <span className="text-indigo-400 font-mono">From: {msg.senderEmail}</span>
                              {msg.recipientEmail && (
                                <span className="text-slate-400 font-mono">To: {msg.recipientEmail}</span>
                              )}
                              <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                            </div>
                            {msg.subject && (
                              <span className="text-xs font-semibold text-slate-300 mt-0.5 font-sans">
                                Subject: {msg.subject}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            <button
                              type="button"
                              onClick={() => handleStartReply(msg)}
                              className="px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                              title={`Send secure email to ${msg.senderEmail}`}
                            >
                              <Reply className="w-3.5 h-3.5" />
                              <span>Reply to {msg.senderEmail}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => clearInboxMessage(msg.id)}
                              className="p-2 text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl transition-all cursor-pointer"
                              title="Delete Message Log"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Message Body */}
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                          {msg.message}
                        </div>

                        {/* Previous Reply Log if exists */}
                        {msg.replyMessage && (
                          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col gap-1.5">
                            <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400">
                              <span className="font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Your Dispatched Reply:
                              </span>
                              <span className="text-slate-500">{msg.replyTimestamp}</span>
                            </div>
                            <p className="text-xs text-slate-300 whitespace-pre-wrap font-sans">
                              {msg.replyMessage}
                            </p>
                          </div>
                        )}

                        {/* Quick Webmail Launchers for this sender's email */}
                        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/5 text-xs">
                          <span className="text-[10px] text-slate-500 font-mono uppercase">Direct Handshake:</span>
                          <a
                            href={getGmailComposeUrl(msg.senderEmail, `Re: ${msg.subject || 'Portfolio Inquiry'}`, `Hi ${msg.senderName},\n\n`)}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-mono flex items-center gap-1 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Gmail to {msg.senderEmail}</span>
                          </a>
                          <a
                            href={getOutlookComposeUrl(msg.senderEmail, `Re: ${msg.subject || 'Portfolio Inquiry'}`, `Hi ${msg.senderName},\n\n`)}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-[11px] font-mono flex items-center gap-1 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Outlook</span>
                          </a>
                          <a
                            href={getMailtoUrl(msg.senderEmail, `Re: ${msg.subject || 'Portfolio Inquiry'}`, `Hi ${msg.senderName},\n\n`)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-[11px] font-mono flex items-center gap-1 transition-colors"
                          >
                            <Mail className="w-3 h-3" />
                            <span>Client Mail</span>
                          </a>
                        </div>

                        {/* Active Inline Reply Form */}
                        <AnimatePresence>
                          {replyingToId === msg.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pt-2 border-t border-indigo-500/30 flex flex-col gap-3"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold font-mono text-indigo-400 flex items-center gap-1.5">
                                  <Reply className="w-3.5 h-3.5" />
                                  Replying securely to {msg.senderEmail}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setReplyingToId(null)}
                                  className="text-slate-500 hover:text-slate-300 text-xs font-mono"
                                >
                                  Cancel
                                </button>
                              </div>

                              {replySuccessMessage && (
                                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                                  <span>{replySuccessMessage}</span>
                                </div>
                              )}

                              {/* Fast Templates */}
                              <div className="flex flex-wrap gap-1.5">
                                <span className="text-[10px] text-slate-500 font-mono uppercase self-center">Templates:</span>
                                <button
                                  type="button"
                                  onClick={() => setReplyText(`Hi ${msg.senderName},\n\nThank you for reaching out! I would love to schedule a brief consultation to discuss your project requirements in detail. What days work best for you this week?\n\nBest regards,\n${localData.personalInfo.name}`)}
                                  className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] font-mono transition-colors"
                                >
                                  Schedule Call
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setReplyText(`Hi ${msg.senderName},\n\nThank you for getting in touch. I have reviewed your briefing and would be delighted to collaborate. Could you share more details regarding the timeline and tech stack constraints?\n\nBest regards,\n${localData.personalInfo.name}`)}
                                  className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] font-mono transition-colors"
                                >
                                  Request Tech Scope
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setReplyText(`Hi ${msg.senderName},\n\nThank you for considering my profile for this opportunity. I have attached my latest credentials and portfolio links for your review.\n\nBest regards,\n${localData.personalInfo.name}`)}
                                  className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] font-mono transition-colors"
                                >
                                  Share Credentials
                                </button>
                              </div>

                              <textarea
                                rows={4}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                disabled={replySending}
                                className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-950 border border-indigo-500/40 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-sans"
                                placeholder={`Draft your secure reply to ${msg.senderEmail}...`}
                              />

                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  disabled={replySending || !replyText.trim()}
                                  onClick={() => handleSendReply(msg)}
                                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs font-mono flex items-center gap-1.5 shadow-lg transition-transform hover:scale-101 cursor-pointer"
                                >
                                  {replySending ? (
                                    <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                  ) : (
                                    <Send className="w-3.5 h-3.5" />
                                  )}
                                  <span>Transmit Secure Reply</span>
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

          </div>
        </main>
      </div>
      
      {/* Account Security & Password Settings Modal */}
      <AccountSecurityModal
        isOpen={showSecurityModal}
        onClose={() => setShowSecurityModal(false)}
        username={username}
      />
    </div>
  );
}

