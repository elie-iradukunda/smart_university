import React, { useState, useEffect } from 'react';
import { Star, TrendingUp, Award, Activity } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../../config/api';

const SuccessStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     const fetchStories = async () => {
        try {
           const res = await axios.get(`${API_BASE_URL}/api/incubation/stories`);
           setStories(res.data);
        } catch (error) {
           console.error("Failed to load stories", error);
        } finally {
           setLoading(false);
        }
     };
     fetchStories();
  }, []);

  if (loading) {
     return (
        <div className="flex justify-center items-center py-20">
           <Activity className="animate-spin text-teal-600" size={40} />
        </div>
     );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-800 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-20">
          <Award size={120} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-extrabold mb-2">Alumni Success Stories</h2>
          <p className="text-teal-100 text-lg">
            Discover how students turned their academic projects into successful, funded startups through our incubation center.
          </p>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {stories.map(story => (
          <div key={story.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
            {/* Image Container */}
            <div className="h-60 overflow-hidden relative group">
              <img 
                src={story.image} 
                alt={story.projectName}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              />
               <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {story.tags && story.tags.split(',').map((tag, idx) => (
                  <span key={idx} className="bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border border-white/20 shadow-sm">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-2xl font-bold text-slate-800 leading-tight">{story.projectName}</h3>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-md border border-emerald-200">
                  Class of {story.graduationYear}
                </span>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                 <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-500 text-xs overflow-hidden">
                    <img src={`https://ui-avatars.com/api/?name=${story.studentName}&background=0D8ABC&color=fff`} alt={story.studentName} />
                 </div>
                 <span className="text-slate-600 font-medium">{story.studentName}</span>
              </div>

              <p className="text-slate-600 mb-6 flex-1 line-clamp-3">
                {story.description}
              </p>

              {/* Achievements */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-6">
                 <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                   <Star size={14} className="text-yellow-500" /> Key Achievements
                 </h4>
                 <ul className="space-y-2">
                    {story.achievements && story.achievements.split(',').map((achievement, i) => (
                      <li key={i} className="text-sm font-medium text-slate-700 flex items-start gap-2">
                        <TrendingUp size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                        {achievement.trim()}
                      </li>
                    ))}
                 </ul>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                 <div className="text-sm text-slate-500 font-medium">
                   <span className="block text-xs uppercase text-slate-400 mb-0.5">Current Status</span>
                   {story.companyStatus}
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuccessStories;
