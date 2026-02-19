import { useRef, useLayoutEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Equipment from './pages/Equipment';
import BorrowEquipment from './pages/BorrowEquipment';
import MyItems from './pages/MyItems';
import Reservations from './pages/Reservations';
import LearningCenter from './pages/LearningCenter';
import Reports from './pages/Reports';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Home from './pages/Home';

// Mock Auth - In a real app this would come from a Context/Store
const getUserRole = () => {
    // Default to a student role if nothing is set for demo purposes
    // In production, this would be null if not logged in
    return localStorage.getItem('userRole') || 'Student'; 
};

const ProtectedRoute = ({ children, allowedRoles }) => {
    const role = getUserRole();
    
    // Normalize role comparison (e.g. handle 'Staff' vs 'staff')
    const normalizedRole = role.toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());

    if (!normalizedAllowedRoles.includes(normalizedRole)) {
        return <Navigate to="/dashboard" replace />;
    }
    
    return children;
};

const ScrollToTop = ({ children }) => {
  const location = useLocation();
  const locationRef = useRef(location.pathname);
  
  useLayoutEffect(() => {
    if (locationRef.current !== location.pathname) {
      document.documentElement.scrollTo({ top: 0, left: 0, behavior: "instant" });
      locationRef.current = location.pathname;
    }
  }, [location.pathname]);

  return children;
};

function App() {
  return (
    <Router>
      <ScrollToTop>
         <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected Dashboard Routes */}
            <Route path="/" element={<MainLayout />}>
               {/* Accessible by All */}
               <Route path="dashboard" element={<Dashboard />} />
               <Route path="learning" element={<LearningCenter />} />
               <Route path="my-items" element={<MyItems />} />
               <Route path="settings" element={<Settings />} />

               {/* Role Based Access Control */}
               
               {/* Equipment Management: Only for staff/admins managing inventory */}
               <Route path="equipment" element={
                   <ProtectedRoute allowedRoles={['Admin', 'HOD', 'StockManager', 'Appointed Staff', 'Lab Staff']}>
                       <Equipment />
                   </ProtectedRoute>
               } />
               
               {/* Borrowing: Students and Lecturers borrow items */}
               <Route path="borrow" element={
                   <ProtectedRoute allowedRoles={['Student', 'Lecturer', 'Admin', 'Staff']}>
                       <BorrowEquipment />
                   </ProtectedRoute>
               } />
               
               {/* Reservations: Managing incoming requests */}
               <Route path="reservations" element={
                   <ProtectedRoute allowedRoles={['Admin', 'HOD', 'StockManager', 'Lab Staff']}>
                       <Reservations />
                   </ProtectedRoute>
               } />
               
               {/* Reports: Analytics for higher ups */}
               <Route path="reports" element={
                   <ProtectedRoute allowedRoles={['Admin', 'HOD']}>
                       <Reports />
                   </ProtectedRoute>
               } />
               
               {/* User Management */}
               <Route path="users" element={
                   <ProtectedRoute allowedRoles={['Admin', 'HOD']}>
                       <Users />
                   </ProtectedRoute>
               } />
            </Route>
            
            <Route path="*" element={<div className="p-8 text-center text-slate-500 font-bold uppercase tracking-widest italic pt-20">Page Not Found</div>} />
         </Routes>
      </ScrollToTop>
    </Router>
  );
}

export default App;
