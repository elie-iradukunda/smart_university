import { BarChart3, TrendingUp, TrendingDown, Download, Filter, Calendar, Loader2, PieChart as PieChartIcon, Printer, Users, Activity } from 'lucide-react';
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

  const [exportLoading, setExportLoading] = useState(false);

  const handleExportExcel = async () => {
    try {
      setExportLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/dashboard/export-excel`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to generate Excel report');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SmartUni_Audit_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert("Export failed: " + err.message);
    } finally {
      setExportLoading(false);
    }
  };

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
        <div className="flex gap-3">
           <div className="bg-white border border-slate-100 text-slate-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-sm">
              <Calendar size={14} className="text-blue-500" /> Current Quarter
           </div>
           <button 
             onClick={handlePrint}
             className="bg-slate-800 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 flex items-center gap-2 shadow-lg transition-all"
           >
              <Printer size={14} /> PDF Summary
           </button>
           <button 
             onClick={handleExportExcel}
             disabled={exportLoading}
             className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all border border-emerald-500/30"
           >
              {exportLoading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} 
              Institutional Excel Audit
           </button>
        </div>
      </div>

      <div className="hidden print:block text-center border-b pb-6 mb-8">
          <h1 className="text-3xl font-bold text-[#1f4fa3]">SMART UNIVERSITY REPORT</h1>
          <p className="text-gray-500 mt-2">Inventory and Resource Access Audit - {new Date().toLocaleDateString()}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
         <KPICard title="Total Users" value={reportData?.stats.totalUsers} change="+2.4%" positive />
         <KPICard title="Active Loans" value={reportData?.stats.activeLoans} change="+4.1%" positive />
         <KPICard title="Total Assets" value={reportData?.stats.totalEquipment} change="+0.8%" positive />
         <KPICard title="Pending Requests" value={reportData?.stats.pendingRequests} change="-5.2%" positive={false} negative={reportData?.stats.pendingRequests > 10} />
         <KPICard title="Total Interactions" value={reportData?.stats.totalReservations} change="+12.5%" positive />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         
         {/* Usage Trends */}
         <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col h-[400px] hover:shadow-xl transition-all group">
            <div className="flex justify-between items-center mb-8">
               <div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight">Weekly Activity</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Reservation volume over time</p>
               </div>
               <BarChart3 size={20} className="text-blue-500 bg-blue-50 p-1.5 rounded-lg" />
            </div>
            <div className="flex-1 w-full min-h-0">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={reportData?.weeklyActivity}>
                     <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                           <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} />
                     <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} />
                     <Tooltip 
                        contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', background: '#fff' }}
                        itemStyle={{fontSize: '11px', fontWeight: 800, textTransform: 'uppercase'}}
                     />
                     <Area type="monotone" dataKey="value" name="Current" stroke="#3b82f6" strokeWidth={4} fill="url(#colorValue)" />
                     <Area type="monotone" dataKey="prev" name="Previous" stroke="#e2e8f0" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Dept distribution */}
         <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col h-[400px] hover:shadow-xl transition-all overflow-hidden relative">
             <div className="flex justify-between items-center mb-8">
                 <div>
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">Stock by Department</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Resource allocation mapping</p>
                 </div>
                 <PieChartIcon size={20} className="text-emerald-500 bg-emerald-50 p-1.5 rounded-lg" />
             </div>
             <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={reportData?.deptDistribution} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 9, fill: '#64748b', fontWeight: 700}} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none'}} />
                      <Bar dataKey="value" name="Assets" fill="#10b981" radius={[0, 8, 8, 0]} barSize={24} />
                   </BarChart>
                </ResponsiveContainer>
             </div>
         </div>

         {/* Demographic */}
         <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col h-[400px] hover:shadow-xl transition-all">
             <div className="flex justify-between items-center mb-6">
                <div>
                   <h3 className="text-lg font-black text-slate-800 tracking-tight">User Demographics</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Community role breakdown</p>
                </div>
                <Users size={20} className="text-purple-500 bg-purple-50 p-1.5 rounded-lg" />
             </div>
             <div className="flex-1 flex items-center justify-center">
                <div className="w-1/2 h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={reportData?.roleDistribution}
                                innerRadius={60}
                                outerRadius={85}
                                paddingAngle={8}
                                dataKey="value"
                                strokeWidth={0}
                            >
                                {reportData?.roleDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'][index % 5]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{borderRadius: '12px'}} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="w-1/2 space-y-3 pl-4">
                    {reportData?.roleDistribution.map((entry, index) => (
                        <div key={entry.name} className="flex flex-col gap-0.5">
                            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'][index % 5]}}></div>
                                    <span>{entry.name}</span>
                                </div>
                                <span className="text-slate-800">{entry.value}</span>
                            </div>
                            <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                               <div className="h-full bg-slate-200" style={{width: `${(entry.value / reportData.stats.totalUsers) * 100}%`, backgroundColor: ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'][index % 5]}}></div>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
         </div>

         {/* Top Borrowed Leaderboard */}
         <div className="bg-[#0f172a] p-7 rounded-[2rem] shadow-xl flex flex-col h-[400px] text-white">
            <div className="flex justify-between items-center mb-8">
               <div>
                  <h3 className="text-lg font-black tracking-tight">High Demand Leaderboard</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Most borrowed equipment</p>
               </div>
               <TrendingUp size={20} className="text-amber-400 bg-white/10 p-1.5 rounded-lg" />
            </div>
            <div className="flex-1 space-y-4">
               {reportData?.topEquipment?.map((eq, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                     <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-xs text-amber-400 group-hover:bg-amber-400 group-hover:text-[#0f172a] transition-all">
                        {i + 1}
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold truncate tracking-tight">{eq.name}</div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">{eq.category}</div>
                     </div>
                     <div className="text-right">
                        <div className="text-sm font-black text-amber-400">{eq.count}</div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-600">Requests</div>
                     </div>
                  </div>
               ))}
            </div>
            <button className="mt-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all">Export Detailed Index</button>
         </div>

         {/* Detailed Status Breakdown */}
         <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col h-[400px] hover:shadow-xl transition-all">
             <div className="flex justify-between items-center mb-8">
                 <div>
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">Status Lifecycle</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Reservation stage distribution</p>
                 </div>
                 <Activity size={20} className="text-red-500 bg-red-50 p-1.5 rounded-lg" />
             </div>
             <div className="grid grid-cols-2 gap-4 flex-1">
                {reportData?.statusDistribution?.map((status, i) => (
                   <div key={i} className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between hover:bg-white hover:border-blue-100 hover:shadow-md transition-all cursor-default group">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-400 transition-colors">{status.name}</span>
                      <div className="text-2xl font-black text-slate-800 tracking-tighter mt-1">{status.value}</div>
                   </div>
                ))}
             </div>
         </div>

         {/* System Health */}
         <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col h-[400px] hover:shadow-xl transition-all">
            <h3 className="text-lg font-black text-slate-800 tracking-tight mb-8">Performance Indices</h3>
            <div className="space-y-8 flex-1">
                <StatBar label="Equipment Return Rate" value={parseInt(reportData?.stats.returnRate)} suffix="%" color="bg-[#10b981]" />
                <StatBar label="Asset Utilization" value={68} suffix="%" color="bg-[#3b82f6]" />
                <StatBar label="Staff Response Efficiency" value={85} suffix="%" color="bg-[#8b5cf6]" />
                <StatBar label="System Availability" value={99} suffix="%" color="bg-[#0ea5e9]" />
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
        <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
            <div className={`h-full ${color} transition-all duration-1000 shadow-sm`} style={{width: `${value}%`}}></div>
        </div>
    </div>
);

const KPICard = ({ title, value, change, positive, negative }) => (
  <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-full hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group overflow-hidden relative">
     <div className="absolute top-0 right-0 w-20 h-20 bg-slate-50 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-50 transition-colors"></div>
     <div className="relative z-10">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{title}</p>
        <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{value || 0}</h3>
     </div>
     <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest mt-6 relative z-10 ${
        positive ? 'text-emerald-500' : negative ? 'text-red-500' : 'text-slate-400'
     }`}>
        <div className={`p-1 rounded-md ${positive ? 'bg-emerald-50' : negative ? 'bg-red-50' : 'bg-slate-50'}`}>
           {positive ? <TrendingUp size={10} /> : negative ? <TrendingDown size={10} /> : null}
        </div>
        {change} <span className="text-slate-400 font-bold ml-1">growth</span>
     </div>
  </div>
);

export default Reports;
