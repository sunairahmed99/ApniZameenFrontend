import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaChartLine,
  FaImages,
  FaBullhorn,
  FaTags,
  FaBriefcase,
  FaCrown,
  FaArrowUp,
  FaBuilding,
  FaMoneyBillWave,
  FaCheck,
  FaRocket,
  FaMapMarkerAlt,
  FaEnvelope,
  FaCity,
  FaCog,
  FaList,
  FaComments
} from 'react-icons/fa';
import './AdminSidebar.css';

const AdminSidebar = ({ isOpen, onClose }) => {

  const handleLinkClick = () => {
    if (window.innerWidth <= 768 && onClose) {
      onClose();
    }
  };

  const menuItems = [
    { path: '/admin/dashboard', name: 'Dashboard', icon: <FaChartLine /> },
    { path: '/admin/home-banner', name: 'Banners', icon: <FaImages /> },
    { path: '/admin/browse-sections', name: 'Browse Sections', icon: <FaList /> },
    { path: '/admin/banner-requests', name: 'Banner Requests', icon: <FaBullhorn /> },
    { path: '/admin/banner-plans', name: 'Banner Plans', icon: <FaTags /> },

    { path: '/admin/agencies', name: 'Agencies', icon: <FaBriefcase /> },
    { path: '/admin/agency-plans', name: 'Agency Plans', icon: <FaCrown /> },
    { path: '/admin/agency-upgrades', name: 'Upgrade Requests', icon: <FaArrowUp /> },

    { path: '/admin/properties', name: 'Properties', icon: <FaBuilding /> },
    { path: '/admin/deals', name: 'Manage Deals', icon: <FaTags /> },
    { path: '/admin/approvals', name: 'Deals Approval', icon: <FaMoneyBillWave /> },
    { path: '/admin/pending-payments', name: 'Pending Payments', icon: <FaMoneyBillWave /> },
    { path: '/admin/approved-deals', name: 'Approve Deal', icon: <FaCheck /> },

    { path: '/admin/projects', name: 'Projects', icon: <FaCity /> },
    { path: '/admin/project-plans', name: 'Project Plans', icon: <FaTags /> },
    { path: '/admin/locations', name: 'Locations', icon: <FaMapMarkerAlt /> },
    { path: '/admin/inquiries', name: 'Inquiries', icon: <FaEnvelope /> },
    { path: '/admin/pricelisting', name: 'Price Listing', icon: <FaMoneyBillWave /> },
    { path: '/admin/payment-prices', name: 'Payment Prices', icon: <FaMoneyBillWave /> },
    { path: '/admin/chat', name: 'Chat', icon: <FaComments /> },
    { path: '/admin/blogs', name: 'Blogs', icon: <FaList /> },
    { path: '/admin/jobs', name: 'BiG Jobs', icon: <FaBriefcase /> },
    { path: '/admin/settings', name: 'Settings', icon: <FaCog /> },
  ];

  return (
    <div className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h3 className="logo-text">{isOpen ? 'Admin Panel' : 'AP'}</h3>
      </div>
      <div className="sidebar-menu">
        {menuItems.map((item, index) => (
          <NavLink
            to={item.path}
            key={index}
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            <div className="icon">{item.icon}</div>
            {isOpen && <div className="link-text">{item.name}</div>}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;
