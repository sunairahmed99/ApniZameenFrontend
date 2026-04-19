import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import SellerSidebar from './SellerSidebar';
import './SellerLayout.css';
import './SellerCommon.css';
import { useState, useEffect } from 'react';
import { FaBars, FaSearch, FaBell, FaGlobe, FaSignOutAlt } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../../../features/auth/authSlice';

const SellerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/seller/my-properties?search=${encodeURIComponent(searchTerm)}`);
    }
  };

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

    <div className="seller-container">
      {/* Overlay for mobile */}
      {isSidebarOpen && window.innerWidth <= 768 && (
        <div
          className="sidebar-overlay show"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <SellerSidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />

      <div className={`seller-main-content ${isSidebarOpen ? '' : 'expanded'}`}>
        <div className="seller-header">
          <div className="header-left">
            <button className="btn-sidebar-toggle d-md-none" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <FaBars />
            </button>
            <div className="header-search-container d-none d-md-flex">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search properties..."
                className="header-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
              />
              <div className="ai-assistant-badge">
                <FaGlobe className="me-1" /> AI Assistant
              </div>
            </div>
          </div>

          <div className="header-right">

            <div className="header-user-profile" onClick={() => navigate('/')}>
              <div className="user-avatar-small">
                {user?.name?.charAt(0) || 'S'}
              </div>
              <div className="user-info-text d-none d-lg-block">
                <div className="user-name">{user?.name || 'Seller'}</div>
                <div className="user-status">Online</div>
              </div>
            </div>
            <button className="btn-logout-minimal" onClick={onLogout} title="Logout">
              <FaSignOutAlt />
            </button>
          </div>
        </div>
        <div className="seller-content-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SellerLayout;

