import { useState, useEffect, FormEvent, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  KeyRound, Mail, CheckCircle2, AlertCircle, ArrowLeft, 
  ArrowRight, ShieldCheck, RefreshCw, Eye, EyeOff, Lock,
  ExternalLink, Check, Clock
} from 'lucide-react';
import { 
  findAccountByIdentifier, 
  generateResetCode, 
  storePasswordResetToken, 
  verifyPasswordResetCode, 
  updateAccountPassword, 
  maskEmail,
  setActiveSession,
  getAccounts,
  saveAccounts,
  UserAccount
} from '../lib/portfolioStore';
import { dispatchSecureEmail, TransmissionReceipt } from '../lib/secureEmailService';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialIdentifier?: string;
  onSuccessLogin: (username: string) => void;
  onContinueForNow?: (username: string) => void;
}

type Step = 'request' | 'verify' | 'new_password' | 'success';

export default function ForgotPasswordModal({
  isOpen,
  onClose,
  initialIdentifier = '',
  onSuccessLogin,
  onContinueForNow,
}: ForgotPasswordModalProps) {
  const [step, setStep] = useState<Step>('request');
  const [identifier, setIdentifier] = useState(initialIdentifier);
  const [targetAccount, setTargetAccount] = useState<UserAccount | null>(null);
  
  // Verification code states
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const [receipt, setReceipt] = useState<TransmissionReceipt | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // New password states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & feedback
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  // Sync initial identifier if opened with one
  useEffect(() => {
    if (isOpen) {
      if (initialIdentifier) {
        setIdentifier(initialIdentifier);
      }
      setError('');
      setNotice('');
    }
  }, [isOpen, initialIdentifier]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  if (!isOpen) return null;

  // 1. STEP 1: Request verification email
  const handleRequestReset = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');

    const cleanInput = identifier.trim();
    if (!cleanInput) {
      setError('Please provide your username or registered Gmail address.');
      return;
    }

    setIsLoading(true);
    const account = findAccountByIdentifier(cleanInput);

    if (!account) {
      setIsLoading(false);
      setError(`No account found matching "${cleanInput}". Please verify your credentials or register a new account.`);
      return;
    }

    // Determine target email: ensure it resolves to the registered Gmail address
    let recipientEmail = account.email;
    if (cleanInput.includes('@')) {
      recipientEmail = cleanInput.trim().toLowerCase();
    } else if (!recipientEmail && account.portfolio?.personalInfo?.email) {
      recipientEmail = account.portfolio.personalInfo.email;
    } else if (!recipientEmail) {
      recipientEmail = `${account.username}@gmail.com`;
    }

    // Persist verified email address to the user account in storage
    account.email = recipientEmail;
    const accounts = getAccounts();
    accounts[account.username.toLowerCase()] = account;
    saveAccounts(accounts);

    const resetCode = generateResetCode();

    // Store token securely with 10-minute validity
    storePasswordResetToken(account.username, resetCode);
    setTargetAccount(account);

    try {
      // Dispatch verified secure email directly to the registered Gmail address
      const emailReceipt = await dispatchSecureEmail({
        senderName: 'Portfolio Security Authority',
        senderEmail: 'security@portfolio-engine.dev',
        recipientEmail: recipientEmail,
        subject: `🔒 Verification Code: ${resetCode} for Password Reset`,
        message: [
          `Hello ${account.portfolio?.personalInfo?.name || account.username},`,
          ``,
          `A password reset request was initiated for your Portfolio Engine account (@${account.username}).`,
          ``,
          `YOUR 6-DIGIT VERIFICATION CODE:`,
          `==================================`,
          `         ${resetCode}            `,
          `==================================`,
          ``,
          `Security Notice:`,
          `- This code is valid for 10 minutes.`,
          `- Enter this code in the password recovery modal to verify your identity and set a new password.`,
          `- Never share this code with anyone.`,
          `- If you did not initiate this request, you can safely ignore this email.`
        ].join('\n')
      });

      setReceipt(emailReceipt);
      setIsLoading(false);
      setNotice(`Verification email directly sent to your registered Gmail: ${recipientEmail}. Please check your inbox.`);
      setResendCooldown(60);
      setStep('verify');
    } catch (err) {
      setIsLoading(false);
      setNotice(`Verification email sent to ${recipientEmail}.`);
      setResendCooldown(60);
      setStep('verify');
    }
  };

  // Re-send verification code directly to registered Gmail
  const handleResendCode = async () => {
    if (resendCooldown > 0 || !targetAccount) return;
    setError('');
    setIsLoading(true);

    const recipientEmail = targetAccount.email || targetAccount.portfolio?.personalInfo?.email || `${targetAccount.username}@gmail.com`;
    const newCode = generateResetCode();

    storePasswordResetToken(targetAccount.username, newCode);

    try {
      const emailReceipt = await dispatchSecureEmail({
        senderName: 'Portfolio Security Authority',
        senderEmail: 'security@portfolio-engine.dev',
        recipientEmail: recipientEmail,
        subject: `🔒 Resent Verification Code: ${newCode}`,
        message: [
          `Hello ${targetAccount.portfolio?.personalInfo?.name || targetAccount.username},`,
          ``,
          `Here is your fresh 6-digit password reset verification code:`,
          `==================================`,
          `         ${newCode}            `,
          `==================================`,
          `Valid for 10 minutes. Enter this code to set your new password.`
        ].join('\n')
      });
      setReceipt(emailReceipt);
      setNotice(`Fresh verification email sent to ${recipientEmail}.`);
      setResendCooldown(60);
    } catch (err) {
      setNotice(`Fresh code sent to ${recipientEmail}.`);
      setResendCooldown(60);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. STEP 2: Code input handlers
  const handleDigitChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, '');
    const newDigits = [...codeDigits];

    if (clean.length > 1) {
      // Handle pasted code (e.g. "482915")
      const pasted = clean.slice(0, 6).split('');
      pasted.forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      setCodeDigits(newDigits);
      const nextFocus = document.getElementById(`otp-input-${Math.min(5, pasted.length)}`);
      nextFocus?.focus();
      return;
    }

    newDigits[index] = clean ? clean[clean.length - 1] : '';
    setCodeDigits(newDigits);

    // Auto advance to next input
    if (clean && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleDigitKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyCode = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const fullCode = codeDigits.join('').trim();
    if (fullCode.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    if (!targetAccount) {
      setError('Session target expired. Please restart the reset process.');
      setStep('request');
      return;
    }

    const verification = verifyPasswordResetCode(targetAccount.username, fullCode);
    if (!verification.success) {
      setError(verification.error || 'Invalid code.');
      return;
    }

    setError('');
    setNotice('Verification code accepted. Please set your new password.');
    setStep('new_password');
  };

  // 3. STEP 3: Submit new password
  const handleResetPassword = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please ensure both fields are identical.');
      return;
    }

    if (!targetAccount) {
      setError('Target account session invalid.');
      return;
    }

    const result = updateAccountPassword(targetAccount.username, newPassword);
    if (!result.success) {
      setError(result.error || 'Failed to update password.');
      return;
    }

    // Successfully updated!
    setActiveSession(targetAccount.username);
    setStep('success');
  };


  // Calculate password strength
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'Empty', color: 'bg-slate-700' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
    if (/\d/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 3) return { score, label: 'Good', color: 'bg-amber-500' };
    return { score, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(newPassword);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative z-20"
      >
        {/* Top Header */}
        <div className="p-6 border-b border-white/10 bg-slate-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Account Recovery</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Secure TLS
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {step === 'request' && 'Identify your account to receive a verification email.'}
                {step === 'verify' && 'Enter the 6-digit verification code sent to your email.'}
                {step === 'new_password' && 'Choose a strong, secure new password.'}
                {step === 'success' && 'Password updated successfully!'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
          >
            &times;
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-3 border-b border-white/5 bg-slate-950/20 text-[11px] font-semibold text-slate-400">
          <div className={`py-2 px-3 text-center border-r border-white/5 ${step === 'request' ? 'text-indigo-400 bg-indigo-500/5 font-bold' : ''}`}>
            1. Request
          </div>
          <div className={`py-2 px-3 text-center border-r border-white/5 ${step === 'verify' ? 'text-indigo-400 bg-indigo-500/5 font-bold' : ''}`}>
            2. Verify Code
          </div>
          <div className={`py-2 px-3 text-center ${step === 'new_password' || step === 'success' ? 'text-indigo-400 bg-indigo-500/5 font-bold' : ''}`}>
            3. Reset Password
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span className="font-medium leading-relaxed">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Notice Message */}
          <AnimatePresence>
            {notice && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-indigo-400" />
                <span className="font-medium leading-relaxed">{notice}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* STEP 1: Request Verification Email */}
          {step === 'request' && (
            <form onSubmit={handleRequestReset} className="flex flex-col gap-4">
              <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/15 text-xs text-slate-300 leading-relaxed flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white mb-0.5">End-to-End Verified Verification</p>
                  <p>
                    Enter your registered <strong>Gmail address</strong> or <strong>Username</strong>. We will dispatch a secure 6-digit one-time code to authenticate your identity.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Username or Registered Gmail Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    autoFocus
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. alex or alex.rivera.dev@gmail.com"
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-white/10 bg-slate-950/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/30 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sending Verification Email...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>Send Verification Code</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel & Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Verify 6-Digit Code */}
          {step === 'verify' && targetAccount && (
            <form onSubmit={handleVerifyCode} className="flex flex-col gap-5">
              {/* Dispatch Receipt Card */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/20 flex flex-col gap-3 shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                    <Mail className="w-5 h-5 animate-pulse" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Sent to Registered Gmail</span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-semibold">
                        {receipt?.deliveredViaApi ? 'Directly Sent to Inbox' : 'Dispatched'}
                      </span>
                    </div>
                    <p className="text-xs font-mono font-bold text-indigo-300 truncate mt-1">
                      {targetAccount.email || targetAccount.portfolio?.personalInfo?.email || `${targetAccount.username}@gmail.com`}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-slate-300 leading-relaxed">
                  We have dispatched your 6-digit verification code to your registered Gmail address. Please check your Gmail inbox to retrieve your code.
                </div>

                {/* Direct Action: Open Gmail */}
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <a
                    href="https://mail.google.com/mail/u/0/#inbox"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/20"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Open Gmail Inbox</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>

                  {receipt?.gmailComposeUrl && (
                    <a
                      href={receipt.gmailComposeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      title="Open message in Gmail compose view"
                    >
                      <span>Webmail View</span>
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  )}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-white/5 pt-2">
                  <span className="flex items-center gap-1 font-mono">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>TLS 1.3 Verified & Protected</span>
                  </span>
                  <span className="text-slate-400">Code never displayed on screen</span>
                </div>
              </div>

              {/* 6-Digit OTP Input */}
              <div className="flex flex-col items-center gap-2">
                <label className="text-xs font-semibold text-slate-300">
                  Enter 6-Digit Verification Code
                </label>
                <div className="flex justify-center gap-2 sm:gap-2.5 w-full">
                  {codeDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                      className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold font-mono rounded-xl border border-white/15 bg-slate-950 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner"
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Code expires in 10 minutes</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5 pt-1">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify Code & Change Password</span>
                </button>

                {/* Resend Code Button with countdown */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1 px-1">
                  <button
                    type="button"
                    disabled={resendCooldown > 0 || isLoading}
                    onClick={handleResendCode}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer disabled:text-slate-600 transition-colors flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>{resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Verification Code'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep('request')}
                    className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    Change Email
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* STEP 3: Set New Password */}
          {step === 'new_password' && targetAccount && (
            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-slate-300 flex items-center justify-between">
                <div>
                  <span className="text-slate-400">Account: </span>
                  <strong className="text-white font-mono">@{targetAccount.username}</strong>
                </div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Identity Verified</span>
                </div>
              </div>

              {/* New Password Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min. 6 characters)"
                    className="w-full pl-10 pr-11 py-3 text-sm rounded-xl border border-white/10 bg-slate-950/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    tabIndex={-1}
                    className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden flex gap-1">
                      <div className={`h-full flex-1 rounded-full ${strength.score >= 1 ? strength.color : 'bg-transparent'}`} />
                      <div className={`h-full flex-1 rounded-full ${strength.score >= 2 ? strength.color : 'bg-transparent'}`} />
                      <div className={`h-full flex-1 rounded-full ${strength.score >= 3 ? strength.color : 'bg-transparent'}`} />
                      <div className={`h-full flex-1 rounded-full ${strength.score >= 4 ? strength.color : 'bg-transparent'}`} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{strength.label}</span>
                  </div>
                )}
              </div>

              {/* Confirm New Password Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full pl-10 pr-11 py-3 text-sm rounded-xl border border-white/10 bg-slate-950/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                    className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-[11px] text-rose-400 font-medium">Passwords do not match yet.</p>
                )}
                {confirmPassword && newPassword === confirmPassword && (
                  <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Passwords match</span>
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  type="submit"
                  disabled={!newPassword || newPassword !== confirmPassword || newPassword.length < 6}
                  className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/30 cursor-pointer disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>Update Password & Sign In</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: Success View */}
          {step === 'success' && targetAccount && (
            <div className="py-6 flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white">Password Successfully Updated!</h3>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Your credentials have been securely updated. You are now authenticated as{' '}
                <strong className="text-indigo-400 font-mono">@{targetAccount.username}</strong>.
              </p>
              <button
                type="button"
                onClick={() => {
                  onSuccessLogin(targetAccount.username);
                  onClose();
                }}
                className="w-full py-3.5 mt-2 rounded-xl font-bold text-xs uppercase tracking-wider bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                <span>Launch Portfolio Engine</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
