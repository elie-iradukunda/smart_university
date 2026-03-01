import React from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  Users, 
  ShieldCheck, 
  Clock, 
  Target, 
  ArrowRight,
  Info,
  Building2,
  TrendingUp,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const ProgramEventDetailModal = ({ item, isOpen, onClose, isPublic }) => {
  if (!isOpen || !item) return null;

  const isProgram = item.type === 'Program';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           onClick={onClose}
           className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        
        <motion.div
           initial={{ opacity: 0, scale: 0.9, y: 20 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.9, y: 20 }}
           className="relative bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 bg-white/80 hover:bg-white text-slate-500 rounded-full shadow-lg transition-all"
          >
            <X size={20} />
          </button>

          {/* Header Image (Optional) */}
          {item.image && (
             <div className="w-full h-48 sm:h-64 bg-slate-100 overflow-hidden relative">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
             </div>
          )}

          {/* Content Area */}
          <div className="p-6 sm:p-10 overflow-y-auto hide-scrollbar">
            <div className="flex items-center gap-2 mb-4">
               <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${item.status === 'Active' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                 {item.type}
               </span>
               <span className="flex items-center gap-1 text-slate-500 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-50 border border-slate-100">
                 <Clock size={12} className="text-slate-400" /> {item.status}
               </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-6 leading-tight">
              {item.name}
            </h2>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
               <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                  <div className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">
                     {isProgram ? 'Duration' : 'Date'}
                  </div>
                  <div className="flex items-center gap-2 font-bold text-slate-700 text-sm">
                     <Calendar size={14} className="text-blue-500" />
                     {isProgram ? (item.duration || 'Flexible') : (item.date || 'To be decided')}
                  </div>
               </div>

               <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                  <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1">
                     {isProgram ? 'Deadline' : 'Location'}
                  </div>
                  <div className="flex items-center gap-2 font-bold text-slate-700 text-sm">
                     {isProgram ? (
                        <>
                           <Clock size={14} className="text-emerald-500" />
                           {item.applicationDeadline ? new Date(item.applicationDeadline).toLocaleDateString() : 'Rolling'}
                        </>
                     ) : (
                        <>
                           <MapPin size={14} className="text-emerald-500" />
                           {item.location || 'Hub Lounge'}
                        </>
                     )}
                  </div>
               </div>

               {!isProgram && (
                  <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50">
                     <div className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">Speaker</div>
                     <div className="flex items-center gap-2 font-bold text-slate-700 text-sm">
                        <Users size={14} className="text-amber-500" />
                        {item.speaker || 'Main Team'}
                     </div>
                  </div>
               )}

               {isProgram && item.requirements && (
                  <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100/50">
                     <div className="text-[10px] font-black uppercase tracking-widest text-purple-500 mb-1">Eligibility</div>
                     <div className="flex items-center gap-2 font-bold text-slate-700 text-sm truncate">
                        <Award size={14} className="text-purple-500" />
                        All Students
                     </div>
                  </div>
               )}
            </div>

            {/* Description */}
            <div className="mb-10">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                  <Info size={14} className="text-blue-500" /> Overview & Details
               </h3>
               <p className="text-slate-600 leading-relaxed font-medium">
                  {item.description}
               </p>
            </div>

            {/* Requirements Section (Programs only) */}
            {isProgram && item.requirements && (
               <div className="mb-10">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                     <ShieldCheck size={14} className="text-emerald-500" /> Requirements
                  </h3>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-sm text-slate-600 font-medium">
                     {item.requirements}
                  </div>
               </div>
            )}

            {/* Benefits Tags */}
            {item.benefits && (
               <div className="mb-10">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                     <Target size={14} className="text-amber-500" /> Key Benefits & Highlights
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {item.benefits.split(',').map((benefit, i) => benefit.trim() && (
                      <span key={i} className="px-4 py-2 bg-slate-50 text-slate-600 text-xs font-bold rounded-xl border border-slate-200 flex items-center gap-2">
                         <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                         {benefit.trim()}
                      </span>
                    ))}
                  </div>
               </div>
            )}

            {/* Action Footer */}
            <div className="sticky bottom-0 pt-6 mt-10 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Program Status</p>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                     <div className={`w-2 h-2 rounded-full ${item.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'} animate-pulse`} />
                     {item.status === 'Active' ? 'Applications Live' : 'Not currently accepting applications'}
                  </div>
               </div>

               {isProgram ? (
                 !isPublic ? (
                   item.status === 'Active' ? (
                     <button className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                        Start Application <ArrowRight size={16} />
                     </button>
                   ) : (
                     <button disabled className="w-full sm:w-auto px-8 py-3.5 bg-slate-50 text-slate-400 border border-slate-200 rounded-2xl font-black uppercase tracking-widest text-[11px] cursor-not-allowed">
                        Apply Closed
                     </button>
                   )
                 ) : (
                    item.status === 'Active' && (
                       <Link to="/login" className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                          Join Platform to Apply <ArrowRight size={16} />
                       </Link>
                    )
                 )
               ) : (
                  <button className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                     Register for Event <ArrowRight size={16} />
                  </button>
               )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProgramEventDetailModal;
