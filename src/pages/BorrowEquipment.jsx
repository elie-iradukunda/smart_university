import { Search, Calendar, ArrowRight, ShieldCheck, Filter, ChevronDown, Package, Loader2, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import API_BASE_URL from '../config/api';
import EquipmentDetailsModal from '../components/EquipmentDetailsModal';

const BorrowEquipment = () => {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");

  useEffect(() => {
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
        setItems(data.equipment || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                         item.category.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDepartment === "All Departments" || item.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  const departments = ["All Departments", ...new Set(items.map(item => item.department).filter(Boolean))];

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
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#2c3e50]">Borrow Equipment</h1>
          <p className="text-sm text-[#6b7280] mt-1">Request ephemeral access to laboratory assets.</p>
        </div>
        <button className="bg-[#1f4fa3] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#173e82] flex items-center gap-2 shadow-sm transition-all">
          <Calendar size={16} /> My Schedule
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
         <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search assets..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1f4fa3]/20 text-sm text-[#2c3e50] placeholder:text-[#9ca3af]"
            />
         </div>
         
         <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
            <div className="relative shrink-0">
               <select 
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="appearance-none pl-8 pr-10 py-2 bg-white border border-gray-200 text-[#2c3e50] rounded-md text-xs font-medium focus:outline-none focus:border-[#1f4fa3] cursor-pointer hover:bg-gray-50 transition-colors"
               >
                  {departments.map(dept => (
                     <option key={dept} value={dept}>{dept}</option>
                  ))}
               </select>
               <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
               <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
            </div>

            <button className="whitespace-nowrap px-3 py-1.5 bg-gray-100 text-[#6b7280] rounded-md text-xs font-medium hover:bg-gray-200 transition-colors flex items-center gap-1">
               <Package size={14} /> Categories <ChevronDown size={12} />
            </button>
            <button className="whitespace-nowrap px-3 py-1.5 bg-white border border-gray-200 text-[#2c3e50] rounded-md text-xs font-medium hover:bg-gray-50 transition-colors">
               Available Only
            </button>
         </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map(item => (
          <div 
             key={item.id} 
             onClick={() => setSelectedItem(item)}
             className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col h-full group cursor-pointer"
          >
            
            {/* Image */}
            <div className="h-40 relative overflow-hidden bg-gray-50 border-b border-gray-50 flex items-center justify-center">
              {item.image ? (
                 <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                 <Package className="text-gray-300 w-12 h-12" />
              )}
              
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 rounded-md text-xs font-semibold shadow-sm border ${
                  item.status === 'Available'
                    ? 'bg-[#22c55e] text-white border-[#22c55e]' 
                    : 'bg-white/90 text-[#9ca3af] border-gray-200 backdrop-blur-sm'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col">
              <div className="mb-3">
                 <span className="text-xs font-medium text-[#1f4fa3] bg-[#1f4fa3]/5 px-2 py-0.5 rounded-sm inline-block mb-2">
                    {item.category}
                 </span>
                 <h4 className="text-sm font-bold text-[#2c3e50] leading-tight mb-1 truncate">{item.name}</h4>
                 <p className="text-xs text-[#9ca3af] flex items-center gap-1 truncate">
                    <Package size={12} /> {item.department || item.location || 'Main Storage'}
                 </p>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-4 border-t border-gray-50 pt-3 mt-auto">
                <div>
                   <p className="text-[10px] text-[#9ca3af] font-medium uppercase tracking-wider">Limit</p>
                   <p className="text-xs font-semibold text-[#2c3e50] flex items-center gap-1">
                      <Calendar size={12} className="text-gray-400" /> {item.allowOvernight ? 'Overnight' : 'Same Day'}
                   </p>
                </div>
                <div>
                   <p className="text-[10px] text-[#9ca3af] font-medium uppercase tracking-wider">Req.</p>
                   <p className="text-xs font-semibold text-[#2c3e50] flex items-center gap-1">
                      <ShieldCheck size={12} className="text-gray-400" /> Standard
                   </p>
                </div>
              </div>

              <button 
                className={`w-full py-2.5 rounded-md text-xs font-bold flex items-center justify-center gap-2 transition-all group-hover:bg-[#1f4fa3] group-hover:text-white ${
                  item.status === 'Available'
                    ? 'bg-gray-50 text-[#2c3e50]' 
                    : 'bg-gray-50 text-gray-400'
                }`}
              >
                {item.status === 'Available' ? 'Details & Request' : 'See Details'} 
                <Info size={14} />
              </button>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
           <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-lg border border-dashed border-gray-200">
              <Package size={48} className="mx-auto mb-3 opacity-20" />
              <p>No equipment found matching your search.</p>
           </div>
        )}
      </div>

      {/* Details Modal */}
      <EquipmentDetailsModal 
         isOpen={!!selectedItem}
         onClose={() => setSelectedItem(null)}
         equipment={selectedItem}
      />
    </div>
  );
};

export default BorrowEquipment;
