import React, { useState } from 'react';
import { X, Lightbulb, Send, FileUp, Info, CheckCircle2, Loader2, Target, Users, AlertCircle, Link2, Globe, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import axios from 'axios';
import API_BASE_URL from '../config/api';

const ProgramApplicationModal = ({ isOpen, onClose, program }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    projectName: '',
    category: '',
    teamMembers: '',
    problemStatement: '',
    proposedSolution: '',
    description: '',
    programId: program?.id || '',
    documentUrl: '',
    externalLink: ''
  });
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

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
      setForm(prev => ({ ...prev, documentUrl: res.data.url }));
      setUploadedFile({ name: file.name, size: file.size });
    } catch (err) {
      setError("File upload failed.");
    } finally {
      setUploadLoading(false);
    }
  };

  const removeFile = () => {
    setForm(prev => ({ ...prev, documentUrl: '' }));
    setUploadedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/incubation/projects`, {
        ...form,
        description: form.problemStatement.substring(0, 100) + '...', // Simple description
        programId: program.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !program) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        >
          {/* Left Side - Program Info */}
          <div className="md:w-1/3 bg-slate-50 p-8 border-r border-slate-100 flex flex-col">
            <div className="mb-8">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                Program Enrollment
              </span>
              <h2 className="text-2xl font-bold text-slate-800 mt-4 leading-tight">{program.name}</h2>
              <p className="text-slate-500 text-sm mt-2">{program.type} • {program.duration}</p>
            </div>

            <div className="flex-1 space-y-6">
               <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600 shrink-0 border border-slate-100">
                    <Target size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-700">Project Focused</h4>
                    <p className="text-xs text-slate-500 mt-1">Your application should detail a specific problem you're aiming to solve.</p>
                  </div>
               </div>
               <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-600 shrink-0 border border-slate-100">
                    <Users size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-700">Team Collaboration</h4>
                    <p className="text-xs text-slate-500 mt-1">List all team members who will participate in this incubation cycle.</p>
                  </div>
               </div>
            </div>

            <div className="mt-8 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Program Benefits</h4>
               <div className="flex flex-wrap gap-1.5">
                  {(program.benefits || '').split(',').map((b, i) => b.trim() && (
                    <span key={i} className="px-2 py-0.5 bg-slate-50 text-slate-600 text-[9px] font-bold rounded-lg border border-slate-100 lowercase">
                      # {b.trim()}
                    </span>
                  ))}
               </div>
            </div>
          </div>

          {/* Right Side - Application Form */}
          <div className="md:w-2/3 p-8 overflow-y-auto relative">
            <button onClick={onClose} className="absolute top-6 right-8 text-slate-400 hover:text-slate-600 transition">
              <X size={24} />
            </button>

            {success ? (
              <div className="h-full flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">Application Transmitted!</h3>
                <p className="text-slate-500 mt-2 max-w-xs text-sm">Your startup profile has been sent to the managers for review. Stay tuned for updates.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Incubation Application</h3>
                  <p className="text-sm text-slate-500 mt-1 font-medium">Pitch your startup idea for {program.name}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Lightbulb size={12} /> Project/Startup Name
                    </label>
                    <input 
                      type="text" required placeholder="e.g. SmartAgri"
                      value={form.projectName}
                      onChange={(e) => setForm({...form, projectName: e.target.value})}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Target size={12} /> Industry Category
                    </label>
                    <select 
                      required
                      value={form.category}
                      onChange={(e) => setForm({...form, category: e.target.value})}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
                    >
                      <option value="">Select Category</option>
                      <option value="EdTech">EdTech</option>
                      <option value="AgriTech">AgriTech</option>
                      <option value="HealthTech">HealthTech</option>
                      <option value="FinTech">FinTech</option>
                      <option value="IoT/Hardware">IoT/Hardware</option>
                      <option value="Software/SaaS">Software/SaaS</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Users size={12} /> Team Members & Roles
                  </label>
                  <input 
                    type="text" placeholder="e.g. Elie (Lead), Jane (Dev)"
                    value={form.teamMembers}
                    onChange={(e) => setForm({...form, teamMembers: e.target.value})}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Info size={12} /> The Problem Statement
                  </label>
                  <textarea 
                    required rows="2" placeholder="What real-world problem are you solving?"
                    value={form.problemStatement}
                    onChange={(e) => setForm({...form, problemStatement: e.target.value})}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium resize-none shadow-sm transition-all"
                  ></textarea>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Send size={12} /> Proposed Solution
                  </label>
                  <textarea 
                    required rows="2" placeholder="How does your startup solve this problem?"
                    value={form.proposedSolution}
                    onChange={(e) => setForm({...form, proposedSolution: e.target.value})}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium resize-none shadow-sm transition-all"
                  ></textarea>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                       <Link2 size={12} /> External Link (Optional)
                     </label>
                     <div className="relative group">
                        <div className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                          <Globe size={16} />
                        </div>
                        <input 
                          type="url" 
                          placeholder="Paste link to pitch deck or business plan"
                          value={form.externalLink}
                          onChange={(e) => setForm({...form, externalLink: e.target.value})}
                          className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium transition-all"
                        />
                     </div>
                  </div>

                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                       <FileUp size={12} /> Document Upload (Optional)
                     </label>
                     
                     {uploadedFile ? (
                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText size={18} className="text-blue-600" />
                            <div className="text-xs">
                              <p className="font-bold text-slate-700 line-clamp-1">{uploadedFile.name}</p>
                              <p className="text-[9px] text-slate-500 font-bold uppercase">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <button type="button" onClick={removeFile} className="text-slate-400 hover:text-red-500">
                            <X size={14} />
                          </button>
                        </div>
                     ) : (
                        <div 
                          onClick={() => document.getElementById('modal-file-upload').click()}
                          className="w-full relative cursor-pointer"
                        >
                          <input 
                            id="modal-file-upload" 
                            type="file" 
                            className="hidden" 
                            onChange={handleFileUpload} 
                            accept=".pdf,.pptx,.docx"
                          />
                          <div className={`p-4 border-2 border-dashed ${uploadLoading ? 'border-blue-300 bg-blue-50/20' : 'border-slate-200 bg-slate-50'} rounded-xl text-center hover:bg-slate-100 transition-colors`}>
                             {uploadLoading ? (
                               <Loader2 className="animate-spin text-blue-600 mx-auto" size={24} />
                             ) : (
                               <>
                                 <FileUp size={20} className="text-slate-400 mx-auto mb-1" />
                                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Upload PDF or PowerPoint Pitch</p>
                               </>
                             )}
                          </div>
                        </div>
                     )}
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-shake">
                    <AlertCircle size={18} />
                    <p className="text-[10px] font-black uppercase tracking-wider">{error}</p>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button type="button" onClick={onClose} className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition shadow-sm text-sm">
                    Dismiss
                  </button>
                  <button 
                    type="submit" disabled={loading}
                    className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-500/30 text-sm disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />} Enroll Submissions
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProgramApplicationModal;
