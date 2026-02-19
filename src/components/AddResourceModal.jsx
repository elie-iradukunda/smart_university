import { X, Upload, Video, FileText, Link, Check, ChevronDown, Save, Loader2, BookOpen, Globe, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import API_BASE_URL from '../config/api';

const AddResourceModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(null);
  const [formData, setFormData] = useState({
     type: 'Video',
     title: '',
     url: '',
     category: 'Lab Equipment',
     department: 'All Departments',
     thumbnail: '',
     duration: '',
     size: '',
     isEssential: false
  });

  const handleFileUpload = async (e, field) => {
      const file = e.target.files[0];
      if (!file) return;

      setUploading(field);
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_BASE_URL}/api/upload`, {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${token}`
              },
              body: uploadFormData
          });

          if (!response.ok) throw new Error('Upload failed');

          const data = await response.json();
          setFormData(prev => ({ ...prev, [field]: data.url }));
      } catch (err) {
          alert('Upload failed: ' + err.message);
      } finally {
          setUploading(null);
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/resources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Failed to add resource");
      
      onClose(); // Close and trigger refresh in parent
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
            <div>
                <h2 className="text-2xl font-bold text-[#2c3e50]">Resource Hub</h2>
                <p className="text-sm text-[#6b7280]">Publish training materials for students.</p>
            </div>
            <button onClick={onClose} className="text-[#9ca3af] hover:text-[#2c3e50] p-2 rounded-full hover:bg-gray-100 transition-all">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8">
                
                {/* Type Selection */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Resource Format</label>
                    <div className="grid grid-cols-3 gap-4">
                        <InputType 
                            label="Tutorial" 
                            subtitle="MP4/Youtube"
                            icon={Video} 
                            active={formData.type === 'Video'} 
                            onClick={() => setFormData({...formData, type: 'Video'})}
                        />
                        <InputType 
                            label="Document" 
                            subtitle="PDF/Guide"
                            icon={FileText} 
                            active={formData.type === 'PDF'} 
                            onClick={() => setFormData({...formData, type: 'PDF'})}
                        />
                        <InputType 
                            label="External" 
                            subtitle="Web Link"
                            icon={Globe} 
                            active={formData.type === 'Link'} 
                            onClick={() => setFormData({...formData, type: 'Link'})}
                        />
                    </div>
                </div>

                {/* Main Fields */}
                <div className="space-y-6">
                    <SectionHeader title="Core Information" />
                    
                    <InputGroup 
                        label="Publication Title" 
                        placeholder="e.g. Advanced Oscilloscope Calibration Guide" 
                        value={formData.title}
                        onChange={(val) => setFormData({...formData, title: val})}
                        required
                    />
                    
                    <InputGroup 
                        label="Direct Access URL" 
                        placeholder="https://..." 
                        icon={Link} 
                        value={formData.url}
                        onChange={(val) => setFormData({...formData, url: val})}
                        required
                        onFileChange={(e) => handleFileUpload(e, 'url')}
                        isUploading={uploading === 'url'}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SelectGroup 
                            label="Knowledge Category"
                            value={formData.category}
                            onChange={(val) => setFormData({...formData, category: val})}
                        >
                            <option>Lab Equipment</option>
                            <option>Safety Protocols</option>
                            <option>Software Guides</option>
                            <option>Theory Workshops</option>
                        </SelectGroup>
                        <SelectGroup 
                            label="Target Department"
                            value={formData.department}
                            onChange={(val) => setFormData({...formData, department: val})}
                        >
                            <option>All Departments</option>
                            <option>Mechatronic Engine</option>
                            <option>ICT Division</option>
                            <option>Electronic Comm</option>
                        </SelectGroup>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup 
                            label="Cover Thumbnail URL" 
                            placeholder="https://images..." 
                            icon={Upload}
                            value={formData.thumbnail}
                            onChange={(val) => setFormData({...formData, thumbnail: val})}
                            onFileChange={(e) => handleFileUpload(e, 'thumbnail')}
                            isUploading={uploading === 'thumbnail'}
                        />
                        <InputGroup 
                            label={formData.type === 'Video' ? "Content Duration" : "Storage Size"} 
                            placeholder={formData.type === 'Video' ? "e.g. 15 mins" : "e.g. 2.4 MB"}
                            icon={Info}
                            value={formData.type === 'Video' ? formData.duration : formData.size}
                            onChange={(val) => setFormData({...formData, [formData.type === 'Video' ? 'duration' : 'size']: val})}
                        />
                    </div>

                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between bg-blue-50/30 p-4 rounded-xl border border-blue-100/50">
                        <div>
                            <p className="text-xs font-bold text-[#1f4fa3] uppercase tracking-wider">Essential Guide</p>
                            <p className="text-[10px] text-gray-500">Pin this to the "Essential Guides" sidebar for quick access.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={formData.isEssential}
                                onChange={(e) => setFormData({...formData, isEssential: e.target.checked})}
                            />
                            <div className="w-10 h-5.5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1f4fa3]"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-4 sticky bottom-0 z-10">
                <button 
                   type="button"
                   onClick={onClose}
                   className="px-6 py-3 bg-white border border-gray-200 text-[#6b7280] rounded-xl text-sm font-bold hover:bg-gray-50 shadow-sm transition-all"
                >
                   Discard
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-[#1f4fa3] text-white rounded-xl text-sm font-bold hover:bg-[#173e82] transition-all flex items-center gap-2 shadow-xl shadow-blue-900/20"
                >
                   {loading ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Publish to Library</>}
                </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const SectionHeader = ({ title }) => (
    <div className="flex items-center gap-3 mb-4">
        <div className="h-px bg-gray-100 flex-1"></div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{title}</span>
        <div className="h-px bg-gray-100 flex-1"></div>
    </div>
);

const InputGroup = ({ label, placeholder, icon: Icon, value, onChange, required, onFileChange, isUploading, name }) => {
  const fileInputId = `resource-upload-${name || Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="space-y-1.5 flex-1">
       {label && <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</label>}
       <div className="relative group flex items-center gap-2">
          <div className="relative flex-1">
             <input 
                type="text" 
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                className={`w-full ${Icon ? 'pl-11' : 'px-4'} py-3 bg-gray-50 border-2 border-transparent rounded-xl text-[13px] text-[#2c3e50] placeholder:text-gray-300 focus:bg-white focus:border-[#1f4fa3] transition-all outline-none`}
             />
             {Icon && <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#1f4fa3] transition-colors" />}
          </div>

          {onFileChange && (
             <>
                <input 
                   type="file" 
                   id={fileInputId}
                   className="hidden" 
                   onChange={onFileChange}
                />
                <label 
                   htmlFor={fileInputId}
                   className={`shrink-0 p-3 rounded-xl border-2 border-transparent bg-gray-50 text-gray-400 hover:bg-white hover:border-[#1f4fa3] hover:text-[#1f4fa3] transition-all cursor-pointer flex items-center justify-center ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                >
                   {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                </label>
             </>
          )}
       </div>
    </div>
  );
};

const InputType = ({ label, subtitle, icon: Icon, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-4 border-2 rounded-2xl cursor-pointer transition-all space-y-1 ${
     active 
        ? 'bg-[#1f4fa3]/5 border-[#1f4fa3] text-[#1f4fa3]' 
        : 'bg-white border-gray-100 text-[#6b7280] hover:bg-gray-50'
  }`}>
     <div className="relative">
        <div className={`p-3 rounded-xl ${active ? 'bg-[#1f4fa3] text-white shadow-lg shadow-blue-900/10' : 'bg-gray-50'}`}>
            <Icon size={20} />
        </div>
        {active && <div className="absolute -top-1 -right-1 bg-[#22c55e] text-white rounded-full p-0.5 border-2 border-white"><Check size={8} strokeWidth={4} /></div>}
     </div>
     <span className="text-[11px] font-bold uppercase tracking-tight mt-2">{label}</span>
     <span className="text-[9px] font-medium opacity-60">{subtitle}</span>
  </div>
);

const SelectGroup = ({ label, children, value, onChange }) => (
  <div className="space-y-1.5 flex-1">
     <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</label>
     <div className="relative">
        <select 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl text-[13px] text-[#2c3e50] appearance-none focus:bg-white focus:border-[#1f4fa3] transition-all cursor-pointer outline-none"
        >
           {children}
        </select>
        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
     </div>
  </div>
);

export default AddResourceModal;
