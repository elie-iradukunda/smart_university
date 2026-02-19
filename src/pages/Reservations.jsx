import { 
  Calendar, CheckCircle, AlertCircle, Trash2, Check, X, Loader2, User, Package
} from "lucide-react";
import { useState, useEffect } from "react";
import API_BASE_URL from '../config/api';
import EquipmentDetailsModal from "../components/EquipmentDetailsModal";

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
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
                                    {item.Equipment?.image ? (
                                        <img src={item.Equipment.image} className="w-full h-full object-cover" />
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
                                                    {item.Equipment?.category}
                                                </span>
                                                <h3 className="text-base font-bold text-[#2c3e50] mt-1">{item.Equipment?.name}</h3>
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
                                            
                                            <button 
                                                onClick={() => setSelectedItem(item.Equipment)}
                                                className="flex items-center gap-2 text-[10px] font-bold text-[#1f4fa3] hover:underline"
                                            >
                                                <Package size={12} /> View Full Specifications & Media
                                            </button>
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
