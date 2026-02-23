import React, { useState } from 'react';
import { 
  Rocket, 
  Trophy, 
  Lightbulb, 
  BookOpen, 
  Calendar, 
  Store, 
  FileText,
  Users
} from 'lucide-react';
import IncubationOverview from './IncubationOverview';
import SuccessStories from './SuccessStories';
import SubmitIdea from './SubmitIdea';
import IncubationPrograms from './IncubationPrograms';
import ResourcesStore from './ResourcesStore';
import ManageIncubation from './ManageIncubation';

const IncubationDashboard = () => {
  const userRole = localStorage.getItem('userRole') || 'Student';
  const [activeTab, setActiveTab] = useState(['Incubation Manager', 'Admin'].includes(userRole) ? 'manage' : 'overview');

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: Rocket },
    { id: 'success', label: 'Success Stories', icon: Trophy },
    { id: 'programs', label: 'Programs & Events', icon: Calendar },
    { id: 'resources', label: 'Resources & Store', icon: Store },
    { id: 'submit', label: 'Submit Idea', icon: Lightbulb },
  ];

  if (['Incubation Manager', 'Admin'].includes(userRole)) {
    tabs.push({ id: 'manage', label: 'Manage Center', icon: FileText });
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <IncubationOverview setActiveTab={setActiveTab} />;
      case 'success':
        return <SuccessStories />;
      case 'programs':
        return <IncubationPrograms />;
      case 'resources':
        return <ResourcesStore />;
      case 'submit':
        return <SubmitIdea />;
      case 'manage':
        return <ManageIncubation />;
      default:
        return <IncubationOverview setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Rocket className="text-blue-600" size={28} />
            University Incubation Center
          </h1>
          <p className="text-slate-500 mt-1">Transforming innovative ideas into successful startups</p>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={() => setActiveTab('submit')}
             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-medium shadow-sm"
           >
             <Lightbulb size={18} />
             Submit Startup Idea
           </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200">
        <div className="flex overflow-x-auto hide-scrollbar gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
              }`}
            >
              <tab.icon size={18} className={activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[500px]">
        {renderContent()}
      </div>
    </div>
  );
};

export default IncubationDashboard;
