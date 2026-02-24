import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Laptop, Database, Cpu, Wifi, BookOpen, Clock, CalendarCheck, CheckCircle2, Box } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
import RequestFormModal from '../../components/RequestFormModal';
import EquipmentDetailsModal from '../../components/EquipmentDetailsModal';

const ResourcesStore = ({ isPublic = false }) => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/incubation/assets`);
      setResources(res.data);
    } catch (err) {
      console.error('Error fetching assets');
    } finally {
      setLoading(false);
    }
  };

  const iconsMap = { Laptop, Database, Cpu, Wifi, BookOpen, Clock, CalendarCheck, CheckCircle2, Box };


  const handleBook = (resource) => {
    if (isPublic) {
      navigate('/login');
      return;
    }
    setSelectedAsset(resource);
    setRequestModalOpen(true);
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-800 to-indigo-900 rounded-2xl p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
         <div className="absolute right-0 top-0 opacity-10 blur-sm mix-blend-overlay">
            <Cpu size={250} />
         </div>
         <div className="relative z-10 text-white">
            <h2 className="text-3xl font-extrabold mb-2 tracking-tight">Incubation Store & Resources</h2>
            <p className="text-slate-300 max-w-xl text-lg leading-relaxed">
              Book workspaces, request high-end equipment, and access premium software credits to build your startup faster.
            </p>
         </div>
         <div className="relative z-10 shrink-0 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center text-white">
            <div className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-1">
              {isPublic ? 'Access Policy' : 'Your Lab Access'}
            </div>
            <div className="text-2xl font-black flex items-center justify-center gap-2">
              {isPublic ? (
                <span className="text-amber-400 text-lg uppercase tracking-wider">Verification Required</span>
              ) : (
                <>
                  <CheckCircle2 size={24} className="text-emerald-400" /> Active
                </>
              )}
            </div>
         </div>
      </div>

      {/* Grid of resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
           <p className="col-span-full py-20 text-center text-slate-400 font-bold animate-pulse">Scanning Hub Inventory...</p>
        ) : resources.length === 0 ? (
           <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
              <Box size={40} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-semibold italic-none">No assets currently listed in the store.</p>
           </div>
        ) : resources.map((resource) => {
           const IconComponent = iconsMap[resource.icon] || Box;
           return (
            <div key={resource.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all flex flex-col items-start gap-4 hover:-translate-y-1">
              
              {/* Header section with Icon & Status */}
              <div className="flex w-full justify-between items-start">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border ${resource.status === 'Available' ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                   <IconComponent size={28} />
                </div>
                <span className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded-lg border flex items-center gap-1.5 ${resource.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                  {resource.status === 'Available' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                  {resource.status}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 w-full">
                <div className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-1 italic-none">{resource.category}</div>
                <h3 className="text-lg font-bold text-slate-800 leading-tight mb-2 italic-none">{resource.name}</h3>
                
                {resource.image && (
                   <img src={resource.image} alt={resource.name} className="w-full h-32 object-cover rounded-xl mb-3 border border-slate-100 shadow-sm" />
                )}

                <p className="text-sm text-slate-500 line-clamp-2 italic-none mb-3">{resource.description}</p>
                
                {(resource.modelNumber || resource.serialNumber) && (
                   <div className="flex flex-wrap gap-2 mb-1">
                      {resource.modelNumber && <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase tracking-tighter">Mod: {resource.modelNumber}</span>}
                      {resource.serialNumber && <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase tracking-tighter">S/N: {resource.serialNumber}</span>}
                   </div>
                )}
              </div>

               {/* Footer Button */}
               <div className="mt-auto w-full pt-4 border-t border-slate-100 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-2.5 py-1 bg-slate-100 rounded-md border border-slate-200 italic-none">{resource.type}</span>
                     <button 
                       onClick={() => {
                         setSelectedAsset(resource);
                         setDetailsModalOpen(true);
                       }}
                       className="text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                     >
                       View Details
                     </button>
                  </div>
                  
                  {resource.status === 'Available' ? (
                    <button 
                      onClick={() => handleBook(resource)}
                      disabled={booking?.id === resource.id}
                      className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow hover:shadow-md disabled:bg-blue-400 italic-none"
                    >
                       {booking?.id === resource.id ? (
                         <span className="animate-pulse">Processing...</span>
                       ) : (
                         <>
                           <CalendarCheck size={16} /> {isPublic ? 'Login to Request' : 'Request'}
                         </>
                       )}
                    </button>
                  ) : (
                    <button disabled className="w-full px-6 py-2.5 bg-slate-100 text-slate-400 rounded-xl font-semibold cursor-not-allowed italic-none">
                       In Use
                    </button>
                  )}
               </div>

            </div>
           );
        })}
      </div>
      
      {requestModalOpen && (
        <RequestFormModal 
          isOpen={requestModalOpen} 
          onClose={() => setRequestModalOpen(false)} 
          item={selectedAsset} 
          type="incubation" 
        />
      )}
      {detailsModalOpen && (
        <EquipmentDetailsModal 
          isOpen={detailsModalOpen} 
          onClose={() => setDetailsModalOpen(false)} 
          equipment={selectedAsset} 
          readOnly={true} 
        />
      )}
    </div>
  );
};

export default ResourcesStore;
