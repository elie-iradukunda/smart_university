
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
  Activity,
  DollarSign,
  Image,
  Check,
  PencilLine,
  Clock,
  MapPin,
  Info,
  Lightbulb,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
import React, { useState, useEffect } from 'react';
import EquipmentDetailsModal from '../../components/EquipmentDetailsModal';
import { motion, AnimatePresence } from 'framer-motion';

const mockApplications = [
  { id: 1, team: 'Elie Iradukunda', project: 'SmartAgri IoT', date: '2026-02-20', status: 'Pending', category: 'AgriTech' },
  { id: 2, team: 'Jane Smith', project: 'EduLearn VR', date: '2026-02-21', status: 'Approved', category: 'EdTech' }
];

const ManageIncubation = () => {
  const [activeTab, setActiveTab] = useState('applications');
  
  // States to hold actual data from backend
  const [projects, setProjects] = useState([]);
  const [stories, setStories] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [programModalOpen, setProgramModalOpen] = useState(false);
  const [assetModalOpen, setAssetModalOpen] = useState(false);
  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [assetFormTab, setAssetFormTab] = useState('basic');
  const [editingId, setEditingId] = useState(null); 
  const [viewingItem, setViewingItem] = useState(null); // For detail view modals

  // Form State for Success Story
  const [storyForm, setStoryForm] = useState({
     projectName: '', studentName: '', description: '', achievements: '', graduationYear: '', companyStatus: '', image: '', tags: ''
  });

  // Form State for Program/Event
  const [programForm, setProgramForm] = useState({
    name: '', description: '', requirements: '', duration: '', applicationDeadline: '', 
    status: 'Active', benefits: '', type: 'Program', date: '', location: '', speaker: ''
  });

  // Form State for Asset
  const [assetForm, setAssetForm] = useState({
    name: '', modelNumber: '', serialNumber: '', assetTag: '', category: 'Hardware', department: 'Incubation', 
    type: 'Equipment', status: 'Available', description: '', location: '', stock: 1, available: 1, 
    image: '', galleryImages: [], videoUrls: [], manualUrl: '', 
    purchaseDate: '', warrantyExpiry: '', cost: '', supplier: '', 
    requiresMaintenance: false, allowOvernight: false, icon: 'Package'
  });

  useEffect(() => {
     fetchStories();
     fetchPrograms();
     fetchProjects();
     fetchAssets();
     fetchReservations();
  }, []);

  const fetchPrograms = async () => {
    try {
        const res = await axios.get(`${API_BASE_URL}/api/incubation/programs`);
        setPrograms(res.data);
    } catch (err) {
        console.error('Error loading programs');
    }
  };

  const fetchProjects = async () => {
    try {
        const res = await axios.get(`${API_BASE_URL}/api/incubation/projects`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setProjects(res.data);
    } catch (err) {
        console.error('Error loading projects');
    }
  };

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

  const fetchReservations = async () => {
    try {
        const res = await axios.get(`${API_BASE_URL}/api/reservations/all`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setReservations(res.data);
    } catch (err) {
        console.error('Error loading reservations');
    }
  };

  const updateReservationStatus = async (id, status) => {
    try {
        await axios.put(`${API_BASE_URL}/api/reservations/${id}`, { status }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchReservations();
    } catch (err) {
        console.error("Failed to update reservation status");
        alert(err.response?.data?.message || "Status update failed");
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
       if (editingId) {
          await axios.put(`${API_BASE_URL}/api/incubation/stories/${editingId}`, storyForm, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          alert('Success story updated!');
       } else {
          await axios.post(`${API_BASE_URL}/api/incubation/stories`, storyForm, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          alert('Success story uploaded!');
       }
       setStoryModalOpen(false);
       setEditingId(null);
       setStoryForm({ projectName: '', studentName: '', description: '', achievements: '', graduationYear: '', companyStatus: '', image: '', tags: '' });
       fetchStories();
     } catch (error) {
       console.error(error);
       alert('Failed to save story');
     } finally {
       setLoading(false);
     }
  };

  const handleEditStory = (story) => {
     setStoryForm({
        projectName: story.projectName,
        studentName: story.studentName,
        description: story.description,
        achievements: story.achievements,
        graduationYear: story.graduationYear,
        companyStatus: story.companyStatus,
        image: story.image,
        tags: story.tags
     });
     setEditingId(story.id);
     setStoryModalOpen(true);
  };

  const fetchAssets = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/incubation/assets`);
      setAssets(res.data);
    } catch (err) {
      console.error('Error fetching assets');
    }
  };


  const handleImageUpload = async (e, type = 'asset') => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (type === 'asset') {
         setAssetForm({ ...assetForm, image: res.data.url });
      } else if (type === 'story') {
         setStoryForm({ ...storyForm, image: res.data.url });
      } else if (type === 'program') {
         setProgramForm({ ...programForm, image: res.data.url });
      }
      
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error(error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const submitAsset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/api/incubation/assets/${editingId}`, assetForm, {
           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        alert('Asset updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/api/incubation/assets`, assetForm, {
           headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        alert('Asset added successfully!');
      }
      setAssetModalOpen(false);
      setEditingId(null);
      setAssetForm({
        name: '', modelNumber: '', serialNumber: '', assetTag: '', category: 'Hardware', department: 'Incubation', 
        type: 'Equipment', status: 'Available', description: '', location: '', stock: 1, available: 1, 
        image: '', galleryImages: [], videoUrls: [], manualUrl: '', 
        purchaseDate: '', warrantyExpiry: '', cost: '', supplier: '', 
        requiresMaintenance: false, allowOvernight: false, icon: 'Package'
      });
      setAssetFormTab('basic');
      fetchAssets();
    } catch (error) {
      console.error(error);
      alert('Failed to save asset');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAsset = (asset) => {
    setAssetForm({ ...asset });
    setEditingId(asset.id);
    setAssetModalOpen(true);
    setAssetFormTab('basic');
  };

  const deleteAsset = async (id) => {
    if (window.confirm("Are you sure you want to delete this asset?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/incubation/assets/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchAssets();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const submitProgram = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/api/incubation/programs/${editingId}`, programForm, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        alert('Program/Event updated successfully!');
      } else {
        await axios.post(`${API_BASE_URL}/api/incubation/programs`, programForm, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        alert('Program/Event created successfully!');
      }
      setProgramModalOpen(false);
      setEditingId(null);
      setProgramForm({ 
        name: '', description: '', requirements: '', duration: '', applicationDeadline: '', 
        status: 'Active', benefits: '', type: 'Program', date: '', location: '', speaker: '', image: ''
      });
      fetchPrograms();
    } catch (error) {
      console.error(error);
      alert('Failed to save program');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProgram = (prog) => {
    setProgramForm({ 
      ...prog,
      applicationDeadline: prog.applicationDeadline ? prog.applicationDeadline.split('T')[0] : ''
    });
    setEditingId(prog.id);
    setProgramModalOpen(true);
  };

  const deleteProgram = async (id) => {
    if (window.confirm("Are you sure you want to delete this program/event?")) {
       try {
          await axios.delete(`${API_BASE_URL}/api/incubation/programs/${id}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          fetchPrograms();
       } catch (error) {
          console.error("Failed to delete", error);
       }
    }
  };

  const updateProjectStatus = async (id, status) => {
    try {
        await axios.put(`${API_BASE_URL}/api/incubation/projects/${id}/status`, { status }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchProjects();
    } catch (err) {
        console.error("Failed to update status");
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
                      {projects.map(app => (
                        <tr key={app.id} className="hover:bg-slate-50/50 transition">
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-800">{app.projectName}</div>
                            <div className="text-slate-500 text-xs">By {app.Submitter?.fullName || 'Student'}</div>
                          </td>
                          <td className="px-6 py-4">
                             <span className="px-2.5 py-1 bg-slate-100 rounded-md text-xs font-medium text-slate-600 border border-slate-200">{app.category}</span>
                          </td>
                          <td className="px-6 py-4 text-slate-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-max ${app.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : app.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                               {app.status === 'Approved' ? <CheckCircle2 size={12} /> : app.status === 'Rejected' ? <XCircle size={12} /> : <FileText size={12} />} {app.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => setViewingItem({...app, type: 'project'})}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" 
                                title="View Proposal"
                              >
                                <Eye size={18} />
                              </button>
                              <button onClick={() => updateProjectStatus(app.id, 'Approved')} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="Approve"><CheckCircle2 size={18} /></button>
                              <button onClick={() => updateProjectStatus(app.id, 'Rejected')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Reject"><XCircle size={18} /></button>
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
                        <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                           <button onClick={() => setViewingItem({ ...story, type: 'story' })} title="View Story" className="w-8 h-8 bg-white/90 backdrop-blur text-slate-600 rounded-full flex items-center justify-center hover:bg-slate-50 hover:text-slate-800 transition shadow-sm border border-slate-100">
                             <Eye size={14} />
                           </button>
                           <button onClick={() => handleEditStory(story)} title="Edit Story" className="w-8 h-8 bg-white/90 backdrop-blur text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-50 hover:text-blue-700 transition shadow-sm border border-blue-100">
                             <PencilLine size={14} />
                           </button>
                           <button onClick={() => deleteStory(story.id)} title="Delete Story" className="w-8 h-8 bg-white/90 backdrop-blur text-red-600 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-700 transition shadow-sm border border-red-100">
                             <Trash2 size={14} />
                           </button>
                        </div>

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
                <div className="flex gap-2">
                   <button 
                      onClick={() => {
                        setProgramForm({ ...programForm, type: 'Program' });
                        setProgramModalOpen(true);
                      }}
                      className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition"
                   >
                     <Plus size={16} /> New Program
                   </button>
                   <button 
                      onClick={() => {
                        setProgramForm({ ...programForm, type: 'Event' });
                        setProgramModalOpen(true);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
                   >
                     <Plus size={16} /> New Event
                   </button>
                </div>
            </div>

            {programs.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-slate-300 rounded-xl bg-white text-slate-500">
                <Calendar size={48} className="mx-auto mb-4 text-slate-300" />
                <p className="font-semibold text-slate-700">Calendar Empty</p>
                <p className="text-sm">Manage duration, deadlines, and benefits of incubation programs here.</p>
              </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {programs.map(prog => (
                      <div key={prog.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative group">
                         <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition z-10">
                            <button onClick={() => setViewingItem({ ...prog, type: 'program' })} title="View Details" className="p-2 bg-white/90 backdrop-blur shadow-sm rounded-full text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition">
                               <Eye size={14} />
                            </button>
                            <button onClick={() => handleEditProgram(prog)} className="p-2 bg-white/90 backdrop-blur shadow-sm rounded-full text-blue-600 hover:bg-blue-600 hover:text-white transition">
                               <PencilLine size={14} />
                            </button>
                            <button onClick={() => deleteProgram(prog.id)} className="p-2 bg-white/90 backdrop-blur shadow-sm rounded-full text-red-600 hover:bg-red-600 hover:text-white transition">
                               <Trash2 size={14} />
                            </button>
                         </div>
                         <div className="flex items-center gap-3 mb-4">
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${prog.type === 'Event' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
                               {prog.type}
                            </span>
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-600`}>
                               {prog.status}
                            </span>
                         </div>
                         <h4 className="text-lg font-bold text-slate-800 mb-2">{prog.name}</h4>
                         <p className="text-sm text-slate-500 line-clamp-2 mb-4">{prog.description}</p>
                         
                         <div className="space-y-2 pt-4 border-t border-slate-50">
                            {prog.type === 'Program' ? (
                               <div className="flex justify-between text-xs">
                                  <span className="text-slate-400">Deadline:</span>
                                  <span className="font-semibold text-slate-700">{prog.applicationDeadline ? new Date(prog.applicationDeadline).toLocaleDateString() : 'N/A'}</span>
                               </div>
                            ) : (
                               <div className="flex justify-between text-xs">
                                  <span className="text-slate-400">Date/Time:</span>
                                  <span className="font-semibold text-slate-700">{prog.date || 'To be announced'}</span>
                               </div>
                            )}
                            <div className="flex justify-between text-xs">
                               <span className="text-slate-400">{prog.type === 'Program' ? 'Duration:' : 'Location:'}</span>
                               <span className="font-semibold text-slate-700">{prog.type === 'Program' ? prog.duration : prog.location}</span>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
            )}
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
               <button 
                  onClick={() => setAssetModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
               >
                 <Plus size={16} /> Add Asset
               </button>
            </div>

            {assets.length === 0 ? (
               <div className="p-8 text-center border-2 border-dashed border-slate-300 rounded-xl bg-white text-slate-500">
                  <PackageSearch size={48} className="mx-auto mb-4 text-slate-300" />
                  <p className="font-semibold text-slate-700">Manage Incubation Inventory</p>
                  <p className="text-sm">Approve or reject student requests for cloud credits and hardware access.</p>
               </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assets.map(asset => (
                        <div key={asset.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative group">
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                               <button onClick={() => setViewingItem({ ...asset, type: 'asset' })} title="View Asset" className="p-2 bg-white/90 backdrop-blur shadow-sm rounded-full text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition">
                                   <Eye size={14} />
                               </button>
                               <button onClick={() => handleEditAsset(asset)} className="p-2 bg-white/90 backdrop-blur shadow-sm rounded-full text-blue-600 hover:bg-blue-600 hover:text-white transition">
                                   <PencilLine size={14} />
                               </button>
                               <button onClick={() => deleteAsset(asset.id)} className="p-2 bg-white/90 backdrop-blur shadow-sm rounded-full text-red-600 hover:bg-red-600 hover:text-white transition">
                                   <Trash2 size={14} />
                               </button>
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest bg-blue-50 text-blue-700">
                                    {asset.category}
                                </span>
                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${asset.status === 'Available' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                    {asset.status}
                                </span>
                            </div>
                            
                            {asset.image && (
                                <img src={asset.image} alt={asset.name} className="w-full h-24 object-cover rounded-lg mb-3 border border-slate-100" />
                            )}
                            
                            <h4 className="text-lg font-bold text-slate-800 mb-1">{asset.name}</h4>
                            <p className="text-sm text-slate-500 mb-4 line-clamp-2">{asset.description}</p>
                            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                <span>{asset.type}</span>
                                <span>Qty: {asset.stock}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </div>
        );

      case 'requests':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <div>
                  <h3 className="text-xl font-bold text-slate-800">Resource Requests</h3>
                  <p className="text-slate-500 text-sm">Review detailed formal applications for equipment and facility usage.</p>
               </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                   <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-xs py-3">
                     <tr>
                       <th className="px-6 py-4">Student</th>
                       <th className="px-6 py-4">Item Requested</th>
                       <th className="px-6 py-4">Duration</th>
                       <th className="px-6 py-4">Status</th>
                       <th className="px-6 py-4 text-right">Actions</th>
                     </tr>
                   </thead>
                    <tbody className="divide-y divide-slate-100">
                      {reservations.map(req => (
                        <tr key={req.id} className="hover:bg-slate-50/50 transition">
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-800">{req.User?.fullName}</div>
                            <div className="text-slate-500 text-xs">{req.studentRegNumber} • {req.department}</div>
                          </td>
                          <td className="px-6 py-4">
                             <div className="font-medium text-slate-700">{req.IncubationAsset?.name || req.Equipment?.name}</div>
                             <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">{req.IncubationAsset?.category || req.Equipment?.category}</div>
                          </td>
                          <td className="px-6 py-4">
                             <div className="text-slate-600 font-medium">{new Date(req.startDate).toLocaleDateString()}</div>
                             <div className="text-[10px] text-slate-400 font-bold uppercase">To {new Date(req.endDate).toLocaleDateString()}</div>
                          </td>
                          <td className="px-6 py-4">
                             <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider w-max flex items-center gap-1.5 ${req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : req.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                {req.status === 'Approved' ? <CheckCircle2 size={12} /> : req.status === 'Rejected' ? <XCircle size={12} /> : <Clock size={12} className="animate-spin-slow" />} {req.status}
                             </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => setViewingItem({ ...req, type: 'request' })} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="View Full Application"><Eye size={18} /></button>
                              {req.status === 'Pending' && (
                                <>
                                  <button onClick={() => updateReservationStatus(req.id, 'Approved')} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="Approve Request"><CheckCircle2 size={18} /></button>
                                  <button onClick={() => updateReservationStatus(req.id, 'Rejected')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Reject Request"><XCircle size={18} /></button>
                                </>
                              )}
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
          onClick={() => setActiveTab('requests')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === 'requests' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-blue-200 hover:text-blue-600'}`}
        >
          <PackageSearch size={18} /> Asset Requests
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
                 <h2 className="text-xl font-bold text-slate-800">{editingId ? 'Edit Success Story' : 'Publish Success Story'}</h2>
                 <button onClick={() => { setStoryModalOpen(false); setEditingId(null); }} className="text-slate-400 hover:text-slate-600">
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
                           <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Image (URL or Local)</label>
                           <div className="flex gap-2">
                              <input type="url" placeholder="https://..." value={storyForm.image} onChange={(e) => setStoryForm({...storyForm, image: e.target.value})} className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                              <label className="cursor-pointer px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition text-slate-600 flex items-center justify-center">
                                 <Plus size={18} />
                                 <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'story')} />
                              </label>
                           </div>
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
                 <button onClick={() => { setStoryModalOpen(false); setEditingId(null); }} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-100">Cancel</button>
                 <button type="submit" form="storyForm" disabled={loading} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50 shadow-md">
                    <UploadCloud size={18} /> {loading ? 'Saving...' : (editingId ? 'Update Story' : 'Publish Story')}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Program/Event Modal */}
      {programModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                 <h2 className="text-xl font-bold text-slate-800">{editingId ? 'Modify' : 'Configure'} {programForm.type}</h2>
                 <button onClick={() => { setProgramModalOpen(false); setEditingId(null); }} className="text-slate-400 hover:text-slate-600">
                    <X size={24} />
                 </button>
              </div>

              <div className="p-6 overflow-y-auto">
                 <form id="programForm" onSubmit={submitProgram} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Type</label>
                          <select 
                            value={programForm.type} 
                            onChange={(e) => setProgramForm({...programForm, type: e.target.value})} 
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Program">Incubation Program</option>
                            <option value="Event">Community Event</option>
                          </select>
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{programForm.type} Title</label>
                          <input type="text" required value={programForm.name} onChange={(e) => setProgramForm({...programForm, name: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                       </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Description</label>
                        <textarea required rows="3" value={programForm.description} onChange={(e) => setProgramForm({...programForm, description: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
                    </div>

                    {programForm.type === 'Program' ? (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Duration</label>
                              <input type="text" placeholder="e.g. 8 Weeks, 6 Months" value={programForm.duration} onChange={(e) => setProgramForm({...programForm, duration: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Application Deadline</label>
                              <input type="date" value={programForm.applicationDeadline} onChange={(e) => setProgramForm({...programForm, applicationDeadline: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          </div>
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Requirements & Benefits</label>
                           <textarea placeholder="List key eligibility or perks..." rows="2" value={programForm.benefits} onChange={(e) => setProgramForm({...programForm, benefits: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Date & Time</label>
                              <input type="text" placeholder="e.g. March 15, 2:00 PM" value={programForm.date} onChange={(e) => setProgramForm({...programForm, date: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Location</label>
                              <input type="text" placeholder="e.g. Virtual, Hub A..." value={programForm.location} onChange={(e) => setProgramForm({...programForm, location: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          </div>
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Guest Speaker / Host</label>
                           <input type="text" value={programForm.speaker} onChange={(e) => setProgramForm({...programForm, speaker: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                      </>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Thumbnail Media</label>
                           <div className="flex gap-2">
                              <input type="url" placeholder="https://..." value={programForm.image} onChange={(e) => setProgramForm({...programForm, image: e.target.value})} className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                              <label className="cursor-pointer px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition text-slate-600 flex items-center justify-center">
                                 <Plus size={18} />
                                 <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'program')} />
                              </label>
                           </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Status</label>
                            <select 
                              value={programForm.status} 
                              onChange={(e) => setProgramForm({...programForm, status: e.target.value})} 
                              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="Active">Active / Accepting</option>
                              <option value="Upcoming">Upcoming</option>
                              <option value="Closed">Closed</option>
                            </select>
                         </div>
                      </div>
                 </form>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                 <button onClick={() => { setProgramModalOpen(false); setEditingId(null); }} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-100">Cancel</button>
                 <button type="submit" form="programForm" disabled={loading} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50 shadow-md">
                    <UploadCloud size={18} /> {loading ? 'Saving...' : (editingId ? 'Update' : 'Schedule')}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Add Asset Modal */}
      {assetModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                       <Plus size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-bold text-slate-800">{editingId ? 'Asset Specification' : 'Catalog Manager'}</h3>
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{editingId ? 'Modify existing equipment details' : 'Register new institutional assets with full specifications.'}</p>
                    </div>
                 </div>
                 <button onClick={() => { setAssetModalOpen(false); setEditingId(null); }} className="p-2 hover:bg-slate-200 rounded-full transition text-slate-400">
                    <X size={20} />
                 </button>
              </div>

              <div className="flex flex-col md:flex-row min-h-[500px]">
                 {/* Asset Modal Sidebar */}
                 <div className="w-full md:w-64 bg-slate-50/50 border-r border-slate-100 p-6 space-y-2">
                    {[
                      { id: 'basic', label: 'Basic Info', icon: FileText },
                      { id: 'media', label: 'Media & Docs', icon: Image },
                      { id: 'inventory', label: 'Inventory & Value', icon: DollarSign },
                      { id: 'policy', label: 'Policy & Status', icon: Settings },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setAssetFormTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${assetFormTab === tab.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
                      >
                         <tab.icon size={18} />
                         {tab.label}
                      </button>
                    ))}
                 </div>

                 {/* Asset Modal Content */}
                 <div className="flex-1 p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    <form id="assetForm" onSubmit={submitAsset} className="space-y-6">
                       
                       {assetFormTab === 'basic' && (
                          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Equipment Name</label>
                                   <input type="text" required value={assetForm.name} onChange={(e) => setAssetForm({...assetForm, name: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Solar PV Training System" />
                                </div>
                                <div>
                                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Model Number</label>
                                   <input type="text" value={assetForm.modelNumber} onChange={(e) => setAssetForm({...assetForm, modelNumber: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="SUN-TRAIN-01" />
                                </div>
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Category</label>
                                   <input type="text" value={assetForm.category} onChange={(e) => setAssetForm({...assetForm, category: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Photography" />
                                </div>
                                <div>
                                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Department</label>
                                   <input type="text" value={assetForm.department} onChange={(e) => setAssetForm({...assetForm, department: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Media Arts" />
                                </div>
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Serial Number</label>
                                   <input type="text" value={assetForm.serialNumber} onChange={(e) => setAssetForm({...assetForm, serialNumber: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="SN-10293845" />
                                </div>
                                <div>
                                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Asset Tag ID</label>
                                   <input type="text" value={assetForm.assetTag} onChange={(e) => setAssetForm({...assetForm, assetTag: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="TAG-SOL-001" />
                                </div>
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Detailed Description</label>
                                <textarea required rows="4" value={assetForm.description} onChange={(e) => setAssetForm({...assetForm, description: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Technical specifications, key features and usage instructions..."></textarea>
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Display Icon Name</label>
                                <input type="text" value={assetForm.icon} onChange={(e) => setAssetForm({...assetForm, icon: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Laptop, Camera, Wifi" />
                                <p className="text-[10px] text-slate-400 mt-1">Reference a Lucide icon identifier.</p>
                             </div>
                          </div>
                       )}

                       {assetFormTab === 'media' && (
                          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                             <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Featured Imaging</label>
                                <div className="flex gap-4">
                                   {assetForm.image ? (
                                      <div className="relative w-40 h-40 group">
                                         <img src={assetForm.image} alt="Preview" className="w-full h-full object-cover rounded-xl border border-slate-200" />
                                         <button 
                                           onClick={() => setAssetForm({...assetForm, image: ''})}
                                           className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg"
                                         >
                                            <Trash2 size={14} />
                                         </button>
                                      </div>
                                   ) : (
                                      <label className="w-40 h-40 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all text-slate-400">
                                         <UploadCloud size={32} />
                                         <span className="text-xs font-bold">Upload Media</span>
                                         <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                      </label>
                                   )}
                                   <div className="flex-1">
                                      <label className="block text-xs font-bold text-slate-400 mb-1">Manual Content Link (PDF/URL)</label>
                                      <input type="url" value={assetForm.manualUrl} onChange={(e) => setAssetForm({...assetForm, manualUrl: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" placeholder="https://manuals.com/item.pdf" />
                                      <label className="block text-xs font-bold text-slate-400 mb-1">External Direct Link</label>
                                      <input type="url" value={assetForm.image} onChange={(e) => setAssetForm({...assetForm, image: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://images.com/photo.jpg" />
                                   </div>
                                </div>
                                {uploading && <p className="text-[10px] text-blue-500 mt-2 animate-pulse">Processing media upload...</p>}
                             </div>
                          </div>
                       )}

                       {assetFormTab === 'inventory' && (
                          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Inventory Quantity</label>
                                   <input type="number" min="1" value={assetForm.stock} onChange={(e) => setAssetForm({...assetForm, stock: parseInt(e.target.value), available: parseInt(e.target.value)})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Unit Asset Value (USD)</label>
                                   <input type="number" value={assetForm.cost} onChange={(e) => setAssetForm({...assetForm, cost: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0.00" />
                                </div>
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Procurement Date</label>
                                   <input type="date" value={assetForm.purchaseDate} onChange={(e) => setAssetForm({...assetForm, purchaseDate: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Warranty Expiration</label>
                                   <input type="date" value={assetForm.warrantyExpiry} onChange={(e) => setAssetForm({...assetForm, warrantyExpiry: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Primary Supplier / Vendor</label>
                                <input type="text" value={assetForm.supplier} onChange={(e) => setAssetForm({...assetForm, supplier: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Amazon Business, Local Vendor" />
                             </div>
                          </div>
                       )}

                       {assetFormTab === 'policy' && (
                          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Real-time Status</label>
                                   <select value={assetForm.status} onChange={(e) => setAssetForm({...assetForm, status: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                      <option value="Available">Available</option>
                                      <option value="In Use">In Use</option>
                                      <option value="Maintenance">Maintenance</option>
                                      <option value="Inactive">Disposed / Inactive</option>
                                   </select>
                                </div>
                                <div>
                                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Asset Mapping (Location)</label>
                                   <input type="text" value={assetForm.location} onChange={(e) => setAssetForm({...assetForm, location: e.target.value})} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Innovation Lab, Shelf A-12" />
                                </div>
                             </div>
                             <div className="space-y-4 pt-4 border-t border-slate-100">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                   <div className={`w-5 h-5 rounded border ${assetForm.requiresMaintenance ? 'bg-blue-600 border-blue-600' : 'bg-slate-100 border-slate-200' + ' flex items-center justify-center transition-all group-hover:border-blue-400'}`}>
                                      {assetForm.requiresMaintenance && <Check size={14} className="text-white" />}
                                   </div>
                                   <input type="checkbox" className="hidden" checked={assetForm.requiresMaintenance} onChange={(e) => setAssetForm({...assetForm, requiresMaintenance: e.target.checked})} />
                                   <span className="text-sm font-bold text-slate-700">Flag for Periodic Maintenance</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                   <div className={`w-5 h-5 rounded border ${assetForm.allowOvernight ? 'bg-blue-600 border-blue-600' : 'bg-slate-100 border-slate-200' + ' flex items-center justify-center transition-all group-hover:border-blue-400'}`}>
                                      {assetForm.allowOvernight && <Check size={14} className="text-white" />}
                                   </div>
                                   <input type="checkbox" className="hidden" checked={assetForm.allowOvernight} onChange={(e) => setAssetForm({...assetForm, allowOvernight: e.target.checked})} />
                                   <span className="text-sm font-bold text-slate-700">Allow Overnight Incubation Reservations</span>
                                </label>
                             </div>
                          </div>
                       )}
                    </form>
                 </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                 <button onClick={() => { setAssetModalOpen(false); setEditingId(null); setAssetFormTab('basic'); }} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-100">Discard</button>
                 <button type="submit" form="assetForm" disabled={loading} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-500/30">
                    <Plus size={18} /> {loading ? 'Processing...' : (editingId ? 'Save Changes' : 'Register Asset')}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Asset Detail View */}
      {viewingItem && viewingItem.type === 'asset' && (
        <EquipmentDetailsModal 
          isOpen={!!viewingItem} 
          onClose={() => setViewingItem(null)} 
          equipment={viewingItem} 
          readOnly={true} 
        />
      )}

      {/* Story Detail View */}
      <AnimatePresence>
        {viewingItem && viewingItem.type === 'story' && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="relative h-64">
                <img src={viewingItem.image || "https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"} className="w-full h-full object-cover" alt={viewingItem.projectName} />
                <button onClick={() => setViewingItem(null)} className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition">
                  <X size={20} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                  <h2 className="text-3xl font-bold text-white">{viewingItem.projectName}</h2>
                  <p className="text-blue-300 font-semibold">Founder: {viewingItem.studentName}</p>
                </div>
              </div>
              <div className="p-8 overflow-y-auto">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                       <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">The Journey</h4>
                          <p className="text-slate-600 leading-relaxed text-sm">{viewingItem.description}</p>
                       </div>
                       <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Key Achievements</h4>
                          <div className="grid grid-cols-1 gap-2">
                             {viewingItem.achievements && viewingItem.achievements.split(',').map((item, idx) => (
                               <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                     <Check size={14} />
                                  </div>
                                  <span className="text-sm font-semibold text-slate-700">{item.trim()}</span>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                    <div className="space-y-6">
                       <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Status Overview</h4>
                          <div className="space-y-4">
                             <div>
                                <span className="block text-[10px] font-bold text-slate-400">Class</span>
                                <span className="font-bold text-slate-700">{viewingItem.graduationYear}</span>
                             </div>
                             <div>
                                <span className="block text-[10px] font-bold text-slate-400">Company Phase</span>
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold">{viewingItem.companyStatus}</span>
                             </div>
                             <div>
                                <span className="block text-[10px] font-bold text-slate-400">Industry Tags</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                   {viewingItem.tags && viewingItem.tags.split(',').map((tag, idx) => (
                                     <span key={idx} className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-[10px] font-medium">{tag.trim()}</span>
                                   ))}
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Program Detail View */}
      <AnimatePresence>
        {viewingItem && viewingItem.type === 'program' && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="relative h-48 bg-blue-600">
                {viewingItem.image && (
                    <img src={viewingItem.image} className="w-full h-full object-cover opacity-60" alt={viewingItem.name} />
                )}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold uppercase tracking-widest rounded-full w-max mb-3">
                    {viewingItem.type} Details
                  </span>
                  <h2 className="text-3xl font-bold text-white">{viewingItem.name}</h2>
                </div>
                <button onClick={() => setViewingItem(null)} className="absolute top-4 right-4 p-2 bg-white/20 text-white rounded-full hover:bg-white/40 transition">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 overflow-y-auto space-y-8">
                 <div className="flex gap-8 items-start">
                    <div className="flex-1 space-y-6">
                       <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Overview</h4>
                          <p className="text-slate-600 text-sm leading-relaxed">{viewingItem.description}</p>
                       </div>
                       {viewingItem.benefits && (
                          <div>
                             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Benefits & Perk</h4>
                             <p className="text-slate-600 text-sm leading-relaxed">{viewingItem.benefits}</p>
                          </div>
                       )}
                    </div>
                    <div className="w-64 space-y-4">
                       <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
                          {viewingItem.type === 'Program' ? (
                             <>
                                <div>
                                   <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Duration</label>
                                   <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                                      <Calendar size={14} className="text-blue-500" /> {viewingItem.duration}
                                   </div>
                                </div>
                                <div>
                                   <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Deadline</label>
                                   <div className="text-red-500 font-bold text-sm">
                                      {viewingItem.applicationDeadline ? new Date(viewingItem.applicationDeadline).toLocaleDateString() : 'TBD'}
                                   </div>
                                </div>
                             </>
                          ) : (
                             <>
                                <div>
                                   <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Date & Time</label>
                                   <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                                      <Calendar size={14} className="text-blue-500" /> {viewingItem.date}
                                   </div>
                                </div>
                                <div>
                                   <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Venue</label>
                                   <div className="text-slate-700 font-bold text-sm">{viewingItem.location}</div>
                                </div>
                             </>
                          )}
                          <div>
                             <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Current Status</label>
                             <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${viewingItem.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                {viewingItem.status}
                             </span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Request Detail View */}
      <AnimatePresence>
        {viewingItem && viewingItem.type === 'request' && (
          {/* ... existing request modal ... */}
        )}
      </AnimatePresence>

      {/* Project Idea Detail View */}
      <AnimatePresence>
        {viewingItem && viewingItem.type === 'project' && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                       <Lightbulb size={24} />
                    </div>
                    <div>
                       <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Startup Pitch Review</h2>
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Evaluation of innovative student initiative</p>
                    </div>
                 </div>
                 <button onClick={() => setViewingItem(null)} className="p-2 hover:bg-slate-200 rounded-full transition text-slate-400">
                    <X size={24} />
                 </button>
              </div>

              <div className="p-8 overflow-y-auto">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                             <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Project Identifier</span>
                             <span className="text-lg font-black text-slate-800 tracking-tight">{viewingItem.projectName}</span>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                             <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Lead Founder</span>
                             <span className="text-md font-bold text-slate-700">{viewingItem.Submitter?.fullName || 'Academic User'}</span>
                             <div className="text-[10px] font-medium text-slate-400">{viewingItem.Submitter?.email}</div>
                          </div>
                       </div>

                       <div className="space-y-6">
                          <div>
                             <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <AlertCircle size={14} className="text-amber-500" /> Executive Problem Statement
                             </h4>
                             <div className="p-5 bg-white border border-slate-200 rounded-2xl text-sm text-slate-600 leading-relaxed shadow-sm">
                                {viewingItem.problemStatement}
                             </div>
                          </div>

                          <div>
                             <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Sparkles size={14} className="text-indigo-500" /> Proposed Technological Solution
                             </h4>
                             <div className="p-5 bg-indigo-50/30 border border-indigo-100 rounded-2xl text-sm text-slate-700 leading-relaxed">
                                {viewingItem.proposedSolution}
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div className="p-5 bg-slate-900 rounded-3xl text-white shadow-xl">
                          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Meta Data</h4>
                          <div className="space-y-5">
                             <div>
                                <span className="block text-[10px] font-bold text-slate-500 mb-1">Sector Class</span>
                                <span className="px-2 py-0.5 bg-blue-600 text-white rounded text-[10px] font-black uppercase tracking-widest">{viewingItem.category}</span>
                             </div>
                             <div>
                                <span className="block text-[10px] font-bold text-slate-500 mb-1">Initial Description</span>
                                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{viewingItem.description}</p>
                             </div>
                             <div className="pt-4 border-t border-white/10 space-y-4">
                                <div>
                                   <span className="block text-[10px] font-bold text-slate-500 mb-2">Team Assembly</span>
                                   <div className="text-[11px] font-bold text-slate-200 bg-white/5 p-3 rounded-xl border border-white/10">
                                      {viewingItem.teamMembers || "Solo Founder Operation"}
                                   </div>
                                </div>
                                
                                {viewingItem.externalLink && (
                                   <div>
                                      <span className="block text-[10px] font-bold text-slate-500 mb-2">Pitch/MVP Link</span>
                                      <a href={viewingItem.externalLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-[11px] font-bold">
                                         <Globe size={14} /> View External Asset
                                      </a>
                                   </div>
                                )}

                                {viewingItem.documentUrl && (
                                   <div>
                                      <span className="block text-[10px] font-bold text-slate-500 mb-2">Attached Document</span>
                                      <a href={viewingItem.documentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors text-[11px] font-bold">
                                         <FileText size={14} /> Download Pitch Deck
                                      </a>
                                   </div>
                                )}
                             </div>
                          </div>
                       </div>

                       {viewingItem.status === 'Pending' && (
                          <div className="space-y-3 pt-2">
                             <button 
                               onClick={() => { updateProjectStatus(viewingItem.id, 'Approved'); setViewingItem(null); }}
                               className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/20 text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                             >
                               <Check size={16} /> Endorse Project
                             </button>
                             <button 
                               onClick={() => { updateProjectStatus(viewingItem.id, 'Rejected'); setViewingItem(null); }}
                               className="w-full py-4 bg-white border border-red-200 text-red-600 rounded-2xl font-bold hover:bg-red-50 transition text-xs uppercase tracking-widest"
                             >
                               Decline Initiative
                             </button>
                          </div>
                       )}
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageIncubation;
