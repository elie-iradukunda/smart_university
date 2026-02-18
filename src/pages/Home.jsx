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
  BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-[#2c3e50]">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#1f4fa3] rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-900/10">
              <Cpu size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#1f4fa3] uppercase">Smart <span className="text-[#60a5fa]">Uni</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#6b7280]">
            <a href="#features" className="hover:text-[#1f4fa3] transition-colors">Features</a>
            <a href="#departments" className="hover:text-[#1f4fa3] transition-colors">Departments</a>
            <a href="#solutions" className="hover:text-[#1f4fa3] transition-colors">Solutions</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold text-[#1f4fa3] hover:text-[#173e82]">Log In</Link>
            <Link to="/login" className="bg-[#1f4fa3] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#173e82] transition-colors shadow-lg shadow-blue-900/20 flex items-center gap-2">
              Get Started <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50 to-transparent -z-10" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#1f4fa3] text-xs font-bold mb-6 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#1f4fa3] animate-pulse"></span>
              Next Gen Laboratory Management
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-[#2c3e50] leading-tight mb-6">
              Empowering Future <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1f4fa3] to-[#60a5fa]">Innovators</span>
            </h1>
            <p className="text-lg text-[#6b7280] mb-8 leading-relaxed max-w-lg">
              A comprehensive platform for managing university laboratory assets, reservations, and learning resources across multiple engineering disciplines.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/login" className="bg-[#1f4fa3] text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-[#173e82] transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2">
                Access Portal <ArrowRight size={18} />
              </Link>
              <button className="px-8 py-4 rounded-xl text-base font-semibold text-[#1f4fa3] border border-blue-100 hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                <Layout size={18} /> View Demo
              </button>
            </div>
            
            <div className="mt-12 flex items-center gap-4 text-sm text-[#6b7280]">
               <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                     <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" style={{backgroundImage: `url(https://i.pravatar.cc/100?img=${i+10})`, backgroundSize: 'cover'}}></div>
                  ))}
               </div>
               <p>Trusted by <span className="font-bold text-[#2c3e50]">2,000+</span> students & staff</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
             <div className="relative z-10 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                <img src="https://images.unsplash.com/photo-1581093458891-b9883f8792e4?q=80&w=2070&auto=format&fit=crop" alt="Dashboard Preview" className="w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1f4fa3]/80 to-transparent flex items-end p-8">
                   <div className="text-white">
                      <p className="font-bold text-lg mb-1">Centralized Control</p>
                      <p className="text-white/80 text-sm">Monitor equipment usage and availability in real-time.</p>
                   </div>
                </div>
             </div>
             {/* Decor elements */}
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#60a5fa]/10 rounded-full blur-3xl" />
             <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#1f4fa3]/10 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </section>

      {/* Departments Section */}
      <section id="departments" className="py-20 bg-[#f8fafc]">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold text-[#2c3e50] mb-4">Supported Departments</h2>
               <p className="text-[#6b7280] max-w-2xl mx-auto">Tailored management solutions for specialized engineering faculties.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <DepartmentCard title="Renewable Energy" icon={Zap} desc="Solar, Wind & Hydro Lab Equipment" />
               <DepartmentCard title="Mechatronics" icon={Cpu} desc="Robotics & Automation Systems" />
               <DepartmentCard title="ICT" icon={Globe} desc="Networking & Computing Infrastructure" />
               <DepartmentCard title="Electronics" icon={Database} desc="Circuit Design & Telecom Labs" />
            </div>
         </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
               <div className="lg:col-span-1">
                  <h2 className="text-3xl font-bold text-[#2c3e50] mb-6">Everything you need to run a modern laboratory.</h2>
                  <p className="text-[#6b7280] mb-8 leading-relaxed">
                     Replace spreadsheets and manual logs with a unified digital system designed for educational institutions.
                  </p>
                  <ul className="space-y-4">
                     <FeatureListItem text="Real-time Inventory Tracking" />
                     <FeatureListItem text="Automated Check-in/Check-out" />
                     <FeatureListItem text="Maintenance Schedules" />
                     <FeatureListItem text="Student Performance Reports" />
                  </ul>
               </div>
               <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FeatureCard 
                     icon={Layout} 
                     title="Asset Management" 
                     desc="Track thousands of items with QR codes, serial numbers, and detailed status logs."
                  />
                  <FeatureCard 
                     icon={CheckCircle} 
                     title="Easy Reservations" 
                     desc="Students can book equipment online, checking availability instantly to avoid conflicts."
                  />
                  <FeatureCard 
                     icon={BookOpen} 
                     title="Learning Resources" 
                     desc="Integrated digital library for manuals, safety guides, and video tutorials."
                  />
                  <FeatureCard 
                     icon={Users} 
                     title="User Roles" 
                     desc="Granular access controls for Admins, HODs, Store Keepers, and Students."
                  />
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1f4fa3] text-white py-12 px-6">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 border-b border-white/10 pb-8">
            <div className="col-span-1 md:col-span-2">
               <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center">
                     <Cpu size={18} />
                  </div>
                  <span className="text-lg font-bold tracking-tight uppercase">Smart <span className="text-[#60a5fa]">Uni</span></span>
               </div>
               <p className="text-blue-200 text-sm max-w-xs">
                  Empowering the next generation of engineers with state-of-the-art laboratory management tools.
               </p>
            </div>
            <div>
               <h4 className="font-bold mb-4">Platform</h4>
               <ul className="space-y-2 text-sm text-blue-200">
                  <li><a href="#" className="hover:text-white">Features</a></li>
                  <li><a href="#" className="hover:text-white">Security</a></li>
                  <li><a href="#" className="hover:text-white">Roadmap</a></li>
               </ul>
            </div>
            <div>
               <h4 className="font-bold mb-4">Contact</h4>
               <ul className="space-y-2 text-sm text-blue-200">
                  <li>support@smartuni.edu</li>
                  <li>+1 (555) 123-4567</li>
                  <li>Campus Main Building</li>
               </ul>
            </div>
         </div>
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-blue-300">
            <p>&copy; 2024 Smart University Platform. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
               <a href="#" className="hover:text-white">Privacy Policy</a>
               <a href="#" className="hover:text-white">Terms of Service</a>
            </div>
         </div>
      </footer>
    </div>
  );
};

const DepartmentCard = ({ title, icon: Icon, desc }) => (
   <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-[#1f4fa3] mb-4 group-hover:bg-[#1f4fa3] group-hover:text-white transition-colors">
         <Icon size={24} />
      </div>
      <h3 className="font-bold text-[#2c3e50] mb-2">{title}</h3>
      <p className="text-sm text-[#6b7280]">{desc}</p>
   </div>
);

const FeatureCard = ({ title, icon: Icon, desc }) => (
   <div className="bg-[#f8fafc] p-6 rounded-xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-gray-100">
      <Icon size={28} className="text-[#1f4fa3] mb-4" />
      <h3 className="font-bold text-[#2c3e50] mb-2">{title}</h3>
      <p className="text-sm text-[#6b7280] leading-relaxed">{desc}</p>
   </div>
);

const FeatureListItem = ({ text }) => (
   <li className="flex items-center gap-3 text-sm text-[#6b7280]">
      <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
         <CheckCircle size={12} />
      </div>
      {text}
   </li>
);

export default Home;
