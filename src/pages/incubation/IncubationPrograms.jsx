import React from 'react';
import { Calendar, Users, Target, ArrowRight, ShieldCheck, Clock, Search, Filter, History, LayoutGrid, X, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
import ProgramApplicationModal from '../../components/ProgramApplicationModal';
import ProgramEventDetailModal from '../../components/ProgramEventDetailModal';
import { motion, AnimatePresence } from 'framer-motion';

const IncubationPrograms = ({ isPublic }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All'); // All, Program, Event
  const [filterStatus, setFilterStatus] = useState('Ongoing'); // Ongoing, Upcoming, Past, All
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [viewDetailItem, setViewDetailItem] = useState(null);

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

  const filteredItems = items.filter(item => {
    // Search match
    const searchMatch = !searchTerm || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Type match
    const typeMatch = filterType === 'All' || item.type === filterType;

    // Time/Status match
    const today = new Date();
    const itemDate = item.date ? new Date(item.date) : (item.applicationDeadline ? new Date(item.applicationDeadline) : null);
    
    let statusMatch = true;
    if (filterStatus === 'Past') {
      statusMatch = item.status === 'Closed' || (itemDate && itemDate < today);
    } else if (filterStatus === 'Upcoming') {
      statusMatch = item.status === 'Upcoming' || (itemDate && itemDate > today);
    } else if (filterStatus === 'Ongoing') {
      statusMatch = item.status === 'Active';
    }

    // Date range match
    let dateRangeMatch = true;
    if (startDate || endDate) {
      if (itemDate) {
        if (startDate && itemDate < new Date(startDate)) dateRangeMatch = false;
        if (endDate && itemDate > new Date(endDate)) dateRangeMatch = false;
      } else {
        dateRangeMatch = false; // If user selects a date range, hide items without dates
      }
    }

    return searchMatch && typeMatch && statusMatch && dateRangeMatch;
  });

  const filteredPrograms = filteredItems.filter(i => i.type === 'Program');
  const filteredEvents = filteredItems.filter(i => i.type === 'Event');

  return (
    <div className="space-y-8">
      {/* Filtering Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sticky top-0 z-20 backdrop-blur-md bg-white/90">
         <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative flex-1 group">
               <Search className="absolute left-3.5 top-3 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
               <input 
                 type="text"
                 placeholder="Search programs, events or keywords..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
               />
               {searchTerm && (
                 <button onClick={() => setSearchTerm('')} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                    <X size={16} />
                 </button>
               )}
            </div>

            {/* Quick Filters */}
            <div className="flex gap-2 items-center overflow-x-auto hide-scrollbar shrink-0 w-full md:w-auto">
               <div className="p-1 bg-slate-100 rounded-lg flex">
                  {['Ongoing', 'Upcoming', 'Past'].map(status => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-4 py-1.5 rounded-md text-xs font-black uppercase tracking-widest transition-all ${filterStatus === status ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      {status}
                    </button>
                  ))}
               </div>
               
               <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${showFilters ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
               >
                 <Filter size={18} />
                 <span className="text-xs font-bold uppercase tracking-wider hidden sm:block">Filter By Type</span>
               </button>
            </div>
         </div>

         {/* Advanced Filters Drawer */}
         <AnimatePresence>
           {showFilters && (
             <motion.div 
               initial={{ height: 0, opacity: 0 }}
               animate={{ height: 'auto', opacity: 1 }}
               exit={{ height: 0, opacity: 0 }}
               className="overflow-hidden"
             >
                <div className="pt-4 mt-4 border-t border-slate-100 flex flex-wrap gap-6">
                   <div className="flex flex-col gap-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Content Type</span>
                      <div className="flex gap-2">
                        {['All', 'Program', 'Event'].map(type => (
                          <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all border ${filterType === type ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'}`}
                          >
                            {type === 'All' ? 'Everything' : `${type}s Only`}
                          </button>
                        ))}
                      </div>
                   </div>

                   <div className="flex flex-col gap-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date Range</span>
                      <div className="flex items-center gap-2">
                         <input 
                           type="date" 
                           value={startDate}
                           onChange={(e) => setStartDate(e.target.value)}
                           className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                         />
                         <span className="text-slate-400 text-xs">to</span>
                         <input 
                           type="date" 
                           value={endDate}
                           onChange={(e) => setEndDate(e.target.value)}
                           className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                         />
                         {(startDate || endDate) && (
                           <button 
                             onClick={() => { setStartDate(''); setEndDate(''); }}
                             className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                             title="Clear Dates"
                           >
                             <X size={14} />
                           </button>
                         )}
                      </div>
                   </div>
                </div>
             </motion.div>
           )}
         </AnimatePresence>
      </div>

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
        ) : filteredPrograms.length > 0 ? filteredPrograms.map(program => (
          <div 
            key={program.id} 
            onClick={() => setViewDetailItem(program)}
            className={`bg-white rounded-2xl border cursor-pointer group/card ${program.status === 'Active' ? 'border-blue-200 shadow-blue-50' : 'border-slate-200 shadow-slate-50'} shadow-sm p-6 hover:shadow-xl hover:border-blue-400 transition-all`}
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
              <div className="flex-1">
                 <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${program.status === 'Active' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                      {program.type}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-50 border border-slate-100">
                      <Clock size={12} className="text-slate-400" /> {program.status}
                    </span>
                 </div>
                 <h3 className="text-xl font-black text-slate-800 leading-tight group-hover/card:text-blue-600 transition-colors uppercase tracking-tight">{program.name}</h3>
              </div>
              
              <div className="text-right shrink-0">
                 <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Duration</div>
                 <div className="font-bold text-slate-700 text-lg tracking-tight">{program.duration || 'Flexible'}</div>
              </div>
            </div>

            {/* Content */}
            <p className="text-slate-600 mb-6 leading-relaxed font-medium line-clamp-2">
              {program.description}
            </p>

            {/* Benefits & Actions */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-100">
               <div className="flex-1">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Key Highlights</h4>
                 <div className="flex flex-wrap gap-2">
                    {(program.benefits || '').split(',').map((benefit, bidx) => benefit.trim() && (
                      <span key={bidx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-wider rounded-lg border border-slate-100 group-hover/card:bg-blue-50/50 transition-colors">
                        <div className="w-1 h-1 bg-blue-500 rounded-full" />
                        {benefit.trim()}
                      </span>
                    ))}
                 </div>
               </div>

               <div className="flex flex-col items-end shrink-0 w-full md:w-auto">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    {program.applicationDeadline ? `Apply by ${new Date(program.applicationDeadline).toLocaleDateString()}` : 'Rolling Applications'}
                 </p>
                 <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewDetailItem(program);
                      }}
                      className="flex-1 md:flex-none px-5 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                    >
                      Details <Eye size={14} />
                    </button>
                    {!isPublic ? (
                      program.status === 'Active' ? (
                        <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           setSelectedProgram(program);
                         }}
                         className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] text-white shadow-lg transition-all bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2`}
                        >
                          Apply <ArrowRight size={14} />
                        </button>
                      ) : (
                        <button 
                         disabled
                         className="flex-1 md:flex-none px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] text-slate-400 bg-slate-50 border border-slate-200 cursor-not-allowed"
                        >
                          Closed
                        </button>
                      )
                    ) : (
                      program.status === 'Active' ? (
                        <Link 
                          to="/login" 
                          onClick={(e) => e.stopPropagation()}
                          className={`flex-1 md:flex-none inline-block text-center px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] text-white shadow-lg transition-all bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2`}
                        >
                          Login to Apply <ArrowRight size={14} />
                        </Link>
                      ) : (
                        <div className="flex-1 md:flex-none px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] text-slate-400 bg-slate-50 border border-slate-200 text-center">
                          Closed
                        </div>
                      )
                    )}
                 </div>
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
              ) : filteredEvents.length > 0 ? filteredEvents.map((event, i) => (
                <div 
                  key={event.id} 
                  onClick={() => setViewDetailItem(event)}
                  className={`flex gap-4 group/ev cursor-pointer p-4 rounded-xl hover:bg-white/10 transition-all ${i !== 0 ? 'mt-6 pt-6 border-t border-slate-700/50' : ''}`}
                >
                   
                   <div className="shrink-0 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 shadow-sm backdrop-blur-md group-hover/ev:bg-blue-600/20 group-hover/ev:border-blue-500/50 transition-all">
                     <Calendar size={20} className="text-blue-300 group-hover/ev:text-blue-200" />
                   </div>
                   
                   <div className="flex-1">
                     <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-400 mb-1 block group-hover/ev:text-blue-300">
                       {event.name}
                     </span>
                     <h4 className="font-extrabold text-base mb-1 group-hover/ev:translate-x-1 transition-all leading-snug tracking-tight">
                       {event.description.length > 60 ? event.description.substring(0, 60) + '...' : event.description}
                     </h4>
                     <p className="text-slate-400 text-xs mb-3 italic-none">
                       {event.date || 'TBD'} • {event.location || 'Hub Lounge'}
                     </p>
                     
                     <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-slate-300 italic-none group-hover/ev:bg-white/10">
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

      <ProgramEventDetailModal 
        isOpen={!!viewDetailItem}
        onClose={() => setViewDetailItem(null)}
        item={viewDetailItem}
        isPublic={isPublic}
      />
      </div>
    </div>
  );
};

export default IncubationPrograms;
