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
  ChevronDown,
  Rocket,
  Menu,
  ClipboardList,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { useState, useEffect } from 'react';

const SidebarLink = ({ to, icon: Icon, label, active, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick}
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
     const role = localStorage.getItem("userRole");
     const userData = localStorage.getItem("user");
     if(role) setUserRole(role);
     if(userData) setUser(JSON.parse(userData));
  }, []);

  useEffect(() => {
    setIsSidebarOpen(false); // Close sidebar on route change
  }, [location.pathname]);

  const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      navigate("/login");
  };

  const allMenuItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['All'] },
    { to: '/equipment', icon: Package, label: 'Equipment', roles: ['Admin', 'HOD', 'StockManager', 'Appointed Staff', 'Lab Staff'] },
    { to: '/requests', icon: ClipboardList, label: 'Equipment Requests', roles: ['Admin', 'HOD', 'StockManager'] },
    { to: '/borrow', icon: HandHelping, label: 'Borrow Equipment', roles: ['Student', 'Lecturer', 'Admin', 'Staff'] },
    { to: '/my-items', icon: ShoppingBag, label: 'My Items', roles: ['All'] },
    { to: '/reservations', icon: CalendarCheck, label: 'Reservations', roles: ['Admin', 'HOD', 'StockManager', 'Lab Staff'] },
    { to: '/learning', icon: GraduationCap, label: 'Learning Center', roles: ['All'] },
    { to: '/incubation', icon: Rocket, label: 'Incubation Center', roles: ['All'] },
    { to: '/reports', icon: BarChart3, label: 'Reports', roles: ['Admin', 'HOD'] },
    { to: '/users', icon: Users, label: 'Users', roles: ['Admin', 'HOD'] },
    { to: '/home-manager', icon: ImageIcon, label: 'Home Images', roles: ['Admin'] },
    { to: '/settings', icon: Settings, label: 'Settings', roles: ['All'] },
  ];

  const filteredMenu = allMenuItems.filter(item => {
      if (userRole === 'Incubation Manager') {
          return ['/incubation', '/settings'].includes(item.to);
      }
      return item.roles.includes('All') || item.roles.includes(userRole);
  });

  return (
    <div className="flex h-screen bg-[#f4f6f9] font-sans text-[#2c3e50] overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 w-[240px] bg-[#1f4fa3] text-white flex flex-col shrink-0 z-50 
        shadow-2xl lg:shadow-md border-r border-[#173e82] transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-[60px] flex items-center px-6 border-b border-[#173e82]/30 bg-[#173e82]">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center border border-white/20 shadow-sm group-hover:bg-white/20 transition-all">
               <Package size={18} className="text-white" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-white uppercase leading-none">Smart <span className="text-[#60a5fa]">Uni</span></h1>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 hover:bg-white/10 rounded">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
          {filteredMenu.map((item) => (
            <SidebarLink 
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              active={location.pathname === item.to}
              onClick={() => setIsSidebarOpen(false)}
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
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-[#f4f6f9]">
        {/* Header */}
        <header className="h-[60px] bg-[#1f4fa3] text-white flex items-center justify-between px-4 lg:px-6 shrink-0 z-20 shadow-md border-b border-[#173e82]">
          <div className="flex items-center gap-3 flex-1 lg:max-w-[400px]">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="relative group flex-1 hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-white transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-10 pr-4 py-1.5 bg-[#173e82]/50 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 text-sm text-white placeholder:text-white/40 font-normal transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-6">
            <button className="relative w-9 h-9 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#ef4444] rounded-full border border-[#1f4fa3]"></span>
            </button>
            
            <div className="flex items-center gap-2 lg:gap-3 group cursor-pointer h-[60px] pl-2 lg:pl-4 border-l border-white/10 hover:bg-white/5 transition-colors">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 bg-white/10 flex-shrink-0">
                <img 
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.fullName || 'User'}&background=1f4fa3&color=fff`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden min-[400px]:flex items-center gap-1">
                 <span className="text-sm font-medium text-white line-clamp-1">{user.fullName?.split(' ')[0] || 'User'}</span>
                 <ChevronDown size={14} className="text-white/50" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-[#f4f6f9] custom-scrollbar">
          <div className="max-w-[1400px] mx-auto space-y-4 lg:space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;


