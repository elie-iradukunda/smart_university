import React from 'react';
import { 
  X, 
  TrendingUp, 
  ExternalLink, 
  Play, 
  Calendar, 
  Building2, 
  User, 
  Trophy,
  ArrowRight,
  Target,
  Globe,
  MessageCircle,
  Linkedin,
  Facebook,
  Twitter,
  Instagram
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SuccessStoryDetailModal = ({ story, onClose }) => {
  if (!story) return null;

  // Helper to parse YouTube URL for embed
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  const embedUrl = getYoutubeEmbedUrl(story.videoUrl);
  const gallery = story.gallery ? story.gallery.split(',').map(img => img.trim()) : [];
  
  // Parse social links
  let socialLinks = [];
  try {
     socialLinks = story.socialLinks ? JSON.parse(story.socialLinks) : [];
  } catch (e) {
     console.error("Failed to parse social links", e);
  }

  const getSocialIcon = (type) => {
     switch(type) {
        case 'WhatsApp': return <MessageCircle size={18} />;
        case 'LinkedIn': return <Linkedin size={18} />;
        case 'Facebook': return <Facebook size={18} />;
        case 'Twitter': return <Twitter size={18} />;
        case 'Instagram': return <Instagram size={18} />;
        default: return <Globe size={18} />;
     }
  };

  const getSocialColor = (type) => {
     switch(type) {
        case 'WhatsApp': return 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20';
        case 'LinkedIn': return 'bg-blue-700 hover:bg-blue-800 shadow-blue-900/20';
        case 'Facebook': return 'bg-blue-600 hover:bg-blue-700 shadow-blue-900/20';
        case 'Twitter': return 'bg-sky-500 hover:bg-sky-600 shadow-sky-900/20';
        case 'Instagram': return 'bg-pink-600 hover:bg-pink-700 shadow-pink-900/20';
        default: return 'bg-[#1f4fa3] hover:bg-[#173e82] shadow-blue-900/20';
     }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-2 bg-white/20 hover:bg-white/40 text-white md:text-slate-400 md:hover:bg-slate-100 md:hover:text-slate-900 rounded-full backdrop-blur-xl transition-all"
        >
          <X size={24} />
        </button>

        {/* Left Side: Visuals (Hidden on mobile or top on mobile) */}
        <div className="w-full md:w-[45%] bg-slate-100 relative overflow-y-auto hide-scrollbar border-r border-slate-100">
           <div className="sticky top-0 h-80 md:h-[500px]">
              <img 
                src={story.image} 
                className="w-full h-full object-cover" 
                alt={story.projectName} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10 right-10">
                 <div className="flex flex-wrap gap-2 mb-4">
                    {story.tags && story.tags.split(',').map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full text-[10px] font-black uppercase tracking-widest">{tag.trim()}</span>
                    ))}
                 </div>
                 <h2 className="text-4xl font-black text-white italic tracking-tight">{story.projectName}</h2>
              </div>
           </div>

           {/* Gallery Section */}
           {gallery.length > 0 && (
             <div className="p-8">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                   <Target size={16} className="text-blue-500" /> Project Gallery
                </h3>
                <div className="grid grid-cols-2 gap-4">
                   {gallery.map((img, i) => (
                     <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-slate-200 group">
                        <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={`Image ${i+1}`} />
                     </div>
                   ))}
                </div>
             </div>
           )}
        </div>

        {/* Right Side: Content */}
        <div className="flex-1 bg-white overflow-y-auto p-10 sm:p-14 custom-scrollbar">
           <div className="max-w-xl mx-auto space-y-12">
              
              {/* Founder Header */}
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center font-black text-blue-600 text-xl overflow-hidden shadow-inner">
                       <img src={`https://ui-avatars.com/api/?name=${story.studentName}&background=E0E7FF&color=1F4FA3&bold=true`} alt={story.studentName} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Founder & CEO</p>
                       <h4 className="text-xl font-black text-slate-800 tracking-tight">{story.studentName}</h4>
                    </div>
                 </div>
                 <div className="text-right">
                    <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl border border-emerald-100 flex items-center gap-2">
                       <Trophy size={16} />
                       <span className="text-xs font-black uppercase tracking-widest">Graduated {story.graduationYear}</span>
                    </div>
                 </div>
              </div>

              {/* Status Banner */}
              <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 group hover:border-blue-200 transition-colors">
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-sm">
                       <Building2 size={20} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Current Industry Status</p>
                       <p className="font-black text-slate-800 uppercase tracking-tighter italic">{story.companyStatus}</p>
                    </div>
                 </div>
                 <p className="text-lg text-slate-600 leading-relaxed font-medium italic">
                    "{story.description}"
                 </p>
              </div>

              {/* Achievements Grid */}
              <div className="space-y-6">
                 <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <TrendingUp size={16} className="text-emerald-500" /> Milestone Breakdown
                 </h3>
                 <div className="grid grid-cols-1 gap-4">
                    {story.achievements && story.achievements.split(',').map((milestone, i) => (
                      <div key={i} className="flex gap-4 p-5 rounded-2xl bg-white border border-slate-100 hover:shadow-lg transition-all items-center">
                         <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                            <CheckCircle size={20} />
                         </div>
                         <p className="font-bold text-slate-700">{milestone.trim()}</p>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Video Section */}
              {story.videoUrl && (
                <div className="space-y-6">
                   <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                      <Play size={16} className="text-red-500" /> Watch the Journey
                   </h3>
                   <div className="aspect-video rounded-[2rem] overflow-hidden border border-slate-200 shadow-inner bg-slate-900 group relative">
                      {embedUrl ? (
                        <iframe 
                          src={embedUrl}
                          className="w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <video controls className="w-full h-full">
                           <source src={story.videoUrl} type="video/mp4" />
                           Your browser does not support the video tag.
                        </video>
                      )}
                   </div>
                </div>
              )}

              {/* CTA */}
              <div className="pt-10 flex flex-col gap-4">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    {socialLinks.filter(l => l.url).map((link, idx) => (
                       <a 
                        key={idx}
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`py-5 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-xl transition-all no-underline ${getSocialColor(link.type)}`}
                       >
                          {getSocialIcon(link.type)} {link.type}
                       </a>
                    ))}
                 </div>
                 <button onClick={onClose} className="w-full py-5 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-slate-200 transition-all">
                    Return to Center
                 </button>
              </div>

           </div>
        </div>
      </motion.div>
    </div>
  );
};

// Internal icon for milestones
const CheckCircle = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default SuccessStoryDetailModal;
