import { Search, Plus, Filter, Mail, Shield, UserMinus, Loader2, User as UserIcon, Trash2, Edit2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import AddUserModal from '../components/AddUserModal';
import API_BASE_URL from '../config/api';

const Users = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [deletingId, setDeletingId] = useState(null);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
         throw new Error('Failed to fetch users');
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
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (user) => {
    if (user.status === 'Inactive') {
        alert('This user is already inactive.');
        return;
    }

    if (!window.confirm(`Are you sure you want to deactivate ${user.fullName}? They will no longer be able to log in.`)) return;
    
    setDeletingId(user.id);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/users/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to deactivate user');
      }

      // Refresh list to show updated status
      fetchUsers();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredItems = items.filter(user => {
      const matchesSearch = user.fullName.toLowerCase().includes(search.toLowerCase()) || 
                           user.email.toLowerCase().includes(search.toLowerCase()) ||
                           (user.studentId && user.studentId.toLowerCase().includes(search.toLowerCase()));
      
      const matchesRole = selectedRole === "All Roles" || user.role === selectedRole;
      
      return matchesSearch && matchesRole;
  });

  if (loading) return (
     <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-[#1f4fa3]" size={32} />
     </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#2c3e50]">Users Management</h1>
          <p className="text-sm text-[#6b7280] mt-1">Manage system access and roles.</p>
        </div>
        <button 
          onClick={() => {
            setEditUser(null);
            setIsModalOpen(true);
          }}
          className="bg-[#1f4fa3] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#173e82] flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus size={16} /> Add User
        </button>
      </div>

      <AddUserModal 
        isOpen={isModalOpen} 
        editData={editUser}
        onClose={(refresh) => {
          setIsModalOpen(false);
          setEditUser(null);
          if (refresh) fetchUsers();
        }} 
      />

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
         <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1f4fa3]/20 text-sm text-[#2c3e50] placeholder:text-[#9ca3af]"
            />
         </div>
         
         <div className="relative group w-full md:w-48">
            <select 
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 text-[#6b7280] py-2 pl-4 pr-10 rounded-md text-sm font-medium focus:outline-none focus:border-[#1f4fa3] cursor-pointer hover:bg-gray-50"
            >
               <option>All Roles</option>
               <option>Student</option>
               <option>Lecturer</option>
               <option>Admin</option>
               <option>HOD</option>
               <option>Lab Staff</option>
               <option>StockManager</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
         </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 text-sm">
           {error}
        </div>
      )}

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
              {filteredItems.map(user => (
                <tr key={user.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                       <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 shrink-0 bg-gray-50 flex items-center justify-center">
                          {user.avatar ? (
                            <img src={user.avatar} className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon size={18} className="text-gray-300" />
                          )}
                       </div>
                       <div>
                          <p className="font-semibold text-[#2c3e50]">{user.fullName}</p>
                          <p className="text-xs text-[#9ca3af] mt-0.5">{user.email}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'Admin' ? 'bg-purple-50 text-purple-700' : 
                        user.role === 'HOD' ? 'bg-amber-50 text-amber-700' :
                        user.role === 'Lecturer' ? 'bg-blue-50 text-blue-700' : 
                        'bg-gray-100 text-gray-700'
                     }`}>
                        {user.role}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'Active' 
                        ? 'bg-green-50 text-green-700' 
                        : user.status === 'Inactive' 
                        ? 'bg-red-50 text-red-700' 
                        : 'bg-gray-50 text-gray-700'
                    }`}>
                       <span className={`w-1.5 h-1.5 rounded-full ${
                         user.status === 'Active' ? 'bg-green-500' : 
                         user.status === 'Inactive' ? 'bg-red-500' : 
                         'bg-gray-400'
                       }`}></span>
                       {user.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button 
                         title="Edit User" 
                         onClick={() => handleEdit(user)}
                         className="p-1.5 hover:bg-gray-100 rounded text-[#9ca3af] hover:text-[#1f4fa3] transition-colors"
                       >
                          <Edit2 size={16} />
                       </button>
                       <button title="Email User" className="p-1.5 hover:bg-gray-100 rounded text-[#9ca3af] hover:text-[#1f4fa3] transition-colors"><Mail size={16} /></button>
                       <button title="Edit Permissions" className="p-1.5 hover:bg-gray-100 rounded text-[#9ca3af] hover:text-[#1f4fa3] transition-colors"><Shield size={16} /></button>
                       <button 
                         title="Deactivate User"
                         disabled={deletingId === user.id}
                         onClick={() => handleDeleteUser(user)}
                         className={`p-1.5 rounded transition-colors ${
                            user.status === 'Inactive' 
                              ? 'text-gray-200 cursor-not-allowed' 
                              : 'hover:bg-red-50 text-[#9ca3af] hover:text-red-600'
                         }`}
                       >
                          {deletingId === user.id ? <Loader2 size={16} className="animate-spin" /> : <UserMinus size={16} />}
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredItems.length === 0 && (
            <div className="py-20 text-center">
              <UserIcon size={48} className="mx-auto text-gray-100 mb-3" />
              <p className="text-gray-400 text-sm font-medium">No users found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
