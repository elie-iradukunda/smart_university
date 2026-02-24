import { 
  Package, CheckCircle, ArrowDownCircle, Users, PlayCircle, Clock, Activity, Loader2
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useState, useEffect } from 'react';
import API_BASE_URL from '../config/api';

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:-translate-y-1 transition-transform group">
     <div className="flex justify-between items-start mb-4">
        <div>
           <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
           color === 'primary' ? 'bg-blue-50 text-blue-600' : 
           color === 'info' ? 'bg-indigo-50 text-indigo-600' : 
           color === 'warning' ? 'bg-amber-50 text-amber-600' : 
           color === 'success' ? 'bg-emerald-50 text-emerald-600' :
           color === 'danger' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600'
        }`}>
           <Icon size={24} />
        </div>
     </div>
     <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">{label}</p>
     <div className="flex items-center gap-1.5 text-[10px] text-emerald-500 font-bold uppercase tracking-wider mt-auto">
        <Activity size={12} /> System Active
     </div>
  </div>
);

const ActivityItem = ({ user, action, item, time, status }) => (
  <div className="flex items-start gap-4 py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors px-4 rounded-xl">
    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0 uppercase shadow-sm">
      {user?.charAt(0) || '?'}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-slate-700 truncate">
        <span className="font-bold text-slate-900">{user}</span>'s request for <span className="font-bold text-blue-600">{item}</span> is <span className="font-bold text-slate-800">{status}</span>
      </p>
      <div className="flex items-center gap-1.5 mt-1 text-[11px] font-medium text-slate-400">
         <Clock size={12} />
         <span>{new Date(time).toLocaleString()}</span>
      </div>
    </div>
  </div>
);

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
              <StatCard label="Total Inventory" value={stats?.totalEquipment || 0} icon={Package} color="info" />
              <StatCard label="Available Items" value={stats?.availableNow || 0} icon={CheckCircle} color="success" />
              <StatCard label="Active Loans" value={stats?.activeLoans || 0} icon={Activity} color="warning" />
              <StatCard label="Registered Users" value={stats?.totalUsers || 0} icon={Users} color="primary" />
           </>
        ) : (
           <>
              <StatCard label="Active Loans" value={stats?.myBorrowedItems || 0} icon={Package} color="primary" />
              <StatCard label="Pending Requests" value={stats?.pendingRequests || 0} icon={Clock} color="warning" />
              <StatCard label="Overdue Items" value={stats?.overdueItems || 0} icon={ArrowDownCircle} color="danger" />
              <StatCard label="Training Access" value="Full" icon={PlayCircle} color="success" />
           </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col min-h-[400px]">
           <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">
                 {isAdminOrHod ? "Recent Activity Log" : "My Recent Activity"}
              </h3>
              <button className="text-blue-600 text-xs font-bold hover:underline transition-colors uppercase tracking-wider">View All History</button>
           </div>
           
           <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
              {isAdminOrHod ? (
                 stats?.recentActivity?.length > 0 ? (
                    stats.recentActivity.map((act) => (
                       <ActivityItem 
                          key={act.id}
                          user={act.User?.name}
                          item={act.Equipment?.name}
                          status={act.status}
                          time={act.updatedAt}
                       />
                    ))
                 ) : (
                    <p className="text-center text-slate-400 py-12 text-sm italic font-medium">No recent activity found.</p>
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
