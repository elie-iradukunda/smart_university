import { BarChart3, TrendingUp, TrendingDown, Download, Filter, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';

const Reports = () => {
  const data = [
    { name: 'Mon', value: 45, prev: 30 },
    { name: 'Tue', value: 52, prev: 40 },
    { name: 'Wed', value: 38, prev: 35 },
    { name: 'Thu', value: 65, prev: 50 },
    { name: 'Fri', value: 48, prev: 45 },
    { name: 'Sat', value: 24, prev: 20 },
    { name: 'Sun', value: 12, prev: 15 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#2c3e50]">Analytics & Reports</h1>
          <p className="text-sm text-[#6b7280] mt-1">System usage and performance metrics.</p>
        </div>
        <div className="flex gap-2">
           <button className="bg-white border border-gray-200 text-[#6b7280] px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-all">
              <Calendar size={16} /> Last 7 Days
           </button>
           <button className="bg-[#1f4fa3] text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-[#173e82] flex items-center gap-2 shadow-sm transition-all">
              <Download size={16} /> Export CSV
           </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <KPICard title="Total Sessions" value="1,294" change="+12.5%" positive />
         <KPICard title="Active Loans" value="382" change="+4.1%" positive />
         <KPICard title="Return Rate" value="95.8%" change="-1.2%" negative />
         <KPICard title="Avg. Usage Time" value="4h 12m" change="+0.5%" positive />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         
         {/* Usage Trends */}
         <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm flex flex-col h-[350px]">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-base font-semibold text-[#2c3e50]">Weekly Activity</h3>
               <button className="text-xs text-[#1f4fa3] font-medium hover:underline">View Details</button>
            </div>
            <div className="flex-1 w-full min-h-0">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                     <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                     <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                     <Tooltip 
                        contentStyle={{borderRadius: '6px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                        itemStyle={{fontSize: '12px', fontWeight: 600, color: '#1e293b'}}
                     />
                     <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fill="url(#colorValue)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Comparison Chart */}
         <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm flex flex-col h-[350px]">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-base font-semibold text-[#2c3e50]">vs. Last Week</h3>
               <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-[#6b7280]">
                     <span className="w-2 h-2 rounded-full bg-[#1f4fa3]"></span> Current
                  </span>
                  <span className="flex items-center gap-1.5 text-[#6b7280]">
                     <span className="w-2 h-2 rounded-full bg-gray-300"></span> Previous
                  </span>
               </div>
            </div>
            <div className="flex-1 w-full min-h-0">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                     <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                     <Tooltip 
                        contentStyle={{borderRadius: '6px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                        cursor={{fill: '#f8fafc'}}
                     />
                     <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                     <Bar dataKey="prev" fill="#e2e8f0" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>
    </div>
  );
};

const KPICard = ({ title, value, change, positive, negative }) => (
  <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-shadow">
     <div>
        <p className="text-xs font-medium text-[#6b7280] uppercase tracking-wide mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-[#2c3e50]">{value}</h3>
     </div>
     <div className={`flex items-center gap-1 text-xs font-semibold mt-4 ${
        positive ? 'text-[#22c55e]' : negative ? 'text-[#ef4444]' : 'text-[#9ca3af]'
     }`}>
        {positive ? <TrendingUp size={14} /> : negative ? <TrendingDown size={14} /> : null}
        {change} <span className="text-[#9ca3af] font-normal ml-1">vs last period</span>
     </div>
  </div>
);

export default Reports;
