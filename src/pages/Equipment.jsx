import { Search, Plus, Filter, MoreHorizontal, FileText, ChevronDown, Loader2, Package, Edit, CheckCircle2, MapPin, X, User as UserIcon, Building2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import API_BASE_URL from '../config/api';
import AddEquipmentModal from '../components/AddEquipmentModal';

import EquipmentDetailsModal from '../components/EquipmentDetailsModal';

const Equipment = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [assignItem, setAssignItem] = useState(null);
  const [assignLab, setAssignLab] = useState('');
  const [assignQuantity, setAssignQuantity] = useState(1);
  const [assignNotes, setAssignNotes] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [labStaff, setLabStaff] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [labAssignments, setLabAssignments] = useState([]);
  const [verifyItem, setVerifyItem] = useState(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const fetchEquipment = async () => {
    try {
      const token = localStorage.getItem('token');
      const [eqRes, assignRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/equipment`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/api/lab-assignments`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).catch(() => ({ ok: false }))
      ]);

      if (!eqRes.ok) throw new Error('Failed to fetch equipment');
      const data = await eqRes.json();
      setItems(data.equipment || []);

      if (assignRes.ok) {
        const assignments = await assignRes.json();
        setLabAssignments(assignments);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get number of items already assigned to labs for a given equipment
  const getAssignedCount = (equipmentId) => {
    return labAssignments
      .filter(a => a.equipmentId === equipmentId && (a.status === 'Pending' || a.status === 'Received'))
      .reduce((sum, a) => sum + (a.quantity || 0), 0);
  };

  // Get the quantity assigned to the current lab staff for a given equipment
  const getLabStaffStock = (equipmentId) => {
    if (!user) return { confirmed: 0, pending: 0 };
    const userId = user.id;
    const myAssignments = labAssignments.filter(a => a.equipmentId === equipmentId && a.assignedToId === userId);
    return {
      confirmed: myAssignments.filter(a => a.status === 'Received').reduce((s, a) => s + (a.quantity || 0), 0),
      pending: myAssignments.filter(a => a.status === 'Pending').reduce((s, a) => s + (a.quantity || 0), 0),
    };
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const handleModalClose = (success = false, msg = "") => {
      setIsModalOpen(false);
      setEditItem(null);
      if (success === true) {
          setSuccessMessage(msg);
          setTimeout(() => setSuccessMessage(""), 5000);
      }
      fetchEquipment(); // Refresh list after adding
  };

  const filteredItems = items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                           item.category.toLowerCase().includes(search.toLowerCase()) ||
                           (item.modelNumber && item.modelNumber.toLowerCase().includes(search.toLowerCase()));
      
      const matchesDept = user?.role === 'Admin' || user?.role === 'StockManager' || item.department === user?.department;
      const matchesCategory = selectedCategory === "All Categories" || item.category === selectedCategory;
      
      return matchesSearch && matchesDept && matchesCategory;
  });

  const categories = ["All Categories", ...new Set(items.map(item => item.category).filter(Boolean))];

  const handleExport = () => {
      const csvRows = [];
      const headers = ['Name', 'Model', 'Category', 'Department', 'Available', 'Stock', 'Status'];
      csvRows.push(headers.join(','));

      filteredItems.forEach(item => {
          const row = [
              `"${item.name || ''}"`,
              `"${item.modelNumber || ''}"`,
              `"${item.category || ''}"`,
              `"${item.department || ''}"`,
              item.available,
              item.stock,
              `"${item.status || ''}"`
          ];
          csvRows.push(row.join(','));
      });

      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('href', url);
      a.setAttribute('download', 'equipment_report.csv');
      a.click();
  };

  // Fetch lab staff when assign modal opens
  useEffect(() => {
      if (!assignItem || !user) return;
      const fetchLabStaff = async () => {
          setLoadingStaff(true);
          try {
              const token = localStorage.getItem('token');
              const deptParam = user.department ? `?department=${encodeURIComponent(user.department)}` : '';
              const res = await fetch(`${API_BASE_URL}/api/users/lab-staff${deptParam}`, {
                  headers: { 'Authorization': `Bearer ${token}` }
              });
              if (res.ok) {
                  const data = await res.json();
                  setLabStaff(data);
              }
          } catch (err) { console.error(err); }
          finally { setLoadingStaff(false); }
      };
      fetchLabStaff();
  }, [assignItem, user]);

  const handleAssignToLab = async () => {
      if (!assignLab.trim() || !assignItem || !selectedTechnician) return;
      setAssigning(true);
      try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_BASE_URL}/api/lab-assignments`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                  equipmentId: assignItem.id,
                  equipmentName: assignItem.name,
                  quantity: assignQuantity,
                  labLocation: assignLab,
                  assignedToId: selectedTechnician.id,
                  assignedToName: selectedTechnician.fullName,
                  notes: assignNotes
              })
          });
          if (!response.ok) {
              const errData = await response.json().catch(() => ({}));
              throw new Error(errData.message || `Server error (${response.status})`);
          }
          setSuccessMessage(`${assignQuantity}x "${assignItem.name}" assigned to ${selectedTechnician.fullName} (${assignLab}). Awaiting verification.`);
          setTimeout(() => setSuccessMessage(''), 5000);
          setAssignItem(null);
          setAssignLab('');
          setAssignQuantity(1);
          setAssignNotes('');
          setSelectedTechnician(null);
          fetchEquipment();
      } catch (err) {
          console.error('Assignment error:', err);
          alert('Failed to assign equipment: ' + err.message);
      } finally {
          setAssigning(false);
      }
  };

  if (loading) return (
     <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-[#1f4fa3]" size={32} />
     </div>
  );

  if (error) return (
     <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
        Error: {error}
     </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2">
              <CheckCircle2 size={20} className="text-green-500 shrink-0" />
              <p className="text-sm font-medium">{successMessage}</p>
              <button onClick={() => setSuccessMessage("")} className="ml-auto text-green-400 hover:text-green-600">
                  <Plus size={18} className="rotate-45" />
              </button>
          </div>
      )}
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#2c3e50]">Equipment Inventory</h1>
          <p className="text-sm text-[#6b7280] mt-1">
             {user?.role === 'Admin' ? 'Manage and track all institutional assets.' : `Managing inventory for ${user?.department || 'your department'}.`}
          </p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={handleExport}
             className="bg-white border border-gray-200 text-[#6b7280] px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-all"
           >
              <FileText size={16} /> Export
           </button>
           {(user?.role === 'Admin' || user?.role === 'StockManager') && (
               <button 
                 onClick={() => {
                   setEditItem(null);
                   setIsModalOpen(true);
                 }}
                 className="bg-[#f59e0b] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#d97706] flex items-center gap-2 shadow-sm transition-all"
               >
                  <Plus size={16} /> Add Equipment
               </button>
           )}
        </div>
      </div>

      <AddEquipmentModal 
         isOpen={isModalOpen} 
         onClose={handleModalClose} 
         editData={editItem}
      />

      <EquipmentDetailsModal 
         isOpen={!!selectedItem}
         onClose={() => setSelectedItem(null)}
         equipment={selectedItem}
         readOnly={true}
      />

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
         <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, ID, or category..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1f4fa3]/20 text-sm text-[#2c3e50] placeholder:text-[#9ca3af]"
            />
         </div>
         
         <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative group">
               <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 text-[#6b7280] py-2 pl-4 pr-10 rounded-md text-sm font-medium focus:outline-none focus:border-[#1f4fa3] cursor-pointer hover:bg-gray-50"
               >
                  {categories.map(cat => (
                     <option key={cat} value={cat}>{cat}</option>
                  ))}
               </select>
               <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
            </div>
            
            {user?.role === 'Admin' && (
                <div className="relative group">
                    <select className="appearance-none bg-white border border-gray-200 text-[#6b7280] py-2 pl-4 pr-10 rounded-md text-sm font-medium focus:outline-none focus:border-[#1f4fa3] cursor-pointer hover:bg-gray-50">
                        <option>Status: All</option>
                        <option>Available</option>
                        <option>In Use</option>
                        <option>Maintenance</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                </div>
            )}
         </div>
      </div>

      {/* Equipment Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#2c3e50]">
            <thead className="bg-[#f9fafb] border-b border-gray-200">
               <tr>
                  <th className="px-6 py-3 font-semibold text-[#6b7280] uppercase text-xs tracking-wider">Asset Details</th>
                  <th className="px-6 py-3 font-semibold text-[#6b7280] uppercase text-xs tracking-wider">Category</th>
                  <th className="px-6 py-3 font-semibold text-[#6b7280] uppercase text-xs tracking-wider">Department</th>
                  <th className="px-6 py-3 font-semibold text-[#6b7280] uppercase text-xs tracking-wider">Stock</th>
                  <th className="px-6 py-3 font-semibold text-[#6b7280] uppercase text-xs tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right font-semibold text-[#6b7280] uppercase text-xs tracking-wider">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
               {filteredItems.map((item) => (
                  <tr 
                    key={item.id} 
                    onClick={() => setSelectedItem(item)}
                    className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                  >
                     <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-md bg-gray-100 overflow-hidden border border-gray-200 shrink-0 flex items-center justify-center">
                              {item.image ? (
                                  <img src={item.image} className="w-full h-full object-cover" />
                              ) : (
                                  <Package className="text-gray-300" size={24} />
                              )}
                           </div>
                           <div>
                              <p className="font-semibold text-[#2c3e50]">{item.name}</p>
                              <p className="text-xs text-[#9ca3af] mt-0.5">{item.modelNumber}</p>
                           </div>
                        </div>
                     </td>
                     <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                           {item.category}
                        </span>
                     </td>
                     <td className="px-6 py-4 text-[#6b7280]">
                        {item.department || item.location || 'Main Storage'}
                     </td>
                     <td className="px-6 py-4">
                        {(() => {
                            if (user?.role === 'Lab Staff') {
                                const { confirmed, pending } = getLabStaffStock(item.id);
                                const total = confirmed + pending;
                                if (total === 0) return <div className="text-xs text-gray-400">—</div>;
                                return (<div>
                                    <div className="text-xs">
                                        <span className="font-semibold text-[#2c3e50]">{confirmed}</span>
                                        <span className="text-[#9ca3af]"> / {total}</span>
                                        {pending > 0 && <span className="text-orange-500 ml-1">({pending} pending)</span>}
                                    </div>
                                    <div className="w-16 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                        <div className={`h-full rounded-full ${confirmed > 0 ? 'bg-[#22c55e]' : 'bg-orange-400'}`} style={{ width: `${total > 0 ? (confirmed / total) * 100 : 0}%` }}></div>
                                    </div>
                                </div>);
                            } else if (user?.role === 'HOD') {
                                const assigned = getAssignedCount(item.id);
                                const remaining = (item.stock || 0) - assigned;
                                return (<div>
                                    <div className="text-xs">
                                        <span className="font-semibold text-[#2c3e50]">{remaining}</span>
                                        <span className="text-[#9ca3af]"> / {item.stock}</span>
                                        {assigned > 0 && <span className="text-blue-500 ml-1">({assigned} in labs)</span>}
                                    </div>
                                    <div className="w-16 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                        <div className={`h-full rounded-full ${remaining > 0 ? 'bg-[#22c55e]' : 'bg-blue-400'}`} style={{ width: `${item.stock > 0 ? (remaining / item.stock) * 100 : 0}%` }}></div>
                                    </div>
                                </div>);
                            } else {
                                return (<div>
                                    <div className="text-xs">
                                        <span className="font-semibold text-[#2c3e50]">{item.available}</span>
                                        <span className="text-[#9ca3af]"> / {item.stock}</span>
                                    </div>
                                    <div className="w-16 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                        <div className={`h-full rounded-full ${item.available > 0 ? 'bg-[#22c55e]' : 'bg-[#ef4444]'}`} style={{ width: `${item.stock > 0 ? (item.available / item.stock) * 100 : 0}%` }}></div>
                                    </div>
                                </div>);
                            }
                        })()}
                     </td>
                     <td className="px-6 py-4">
                        {(() => {
                            const statusConfig = {
                                'Available': { bg: 'bg-[#22c55e]/10', text: 'text-[#22c55e]', dot: 'bg-[#22c55e]', label: 'Available' },
                                'In Use': { bg: 'bg-[#f59e0b]/10', text: 'text-[#f59e0b]', dot: 'bg-[#f59e0b]', label: 'In Use' },
                                'Pending Lab Verification': { bg: 'bg-orange-100', text: 'text-orange-600', dot: 'bg-orange-500', label: 'Awaiting Lab' },
                                'Assigned to Lab': { bg: 'bg-blue-100', text: 'text-blue-600', dot: 'bg-blue-500', label: 'Assigned to Lab' },
                                'Maintenance': { bg: 'bg-purple-100', text: 'text-purple-600', dot: 'bg-purple-500', label: 'Maintenance' },
                            };
                            const status = item.status || 'Unassigned';
                            const cfg = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-500', dot: 'bg-gray-400', label: status };
                            return (
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
                                    {cfg.label}
                                </span>
                            );
                        })()}
                      </td>
                     <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                            {(item.status === 'Pending Lab Verification' || item.status === 'Assigned to Lab') && (user?.role === 'Lab Staff' || user?.role === 'Admin') && (() => {
                                // Find if current user has a pending assignment for this item
                                const assignment = labAssignments.find(a => a.equipmentId === item.id && a.status === 'Pending');
                                // Only show if user is admin OR they are the specific lab technician assigned
                                const canVerify = user?.role === 'Admin' || (assignment && user?.role === 'Lab Staff');
                                
                                if (!canVerify) return null;

                                return (
                                    <button
                                        className="p-1.5 hover:bg-green-50 rounded-md text-green-600 transition-colors relative z-10 text-[10px] font-bold border border-green-200 uppercase tracking-wider"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setVerifyItem({ ...item, assignment });
                                        }}
                                    >
                                        Verify
                                    </button>
                                );
                            })()}
                            {user?.role === 'HOD' && (() => {
                                const assigned = getAssignedCount(item.id);
                                const remaining = (item.stock || 0) - assigned;
                                if (remaining <= 0) {
                                    return (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 uppercase tracking-wider">
                                            <Building2 size={12} /> In Labs ({assigned})
                                        </span>
                                    );
                                }
                                if (item.status === 'Assigned to Lab' || item.status === 'Pending Lab Verification') return null;
                                return (
                                    <button
                                        className="p-1.5 hover:bg-purple-50 rounded-md text-purple-600 transition-colors relative z-10 text-[10px] font-bold border border-purple-200 uppercase tracking-wider"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setAssignItem({ ...item, _remaining: remaining });
                                            setAssignLab('');
                                            setAssignQuantity(1);
                                        }}
                                        title={`Assign to Lab (${remaining} remaining)`}
                                    >
                                        <span className="flex items-center gap-1"><MapPin size={12} /> Assign ({remaining})</span>
                                    </button>
                                );
                            })()}
                            {(user?.role === 'Admin' || user?.role === 'StockManager' || user?.role === 'Lab Staff' || user?.role === 'HOD') && (
                                <button 
                                   className="p-2 hover:bg-blue-50 rounded-md text-[#3b82f6] transition-colors relative z-10" 
                                   onClick={(e) => {
                                       e.stopPropagation();
                                       setEditItem(item);
                                       setIsModalOpen(true);
                                   }}
                                   title="Edit Equipment"
                                >
                                   <Edit size={18} />
                                </button>
                            )}
                           <button className="p-2 hover:bg-gray-100 rounded-md text-[#9ca3af] hover:text-[#2c3e50] transition-colors relative z-10" onClick={(e) => {
                                   e.stopPropagation();
                               }}>
                              <MoreHorizontal size={18} />
                           </button>
                        </div>
                     </td>
                  </tr>
               ))}
               
               {filteredItems.length === 0 && (
                  <tr>
                     <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        No equipment found. Add some items to get started.
                     </td>
                  </tr>
               )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
           <p className="text-xs text-[#6b7280]">Showing <span className="font-semibold">{filteredItems.length}</span> entries</p>
           <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-300 bg-white rounded-md text-xs font-medium text-[#6b7280] hover:bg-gray-50 disabled:opacity-50">Previous</button>
              <button className="px-3 py-1 border border-gray-300 bg-white rounded-md text-xs font-medium text-[#6b7280] hover:bg-gray-50 disabled:opacity-50">Next</button>
           </div>
        </div>
      </div>

      {/* Verify Receipt Modal - Lab Staff Only */}
      {verifyItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
                  <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                      <div>
                          <h3 className="text-lg font-bold text-[#2c3e50]">Verify Equipment Receipt</h3>
                          <p className="text-xs text-gray-400 mt-0.5">Confirm you have received the assigned equipment</p>
                      </div>
                      <button onClick={() => setVerifyItem(null)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                          <X size={20} />
                      </button>
                  </div>
                  <div className="p-6 space-y-4">
                      {/* Equipment Preview */}
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
                              {verifyItem.image ? (
                                  <img src={verifyItem.image} className="w-full h-full object-cover" alt="" />
                              ) : (
                                  <Package size={20} className="text-gray-300" />
                              )}
                          </div>
                          <div>
                              <p className="font-bold text-sm text-[#2c3e50]">{verifyItem.name}</p>
                              <p className="text-[11px] text-gray-400">{verifyItem.category} • {verifyItem.modelNumber || 'No model'}</p>
                          </div>
                      </div>

                      {/* Assignment Details */}
                      {verifyItem.assignment ? (
                          <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                  <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                                      <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold mb-1">Assigned By</p>
                                      <p className="text-sm font-bold text-blue-700">{verifyItem.assignment.assignedByName}</p>
                                  </div>
                                  <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
                                      <p className="text-[10px] text-purple-400 uppercase tracking-widest font-bold mb-1">Quantity</p>
                                      <p className="text-sm font-bold text-purple-700">{verifyItem.assignment.quantity} item{verifyItem.assignment.quantity > 1 ? 's' : ''}</p>
                                  </div>
                              </div>

                              <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                                  <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold mb-1">Lab / Location</p>
                                  <p className="text-sm font-bold text-emerald-700">{verifyItem.assignment.labLocation}</p>
                              </div>

                              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Date Assigned</p>
                                  <p className="text-sm font-bold text-gray-700">{new Date(verifyItem.assignment.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })} at {new Date(verifyItem.assignment.createdAt).toLocaleTimeString('en-US', { timeStyle: 'short' })}</p>
                              </div>

                              {verifyItem.assignment.notes && (
                                  <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                                      <p className="text-[10px] text-amber-500 uppercase tracking-widest font-bold mb-1">Notes from HOD</p>
                                      <p className="text-sm text-amber-800">{verifyItem.assignment.notes}</p>
                                  </div>
                              )}
                          </div>
                      ) : (
                          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-center">
                              <p className="text-xs text-gray-400">No assignment details found for this equipment.</p>
                              <p className="text-xs text-gray-400 mt-1">Location: <strong>{verifyItem.location || 'Unknown'}</strong></p>
                          </div>
                      )}

                      {/* Info */}
                      <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex items-start gap-2">
                          <CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" />
                          <p className="text-[11px] text-green-700">By confirming, you acknowledge that the equipment has been <strong>physically delivered</strong> to your lab. The status will change to <strong>"Available"</strong> for students.</p>
                      </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between">
                      <button
                          onClick={async () => {
                              if (!verifyItem.assignment) return;
                              try {
                                  const token = localStorage.getItem('token');
                                  await fetch(`${API_BASE_URL}/api/lab-assignments/${verifyItem.assignment.id}/reject`, {
                                      method: 'PUT',
                                      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                      body: JSON.stringify({ reason: 'Equipment not received' })
                                  });
                                  setSuccessMessage(`Assignment rejected. HOD will be notified.`);
                                  setTimeout(() => setSuccessMessage(''), 5000);
                                  setVerifyItem(null);
                                  fetchEquipment();
                              } catch (err) { console.error(err); alert('Failed to reject'); }
                          }}
                          disabled={!verifyItem.assignment || verifying}
                          className="px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-all border border-red-200 disabled:opacity-40"
                      >
                          Reject
                      </button>
                      <div className="flex gap-3">
                          <button
                              onClick={() => setVerifyItem(null)}
                              className="px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
                          >
                              Cancel
                          </button>
                          <button
                              onClick={async () => {
                                  if (!verifyItem.assignment) return;
                                  setVerifying(true);
                                  try {
                                      const token = localStorage.getItem('token');
                                      await fetch(`${API_BASE_URL}/api/lab-assignments/${verifyItem.assignment.id}/confirm`, {
                                          method: 'PUT',
                                          headers: { 'Authorization': `Bearer ${token}` }
                                      });
                                      setSuccessMessage(`✅ "${verifyItem.name}" receipt confirmed! Now available to students.`);
                                      setTimeout(() => setSuccessMessage(''), 5000);
                                      setVerifyItem(null);
                                      fetchEquipment();
                                  } catch (err) { console.error(err); alert('Failed to confirm: ' + err.message); }
                                  finally { setVerifying(false); }
                              }}
                              disabled={!verifyItem.assignment || verifying}
                              className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                          >
                              {verifying ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                              {verifying ? 'Confirming...' : 'Confirm Receipt'}
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Assign to Lab Modal */}
      {assignItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
                  <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                      <div>
                          <h3 className="text-lg font-bold text-[#2c3e50]">Assign to Lab</h3>
                          <p className="text-xs text-gray-400 mt-0.5">Route this asset to a specific laboratory</p>
                      </div>
                      <button onClick={() => { setAssignItem(null); setAssignLab(''); }} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                          <X size={20} />
                      </button>
                  </div>
                  <div className="p-6 space-y-5">
                      {/* Equipment Preview */}
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
                              {assignItem.image ? (
                                  <img src={assignItem.image} className="w-full h-full object-cover" alt="" />
                              ) : (
                                  <Package size={20} className="text-gray-300" />
                              )}
                          </div>
                          <div>
                              <p className="text-sm font-bold text-[#2c3e50]">{assignItem.name}</p>
                              <p className="text-xs text-gray-400">{assignItem.category} • {assignItem.modelNumber || 'No model'}</p>
                          </div>
                      </div>

                      {/* Current Location */}
                      {assignItem.location && assignItem.location !== 'Main Storage' && (
                          <div className="text-xs text-gray-400">
                              Current location: <span className="font-semibold text-gray-600">{assignItem.location}</span>
                          </div>
                      )}

                      {/* Lab Technician Selection */}
                      <div className="space-y-3">
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Assign to Lab Technician</label>
                          {loadingStaff ? (
                              <div className="flex items-center justify-center py-6">
                                  <Loader2 size={20} className="animate-spin text-[#1f4fa3]" />
                                  <span className="ml-2 text-xs text-gray-400">Loading lab staff...</span>
                              </div>
                          ) : labStaff.length === 0 ? (
                              <div className="p-4 bg-yellow-50 text-yellow-700 rounded-xl text-xs border border-yellow-200">
                                  No Lab Technicians found for your department. Ask Admin to create Lab Staff accounts.
                              </div>
                          ) : (
                              <div className="space-y-2 max-h-48 overflow-y-auto">
                                  {labStaff.map(tech => (
                                      <button
                                          key={tech.id}
                                          type="button"
                                          onClick={() => {
                                              setSelectedTechnician(tech);
                                              setAssignLab(`${tech.fullName}'s Lab`);
                                          }}
                                          className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                                              selectedTechnician?.id === tech.id
                                                  ? 'border-[#1f4fa3] bg-blue-50/50 shadow-sm'
                                                  : 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white'
                                          }`}
                                      >
                                          <div className="w-10 h-10 rounded-full bg-[#1f4fa3]/10 flex items-center justify-center overflow-hidden shrink-0">
                                              {tech.avatar ? (
                                                  <img src={tech.avatar} className="w-full h-full object-cover rounded-full" alt="" />
                                              ) : (
                                                  <UserIcon size={18} className="text-[#1f4fa3]" />
                                              )}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                              <p className="text-sm font-bold text-[#2c3e50] truncate">{tech.fullName}</p>
                                              <p className="text-[11px] text-gray-400">{tech.department} Department • {tech.email}</p>
                                          </div>
                                          {selectedTechnician?.id === tech.id && (
                                              <CheckCircle2 size={18} className="text-[#1f4fa3] shrink-0" />
                                          )}
                                      </button>
                                  ))}
                              </div>
                          )}
                      </div>

                      {/* Assignment Details - shown after selecting a technician */}
                      {selectedTechnician && (
                          <div className="space-y-4 border-t border-gray-100 pt-4">
                              <div className="grid grid-cols-2 gap-4">
                                  {/* Quantity */}
                                  <div className="space-y-2">
                                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">
                                          Quantity <span className="text-gray-300 font-normal normal-case">({assignItem._remaining || assignItem.stock} of {assignItem.stock} remaining)</span>
                                      </label>
                                      <input
                                          type="number"
                                          min="1"
                                          max={assignItem._remaining || assignItem.stock || 99}
                                          value={assignQuantity}
                                          onChange={(e) => setAssignQuantity(Math.min(parseInt(e.target.value) || 1, assignItem._remaining || assignItem.stock || 99))}
                                          className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl text-sm text-[#2c3e50] focus:bg-white focus:border-[#1f4fa3] transition-all outline-none"
                                      />
                                  </div>

                                  {/* Lab Location */}
                                  <div className="space-y-2">
                                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Lab / Location</label>
                                      <input
                                          type="text"
                                          value={assignLab}
                                          onChange={(e) => setAssignLab(e.target.value)}
                                          placeholder="e.g. Robotics Lab - Room 204"
                                          className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl text-sm text-[#2c3e50] focus:bg-white focus:border-[#1f4fa3] transition-all outline-none"
                                      />
                                  </div>
                              </div>

                              {/* Notes */}
                              <div className="space-y-2">
                                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Notes (optional)</label>
                                  <textarea
                                      value={assignNotes}
                                      onChange={(e) => setAssignNotes(e.target.value)}
                                      rows="2"
                                      placeholder="e.g. Handle with care, fragile sensors..."
                                      className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl text-sm text-[#2c3e50] focus:bg-white focus:border-[#1f4fa3] transition-all outline-none resize-none"
                                  />
                              </div>

                              {/* Summary */}
                              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-2">
                                  <MapPin size={14} className="text-blue-500 mt-0.5 shrink-0" />
                                  <p className="text-[11px] text-blue-600">
                                      Assigning <strong>{assignQuantity}x {assignItem.name}</strong> to <strong>{selectedTechnician.fullName}</strong> at <strong>{assignLab || '...'}</strong>. 
                                      The technician must confirm receipt before it becomes available to students.
                                  </p>
                              </div>
                          </div>
                      )}
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                      <button
                          onClick={() => { setAssignItem(null); setAssignLab(''); setAssignQuantity(1); setAssignNotes(''); setSelectedTechnician(null); }}
                          className="px-5 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
                      >
                          Cancel
                      </button>
                      <button
                          onClick={handleAssignToLab}
                          disabled={!assignLab.trim() || !selectedTechnician || assigning}
                          className="px-6 py-2.5 bg-[#1f4fa3] text-white text-sm font-bold rounded-xl hover:bg-[#173e82] transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                          {assigning ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
                          {assigning ? 'Assigning...' : `Assign ${assignQuantity} Item${assignQuantity > 1 ? 's' : ''}`}
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Equipment;
