import React, { useState } from 'react';
import { Lightbulb, Send, FileUp, Info, CheckCircle2 } from 'lucide-react';

const SubmitIdea = () => {
  const [formData, setFormData] = useState({
    projectName: '',
    category: '',
    teamMembers: '',
    problemStatement: '',
    proposedSolution: '',
    files: null
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Normally would send to API
    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-200 p-12 text-center max-w-2xl mx-auto mt-10">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
           <CheckCircle2 size={40} className="text-emerald-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Idea Submitted Successfully!</h2>
        <p className="text-slate-600 mb-8 leading-relaxed">
          Your startup idea "<span className="font-semibold">{formData.projectName}</span>" has been sent to the incubation center managers. You will be notified via email about the next steps and review process.
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition"
        >
          Submit Another Idea
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-8 text-white shadow-lg mb-8 flex items-center gap-6">
         <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 border border-white/30">
            <Lightbulb size={32} className="text-white" />
         </div>
         <div>
            <h2 className="text-2xl font-bold mb-2">Pitch Your Startup Idea</h2>
            <p className="text-blue-100 max-w-2xl">
              Fill out this form to apply for university incubation support. Successful applicants receive mentorship, funding access, and workspace.
            </p>
         </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                Project/Startup Name <span className="text-red-500">*</span>
              </label>
              <input 
                required
                type="text" 
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                placeholder="e.g. SmartAgri"
                className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                Industry Category <span className="text-red-500">*</span>
              </label>
              <select
                required
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-white"
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

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Team Members</label>
            <input 
              type="text" 
              name="teamMembers"
              value={formData.teamMembers}
              onChange={handleChange}
              placeholder="List member names and roles (e.g. Elie - Dev, Jane - UI)"
              className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">The Problem <span className="text-red-500">*</span></label>
            <textarea 
              required
              name="problemStatement"
              value={formData.problemStatement}
              onChange={handleChange}
              rows="4"
              placeholder="What real-world problem are you solving?"
              className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition resize-y"
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Your Solution <span className="text-red-500">*</span></label>
            <textarea 
              required
              name="proposedSolution"
              value={formData.proposedSolution}
              onChange={handleChange}
              rows="4"
              placeholder="How does your startup solve this problem?"
              className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition resize-y"
            ></textarea>
          </div>

          <div className="space-y-2 pb-4">
            <label className="text-sm font-semibold text-slate-700">Upload Pitch Deck / Files</label>
            <div className="w-full border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition cursor-pointer">
              <FileUp size={32} className="text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 font-medium font-sm mb-1">Click to upload or drag & drop</p>
              <p className="text-slate-400 text-xs">PDF, PPTX (max 10MB)</p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-4 border border-blue-100">
             <Info className="text-blue-600 shrink-0 mt-0.5" size={20} />
             <p className="text-sm text-blue-800 leading-relaxed">
               By submitting this idea, you agree to the university's IP policy. The incubation center ensures your idea remains confidential during the review process.
             </p>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
             <button type="submit" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md shadow-blue-500/30 flex items-center gap-2 transition-transform hover:-translate-y-0.5">
               <Send size={18} /> Submit Idea for Review
             </button>
          </div>

        </form>
      </div>

    </div>
  );
};

export default SubmitIdea;
