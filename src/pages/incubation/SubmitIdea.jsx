import React, { useState, useEffect } from 'react';
import { Lightbulb, Send, FileUp, Info, CheckCircle2, Target, Users, Rocket, Sparkles, Loader2, AlertCircle, Calendar, Link2, Globe, FileText, X } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import API_BASE_URL from '../../config/api';


const SubmitIdea = () => {
  const [formData, setFormData] = useState({
    projectName: '',
    category: '',
    teamMembers: '',
    problemStatement: '',
    proposedSolution: '',
    description: '',
    programId: '',
    documentUrl: '',
    externalLink: ''
  });
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingPrograms, setFetchingPrograms] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/incubation/programs`);
        setPrograms(res.data.filter(p => p.status === 'Active'));
      } catch (err) {
        console.error("Error fetching programs", err);
      } finally {
        setFetchingPrograms(false);
      }
    };
    fetchPrograms();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadLoading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_BASE_URL}/api/upload`, formDataUpload, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        }
      });
      setFormData(prev => ({ ...prev, documentUrl: res.data.url }));
      setUploadedFile({ name: file.name, size: file.size });
    } catch (err) {
      setError("File upload failed. Please try again.");
    } finally {
      setUploadLoading(false);
    }
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, documentUrl: '' }));
    setUploadedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/incubation/projects`, {
        ...formData,
        description: formData.problemStatement.substring(0, 100) + '...'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit initiative. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-xl shadow-emerald-500/5 border border-emerald-100 p-12 text-center max-w-2xl mx-auto mt-10"
      >
        <div className="w-24 h-24 bg-emerald-100/50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
           <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4 tracking-tight uppercase">Idea Transmitted!</h2>
        <p className="text-slate-500 mb-8 leading-relaxed text-lg">
          Your initiative "<span className="font-bold text-slate-800">{formData.projectName}</span>" has been successfully logged in our ecosystem. The Hub managers will review your pitch shortly.
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/20 uppercase tracking-widest text-sm"
        >
          Submit Another Pitch
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Dynamic Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group"
      >
         <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
            <Rocket size={180} className="rotate-12" />
         </div>
         
         <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shrink-0 shadow-xl shadow-blue-500/40 border border-blue-400/30">
               <Sparkles size={40} className="text-white" />
            </div>
            <div>
               <h2 className="text-4xl font-black mb-3 tracking-tighter uppercase">Launch Your Vision</h2>
               <p className="text-slate-400 max-w-2xl font-medium text-lg leading-relaxed">
                 Transform your innovative concept into a sustainable venture. Successful applicants unlock elite mentorship, strategic funding, and premium workspace.
               </p>
            </div>
         </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Guidance Sidebar */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-8">
              <div>
                 <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Application Guide</h4>
                 <div className="space-y-6">
                    <div className="flex gap-4">
                       <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 font-bold text-xs">01</div>
                       <div>
                          <p className="font-bold text-slate-800 text-sm">Define the Problem</p>
                          <p className="text-xs text-slate-500 mt-1">Focus on a specific, real-world pain point that needs solving.</p>
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 font-bold text-xs">02</div>
                       <div>
                          <p className="font-bold text-slate-800 text-sm">Draft the Solution</p>
                          <p className="text-xs text-slate-500 mt-1">Explain how your technology or approach addresses that problem.</p>
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 font-bold text-xs">03</div>
                       <div>
                          <p className="font-bold text-slate-800 text-sm">Team Dynamics</p>
                          <p className="text-xs text-slate-500 mt-1">Diversity in skills (Dev, UI, Business) increases success probability.</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="pt-8 border-t border-slate-100">
                 <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100/50">
                    <div className="flex items-center gap-2 text-blue-700 mb-2">
                       <Info size={16} />
                       <span className="text-[10px] font-black uppercase tracking-widest">Confidentiality</span>
                    </div>
                    <p className="text-[11px] text-blue-800/70 leading-relaxed font-medium">
                       Intellectual Property remains with the creators. The Hub acting as a catalyst for your growth through strategic partnership.
                    </p>
                 </div>
              </div>
           </div>
        </div>

        {/* Professional Pitch Form */}
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-10"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                   <Calendar size={12} /> Target Program / Initiative
                </label>
                <select
                  required
                  name="programId"
                  value={formData.programId}
                  onChange={handleChange}
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 appearance-none pointer"
                >
                  <option value="">Select an Active Program</option>
                  {programs.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
                  ))}
                </select>
                {fetchingPrograms && <p className="text-[9px] text-blue-500 font-bold animate-pulse px-1">Synchronizing available programs...</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                    <Target size={12} /> Project/Startup Name
                  </label>
                  <input 
                    required
                    type="text" 
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleChange}
                    placeholder="e.g. SmartAgri Pro"
                    className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                    <Rocket size={12} /> Industry Sector
                  </label>
                  <select
                    required
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 appearance-none pointer"
                  >
                    <option value="">Select Category</option>
                    <option value="EdTech">Education Technology</option>
                    <option value="AgriTech">Agriculture Technology</option>
                    <option value="HealthTech">Digital Health/MedTech</option>
                    <option value="FinTech">Financial Solutions</option>
                    <option value="IoT/Hardware">Hardware & Embedded Systems</option>
                    <option value="Software/SaaS">SaaS & Enterprise Software</option>
                    <option value="Other">Other Category</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                   <Users size={12} /> Foundational Team Members
                </label>
                <div className="relative group">
                   <input 
                     type="text" 
                     name="teamMembers"
                     value={formData.teamMembers}
                     onChange={handleChange}
                     placeholder="Comma separated names and roles (e.g. Elie - CEO, Jane - CTO)"
                     className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-700"
                   />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                   <AlertCircle size={12} /> The Problem Statement
                </label>
                <textarea 
                  required
                  name="problemStatement"
                  value={formData.problemStatement}
                  onChange={handleChange}
                  rows="4"
                  placeholder="What gap in the market or society are you addressing?"
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-700 resize-none shadow-inner"
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                   <Lightbulb size={12} /> Your Disruptive Solution
                </label>
                <textarea 
                  required
                  name="proposedSolution"
                  value={formData.proposedSolution}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Detail your UVP (Unique Value Proposition)..."
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-700 resize-none shadow-inner"
                ></textarea>
              </div>

              <div className="space-y-6 pt-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                      <Link2 size={12} /> External Link (Optional)
                   </label>
                   <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center text-slate-400">
                         <Globe size={16} />
                      </div>
                      <input 
                        type="url" 
                        name="externalLink"
                        value={formData.externalLink}
                        onChange={handleChange}
                        placeholder="Link to Pitch Deck, MVP Demo, or Website"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-700"
                      />
                   </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                     <FileUp size={12} /> Support Assets & Documentation
                  </label>
                  
                  {uploadedFile ? (
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700 line-clamp-1">{uploadedFile.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • READY</p>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={removeFile}
                        className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div 
                      onClick={() => document.getElementById('file-upload').click()}
                      className="w-full group"
                    >
                       <input 
                         id="file-upload" 
                         type="file" 
                         className="hidden" 
                         onChange={handleFileUpload}
                         accept=".pdf,.pptx,.docx,.jpg,.png"
                       />
                       <div className={`border-2 border-dashed ${uploadLoading ? 'border-blue-300 bg-blue-50/20' : 'border-slate-200 bg-slate-50/50'} rounded-3xl p-8 text-center group-hover:bg-blue-50/50 group-hover:border-blue-200 transition-all cursor-pointer relative overflow-hidden`}>
                          {uploadLoading && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                              <Loader2 className="animate-spin text-blue-600" size={32} />
                            </div>
                          )}
                          <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                             <FileUp size={24} className="text-slate-400 group-hover:text-blue-500" />
                          </div>
                          <p className="text-slate-700 font-bold text-sm mb-1">Click to Upload Venture Assets</p>
                          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Pitch Decks, Business Plans (Max 100MB)</p>
                       </div>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                 <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600">
                    <AlertCircle size={18} />
                    <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
                 </div>
              )}

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                 <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                    Formal Submission v2.0
                 </div>
                 <button 
                  type="submit" 
                  disabled={loading}
                  className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/30 flex items-center gap-3 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 uppercase tracking-widest text-sm"
                 >
                   {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />} Proceed with Pitch
                 </button>
              </div>

            </form>
          </motion.div>
        </div>
      </div>

    </div>
  );
};

export default SubmitIdea;
