import React, { useState } from 'react';
import { Laptop, Database, Cpu, Wifi, BookOpen, Clock, CalendarCheck, CheckCircle2 } from 'lucide-react';

const mockResources = [
  { id: 1, name: '3D Printer (Ultimaker S5)', category: 'Equipment', status: 'Available', icon: Cpu, type: 'Hardware' },
  { id: 2, name: 'AWS Cloud Credits ($5k)', category: 'Software/Cloud', status: 'Available', icon: Database, type: 'Credits' },
  { id: 3, name: 'iMac Pro Workstation', category: 'Equipment', status: 'In Use', icon: Laptop, type: 'Hardware' },
  { id: 4, name: 'High-Speed Innovation Lab Access', category: 'Workspace', status: 'Available', icon: Wifi, type: 'Access Request' },
  { id: 5, name: 'Startup Legal Templates Pro', category: 'Resources', status: 'Available', icon: BookOpen, type: 'Download' }
];

const ResourcesStore = () => {
  const [booking, setBooking] = useState(null);

  const handleBook = (resource) => {
    setBooking(resource);
    // Simulate booking process
    setTimeout(() => {
      setBooking(null);
      alert(`Successfully requested access to ${resource.name}! You will receive an email confirmation once approved.`);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-800 to-indigo-900 rounded-2xl p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
         <div className="absolute right-0 top-0 opacity-10 blur-sm mix-blend-overlay">
            <Cpu size={250} />
         </div>
         <div className="relative z-10 text-white">
            <h2 className="text-3xl font-extrabold mb-2 tracking-tight">Incubation Store & Resources</h2>
            <p className="text-slate-300 max-w-xl text-lg leading-relaxed">
              Book workspaces, request high-end equipment, and access premium software credits to build your startup faster.
            </p>
         </div>
         <div className="relative z-10 shrink-0 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center text-white">
            <div className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-1">Your Lab Access</div>
            <div className="text-2xl font-black flex items-center justify-center gap-2">
              <CheckCircle2 size={24} className="text-emerald-400" /> Active
            </div>
         </div>
      </div>

      {/* Grid of resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockResources.map((resource) => (
           <div key={resource.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all flex flex-col items-start gap-4 hover:-translate-y-1">
             
             {/* Header section with Icon & Status */}
             <div className="flex w-full justify-between items-start">
               <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border ${resource.status === 'Available' ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                  <resource.icon size={28} />
               </div>
               <span className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded-lg border flex items-center gap-1.5 ${resource.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                 {resource.status === 'Available' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                 {resource.status}
               </span>
             </div>

             {/* Content */}
             <div className="flex-1 w-full">
               <div className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1">{resource.category}</div>
               <h3 className="text-lg font-bold text-slate-800 leading-tight mb-2">{resource.name}</h3>
             </div>

             {/* Footer Button */}
             <div className="mt-auto w-full pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm text-slate-500 font-medium px-2.5 py-1 bg-slate-100 rounded-md border border-slate-200">{resource.type}</span>
                
                {resource.status === 'Available' ? (
                  <button 
                    onClick={() => handleBook(resource)}
                    disabled={booking?.id === resource.id}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow hover:shadow-md disabled:bg-blue-400"
                  >
                    {booking?.id === resource.id ? (
                      <span className="animate-pulse">Processing...</span>
                    ) : (
                      <>
                        <CalendarCheck size={16} /> Request
                      </>
                    )}
                  </button>
                ) : (
                  <button disabled className="px-6 py-2 bg-slate-100 text-slate-400 rounded-xl font-semibold cursor-not-allowed">
                     Unavailable
                  </button>
                )}
             </div>

           </div>
        ))}
      </div>
      
    </div>
  );
};

export default ResourcesStore;
