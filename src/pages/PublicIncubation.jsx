import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ArrowRight } from 'lucide-react';
import IncubationDashboard from './incubation/IncubationDashboard';

const PublicIncubation = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-[#2c3e50]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/70 backdrop-blur-xl border-b border-gray-200/50 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1f4fa3] to-[#60a5fa] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Cpu size={22} />
            </div>
            <span className="text-xl font-black tracking-tighter text-[#1f4fa3]">
              SMART<span className="text-[#60a5fa]">UNI</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-10 text-[11px] font-black uppercase tracking-widest text-[#6b7280]">
             <Link to="/" className="hover:text-[#1f4fa3] transition-all">Home</Link>
             <Link to="/public-incubation" className="text-[#1f4fa3] transition-all">Incubation Center</Link>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-xs font-black uppercase tracking-widest text-[#6b7280] hover:text-[#1f4fa3] transition-colors">Log In</Link>
            <Link to="/login" className="bg-[#1f4fa3] text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#173e82] transition-all shadow-xl shadow-blue-900/10 flex items-center gap-2 group">
              Join Platform <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-28 pb-20 px-6 max-w-[1400px] mx-auto">
         <IncubationDashboard isPublic={true} />
      </div>

    </div>
  );
};

export default PublicIncubation;
