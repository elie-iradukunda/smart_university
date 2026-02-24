import React from 'react';
import { Calendar, Users, Target, ArrowRight, ShieldCheck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
import ProgramApplicationModal from '../../components/ProgramApplicationModal';

const IncubationPrograms = ({ isPublic }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/incubation/programs`);
        setItems(res.data);
      } catch (err) {
        console.error('Error fetching programs');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const programs = items.filter(i => i.type === 'Program');
  const events = items.filter(i => i.type === 'Event');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Active Programs column (span 2) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-slate-800">Incubation Programs</h2>
          <button className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
            View All <ArrowRight size={16} />
          </button>
        </div>

        {loading ? (
             <p className="py-24 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse italic-none">Synchronizing Programs...</p>
        ) : programs.length > 0 ? programs.map(program => (
          <div key={program.id} className={`bg-white rounded-2xl border ${program.status === 'Active' ? 'border-blue-200 shadow-blue-50' : 'border-slate-200 shadow-slate-50'} shadow-sm p-6 hover:shadow-lg transition-all`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
              <div>
                 <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${program.status === 'Active' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                      {program.type}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500 text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">
                      <Clock size={12} className="text-slate-400" /> {program.status}
                    </span>
                 </div>
                 <h3 className="text-xl font-bold text-slate-800 leading-tight italic-none">{program.name}</h3>
              </div>
              
              <div className="text-right shrink-0">
                 <div className="text-xs uppercase text-slate-400 font-bold mb-1">Duration</div>
                 <div className="font-semibold text-slate-700 italic-none">{program.duration || 'Flexible'}</div>
              </div>
            </div>

            {/* Content */}
            <p className="text-slate-600 mb-6 leading-relaxed italic-none">
              {program.description}
            </p>

            {/* Benefits & Actions */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-100">
               <div className="flex-1">
                 <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Key Highlights</h4>
                 <div className="flex flex-wrap gap-2">
                    {(program.benefits || '').split(',').map((benefit, bidx) => benefit.trim() && (
                      <span key={bidx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 text-xs font-semibold rounded-full border border-slate-200 italic-none">
                        <ShieldCheck size={14} className="text-slate-400" />
                        {benefit.trim()}
                      </span>
                    ))}
                 </div>
               </div>

               <div className="flex flex-col items-end shrink-0 w-full md:w-auto">
                 <p className="text-xs font-medium text-slate-500 mb-2 italic-none">
                    {program.applicationDeadline ? `Apply by ${new Date(program.applicationDeadline).toLocaleDateString()}` : 'Rolling Applications'}
                 </p>
                 {!isPublic ? (
                   program.status === 'Active' ? (
                     <button 
                      onClick={() => setSelectedProgram(program)}
                      className={`w-full md:w-auto px-6 py-2.5 rounded-xl font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 bg-blue-600 hover:bg-blue-700 shadow-blue-500/30`}
                     >
                       Apply Now
                     </button>
                   ) : (
                     <button 
                      disabled
                      className="w-full md:w-auto px-6 py-2.5 rounded-xl font-bold text-slate-400 bg-slate-50 border border-slate-200 cursor-not-allowed text-[10px] uppercase tracking-widest"
                     >
                       {program.status === 'Closed' ? 'Enrollment Closed' : 'Coming Soon'}
                     </button>
                   )
                 ) : (
                   program.status === 'Active' ? (
                     <Link to="/login" className={`inline-block text-center w-full md:w-auto px-6 py-2.5 rounded-xl font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 bg-blue-600 hover:bg-blue-700 shadow-blue-500/30`}>
                       Login to Apply
                     </Link>
                   ) : (
                     <span className="inline-block text-center w-full md:w-auto px-6 py-2.5 rounded-xl font-bold text-slate-400 bg-slate-50 border border-slate-200 text-[10px] uppercase tracking-widest">
                       {program.status === 'Closed' ? 'Applications Closed' : 'Opening Soon'}
                     </span>
                   )
                 )}
               </div>
            </div>
          </div>
        )) : (
            <div className="bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center">
                <Target size={40} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-400 font-black uppercase text-xs tracking-widest italic-none">No active programs found</p>
            </div>
        )}
      </div>

      {/* Events Sidebar */}
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-slate-800">Upcoming Events</h2>
        </div>

        <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-800 relative text-white">
           <div className="p-6 relative z-10">
              {loading ? (
                  <p className="py-10 text-center text-slate-500 text-xs font-bold uppercase tracking-widest animate-pulse">Syncing events...</p>
              ) : events.length > 0 ? events.map((event, i) => (
                <div key={event.id} className={`flex gap-4 ${i !== 0 ? 'mt-6 pt-6 border-t border-slate-700/50' : ''}`}>
                   
                   <div className="shrink-0 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 shadow-sm backdrop-blur-md">
                     <Calendar size={20} className="text-blue-300" />
                   </div>
                   
                   <div>
                     <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-400 mb-1 block">
                       {event.name}
                     </span>
                     <h4 className="font-bold text-base mb-1 hover:text-blue-300 cursor-pointer transition-colors leading-snug italic-none">
                       {event.description}
                     </h4>
                     <p className="text-slate-400 text-xs mb-3 italic-none">
                       {event.date || 'TBD'} • {event.location || 'Hub Lounge'}
                     </p>
                     
                     <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-slate-300 italic-none">
                        <Users size={14} className="text-slate-400" /> {event.speaker || 'Innovation Team'}
                     </div>
                   </div>
                </div>
              )) : (
                  <div className="py-12 text-center opacity-40">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em]">Silence in the Hub</p>
                  </div>
              )}
              
              <button className="w-full mt-6 py-3 border border-slate-600 rounded-xl text-sm font-semibold hover:bg-white/5 transition-colors">
                View All Events
              </button>
           </div>
        </div>

        {/* Call to action tiny card */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl border border-blue-100 flex items-start gap-4">
           <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
              <Target size={20} className="text-indigo-600" />
           </div>
           <div>
              <h4 className="font-bold text-indigo-900 mb-1">Host an Event</h4>
              <p className="text-sm text-indigo-700 mb-3">Want to run a workshop for other students?</p>
              {!isPublic ? (
                <button className="text-sm font-semibold text-indigo-600 underline hover:text-indigo-800">Contact Managers</button>
              ) : (
                <Link to="/login" className="text-sm font-semibold text-indigo-600 underline hover:text-indigo-800">Login to Host</Link>
              )}
           </div>
        </div>
      </div>
      
      <ProgramApplicationModal 
        isOpen={!!selectedProgram}
        onClose={() => setSelectedProgram(null)}
        program={selectedProgram}
      />
    </div>
  );
};

export default IncubationPrograms;
