import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import AdminSidebar from './AdminSidebar';
import './AdminLayout.css';
import { FaBars, FaSearch, FaBell, FaGlobe, FaSignOutAlt, FaUserShield } from 'react-icons/fa';
import { logout, reset } from '../../../features/auth/authSlice';
import '../Seller/SellerCommon.css'; // Reuse global dark variables

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Auto-close sidebar on mobile on initial load
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  return (
    <div className="admin-container">
      {/* Overlay for mobile */}
      {isSidebarOpen && window.innerWidth <= 768 && (
        <div
          className="sidebar-overlay show"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className={`admin-main-content ${isSidebarOpen ? '' : 'expanded'}`}>
        <div className="admin-header">
          <div className="header-left">
            <button className="btn-sidebar-toggle d-md-none" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <FaBars />
            </button>
            <div className="header-search-container d-none d-md-flex">
              <FaSearch className="search-icon" />
              <input type="text" placeholder="Search admin panels..." className="header-search-input" />
              <div className="ai-assistant-badge">
                <FaUserShield className="me-1" /> Admin Panel
              </div>
            </div>
          </div>

          <div className="header-right">
            <div className="header-notification-icon d-none d-sm-flex">
              <FaBell />
              <span className="notification-dot"></span>
            </div>
            <div className="header-user-profile" onClick={() => navigate('/')}>
              <div className="user-avatar-small admin-avatar">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="user-info-text d-none d-lg-block">
                <div className="user-name">{user?.name || 'Administrator'}</div>
                <div className="user-status text-primary-mint">Super Admin</div>
              </div>
            </div>
            <button className="btn-logout-minimal" onClick={onLogout} title="Logout">
              <FaSignOutAlt />
            </button>
          </div>
        </div>
        <div className="admin-content-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

