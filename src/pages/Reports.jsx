import { BarChart3, TrendingUp, TrendingDown, Download, Filter, Calendar, Loader2, PieChart as PieChartIcon, Printer } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { useState, useEffect } from 'react';
import API_BASE_URL from '../config/api';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/dashboard/reports`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to load reports');
      const data = await response.json();
      setReportData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
       <Loader2 className="animate-spin text-[#1f4fa3]" size={32} />
    </div>
  );

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 print:p-0">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-semibold text-[#2c3e50]">Analytics & Reports</h1>
          <p className="text-sm text-[#6b7280] mt-1">System usage and performance metrics.</p>
        </div>
        <div className="flex gap-2">
           <button className="bg-white border border-gray-200 text-[#6b7280] px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-all text-nowrap">
              <Calendar size={16} /> Last 7 Days
           </button>
           <button 
             onClick={handlePrint}
             className="bg-[#1f4fa3] text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-[#173e82] flex items-center gap-2 shadow-sm transition-all"
           >
              <Printer size={16} /> Generate PDF
           </button>
        </div>
      </div>

      <div className="hidden print:block text-center border-b pb-6 mb-8">
          <h1 className="text-3xl font-bold text-[#1f4fa3]">SMART UNIVERSITY REPORT</h1>
          <p className="text-gray-500 mt-2">Inventory and Resource Access Audit - {new Date().toLocaleDateString()}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <KPICard title="Total Users" value={reportData?.stats.totalUsers} change="+2.4%" positive />
         <KPICard title="Active Loans" value={reportData?.stats.activeLoans} change="+4.1%" positive />
         <KPICard title="Total Assets" value={reportData?.stats.totalEquipment} change="+0.8%" positive />
         <KPICard title="Pending Requests" value={reportData?.stats.pendingRequests} change="-5.2%" positive={false} negative={reportData?.stats.pendingRequests > 10} />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         
         {/* Usage Trends */}
         <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm flex flex-col h-[350px]">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-base font-semibold text-[#2c3e50]">Weekly Activity</h3>
               <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">Reservations</span>
            </div>
            <div className="flex-1 w-full min-h-0">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={reportData?.weeklyActivity}>
                     <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                     <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                     <Tooltip 
                        contentStyle={{borderRadius: '6px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                        itemStyle={{fontSize: '11px', fontWeight: 600}}
                     />
                     <Area type="monotone" dataKey="value" name="Current Week" stroke="#3b82f6" strokeWidth={2} fill="url(#colorValue)" />
                     <Area type="monotone" dataKey="prev" name="Previous Week" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="5 5" fill="none" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Dept distribution */}
         <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm flex flex-col h-[350px]">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-semibold text-[#2c3e50]">Inventory by Department</h3>
                <BarChart3 size={18} className="text-gray-300" />
             </div>
             <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={reportData?.deptDistribution} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{fill: 'transparent'}} />
                      <Bar dataKey="value" name="Assets" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                   </BarChart>
                </ResponsiveContainer>
             </div>
         </div>

         {/* Demographic */}
         <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm flex flex-col h-[350px]">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-base font-semibold text-[#2c3e50]">User Demographics</h3>
                <PieChartIcon size={18} className="text-gray-300" />
             </div>
             <div className="flex-1 flex items-center justify-center">
                <div className="w-1/2 h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={reportData?.roleDistribution}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {reportData?.roleDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="w-1/2 space-y-2">
                    {reportData?.roleDistribution.map((entry, index) => (
                        <div key={entry.name} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{backgroundColor: colors[index % colors.length]}}></div>
                                <span className="text-[#64748b]">{entry.name}</span>
                            </div>
                            <span className="font-bold text-[#2c3e50]">{entry.value}</span>
                        </div>
                    ))}
                </div>
             </div>
         </div>

         {/* System Health */}
         <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm flex flex-col h-[350px]">
            <h3 className="text-base font-semibold text-[#2c3e50] mb-6">Institutional Performance</h3>
            <div className="space-y-6 flex-1">
                <StatBar label="Equipment Return Rate" value={parseInt(reportData?.stats.returnRate)} suffix="%" color="bg-[#22c55e]" />
                <StatBar label="Asset Utilization" value={68} suffix="%" color="bg-[#3b82f6]" />
                <StatBar label="Staff Response Time" value={85} suffix="%" color="bg-[#8b5cf6]" />
                <StatBar label="System Availability" value={99} suffix="%" color="bg-[#10b981]" />
            </div>
         </div>
      </div>
    </div>
  );
};

const StatBar = ({ label, value, suffix = "", color }) => (
    <div className="space-y-2">
        <div className="flex justify-between text-xs font-medium">
            <span className="text-gray-500 uppercase tracking-tighter">{label}</span>
            <span className="text-[#2c3e50]">{value}{suffix}</span>
        </div>
        <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
            <div className={`h-full ${color} transition-all duration-1000`} style={{width: `${value}%`}}></div>
        </div>
    </div>
);

const KPICard = ({ title, value, change, positive, negative }) => (
  <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow">
     <div>
        <p className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider mb-1 opacity-60">{title}</p>
        <h3 className="text-2xl font-black text-[#2c3e50] tracking-tight">{value || 0}</h3>
     </div>
     <div className={`flex items-center gap-1 text-[11px] font-bold mt-4 ${
        positive ? 'text-[#22c55e]' : negative ? 'text-[#ef4444]' : 'text-[#9ca3af]'
     }`}>
        {positive ? <TrendingUp size={12} /> : negative ? <TrendingDown size={12} /> : null}
        {change} <span className="text-[#9ca3af] font-medium ml-1">vs last period</span>
     </div>
  </div>
);

export default Reports;
