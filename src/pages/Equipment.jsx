import { Search, Plus, Filter, MoreHorizontal, FileText, ChevronDown, Loader2, Package, Edit } from 'lucide-react';
import { useState, useEffect } from 'react';
import API_BASE_URL from '../config/api';
import AddEquipmentModal from '../components/AddEquipmentModal';

import EquipmentDetailsModal from '../components/EquipmentDetailsModal';

const Equipment = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const fetchEquipment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/equipment`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
         throw new Error('Failed to fetch equipment');
      }

      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const handleModalClose = () => {
      setIsModalOpen(false);
      setEditItem(null);
      fetchEquipment(); // Refresh list after adding
  };

  const filteredItems = items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                           item.category.toLowerCase().includes(search.toLowerCase()) ||
                           (item.modelNumber && item.modelNumber.toLowerCase().includes(search.toLowerCase()));
      
      const matchesDept = user?.role === 'Admin' || item.department === user?.department;
      const matchesCategory = selectedCategory === "All Categories" || item.category === selectedCategory;
      
      return matchesSearch && matchesDept && matchesCategory;
  });

  const categories = ["All Categories", ...new Set(items.map(item => item.category).filter(Boolean))];

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
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#2c3e50]">Equipment Inventory</h1>
          <p className="text-sm text-[#6b7280] mt-1">
             {user?.role === 'Admin' ? 'Manage and track all institutional assets.' : `Managing inventory for ${user?.department || 'your department'}.`}
          </p>
        </div>
        <div className="flex gap-3">
           <button className="bg-white border border-gray-200 text-[#6b7280] px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-all">
              <FileText size={16} /> Export
           </button>
           <button 
             onClick={() => {
               setEditItem(null);
               setIsModalOpen(true);
             }}
             className="bg-[#f59e0b] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#d97706] flex items-center gap-2 shadow-sm transition-all"
           >
              <Plus size={16} /> Add Equipment
           </button>
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
                        <div className="text-xs">
                           <span className="font-semibold text-[#2c3e50]">{item.available}</span>
                           <span className="text-[#9ca3af]"> / {item.stock}</span>
                        </div>
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                           <div 
                              className={`h-full rounded-full ${item.available > 0 ? 'bg-[#22c55e]' : 'bg-[#ef4444]'}`} 
                              style={{ width: `${(item.available / item.stock) * 100}%` }}
                           ></div>
                        </div>
                     </td>
                     <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold ${
                           item.status === 'Available' ? 'bg-[#22c55e]/10 text-[#22c55e]' : 
                           item.status === 'In Use' ? 'bg-[#f59e0b]/10 text-[#f59e0b]' : 
                           'bg-[#ef4444]/10 text-[#ef4444]'
                        }`}>
                           <span className={`w-1.5 h-1.5 rounded-full ${
                              item.status === 'Available' ? 'bg-[#22c55e]' : 
                              item.status === 'In Use' ? 'bg-[#f59e0b]' : 
                              'bg-[#ef4444]'
                           }`}></span>
                           {item.status}
                        </span>
                     </td>
                     <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
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
    </div>
  );
};

export default Equipment;
