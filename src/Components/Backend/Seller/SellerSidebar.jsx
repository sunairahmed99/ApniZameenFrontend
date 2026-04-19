import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FaChartLine,
  FaStore,
  FaBoxOpen,
  FaShoppingCart,
  FaCog,
  FaUser,
  FaPlus,
  FaBullhorn,
  FaComments,
  FaClock,
  FaUserShield,
  FaEnvelope,
  FaCheckCircle,
  FaTrophy,
  FaBuilding,
  FaHistory
} from 'react-icons/fa';
import './SellerSidebar.css';

const SellerSidebar = ({ isOpen, closeSidebar }) => {
  const { user } = useSelector((state) => state.auth);

  const handleLinkClick = () => {
    if (window.innerWidth <= 768 && closeSidebar) {
      closeSidebar();
    }
  };

  const menuItems = [
    { path: '/seller/dashboard', name: 'Seller Dashboard', icon: <FaChartLine /> },
    { path: '/seller/banner-request', name: 'Banner Request', icon: <FaBullhorn /> },
    { path: '/seller/agency', name: 'My Agency', icon: <FaStore /> },
    { path: '/seller/agency-upgrade', name: 'Promote Agency', icon: <FaBullhorn /> },
    { path: '/seller/my-properties', name: 'My Properties', icon: <FaStore /> },
    { path: '/seller/add-property', name: 'Add Property', icon: <FaPlus /> },
    { path: '/seller/sold-rented-properties', name: 'Sold/Rented Properties', icon: <FaCheckCircle /> }, // New
    { path: '/seller/expired-properties', name: 'Expired Properties', icon: <FaClock /> },
    { path: '/seller/packages', name: 'Buy Property Package', icon: <FaBoxOpen /> },
    { path: '/seller/my-subscriptions', name: 'Property Package History', icon: <FaHistory /> },
    { path: '/seller/scoreboard', name: 'Scoreboard', icon: <FaTrophy /> }, // New
    { path: '/seller/inquiries', name: 'Inquiries', icon: <FaEnvelope /> }, // New
    { path: '/seller/project-requests', name: 'Project Requests', icon: <FaBuilding /> }, // New
    { path: '/seller/chat', name: 'Chat', icon: <FaComments /> },
    { path: '/seller/chat?admin=true', name: 'Chat with Admin', icon: <FaUserShield /> },
  ];

  return (
    <div className={`seller-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h3 className="logo-text">{isOpen ? (user ? user.name : 'Seller Panel') : 'SP'}</h3>
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
            <div className="link-text" style={{ display: isOpen ? 'block' : 'none' }}>{item.name}</div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default SellerSidebar;

