import { X, UserPlus, Mail, Shield, BadgeCheck, Camera, Save, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AddUserModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        {/* Modal Content */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-lg bg-white rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
            <h2 className="text-lg font-semibold text-[#2c3e50]">Add New User</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-50"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
             {/* Avatar Upload */}
             <div className="flex items-center gap-5">
                <div className="w-20 h-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-full flex flex-col items-center justify-center text-gray-400 hover:border-[#1f4fa3] hover:text-[#1f4fa3] transition-colors cursor-pointer text-xs group shrink-0">
                   <Camera size={20} className="mb-1 text-gray-300 group-hover:text-[#1f4fa3] transition-colors" />
                   <span>Upload</span>
                </div>
                <div>
                   <h3 className="text-sm font-medium text-[#2c3e50]">Profile Photo</h3>
                   <p className="text-xs text-[#9ca3af] mt-1">
                      Recommended 400x400px. <br/> Max 2MB.
                   </p>
                </div>
             </div>

             {/* Form Fields */}
             <div className="space-y-4">
                <InputGroup label="Full Name" placeholder="e.g. Alice Johnson" icon={UserPlus} />
                <InputGroup label="Email Address" placeholder="alice.j@uni.edu" icon={Mail} />
                
                <div className="grid grid-cols-2 gap-4">
                   <SelectGroup label="System Role">
                      <option>Student</option>
                      <option>Lecturer</option>
                      <option>Admin</option>
                      <option>Lab Staff</option>
                   </SelectGroup>
                   <InputGroup label="User ID" placeholder="ID-8929" icon={BadgeCheck} />
                </div>
             </div>

             {/* Permissions */}
             <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-3">
                <h4 className="text-sm font-medium text-[#2c3e50]">Access Permissions</h4>
                <div className="space-y-2">
                   <Checkbox label="Allow borrowing equipment" defaultChecked />
                   <Checkbox label="Can make lab reservations" defaultChecked />
                   <Checkbox label="Access learning resources" defaultChecked />
                   <Checkbox label="View system reports" />
                </div>
             </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 z-10">
             <button 
                onClick={onClose}
                className="px-4 py-2 bg-white border border-gray-300 text-[#6b7280] rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
             >
                Cancel
             </button>
             <button className="px-4 py-2 bg-[#1f4fa3] text-white rounded-md text-sm font-medium hover:bg-[#173e82] transition-colors flex items-center gap-2 shadow-sm">
                <Save size={16} /> Create User
             </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const InputGroup = ({ label, placeholder, icon: Icon }) => (
  <div className="space-y-1.5">
     <label className="block text-xs font-medium text-[#6b7280]">{label}</label>
     <div className="relative group">
        <input 
           type="text" 
           placeholder={placeholder}
           className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-md text-sm text-[#2c3e50] placeholder:text-gray-300 focus:outline-none focus:border-[#1f4fa3] focus:ring-1 focus:ring-[#1f4fa3]/20 transition-all"
        />
        {Icon && <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1f4fa3] transition-colors" />}
     </div>
  </div>
);

const SelectGroup = ({ label, children }) => (
  <div className="space-y-1.5">
     <label className="block text-xs font-medium text-[#6b7280]">{label}</label>
     <div className="relative">
        <select className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm text-[#2c3e50] appearance-none focus:outline-none focus:border-[#1f4fa3] focus:ring-1 focus:ring-[#1f4fa3]/20 transition-all cursor-pointer">
           {children}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
     </div>
  </div>
);

const Checkbox = ({ label, defaultChecked }) => (
  <label className="flex items-center gap-2 cursor-pointer group">
     <input type="checkbox" defaultChecked={defaultChecked} className="w-4 h-4 rounded border-gray-300 text-[#1f4fa3] focus:ring-[#1f4fa3]/20 cursor-pointer" />
     <span className="text-xs text-[#6b7280] group-hover:text-[#2c3e50] transition-colors">{label}</span>
  </label>
);

export default AddUserModal;
