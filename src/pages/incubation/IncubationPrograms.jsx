import React from 'react';
import { Calendar, Users, Target, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

const mockPrograms = [
  {
    id: 1,
    title: 'Pre-Incubation Kickstart',
    type: 'Program',
    duration: '8 Weeks',
    status: 'Accepting Applications',
    deadline: 'April 30, 2026',
    description: 'Transform your raw idea into a validated business model. Includes weekly mentorship, market research training, and pitch practice.',
    benefits: ['1-on-1 Mentorship', 'Pitch Perfection', 'Market Validation'],
    color: 'blue'
  },
  {
    id: 2,
    title: 'Scale-Up Accelerator',
    type: 'Program',
    duration: '6 Months',
    status: 'Upcoming',
    deadline: 'July 15, 2026',
    description: 'For startups with an MVP. Get intensive support to secure funding, scale operations, and access the university investor network.',
    benefits: ['Seed Funding Access', 'Office Space', 'Legal Support'],
    color: 'emerald'
  }
];

const mockEvents = [
  {
    id: 1,
    title: 'Founder Insights: Building a Resilient Startup',
    date: 'Next Friday, 2:00 PM',
    location: 'Innovation Hub, Main Campus',
    speaker: 'Jane Doe, CEO TechVenture',
    type: 'Workshop'
  },
  {
    id: 2,
    title: 'University Hackathon 2026',
    date: 'March 15-17',
    location: 'Library Tech Wing',
    speaker: 'Open to all students',
    type: 'Hackathon'
  }
];

const IncubationPrograms = () => {
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

        {mockPrograms.map(program => (
          <div key={program.id} className={`bg-white rounded-2xl border ${program.color === 'blue' ? 'border-blue-200 shadow-blue-50' : 'border-emerald-200 shadow-emerald-50'} shadow-sm p-6 hover:shadow-lg transition-all`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
              <div>
                 <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${program.color === 'blue' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {program.type}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500 text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">
                      <Clock size={12} className="text-slate-400" /> {program.status}
                    </span>
                 </div>
                 <h3 className="text-xl font-bold text-slate-800 leading-tight">{program.title}</h3>
              </div>
              
              <div className="text-right shrink-0">
                 <div className="text-xs uppercase text-slate-400 font-bold mb-1">Duration</div>
                 <div className="font-semibold text-slate-700">{program.duration}</div>
              </div>
            </div>

            {/* Content */}
            <p className="text-slate-600 mb-6 leading-relaxed">
              {program.description}
            </p>

            {/* Benefits & Actions */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-100">
               <div>
                 <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Key Benefits</h4>
                 <div className="flex flex-wrap gap-2">
                   {program.benefits.map(benefit => (
                     <span key={benefit} className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-600 text-xs font-semibold rounded-full border border-slate-200">
                       <ShieldCheck size={14} className="text-slate-400" />
                       {benefit}
                     </span>
                   ))}
                 </div>
               </div>

               <div className="flex flex-col items-end shrink-0 w-full md:w-auto">
                 <p className="text-xs font-medium text-slate-500 mb-2">Apply by {program.deadline}</p>
                 <button className={`w-full md:w-auto px-6 py-2.5 rounded-xl font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 ${program.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30'}`}>
                   Apply Now
                 </button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Events Sidebar */}
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-slate-800">Upcoming Events</h2>
        </div>

        <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-800 relative text-white">
           <div className="p-6 relative z-10">
              {mockEvents.map((event, i) => (
                <div key={event.id} className={`flex gap-4 ${i !== 0 ? 'mt-6 pt-6 border-t border-slate-700/50' : ''}`}>
                   
                   <div className="shrink-0 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 shadow-sm backdrop-blur-md">
                     <Calendar size={20} className="text-blue-300" />
                   </div>
                   
                   <div>
                     <span className="text-xs uppercase tracking-wider font-bold text-blue-400 mb-1 block">
                       {event.type}
                     </span>
                     <h4 className="font-bold text-base mb-1 hover:text-blue-300 cursor-pointer transition-colors leading-snug">
                       {event.title}
                     </h4>
                     <p className="text-slate-400 text-sm mb-3">
                       {event.date} • {event.location}
                     </p>
                     
                     <div className="flex items-center gap-2 text-xs font-medium bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-slate-300">
                        <Users size={14} className="text-slate-400" /> {event.speaker}
                     </div>
                   </div>
                </div>
              ))}
              
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
             <button className="text-sm font-semibold text-indigo-600 underline hover:text-indigo-800">Contact Managers</button>
           </div>
        </div>
      </div>
      
    </div>
  );
};

export default IncubationPrograms;
