import { Video, FileText, Search, BookOpen, Download, Clock, ArrowRight, Upload, Loader2, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import API_BASE_URL from '../config/api';
import AddResourceModal from '../components/AddResourceModal';
import ResourceDetailsModal from '../components/ResourceDetailsModal';

const LearningCenter = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedResource, setSelectedResource] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const fetchResources = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/resources`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error("Resource fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const categories = ["All", "Video", "PDF", "Link", "Document"];

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(search.toLowerCase()) || 
                          (res.category && res.category.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = activeCategory === "All" || res.type === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const essentialGuides = resources.filter(r => r.isEssential);

  if (loading) return (
     <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-[#1f4fa3]" size={32} />
     </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#2c3e50]">Learning Center</h1>
          <p className="text-sm text-[#6b7280] mt-1">Institutional resource library and training materials.</p>
        </div>
        {(user?.role === 'Admin' || user?.role === 'HOD' || user?.role === 'Lecturer') && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#1f4fa3] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#173e82] flex items-center gap-2 shadow-sm transition-all"
            >
              <Upload size={16} /> Upload Resource
            </button>
        )}
      </div>

      <AddResourceModal 
         isOpen={isModalOpen} 
         onClose={() => {
             setIsModalOpen(false);
             fetchResources();
         }} 
      />

      <ResourceDetailsModal 
         isOpen={!!selectedResource}
         onClose={() => setSelectedResource(null)}
         resource={selectedResource}
      />

      {/* Search & Categories */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
         <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search guides, manuals, videos..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1f4fa3]/20 text-sm text-[#2c3e50] placeholder:text-[#9ca3af]"
            />
         </div>
         <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 scrollbar-hide">
            {categories.map(cat => (
               <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-md text-xs font-bold transition-all ${
                     activeCategory === cat 
                        ? 'bg-[#1f4fa3] text-white shadow-md shadow-blue-900/10' 
                        : 'bg-white text-[#6b7280] border border-gray-200 hover:bg-gray-50'
                  }`}
               >
                  {cat === "All" ? "All Resources" : cat === "Video" ? "Tutorials" : cat}
               </button>
            ))}
         </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Resource Feed */}
        <div className="lg:col-span-8 space-y-4">
           <h3 className="text-sm font-bold text-[#2c3e50] uppercase tracking-widest">Latest Materials</h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredResources.length > 0 ? (
                 filteredResources.map(res => (
                    <ResourceCard 
                      key={res.id} 
                      res={res} 
                      onClick={() => setSelectedResource(res)} 
                    />
                 ))
              ) : (
                 <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 rounded-xl">
                    <BookOpen size={48} className="mx-auto text-gray-100 mb-3" />
                    <p className="text-gray-400 text-sm">No resources found matching your criteria.</p>
                 </div>
              )}
           </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
           {/* Summary Stats */}
           <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
              <div className="w-12 h-12 bg-blue-50 text-[#1f4fa3] rounded-full flex items-center justify-center mx-auto mb-4">
                 <Video size={24} />
              </div>
              <h3 className="text-2xl font-bold text-[#2c3e50]">{resources.length}</h3>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Total Resources</p>
           </div>

           {/* Essential Guides - Dynamic */}
           <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                 <h3 className="text-xs font-bold text-[#2c3e50] uppercase tracking-widest">Essential Guides</h3>
                 {essentialGuides.length > 0 && (
                    <span className="text-[10px] bg-[#1f4fa3]/10 text-[#1f4fa3] font-bold px-2 py-0.5 rounded-full">{essentialGuides.length}</span>
                 )}
              </div>
              <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                 {essentialGuides.length > 0 ? (
                    essentialGuides.map(res => (
                       <DownloadItem
                           key={res.id}
                           title={res.title}
                           size={res.size || res.type}
                           onClick={() => setSelectedResource(res)}
                       />
                    ))
                 ) : (
                    <div className="py-6 text-center border border-dashed border-gray-100 rounded-lg">
                       <BookOpen size={24} className="mx-auto text-gray-200 mb-2" />
                       <p className="text-[11px] text-gray-400">No essential guides pinned yet.</p>
                       <p className="text-[10px] text-gray-300 mt-1">Upload a resource & toggle "Essential Guide".</p>
                    </div>
                 )}
              </div>
              <button className="w-full py-2.5 text-[#1f4fa3] text-xs font-bold hover:bg-blue-50 rounded-md border border-transparent hover:border-blue-100 transition-all flex items-center justify-center gap-2">
                 View Internal Wiki <ArrowRight size={14} />
              </button>
           </div>

           {/* Help Box */}
           <div className="bg-gradient-to-br from-[#1f4fa3] to-[#173e82] p-6 rounded-xl shadow-lg shadow-blue-900/20 text-white space-y-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                 <BookOpen size={20} />
              </div>
              <div>
                 <h4 className="text-base font-bold">Need assistance?</h4>
                 <p className="text-xs text-blue-100/80 mt-1 leading-relaxed">Book a session with a certified technician for hands-on equipment training.</p>
              </div>
              <button className="w-full py-2.5 bg-white text-[#1f4fa3] rounded-md text-xs font-bold hover:bg-blue-50 transition-all shadow-md">
                 Schedule Session
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

const ResourceCard = ({ res, onClick }) => {
  const Icon = res.type === 'Video' ? Video : res.type === 'PDF' ? FileText : LinkIcon;
  
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group cursor-pointer flex flex-col h-full border-b-2 hover:border-b-[#1f4fa3]"
    >
       <div className="h-40 bg-gray-50 relative overflow-hidden flex items-center justify-center">
          {res.thumbnail ? (
             <img src={res.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          ) : (
             <div className="text-gray-200">
                <Icon size={48} />
             </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-md flex items-center gap-1.5 font-bold border border-white/10 uppercase tracking-wider">
             <Icon size={12} /> {res.type}
          </div>
       </div>
       <div className="p-4 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
             <span className="text-[10px] font-bold text-[#1f4fa3] uppercase tracking-widest bg-[#1f4fa3]/5 px-2 py-0.5 rounded">
                {res.category || 'General'}
             </span>
          </div>
          <h4 className="text-[15px] font-bold text-[#2c3e50] leading-tight mb-3 line-clamp-2 group-hover:text-[#1f4fa3] transition-colors">
             {res.title}
          </h4>
          <div className="flex items-center justify-between gap-3 text-[11px] text-[#9ca3af] border-t border-gray-50 pt-3 mt-auto">
             <div className="flex items-center gap-3">
                {res.duration && <span className="flex items-center gap-1"><Clock size={12} /> {res.duration}</span>}
                {res.size && <span className="flex items-center gap-1"><Download size={12} /> {res.size}</span>}
             </div>
             <a href={res.url} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-blue-50 rounded-md text-[#1f4fa3] transition-colors">
                <ExternalLink size={14} />
             </a>
          </div>
       </div>
    </div>
  );
};

const DownloadItem = ({ title, size, onClick }) => (
  <div 
    onClick={onClick}
    className="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-lg transition-all cursor-pointer group border border-transparent hover:border-gray-100"
  >
     <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-[#1f4fa3] group-hover:text-white transition-all shadow-sm">
           <Download size={16} />
        </div>
        <div className="flex-1 min-w-0">
           <p className="text-xs font-bold text-[#2c3e50] truncate">{title}</p>
           <p className="text-[10px] text-[#9ca3af] font-medium">{size}</p>
        </div>
     </div>
  </div>
);

export default LearningCenter;
