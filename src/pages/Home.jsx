import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Cpu, 
  BookOpen,
  Box,
  ChevronRight,
  Activity,
  Package,
  Users,
  Search,
  Rocket,
  ShieldCheck,
  Zap,
  Globe,
  Settings,
  Star,
  Quote,
  Layers,
  BarChart3,
  MousePointer2,
  Menu,
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../config/api';
import EquipmentDetailsModal from '../components/EquipmentDetailsModal';
import ResourceDetailsModal from '../components/ResourceDetailsModal';

const Home = () => {
  const [dashStats, setDashStats] = useState({
    totalEquipment: '0',
    activeStudents: '0',
    totalResources: '0',
    campusLabs: '12'
  });

  const [equipment, setEquipment] = useState([]);
  const [learning, setLearning] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bgIndex, setBgIndex] = useState(0);

  // Modal States
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const heroImages = [
    "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80&w=1200", // Lab Tech
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200", // Workspace
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1200", // Students
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200", // Modern Office
    "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&q=80&w=1200"  // Engineering
  ];

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [statsRes, equipRes, learnRes, storyRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/dashboard/stats`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/equipment?limit=4`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/resources`).then(r => r.json()),
          fetch(`${API_BASE_URL}/api/incubation/stories`).then(r => r.json())
        ]);

        setDashStats({
          totalEquipment: statsRes.totalEquipment?.toLocaleString() || '0',
          activeStudents: statsRes.totalUsers?.toLocaleString() || '0',
          totalResources: statsRes.totalResources?.toLocaleString() || '0',
          campusLabs: statsRes.campusLabs || '12'
        });
        setEquipment(equipRes.equipment || []);
        setLearning(learnRes.slice(0, 3) || []);
        setStories(storyRes.slice(0, 3) || []);
      } catch (err) {
        console.error("Home data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-[#2c3e50] selection:bg-blue-100 italic-none">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 z-[100]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1f4fa3] to-[#60a5fa] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/10 group-hover:scale-105 transition-transform">
              <Cpu size={22} />
            </div>
            <span className="text-xl font-black tracking-tighter text-[#1f4fa3]">
              SMART<span className="text-[#60a5fa]">UNI</span>
            </span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-10 text-[11px] font-black uppercase tracking-widest text-[#6b7280]">
            <a href="#shape-guide" className="hover:text-[#1f4fa3] transition-all">Shape & Guide</a>
            <a href="#equipment" className="hover:text-[#1f4fa3] transition-all">Equipment</a>
            <a href="#learning" className="hover:text-[#1f4fa3] transition-all">Learning</a>
            <Link to="/public-incubation" className="hover:text-[#1f4fa3] transition-all">Incubation Center</Link>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <Link to="/login" className="hidden md:block text-xs font-black uppercase tracking-widest text-[#6b7280] hover:text-[#1f4fa3] transition-colors">Log In</Link>
            <Link to="/login" className="bg-[#1f4fa3] text-white px-4 md:px-6 py-3 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-[#173e82] transition-all shadow-xl shadow-blue-900/10 flex items-center gap-2 group">
              Join <span className="hidden sm:inline">Platform</span> <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navbar Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-b border-slate-100 overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-6 text-[11px] font-black uppercase tracking-[0.2em] text-[#6b7280]">
                <a href="#shape-guide" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#1f4fa3]">Shape & Guide</a>
                <a href="#equipment" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#1f4fa3]">Equipment</a>
                <a href="#learning" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#1f4fa3]">Learning</a>
                <Link to="/public-incubation" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#1f4fa3]">Incubation Center</Link>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="pt-4 border-t border-slate-50 text-[#1f4fa3]">Log In</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section with Full Background Slider */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Slider */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence initial={false}>
            <motion.div
              key={bgIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "linear" }}
              className="absolute inset-0"
            >
              <img 
                src={heroImages[bgIndex]} 
                alt="Lab Background" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]" />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-300 text-[10px] md:text-[11px] font-black uppercase tracking-widest border border-blue-400/20 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Institutional Laboratory Portal
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-[5.5rem] font-black text-white leading-[1] tracking-tighter italic-none">
              The Heart of <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400">Engineering.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-200 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
              A professional ecosystem built to manage, track, and empower access to specialized infrastructure. We guide you from lab mastery to startup success.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link to="/login" className="bg-[#1f4fa3] text-white px-10 py-5 rounded-2xl text-sm font-black uppercase tracking-widest shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:bg-blue-600 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                Enter Portal <ChevronRight size={18} />
              </Link>
              <a href="#shape-guide" className="bg-white/10 backdrop-blur-md border-2 border-white/20 text-white px-10 py-5 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-white/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                Quick Guide <MousePointer2 size={18} />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Infinity Moving Images Marquee */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden bg-white/5 backdrop-blur-sm border-t border-white/10 py-8">
           <div className="flex whitespace-nowrap animate-marquee">
              {[...heroImages, ...heroImages].map((img, i) => (
                <div key={i} className="flex-none w-64 md:w-80 h-40 md:h-48 mx-4 rounded-2xl overflow-hidden border border-white/20 shadow-xl group">
                   <img src={img} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500" />
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Adding Marquee Animation Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}} />

      {/* DASHBOARD SUMMARY CARDS */}
      <section className="px-6 max-w-7xl mx-auto py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           <DashStatCard label="Total Equipment" value={dashStats.totalEquipment} icon={Package} color="blue" />
           <DashStatCard label="Active Students" value={dashStats.activeStudents} icon={Users} color="indigo" />
           <DashStatCard label="Resources" value={dashStats.totalResources} icon={BookOpen} color="emerald" />
           <DashStatCard label="Campus Labs" value={dashStats.campusLabs} icon={Activity} color="cyan" />
        </div>
      </section>

      {/* SHAPE & GUIDE - COMPREHENSIVE PLATFORM INFO */}
      <section id="shape-guide" className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/70 -skew-x-12 translate-x-1/2 -z-10" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="text-blue-600 text-xs font-black tracking-[0.3em] uppercase mb-6 inline-block bg-blue-50 px-5 py-2 rounded-full">Platform Ecosystem</span>
                <h2 className="text-5xl font-black text-[#2c3e50] tracking-tighter leading-[0.95] mb-8">
                  Designed for <br/>
                  <span className="text-blue-600 italic-none">Elite Engineering.</span>
                </h2>
                <p className="text-lg text-[#6b7280] font-medium leading-relaxed max-w-xl">
                  SmartUni integrates hardware management, digital learning, and business incubation into a single streamlined workflow. Our mission is to eliminate barriers between institutional resources and student innovation.
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SummaryFeature icon={Layers} title="Unified Control" desc="All departments synced in real-time under one central database." />
                <SummaryFeature icon={BarChart3} title="Data Analytics" desc="Predictive maintenance and usage tracking for institutional assets." />
                <SummaryFeature icon={Globe} title="Cloud Sync" desc="Access catalogs and reservation status from any device, anywhere." />
                <SummaryFeature icon={ShieldCheck} title="Role-Based Security" desc="Granular access control for students, lab staff, and administrators." />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <GuideCard index="01" title="Discover" icon={Search} color="blue" desc="Explore the full catalog of specialized engineering tools and lab spaces." />
              <GuideCard index="02" title="Certify" icon={BookOpen} color="indigo" desc="Watch tutorials and download manuals to unlock equipment access." />
              <GuideCard index="03" title="Reserve" icon={Package} color="emerald" desc="Instantly book assets and track your active loans in real-time." />
              <GuideCard index="04" title="Incubate" icon={Rocket} color="teal" desc="Propose your prototype for the Incubation Center to receive funding." />
            </div>
          </div>
        </div>
      </section>

      {/* EQUIPMENT PREVIEW */}
      <section id="equipment" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-16 px-2">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-black text-[#2c3e50] tracking-tight mb-4">Latest Assets</h2>
            <p className="text-[#6b7280] font-medium text-lg leading-relaxed">Check out the newest additions to our faculty laboratories, ready for reservation.</p>
          </div>
          <Link to="/login" className="text-[#1f4fa3] font-black uppercase text-xs tracking-widest flex items-center gap-3 bg-white px-8 py-4 rounded-2xl hover:bg-slate-50 transition-all border border-slate-100 shadow-sm">
            View Inventory <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {equipment.length > 0 ? equipment.map((item, idx) => (
             <motion.div 
               whileHover={{ y: -8 }}
               key={idx} 
               onClick={() => setSelectedEquipment(item)}
               className="bg-white border border-slate-100 rounded-[2.5rem] p-5 shadow-sm hover:shadow-2xl transition-all h-full flex flex-col group overflow-hidden cursor-pointer"
             >
               <div className="aspect-square rounded-[2rem] overflow-hidden mb-6 bg-slate-50 relative">
                  <img 
                    src={item.image || "https://images.unsplash.com/photo-1581093458891-b9883f8792e4?auto=format&fit=crop&q=80&w=600"} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-[9px] font-black uppercase text-blue-600 shadow-sm border border-blue-100">
                    {item.department}
                  </div>
               </div>
               <div className="flex-1 flex flex-col px-2">
                 <h4 className="text-lg font-black text-[#2c3e50] mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors uppercase italic-none sm:text-lg">{item.name}</h4>
                 <div className="flex items-center justify-between mt-auto pt-4">
                    <div className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${item.status === 'Available' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} />
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.status}</span>
                    </div>
                    <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                       <ArrowRight size={14} />
                    </button>
                 </div>
               </div>
             </motion.div>
          )) : (
            <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
              <Package size={64} className="mx-auto mb-6 text-slate-200" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-sm italic-none">Synchronizing with Lab Database...</p>
            </div>
          )}
        </div>
      </section>

      {/* LEARNING HUB */}
      <section id="learning" className="py-32 bg-slate-50/50 border-y border-slate-100 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-blue-600 text-[11px] font-black tracking-[0.3em] uppercase mb-4 inline-block bg-blue-50 px-4 py-1.5 rounded-full">Knowledge Hub</span>
            <h2 className="text-4xl md:text-5xl font-black text-[#2c3e50] tracking-tight mb-8">Master Your Tools</h2>
            <p className="text-[#6b7280] font-medium text-lg leading-relaxed max-w-2xl mx-auto italic-none">Our resource library contains essential guides and interactive manuals for every piece of high-precision equipment on campus.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {learning.length > 0 ? learning.map((res, idx) => (
              <motion.div 
                whileHover={{ y: -10 }}
                key={idx} 
                onClick={() => setSelectedResource(res)}
                className="bg-white rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-slate-100 flex flex-col h-full group cursor-pointer"
              >
                <div className="h-64 relative overflow-hidden bg-slate-200">
                  <img src={res.thumbnail || "https://images.unsplash.com/photo-1581091226033-d5c48150dbbc?auto=format&fit=crop&q=80&w=800"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" crossOrigin="anonymous" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <div className="absolute top-6 right-6 flex items-center gap-3">
                    <div className="bg-white/95 backdrop-blur px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl">
                      <Zap size={16} className="text-blue-600" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">{res.type || 'Guide'}</span>
                    </div>
                  </div>
                </div>
                <div className="p-10 flex flex-col flex-1">
                  <h3 className="text-2xl font-black text-[#2c3e50] mb-4 leading-tight group-hover:text-blue-600 transition-colors italic-none">{res.title}</h3>
                  <p className="text-base text-[#6b7280] font-medium mb-10 flex-1 leading-relaxed italic-none">Comprehensive technical certification module designed to ensure safe and proficient laboratory operation.</p>
                  <button className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1f4fa3] flex items-center gap-3 hover:gap-5 transition-all">
                    Access Resource <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            )) : (
              <p className="col-span-full text-center text-slate-400 py-28 italic-none font-bold uppercase tracking-widest opacity-40">Loading latest curriculum...</p>
            )}
          </div>
        </div>
      </section>

      {/* INCUBATION SPOTLIGHT */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20 px-4">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-black text-[#2c3e50] tracking-tight mb-4">Startup Spotlights</h2>
            <p className="text-[#6b7280] font-medium text-lg leading-relaxed">Witness the transformation of academic projects into viable technology startups through our specialized incubation ecosystem.</p>
          </div>
          <Link to="/public-incubation" className="text-white bg-gradient-to-r from-teal-600 to-emerald-600 px-8 py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest flex items-center gap-3 shadow-xl shadow-teal-500/20 hover:shadow-teal-500/40 hover:-translate-y-1 transition-all">
            Enter Incubator <Rocket size={20} />
          </Link>
        </div>

        <div className="relative overflow-hidden py-10">
          <div className="flex gap-10 animate-marquee hover:pause whitespace-nowrap">
            {(stories.length > 0 ? [...stories, ...stories] : []).map((story, idx) => (
              <motion.div 
                whileHover={{ y: -8 }}
                key={idx} 
                className="w-[400px] flex-none bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-2xl transition-all whitespace-normal"
              >
                <div className="h-64 relative overflow-hidden bg-slate-50">
                  <img src={story.image || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" crossOrigin="anonymous" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">Founder</p>
                    <p className="text-lg font-black">{story.studentName}</p>
                  </div>
                </div>
                <div className="p-10 flex flex-col flex-1 text-left">
                  <h3 className="text-2xl font-black text-[#2c3e50] mb-4 leading-[1.1]">{story.projectName}</h3>
                  <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed line-clamp-3">{story.description}</p>
                  <div className="mt-auto flex items-center justify-between p-6 bg-slate-50/80 rounded-3xl border border-slate-100">
                     <span className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Growth Status</span>
                     <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black uppercase text-emerald-600 tracking-widest">{story.companyStatus || 'Funded'}</span>
                        <CheckCircle2 size={16} className="text-emerald-500" />
                     </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {stories.length === 0 && (
              <p className="w-full text-center text-slate-400 py-28 italic-none font-black tracking-widest uppercase opacity-40">Fetching innovative breakthroughs...</p>
            )}
          </div>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          .pause:hover {
            animation-play-state: paused;
          }
        `}} />
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-100 text-[#6b7280] py-24 px-6 relative overflow-hidden">
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-16 mb-20">
            <div className="lg:col-span-1 space-y-6">
              <Link to="/" className="flex items-center gap-3 text-[#2c3e50] group">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1f4fa3] to-[#60a5fa] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/10">
                  <Cpu size={24} />
                </div>
                <span className="text-3xl font-black tracking-tighter uppercase">SMART<span className="text-[#60a5fa]">UNI</span></span>
              </Link>
              <p className="text-sm font-medium leading-relaxed">
                Empowering the next generation of engineers through advanced facility management and strategic resource allocation.
              </p>
            </div>
            
            <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-10">
              <FooterLinks title="Platform" links={['Management', 'Equipment', 'Learning Map', 'Cloud Sync']} />
              <FooterLinks title="Faculty" links={['Mechatronics', 'Electronics', 'ICT Center', 'Renewable Lab']} />
              <FooterLinks title="Navigation" links={['Shape & Guide', 'Login Portal', 'Student Card', 'Support']} />
              <FooterLinks title="Company" links={['About Hub', 'Staff Portal', 'Privacy Desk', 'Guidelines']} />
            </div>
         </div>
         
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center w-full text-[11px] font-black tracking-[0.3em] border-t border-slate-100 pt-12 gap-10 uppercase opacity-60">
            <p>&copy; 2026 Institutional Laboratory Portal. All rights reserved.</p>
            <div className="flex gap-10">
              <a href="#" className="hover:text-[#1f4fa3] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[#1f4fa3] transition-colors">Terms</a>
              <a href="#" className="hover:text-[#1f4fa3] transition-colors">Contact Center</a>
            </div>
         </div>
      </footer>

      {/* MODALS */}
      <EquipmentDetailsModal 
        isOpen={!!selectedEquipment} 
        onClose={() => setSelectedEquipment(null)} 
        equipment={selectedEquipment} 
      />
      <ResourceDetailsModal 
        isOpen={!!selectedResource} 
        onClose={() => setSelectedResource(null)} 
        resource={selectedResource} 
      />
    </div>
  );
};

// COMPONENT HELPERS

const DashStatCard = ({ label, value, icon: Icon, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/40 flex flex-col justify-between hover:shadow-blue-500/5 transition-all group border border-slate-50 overflow-hidden relative"
  >
     <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50/50 rounded-full blur-[60px] -mr-16 -mt-16 pointer-events-none group-hover:bg-blue-50/50 transition-colors" />
     <div className="flex justify-between items-start mb-8 relative z-10">
        <h3 className="text-5xl font-black text-[#2c3e50] tracking-tighter leading-none">{value}</h3>
        <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center shadow-inner ${
           color === 'blue' ? 'bg-blue-50 text-blue-600 shadow-blue-500/10' : 
           color === 'indigo' ? 'bg-indigo-50 text-indigo-600 shadow-indigo-500/10' : 
           color === 'emerald' ? 'bg-emerald-50 text-emerald-600 shadow-emerald-500/10' : 
           'bg-cyan-50 text-cyan-600 shadow-cyan-500/10'
        }`}>
           <Icon size={32} />
        </div>
     </div>
     <div className="relative z-10">
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#9ca3af] mb-4">{label}</p>
        <div className="flex items-center gap-2 text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-auto">
           <Activity size={14} className="animate-pulse" /> Live Status
        </div>
     </div>
  </motion.div>
);

const GuideCard = ({ index, title, desc, icon: Icon, color }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/40 border border-slate-50 flex flex-col group relative"
  >
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-10 shadow-sm border ${
      color === 'blue' ? 'bg-blue-50 text-blue-600 border-blue-100' :
      color === 'indigo' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
      color === 'emerald' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
      'bg-teal-50 text-teal-600 border-teal-100'
    }`}>
      <Icon size={32} />
    </div>
    <div className="flex items-start gap-5">
      <span className="text-4xl font-black text-slate-100/50 leading-none">{index}</span>
      <div>
        <h3 className="text-2xl font-black text-[#2c3e50] mb-3 leading-none italic-none">{title}</h3>
        <p className="text-sm font-medium text-[#6b7280] leading-relaxed italic-none">{desc}</p>
      </div>
    </div>
  </motion.div>
);

const SummaryFeature = ({ icon: Icon, title, desc }) => (
  <div className="flex items-start gap-4">
    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-slate-100 text-[#1f4fa3] border border-slate-50 shrink-0">
      <Icon size={20} />
    </div>
    <div>
      <h4 className="text-lg font-black text-[#2c3e50] mb-1 italic-none">{title}</h4>
      <p className="text-[13px] text-[#6b7280] font-medium leading-relaxed italic-none">{desc}</p>
    </div>
  </div>
);

const FooterLinks = ({ title, links }) => (
  <div>
    <h4 className="text-[#2c3e50] font-black text-sm uppercase tracking-widest mb-8 italic-none">{title}</h4>
    <ul className="space-y-4">
      {links.map((l, i) => (
        <li key={i}><a href="#" className="text-sm font-medium hover:text-[#1f4fa3] transition-colors italic-none">{l}</a></li>
      ))}
    </ul>
  </div>
);

const CheckCircle2 = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default Home;
