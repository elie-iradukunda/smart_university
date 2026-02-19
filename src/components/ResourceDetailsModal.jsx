import { X, Calendar, Download, Play, ChevronRight, BookOpen, Clock, FileText, Globe, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ResourceDetailsModal = ({ isOpen, onClose, resource }) => {
  if (!isOpen || !resource) return null;

  // Robust YouTube ID extraction
  const getYoutubeEmbedUrl = (url) => {
      if (!url) return null;
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) 
        ? `https://www.youtube.com/embed/${match[2]}` 
        : null;
  };

  const isVideo = resource.type === 'Video';
  const isPDF = resource.type === 'PDF';
  const embedUrl = isVideo ? getYoutubeEmbedUrl(resource.url) : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col my-8 max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10 shrink-0">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-[#1f4fa3] rounded-lg">
                    {isVideo ? <Play size={20} /> : isPDF ? <FileText size={20} /> : <Globe size={20} />}
                </div>
                <div>
                    <h2 className="text-xl font-bold text-[#2c3e50]">{resource.title}</h2>
                    <p className="text-sm text-[#6b7280]">
                        {resource.category} • <span className="text-[#1f4fa3] font-medium">{resource.department || 'All Departments'}</span>
                    </p>
                </div>
            </div>
            <button onClick={onClose} className="text-[#9ca3af] hover:text-[#2c3e50] p-2 rounded-full hover:bg-gray-100 transition-all">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              
              {/* Media Content */}
              <div className="mb-8">
                  {isVideo && embedUrl ? (
                      <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-gray-100">
                          <iframe 
                              src={embedUrl}
                              className="w-full h-full" 
                              allowFullScreen 
                              title={resource.title}
                          />
                      </div>
                  ) : (
                      <div className="relative aspect-video bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center group">
                          {resource.thumbnail ? (
                              <img src={resource.thumbnail} className="w-full h-full object-cover" alt={resource.title} />
                          ) : (
                              <BookOpen size={64} className="text-gray-200" />
                          )}
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <a 
                                href={resource.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-white text-[#1f4fa3] px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-xl hover:scale-105 transition-all"
                              >
                                {isPDF ? <Download size={20} /> : <ExternalLink size={20} />} 
                                {isPDF ? 'Download/Open PDF' : 'Visit Resource'}
                              </a>
                          </div>
                      </div>
                  )}
              </div>

              {/* Resource Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-6">
                      <div>
                          <h3 className="text-sm font-bold text-[#2c3e50] mb-3 uppercase tracking-wider text-xs">Overview</h3>
                          <p className="text-sm text-[#6b7280] leading-relaxed">
                              This resource belongs to the <strong>{resource.category}</strong> catalog and is curated for <strong>{resource.department || 'all participating departments'}</strong>. 
                              It provides essential technical insights and training materials designed to support institutional learning and laboratory competence.
                          </p>
                      </div>

                      <div className="flex flex-wrap gap-4">
                          <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
                              <BookOpen size={18} className="text-[#1f4fa3]" />
                              <div>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase">Format</p>
                                  <p className="text-xs font-bold text-[#2c3e50]">{resource.type}</p>
                              </div>
                          </div>
                          {resource.duration && (
                              <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
                                  <Clock size={18} className="text-[#1f4fa3]" />
                                  <div>
                                      <p className="text-[10px] text-gray-400 font-bold uppercase">Duration</p>
                                      <p className="text-xs font-bold text-[#2c3e50]">{resource.duration}</p>
                                  </div>
                              </div>
                          )}
                          {resource.size && (
                              <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
                                  <Download size={18} className="text-[#1f4fa3]" />
                                  <div>
                                      <p className="text-[10px] text-gray-400 font-bold uppercase">Filesize</p>
                                      <p className="text-xs font-bold text-[#2c3e50]">{resource.size}</p>
                                  </div>
                              </div>
                          )}
                      </div>
                  </div>

                  <div className="space-y-4">
                      <h3 className="text-sm font-bold text-[#2c3e50] mb-3 uppercase tracking-wider text-xs">Quick Actions</h3>
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-white hover:border-[#1f4fa3] hover:text-[#1f4fa3] transition-all group"
                      >
                          <div className="flex items-center gap-3">
                              <div className="p-2 bg-white rounded-lg shadow-sm">
                                  {isPDF ? <Download size={18} /> : <ExternalLink size={18} />}
                              </div>
                              <span className="text-xs font-bold">{isPDF ? 'Download PDF' : 'Open External'}</span>
                          </div>
                          <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>

                      <div className="p-5 bg-[#1f4fa3]/5 rounded-xl border border-[#1f4fa3]/10">
                          <p className="text-[10px] text-[#1f4fa3] font-bold uppercase tracking-widest mb-1">Notice</p>
                          <p className="text-[11px] text-[#2c3e50] leading-relaxed">
                              By accessing this material, you agree to the university's academic integrity policy.
                          </p>
                      </div>
                  </div>
              </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ResourceDetailsModal;
