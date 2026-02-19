import { User, Bell, Shield, Monitor, Save, Lock, Mail, Phone, ChevronRight, ToggleLeft, ToggleRight, Loader2, Briefcase } from 'lucide-react';
import { useState, useEffect } from 'react';
import API_BASE_URL from '../config/api';

const Settings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
           setError("No token found");
           setLoading(false);
           return;
        }

        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
           // If unauthorized, might want to redirect to login, but for now just show error
           if(response.status === 401) {
               throw new Error("Session expired. Please log in again.");
           }
           throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
     return (
        <div className="flex h-96 items-center justify-center">
           <Loader2 className="animate-spin text-[#1f4fa3]" size={32} />
        </div>
     );
  }

  if (error) {
     return (
        <div className="p-6 bg-red-50 text-red-600 rounded-lg border border-red-200 flex items-center justify-between">
           <span>Error: {error}</span>
           <button onClick={() => window.location.href='/login'} className="text-xs font-bold underline">Go to Login</button>
        </div>
     );
  }

  if (!user) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <h1 className="text-2xl font-semibold text-[#2c3e50]">Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         {/* Sidebar Nav */}
         <div className="lg:col-span-1 space-y-1">
            <NavItem label="General" icon={User} active />
            <NavItem label="Notifications" icon={Bell} />
            <NavItem label="Security" icon={Shield} />
            <NavItem label="Appearance" icon={Monitor} />
         </div>

         {/* Main Content */}
         <div className="lg:col-span-3 space-y-6">
            
            {/* Profile Section */}
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                     <img 
                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.fullName}&background=1f4fa3&color=fff`} 
                        className="w-full h-full object-cover" 
                        alt="Profile"
                     />
                  </div>
                  <div>
                     <h3 className="text-base font-semibold text-[#2c3e50]">{user.fullName}</h3>
                     <p className="text-sm text-[#6b7280]">{user.role} • {user.department || 'General'}</p>
                     <button className="text-xs text-[#1f4fa3] font-bold hover:underline mt-1">Change Avatar</button>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputGroup label="Display Name" value={user.fullName} />
                  <InputGroup label="Email Address" value={user.email} icon={Mail} disabled />
                  <InputGroup label="Role" value={user.role} icon={Shield} disabled />
                  <InputGroup label="Student/Staff ID" value={user.studentId || 'N/A'} icon={Briefcase} disabled />
                  <InputGroup label="Department" value={user.department || 'N/A'} icon={Briefcase} disabled />
               </div>

               <div className="pt-4 border-t border-gray-50 flex justify-end">
                  <button className="bg-[#1f4fa3] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#173e82] flex items-center gap-2 shadow-sm transition-all">
                     <Save size={16} /> Save Changes
                  </button>
               </div>
            </div>

            {/* Application Settings */}
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 space-y-6">
               <h3 className="text-base font-semibold text-[#2c3e50]">Preferences</h3>
               
               <div className="space-y-4">
                  <ToggleRow label="Email Notifications" description="Receive updates about your reservations." checked />
                  <ToggleRow label="SMS Alerts" description="Get text messages for overdue items." />
                  <ToggleRow label="Two-Factor Auth" description="Enable 2FA via authenticator app." />
               </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-[#ef4444]/5 rounded-lg border border-[#ef4444]/20 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
               <div>
                  <h4 className="text-sm font-bold text-[#ef4444]">Deactivate Account</h4>
                  <p className="text-xs text-[#6b7280] mt-1">This will permanently delete your data and borrowing history.</p>
               </div>
               <button className="bg-white border border-[#ef4444]/30 text-[#ef4444] px-4 py-2 rounded-md text-sm font-medium hover:bg-[#ef4444] hover:text-white transition-all shadow-sm">
                  Deactivate
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

const NavItem = ({ label, icon: Icon, active }) => (
  <button className={`w-full flex items-center justify-between px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
     active 
        ? 'bg-[#1f4fa3]/10 text-[#1f4fa3]' 
        : 'text-[#6b7280] hover:bg-gray-50 hover:text-[#2c3e50]'
  }`}>
     <div className="flex items-center gap-3">
        <Icon size={18} />
        {label}
     </div>
     {active && <ChevronRight size={14} />}
  </button>
);

const InputGroup = ({ label, value, icon: Icon, disabled }) => (
  <div className="space-y-1.5">
     <label className="block text-xs font-medium text-[#6b7280]">{label}</label>
     <div className="relative">
        <input 
           type="text" 
           defaultValue={value} 
           disabled={disabled}
           className={`w-full px-3 py-2 border rounded-md text-sm transition-all ${
              disabled 
                 ? 'bg-gray-50 text-[#9ca3af] border-gray-200 cursor-not-allowed' 
                 : 'bg-white text-[#2c3e50] border-gray-200 focus:border-[#1f4fa3] focus:ring-1 focus:ring-[#1f4fa3]/20 outline-none'
           } ${Icon ? 'pl-9' : ''}`}
        />
        {Icon && <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
     </div>
  </div>
);

const ToggleRow = ({ label, description, checked }) => (
   <div className="flex items-center justify-between py-2">
      <div>
         <p className="text-sm font-medium text-[#2c3e50]">{label}</p>
         <p className="text-xs text-[#6b7280]">{description}</p>
      </div>
      <button className={`text-2xl transition-colors ${checked ? 'text-[#1f4fa3]' : 'text-gray-300'}`}>
         {checked ? <ToggleRight /> : <ToggleLeft />}
      </button>
   </div>
);

export default Settings;
