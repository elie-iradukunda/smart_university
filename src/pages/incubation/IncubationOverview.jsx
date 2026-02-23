import React from 'react';
import { Sparkles, TrendingUp, Users, Target, ArrowRight } from 'lucide-react';

const IncubationOverview = ({ setActiveTab }) => {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl min-h-[400px] flex items-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80" 
            alt="Incubation Center workspace" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-slate-900/80"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 p-8 md:p-16 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-semibold tracking-wide uppercase mb-6">
            <Sparkles size={16} className="text-blue-400" />
            University Innovation Hub
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6 hidden md:block">
            Where Big Ideas <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Become Startups.</span>
          </h1>
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-6 md:hidden">
            Where Big Ideas Become Startups.
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
            Join the universitys incubation ecosystem. Get access to funding, workspaces, mentorship, and transform your academic projects into thriving businesses.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setActiveTab('submit')}
              className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 text-lg"
            >
              Start Your Journey <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => setActiveTab('success')}
              className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold backdrop-blur-sm border border-white/10 transition-all flex items-center justify-center gap-2 text-lg"
            >
              Read Success Stories
            </button>
          </div>
        </div>
      </div>

      {/* Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Feature 1 */}
        <div 
           className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
           onClick={() => setActiveTab('programs')}
        >
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Target className="text-blue-600" size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Structured Programs</h3>
          <p className="text-slate-500 leading-relaxed mb-4">
            Participate in hackathons, accelerator programs, and step-by-step training sessions to rapidly build your MVP.
          </p>
          <div className="text-blue-600 font-semibold text-sm flex items-center gap-1">Explore Programs <ArrowRight size={16} /></div>
        </div>

        {/* Feature 2 */}
        <div 
           className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:teal-300 transition-all cursor-pointer group"
           onClick={() => setActiveTab('success')}
        >
          <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <TrendingUp className="text-teal-600" size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Learn from Alumni</h3>
          <p className="text-slate-500 leading-relaxed mb-4">
            Read inspiring success stories from past students who have successfully scaled their startup ideas globally.
          </p>
          <div className="text-teal-600 font-semibold text-sm flex items-center gap-1">View Stories <ArrowRight size={16} /></div>
        </div>

        {/* Feature 3 */}
        <div 
           className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-purple-300 transition-all cursor-pointer group"
           onClick={() => setActiveTab('resources')}
        >
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Users className="text-purple-600" size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">Mentorship & Resources</h3>
          <p className="text-slate-500 leading-relaxed mb-4">
            Get access to modern workspaces, 3D printers, development tools, and connect with industry expert mentors.
          </p>
          <div className="text-purple-600 font-semibold text-sm flex items-center gap-1">Access Tools <ArrowRight size={16} /></div>
        </div>
      </div>
    </div>
  );
};

export default IncubationOverview;
