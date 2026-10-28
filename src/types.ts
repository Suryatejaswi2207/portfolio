export interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'databases' | 'tools';
  percentage: number;
  iconName: string; // Corresponding Lucide icon name
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: string;
  tags: string[];
  image: string;
  github: string;
  demo: string;
  featured?: boolean;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  duration: string;
  responsibilities: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  duration: string;
  description?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  verificationUrl: string;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
}

export interface BlogComment {
  id: string;
  author: string;
  text: string;
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string; // Markdown or text
  category: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
  featured?: boolean;
  likes?: number;
  comments?: BlogComment[];
}

export interface InboxMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  recipientEmail?: string;
  subject?: string;
  message: string;
  timestamp: string;
  status?: 'delivered' | 'read' | 'replied';
  replyMessage?: string;
  replyTimestamp?: string;
  securityHash?: string;
}
