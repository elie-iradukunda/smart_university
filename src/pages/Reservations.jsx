import { 
  Calendar, CheckCircle, AlertCircle, Trash2, Check, X, Loader2, User, Package, FileText, MapPin, Info, Image as ImageIcon, Phone, PackageSearch, TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import API_BASE_URL from '../config/api';
import EquipmentDetailsModal from "../components/EquipmentDetailsModal";

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [viewingApplication, setViewingApplication] = useState(null);
    const [view, setView] = useState('list'); // list or analytics
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));
    }, []);

    const fetchReservations = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/reservations/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Failed to fetch reservations");
            const data = await response.json();
            setReservations(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const handleAction = async (id, status) => {
        setActionLoading(id);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/reservations/${id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ status })
            });

            if (!response.ok) throw new Error("Action failed");
            
            // Re-fetch to update UI
            fetchReservations();
        } catch (err) {
            alert(err.message);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return (
        <div className="flex h-96 items-center justify-center">
            <Loader2 className="animate-spin text-[#1f4fa3]" size={32} />
        </div>
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case "Approved": return "bg-green-100 text-green-700 border-green-200";
            case "Pending": return "bg-amber-100 text-amber-700 border-amber-200";
            case "Borrowed": return "bg-blue-100 text-blue-700 border-blue-200";
            case "Cancelled": return "bg-red-100 text-red-700 border-red-200";
            case "Returned": return "bg-gray-100 text-gray-700 border-gray-200";
            default: return "bg-gray-50 text-gray-400 border-gray-100";
        }
    };

    const stats = {
        total: reservations.length,
        pending: reservations.filter(r => r.status === 'Pending').length,
        approved: reservations.filter(r => r.status === 'Approved' || r.status === 'Borrowed').length
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Reservation Logistics</h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                        {user?.role === 'Admin' ? 'Global institutional inventory review' : `Monitoring ${user?.department || 'departmental'} assets`}
                    </p>
                </div>
                <div className="flex p-1 bg-slate-100 rounded-xl">
                   <button 
                    onClick={() => setView('list')}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                   >
                      List View
                   </button>
                   <button 
                    onClick={() => setView('analytics')}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'analytics' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                   >
                      Analytics
                   </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Requests" value={stats.total.toString().padStart(2, '0')} icon={<Calendar size={18} />} color="text-[#1f4fa3]" />
                <StatCard title="Reviewing" value={stats.pending.toString().padStart(2, '0')} icon={<AlertCircle size={18} />} color="text-amber-500" />
                <StatCard title="Confirmed" value={stats.approved.toString().padStart(2, '0')} icon={<CheckCircle size={18} />} color="text-green-500" />
            </div>

            {/* List */}
            <AnimatePresence mode="wait">
               {view === 'list' ? (
                <motion.div 
                    key="list"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                >
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Active Pipeline</h3>
                        <div className="flex items-center gap-2">
                           <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg border border-blue-100 uppercase tracking-widest">
                              <PackageSearch size={12} /> {reservations.length} total
                           </div>
                        </div>
                    </div>
                    
                    {reservations.length === 0 ? (
                        <div className="p-20 bg-white border border-slate-100 border-dashed rounded-[2rem] text-center flex flex-col items-center">
                            <ImageIcon size={48} className="text-slate-200 mb-4" />
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">The queue is currently empty</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {reservations.map((item) => (
                                <div key={item.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group">
                                    {/* Equipment Image */}
                                    <div className="md:w-64 h-48 md:h-auto relative bg-slate-50 border-r border-slate-100 shrink-0 overflow-hidden">
                                        {(item.Equipment?.image || item.IncubationAsset?.image) ? (
                                            <img src={item.Equipment?.image || item.IncubationAsset?.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <Package size={48} strokeWidth={1} />
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                           <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest border rounded-lg backdrop-blur-md shadow-lg ${getStatusStyle(item.status)}`}>
                                               {item.status}
                                           </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-7 flex flex-col justify-between">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <span className="text-[9px] font-black text-blue-500 bg-blue-50 px-2.5 py-1 rounded-md uppercase tracking-widest mb-2 inline-block">
                                                        {item.Equipment?.category || item.IncubationAsset?.category}
                                                    </span>
                                                    <h3 className="text-xl font-black text-slate-800 tracking-tight truncate group-hover:text-blue-600 transition-colors uppercase">{item.Equipment?.name || item.IncubationAsset?.name}</h3>
                                                </div>
                                                <div className="text-right shrink-0">
                                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Schedule</p>
                                                   <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                                                      <Calendar size={14} className="text-blue-500" />
                                                      {new Date(item.startDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                   </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                                                <div className="space-y-1">
                                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 opacity-50">Authorized Personnel</p>
                                                   <div className="flex items-center gap-3">
                                                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold uppercase shadow-inner">
                                                         {item.User?.fullName?.charAt(0)}
                                                      </div>
                                                      <div>
                                                         <p className="text-sm font-black text-slate-800 tracking-tight leading-none mb-1">{item.User?.fullName}</p>
                                                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{item.User?.department} • {item.User?.studentId || 'STAFF'}</p>
                                                      </div>
                                                   </div>
                                                </div>
                                                
                                                <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 transition-colors group-hover:border-blue-100 group-hover:bg-blue-50/20">
                                                   <div className="flex items-center justify-between mb-2">
                                                       <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Purpose index</span>
                                                       <span className="text-[10px] font-black text-blue-600">{item.moduleCode || 'GENERAL'}</span>
                                                   </div>
                                                   <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 italic font-medium">"{item.purpose}"</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-100">
                                            <div className="flex gap-6">
                                                <button 
                                                    onClick={() => setSelectedItem(item.Equipment || item.IncubationAsset)}
                                                    className="flex items-center gap-2 text-[10px] font-black text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest"
                                                >
                                                    <Info size={14} /> Spec Sheet
                                                </button>
                                                <button 
                                                    onClick={() => setViewingApplication(item)}
                                                    className="flex items-center gap-2 text-[10px] font-black text-emerald-600 hover:text-emerald-800 transition-colors uppercase tracking-widest"
                                                >
                                                    <FileText size={14} /> Application Proof
                                                </button>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                                {item.status === 'Pending' ? (
                                                   <>
                                                      <button 
                                                          disabled={actionLoading === item.id}
                                                          onClick={() => handleAction(item.id, 'Approved')}
                                                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 px-6 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all"
                                                      >
                                                          {actionLoading === item.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Approve
                                                      </button>
                                                      <button 
                                                          disabled={actionLoading === item.id}
                                                          onClick={() => handleAction(item.id, 'Cancelled')}
                                                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border-2 border-slate-100 text-slate-400 py-2.5 px-6 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all"
                                                      >
                                                          <X size={14} /> Reject
                                                      </button>
                                                   </>
                                                ) : item.status === 'Approved' ? (
                                                   <button 
                                                       onClick={() => handleAction(item.id, 'Borrowed')}
                                                       className="w-full sm:w-auto bg-slate-900 text-white py-3 px-8 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all"
                                                   >
                                                       Issue Hardware
                                                   </button>
                                                ) : item.status === 'Borrowed' ? (
                                                   <button 
                                                       onClick={() => handleAction(item.id, 'Returned')}
                                                       className="w-full sm:w-auto bg-emerald-600 text-white py-3 px-8 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition-all"
                                                   >
                                                       Process Return
                                                   </button>
                                                ) : (
                                                   <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic tracking-[0.2em]">Transaction Finalized</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
               ) : (
                <motion.div 
                    key="analytics"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col h-[400px]">
                       <h3 className="text-lg font-black text-slate-800 tracking-tight uppercase mb-8">Status Distribution</h3>
                       <div className="flex-1 flex items-center justify-center">
                          <AnalyticsPie data={[
                             { name: 'Pending', value: reservations.filter(r => r.status === 'Pending').length, color: '#f59e0b' },
                             { name: 'Active', value: reservations.filter(r => r.status === 'Borrowed').length, color: '#3b82f6' },
                             { name: 'Completed', value: reservations.filter(r => r.status === 'Returned').length, color: '#10b981' },
                             { name: 'Cancelled', value: reservations.filter(r => r.status === 'Cancelled').length, color: '#ef4444' }
                          ]} />
                       </div>
                    </div>
                    
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col h-[400px]">
                       <h3 className="text-lg font-black text-slate-800 tracking-tight uppercase mb-8">Asset Categorization</h3>
                       <div className="flex-1">
                          <AnalyticsBar data={Array.from(new Set(reservations.map(r => r.Equipment?.category || r.IncubationAsset?.category || 'General'))).map(cat => ({
                             name: cat,
                             value: reservations.filter(r => (r.Equipment?.category || r.IncubationAsset?.category || 'General') === cat).length
                          }))} />
                       </div>
                    </div>

                    <div className="lg:col-span-2 bg-[#0f172a] p-8 rounded-[3rem] shadow-2xl overflow-hidden relative min-h-[400px]">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] -mr-64 -mt-64"></div>
                        <h3 className="text-xl font-black text-white tracking-widest uppercase mb-12 relative z-10 flex items-center gap-3">
                           <TrendingUp className="text-blue-400" /> Operational Efficiency Trends
                        </h3>
                        <div className="h-[250px] relative z-10">
                           <AnalyticsTrend data={[
                              { name: 'Mon', value: 2 }, { name: 'Tue', value: 5 }, { name: 'Wed', value: 3 },
                              { name: 'Thu', value: 8 }, { name: 'Fri', value: 6 }, { name: 'Sat', value: 2 }, { name: 'Sun', value: 1 }
                           ]} />
                        </div>
                    </div>
                </motion.div>
               )}
            </AnimatePresence>

            <EquipmentDetailsModal 
               isOpen={!!selectedItem}
               onClose={() => setSelectedItem(null)}
               equipment={selectedItem}
               readOnly={true}
            />

            {/* Application Detail View */}
            <AnimatePresence>
                {viewingApplication && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                            <FileText size={24} />
                            </div>
                            <div>
                            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Formal Asset Application</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Review student credentials and requirements</p>
                            </div>
                        </div>
                        <button onClick={() => setViewingApplication(null)} className="p-2 hover:bg-slate-200 rounded-full transition text-slate-400">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-8">
                            {/* Identity Section */}
                            <div className="grid grid-cols-2 gap-6">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Full Name</span>
                                <span className="text-lg font-bold text-slate-800">{viewingApplication.User?.fullName}</span>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Reg Number</span>
                                <span className="text-lg font-bold text-slate-800">{viewingApplication.studentRegNumber || viewingApplication.User?.studentId}</span>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Phone Number</span>
                                <span className="text-lg font-bold text-slate-800">{viewingApplication.phoneNumber || 'N/A'}</span>
                            </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Education Level</span>
                                <span className="font-bold text-slate-700">{viewingApplication.level || 'N/A'}</span>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Department</span>
                                <span className="font-bold text-slate-700">{viewingApplication.department || viewingApplication.User?.department}</span>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">National ID No</span>
                                <span className="font-bold text-slate-700">{viewingApplication.studentIdNumber || 'N/A'}</span>
                            </div>
                            </div>

                            {/* Usage Context */}
                            <div className="space-y-4">
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <MapPin size={12} className="text-blue-500" /> Reason for Request
                                </h4>
                                <div className="p-5 bg-white border border-slate-200 rounded-2xl text-sm text-slate-600 leading-relaxed shadow-sm italic">
                                    "{viewingApplication.purpose}"
                                </div>
                            </div>
                            {viewingApplication.additionalInfo && (
                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <Info size={12} className="text-slate-400" /> Additional Context
                                    </h4>
                                    <p className="text-sm text-slate-500 px-1">{viewingApplication.additionalInfo}</p>
                                </div>
                            )}
                            </div>
                        </div>

                        {/* Verification & Asset Section */}
                        <div className="space-y-6">
                            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3">Target Resource</h4>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white rounded-xl border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                                    <PackageSearch size={24} />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-800">{viewingApplication.Equipment?.name || viewingApplication.IncubationAsset?.name}</div>
                                    <div className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">{viewingApplication.Equipment?.category || viewingApplication.IncubationAsset?.category}</div>
                                </div>
                            </div>
                            </div>

                            <div className="space-y-1.5">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Identity Upload</h4>
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden border-2 border-slate-200 border-dashed bg-slate-50 group relative">
                                {viewingApplication.studentIdImage ? (
                                    <img src={viewingApplication.studentIdImage} className="w-full h-full object-cover" alt="Student ID" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                        <ImageIcon size={48} />
                                        <span className="text-[9px] font-bold uppercase mt-2">No Image Provided</span>
                                    </div>
                                )}
                                <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-md p-3 text-white text-[10px] font-bold text-center">
                                    Uploaded Identity Proof
                                </div>
                            </div>
                            </div>

                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Pickup</span>
                                <span className="text-sm font-bold text-slate-700">{new Date(viewingApplication.startDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Deadline</span>
                                <span className="text-sm font-bold text-red-600">{new Date(viewingApplication.endDate).toLocaleDateString()}</span>
                            </div>
                            </div>

                            {viewingApplication.status === 'Pending' && (
                            <div className="pt-4 flex flex-col gap-3">
                                <button 
                                    onClick={() => { handleAction(viewingApplication.id, 'Approved'); setViewingApplication(null); }}
                                    className="w-full py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/20 text-sm"
                                >
                                    Verify & Approve
                                </button>
                                <button 
                                    onClick={() => { handleAction(viewingApplication.id, 'Cancelled'); setViewingApplication(null); }}
                                    className="w-full py-3 bg-white border border-red-200 text-red-600 rounded-2xl font-bold hover:bg-red-50 transition text-sm"
                                >
                                    Reject Application
                                </button>
                            </div>
                            )}
                        </div>
                    </div>
                    </motion.div>
                </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{title}</p>
            <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{value}</h3>
        </div>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-50 ${color} group-hover:scale-110 transition-transform duration-500`}>
            {icon}
        </div>
    </div>
);

// Internal small chart components for analytics view
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid } from 'recharts';

const AnalyticsPie = ({ data }) => (
   <div className="w-full h-full flex flex-col items-center">
      <div className="flex-1 w-full min-h-0">
         <ResponsiveContainer width="100%" height="100%">
            <PieChart>
               <Pie data={data} innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value" strokeWidth={0}>
                  {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
               </Pie>
               <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
            </PieChart>
         </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-4">
         {data.map((entry, i) => (
            <div key={i} className="flex items-center gap-2">
               <div className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color }}></div>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{entry.name}</span>
               <span className="text-[10px] font-black text-slate-800 ml-auto">{entry.value}</span>
            </div>
         ))}
      </div>
   </div>
);

const AnalyticsBar = ({ data }) => (
   <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
         <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 800 }} />
         <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
         <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={32} />
      </BarChart>
   </ResponsiveContainer>
);

const AnalyticsTrend = ({ data }) => (
   <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
         <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
               <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
               <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
         </defs>
         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
         <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} />
         <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', background: '#ffffff', color: '#000' }} />
         <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={4} fill="url(#trendGradient)" />
      </AreaChart>
   </ResponsiveContainer>
);

export default Reservations;
