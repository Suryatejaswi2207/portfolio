import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Clock, ArrowRight, X, Heart, MessageCircle, 
  Share2, Tag, Search, Filter, Sparkles, Check, Copy, 
  ChevronLeft, ChevronRight, BookOpen, Send, Type, ThumbsUp,
  Mic, MicOff, Plus, Edit2, AlertCircle, Volume2, Globe, Radio,
  Code, List, Hash, Bold, Italic, Trash2, Save, FileText
} from 'lucide-react';
import { useTheme } from './ThemeContext';
import { usePortfolio } from './PortfolioContext';
import { BlogPost, BlogComment } from '../types';
import { useSpeechRecognition } from '../lib/useSpeechRecognition';

export default function Blog() {
  const { activeAccent } = useTheme();
  const { portfolioData, likeBlogPost, addBlogPostComment, addBlogPost, updateBlogPost } = usePortfolio();
  const { blogPosts, personalInfo } = portfolioData;

  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'likes' | 'readTime'>('newest');
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  // Blog Editor & Dictation State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editorTitle, setEditorTitle] = useState('');
  const [editorCategory, setEditorCategory] = useState('Frontend');
  const [editorSummary, setEditorSummary] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [editorImage, setEditorImage] = useState('');
  const [editorTags, setEditorTags] = useState('React, Architecture, UI');
  const [editorReadTime, setEditorReadTime] = useState('5 min read');
  const [saveSuccessNotification, setSaveSuccessNotification] = useState(false);
  const [editorPreviewMode, setEditorPreviewMode] = useState(false);

  const editorContentRef = useRef<HTMLTextAreaElement>(null);

  // Speech Recognition Hook for Dictating Post Content
  const handleDictatedChunk = (chunk: string, isFinal: boolean) => {
    if (isFinal) {
      setEditorContent(prev => {
        if (!prev || prev.trim() === '') {
          return chunk.trim();
        }
        const needsSpace = !prev.endsWith(' ') && !prev.endsWith('\n');
        return prev + (needsSpace ? ' ' : '') + chunk.trim();
      });
    }
  };

  const {
    isSupported: isSpeechSupported,
    isListening: isDictating,
    hasMicPermission,
    interimTranscript,
    errorMessage: speechError,
    setErrorMessage: setSpeechError,
    startListening: startDictation,
    stopListening: stopDictation,
    activeLang: speechLang,
    setActiveLang: setSpeechLang
  } = useSpeechRecognition({
    onTranscriptChange: handleDictatedChunk
  });

  const toggleDictation = () => {
    if (isDictating) {
      stopDictation();
    } else {
      startDictation();
    }
  };

  const openNewPostEditor = () => {
    setEditingPostId(null);
    setEditorTitle('');
    setEditorCategory('Engineering');
    setEditorSummary('');
    setEditorContent('');
    setEditorTags('TypeScript, Web, React');
    setEditorReadTime('4 min read');
    setEditorImage('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800&h=450');
    setIsEditorOpen(true);
  };

  const openEditPostEditor = (post: BlogPost) => {
    setEditingPostId(post.id);
    setEditorTitle(post.title);
    setEditorCategory(post.category);
    setEditorSummary(post.summary);
    setEditorContent(post.content);
    setEditorTags((post.tags || []).join(', '));
    setEditorReadTime(post.readTime);
    setEditorImage(post.image);
    setIsEditorOpen(true);
  };

  const insertMarkdownToContent = (prefix: string, suffix: string = '') => {
    const textarea = editorContentRef.current;
    if (!textarea) {
      setEditorContent(prev => prev + '\n' + prefix + suffix);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = prefix + selected + suffix;
    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setEditorContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const handleSaveBlogPost = (e: FormEvent) => {
    e.preventDefault();
    if (!editorTitle.trim() || !editorContent.trim()) return;

    if (isDictating) {
      stopDictation();
    }

    const tagList = editorTags.split(',').map(t => t.trim()).filter(Boolean);

    if (editingPostId) {
      const updated: BlogPost = {
        id: editingPostId,
        title: editorTitle.trim(),
        category: editorCategory.trim() || 'General',
        summary: editorSummary.trim() || editorTitle.trim(),
        content: editorContent.trim(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        readTime: editorReadTime.trim() || '4 min read',
        image: editorImage.trim() || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800&h=450',
        tags: tagList.length > 0 ? tagList : ['Engineering'],
        likes: selectedPost?.likes || 0,
        comments: selectedPost?.comments || []
      };
      updateBlogPost(updated);
      if (selectedPost && selectedPost.id === editingPostId) {
        setSelectedPost(updated);
      }
    } else {
      const newPost: BlogPost = {
        id: 'post_' + Date.now(),
        title: editorTitle.trim(),
        category: editorCategory.trim() || 'General',
        summary: editorSummary.trim() || editorTitle.trim(),
        content: editorContent.trim(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        readTime: editorReadTime.trim() || '4 min read',
        image: editorImage.trim() || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800&h=450',
        tags: tagList.length > 0 ? tagList : ['Engineering'],
        featured: false,
        likes: 0,
        comments: []
      };
      addBlogPost(newPost);
    }

    setSaveSuccessNotification(true);
    setTimeout(() => {
      setSaveSuccessNotification(false);
      setIsEditorOpen(false);
    }, 1200);
  };

  // New comment form state inside reader
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  const articleRef = useRef<HTMLDivElement>(null);

  // Monitor scroll height inside active article to drive reading progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const el = articleRef.current;
      if (el) {
        const totalHeight = el.scrollHeight - el.clientHeight;
        if (totalHeight > 0) {
          const progress = (el.scrollTop / totalHeight) * 100;
          setReadingProgress(progress);
        }
      }
    };

    const el = articleRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (el) {
        el.removeEventListener('scroll', handleScroll);
      }
    };
  }, [selectedPost]);

  // Extract all categories
  const categories: string[] = ['all', ...Array.from(new Set<string>(blogPosts.map(p => p.category)))];

  // Extract all unique tags
  const allTags = Array.from(new Set(blogPosts.flatMap(p => p.tags || [])));

  // Filter posts
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags && post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCategory = selectedCategory === 'all' || post.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesTag = !selectedTag || (post.tags && post.tags.includes(selectedTag));

    return matchesSearch && matchesCategory && matchesTag;
  });

  // Sort posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'likes') {
      return (b.likes || 0) - (a.likes || 0);
    }
    if (sortBy === 'readTime') {
      const getMin = (r: string) => parseInt(r) || 0;
      return getMin(a.readTime) - getMin(b.readTime);
    }
    // Default newest by id or index
    return 0;
  });

  // Copy code helper
  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  // Share article helper
  const handleShare = (post: BlogPost) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.summary,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShareLink(true);
      setTimeout(() => setCopiedShareLink(false), 2500);
    }
  };

  // Like article helper
  const handleLike = (postId: string) => {
    if (!likedPosts[postId]) {
      likeBlogPost(postId);
      setLikedPosts(prev => ({ ...prev, [postId]: true }));
      // If currently open post is the liked one, update local view
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(prev => prev ? { ...prev, likes: (prev.likes || 0) + 1 } : null);
      }
    }
  };

  // Comment submit helper
  const handleAddComment = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !commentText.trim()) return;

    const author = commentName.trim() || 'Reader';
    addBlogPostComment(selectedPost.id, author, commentText.trim());

    const newCommentObj: BlogComment = {
      id: 'cmt_' + Date.now(),
      author,
      text: commentText.trim(),
      date: 'Just now'
    };

    setSelectedPost(prev => prev ? {
      ...prev,
      comments: [newCommentObj, ...(prev.comments || [])]
    } : null);

    setCommentText('');
    setCommentSubmitted(true);
    setTimeout(() => setCommentSubmitted(false), 3000);
  };

  // Next / Previous Navigation inside reader
  const handleNavigatePost = (direction: 'next' | 'prev') => {
    if (!selectedPost) return;
    const currentIndex = blogPosts.findIndex(p => p.id === selectedPost.id);
    if (currentIndex === -1) return;

    if (direction === 'next' && currentIndex < blogPosts.length - 1) {
      setSelectedPost(blogPosts[currentIndex + 1]);
      if (articleRef.current) articleRef.current.scrollTop = 0;
    } else if (direction === 'prev' && currentIndex > 0) {
      setSelectedPost(blogPosts[currentIndex - 1]);
      if (articleRef.current) articleRef.current.scrollTop = 0;
    }
  };

  // Extract headings for Table of Contents
  const getHeadings = (content: string) => {
    const lines = content.split('\n');
    return lines
      .filter(l => l.startsWith('### '))
      .map(l => l.replace('### ', '').trim());
  };

  // Rich markdown parser/renderer
  const renderMarkdownContent = (text: string) => {
    let codeBlockCount = 0;
    return text.split('\n\n').map((para, i) => {
      if (para.startsWith('### ')) {
        const title = para.replace('### ', '');
        return (
          <h3 
            key={i} 
            id={`heading-${i}`}
            className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-10 mb-4 tracking-tight border-b border-slate-200/20 dark:border-white/5 pb-2 scroll-mt-6"
          >
            {title}
          </h3>
        );
      }
      if (para.startsWith('#### ')) {
        return (
          <h4 key={i} className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200 mt-7 mb-3">
            {para.replace('#### ', '')}
          </h4>
        );
      }
      if (para.startsWith('```')) {
        const codeIndex = codeBlockCount++;
        const lines = para.split('\n');
        const firstLine = lines[0].replace('```', '').trim() || 'code';
        const codeLines = lines.slice(1, -1).join('\n');
        return (
          <div key={i} className="my-6 rounded-2xl overflow-hidden border border-slate-700/50 bg-slate-950 shadow-xl">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 text-[11px] font-mono text-slate-400">
              <span className="uppercase tracking-widest">{firstLine}</span>
              <button
                type="button"
                onClick={() => handleCopyCode(codeLines, codeIndex)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-[10px]"
              >
                {copiedCodeIndex === codeIndex ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 sm:p-5 text-slate-200 text-xs sm:text-sm font-mono overflow-x-auto leading-relaxed">
              <code>{codeLines}</code>
            </pre>
          </div>
        );
      }
      if (para.startsWith('- ')) {
        return (
          <ul key={i} className="list-disc list-outside pl-6 my-4 space-y-2 text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
            {para.split('\n').map((li, idx) => (
              <li key={idx}>{li.replace('- ', '')}</li>
            ))}
          </ul>
        );
      }
      if (para.startsWith('|')) {
        // Table Parser
        const rows = para.split('\n').filter(r => r.trim() !== '');
        return (
          <div key={i} className="overflow-x-auto my-6 border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm bg-white/40 dark:bg-slate-900/40">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <tbody>
                {rows.map((row, rowIdx) => {
                  const cells = row.split('|').filter((_, cIdx) => cIdx > 0 && cIdx < row.split('|').length - 1);
                  const isHeader = rowIdx === 0;
                  const isSeparator = rowIdx === 1;
                  if (isSeparator) return null;

                  return (
                    <tr 
                      key={rowIdx} 
                      className={isHeader 
                        ? 'bg-slate-100/80 dark:bg-slate-800/80 font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10' 
                        : 'border-b border-slate-200/50 dark:border-white/5 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
                      }
                    >
                      {cells.map((cell, cellIdx) => (
                        <td key={cellIdx} className="p-3.5 sm:p-4 text-slate-700 dark:text-slate-300">
                          {cell.trim()}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }
      return (
        <p key={i} className={`leading-relaxed text-slate-600 dark:text-slate-300 mb-5 ${fontSize === 'large' ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
          {para}
        </p>
      );
    });
  };

  const featuredPost = blogPosts.find(p => p.featured) || blogPosts[0];

  return (
    <section id="blog" className="py-20 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative min-h-screen">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Developer Insights & Engineering Notes</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-900 dark:text-white mb-4">
            Writings & Knowledge
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Deep dives into frontend architectures, animation physics, system design, and AI tooling.
          </p>
        </div>

        {/* Search, Category, and Sorting Controls */}
        <div className="flex flex-col gap-5 mb-12">
          
          {/* Top Bar: Search + Sort Dropdown */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles by title, tags, or topic..."
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 text-xs font-medium text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort & Post Counter */}
            <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
              <span className="text-xs font-mono text-slate-400">
                Showing <strong className="text-slate-800 dark:text-white">{sortedPosts.length}</strong> {sortedPosts.length === 1 ? 'article' : 'articles'}
              </span>

              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-sm">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent border-0 focus:outline-none text-xs font-medium cursor-pointer"
                >
                  <option value="newest" className="dark:bg-slate-900 text-slate-900 dark:text-white">Newest First</option>
                  <option value="likes" className="dark:bg-slate-900 text-slate-900 dark:text-white">Most Liked</option>
                  <option value="readTime" className="dark:bg-slate-900 text-slate-900 dark:text-white">Shortest Read</option>
                </select>
              </div>

              {/* Write & Dictate Article Button */}
              <button
                type="button"
                onClick={openNewPostEditor}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all cursor-pointer shrink-0"
                title="Write a new blog post and dictate using microphone"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Write / Dictate</span>
                <span className="flex items-center justify-center w-5 h-5 rounded-lg bg-white/20 text-white">
                  <Mic className="w-3 h-3" />
                </span>
              </button>
            </div>
          </div>

          {/* Categories Horizontal Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((category) => {
              const isSelected = selectedCategory.toLowerCase() === category.toLowerCase();
              const count = category === 'all' 
                ? blogPosts.length 
                : blogPosts.filter(p => p.category.toLowerCase() === category.toLowerCase()).length;

              return (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSelectedTag(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-200 flex items-center gap-1.5 cursor-pointer capitalize ${
                    isSelected
                      ? `${activeAccent.primaryBg} shadow-md scale-102`
                      : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300'
                  }`}
                >
                  <span>{category}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-black/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Tag Pills Row (if tags exist) */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-bold font-mono uppercase text-slate-400 mr-1 flex items-center gap-1">
                <Tag className="w-3 h-3" />
                <span>Tags:</span>
              </span>
              {allTags.map((tag) => {
                const isSelected = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(isSelected ? null : tag)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-bold shadow-sm'
                        : 'bg-slate-200/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>#{tag}</span>
                    {isSelected && <X className="w-2.5 h-2.5 ml-0.5" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Featured Spotlight Card (Only when viewing all posts and no search query) */}
        {!searchQuery && selectedCategory === 'all' && !selectedTag && featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => setSelectedPost(featuredPost)}
            className="mb-12 rounded-3xl overflow-hidden bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group grid grid-cols-1 lg:grid-cols-12 backdrop-blur-sm"
          >
            {/* Image Col */}
            <div className="lg:col-span-7 relative aspect-video lg:aspect-auto overflow-hidden bg-slate-900">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800&h=450';
                }}
              />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-indigo-600/90 text-white text-[10px] font-mono font-bold tracking-wider uppercase backdrop-blur-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Featured Post</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-slate-300 text-[10px] font-mono font-bold tracking-wider uppercase backdrop-blur-md">
                  {featuredPost.category}
                </span>
              </div>
            </div>

            {/* Content Col */}
            <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{featuredPost.date}</span>
                  </div>
                  <span>&bull;</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{featuredPost.readTime}</span>
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight group-hover:text-indigo-500 transition-colors">
                  {featuredPost.title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-4 line-clamp-3">
                  {featuredPost.summary}
                </p>

                {/* Tags */}
                {featuredPost.tags && (
                  <div className="flex flex-wrap gap-1.5 mt-5">
                    {featuredPost.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-200/50 dark:border-white/5 mt-6">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-500 group-hover:gap-3 transition-all">
                  <span>Read Full Article</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-3 text-slate-400 text-xs font-mono">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    <span>{featuredPost.likes || 0}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{featuredPost.comments?.length || 0}</span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty Search State */}
        {sortedPosts.length === 0 && (
          <div className="text-center py-20 px-6 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 max-w-lg mx-auto">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">No articles found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              No published posts matched your search filters or tags.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedTag(null);
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Blog Post Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              onClick={() => setSelectedPost(post)}
              className="group flex flex-col bg-white dark:bg-slate-900/70 border border-slate-200/80 dark:border-white/10 rounded-3xl overflow-hidden hover:shadow-2xl hover:border-indigo-500/30 transition-all cursor-pointer h-[500px]"
            >
              {/* Cover Image Container */}
              <div className="relative aspect-video overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0">
                <img
                  src={post.image}
                  alt={post.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800&h=450';
                  }}
                />
                <span className="absolute top-3.5 left-3.5 px-2.5 py-1 bg-slate-950/80 backdrop-blur-md text-[10px] font-mono font-bold tracking-wider uppercase text-white rounded-lg border border-white/10">
                  {post.category}
                </span>

                {post.featured && (
                  <span className="absolute top-3.5 right-3.5 p-1.5 bg-amber-500 text-white rounded-lg shadow-sm" title="Featured Article">
                    <Sparkles className="w-3 h-3" />
                  </span>
                )}
              </div>

              {/* Text content block */}
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 font-mono mb-3 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{post.date}</span>
                    </div>
                    <span>&bull;</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  <h4 className="text-lg font-black tracking-tight text-slate-800 dark:text-white line-clamp-2 leading-snug group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                    {post.title}
                  </h4>
                  
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-3 line-clamp-3">
                    {post.summary}
                  </p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          #{tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="text-[9px] font-mono text-slate-400 self-center">
                          +{post.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Bar */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5 mt-4">
                  <div className="flex items-center gap-1 text-xs font-bold text-indigo-500 group-hover:gap-2 transition-all">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-rose-500" />
                      <span>{post.likes || 0}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>{post.comments?.length || 0}</span>
                    </span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Reader Slide-Out Drawer Viewport */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end" id="blog-reader-overlay">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
            />

            {/* Slide-out Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative w-full max-w-3xl h-full bg-white dark:bg-slate-950 shadow-2xl flex flex-col border-l border-slate-200 dark:border-white/10 z-10"
            >
              
              {/* Header (Reader Actions) */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 px-6 py-4 bg-slate-50 dark:bg-slate-900/80 shrink-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Reading Mode</span>
                  </span>
                  
                  {/* Font Size Toggle */}
                  <button
                    onClick={() => setFontSize(prev => prev === 'normal' ? 'large' : 'normal')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-200/60 dark:bg-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                    title="Toggle Text Size"
                  >
                    <Type className="w-3 h-3" />
                    <span>{fontSize === 'normal' ? 'Standard' : 'Large'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Edit / Dictate Button */}
                  <button
                    onClick={() => {
                      if (selectedPost) {
                        openEditPostEditor(selectedPost);
                      }
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition-colors cursor-pointer"
                    title="Edit and Dictate into this article"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Edit / Dictate</span>
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={() => handleShare(selectedPost)}
                    className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer relative"
                    title="Share Article"
                  >
                    <Share2 className="w-4 h-4" />
                    {copiedShareLink && (
                      <span className="absolute -bottom-8 right-0 px-2 py-1 bg-slate-900 text-white text-[10px] rounded shadow-lg font-mono whitespace-nowrap">
                        Copied link!
                      </span>
                    )}
                  </button>

                  {/* Close Reader */}
                  <button
                    onClick={() => setSelectedPost(null)}
                    className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                    title="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Reading Progress Indicator */}
              <div className="w-full h-1 bg-slate-100 dark:bg-slate-900 shrink-0">
                <div
                  className={`h-full bg-gradient-to-r ${activeAccent.gradientFrom} ${activeAccent.gradientTo}`}
                  style={{ width: `${readingProgress}%` }}
                />
              </div>

              {/* Reader Body Canvas */}
              <div
                ref={articleRef}
                className="flex-1 overflow-y-auto px-6 sm:px-12 py-8"
              >
                {/* Article Header info */}
                <div className="mb-6 pb-6 border-b border-slate-200/60 dark:border-white/10">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold font-mono tracking-wider uppercase">
                      {selectedPost.category}
                    </span>
                    <span className="text-slate-400 text-xs font-mono">&bull;</span>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{selectedPost.date}</span>
                    <span className="text-slate-400 text-xs font-mono">&bull;</span>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{selectedPost.readTime}</span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                    {selectedPost.title}
                  </h1>

                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-4 leading-relaxed font-medium">
                    {selectedPost.summary}
                  </p>

                  {/* Tags */}
                  {selectedPost.tags && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {selectedPost.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Table of Contents jump chips if multiple sections */}
                {getHeadings(selectedPost.content).length > 1 && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 mb-8">
                    <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-slate-400 block mb-2">
                      In this article
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {getHeadings(selectedPost.content).map((heading, hIdx) => (
                        <span
                          key={hIdx}
                          className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-white/5 text-[11px] font-semibold text-slate-700 dark:text-slate-300"
                        >
                          {heading}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cover graphic */}
                <div className="rounded-3xl overflow-hidden aspect-video mb-8 bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 shadow-lg">
                  <img
                    src={selectedPost.image}
                    alt={selectedPost.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800&h=450';
                    }}
                  />
                </div>

                {/* Custom Parsed Render Content */}
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  {renderMarkdownContent(selectedPost.content)}
                </div>

                {/* Author footer note & reactions */}
                <div className="mt-14 pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={personalInfo.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100"}
                      alt={personalInfo.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500/30"
                    />
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">WRITTEN BY</span>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{personalInfo.name || "Alex Rivera"}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{personalInfo.title || "Full-Stack Engineer"}</p>
                    </div>
                  </div>

                  {/* Interactive Like & Share Buttons */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleLike(selectedPost.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        likedPosts[selectedPost.id]
                          ? 'bg-rose-500 text-white shadow-md'
                          : 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${likedPosts[selectedPost.id] ? 'fill-current' : ''}`} />
                      <span>{selectedPost.likes || 0} Likes</span>
                    </button>

                    <button
                      onClick={() => handleShare(selectedPost)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>

                {/* Article Prev / Next Navigation */}
                <div className="mt-10 grid grid-cols-2 gap-4 pt-6 border-t border-slate-200/60 dark:border-white/10">
                  <button
                    onClick={() => handleNavigatePost('prev')}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 hover:border-indigo-500/30 transition-all text-left cursor-pointer flex flex-col gap-1"
                  >
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <ChevronLeft className="w-3 h-3" />
                      <span>Previous</span>
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-white line-clamp-1">
                      Earlier Article
                    </span>
                  </button>

                  <button
                    onClick={() => handleNavigatePost('next')}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 hover:border-indigo-500/30 transition-all text-right cursor-pointer flex flex-col gap-1 items-end"
                  >
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <span>Next</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-white line-clamp-1">
                      Next Article
                    </span>
                  </button>
                </div>

                {/* Reader Comments Section */}
                <div className="mt-12 pt-8 border-t border-slate-200 dark:border-white/10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-indigo-500" />
                      <span>Reader Comments ({selectedPost.comments?.length || 0})</span>
                    </h3>
                  </div>

                  {/* Add Comment Form */}
                  <form onSubmit={handleAddComment} className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-white/10 mb-8 flex flex-col gap-3">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Leave a thought or feedback</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={commentName}
                        onChange={(e) => setCommentName(e.target.value)}
                        placeholder="Your Name (optional)"
                        className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <textarea
                      rows={3}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Share your perspective or ask a technical question..."
                      className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      required
                    />
                    <div className="flex items-center justify-between">
                      {commentSubmitted ? (
                        <span className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Comment published!</span>
                        </span>
                      ) : <span />}
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>Post Comment</span>
                      </button>
                    </div>
                  </form>

                  {/* Comments List */}
                  {selectedPost.comments && selectedPost.comments.length > 0 ? (
                    <div className="space-y-4">
                      {selectedPost.comments.map((comment) => (
                        <div key={comment.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200/60 dark:border-white/5 flex flex-col gap-1.5 shadow-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">{comment.author}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{comment.date}</span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            {comment.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 font-mono text-center py-4">
                      No comments yet. Be the first to share your thoughts!
                    </p>
                  )}
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Blog Post Editor & Microphone Dictation Modal */}
      <AnimatePresence>
        {isEditorOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6" id="blog-editor-modal">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (isDictating) stopDictation();
                setIsEditorOpen(false);
              }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl max-h-[92vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl flex flex-col z-10 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/50 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
                        {editingPostId ? 'Edit Blog Article' : 'Write New Blog Article'}
                      </h3>
                      {editingPostId && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                          Updating
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Dictate content with speech recognition or draft using markdown.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Close modal */}
                  <button
                    type="button"
                    onClick={() => {
                      if (isDictating) stopDictation();
                      setIsEditorOpen(false);
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Form Scroll Area */}
              <form onSubmit={handleSaveBlogPost} className="flex-1 overflow-y-auto p-6 space-y-5">
                
                {/* Title & Category Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider font-mono text-slate-500 dark:text-slate-400">
                      Article Title *
                    </label>
                    <input
                      type="text"
                      value={editorTitle}
                      onChange={(e) => setEditorTitle(e.target.value)}
                      placeholder="e.g. Next-Gen Reactive State Architecture"
                      required
                      className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider font-mono text-slate-500 dark:text-slate-400">
                      Category
                    </label>
                    <input
                      type="text"
                      value={editorCategory}
                      onChange={(e) => setEditorCategory(e.target.value)}
                      placeholder="e.g. Architecture"
                      className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Summary / Abstract */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider font-mono text-slate-500 dark:text-slate-400">
                    Summary / Excerpt
                  </label>
                  <input
                    type="text"
                    value={editorSummary}
                    onChange={(e) => setEditorSummary(e.target.value)}
                    placeholder="Short summary highlighting the core engineering takeaways..."
                    className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                  />
                </div>

                {/* Tags & Read Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider font-mono text-slate-500 dark:text-slate-400">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={editorTags}
                      onChange={(e) => setEditorTags(e.target.value)}
                      placeholder="React, State Management, High Performance"
                      className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider font-mono text-slate-500 dark:text-slate-400">
                      Estimated Read Time
                    </label>
                    <input
                      type="text"
                      value={editorReadTime}
                      onChange={(e) => setEditorReadTime(e.target.value)}
                      placeholder="e.g. 5 min read"
                      className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Cover Image */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold uppercase tracking-wider font-mono text-slate-500 dark:text-slate-400">
                      Cover Graphic Image URL
                    </label>
                    {/* Quick presets */}
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                      <span>Presets:</span>
                      <button
                        type="button"
                        onClick={() => setEditorImage('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800&h=450')}
                        className="hover:text-indigo-500 cursor-pointer underline"
                      >
                        Code
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => setEditorImage('https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800&h=450')}
                        className="hover:text-indigo-500 cursor-pointer underline"
                      >
                        Work
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => setEditorImage('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800&h=450')}
                        className="hover:text-indigo-500 cursor-pointer underline"
                      >
                        Security
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={editorImage}
                    onChange={(e) => setEditorImage(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                  />
                </div>

                {/* MICROPHONE DICTATION & ARTICLE CONTENT SECTION */}
                <div className="flex flex-col gap-3 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider font-mono text-slate-800 dark:text-slate-200">
                        Article Content
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                        Markdown Supported
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Toggle Preview / Editor */}
                      <button
                        type="button"
                        onClick={() => setEditorPreviewMode(!editorPreviewMode)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                          editorPreviewMode
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <span>{editorPreviewMode ? 'Back to Editor' : 'Live Preview'}</span>
                      </button>
                    </div>
                  </div>

                  {/* HIGH-VISIBILITY MICROPHONE ACCESS & DICTATION ACTION BAR */}
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 border border-indigo-500/20 flex flex-col gap-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      
                      {/* Left: The Microphone Dictation Action Button */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={toggleDictation}
                          id="btn-microphone-dictation"
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-md select-none ${
                            isDictating
                              ? 'bg-rose-500 hover:bg-rose-600 text-white ring-4 ring-rose-500/20 shadow-rose-500/30 animate-pulse'
                              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 hover:scale-102 active:scale-98'
                          }`}
                          title={isDictating ? 'Click to stop recording' : 'Click to enable microphone access and dictate'}
                        >
                          {isDictating ? (
                            <>
                              <MicOff className="w-4 h-4 animate-bounce" />
                              <span>Stop Dictation</span>
                            </>
                          ) : (
                            <>
                              <Mic className="w-4 h-4 text-white" />
                              <span>Enable Mic & Dictate</span>
                            </>
                          )}
                        </button>

                        {/* Listening State Badge & Sound Equalizer Waves */}
                        {isDictating ? (
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-mono">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                            </span>
                            <span className="font-bold text-[11px]">LISTENING</span>
                            
                            {/* Animated Equalizer Wave Bars */}
                            <div className="flex items-end gap-0.5 h-3.5 mx-0.5">
                              <span className="w-1 bg-rose-500 rounded-full animate-bounce [animation-delay:0.1s] h-3"></span>
                              <span className="w-1 bg-rose-500 rounded-full animate-bounce [animation-delay:0.25s] h-3.5"></span>
                              <span className="w-1 bg-rose-500 rounded-full animate-bounce [animation-delay:0.4s] h-2"></span>
                              <span className="w-1 bg-rose-500 rounded-full animate-bounce [animation-delay:0.15s] h-4"></span>
                              <span className="w-1 bg-rose-500 rounded-full animate-bounce [animation-delay:0.3s] h-2.5"></span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                            <Volume2 className="w-3.5 h-3.5 text-indigo-500" />
                            <span>Voice-to-text active</span>
                          </div>
                        )}
                      </div>

                      {/* Right: Language selection & Voice Tools */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-2 py-1 text-xs text-slate-700 dark:text-slate-300">
                          <Globe className="w-3 h-3 text-slate-400" />
                          <select
                            value={speechLang}
                            onChange={(e) => setSpeechLang(e.target.value)}
                            disabled={isDictating}
                            className="bg-transparent border-0 focus:outline-none text-[11px] font-mono cursor-pointer"
                          >
                            <option value="en-US" className="dark:bg-slate-900">EN (US)</option>
                            <option value="en-GB" className="dark:bg-slate-900">EN (UK)</option>
                            <option value="es-ES" className="dark:bg-slate-900">ES (Spanish)</option>
                            <option value="fr-FR" className="dark:bg-slate-900">FR (French)</option>
                            <option value="de-DE" className="dark:bg-slate-900">DE (German)</option>
                            <option value="ja-JP" className="dark:bg-slate-900">JA (Japanese)</option>
                            <option value="hi-IN" className="dark:bg-slate-900">HI (Hindi)</option>
                          </select>
                        </div>

                        {/* Test Microphone Access Button */}
                        <button
                          type="button"
                          onClick={async () => {
                            if (!isDictating) {
                              startDictation();
                            }
                          }}
                          className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-mono transition-colors cursor-pointer"
                          title="Check or request browser microphone permission"
                        >
                          {hasMicPermission === true ? 'Mic: Granted ✓' : 'Verify Mic'}
                        </button>
                      </div>
                    </div>

                    {/* Speech Error Feedback Alert Banner */}
                    {speechError && (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold">Microphone Note: </span>
                            <span>{speechError}</span>
                          </div>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => setSpeechError(null)}
                          className="text-amber-500 hover:text-amber-700 dark:hover:text-white p-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Real-time Interim Voice Transcription Stream Bar */}
                    {interimTranscript && (
                      <div className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-950 border border-indigo-500/30 text-xs flex items-center gap-2 shadow-sm animate-pulse">
                        <Radio className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
                        <span className="text-[10px] font-mono font-bold text-indigo-500 uppercase">Speaking:</span>
                        <span className="text-slate-800 dark:text-slate-200 font-medium italic">
                          "{interimTranscript}"
                        </span>
                      </div>
                    )}

                    {/* Dictation Voice Commands Hint */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Voice Commands:</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800">say "period"</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800">say "comma"</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800">say "new paragraph"</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-800">say "new line"</span>
                    </div>
                  </div>

                  {/* Markdown Quick Buttons Toolbar (when not in preview mode) */}
                  {!editorPreviewMode && (
                    <div className="flex flex-wrap items-center gap-1 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/5">
                      <button
                        type="button"
                        onClick={() => insertMarkdownToContent('### Heading 3\n')}
                        className="px-2 py-1 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-mono font-bold"
                        title="Heading 3"
                      >
                        H3
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdownToContent('#### Heading 4\n')}
                        className="px-2 py-1 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-mono font-bold"
                        title="Heading 4"
                      >
                        H4
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdownToContent('**', '**')}
                        className="px-2 py-1 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold"
                        title="Bold"
                      >
                        B
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdownToContent('*', '*')}
                        className="px-2 py-1 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs italic"
                        title="Italic"
                      >
                        I
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdownToContent('```typescript\n// code here\n```\n')}
                        className="px-2 py-1 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-mono flex items-center gap-1"
                        title="Code Block"
                      >
                        <Code className="w-3 h-3 text-emerald-500" />
                        <span>Code</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdownToContent('- List item 1\n- List item 2\n')}
                        className="px-2 py-1 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-mono flex items-center gap-1"
                        title="Bullet List"
                      >
                        <List className="w-3 h-3 text-sky-500" />
                        <span>List</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdownToContent('| Item | Spec |\n| :--- | :--- |\n| Core | Alpha |\n')}
                        className="px-2 py-1 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-mono"
                        title="Table"
                      >
                        Table
                      </button>
                      <div className="flex-1" />
                      {editorContent && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('Clear all article content?')) {
                              setEditorContent('');
                            }
                          }}
                          className="px-2 py-1 rounded hover:bg-rose-500/10 text-rose-500 text-xs font-mono flex items-center gap-1"
                          title="Clear Content"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Clear</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Main Textarea vs Live Markdown Preview */}
                  {editorPreviewMode ? (
                    <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/80 min-h-[300px] max-h-[460px] overflow-y-auto leading-relaxed">
                      {editorContent.trim() ? (
                        <div className="prose prose-slate dark:prose-invert max-w-none">
                          {renderMarkdownContent(editorContent)}
                        </div>
                      ) : (
                        <p className="text-slate-400 italic text-xs font-mono">
                          No content written yet. Switch back to the editor or click "Enable Mic & Dictate" to speak your content.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="relative">
                      <textarea
                        ref={editorContentRef}
                        rows={10}
                        value={editorContent}
                        onChange={(e) => setEditorContent(e.target.value)}
                        placeholder="Type your blog post content here, or click 'Enable Mic & Dictate' above to dictate your thoughts directly into this editor..."
                        required
                        className="w-full p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all leading-relaxed"
                      />
                      <div className="absolute right-3 bottom-3 text-[10px] font-mono text-slate-400 bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-200 dark:border-white/5">
                        {editorContent.split(/\s+/).filter(Boolean).length} words • {editorContent.length} chars
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    {saveSuccessNotification && (
                      <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 animate-bounce">
                        <Check className="w-4 h-4" />
                        <span>Article published and saved to portfolio!</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (isDictating) stopDictation();
                        setIsEditorOpen(false);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingPostId ? 'Update Article' : 'Publish Article'}</span>
                    </button>
                  </div>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
