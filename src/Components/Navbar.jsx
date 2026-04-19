import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import { FaHome, FaUser, FaSearch, FaChevronUp, FaChevronDown, FaTimes } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import AuthModal from './AuthModal/AuthModal';
import EditProfileModal from './AuthModal/EditProfileModal';
import ChangePasswordModal from './AuthModal/ChangePasswordModal';

const Navbar = ({ currentCategory, setCurrentCategory, listingType, setListingType }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isSellerMenuOpen, setIsSellerMenuOpen] = useState(false);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

    // Ref for seller menu to detect outside clicks
    const sellerMenuRef = useRef(null);

    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    // Effect to handle clicks outside of the user menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sellerMenuRef.current && !sellerMenuRef.current.contains(event.target)) {
                setIsSellerMenuOpen(false);
            }
        };

        if (isSellerMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSellerMenuOpen]);

    // Normalization for Listing Type
    const normalizedType = useMemo(() => {
        if (!listingType) return null;
        const t = listingType.toUpperCase();
        if (t === 'BUY' || t === 'FOR SALE' || t === 'SALE') return 'BUY';
        if (t === 'RENT' || t === 'FOR RENT') return 'RENT';
        return t;
    }, [listingType]);

    // Normalization for Category
    const normalizedCategory = useMemo(() => {
        if (!currentCategory) return null;
        return currentCategory.toUpperCase();
    }, [currentCategory]);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        setIsSellerMenuOpen(false);
        navigate('/');
    };

    const handleListingTypeChange = (type) => {
        if (setListingType) {
            setListingType(type);
            // If switching to RENT and current category is PLOTS, switch to HOMES
            if (type === 'RENT' && currentCategory === 'PLOTS' && setCurrentCategory) {
                setCurrentCategory('HOMES');
            }
        }
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleNavigation = (category, type) => {
        if (location.pathname === '/') {
            // On Homepage, use props to update state
            if (category && setCurrentCategory) setCurrentCategory(category);
            if (type) handleListingTypeChange(type);
        } else {
            // Not on Homepage, navigate to it with state
            navigate('/', { state: { category, type } });
        }
    };

    const navItems = [
        { label: 'BUY', path: '/search?purpose=For Sale', active: location.pathname === '/search' && normalizedType === 'BUY' && !normalizedCategory },
        { label: 'HOMES', path: '/', category: 'HOMES', active: location.pathname === '/search' && normalizedCategory === 'HOMES' && normalizedType === 'BUY' },
        { label: 'PLOTS', path: '/', category: 'PLOTS', active: location.pathname === '/search' && normalizedCategory === 'PLOTS' && normalizedType === 'BUY' },
        { label: 'COMMERCIAL', path: '/', category: 'COMMERCIAL', active: location.pathname === '/search' && normalizedCategory === 'COMMERCIAL' && normalizedType === 'BUY' },
        { label: 'RENT', path: '/', type: 'RENT', active: location.pathname === '/search' && normalizedType === 'RENT' },
        { label: 'AGENTS', path: '/agents', active: location.pathname === '/agents' },
        { label: 'NEW PROJECTS', path: '/new-projects', active: location.pathname === '/new-projects' },
        { label: 'BLOG', path: '/blog', active: location.pathname === '/blog' },
        { label: 'ADVERTISE', path: '/advertise', active: location.pathname === '/advertise' },
        { label: 'JOBS', path: '/jobs', active: location.pathname === '/jobs' },
        { label: 'SUPPORT', path: '/support', active: location.pathname === '/support' },
        ...(user && user.role === 'admin' ? [{ label: 'ADMIN PANEL', path: '/admin', active: location.pathname.startsWith('/admin') }] : []),
        ...(user ? [{ label: 'SELLER PANEL', path: '/seller', active: location.pathname.startsWith('/seller') }] : [])
    ];

    return (
        <div className="header-wrapper font-sans">
            {/* Sidebar Overlay */}
            {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

            {/* Custom Mobile Sidebar */}
            <div className={`mobile-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <button className="btn-login-sidebar" onClick={() => { setIsAuthModalOpen(true); setIsSidebarOpen(false); }}>LOGIN</button>
                </div>

                <div className="sidebar-content">
                    {navItems.map((item, index) => (
                        <div
                            key={index}
                            className={`sidebar-nav-item ${item.active ? 'active' : ''}`}
                            onClick={() => {
                                if (item.category || item.type) {
                                    handleNavigation(item.category, item.type);
                                } else {
                                    navigate(item.path);
                                }
                                setIsSidebarOpen(false);
                            }}
                        >
                            {item.label}
                        </div>
                    ))}
                </div>
            </div>



            {/* Auth Modal */}
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
            <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} />
            <ChangePasswordModal isOpen={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)} />

            {/* Main Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom py-2 sticky-top">
                <div className="container-fluid px-4">
                    <Link className="navbar-brand d-flex align-items-center me-4" to="/">
                        <div className="logo-text">
                            <span className="z-icon">A</span>
                            <div className="logo-name">
                                <span className="zameen">apnizameen.pk</span>
                                <span className="tagline">Apni Zameen, Apna Bharosa</span>
                            </div>
                        </div>
                    </Link>

                    <button className="navbar-toggler" type="button" onClick={toggleSidebar}>
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="mainNav">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-lg-center">
                            <li className={`nav-item main-link ${location.pathname.startsWith('/search') && normalizedType === 'BUY' ? 'active' : ''}`}>
                                <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); navigate('/search?purpose=For Sale'); }}>BUY</a>
                            </li>
                            <li className={`nav-item main-link ${location.pathname.startsWith('/search') && normalizedCategory === 'HOMES' && normalizedType === 'BUY' ? 'active' : ''}`}>
                                <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); navigate('/search?purpose=For Sale&category=HOMES'); }}>HOMES</a>
                            </li>
                            <li className={`nav-item main-link ${location.pathname.startsWith('/search') && normalizedCategory === 'PLOTS' && normalizedType === 'BUY' ? 'active' : ''}`}>
                                <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); navigate('/search?purpose=For Sale&category=PLOTS'); }}>PLOTS</a>
                            </li>
                            <li className={`nav-item main-link ${location.pathname.startsWith('/search') && normalizedCategory === 'COMMERCIAL' && normalizedType === 'BUY' ? 'active' : ''}`}>
                                <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); navigate('/search?purpose=For Sale&category=COMMERCIAL'); }}>COMMERCIAL</a>
                            </li>
                            <li className={`nav-item main-link divider-left ${location.pathname.startsWith('/search') && normalizedType === 'RENT' ? 'active' : ''}`}>
                                <a className="nav-link" href="#" onClick={(e) => { e.preventDefault(); navigate('/search?purpose=For Rent'); }}>RENT</a>
                            </li>
                            <li className={`nav-item main-link divider-left ${location.pathname === '/agents' ? 'active' : ''}`}>
                                <Link className="nav-link" to="/agents">AGENTS</Link>
                            </li>
                            <li className={`nav-item main-link divider-left ${location.pathname.startsWith('/new-projects') ? 'active' : ''}`}>
                                <Link className="nav-link" to="/new-projects">NEW PROJECTS</Link>
                            </li>
                            <li className={`nav-item main-link divider-left ${location.pathname === '/blog' ? 'active' : ''}`}>
                                <Link className="nav-link" to="/blog">BLOG</Link>
                            </li>
                            <li className={`nav-item main-link divider-left ${location.pathname === '/advertise' ? 'active' : ''}`}>
                                <Link className="nav-link" to="/advertise">ADVERTISE</Link>
                            </li>
                            <li className={`nav-item main-link divider-left ${location.pathname === '/jobs' ? 'active' : ''}`}>
                                <Link className="nav-link" to="/jobs">JOBS</Link>
                            </li>
                            <li className={`nav-item main-link divider-left ${location.pathname === '/support' ? 'active' : ''}`}>
                                <Link className="nav-link" to="/support">SUPPORT</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Desktop Right Actions relocated from Green Top Bar */}
                    <div className="navbar-right-actions d-none d-lg-flex align-items-center">
                        {user && (
                            <>
                                {user.role === 'admin' && (
                                    <div className="nav-item main-link divider-left me-2">
                                        <Link className="nav-link" to="/admin">ADMIN PANEL</Link>
                                    </div>
                                )}
                                <div className="nav-item main-link divider-left me-2">
                                    <Link className="nav-link" to="/seller">SELLER PANEL</Link>
                                </div>
                            </>
                        )}
                        
                        <div className="d-flex align-items-center gap-3 ps-3 border-start">
                            {user ? (
                                <div className="seller-menu-container" ref={sellerMenuRef}>
                                    <div className="seller-profile-trigger" onClick={() => setIsSellerMenuOpen(!isSellerMenuOpen)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                        <div className="seller-avatar" style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '8px', fontWeight: 'bold' }}>
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="seller-name-nav" style={{ fontSize: '13px', fontWeight: 'bold', color: '#333' }}>{user.name?.split(' ')[0]}</span>
                                        {isSellerMenuOpen ? <FaChevronUp className="ms-1" style={{ fontSize: '10px' }} /> : <FaChevronDown className="ms-1" style={{ fontSize: '10px' }} />}
                                    </div>

                                    {isSellerMenuOpen && (
                                        <div className="seller-dropdown-menu">
                                            <div className="seller-info-item">
                                                <span className="seller-name-info">{user.name}</span>
                                                <div style={{ fontSize: '11px', color: '#bbb', fontWeight: 'normal', marginTop: '2px' }}>{user.email}</div>
                                            </div>
                                            <div className="dropdown-divider"></div>
                                            <button className="dropdown-item-seller" onClick={() => { setIsEditProfileOpen(true); setIsSellerMenuOpen(false); }}>
                                                Edit Profile
                                            </button>
                                            <button className="dropdown-item-seller" onClick={() => { setIsChangePasswordOpen(true); setIsSellerMenuOpen(false); }}>
                                                Change Password
                                            </button>
                                            <div className="dropdown-divider"></div>
                                            <button className="logout-btn-seller" onClick={onLogout}>
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="navbar-item login-nav-link" onClick={() => setIsAuthModalOpen(true)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#666', fontWeight: '700', fontSize: '12px' }}>
                                    <FaUser className="me-2" /> LOGIN
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;

