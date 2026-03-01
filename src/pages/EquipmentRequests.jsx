import { useState, useEffect } from 'react';
import { 
    Package, Plus, Search, Filter, Check, ArrowRight, 
    Loader2, Play, FileText, Trash2, ChevronRight, 
    ShoppingCart, Info, AlertCircle, CheckCircle2
} from 'lucide-react';
import API_BASE_URL from '../config/api';

const EquipmentRequests = () => {
    const [requests, setRequests] = useState([]);
    const [allCatalog, setAllCatalog] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [showForm, setShowForm] = useState(false);
    
    // Form state
    const [formItems, setFormItems] = useState([]);
    const [requestDetails, setRequestDetails] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem('user'));
        setUser(u);
        fetchRequests();
        fetchCatalog();
    }, []);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/requests`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setRequests(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCatalog = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/equipment?limit=100`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                // Filter unique by name to use as templates
                const uniqueNames = [];
                const filtered = (data.equipment || []).filter(item => {
                    const isNew = !uniqueNames.includes(item.name);
                    if (isNew) uniqueNames.push(item.name);
                    return isNew;
                });
                setAllCatalog(filtered);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const addItemToForm = (template = null) => {
        const newItem = template ? {
            name: template.name,
            category: template.category,
            quantity: 1,
            details: template.description || '',
            id: Math.random().toString(36).substr(2, 9)
        } : {
            name: '',
            category: 'Electronics',
            quantity: 1,
            details: '',
            id: Math.random().toString(36).substr(2, 9)
        };
        setFormItems([...formItems, newItem]);
    };

    const removeItemFromForm = (id) => {
        setFormItems(formItems.filter(item => item.id !== id));
    };

    const updateFormItem = (idx, field, value) => {
        const updated = [...formItems];
        updated[idx][field] = value;
        setFormItems(updated);
    };

    const handleSubmitRequest = async (e) => {
        e.preventDefault();
        if (formItems.length === 0) {
            alert("Please add at least one item to the request.");
            return;
        }
        setErrorMessage('');
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const payload = { 
                items: formItems.map(i => ({ name: i.name, category: i.category, quantity: i.quantity, details: i.details })),
                details: requestDetails 
            };
            
            const response = await fetch(`${API_BASE_URL}/api/requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                setSuccessMessage("Your formal procurement request has been submitted successfully. The department head and stock manager have been notified.");
                setShowForm(false);
                setFormItems([]);
                setRequestDetails('');
                fetchRequests();
                // Scroll to top to see success message if needed, or just let it sit
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const errData = await response.json();
                setErrorMessage(errData.message || "Failed to submit request. Please try again.");
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("A network error occurred. Please check your connection.");
        } finally {
            setSubmitting(false);
            // Auto hide success after 6 seconds
            setTimeout(() => setSuccessMessage(''), 6000);
        }
    };

    const handleAction = async (id, action) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/requests/${id}/${action}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                fetchRequests();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const filteredCatalog = allCatalog.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex justify-center items-center h-full min-h-[400px]">
            <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in">
            {/* Notifications */}
            {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2">
                    <CheckCircle2 size={20} className="text-green-500" />
                    <p className="text-sm font-medium">{successMessage}</p>
                    <button onClick={() => setSuccessMessage('')} className="ml-auto text-green-400 hover:text-green-600">
                        <Plus size={18} className="rotate-45" />
                    </button>
                </div>
            )}

            {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2">
                    <AlertCircle size={20} className="text-red-500" />
                    <p className="text-sm font-medium">{errorMessage}</p>
                    <button onClick={() => setErrorMessage('')} className="ml-auto text-red-400 hover:text-red-600">
                        <Plus size={18} className="rotate-45" />
                    </button>
                </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Professional Procurement Portal</h1>
                    <p className="text-gray-500 mt-1">Multi-item equipment requests and institutional resource planning</p>
                </div>
                {user?.role === 'HOD' && (
                    <button 
                        onClick={() => {
                            setShowForm(!showForm);
                            if (!showForm && formItems.length === 0) addItemToForm();
                        }}
                        className={`px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold transition-all ${
                            showForm 
                             ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                             : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20'
                        }`}
                    >
                        {showForm ? 'Cancel Request' : <><ShoppingCart size={18} /> New Bulk Request</>}
                    </button>
                )}
            </div>

            {showForm && user?.role === 'HOD' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-top-4 duration-300">
                    
                    {/* Catalog Selection Sidebar */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-[600px]">
                        <div className="shrink-0 space-y-4 mb-4">
                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Search size={14} /> Search Catalog
                            </h2>
                            <input 
                                type="text" 
                                placeholder="Find existing equipment..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
                            {filteredCatalog.map(item => (
                                <button 
                                    key={item.id}
                                    onClick={() => addItemToForm(item)}
                                    className="w-full text-left p-3 rounded-lg border border-gray-50 hover:border-blue-200 hover:bg-blue-50/50 transition-all flex items-center gap-3 group"
                                >
                                    <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center shrink-0 overflow-hidden border border-gray-100">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Package size={18} className="text-gray-400 group-hover:text-blue-500" />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-gray-800 truncate">{item.name}</p>
                                        <p className="text-[10px] text-gray-400 font-medium uppercase">{item.category}</p>
                                    </div>
                                    <Plus size={14} className="ml-auto text-gray-300 group-hover:text-blue-500" />
                                </button>
                            ))}
                            {filteredCatalog.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-xs text-gray-400">No matching items found</p>
                                </div>
                            )}
                        </div>
                        <button 
                            onClick={() => addItemToForm()}
                            className="mt-4 w-full py-2.5 border-2 border-dashed border-gray-100 text-[#1f4fa3] text-xs font-bold rounded-xl hover:bg-blue-50 hover:border-blue-100 transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={14} /> Custom Item Entry
                        </button>
                    </div>

                    {/* Request Items Form */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-[600px] overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">Items List</h2>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Selected for procurement</p>
                            </div>
                            <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                                {formItems.length} {formItems.length === 1 ? 'Item' : 'Items'}
                            </div>
                        </div>

                        <form onSubmit={handleSubmitRequest} className="flex-1 flex flex-col overflow-hidden">
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                                {formItems.length === 0 && (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-50 rounded-2xl">
                                        <ShoppingCart size={48} className="text-gray-100 mb-4" />
                                        <p className="text-sm font-bold text-gray-400">Your request list is empty</p>
                                        <p className="text-xs text-gray-300 mt-1">Select items from the catalog or add manually</p>
                                    </div>
                                )}
                                {formItems.map((item, idx) => (
                                    <div key={item.id} className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 space-y-4 relative animate-in slide-in-from-right-2">
                                        <button 
                                            type="button" 
                                            onClick={() => removeItemFromForm(item.id)}
                                            className="absolute top-2 right-2 p-1.5 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                                            <div className="md:col-span-3">
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Item name</label>
                                                <input 
                                                    required type="text"
                                                    value={item.name}
                                                    onChange={(e) => updateFormItem(idx, 'name', e.target.value)}
                                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Category</label>
                                                <input 
                                                    required type="text"
                                                    value={item.category}
                                                    onChange={(e) => updateFormItem(idx, 'category', e.target.value)}
                                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                                                />
                                            </div>
                                            <div className="md:col-span-1">
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Qty</label>
                                                <input 
                                                    required type="number" min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => updateFormItem(idx, 'quantity', parseInt(e.target.value) || 1)}
                                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none font-bold"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Specifications / Notes</label>
                                            <textarea 
                                                value={item.details}
                                                onChange={(e) => updateFormItem(idx, 'details', e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:border-blue-500 outline-none resize-none"
                                                rows="2"
                                                placeholder="e.g. SSD 1TB, 16GB RAM, i7 Gen 13"
                                            ></textarea>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                                <div className="mb-4">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Request Overview / Justification</label>
                                    <textarea 
                                        value={requestDetails}
                                        onChange={(e) => setRequestDetails(e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Explain the necessity of these institutional assets..."
                                        rows="2"
                                    ></textarea>
                                </div>
                                <button 
                                    disabled={submitting || formItems.length === 0}
                                    type="submit"
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all"
                                >
                                    {submitting ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={18} /> Submit Formal Request</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Requests List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-800">Historical Tracking</h2>
                    <div className="flex gap-2">
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-amber-100">
                           {requests.filter(r => r.status === 'Pending').length} Pending
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                           {requests.filter(r => r.status === 'Approved').length} Approved
                        </span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left bg-white">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ref ID & Date</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Department</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Requester</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Inventory Manifest</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right whitespace-nowrap">Manager Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {requests.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-400 italic">No formal requests recorded</td></tr>
                            ) : requests.map(req => (
                                <tr key={req.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 cursor-pointer" onClick={() => setSelectedRequest(req)}>
                                        <p className="font-black text-[#2c3e50] text-xs uppercase tracking-tighter">#{req.id.substr(0, 8)}</p>
                                        <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">{new Date(req.createdAt).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-6 py-4 cursor-pointer" onClick={() => setSelectedRequest(req)}>
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-[10px] font-bold uppercase tracking-tighter">
                                            {req.department}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 cursor-pointer" onClick={() => setSelectedRequest(req)}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
                                                {req.Requester?.fullName?.charAt(0) || 'U'}
                                            </div>
                                            <p className="text-xs font-bold text-gray-700">{req.Requester?.fullName || 'Academic Staff'}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 cursor-pointer" onClick={() => setSelectedRequest(req)}>
                                        <div className="space-y-1">
                                            {(req.Items || []).slice(0, 2).map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <span className="w-1 h-1 bg-blue-300 rounded-full"></span>
                                                    <p className="text-xs text-gray-600 font-medium">
                                                        <span className="text-gray-800 font-bold">{item.quantity}x</span> {item.name}
                                                    </p>
                                                </div>
                                            ))}
                                            {(req.Items || []).length > 2 && (
                                                <p 
                                                    onClick={() => setSelectedRequest(req)}
                                                    className="text-[10px] text-blue-500 font-black uppercase tracking-widest underline cursor-pointer hover:text-blue-600"
                                                >
                                                    + {(req.Items || []).length - 2} more items
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 
                                            ${req.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                                              req.status === 'Approved' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 
                                              'bg-green-50 text-green-600 border border-green-100'}`}
                                        >
                                            <span className={`w-1.5 h-1.5 rounded-full ${
                                                req.status === 'Pending' ? 'bg-amber-400' : 
                                                req.status === 'Approved' ? 'bg-blue-400' : 'bg-green-400'
                                            }`}></span>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {(user?.role === 'StockManager' || user?.role === 'Admin') && req.status === 'Pending' && (
                                                <button 
                                                    onClick={() => handleAction(req.id, 'approve')} 
                                                    className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-md hover:bg-blue-700 transition-all flex items-center gap-2"
                                                >
                                                    <Check size={14} /> Approve
                                                </button>
                                            )}
                                            {(user?.role === 'StockManager' || user?.role === 'Admin') && req.status === 'Approved' && (
                                                <button 
                                                    onClick={() => handleAction(req.id, 'deliver')} 
                                                    className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold shadow-md hover:bg-green-700 transition-all flex items-center gap-2"
                                                >
                                                    <ArrowRight size={14} /> Deliver
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => setSelectedRequest(req)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" 
                                                title="View Details"
                                            >
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Request Details Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 shadow-2xl backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h2 className="text-xl font-black text-gray-800 tracking-tight">Request Manifest Detail</h2>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Ref ID: #{selectedRequest.id}</p>
                            </div>
                            <button 
                                onClick={() => setSelectedRequest(null)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-full transition-all"
                            >
                                <Plus size={24} className="rotate-45" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <DetailCard title="Status" value={selectedRequest.status} type={selectedRequest.status} />
                                <DetailCard title="Department" value={selectedRequest.department} />
                                <DetailCard title="Requested On" value={new Date(selectedRequest.createdAt).toLocaleDateString()} />
                            </div>

                            {/* Requester Info */}
                            <div className="flex items-center gap-4 p-4 bg-blue-50/30 rounded-xl border border-blue-100/50">
                                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-lg">
                                    {selectedRequest.Requester?.fullName?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Requester</p>
                                    <p className="text-sm font-bold text-gray-800">{selectedRequest.Requester?.fullName || 'Not available'}</p>
                                    <p className="text-[11px] text-gray-500">{selectedRequest.Requester?.email || ''}</p>
                                </div>
                            </div>

                            {/* Justification */}
                            <div className="space-y-2">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <FileText size={14} className="text-blue-500" /> Justification & Notes
                                </h3>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 italic text-sm text-gray-600 leading-relaxed">
                                    {selectedRequest.details || "No additional justification provided with this request."}
                                </div>
                            </div>

                            {/* Items List */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Package size={14} className="text-blue-500" /> Requested Inventory ({selectedRequest.Items?.length})
                                </h3>
                                <div className="space-y-3">
                                    {selectedRequest.Items?.map((item, idx) => (
                                        <div key={idx} className="p-4 bg-white border border-gray-100 rounded-2xl flex justify-between items-start hover:shadow-md transition-shadow group">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-black text-gray-800">{item.name}</span>
                                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[9px] font-bold uppercase">{item.category}</span>
                                                </div>
                                                <p className="text-xs text-gray-500 max-w-md">{item.details || 'No specific technical details listed.'}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">Quantity</p>
                                                <p className="text-lg font-black text-blue-600">{item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/30 flex justify-end gap-3">
                             {(user?.role === 'StockManager' || user?.role === 'Admin') && selectedRequest.status === 'Pending' && (
                                <button 
                                    onClick={() => { handleAction(selectedRequest.id, 'approve'); setSelectedRequest(null); }} 
                                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2"
                                >
                                    <Check size={18} /> Approve This List
                                </button>
                            )}
                            <button 
                                onClick={() => setSelectedRequest(null)}
                                className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all"
                            >
                                Close Manifest
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Professional Footer Info */}
            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-start gap-3">
                <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
                <div>
                   <p className="text-xs font-bold text-blue-800 uppercase tracking-widest">Procurement Policy Notice</p>
                   <p className="text-[11px] text-blue-600/80 leading-relaxed mt-1">
                      Submitted requests are subject to audit and availability. Once "Delivered" by the Stock Manager, items will appear in the Laboratorial Inventory with "Pending Verification" status to be confirmed by technical staff.
                   </p>
                </div>
            </div>
        </div>
    );
};

const DetailCard = ({ title, value, type }) => {
    let statusStyles = "bg-gray-50 text-gray-700";
    if (type === 'Pending') statusStyles = "bg-amber-50 text-amber-600 border border-amber-100";
    if (type === 'Approved') statusStyles = "bg-blue-50 text-blue-600 border border-blue-100";
    if (type === 'Delivered') statusStyles = "bg-green-50 text-green-600 border border-green-100";

    return (
        <div className={`p-4 rounded-2xl border border-gray-100 ${type ? statusStyles : 'bg-white'}`}>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
            <p className="text-sm font-black tracking-tight">{value}</p>
        </div>
    );
};

export default EquipmentRequests;
