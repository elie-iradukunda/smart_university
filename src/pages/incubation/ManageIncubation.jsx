
import { 
  Users, 
  Trophy, 
  Settings, 
  Calendar, 
  PackageSearch,
  CheckCircle2,
  XCircle,
  Plus,
  Eye,
  FileText,
  UploadCloud,
  X,
  Trash2,
  Star,
  TrendingUp,
  Activity
} from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
import React, { useState, useEffect } from 'react';

const mockApplications = [
  { id: 1, team: 'Elie Iradukunda', project: 'SmartAgri IoT', date: '2026-02-20', status: 'Pending', category: 'AgriTech' },
  { id: 2, team: 'Jane Smith', project: 'EduLearn VR', date: '2026-02-21', status: 'Approved', category: 'EdTech' }
];

const ManageIncubation = () => {
  const [activeTab, setActiveTab] = useState('applications');
  
  // States to hold actual data from backend
  const [projects, setProjects] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [storyModalOpen, setStoryModalOpen] = useState(false);

  // Form State for Success Story
  const [storyForm, setStoryForm] = useState({
     projectName: '', studentName: '', description: '', achievements: '', graduationYear: '', companyStatus: '', image: '', tags: ''
  });

  useEffect(() => {
     fetchStories();
  }, []);

  const fetchStories = async () => {
     try {
         setInitialLoad(true);
         const res = await axios.get(`${API_BASE_URL}/api/incubation/stories`);
         setStories(res.data);
     } catch (err) {
         console.error('Error loading stories');
     } finally {
         setInitialLoad(false);
     }
  };

  const deleteStory = async (id) => {
     if (window.confirm("Are you sure you want to delete this success story?")) {
        try {
           await axios.delete(`${API_BASE_URL}/api/incubation/stories/${id}`, {
               headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
           });
           fetchStories();
        } catch (error) {
           console.error("Failed to delete", error);
        }
     }
  };

  const submitStory = async (e) => {
     e.preventDefault();
     setLoading(true);
     try {
       const tagsFormatted = storyForm.achievements; // Keep simple for now
       await axios.post(`${API_BASE_URL}/api/incubation/stories`, storyForm, {
           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
       });
       setStoryModalOpen(false);
       setStoryForm({ projectName: '', studentName: '', description: '', achievements: '', graduationYear: '', companyStatus: '', image: '', tags: '' });
       alert('Success story uploaded!');
       fetchStories();
     } catch (error) {
       console.error(error);
       alert('Failed to save story');
     } finally {
       setLoading(false);
     }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'applications':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <div>
                  <h3 className="text-xl font-bold text-slate-800">Startup Applications</h3>
                  <p className="text-slate-500 text-sm">Review and manage student idea submissions.</p>
               </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                   <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-xs py-3">
                     <tr>
                       <th className="px-6 py-4">Project / Team</th>
                       <th className="px-6 py-4">Category</th>
                       <th className="px-6 py-4">Submission Date</th>
                       <th className="px-6 py-4">Status</th>
                       <th className="px-6 py-4 text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {mockApplications.map(app => (
                       <tr key={app.id} className="hover:bg-slate-50/50 transition">
                         <td className="px-6 py-4">
                           <div className="font-bold text-slate-800">{app.project}</div>
                           <div className="text-slate-500 text-xs">By {app.team}</div>
                         </td>
                         <td className="px-6 py-4">
                            <span className="px-2.5 py-1 bg-slate-100 rounded-md text-xs font-medium text-slate-600 border border-slate-200">{app.category}</span>
                         </td>
                         <td className="px-6 py-4 text-slate-500">{app.date}</td>
                         <td className="px-6 py-4">
                           <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-max ${app.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                              {app.status === 'Approved' ? <CheckCircle2 size={12} /> : <FileText size={12} />} {app.status}
                           </span>
                         </td>
                         <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-2">
                             <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="View Proposal"><Eye size={18} /></button>
                             <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="Approve"><CheckCircle2 size={18} /></button>
                             <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Reject"><XCircle size={18} /></button>
                           </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        );
      
      case 'success':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <div>
                  <h3 className="text-xl font-bold text-slate-800">Alumni Success Stories</h3>
                  <p className="text-slate-500 text-sm">Upload and showcase startup successes.</p>
               </div>
               <button 
                  onClick={() => setStoryModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
               >
                 <Plus size={16} /> Add Story
               </button>
            </div>
            {/* Story management dynamic grid */}
             {initialLoad ? (
                <div className="flex justify-center p-12"><Activity className="animate-spin text-blue-600" size={32} /></div>
             ) : stories.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-slate-300 rounded-xl bg-white text-slate-500">
                   <Trophy size={48} className="mx-auto mb-4 text-slate-300" />
                   <p className="font-semibold text-slate-700">No new stories configured</p>
                   <p className="text-sm">Click "Add Story" to feature a successful university startup on the public hub.</p>
                </div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {stories.map(story => (
                     <div key={story.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 flex flex-col relative group">
                       <button onClick={() => deleteStory(story.id)} title="Delete Story" className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/90 backdrop-blur text-red-600 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-700 transition shadow-sm border border-red-100 opacity-0 group-hover:opacity-100">
                         <Trash2 size={14} />
                       </button>

                       <div className="h-48 overflow-hidden relative">
                         <img 
                           src={story.image || "https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"} 
                           alt={story.projectName}
                           className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                         />
                         <div className="absolute top-4 left-4 flex flex-wrap gap-2 pr-12">
                           {story.tags && story.tags.split(',').map((tag, idx) => (
                             <span key={idx} className="bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap border border-white/20">
                               {tag.trim()}
                             </span>
                           ))}
                         </div>
                       </div>

                       <div className="p-5 flex-1 flex flex-col">
                         <div className="flex justify-between items-start mb-2">
                           <h3 className="text-lg font-bold text-slate-800 leading-tight">{story.projectName}</h3>
                           <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200 whitespace-nowrap">
                             Class of {story.graduationYear}
                           </span>
                         </div>
                         
                         <div className="text-xs text-slate-500 font-medium mb-4 flex items-center gap-1.5 border-b border-slate-50 pb-3">
                            <div className="w-5 h-5 rounded-full bg-slate-200 overflow-hidden"><img src={`https://ui-avatars.com/api/?name=${story.studentName}&background=0D8ABC&color=fff`} alt={story.studentName} /></div>
                            {story.studentName}
                         </div>

                         <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 mb-4 flex-1">
                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                              <Star size={12} className="text-yellow-500" /> Key Achievements
                            </h4>
                            <ul className="space-y-1">
                               {story.achievements && story.achievements.split(',').map((achievement, i) => (
                                 <li key={i} className="text-xs font-medium text-slate-700 flex items-start gap-1.5">
                                   <TrendingUp size={12} className="text-emerald-500 mt-0.5 shrink-0" />
                                   {achievement.trim()}
                                 </li>
                               ))}
                            </ul>
                         </div>

                         <div className="text-xs text-slate-500 font-medium pt-2">
                           <span className="text-slate-400 block mb-0.5 text-[9px] uppercase font-bold tracking-wider">Current Status</span>
                           {story.companyStatus}
                         </div>
                       </div>
                     </div>
                   ))}
                </div>
             )}
          </div>
        );

      case 'programs':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <div>
                  <h3 className="text-xl font-bold text-slate-800">Programs & Events</h3>
                  <p className="text-slate-500 text-sm">Schedule accelerator programs and hackathons.</p>
               </div>
               <button className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
                 <Plus size={16} /> Create Event
               </button>
            </div>
            <div className="p-8 text-center border-2 border-dashed border-slate-300 rounded-xl bg-white text-slate-500">
               <Calendar size={48} className="mx-auto mb-4 text-slate-300" />
               <p className="font-semibold text-slate-700">Calendar Empty</p>
               <p className="text-sm">Manage duration, deadlines, and benefits of incubation programs here.</p>
            </div>
          </div>
        );
        
      case 'resources':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <div>
                  <h3 className="text-xl font-bold text-slate-800">Center Store & Resources</h3>
                  <p className="text-slate-500 text-sm">Upload equipment, tech credits, and labs specifically for incubated startups.</p>
               </div>
               <button className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
                 <Plus size={16} /> Add Resource
               </button>
            </div>
            <div className="p-8 text-center border-2 border-dashed border-slate-300 rounded-xl bg-white text-slate-500">
               <PackageSearch size={48} className="mx-auto mb-4 text-slate-300" />
               <p className="font-semibold text-slate-700">Manage Incubation Inventory</p>
               <p className="text-sm">Approve or reject student requests for cloud credits and hardware access.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Navigation for Manager */}
      <div className="w-full lg:w-64 shrink-0 space-y-2">
        <button 
          onClick={() => setActiveTab('applications')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === 'applications' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-blue-200 hover:text-blue-600'}`}
        >
          <Users size={18} /> Startup Ideas
        </button>
        <button 
          onClick={() => setActiveTab('success')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === 'success' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-blue-200 hover:text-blue-600'}`}
        >
          <Trophy size={18} /> Success Stories
        </button>
        <button 
          onClick={() => setActiveTab('programs')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === 'programs' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-blue-200 hover:text-blue-600'}`}
        >
          <Calendar size={18} /> Programs & Events
        </button>
        <button 
          onClick={() => setActiveTab('resources')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === 'resources' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-blue-200 hover:text-blue-600'}`}
        >
          <PackageSearch size={18} /> Center Resources
        </button>
      </div>

      {/* Main Panel Content */}
      <div className="flex-1">
         {renderContent()}
      </div>

      {/* Upload Story Modal */}
      {storyModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                 <h2 className="text-xl font-bold text-slate-800">Publish Success Story</h2>
                 <button onClick={() => setStoryModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={24} />
                 </button>
              </div>

              <div className="p-6 overflow-y-auto">
                 <form id="storyForm" onSubmit={submitStory} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Company / Project Name</label>
                          <input type="text" required value={storyForm.projectName} onChange={(e) => setStoryForm({...storyForm, projectName: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Founder (Student) Name</label>
                          <input type="text" required value={storyForm.studentName} onChange={(e) => setStoryForm({...storyForm, studentName: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Image URL</label>
                          <input type="url" placeholder="https://..." value={storyForm.image} onChange={(e) => setStoryForm({...storyForm, image: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Tags</label>
                          <input type="text" placeholder="e.g. EdTech, AI, IoT" value={storyForm.tags} onChange={(e) => setStoryForm({...storyForm, tags: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                       </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Description</label>
                        <textarea required rows="3" value={storyForm.description} onChange={(e) => setStoryForm({...storyForm, description: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Graduation Year</label>
                          <input type="text" value={storyForm.graduationYear} onChange={(e) => setStoryForm({...storyForm, graduationYear: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Current Company Status</label>
                          <input type="text" placeholder="e.g. Scaling rapidly, Series A" value={storyForm.companyStatus} onChange={(e) => setStoryForm({...storyForm, companyStatus: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                       </div>
                    </div>

                    <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Key Achievements</label>
                       <input type="text" placeholder="Separate by commas (e.g. $50k Seed, Patented Tech)" value={storyForm.achievements} onChange={(e) => setStoryForm({...storyForm, achievements: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                 </form>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                 <button onClick={() => setStoryModalOpen(false)} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-100">Cancel</button>
                 <button type="submit" form="storyForm" disabled={loading} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50 shadow-md">
                    <UploadCloud size={18} /> {loading ? 'Publishing...' : 'Publish Story'}
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default ManageIncubation;
