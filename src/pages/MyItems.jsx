import { RefreshCcw, CheckCircle, AlertCircle, Clock, ShoppingBag, Loader2, Package } from 'lucide-react';
import { useState, useEffect } from 'react';
import API_BASE_URL from '../config/api';
import EquipmentDetailsModal from '../components/EquipmentDetailsModal';

const MyItems = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedItem, setSelectedItem] = useState(null);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const resResponse = await fetch(`${API_BASE_URL}/api/reservations/my`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!resResponse.ok) throw new Error("Failed to fetch your items");
            const resData = await resResponse.json();
            setReservations(resData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex h-96 items-center justify-center">
            <Loader2 className="animate-spin text-[#1f4fa3]" size={32} />
        </div>
    );

    const activeItems = reservations.filter(r => ['Approved', 'Borrowed', 'Pending', 'Overdue'].includes(r.status));
    const historyItems = reservations.filter(r => ['Returned', 'Cancelled'].includes(r.status));

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-[#2c3e50]">My Items</h1>
                    <p className="text-sm text-[#6b7280] mt-1">Track active loans and reservation status.</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-[#1f4fa3] text-white border border-[#1f4fa3] px-3 py-1.5 rounded-md text-sm font-medium shadow-sm">
                        Current
                    </button>
                    <button className="bg-white border border-gray-200 text-[#6b7280] px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-50 transition-all shadow-sm">
                        History
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Active Loans" 
                    value={activeItems.filter(i => i.status === 'Borrowed' || i.status === 'Approved').length.toString().padStart(2, '0')} 
                    icon={<Clock size={18} />} 
                    color="text-[#1f4fa3]" 
                />
                <StatCard 
                    title="Pending Approvals" 
                    value={activeItems.filter(i => i.status === 'Pending').length.toString().padStart(2, '0')} 
                    icon={<AlertCircle size={18} />} 
                    color="text-amber-500" 
                />
                <StatCard 
                    title="Total Returned" 
                    value={historyItems.filter(i => i.status === 'Returned').length.toString().padStart(2, '0')} 
                    icon={<CheckCircle size={18} />} 
                    color="text-[#22c55e]" 
                />
            </div>

            {/* Active Borrowings List */}
            <div className="space-y-4">
                <h3 className="text-base font-semibold text-[#2c3e50] flex items-center gap-2">
                    <ShoppingBag size={18} /> Active Requests & Loans
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeItems.length === 0 ? (
                        <div className="col-span-full p-12 bg-white border border-gray-200 border-dashed rounded-lg text-center text-[#9ca3af] text-sm flex flex-col items-center gap-2">
                            <Package size={32} className="opacity-20" />
                            No active items or pending requests.
                        </div>
                    ) : (
                        activeItems.map(item => (
                            <div key={item.id} className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm flex flex-col gap-4 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-gray-50 rounded-md flex items-center justify-center text-xl border border-gray-100 overflow-hidden">
                                            {item.Equipment?.image ? (
                                                <img src={item.Equipment.image} className="w-full h-full object-cover" />
                                            ) : '📦'}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-[#2c3e50] truncate max-w-[150px]">{item.Equipment?.name || 'Equipment'}</h4>
                                            <p className="text-[10px] text-[#1f4fa3] font-medium">{item.Equipment?.category}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold border ${
                                        item.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                                        item.status === 'Approved' ? 'bg-green-50 text-green-600 border-green-200' :
                                        item.status === 'Overdue' ? 'bg-red-50 text-red-600 border-red-200' :
                                        'bg-blue-50 text-blue-600 border-blue-200'
                                    }`}>
                                        {item.status.toUpperCase()}
                                    </span>
                                </div>
                                
                                <div className="space-y-2">
                                    <p className="text-[11px] text-[#6b7280] line-clamp-2 italic">"{item.purpose}"</p>
                                    <div className="flex items-center gap-4 py-3 border-y border-gray-50 text-[11px]">
                                        <div className="flex-1">
                                            <p className="text-[#9ca3af] font-medium uppercase tracking-wider mb-1">Start Date</p>
                                            <p className="font-semibold text-[#2c3e50]">{new Date(item.startDate).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex-1 border-l border-gray-50 pl-4">
                                            <p className="text-[#9ca3af] font-medium uppercase tracking-wider mb-1">End Date</p>
                                            <p className="font-semibold text-[#2c3e50]">
                                                {new Date(item.endDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setSelectedItem(item.Equipment)}
                                        className="flex-1 bg-gray-50 border border-gray-200 text-[#2c3e50] py-2 rounded-md text-xs font-bold hover:bg-gray-100 transition-colors"
                                    >
                                        Details
                                    </button>
                                    {item.status === 'Pending' && (
                                        <button className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-md text-xs font-bold transition-colors">
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* History Table */}
            <div className="space-y-4 pt-4">
                <h3 className="text-base font-semibold text-[#2c3e50]">Past History</h3>
                <div className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#f9fafb] border-b border-gray-200 text-[10px] uppercase text-[#6b7280] font-bold tracking-widest">
                            <tr>
                                <th className="px-5 py-4">Item Name</th>
                                <th className="px-5 py-4">Dates</th>
                                <th className="px-5 py-4">Status</th>
                                <th className="px-5 py-4 text-right">Reference</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {historyItems.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center overflow-hidden">
                                                {item.Equipment?.image ? <img src={item.Equipment.image} className="w-full h-full object-cover" /> : '📦'}
                                            </div>
                                            <span className="font-medium text-[#2c3e50]">{item.Equipment?.name || 'Unknown Item'}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-[11px] text-[#6b7280]">
                                        {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-sm border ${
                                            item.status === 'Returned' ? 'text-green-600 bg-green-50 border-green-100' : 'text-gray-400 bg-gray-50 border-gray-100'
                                        }`}>
                                            {item.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <span className="text-xs text-[#9ca3af]">#{item.id.split('-')[0]}</span>
                                    </td>
                                </tr>
                            ))}
                            {historyItems.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-5 py-8 text-center text-gray-400 text-xs">No history recorded yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
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
  <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest">{title}</p>
      <h3 className="text-2xl font-bold text-[#2c3e50] mt-1">{value}</h3>
    </div>
    <div className={`p-2.5 rounded-lg bg-opacity-10 ${color.replace('text-', 'bg-')} ${color}`}>
      {icon}
    </div>
  </div>
);

export default MyItems;
