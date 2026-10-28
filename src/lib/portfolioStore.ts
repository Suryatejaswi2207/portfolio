import { Skill, Project, Experience, Certification, BlogPost, Education, InboxMessage } from '../types';

export interface PortfolioData {
  personalInfo: {
    name: string;
    title: string;
    tagline: string;
    bio: string;
    objective: string;
    email: string;
    github: string;
    linkedin: string;
    twitter: string;
    location: string;
    avatar: string;
    resumeUrl: string;
  };
  stats: Array<{ value: number; suffix: string; label: string }>;
  skills: Skill[];
  projects: Project[];
  experiences: Experience[];
  certifications: Certification[];
  blogPosts: BlogPost[];
  education: Education[];
  inboxMessages: InboxMessage[];
}

export interface UserAccount {
  username: string;
  email?: string;
  passwordHash: string; // Plain-text for standard mock client simulation
  portfolio: PortfolioData;
  hasCompletedOnboarding?: boolean;
  resetToken?: {
    code: string;
    expiresAt: number;
    requestedAt: number;
    email: string;
  };
}


export const defaultPortfolioData: PortfolioData = {
  personalInfo: {
    name: "Alex Rivera",
    title: "Senior Full-Stack & Creative Engineer",
    tagline: "I build high-performance, visually stunning web experiences that bridge the gap between complex engineering and elegant design.",
    bio: "Hello! I am a passionate software engineer based in San Francisco, CA. With over 6 years of experience in the industry, I specialize in crafting ultra-responsive interfaces, serverless architectures, and AI-integrated applications. I thrive on solving complex system design challenges while keeping an obsessive focus on visual fidelity, micro-animations, and outstanding user experiences inspired by modern giants.",
    objective: "To leverage my expertise in full-stack web applications, fluid animations, and robust system architectures to lead the development of next-generation user experiences.",
    email: "alex.rivera.dev@gmail.com",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    location: "San Francisco, California",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400",
    resumeUrl: "#",
  },
  stats: [
    { value: 6, suffix: "+", label: "Years Experience" },
    { value: 24, suffix: "", label: "Projects Completed" },
    { value: 98, suffix: "%", label: "Client Satisfaction" },
    { value: 420, suffix: "k+", label: "Lines of Code" },
  ],
  skills: [
    { name: "React / Next.js", category: "frontend", percentage: 95, iconName: "Code2" },
    { name: "TypeScript", category: "frontend", percentage: 92, iconName: "FileCode" },
    { name: "Tailwind CSS", category: "frontend", percentage: 98, iconName: "Palette" },
    { name: "Framer Motion", category: "frontend", percentage: 90, iconName: "Sparkles" },
    { name: "Node.js & Express", category: "backend", percentage: 88, iconName: "Server" },
    { name: "PostgreSQL", category: "databases", percentage: 85, iconName: "Database" },
    { name: "Docker", category: "tools", percentage: 75, iconName: "Container" },
  ],
  projects: [
    {
      id: "proj1",
      title: "Apex Revenue Dashboard",
      description: "An ultra-clean Stripe-inspired dashboard with interactive analytics and subscription graphs.",
      longDescription: "Apex is a high-fidelity SaaS analytics dashboard focusing on extreme speed and elegant UI layout. It processes simulated merchant transactional data, generating interactive visual line/bar graphs and custom subscription tiers controllers.",
      category: "Fintech",
      tags: ["React", "TypeScript", "Tailwind CSS", "Recharts", "Framer Motion"],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=600",
      github: "https://github.com",
      demo: "https://github.com",
      featured: true
    },
    {
      id: "proj2",
      title: "Scribe AI Workspace",
      description: "AI-driven collaborative doc organizer utilizing advanced semantic models for auto-summarization.",
      longDescription: "Scribe is a rich document workspace integrated with intelligent AI agents. It allows users to write markdown, capture rapid meeting notes, and use Gemini-powered commands to instantaneously summarize transcripts.",
      category: "AI & ML",
      tags: ["React", "Tailwind CSS", "Gemini SDK", "LocalForage", "Lucide Icons"],
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800&h=600",
      github: "https://github.com",
      demo: "https://github.com",
      featured: true
    }
  ],
  experiences: [
    {
      id: "exp1",
      company: "Stripe",
      role: "Senior Full-Stack Engineer",
      location: "San Francisco, CA",
      duration: "Jan 2024 - Present",
      responsibilities: [
        "Architected and deployed responsive dashboard components using React and custom component systems.",
        "Optimized load times and rendering cycles of transaction logs by 35%.",
        "Led a cross-functional squad of 5 developers to roll out localized checkout flows."
      ]
    },
    {
      id: "exp2",
      company: "Apple",
      role: "Software Engineer II",
      location: "Cupertino, CA",
      duration: "Aug 2022 - Dec 2023",
      responsibilities: [
        "Designed immersive marketing landing pages for key product releases.",
        "Developed secure serverless microservices handling millions of active API transactions."
      ]
    }
  ],
  certifications: [
    {
      id: "cert1",
      title: "AWS Solutions Architect Associate",
      issuer: "Amazon Web Services (AWS)",
      date: "Oct 2024",
      verificationUrl: "https://aws.amazon.com",
      image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&q=80&w=400&h=300"
    },
    {
      id: "cert2",
      title: "Professional Cloud Architect",
      issuer: "Google Cloud Platform (GCP)",
      date: "May 2025",
      verificationUrl: "https://cloud.google.com",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400&h=300"
    }
  ],
  blogPosts: [
    {
      id: "blog1",
      title: "Designing Fluid Interfaces with Framer Motion",
      summary: "A comprehensive guide on micro-interactions, spring animation choreography, and gestures to make your web UI feel physical and organic.",
      content: `### The Physics of Digital Interfaces

Traditional web animations are often linear, mechanical, and jarring. They ignore the intuitive physical rules our brains expect: acceleration, mass, friction, and fluid response. When building a premium UI inspired by Apple or Stripe, we must transition from *duration-based timing* (linear easings) to *spring physics-based models*.

#### Why Spring Physics Matter

With spring physics, instead of defining a strict \`duration: 0.3s\`, you define **stiffness**, **damping**, and **mass**. This allows animations to scale dynamically with velocity, resulting in a naturally fluid responsiveness to user drags, hover interactions, and clicks.

\`\`\`tsx
import { motion } from 'motion/react';

export const StickyButton = () => (
  <motion.button
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: "spring", stiffness: 400, damping: 15 }}
    className="px-6 py-3 bg-indigo-600 rounded-xl"
  >
    Interact
  </motion.button>
);
\`\`\`

#### Key Guidelines for Micro-interactions

- **Avoid Over-Animation**: Keep movements subtle. A scale of \`1.02\` to \`1.05\` is usually the sweet spot for hover effects.
- **Synchronize Layouts**: Use Motion's \`layout\` or \`layoutId\` prop for seamless fluid transformations of layout hierarchies (such as expanding cards or moving tabs indicators).
- **Stagger Entrances**: Entrance animations should be staggered progressively to guide the user's eye from top to bottom without overwhelming perception.

| Technique | When to Use | Perceived Latency |
| :--- | :--- | :--- |
| Spring Dynamics | Interactive buttons, gestures, drag modals | 0ms (instantaneous) |
| Layout Morphing | Shared element transitions, expanding cards | Fluid & uninterrupted |
| Staggered Fade | Initial list mount, dashboard cards | 100-250ms cadence |`,
      category: "Design Systems",
      date: "Jun 24, 2026",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800&h=450",
      tags: ["Framer Motion", "CSS Animations", "UI/UX", "Frontend"],
      featured: true,
      likes: 84,
      comments: [
        { id: "c1", author: "Sarah Jenkins", text: "Spring physics completely changed the feel of our checkout flow! Great write-up.", date: "Jun 26, 2026" },
        { id: "c2", author: "David Kim", text: "The layoutId shared transition pattern is incredible for fluid tab bars.", date: "Jun 28, 2026" }
      ]
    },
    {
      id: "blog2",
      title: "Optimizing React Render Pipelines in 2026",
      summary: "Deep-dive techniques for achieving consistent 60fps in highly dynamic, data-dense dashboards with virtualization and ref stabilization.",
      content: `### High-Performance Rendering in React

Data-dense analytics applications, interactive charts, and real-time logs can quickly degrade browser performance. A single parent render can cascade into hundreds of sub-component updates, dropping frame rates and introducing subtle UI latency.

#### 1. Reacting to Ref Stabilization

One of the most common mistakes is passing unmemoized objects, arrays, or anonymous functions directly into hooks, triggering repeated re-renders or rendering loops. Stabilizing references using \`useMemo\` and \`useCallback\` is the foundation of performant component trees.

\`\`\`tsx
// ❌ Bad: Triggers recreation on every parent render
const config = { api: "https://api.domain" };

// ✅ Good: Memoized or defined statically outside component
const API_CONFIG = { api: "https://api.domain" };
\`\`\`

#### 2. DOM Virtualization (Windowing)

When rendering transaction logs or complex tables, do not mount thousands of DOM elements. Instead, use a virtualization model where only the items currently visible inside the viewport are rendered.

- **How it works**: Pre-calculates positions and absolute offsets, then switches nodes dynamically on scroll.
- **Outcome**: Reduces DOM node counts from 5,000+ to just 20-30, cutting memory usage and paint times.

#### 3. Offloading with Web Workers

For computation-heavy operations (such as processing complex metrics, formatting CSV outputs, or client-side fuzzy searches), offload the process to a background thread to prevent blocking React's main execution loop.`,
      category: "Engineering",
      date: "Apr 12, 2026",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800&h=450",
      tags: ["React", "Performance", "Web Workers", "Optimization"],
      featured: false,
      likes: 62,
      comments: [
        { id: "c3", author: "Elena Rostova", text: "Windowing dropped our memory footprint by 70%. Essential reading for any dashboard engineer.", date: "Apr 14, 2026" }
      ]
    },
    {
      id: "blog3",
      title: "Why I Switched from REST to tRPC and gRPC",
      summary: "An architectural exploration of end-to-end type safety, code generation, and low-latency API communication for full-stack environments.",
      content: `### The Evolution of API Design

For years, REST was the undisputed king of client-server APIs. However, as applications grow in complexity and TypeScript becomes the industry standard, developers face a constant battle: keeping front-end types in sync with back-end models.

#### The Problem with REST

REST endpoints are contract-less by nature. If you change a database schema on the server, you must manually update client-side interfaces. Missing this step leads to silent failures, runtime crashes, and broken user experiences.

#### The Solution: End-to-End Type Safety

By leveraging **tRPC** for web clients and **gRPC** for microservice-to-microservice communication, we establish compile-time contracts.

1. **tRPC**: Shares the TypeScript compiler directly between backend router structures and frontend query hooks. Changing a schema instantly triggers a TypeScript compile-error on the client.
2. **gRPC & Protocol Buffers**: Generates optimized binary protocols. By compiling protoc definitions, we achieve ultra-low payload sizes, fast serialization, and multi-language support.

#### Architectural Benchmark

| Feature | REST | tRPC | gRPC |
| :--- | :--- | :--- | :--- |
| **Type Safety** | Manual / OpenAPI | End-to-End Native | Schema-driven Generated |
| **Serialization** | JSON (Slow/Heavy) | JSON (Flexible) | Protobuf (Binary/Fast) |
| **Streaming** | SSE / WebSockets | Supported | Native HTTP/2 |`,
      category: "Architecture",
      date: "Feb 08, 2026",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800&h=450",
      tags: ["tRPC", "gRPC", "APIs", "TypeScript", "Backend"],
      featured: false,
      likes: 47,
      comments: []
    },
    {
      id: "blog4",
      title: "Building Autonomous AI Workflows with Tool Calling",
      summary: "How to engineer deterministic guardrails, structured JSON outputs, and state recovery loops when orchestrating LLM agents in production.",
      content: `### Orchestrating AI Agents in Modern Web Apps

As generative AI models shift from simple chatbot completions to autonomous action-taking agents, developers need robust patterns to ensure predictable execution, schema adherence, and safe state mutations.

#### 1. Function Calling as Strict System Interfaces

Never let models generate freeform code or bash scripts without deterministic sandboxing. By defining strict JSON schemas for every callable tool, the model is constrained to valid input payloads that can be validated with schemas like Zod or type guards before execution.

#### 2. Self-Correction & Feedback Loops

When an agent tool call fails (e.g. database constraint error or network timeout), feeding the exact error code back into the conversation context enables the agent to self-heal and adjust parameters automatically.

- **Pre-execution validation**: Verify parameter ranges client-side.
- **Dry-run simulations**: Allow users to inspect mutation diffs before committing.
- **Audit Logging**: Store every tool dispatch for transparent observability.`,
      category: "AI & ML",
      date: "Jan 19, 2026",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800&h=450",
      tags: ["AI", "Gemini", "Agents", "Architecture"],
      featured: false,
      likes: 91,
      comments: [
        { id: "c4", author: "Alex Rivers", text: "The feedback loop concept is critical when dealing with transient API errors.", date: "Jan 21, 2026" }
      ]
    }
  ],
  education: [
    {
      id: "edu1",
      institution: "Stanford University",
      degree: "Master of Science in Computer Science",
      duration: "2018 - 2020",
      description: "Specialized in Human-Computer Interaction (HCI) and Intelligent Systems. Graduated with honors. Worked on modern UX research pipelines and distributed systems."
    },
    {
      id: "edu2",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science in Software Engineering",
      duration: "2014 - 2018",
      description: "Core curriculum in Algorithms, Database Systems, Computer Graphics, and UX Design. Co-president of the Berkeley Developer Society."
    }
  ],
  inboxMessages: []
};

// Local storage management helpers
const USERS_KEY = "portfolio_maker_accounts_v1";
const SESSION_KEY = "portfolio_maker_active_session_v1";

export function getAccounts(): Record<string, UserAccount> {
  const data = localStorage.getItem(USERS_KEY);
  if (!data) {
    // Seed standard initial user so demo data is accessible if needed
    const seed: Record<string, UserAccount> = {
      alex: {
        username: "alex",
        email: "alex.rivera.dev@gmail.com",
        passwordHash: "password123",
        portfolio: defaultPortfolioData
      }
    };
    localStorage.setItem(USERS_KEY, JSON.stringify(seed));
    return seed;
  }
  try {
    const parsed = JSON.parse(data);
    // Ensure default demo account has registered email if empty
    if (parsed.alex && !parsed.alex.email) {
      parsed.alex.email = "alex.rivera.dev@gmail.com";
      localStorage.setItem(USERS_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch (e) {
    return {};
  }
}

export function saveAccounts(accounts: Record<string, UserAccount>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(accounts));
}

export function getActiveSession(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function setActiveSession(username: string | null) {
  if (username) {
    localStorage.setItem(SESSION_KEY, username);
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

// Find an account by either Username or registered Gmail/Email
export function findAccountByIdentifier(identifier: string): UserAccount | undefined {
  if (!identifier) return undefined;
  const clean = identifier.trim().toLowerCase();
  const accounts = getAccounts();

  // 1. Direct username key match
  if (accounts[clean]) {
    return accounts[clean];
  }

  // 2. Iterate through accounts for case-insensitive username or email match
  for (const account of Object.values(accounts)) {
    if (account.username.toLowerCase() === clean) {
      return account;
    }
    if (account.email && account.email.trim().toLowerCase() === clean) {
      return account;
    }
    if (account.portfolio?.personalInfo?.email && account.portfolio.personalInfo.email.trim().toLowerCase() === clean) {
      return account;
    }
  }

  return undefined;
}

// Generate cryptographically secure 6-digit verification code
export function generateResetCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// Mask email for security display (e.g., suryatejaswikaki@gmail.com -> su********ki@gmail.com)
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email || '';
  const [user, domain] = email.split('@');
  if (user.length <= 3) {
    return `${user[0]}***@${domain}`;
  }
  const start = user.slice(0, 2);
  const end = user.slice(-2);
  const asterisks = '*'.repeat(Math.max(4, user.length - 4));
  return `${start}${asterisks}${end}@${domain}`;
}

// Store a password reset token for 10 minutes
export function storePasswordResetToken(identifier: string, code: string): { success: boolean; account?: UserAccount; error?: string } {
  const account = findAccountByIdentifier(identifier);
  if (!account) {
    return { success: false, error: `No registered account found for "${identifier}".` };
  }

  const accounts = getAccounts();
  const resolvedEmail = account.email || account.portfolio?.personalInfo?.email || `${account.username}@gmail.com`;

  account.email = resolvedEmail;
  account.resetToken = {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes validity
    requestedAt: Date.now(),
    email: resolvedEmail
  };

  accounts[account.username.toLowerCase()] = account;
  saveAccounts(accounts);

  return { success: true, account };
}

// Verify a 6-digit password reset code
export function verifyPasswordResetCode(identifier: string, code: string): { success: boolean; account?: UserAccount; error?: string } {
  const account = findAccountByIdentifier(identifier);
  if (!account) {
    return { success: false, error: 'Account not found.' };
  }

  if (!account.resetToken) {
    return { success: false, error: 'No active password reset request was found for this account. Please request a new code.' };
  }

  if (Date.now() > account.resetToken.expiresAt) {
    return { success: false, error: 'Verification code has expired (valid for 10 minutes). Please request a fresh code.' };
  }

  const cleanInput = code.replace(/\D/g, '').trim();
  const cleanStored = account.resetToken.code.replace(/\D/g, '').trim();

  if (cleanInput !== cleanStored) {
    return { success: false, error: 'Invalid verification code. Please check the code sent to your email.' };
  }

  return { success: true, account };
}

// Update account password and clear reset token
export function updateAccountPassword(username: string, newPassword: string): { success: boolean; error?: string } {
  const accounts = getAccounts();
  const cleanUser = username.trim().toLowerCase();
  const account = accounts[cleanUser] || findAccountByIdentifier(username);

  if (!account) {
    return { success: false, error: 'User account could not be found to update password.' };
  }

  if (!newPassword || newPassword.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long.' };
  }

  account.passwordHash = newPassword;
  delete account.resetToken;

  accounts[account.username.toLowerCase()] = account;
  saveAccounts(accounts);

  return { success: true };
}


export function sanitizePortfolioData(raw?: any): PortfolioData {
  if (!raw) return JSON.parse(JSON.stringify(defaultPortfolioData));

  return {
    personalInfo: {
      name: raw.personalInfo?.name || defaultPortfolioData.personalInfo.name,
      title: raw.personalInfo?.title || defaultPortfolioData.personalInfo.title,
      tagline: raw.personalInfo?.tagline || defaultPortfolioData.personalInfo.tagline,
      bio: raw.personalInfo?.bio || defaultPortfolioData.personalInfo.bio,
      objective: raw.personalInfo?.objective || defaultPortfolioData.personalInfo.objective,
      email: raw.personalInfo?.email || defaultPortfolioData.personalInfo.email,
      github: raw.personalInfo?.github || defaultPortfolioData.personalInfo.github,
      linkedin: raw.personalInfo?.linkedin || defaultPortfolioData.personalInfo.linkedin,
      twitter: raw.personalInfo?.twitter || defaultPortfolioData.personalInfo.twitter,
      location: raw.personalInfo?.location || defaultPortfolioData.personalInfo.location,
      avatar: raw.personalInfo?.avatar || defaultPortfolioData.personalInfo.avatar,
      resumeUrl: raw.personalInfo?.resumeUrl || defaultPortfolioData.personalInfo.resumeUrl,
    },
    stats: Array.isArray(raw.stats) && raw.stats.length > 0 ? raw.stats : defaultPortfolioData.stats,
    skills: Array.isArray(raw.skills) ? raw.skills : defaultPortfolioData.skills,
    projects: Array.isArray(raw.projects) ? raw.projects : defaultPortfolioData.projects,
    experiences: Array.isArray(raw.experiences) ? raw.experiences : defaultPortfolioData.experiences,
    certifications: Array.isArray(raw.certifications) ? raw.certifications : defaultPortfolioData.certifications,
    blogPosts: Array.isArray(raw.blogPosts) && raw.blogPosts.length > 0 ? raw.blogPosts : defaultPortfolioData.blogPosts,
    education: Array.isArray(raw.education) ? raw.education : defaultPortfolioData.education,
    inboxMessages: Array.isArray(raw.inboxMessages) ? raw.inboxMessages : [],
  };
}

export const sampleBlogPosts = defaultPortfolioData.blogPosts;

