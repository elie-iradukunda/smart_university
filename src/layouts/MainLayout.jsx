import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  HandHelping, 
  ShoppingBag, 
  CalendarCheck, 
  GraduationCap, 
  BarChart3, 
  Users, 
  Settings, 
  LogOut,
  Search,
  Bell,
  ChevronDown
} from 'lucide-react';
import { useState, useEffect } from 'react';

const SidebarLink = ({ to, icon: Icon, label, active }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-md transition-all duration-200 group ${
      active 
        ? 'bg-[#173e82] text-white shadow-sm' 
        : 'text-white/70 hover:text-white hover:bg-white/10'
    }`}
  >
    <Icon size={18} strokeWidth={active ? 2.5 : 2} className={active ? 'text-white' : 'text-white/60 group-hover:text-white transition-colors'} />
    <span className={`text-sm font-medium ${active ? 'font-semibold' : ''}`}>{label}</span>
  </Link>
);

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("Student");
  const [user, setUser] = useState({});

  useEffect(() => {
     // Retrieve user info from local storage
     const role = localStorage.getItem("userRole");
     const userData = localStorage.getItem("user");
     if(role) setUserRole(role);
     if(userData) setUser(JSON.parse(userData));
  }, []);

  const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      navigate("/login");
  };

  // Define menu items visibility based on roles
  const allMenuItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['All'] },
    { to: '/equipment', icon: Package, label: 'Equipment', roles: ['Admin', 'HOD', 'StockManager', 'Appointed Staff', 'Lab Staff'] },
    { to: '/borrow', icon: HandHelping, label: 'Borrow Equipment', roles: ['Student', 'Lecturer', 'Admin', 'Staff'] },
    { to: '/my-items', icon: ShoppingBag, label: 'My Items', roles: ['All'] },
    { to: '/reservations', icon: CalendarCheck, label: 'Reservations', roles: ['Admin', 'HOD', 'StockManager', 'Lab Staff'] },
    { to: '/learning', icon: GraduationCap, label: 'Learning Center', roles: ['All'] },
    { to: '/reports', icon: BarChart3, label: 'Reports', roles: ['Admin', 'HOD'] },
    { to: '/users', icon: Users, label: 'Users', roles: ['Admin', 'HOD'] },
    { to: '/settings', icon: Settings, label: 'Settings', roles: ['All'] },
  ];

  const filteredMenu = allMenuItems.filter(item => 
      item.roles.includes('All') || item.roles.includes(userRole)
  );

  return (
    <div className="flex h-screen bg-[#f4f6f9] font-sans text-[#2c3e50]">
      {/* Sidebar */}
      <aside className="w-[240px] bg-[#1f4fa3] text-white flex flex-col shrink-0 z-30 shadow-md border-r border-[#173e82]">
        <div className="h-[60px] flex items-center px-6 border-b border-[#173e82]/30 bg-[#173e82]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center border border-white/20 shadow-sm">
               <Package size={18} className="text-white" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-white uppercase leading-none">Smart <span className="text-[#60a5fa]">Uni</span></h1>
          </div>
        </div>

        <nav className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto">
          {filteredMenu.map((item) => (
            <SidebarLink 
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              active={location.pathname === item.to}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-[#173e82]/30 bg-[#173e82]/50">
          <button 
            onClick={handleLogout}
            className="w-full h-10 flex items-center gap-3 px-4 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative bg-[#f4f6f9]">
        {/* Header */}
        <header className="h-[60px] bg-[#1f4fa3] text-white flex items-center justify-between px-6 shrink-0 z-20 shadow-md border-b border-[#173e82]">
          <div className="flex-1 max-w-[400px]">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-white transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="w-full pl-10 pr-4 py-1.5 bg-[#173e82]/50 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 text-sm text-white placeholder:text-white/40 font-normal transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <button className="relative w-9 h-9 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-all">
                 <Bell size={20} />
                 <span className="absolute top-2 right-2 w-2 h-2 bg-[#ef4444] rounded-full border border-[#1f4fa3]"></span>
               </button>
            </div>
            
            <div className="flex items-center gap-3 group cursor-pointer h-[60px] pl-4 border-l border-white/10 hover:bg-white/5 transition-colors px-4 -mr-6">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 bg-white/10">
                <img 
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.fullName || 'User'}&background=1f4fa3&color=fff`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-1">
                 <span className="text-sm font-medium text-white">{user.fullName || 'User'}</span>
                 <ChevronDown size={14} className="text-white/50" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#f4f6f9] custom-scrollbar">
          <div className="max-w-[1400px] mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
