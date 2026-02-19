import { 
  Package, CheckCircle, ArrowDownCircle, Users, PlayCircle, Clock, Activity, Loader2
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useState, useEffect } from 'react';
import API_BASE_URL from '../config/api';

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-3xl font-bold text-[#2c3e50] mb-1">{value}</h3>
        <p className="text-sm font-medium text-[#6b7280]">{label}</p>
      </div>
      <div className={`p-2 rounded-md bg-opacity-10 text-opacity-100 ${
        color === 'info' ? 'bg-blue-100 text-[#3b82f6]' : 
        color === 'success' ? 'bg-green-100 text-[#22c55e]' : 
        color === 'warning' ? 'bg-amber-100 text-[#f59e0b]' : 
        color === 'primary' ? 'bg-blue-100 text-[#1f4fa3]' : 'bg-gray-100'
      }`}>
        <Icon size={20} />
      </div>
    </div>
    <div className="flex items-center gap-2 text-xs text-[#9ca3af] mt-auto">
       <span className="font-medium text-[#22c55e] flex items-center gap-1">
          <Activity size={12} /> Active
       </span>
       <span>monitoring</span>
    </div>
  </div>
);

const ActivityItem = ({ user, action, item, time, status }) => (
  <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors px-2 rounded-md">
    <div className="w-8 h-8 rounded-full bg-[#1f4fa3]/10 flex items-center justify-center text-[#1f4fa3] font-bold text-xs shrink-0 uppercase">
      {user?.charAt(0) || '?'}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[13px] text-[#2c3e50] truncate">
        <span className="font-semibold">{user}</span>'s request for <span className="font-medium text-[#1f4fa3]">{item}</span> is <span className="font-bold">{status}</span>
      </p>
      <div className="flex items-center gap-1 mt-0.5 text-[10px] text-[#9ca3af]">
         <Clock size={10} />
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
        <Loader2 className="animate-spin text-[#1f4fa3]" size={32} />
     </div>
  );

  const isAdminOrHod = ['Admin', 'HOD', 'StockManager'].includes(userRole);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-2xl font-semibold text-[#2c3e50]">
                {isAdminOrHod ? "System Overview" : "My Dashboard"}
            </h1>
            <p className="text-sm text-[#6b7280] mt-1">
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
        <div className="lg:col-span-8 bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col min-h-[400px]">
           <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#2c3e50] uppercase tracking-wider">
                 {isAdminOrHod ? "Recent Activity Log" : "My Recent Activity"}
              </h3>
              <button className="text-[#1f4fa3] text-xs font-bold hover:underline">View All History</button>
           </div>
           
           <div className="p-5 flex-1 overflow-y-auto custom-scrollbar">
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
                    <p className="text-center text-gray-400 py-12 text-sm italic">No recent activity found.</p>
                 )
              ) : (
                 <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                       <thead>
                          <tr className="bg-gray-50 text-[10px] text-gray-400 uppercase font-bold tracking-widest border-b border-gray-100">
                             <th className="px-4 py-3">Equipment</th>
                             <th className="px-4 py-3">Status</th>
                             <th className="px-4 py-3">Due Date</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-50">
                          {stats?.activeLoans?.length > 0 ? (
                             stats.activeLoans.map(loan => (
                                <tr key={loan.id} className="hover:bg-gray-50/50">
                                   <td className="px-4 py-3 font-medium text-[#2c3e50]">{loan.Equipment?.name}</td>
                                   <td className="px-4 py-3">
                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                         loan.status === 'Borrowed' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                                      }`}>
                                         {loan.status}
                                      </span>
                                   </td>
                                   <td className="px-4 py-3 text-xs text-gray-500">{new Date(loan.endDate).toLocaleDateString()}</td>
                                </tr>
                             ))
                          ) : (
                             <tr><td colSpan="3" className="py-12 text-center text-gray-400 italic">No active requests.</td></tr>
                          )}
                       </tbody>
                    </table>
                 </div>
              )}
           </div>
        </div>

        {/* Status Analytics Card */}
        <div className="lg:col-span-4 bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col h-[400px]">
           <h3 className="text-sm font-bold text-[#2c3e50] uppercase tracking-wider mb-6">Inventory Status</h3>
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
                          <Tooltip />
                       </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                       <span className="text-2xl font-bold text-[#2c3e50]">
                          {Math.round((stats?.availableNow / (stats?.availableNow + stats?.activeLoans)) * 100) || 0}%
                       </span>
                       <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Available</span>
                    </div>
                 </div>
                 <div className="w-full mt-6 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]"></div> Available</div>
                        <span className="font-bold">{stats?.availableNow}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></div> Borrowed</div>
                        <span className="font-bold">{stats?.activeLoans}</span>
                    </div>
                 </div>
              </div>
           ) : (
              <div className="flex-1 flex flex-col gap-4">
                 <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 border-dashed">
                    <h4 className="text-xs font-bold text-[#1f4fa3] mb-1">Learning Tip</h4>
                    <p className="text-[11px] text-blue-800/70">Check out the new solar PV tutorial in the resources section!</p>
                 </div>
                 <div className="bg-gradient-to-br from-[#1f4fa3] to-[#173e82] p-5 rounded-xl text-white mt-auto">
                    <p className="text-xs opacity-80 mb-1 font-medium">Quick Tip</p>
                    <p className="text-sm font-bold mb-4 italic">"Treat every lab tool as if it's your own. Safety first!"</p>
                    <button className="w-full py-2 bg-white text-[#1f4fa3] text-[10px] font-bold rounded uppercase tracking-widest shadow-lg shadow-black/20">
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
