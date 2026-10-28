import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  PortfolioData, 
  getAccounts, 
  saveAccounts, 
  getActiveSession, 
  setActiveSession, 
  defaultPortfolioData,
  sanitizePortfolioData
} from '../lib/portfolioStore';
import { BlogPost } from '../types';

interface PortfolioContextType {
  username: string | null;
  portfolioData: PortfolioData;
  isEditing: boolean;
  activeViewPage: string;
  login: (username: string) => void;
  logout: () => void;
  savePortfolio: (data: PortfolioData) => void;
  submitContactMessage: (senderName: string, senderEmail: string, message: string, recipientEmail?: string, subject?: string, securityHash?: string) => any;
  replyToInboxMessage: (id: string, replyMessage: string) => boolean;
  likeBlogPost: (postId: string) => void;
  addBlogPostComment: (postId: string, author: string, text: string) => void;
  addBlogPost: (post: BlogPost) => void;
  updateBlogPost: (post: BlogPost) => void;
  deleteBlogPost: (postId: string) => void;
  setIsEditing: (editing: boolean) => void;
  setActiveViewPage: (page: string) => void;
  isGuestMode: boolean;
  setGuestMode: (guest: boolean) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const [isGuestMode, setGuestMode] = useState<boolean>(false);
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(defaultPortfolioData);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeViewPage, setActiveViewPage] = useState<string>('home');

  // Load session on startup: directly show page preview home page
  useEffect(() => {
    const activeUser = getActiveSession();
    if (activeUser) {
      const accounts = getAccounts();
      if (accounts[activeUser]) {
        setUsername(activeUser);
        const userPortfolio = sanitizePortfolioData(accounts[activeUser].portfolio);
        setPortfolioData(userPortfolio);
        setIsEditing(false);
        setActiveViewPage('home');
      } else {
        setActiveSession(null);
      }
    }
  }, []);

  const login = (user: string) => {
    const accounts = getAccounts();
    if (accounts[user]) {
      setUsername(user);
      const userPortfolio = sanitizePortfolioData(accounts[user].portfolio);
      setPortfolioData(userPortfolio);
      setIsEditing(false);
      setActiveViewPage('home');
      setGuestMode(false);
    }
  };

  const logout = () => {
    setActiveSession(null);
    setUsername(null);
    setGuestMode(false);
    setIsEditing(false);
    setActiveViewPage('home');
    setPortfolioData(defaultPortfolioData);
  };

  const savePortfolio = (updatedData: PortfolioData) => {
    setPortfolioData(updatedData);
    if (username && !isGuestMode) {
      const accounts = getAccounts();
      if (accounts[username]) {
        accounts[username].portfolio = updatedData;
        saveAccounts(accounts);
      }
    }
  };

  const likeBlogPost = (postId: string) => {
    const updatedPosts = portfolioData.blogPosts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          likes: (post.likes || 0) + 1
        };
      }
      return post;
    });
    const updated = {
      ...portfolioData,
      blogPosts: updatedPosts
    };
    savePortfolio(updated);
  };

  const addBlogPostComment = (postId: string, author: string, text: string) => {
    const newComment = {
      id: 'cmt_' + Date.now(),
      author: author.trim() || 'Anonymous Reader',
      text: text.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    const updatedPosts = portfolioData.blogPosts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [newComment, ...(post.comments || [])]
        };
      }
      return post;
    });

    const updated = {
      ...portfolioData,
      blogPosts: updatedPosts
    };
    savePortfolio(updated);
  };

  const addBlogPost = (post: BlogPost) => {
    const updatedPosts = [post, ...(portfolioData.blogPosts || [])];
    const updated = {
      ...portfolioData,
      blogPosts: updatedPosts
    };
    savePortfolio(updated);
  };

  const updateBlogPost = (post: BlogPost) => {
    const updatedPosts = (portfolioData.blogPosts || []).map(p => p.id === post.id ? post : p);
    const updated = {
      ...portfolioData,
      blogPosts: updatedPosts
    };
    savePortfolio(updated);
  };

  const deleteBlogPost = (postId: string) => {
    const updatedPosts = (portfolioData.blogPosts || []).filter(p => p.id !== postId);
    const updated = {
      ...portfolioData,
      blogPosts: updatedPosts
    };
    savePortfolio(updated);
  };

  const submitContactMessage = (
    senderName: string, 
    senderEmail: string, 
    message: string, 
    recipientEmail?: string, 
    subject?: string,
    securityHash?: string
  ) => {
    const timestamp = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const newMessage = {
      id: 'msg_' + Date.now(),
      senderName,
      senderEmail,
      recipientEmail: recipientEmail || portfolioData.personalInfo.email,
      subject: subject || 'Portfolio Inquiry',
      message,
      timestamp,
      status: 'delivered' as const,
      securityHash: securityHash || ('SEC-' + Math.random().toString(36).substring(2, 8).toUpperCase())
    };

    const updatedData = {
      ...portfolioData,
      inboxMessages: [newMessage, ...(portfolioData.inboxMessages || [])]
    };

    savePortfolio(updatedData);
    return newMessage;
  };

  const replyToInboxMessage = (id: string, replyMessage: string): boolean => {
    const timestamp = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const updatedMessages = (portfolioData.inboxMessages || []).map(m => {
      if (m.id === id) {
        return {
          ...m,
          status: 'replied' as const,
          replyMessage,
          replyTimestamp: timestamp
        };
      }
      return m;
    });

    const updatedData = {
      ...portfolioData,
      inboxMessages: updatedMessages
    };

    savePortfolio(updatedData);
    return true;
  };

  return (
    <PortfolioContext.Provider value={{
      username,
      portfolioData,
      isEditing,
      activeViewPage,
      login,
      logout,
      savePortfolio,
      submitContactMessage,
      replyToInboxMessage,
      likeBlogPost,
      addBlogPostComment,
      addBlogPost,
      updateBlogPost,
      deleteBlogPost,
      setIsEditing,
      setActiveViewPage,
      isGuestMode,
      setGuestMode,
    }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used inside PortfolioProvider');
  }
  return context;
}
