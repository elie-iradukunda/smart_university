import { 
  Calendar, CheckCircle, AlertCircle, Trash2, Check, X, Loader2, User, Package, FileText, MapPin, Info, Image as ImageIcon, Phone, PackageSearch
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
                    <h1 className="text-2xl font-semibold text-[#2c3e50]">Manage Reservations</h1>
                    <p className="text-sm text-[#6b7280] mt-1">
                        {user?.role === 'Admin' ? 'Global review' : `Reviewing requests for ${user?.department || 'all departments'}`}
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Requests" value={stats.total.toString().padStart(2, '0')} icon={<Calendar size={18} />} color="text-[#1f4fa3]" />
                <StatCard title="Reviewing" value={stats.pending.toString().padStart(2, '0')} icon={<AlertCircle size={18} />} color="text-amber-500" />
                <StatCard title="Confirmed" value={stats.approved.toString().padStart(2, '0')} icon={<CheckCircle size={18} />} color="text-green-500" />
            </div>

            {/* List */}
            <div className="space-y-4">
                <h3 className="text-base font-semibold text-[#2c3e50]">Incoming Requests</h3>
                
                {reservations.length === 0 ? (
                    <div className="p-12 bg-white border border-gray-200 border-dashed rounded-lg text-center text-[#9ca3af] text-xs">
                        No equipment requests found.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {reservations.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
                                {/* Equipment Image */}
                                <div className="md:w-48 h-32 md:h-auto relative bg-gray-50 border-r border-gray-100 shrink-0 flex items-center justify-center">
                                    {(item.Equipment?.image || item.IncubationAsset?.image) ? (
                                        <img src={item.Equipment?.image || item.IncubationAsset?.image} className="w-full h-full object-cover" />
                                    ) : (
                                        <Package className="text-gray-300" size={32} />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-5 flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-[10px] font-bold text-[#1f4fa3] bg-[#1f4fa3]/5 px-2 py-0.5 rounded uppercase tracking-wider">
                                                    {item.Equipment?.category || item.IncubationAsset?.category}
                                                </span>
                                                <h3 className="text-base font-bold text-[#2c3e50] mt-1">{item.Equipment?.name || item.IncubationAsset?.name}</h3>
                                            </div>
                                            <span className={`px-2.5 py-1 text-[10px] font-bold border rounded-md ${getStatusStyle(item.status)}`}>
                                                {item.status.toUpperCase()}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-2 text-xs text-[#6b7280]">
                                                    <User size={14} className="text-[#9ca3af]" />
                                                    <span className="font-semibold text-[#2c3e50]">{item.User?.fullName}</span>
                                                    <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-[#9ca3af]">
                                                        {item.User?.studentId}
                                                    </span>
                                                </div>
                                                <div className="flex gap-2 text-[10px] text-[#9ca3af] font-medium pl-6">
                                                    <span>{item.User?.role}</span>
                                                    <span>•</span>
                                                    <span>{item.User?.department}</span>
                                                    <span>•</span>
                                                    <span className="text-[#1f4fa3] opacity-70">{item.User?.email}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-2 text-xs text-[#6b7280]">
                                                <Calendar size={14} className="text-[#9ca3af] mt-0.5" />
                                                <div className="flex flex-col">
                                                    <span>{new Date(item.startDate).toLocaleDateString()}</span>
                                                    <span className="text-[10px] opacity-60">to {new Date(item.endDate).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                                                <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase">Module Context</span>
                                                    <span className="text-xs font-bold text-[#1f4fa3]">{item.moduleCode || 'N/A'}</span>
                                                </div>
                                                <div className="text-[11px] text-[#6b7280] leading-relaxed">
                                                    <span className="font-semibold text-[#2c3e50] block mb-0.5 text-[9px] uppercase opacity-50">Purpose / Goals</span>
                                                    "{item.purpose}"
                                                </div>
                                            </div>
                                            
                                            <div className="flex gap-4">
                                                <button 
                                                    onClick={() => setSelectedItem(item.Equipment || item.IncubationAsset)}
                                                    className="flex items-center gap-2 text-[10px] font-bold text-[#1f4fa3] hover:underline"
                                                >
                                                    <Package size={12} /> View Specifications
                                                </button>
                                                <button 
                                                    onClick={() => setViewingApplication(item)}
                                                    className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 hover:underline"
                                                >
                                                    <FileText size={12} /> View Student Application
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex md:flex-col gap-2 justify-center md:border-l border-gray-50 md:pl-6 min-w-[120px]">
                                        {item.status === 'Pending' ? (
                                            <>
                                                <button 
                                                    disabled={actionLoading === item.id}
                                                    onClick={() => handleAction(item.id, 'Approved')}
                                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#1f4fa3] text-white py-2 px-4 rounded-md text-xs font-bold hover:bg-[#173e82] transition-all"
                                                >
                                                    {actionLoading === item.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Approve
                                                </button>
                                                <button 
                                                    disabled={actionLoading === item.id}
                                                    onClick={() => handleAction(item.id, 'Cancelled')}
                                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 py-2 px-4 rounded-md text-xs font-bold hover:bg-red-50 transition-all"
                                                >
                                                    <X size={14} /> Reject
                                                </button>
                                            </>
                                        ) : item.status === 'Approved' ? (
                                            <button 
                                                onClick={() => handleAction(item.id, 'Borrowed')}
                                                className="w-full bg-[#2c3e50] text-white py-2 rounded-md text-xs font-bold hover:bg-[#1f4fa3]"
                                            >
                                                Issue Item
                                            </button>
                                        ) : item.status === 'Borrowed' ? (
                                            <button 
                                                onClick={() => handleAction(item.id, 'Returned')}
                                                className="w-full bg-green-600 text-white py-2 rounded-md text-xs font-bold hover:bg-green-700"
                                            >
                                                Confirm Return
                                            </button>
                                        ) : (
                                            <span className="text-[10px] text-gray-400 font-medium text-center italic">No Actions Pending</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

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
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
            <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest">{title}</p>
            <h3 className="text-2xl font-bold text-[#2c3e50] mt-1">{value}</h3>
        </div>
        <div className={`p-2.5 rounded-lg bg-opacity-10 ${color.replace('text-', 'bg-')} ${color}`}>
            {icon}
        </div>
    </div>
);

export default Reservations;
