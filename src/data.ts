import { Skill, Project, Experience, Education, Certification, Testimonial, BlogPost } from './types';
import { sampleBlogPosts } from './lib/portfolioStore';

export const personalInfo = {
  name: "Alex Rivera",
  title: "Senior Full-Stack & Creative Engineer",
  tagline: "I build high-performance, visually stunning web experiences that bridge the gap between complex engineering and elegant design.",
  bio: "Hello! I am a passionate software engineer based in San Francisco, CA. With over 6 years of experience in the industry, I specialize in crafting ultra-responsive interfaces, serverless architectures, and AI-integrated applications. I thrive on solving complex system design challenges while keeping a obsessive focus on visual fidelity, micro-animations, and outstanding user experiences inspired by modern giants like Apple and Stripe.",
  objective: "To leverage my expertise in full-stack web applications, fluid animations, and robust system architectures to lead the development of next-generation user experiences that solve real-world problems and delight millions of users globally.",
  email: "alex.rivera.dev@gmail.com",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  twitter: "https://twitter.com",
  location: "San Francisco, California",
  avatar: "https://picsum.photos/seed/alexrivera/400/400",
  resumeUrl: "#", // Standard print/download triggers
};

export const stats = [
  { value: 6, suffix: "+", label: "Years Experience" },
  { value: 24, suffix: "", label: "Projects Completed" },
  { value: 98, suffix: "%", label: "Client Satisfaction" },
  { value: 420, suffix: "k+", label: "Lines of Code" },
];

export const skills: Skill[] = [
  // Frontend
  { name: "React / Next.js", category: "frontend", percentage: 95, iconName: "Code2" },
  { name: "TypeScript", category: "frontend", percentage: 92, iconName: "FileCode" },
  { name: "Tailwind CSS", category: "frontend", percentage: 98, iconName: "Palette" },
  { name: "Framer Motion", category: "frontend", percentage: 90, iconName: "Sparkles" },
  { name: "Vue.js", category: "frontend", percentage: 75, iconName: "Layers" },

  // Backend
  { name: "Node.js & Express", category: "backend", percentage: 88, iconName: "Server" },
  { name: "Python & FastAPI", category: "backend", percentage: 80, iconName: "Terminal" },
  { name: "GraphQL & gRPC", category: "backend", percentage: 82, iconName: "GitMerge" },
  { name: "NestJS", category: "backend", percentage: 78, iconName: "Cpu" },

  // Databases
  { name: "PostgreSQL", category: "databases", percentage: 85, iconName: "Database" },
  { name: "MongoDB", category: "databases", percentage: 82, iconName: "FolderOpen" },
  { name: "Redis Cache", category: "databases", percentage: 80, iconName: "Zap" },
  { name: "Firebase / Firestore", category: "databases", percentage: 85, iconName: "Flame" },

  // Tools
  { name: "Docker & K8s", category: "tools", percentage: 75, iconName: "Container" },
  { name: "AWS Services", category: "tools", percentage: 80, iconName: "Cloud" },
  { name: "Vite & Webpack", category: "tools", percentage: 92, iconName: "Hammer" },
  { name: "Git / CI/CD", category: "tools", percentage: 90, iconName: "GitBranch" },
  { name: "Figma (UI/UX)", category: "tools", percentage: 85, iconName: "PenTool" },
];

export const experiences: Experience[] = [
  {
    id: "exp1",
    company: "Stripe",
    role: "Senior Full-Stack Engineer",
    location: "San Francisco, CA",
    duration: "Jan 2024 - Present",
    responsibilities: [
      "Architected and deployed responsive dashboard components using React and custom component systems, serving over 500k global merchants.",
      "Optimized load times and rendering cycles of transaction logs by 35%, implementing windowing/virtualization and caching strategies.",
      "Led a cross-functional squad of 5 developers to roll out localized checkout flows, increasing conversion rates across Europe by 4.2%."
    ]
  },
  {
    id: "exp2",
    company: "Apple",
    role: "Software Engineer II",
    location: "Cupertino, CA",
    duration: "Aug 2022 - Dec 2023",
    responsibilities: [
      "Designed immersive marketing landing pages for key product releases, applying high-performance scroll-driven Canvas animations.",
      "Developed secure serverless microservices handling millions of active API transactions with 99.99% operational uptime.",
      "Refactored modular internal UI toolkits, promoting components reusability and establishing seamless dark/light styling tokens."
    ]
  },
  {
    id: "exp3",
    company: "Vercel",
    role: "Frontend Developer",
    location: "Remote",
    duration: "Jun 2020 - Jul 2022",
    responsibilities: [
      "Collaborated on Next.js core ecosystem features, enhancing dynamic static site generation (SSG) pipelines.",
      "Built custom integrations and deployment templates, helping thousands of engineers start building premium apps instantly.",
      "Advocated for web accessibility standards (WCAG 2.1 AA), rewriting legacy UI modals to support full screen reader and keyboard navigation."
    ]
  }
];

export const education: Education[] = [
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
];

export const projects: Project[] = [
  {
    id: "proj1",
    title: "Apex Revenue Dashboard",
    description: "An ultra-clean Stripe-inspired dashboard with interactive analytics, subscription graphs, and transaction management.",
    longDescription: "Apex is a high-fidelity SaaS analytics dashboard focusing on extreme speed and elegant UI layout. It processes simulated merchant transactional data, generating interactive visual line/bar graphs, custom subscription tiers controllers, and instant CSV transaction search. Built with a heavy influence of Apple's clean design system, it uses premium custom gradient cards and subtle glassmorphic sheets.",
    category: "Fintech",
    tags: ["React", "TypeScript", "Tailwind CSS", "Recharts", "Framer Motion"],
    image: "https://picsum.photos/seed/dashboard/800/600",
    github: "https://github.com",
    demo: "https://github.com",
    featured: true
  },
  {
    id: "proj2",
    title: "Scribe AI Workspace",
    description: "AI-driven collaborative doc organizer utilizing advanced semantic models for auto-summarization and categorization.",
    longDescription: "Scribe is a rich document workspace integrated with intelligent AI agents. It allows users to write markdown, capture rapid meeting notes, and use Gemini-powered commands to instantaneously summarize transcripts, generate code blocks, or auto-categorize notes into custom-filtered tags. Highlights include a custom floating commands menu, dynamic markdown parser, and client-side indexing.",
    category: "AI & ML",
    tags: ["React", "Tailwind CSS", "Gemini SDK", "LocalForage", "Lucide Icons"],
    image: "https://picsum.photos/seed/scribe/800/600",
    github: "https://github.com",
    demo: "https://github.com",
    featured: true
  },
  {
    id: "proj3",
    title: "Zenith Spatial Whiteboard",
    description: "A collaborative real-time canvas whiteboard rendering millions of nodes smoothly using hardware-accelerated WebGL.",
    longDescription: "Zenith is a creative canvas application that redefines digital brainstorming. Using low-level Canvas and WebGL integrations, users can drag, connect, and draw shapes effortlessly. Framer Motion is utilized to manage smooth fluid pan-and-zoom actions, custom slide-out bento setting panels, and interactive layers toggling.",
    category: "Creative Tech",
    tags: ["React", "HTML5 Canvas", "Framer Motion", "Tailwind CSS", "WebSockets"],
    image: "https://picsum.photos/seed/canvas/800/600",
    github: "https://github.com",
    demo: "https://github.com",
    featured: false
  },
  {
    id: "proj4",
    title: "KubeFlow Container Visualizer",
    description: "Real-time devops orchestrator providing interactive visual node mapping and live CPU/Memory utilization logs.",
    longDescription: "KubeFlow is a gorgeous visualization console for containerized environments. It parses configuration files (like docker-compose or Kubernetes YAMLs) and displays an interactive network map of microservices, checking active states, simulating load balancing, and piping mock shell logs. Provides developers a cohesive interface to debug latency bottlenecks.",
    category: "DevOps",
    tags: ["React", "D3.js", "Docker Config", "TypeScript", "Tailwind CSS"],
    image: "https://picsum.photos/seed/devops/800/600",
    github: "https://github.com",
    demo: "https://github.com",
    featured: false
  }
];

export const certifications: Certification[] = [
  {
    id: "cert1",
    title: "AWS Solutions Architect Associate",
    issuer: "Amazon Web Services (AWS)",
    date: "Oct 2024",
    verificationUrl: "https://aws.amazon.com",
    image: "https://picsum.photos/seed/aws-cert/400/300"
  },
  {
    id: "cert2",
    title: "Professional Cloud Architect",
    issuer: "Google Cloud Platform (GCP)",
    date: "May 2025",
    verificationUrl: "https://cloud.google.com",
    image: "https://picsum.photos/seed/gcp-cert/400/300"
  },
  {
    id: "cert3",
    title: "Meta Front-End Developer Professional",
    issuer: "Coursera & Meta",
    date: "Dec 2023",
    verificationUrl: "https://coursera.org",
    image: "https://picsum.photos/seed/meta-cert/400/300"
  }
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Sarah Jenkins",
    role: "Engineering Director",
    company: "Stripe",
    content: "Alex is an exceptionally talented developer who operates at the intersection of design and robust architecture. He doesn't just build components—he engineers polished user experiences. His attention to micro-animations and component speed elevated our main product landing dashboard substantially.",
    avatar: "https://picsum.photos/seed/sarah/150/150"
  },
  {
    id: "t2",
    name: "Marcus Chen",
    role: "Senior Product Manager",
    company: "Apple",
    content: "Working with Alex was a breath of fresh air. He possesses a rare aesthetic sense backed by deep technical execution. When we requested high-performance WebGL visualizers for our hardware launch campaigns, he delivered a solution that was optimized, responsive, and breathtakingly elegant.",
    avatar: "https://picsum.photos/seed/marcus/150/150"
  },
  {
    id: "t3",
    name: "Elena Rostova",
    role: "Co-Founder & CTO",
    company: "ScribeAI",
    content: "Alex joined us as an advisory consultant and bootstrapped our modular React whiteboard in weeks. His architectural instincts saved us months of development. He is highly collaborative, writes exceptionally clean TypeScript, and remains committed to the highest standards of code accessibility.",
    avatar: "https://picsum.photos/seed/elena/150/150"
  }
];

export const blogPosts: BlogPost[] = sampleBlogPosts;
