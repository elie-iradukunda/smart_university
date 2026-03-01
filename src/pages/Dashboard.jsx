import { 
  Package, CheckCircle, ArrowDownCircle, Users, PlayCircle, Clock, Activity, Loader2, X
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useState, useEffect } from 'react';
import API_BASE_URL from '../config/api';

const StatCard = ({ label, value, icon: Icon, color, trend }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group cursor-default overflow-hidden relative">
     <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-blue-50/50 transition-colors duration-500"></div>
     <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-sm ${
           color === 'primary' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 
           color === 'info' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 
           color === 'warning' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
           color === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
           color === 'danger' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-50 text-slate-600 border border-slate-100'
        }`}>
           <Icon size={28} strokeWidth={2.5} />
        </div>
        {trend && (
           <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              {trend > 0 ? '+' : ''}{trend}%
           </div>
        )}
     </div>
     <div className="relative z-10">
        <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-1">{value}</h3>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-600 transition-colors">{label}</p>
     </div>
  </div>
);

const ActivityItem = ({ user, action, item, time, status }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'Approved': return { color: 'emerald', icon: <CheckCircle size={14} /> };
      case 'Borrowed': return { color: 'blue', icon: <Package size={14} /> };
      case 'Returned': return { color: 'indigo', icon: <ArrowDownCircle size={14} /> };
      case 'Cancelled': return { color: 'red', icon: <X size={14} /> };
      case 'Pending': return { color: 'amber', icon: <Clock size={14} /> };
      default: return { color: 'slate', icon: <Activity size={14} /> };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className="group flex items-start gap-5 p-5 mb-2 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-slate-50/50 hover:shadow-sm transition-all duration-300">
      <div className={`shrink-0 w-12 h-12 rounded-xl bg-${config.color}-100 flex items-center justify-center text-${config.color}-600 font-black text-lg shadow-inner ring-4 ring-white`}>
        {user?.charAt(0) || '?'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
           <p className="text-sm font-bold text-slate-800 tracking-tight truncate">
             {user} <span className="text-slate-400 font-medium lowercase mx-1">is</span> {status}
           </p>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
              {new Date(time).toLocaleDateString([], { month: 'short', day: 'numeric' })}
           </span>
        </div>
        <div className="flex items-center flex-wrap gap-2">
           <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-${config.color}-50 border border-${config.color}-100 text-[10px] font-black uppercase tracking-widest text-${config.color}-600`}>
              {config.icon} {status}
           </div>
           <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <Package size={12} className="text-slate-400" /> {item}
           </div>
           <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400 ml-auto">
              <Clock size={12} className="opacity-50" /> {new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
           </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("Student");

  useEffect(() => {
    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('userRole');
            setUserRole(role);
            
            const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error("Dashboard stats fetch failed", error);
        } finally {
            setLoading(false);
        }
    };
    fetchStats();
  }, []);

  if (loading) return (
     <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
     </div>
  );

  const isAdminOrHod = ['Admin', 'HOD', 'StockManager'].includes(userRole);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
         <div>
            <h1 className="text-2xl font-bold text-slate-800">
                {isAdminOrHod ? "System Overview" : "My Dashboard"}
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">
                {isAdminOrHod ? "Real-time institutional asset monitoring." : "Track your active loans and requests."}
            </p>
         </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isAdminOrHod ? (
           <>
              <StatCard label="Total Inventory" value={stats?.totalEquipment || 0} icon={Package} color="info" trend={1.2} />
              <StatCard label="Available Items" value={stats?.availableNow || 0} icon={CheckCircle} color="success" trend={2.4} />
              <StatCard label="Active Loans" value={stats?.activeLoans || 0} icon={Activity} color="warning" trend={-0.8} />
              <StatCard label="Registered Users" value={stats?.totalUsers || 0} icon={Users} color="primary" trend={5.1} />
           </>
        ) : (
           <>
              <StatCard label="Active Loans" value={stats?.myBorrowedItems || 0} icon={Package} color="primary" trend={0} />
              <StatCard label="Pending Requests" value={stats?.pendingRequests || 0} icon={Clock} color="warning" trend={15} />
              <StatCard label="Overdue Items" value={stats?.overdueItems || 0} icon={ArrowDownCircle} color="danger" trend={-10} />
              <StatCard label="Training Access" value="Full" icon={PlayCircle} color="success" />
           </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-8 bg-white rounded-[2rem] shadow-sm border border-slate-100 flex flex-col min-h-[400px]">
           <div className="px-8 py-7 border-b border-slate-100 flex items-center justify-between bg-slate-50/30 rounded-t-[2rem]">
              <div>
                 <h3 className="text-lg font-black text-slate-800 tracking-tight">
                    {isAdminOrHod ? "Recent Activity Log" : "My Recent Activity"}
                 </h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Live system interactions</p>
              </div>
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-[10px] font-black hover:bg-slate-50 transition-all uppercase tracking-widest rounded-xl shadow-sm">View All History</button>
           </div>
           
           <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
              {isAdminOrHod ? (
                 stats?.recentActivity?.length > 0 ? (
                    <div className="space-y-1">
                       {stats.recentActivity.map((act) => (
                          <ActivityItem 
                             key={act.id}
                             user={act.User?.fullName}
                             item={act.Equipment?.name}
                             status={act.status}
                             time={act.updatedAt}
                          />
                       ))}
                    </div>
                 ) : (
                    <div className="py-20 flex flex-col items-center justify-center opacity-40">
                       <Activity size={40} className="mb-4 text-slate-400" />
                       <p className="text-xs font-black uppercase tracking-widest italic-none">Silence in the system</p>
                    </div>
                 )
              ) : (
                 <div className="overflow-x-auto rounded-xl border border-slate-100">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                       <thead className="bg-slate-50">
                          <tr className="text-xs text-slate-500 uppercase font-bold tracking-wider border-b border-slate-100">
                             <th className="px-5 py-4">Equipment</th>
                             <th className="px-5 py-4">Status</th>
                             <th className="px-5 py-4">Due Date</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                          {stats?.activeLoans?.length > 0 ? (
                             stats.activeLoans.map(loan => (
                                <tr key={loan.id} className="hover:bg-slate-50/50 transition-colors">
                                   <td className="px-5 py-4 font-bold text-slate-800">{loan.Equipment?.name}</td>
                                   <td className="px-5 py-4">
                                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                         loan.status === 'Borrowed' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                                      }`}>
                                         {loan.status}
                                      </span>
                                   </td>
                                   <td className="px-5 py-4 text-xs font-medium text-slate-500">{new Date(loan.endDate).toLocaleDateString()}</td>
                                </tr>
                             ))
                          ) : (
                             <tr><td colSpan="3" className="py-12 text-center text-slate-400 italic font-medium">No active requests.</td></tr>
                          )}
                       </tbody>
                    </table>
                 </div>
              )}
           </div>
        </div>

        {/* Status Analytics Card */}
        <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col h-[400px]">
           <h3 className="text-base font-bold text-slate-800 mb-6">Inventory Status</h3>
           {isAdminOrHod ? (
              <div className="flex-1 flex flex-col items-center">
                 <div className="w-full h-48 relative">
                    <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                          <Pie
                             data={stats?.stockStatus || []}
                             cx="50%" cy="50%"
                             innerRadius={60} outerRadius={80}
                             paddingAngle={5} dataKey="value"
                             startAngle={90} endAngle={-270}
                          >
                             {stats?.stockStatus?.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                             ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          />
                       </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                       <span className="text-3xl font-black text-slate-800">
                          {Math.round((stats?.availableNow / (stats?.availableNow + stats?.activeLoans)) * 100) || 0}%
                       </span>
                       <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Available</span>
                    </div>
                 </div>
                 <div className="w-full mt-6 space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 font-medium text-slate-600"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></div> Available</div>
                        <span className="font-bold text-slate-800">{stats?.availableNow}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 font-medium text-slate-600"><div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></div> Borrowed</div>
                        <span className="font-bold text-slate-800">{stats?.activeLoans}</span>
                    </div>
                 </div>
              </div>
           ) : (
              <div className="flex-1 flex flex-col gap-4">
                 <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
                    <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                       <PlayCircle size={16} className="text-blue-500" /> Learning Tip
                    </h4>
                    <p className="text-sm text-blue-800/80 leading-relaxed font-medium">Check out the new solar PV tutorial in the resources section! Expand your laboratory toolsets today.</p>
                 </div>
                 <div className="bg-gradient-to-br from-[#0a0f1d] to-[#161a33] p-6 rounded-2xl text-white mt-auto relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                    <p className="text-xs uppercase tracking-wider text-slate-400 mb-2 font-bold relative z-10">Quick Tip</p>
                    <p className="text-base font-semibold mb-6 italic leading-snug relative z-10">"Treat every lab tool as if it's your own. Safety first!"</p>
                    <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white transition-colors text-xs font-bold rounded-xl uppercase tracking-widest shadow-lg shadow-blue-500/30 relative z-10">
                       Safety Manual
                    </button>
                 </div>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
