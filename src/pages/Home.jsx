import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle, 
  Cpu, 
  Database, 
  Globe, 
  Zap, 
  ShieldCheck, 
  Layout, 
  Users, 
  BookOpen,
  Search,
  Lock,
  Box,
  ClipboardCheck,
  LifeBuoy,
  ChevronRight,
  ExternalLink,
  Activity,
  Package,
  Clock,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import API_BASE_URL from '../config/api';
import EquipmentDetailsModal from '../components/EquipmentDetailsModal';

const Home = () => {
  const [activeDept, setActiveDept] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [bgIndex, setBgIndex] = useState(0);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [equipmentData, setEquipmentData] = useState([]);
  const [resourcesData, setResourcesData] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, current: 1 });
  const [dashStats, setDashStats] = useState({
    totalEquipment: '...',
    activeStudents: '...',
    totalResources: '...',
    campusLabs: '12'
  });

  const heroBgs = [
    "https://images.unsplash.com/photo-1581093458891-b9883f8792e4?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1523240715632-d984bb4b9749?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1600"
  ];

  const departments = [
    { id: 'RE', name: 'Renewable Energy', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { id: 'MECH', name: 'Mechatronics', icon: Cpu, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'ICT', name: 'ICT', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'ELEC', name: 'Electronics', icon: Database, color: 'text-green-500', bg: 'bg-green-50' },
  ];

  const fetchEquipment = async (dept = activeDept, page = pagination.current) => {
    setFetchLoading(true);
    try {
      const query = new URLSearchParams({
        limit: 4,
        page: page,
        ...(dept !== 'All' && { department: dept })
      });

      const response = await fetch(`${API_BASE_URL}/api/equipment?${query.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      setEquipmentData(data.equipment || []);
      setPagination({
        total: data.total,
        pages: data.pages,
        current: data.currentPage
      });
    } catch (err) {
      console.error("Equipment fetch error:", err);
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/dashboard/stats`);
      if (res.ok) {
        const data = await res.json();
        setDashStats({
          totalEquipment: data.totalEquipment?.toLocaleString() || '0',
          activeStudents: data.totalUsers?.toLocaleString() || '0',
          totalResources: data.totalResources?.toLocaleString() || '0',
          campusLabs: data.campusLabs || '12'
        });
      }
    } catch (err) {
      console.error("Stats fetch error:", err);
    }
  };

  const fetchResources = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/resources`);
      if (res.ok) {
        const data = await res.json();
        // Take most recent 4 resources
        setResourcesData(data.slice(0, 4));
      }
    } catch (err) {
      console.error("Resources fetch error:", err);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, [activeDept, pagination.current]);

  useEffect(() => {
    fetchStats();
    fetchResources();
    const bgTimer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % heroBgs.length);
    }, 6000);
    return () => clearInterval(bgTimer);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-[#2c3e50] selection:bg-blue-100 selection:text-[#1f4fa3]">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/70 backdrop-blur-xl border-b border-white/20 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1f4fa3] to-[#60a5fa] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Cpu size={22} />
            </div>
            <span className="text-xl font-black tracking-tighter text-[#1f4fa3]">SMART<span className="text-[#60a5fa]">UNI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-[11px] font-black uppercase tracking-widest text-[#6b7280]">
            <a href="#how-it-works" className="hover:text-[#1f4fa3] transition-all">Shape</a>
            <a href="#inventory" className="hover:text-[#1f4fa3] transition-all">Equipment</a>
            <a href="#learning" className="hover:text-[#1f4fa3] transition-all">Learning</a>
            <a href="#about" className="hover:text-[#1f4fa3] transition-all">Campus</a>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-xs font-black uppercase tracking-widest text-[#6b7280] hover:text-[#1f4fa3] transition-colors">Log In</Link>
            <Link to="/login" className="bg-[#1f4fa3] text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#173e82] transition-all shadow-xl shadow-blue-900/10 flex items-center gap-2 group">
              Join Platform <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Persistent Backgrounds */}
      <section className="relative h-[90vh] min-h-[750px] flex items-center overflow-hidden bg-slate-950">
        {/* Persistent Background Stack */}
        <div className="absolute inset-0 z-0">
          {heroBgs.map((url, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{ 
                opacity: bgIndex === i ? 1 : 0,
                scale: bgIndex === i ? 1 : 1.05
              }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <img 
                src={url} 
                className="w-full h-full object-cover"
                alt={`Campus scene ${i}`}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
              />
              {/* High Contrast Overlays */}
              <div className="absolute inset-0 bg-slate-950/50" />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/90" />
            </motion.div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="max-w-3xl text-white"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Institutional Laboratory Portal
            </div>
            <h1 className="text-6xl md:text-8xl font-black leading-[0.95] mb-8 tracking-tighter drop-shadow-2xl">
              The Heart of <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-300">Engineering.</span>
            </h1>
            <p className="text-xl text-blue-50/90 mb-10 leading-relaxed font-semibold max-w-xl drop-shadow-md">
              A professional ecosystem built to manage, track, and empower access to specialized infrastructure across the entire faculty.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <Link to="/login" className="bg-white text-[#1f4fa3] px-10 py-5 rounded-2xl text-lg font-bold hover:bg-blue-50 hover:scale-[1.05] transition-all shadow-2xl flex items-center justify-center gap-3">
                Enter Portal <ChevronRight size={22} />
              </Link>
              <a href="#inventory" className="px-10 py-5 rounded-2xl text-lg font-bold text-white bg-white/5 backdrop-blur-md border border-white/20 hover:bg-white/10 transition-all flex items-center justify-center gap-3 group">
                Browse Assets <Box size={22} className="group-hover:rotate-12 transition-transform" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Look: High Level Stats */}
      <section className="relative -mt-20 z-20 px-6 pb-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <DashStatCard label="Total Equipment" value={dashStats.totalEquipment} icon={Package} color="blue" />
           <DashStatCard label="Active Students" value={dashStats.activeStudents} icon={Users} color="indigo" />
           <DashStatCard label="Resources" value={dashStats.totalResources} icon={BookOpen} color="purple" />
           <DashStatCard label="Campus Labs" value={dashStats.campusLabs} icon={Activity} color="cyan" />
        </div>
      </section>

      {/* Equipment by Departments Section (Dashboard Style) */}
      <section id="inventory" className="py-32 bg-white px-6">
         <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16">
               <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#1f4fa3]">
                    <Box size={18} className="animate-spin-slow" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Inventory Explorer</span>
                  </div>
                  <h2 className="text-4xl font-black text-[#2c3e50] tracking-tight">Institutional Assets</h2>
                  <p className="text-[#6b7280] max-w-lg font-medium">Recorded and maintained by our certified storekeepers across all departments.</p>
               </div>
               
               <div className="flex bg-[#f8fafc] p-1.5 rounded-2xl border border-slate-100 w-full lg:w-auto overflow-x-auto scrollbar-hide">
                  {['All', 'RE', 'MECH', 'ICT', 'ELEC'].map(tab => (
                    <button 
                      key={tab}
                      onClick={() => {
                        setActiveDept(tab);
                        setPagination(prev => ({ ...prev, current: 1 }));
                      }}
                      className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeDept === tab ? 'bg-white text-[#1f4fa3] shadow-lg shadow-blue-900/5' : 'text-[#6b7280] hover:text-[#1f4fa3]'}`}
                    >
                      {tab === 'All' ? 'All Departments' : tab}
                    </button>
                  ))}
               </div>
            </div>

            {/* Equipment Grid - Dashboard List Style */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               {/* Sidebar Dept List */}
               <div className="lg:col-span-3 space-y-4">
                  {departments.map((dept) => (
                    <div 
                      key={dept.id} 
                      onClick={() => {
                        setActiveDept(dept.id);
                        setPagination(prev => ({ ...prev, current: 1 }));
                      }}
                      className={`p-6 rounded-[2rem] border flex items-center justify-between group transition-all cursor-pointer ${activeDept === dept.id ? 'bg-white shadow-xl shadow-blue-900/5 border-blue-100' : 'bg-[#f8fafc] border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-blue-900/5'}`}
                    >
                       <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${activeDept === dept.id ? 'bg-blue-50 text-[#1f4fa3]' : `${dept.bg} ${dept.color}`} rounded-2xl flex items-center justify-center`}>
                            <dept.icon size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-black text-[#2c3e50]">{dept.name}</p>
                            <p className="text-[10px] font-bold text-[#9ca3af]">Official Registry</p>
                          </div>
                       </div>
                       <ChevronRight size={16} className={`transition-colors ${activeDept === dept.id ? 'text-[#1f4fa3]' : 'text-slate-300 group-hover:text-[#1f4fa3]'}`} />
                    </div>
                  ))}
                  <div className="p-8 bg-gradient-to-br from-[#1f4fa3] to-[#4f46e5] rounded-[2rem] text-white space-y-4 shadow-xl shadow-blue-900/20">
                     <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Technician Note</p>
                     <p className="text-sm font-bold leading-relaxed italic">"Inventory is synced every 24 hours with the central registry."</p>
                     <button className="w-full py-3 bg-white/10 hover:bg-white/20 transition-all rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                        View Staff Protocols <ExternalLink size={12} />
                     </button>
                  </div>
               </div>

               {/* Equipment Table Preview */}
               <div className="lg:col-span-9 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                  <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                     <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#2c3e50]">
                       Live Registry Preview <span className="text-slate-300 ml-2">({pagination.total} Items)</span>
                     </h3>
                     <div className="flex items-center gap-4">
                        <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-[#1f4fa3] hover:underline">Full Details</Link>
                        {pagination.pages > 1 && (
                          <div className="flex items-center gap-2">
                             <button 
                                disabled={pagination.current === 1}
                                onClick={() => setPagination(prev => ({ ...prev, current: prev.current - 1 }))}
                                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#1f4fa3] disabled:opacity-30 disabled:cursor-not-allowed"
                             >
                                <ChevronRight size={14} className="rotate-180" />
                             </button>
                             <span className="text-[10px] font-black text-slate-400">{pagination.current} / {pagination.pages}</span>
                             <button 
                                disabled={pagination.current === pagination.pages}
                                onClick={() => setPagination(prev => ({ ...prev, current: prev.current + 1 }))}
                                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#1f4fa3] disabled:opacity-30 disabled:cursor-not-allowed"
                             >
                                <ChevronRight size={14} />
                             </button>
                          </div>
                        )}
                     </div>
                  </div>
                  
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                     {fetchLoading ? (
                        <div className="col-span-2 flex items-center justify-center h-full">
                           <Activity className="animate-spin text-[#1f4fa3]" size={32} />
                        </div>
                     ) : (
                        equipmentData.map((item, idx) => (
                           <div 
                             key={idx} 
                             onClick={() => setSelectedItem(item)}
                             className="bg-[#f8fafc] border border-slate-50 rounded-3xl p-4 flex gap-4 hover:shadow-lg hover:shadow-blue-900/5 transition-all group outline outline-1 outline-slate-100 cursor-pointer"
                           >
                              <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-slate-200">
                                <img 
                                  src={item.image || "https://images.unsplash.com/photo-1581093458891-b9883f8792e4?auto=format&fit=crop&q=80&w=200"} 
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                  alt={item.name} 
                                  crossOrigin="anonymous"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div className="flex flex-col justify-between py-1">
                                 <div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-[#1f4fa3] bg-blue-50 px-2 py-0.5 rounded-full mb-2 inline-block">{item.department}</span>
                                    <h4 className="text-sm font-black text-[#2c3e50] line-clamp-1">{item.name}</h4>
                                    <p className="text-[10px] font-bold text-[#9ca3af] mt-1">SN: {item.serialNumber || 'Institutional Asset'}</p>
                                 </div>
                                 <div className="flex items-center gap-2 mt-2">
                                    <div className={`w-2 h-2 rounded-full ${item.status === 'Available' ? 'bg-green-500' : item.status === 'In Use' ? 'bg-amber-500' : 'bg-red-500'}`} />
                                    <span className="text-[10px] font-black uppercase text-[#6b7280]">{item.status}</span>
                                 </div>
                              </div>
                           </div>
                        ))
                     )}

                     {!fetchLoading && equipmentData.length === 0 && (
                        <div className="col-span-2 flex flex-col items-center justify-center opacity-40">
                           <Box size={48} className="mb-4" />
                           <p className="text-xs font-black uppercase tracking-widest">No Items Registered Yet</p>
                        </div>
                     )}
                  </div>

                  <EquipmentDetailsModal 
                     isOpen={!!selectedItem}
                     onClose={() => setSelectedItem(null)}
                     equipment={selectedItem}
                     readOnly={true}
                  />
                  <div className="mt-auto p-10 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#1f4fa3]">
                           <Lock size={20} />
                        </div>
                        <p className="text-sm font-bold text-[#2c3e50] max-w-xs">To submit a request for any of these items, please log in with your institutional credentials.</p>
                     </div>
                     <Link to="/login" className="bg-[#1f4fa3] text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#173e82] transition-all flex items-center gap-2 whitespace-nowrap">
                        Sign In to Request <ChevronRight size={14} />
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Campus & Lab Moments */}
      <section id="about" className="py-32 px-6 bg-[#f8fafc]">
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1f4fa3]">Inside Our Labs</span>
               <h2 className="text-5xl font-black text-[#2c3e50] tracking-tight leading-[1.1]">Where Theory Meets <span className="text-[#1f4fa3]">Reality.</span></h2>
               <p className="text-lg text-[#6b7280] font-medium leading-relaxed">
                  Our state-of-the-art facilities are designed to foster innovation. From small research groups to large departmental lectures, our labs provide the physical tools necessary for groundbreaking engineering discovery.
               </p>
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                     <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-green-500">
                        <CheckCircle size={24} />
                     </div>
                     <h4 className="font-black text-[#2c3e50]">24/7 Security</h4>
                     <p className="text-xs text-[#6b7280] font-bold">Every piece of equipment is electronically tagged and monitored.</p>
                  </div>
                  <div className="space-y-4">
                     <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-500">
                        <Users size={24} />
                     </div>
                     <h4 className="font-black text-[#2c3e50]">Expert Staff</h4>
                     <p className="text-xs text-[#6b7280] font-bold">Dedicated technicians available for training and assistance.</p>
                  </div>
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 relative">
               <div className="space-y-4 pt-12">
                  <div className="relative group overflow-hidden rounded-[3rem] shadow-xl">
                    <img 
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000" 
                      className="w-full h-80 object-cover bg-slate-200 group-hover:scale-110 transition-transform duration-700" 
                      alt="Students in Lab" 
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="relative group overflow-hidden rounded-[3rem] shadow-xl">
                    <img 
                      src="https://images.unsplash.com/photo-1581091226033-d5c48150dbbc?auto=format&fit=crop&q=80&w=1000" 
                      className="w-full h-56 object-cover bg-slate-200 group-hover:scale-110 transition-transform duration-700" 
                      alt="Lab session" 
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                    />
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="relative group overflow-hidden rounded-[3rem] shadow-xl">
                    <img 
                      src="https://images.unsplash.com/photo-1576085898323-2183ba9b2203?auto=format&fit=crop&q=80&w=1000" 
                      className="w-full h-56 object-cover bg-slate-200 group-hover:scale-110 transition-transform duration-700" 
                      alt="Engineering tool" 
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="relative group overflow-hidden rounded-[3rem] shadow-xl">
                    <img 
                      src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000" 
                      className="w-full h-80 object-cover bg-slate-200 group-hover:scale-110 transition-transform duration-700" 
                      alt="Collaboration" 
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                    />
                  </div>
               </div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-2xl z-20 border-8 border-[#f8fafc]">
                  <div className="text-center">
                    <p className="text-2xl font-black text-[#1f4fa3]">12</p>
                    <p className="text-[10px] font-black uppercase text-[#9ca3af]">World-class Labs</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Learning Center (Public Access) */}
      <section id="learning" className="py-32 px-6 bg-slate-900 overflow-hidden relative">
         <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none select-none">
            <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-white to-transparent top-1/4" />
            <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-white to-transparent top-3/4" />
         </div>
         
         <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20 text-white">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#60a5fa] mb-6 inline-block">Learning Resources</span>
               <h2 className="text-5xl font-black tracking-tight">Open Knowledge Hub</h2>
               <p className="text-slate-400 max-w-2xl mx-auto mt-6 text-lg font-medium italic">Preparing the next generation of engineers with high-quality training materials.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {resourcesData.length > 0 ? resourcesData.map((resource, idx) => (
                  <LearningCard 
                     key={resource.id || idx}
                     title={resource.title} 
                     type={resource.type} 
                     color={idx % 4 === 0 ? "blue" : idx % 4 === 1 ? "indigo" : idx % 4 === 2 ? "purple" : "cyan"} 
                     img={resource.thumbnail || "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=600"}
                     url={resource.url}
                  />
               )) : (
                  <>
                     <LearningCard 
                        title="Lab Safety Essentials" 
                        type="PDF" 
                        color="blue" 
                        img="https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=600"
                     />
                     <LearningCard 
                        title="Intro to Robotics" 
                        type="Video" 
                        color="indigo" 
                        img="https://images.unsplash.com/photo-1531746790731-6c087fecd05a?auto=format&fit=crop&q=80&w=600"
                     />
                     <LearningCard 
                        title="Circuit Design Basics" 
                        type="Document" 
                        color="purple" 
                        img="https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&q=80&w=600"
                     />
                     <LearningCard 
                        title="Smart Grid Systems" 
                        type="Link" 
                        color="cyan" 
                        img="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=600"
                     />
                  </>
               )}
            </div>

            <div className="mt-20 text-center">
               <Link to="/login" className="inline-flex items-center gap-3 text-[#60a5fa] font-black uppercase tracking-widest text-xs hover:text-white transition-colors group">
                  Access Full Digital Library <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
               </Link>
            </div>
         </div>
      </section>

      {/* Footer (Matches Dashboard UI) */}
      <footer className="bg-white text-[#2c3e50] py-24 px-6 border-t border-slate-100 relative overflow-hidden">
         <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-10">
               <div className="w-12 h-12 bg-[#1f4fa3] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-900/10">
                  <Cpu size={24} />
               </div>
               <span className="text-4xl font-black tracking-tighter uppercase text-[#1f4fa3]">Smart <span className="text-[#60a5fa]">Uni</span></span>
            </div>
            
            <nav className="flex flex-wrap justify-center gap-10 mb-16 text-xs font-black uppercase tracking-widest text-[#6b7280]">
               <a href="#" className="hover:text-[#1f4fa3] transition-colors">Catalog</a>
               <a href="#" className="hover:text-[#1f4fa3] transition-colors">Security</a>
               <a href="#" className="hover:text-[#1f4fa3] transition-colors">Campus</a>
               <a href="#" className="hover:text-[#1f4fa3] transition-colors">Contact</a>
               <a href="#" className="hover:text-[#1f4fa3] transition-colors">Documentation</a>
            </nav>

            <div className="w-full h-px bg-slate-50 mb-16" />

            <div className="flex flex-col md:flex-row justify-between items-center w-full text-[10px] font-black uppercase tracking-widest text-slate-400 gap-8">
               <p>&copy; 2024 Smart University Platform. engineering ecosystem.</p>
               <div className="flex items-center gap-10">
                  <div className="flex -space-x-2">
                     <div className="w-8 h-8 rounded-full border-4 border-white bg-blue-500 flex items-center justify-center text-white text-[8px] font-black">SU</div>
                     <div className="w-8 h-8 rounded-full border-4 border-white bg-indigo-500 flex items-center justify-center text-white text-[8px] font-black">EN</div>
                  </div>
                  <div className="flex gap-8">
                    <a href="#" className="hover:text-[#1f4fa3]">Privacy</a>
                    <a href="#" className="hover:text-[#1f4fa3]">Terms</a>
                  </div>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
};

const DashStatCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-900/5 flex flex-col justify-between hover:scale-[1.02] transition-all group">
     <div className="flex justify-between items-start mb-6">
        <div>
           <h3 className="text-4xl font-black text-[#2c3e50] mb-1 tracking-tighter">{value}</h3>
           <p className="text-[10px] font-black uppercase tracking-widest text-[#9ca3af]">{label}</p>
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform ${
           color === 'blue' ? 'bg-blue-50 text-blue-500' : 
           color === 'indigo' ? 'bg-indigo-50 text-indigo-500' : 
           color === 'purple' ? 'bg-purple-50 text-purple-500' : 'bg-cyan-50 text-cyan-500'
        }`}>
           <Icon size={20} />
        </div>
     </div>
     <div className="flex items-center gap-2 text-[10px] text-[#22c55e] font-black uppercase tracking-widest mt-auto">
        <Activity size={12} /> System Active
     </div>
  </div>
);

const LearningCard = ({ title, type, color, img, url }) => (
  <div 
    onClick={() => url && window.open(url, '_blank')}
    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] hover:bg-white/10 transition-all cursor-pointer group hover:scale-[1.05] flex flex-col h-full overflow-hidden"
  >
     <div className="h-48 w-full relative">
        <img 
          src={img} 
          className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity" 
          alt={title}
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
        <div className={`absolute top-6 left-6 w-12 h-12 ${
          color === 'blue' ? 'bg-blue-500/20 text-blue-400' : 
          color === 'indigo' ? 'bg-indigo-500/20 text-indigo-400' : 
          color === 'purple' ? 'bg-purple-500/20 text-purple-400' : 'bg-cyan-500/20 text-cyan-400'
        } rounded-2xl backdrop-blur-md flex items-center justify-center`}>
           {type === 'Video' ? <PlayLine size={20} /> : type === 'PDF' ? <FileText size={20} /> : <BookOpen size={20} />}
        </div>
     </div>
     <div className="p-8 pt-4">
        <h4 className="text-white font-black text-xl mb-4 leading-tight group-hover:text-blue-300 transition-colors uppercase tracking-tight">{title}</h4>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Public Resource &bull; {type}</p>
     </div>
  </div>
);

const FileText = ({ size }) => <BookOpen size={size} />;
const PlayLine = ({ size }) => <Zap size={size} />;

export default Home;


