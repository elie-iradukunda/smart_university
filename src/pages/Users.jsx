import { Search, Plus, Filter, MoreHorizontal, Mail, Shield, UserMinus } from 'lucide-react';
import { useState } from 'react';
import AddUserModal from '../components/AddUserModal';

const Users = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const users = [
    { id: 1, name: 'Alice Johnson', email: 'alice.j@uni.edu', role: 'Student', status: 'Active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
    { id: 2, name: 'Dr. Robert Smith', email: 'r.smith@uni.edu', role: 'Lecturer', status: 'Active', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
    { id: 3, name: 'Mark Wilson', email: 'm.wilson@uni.edu', role: 'Admin', status: 'Offline', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#2c3e50]">Users Management</h1>
          <p className="text-sm text-[#6b7280] mt-1">Manage system access and roles.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#1f4fa3] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#173e82] flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus size={16} /> Add User
        </button>
      </div>

      <AddUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
         <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1f4fa3]/20 text-sm text-[#2c3e50] placeholder:text-[#9ca3af]"
            />
         </div>
         
         <div className="relative group w-full md:w-48">
            <select className="w-full appearance-none bg-white border border-gray-200 text-[#6b7280] py-2 pl-4 pr-10 rounded-md text-sm font-medium focus:outline-none focus:border-[#1f4fa3] cursor-pointer hover:bg-gray-50">
               <option>All Roles</option>
               <option>Student</option>
               <option>Lecturer</option>
               <option>Admin</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
         </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#2c3e50]">
            <thead className="bg-[#f9fafb] border-b border-gray-200">
               <tr>
                  <th className="px-6 py-3 font-semibold text-[#6b7280] uppercase text-xs tracking-wider">User</th>
                  <th className="px-6 py-3 font-semibold text-[#6b7280] uppercase text-xs tracking-wider">Role</th>
                  <th className="px-6 py-3 font-semibold text-[#6b7280] uppercase text-xs tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right font-semibold text-[#6b7280] uppercase text-xs tracking-wider">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                       <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 shrink-0">
                          <img src={user.avatar} className="w-full h-full object-cover" />
                       </div>
                       <div>
                          <p className="font-semibold text-[#2c3e50]">{user.name}</p>
                          <p className="text-xs text-[#9ca3af] mt-0.5">{user.email}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'Admin' ? 'bg-purple-50 text-purple-700' : 
                        user.role === 'Lecturer' ? 'bg-blue-50 text-blue-700' : 
                        'bg-gray-100 text-gray-700'
                     }`}>
                        {user.role}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'Active' ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'bg-gray-100 text-[#9ca3af]'
                    }`}>
                       <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-[#22c55e]' : 'bg-gray-400'}`}></span>
                       {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-1.5 hover:bg-gray-100 rounded text-[#9ca3af] hover:text-[#1f4fa3] transition-colors"><Mail size={16} /></button>
                       <button className="p-1.5 hover:bg-gray-100 rounded text-[#9ca3af] hover:text-[#1f4fa3] transition-colors"><Shield size={16} /></button>
                       <button className="p-1.5 hover:bg-[#ef4444]/10 rounded text-[#9ca3af] hover:text-[#ef4444] transition-colors"><UserMinus size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
