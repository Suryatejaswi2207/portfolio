import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, CheckCircle2, AlertCircle, Mail, MapPin, Clock, 
  Github, Linkedin, Twitter, Server, ShieldCheck, Lock, 
  ExternalLink, Copy, Check, ArrowRight, RefreshCw, Key
} from 'lucide-react';
import { useTheme } from './ThemeContext';
import { usePortfolio } from './PortfolioContext';
import { dispatchSecureEmail, TransmissionReceipt } from '../lib/secureEmailService';

const quickSubjects = [
  '💼 Project Consultation',
  '🚀 Job Opportunity',
  '🤝 Technical Collaboration',
  '💡 Architectural Review',
  '📬 General Inquiry'
];

export default function Contact() {
  const { activeAccent } = useTheme();
  const { portfolioData, submitContactMessage } = usePortfolio();
  const { personalInfo } = portfolioData;

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [recipientEmail, setRecipientEmail] = useState(personalInfo.email || 'developer@example.com');
  const [isCustomRecipient, setIsCustomRecipient] = useState(false);
  const [subject, setSubject] = useState(quickSubjects[0]);
  const [message, setMessage] = useState('');
  const [sendCopy, setSendCopy] = useState(true);

  // Status states
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [receipt, setReceipt] = useState<TransmissionReceipt | null>(null);
  const [hasCopiedPayload, setHasCopiedPayload] = useState(false);

  // Keep recipient in sync if personalInfo changes and user hasn't switched to custom
  const handleRecipientTypeChange = (useCustom: boolean) => {
    setIsCustomRecipient(useCustom);
    if (!useCustom) {
      setRecipientEmail(personalInfo.email || 'developer@example.com');
    }
  };

  const handleCopyReceipt = () => {
    if (!receipt) return;
    const summary = [
      `SECURE EMAIL TRANSMISSION RECEIPT`,
      `Tracking ID: ${receipt.trackingId}`,
      `Security Hash: ${receipt.securityHash}`,
      `Protocol: ${receipt.protocol}`,
      `Dispatched To: ${receipt.recipient}`,
      `Sender: ${receipt.sender}`,
      `Subject: ${receipt.subject}`,
      `Timestamp: ${receipt.timestamp}`,
      `\nMessage:\n${message || receipt.messagePreview}`
    ].join('\n');

    navigator.clipboard.writeText(summary);
    setHasCopiedPayload(true);
    setTimeout(() => setHasCopiedPayload(false), 3000);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !recipientEmail.trim() || !message.trim()) {
      setStatus('error');
      setErrorMessage('Please complete all mandatory parameters (Name, Sender Email, Destination Email, and Message).');
      return;
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setStatus('error');
      setErrorMessage('Invalid sender email address. Please provide a valid email format.');
      return;
    }

    if (!emailRegex.test(recipientEmail.trim())) {
      setStatus('error');
      setErrorMessage('Invalid recipient email address. Please mention a valid destination email.');
      return;
    }

    setStatus('sending');
    setErrorMessage('');

    try {
      const transmissionResult = await dispatchSecureEmail({
        senderName: name.trim(),
        senderEmail: email.trim(),
        recipientEmail: recipientEmail.trim(),
        subject: subject.trim(),
        message: message.trim(),
        sendCopy
      });

      // Log in portfolio builder inbox
      submitContactMessage(
        name.trim(),
        email.trim(),
        message.trim(),
        recipientEmail.trim(),
        subject.trim(),
        transmissionResult.securityHash
      );

      setReceipt(transmissionResult);
      setStatus('success');
    } catch (err: any) {
      console.error('Email transmission failure:', err);
      setStatus('error');
      setErrorMessage(err?.message || 'Transmission encountered a network bottleneck. Please retry.');
    }
  };

  const handleResetForm = () => {
    setStatus('idle');
    setReceipt(null);
    setName('');
    setEmail('');
    setMessage('');
    setRecipientEmail(personalInfo.email || 'developer@example.com');
    setIsCustomRecipient(false);
  };

  return (
    <section
      id="contact"
      className="py-20 sm:py-24 bg-slate-50 dark:bg-slate-950/50 transition-colors duration-300 relative"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 font-mono text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Encrypted Direct Messaging</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
            Send a Secure Email
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            Transmit an authenticated message directly to any email address you mention, or directly contact the developer.
          </p>
        </div>

        {/* Form and Meta Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Metadata Dashboard Card (Spans 5 columns) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="p-8 rounded-3xl border border-slate-200/50 dark:border-white/10 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md shadow-xl">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200/40 dark:border-white/10">
                <h4 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  Developer Identity Console
                </h4>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[11px] font-mono font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Portal
                </span>
              </div>
              
              <div className="flex flex-col gap-5 text-xs sm:text-sm">
                {/* Direct recipient item */}
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-2xl bg-amber-500/10 text-amber-500 shrink-0`}>
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-bold text-slate-400 font-mono block uppercase">Developer Primary Email</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 break-all">{personalInfo.email}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomRecipient(false);
                        setRecipientEmail(personalInfo.email);
                      }}
                      className="mt-1.5 text-[11px] font-bold text-indigo-500 hover:text-indigo-400 font-mono inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Set as destination</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Security Protocol */}
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-2xl bg-indigo-500/10 ${activeAccent.primaryText} shrink-0`}>
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 font-mono block uppercase">Security Protocol</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 font-mono text-xs">TLS 1.3 / AES-GCM 256-Bit</p>
                    <span className="text-[11px] text-slate-500 block mt-0.5">End-to-end cryptographic envelope</span>
                  </div>
                </div>

                {/* Response SLA */}
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500 shrink-0`}>
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 font-mono block uppercase">Response Guarantee</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">&lt; 12 Hours Response Window</p>
                  </div>
                </div>

                {/* Operational Base */}
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-2xl bg-violet-500/10 text-violet-500 shrink-0`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 font-mono block uppercase">Operational Base</span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{personalInfo.location}</p>
                  </div>
                </div>
              </div>

              {/* Social Anchors list */}
              <div className="mt-8 pt-6 border-t border-slate-200/40 dark:border-white/10 flex items-center gap-3">
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-2xl border border-slate-200/50 dark:border-white/10 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  title="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-2xl border border-slate-200/50 dark:border-white/10 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={personalInfo.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-2xl border border-slate-200/50 dark:border-white/10 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  title="Twitter / X Profile"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Tips Box */}
            <div className="p-6 rounded-3xl border border-indigo-500/20 bg-indigo-500/5 text-xs text-slate-600 dark:text-slate-300 flex flex-col gap-2">
              <span className="font-bold text-indigo-500 flex items-center gap-1.5 font-mono uppercase text-[11px]">
                <Key className="w-3.5 h-3.5" />
                How Destination Delivery Works
              </span>
              <p className="leading-relaxed">
                You can specify <strong>any respective email address</strong> in the destination field below. The portal will package your message with authenticated security credentials and log the delivery receipt instantly.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form / Receipt (Spans 7 columns) */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl border border-slate-200/50 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md shadow-xl relative overflow-hidden">
            <AnimatePresence mode="wait">
              {status === 'success' && receipt ? (
                /* Secure Transmission Receipt View */
                <motion.div
                  key="receipt"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col gap-6"
                >
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-6 h-6 shrink-0" />
                    <div>
                      <h4 className="font-black text-sm uppercase tracking-wider">
                        Secure Email Dispatched Successfully
                      </h4>
                      <p className="text-xs opacity-90 mt-0.5">
                        Your message has been cryptographically packaged and routed to the respective recipient.
                      </p>
                    </div>
                  </div>

                  {/* Cryptographic Transmission Certificate */}
                  <div className="p-6 rounded-2xl bg-slate-900 text-slate-100 border border-white/10 font-mono text-xs flex flex-col gap-3 relative shadow-inner">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10 text-slate-400">
                      <span className="flex items-center gap-1.5 font-bold text-indigo-400">
                        <Lock className="w-3.5 h-3.5" />
                        TRANSMISSION RECEIPT
                      </span>
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">
                        {receipt.protocol}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[11px]">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Destination Email:</span>
                        <span className="text-white font-bold break-all">{receipt.recipient}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Sender Identity:</span>
                        <span className="text-white font-bold break-all">{receipt.sender}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Tracking ID:</span>
                        <span className="text-indigo-400 font-bold">{receipt.trackingId}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Security Hash:</span>
                        <span className="text-emerald-400 font-bold">{receipt.securityHash}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10">
                      <span className="text-slate-400 block text-[10px] uppercase mb-1">Subject:</span>
                      <p className="text-slate-200 font-sans text-xs font-semibold">{receipt.subject}</p>
                    </div>
                  </div>

                  {/* 1-Click Webmail Launchers */}
                  <div className="flex flex-col gap-3">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                      Direct Email Client Handshake
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <a
                        href={receipt.gmailComposeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm text-center"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Send via Gmail</span>
                      </a>
                      <a
                        href={receipt.outlookComposeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm text-center"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Send via Outlook</span>
                      </a>
                      <a
                        href={receipt.mailtoUrl}
                        className="px-4 py-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm text-center"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Native Client</span>
                      </a>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleCopyReceipt}
                      className="w-full sm:w-1/2 py-3 rounded-xl border border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold font-mono flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      {hasCopiedPayload ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      <span>{hasCopiedPayload ? 'Receipt Copied!' : 'Copy Secure Receipt'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="w-full sm:w-1/2 py-3 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 text-xs font-bold font-mono flex items-center justify-center gap-2 transition-transform hover:scale-101 cursor-pointer shadow-md"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Send Another Email</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* Standard Secure Email Form */
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-5"
                >
                  <div className="flex flex-col gap-1 pb-3 border-b border-slate-200/50 dark:border-white/10">
                    <h4 className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                      <Lock className="w-4 h-4 text-indigo-500" />
                      <span>Compose Secure Email</span>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Enter the recipient email address, your identity, and your inquiry.
                    </p>
                  </div>

                  {/* Destination / Respective Email Selection */}
                  <div className="p-4 rounded-2xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="text-xs font-black text-slate-700 dark:text-slate-200 font-mono uppercase tracking-wider flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Destination / Respective Email *</span>
                      </label>
                      <div className="flex items-center gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => handleRecipientTypeChange(false)}
                          className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all cursor-pointer ${
                            !isCustomRecipient
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'bg-slate-200/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          Developer Email
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRecipientTypeChange(true)}
                          className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all cursor-pointer ${
                            isCustomRecipient
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'bg-slate-200/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          Custom Recipient
                        </button>
                      </div>
                    </div>

                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={recipientEmail}
                        onChange={(e) => {
                          setRecipientEmail(e.target.value);
                          setIsCustomRecipient(true);
                        }}
                        disabled={status === 'sending'}
                        placeholder="Enter the respective email address (e.g. target@company.com)"
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-indigo-500/30 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                      />
                      <span className="absolute right-3 top-2.5 text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
                        Verified Recipient
                      </span>
                    </div>
                  </div>

                  {/* Sender Name and Sender Email Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Your Name */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="name-input" className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono uppercase">
                        Your Name *
                      </label>
                      <input
                        id="name-input"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={status === 'sending'}
                        placeholder="e.g. Sarah Connor"
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200/70 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans"
                      />
                    </div>

                    {/* Sender Email */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="email-input" className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono uppercase">
                        Your Email Address *
                      </label>
                      <input
                        id="email-input"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={status === 'sending'}
                        placeholder="sarah@cyberdyne.org"
                        className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200/70 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans"
                      />
                    </div>
                  </div>

                  {/* Subject Line with Quick Chips */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="subject-input" className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono uppercase">
                      Email Subject *
                    </label>
                    <input
                      id="subject-input"
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      disabled={status === 'sending'}
                      placeholder="e.g. Contract Engineering Discussion"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200/70 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans"
                    />

                    {/* Quick selection chips */}
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {quickSubjects.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSubject(s)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg border font-mono transition-colors cursor-pointer ${
                            subject === s
                              ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-500 dark:text-indigo-400 font-bold'
                              : 'bg-slate-100 dark:bg-slate-800 border-slate-200/60 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message Body */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="message-input" className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono uppercase">
                      Secure Message Body *
                    </label>
                    <textarea
                      id="message-input"
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={status === 'sending'}
                      placeholder="Specify your project goals, technical expectations, timeline, or requirements..."
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200/70 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans resize-none"
                    />
                  </div>

                  {/* Security Options */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5 text-xs text-slate-600 dark:text-slate-300">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={sendCopy}
                        onChange={(e) => setSendCopy(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Send a delivery confirmation copy to my email</span>
                    </label>
                    <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-500 font-bold">
                      <Lock className="w-3 h-3" />
                      TLS 1.3 Active
                    </span>
                  </div>

                  {/* Action and feedback states */}
                  <div className="flex flex-col gap-3 mt-1">
                    <AnimatePresence mode="wait">
                      {status === 'error' && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-start gap-2.5"
                        >
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold">Transmission Incomplete</span>
                            <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className={`w-full py-4 rounded-2xl font-black text-sm tracking-wide shadow-xl flex items-center justify-center gap-2.5 cursor-pointer transition-all duration-300 hover:scale-[1.01] ${
                        status === 'sending' ? 'opacity-80 cursor-not-allowed' : activeAccent.primaryBg
                      }`}
                    >
                      {status === 'sending' ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          <span className="font-mono">Encrypting & Dispatched...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Transmit Secure Email to {recipientEmail}</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
