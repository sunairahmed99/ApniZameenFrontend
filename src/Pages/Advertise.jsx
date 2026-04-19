import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer/Footer';
import { FaUser, FaBuilding, FaHardHat, FaCheckCircle, FaRocket, FaBriefcase, FaGem, FaStar, FaImages, FaLock, FaExternalLinkAlt, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import './Advertise.css';

const Advertise = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const individualRef = useRef(null);
    const agencyRef = useRef(null);
    const developerRef = useRef(null);
    const bannerRef = useRef(null);

    const [propertyDeals, setPropertyDeals] = useState([]);
    const [agencyPlans, setAgencyPlans] = useState([]);
    const [projectPlans, setProjectPlans] = useState([]);
    const [bannerPlans, setBannerPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                setLoading(true);
                // Fetch all plans in parallel
                const [dealsRes, agenciesRes, projectsRes, bannersRes] = await Promise.allSettled([
                    axios.get('/api/deals'),
                    axios.get('/api/agencies/plans'),
                    axios.get('/api/project-plans'),
                    axios.get('/api/banner-ads/plans')
                ]);

                if (dealsRes.status === 'fulfilled') setPropertyDeals(dealsRes.value.data);
                if (agenciesRes.status === 'fulfilled') setAgencyPlans(agenciesRes.value.data);
                if (projectsRes.status === 'fulfilled') setProjectPlans(projectsRes.value.data);
                if (bannersRes.status === 'fulfilled') setBannerPlans(bannersRes.value.data);

            } catch (error) {
                
                setError("Failed to load plans. Please check your internet connection.");
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    const scrollToSection = (ref) => {
        const headerOffset = 100;
        const elementPosition = ref.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    };

    const handleActionClick = (e, redirectPath = '/seller/packages') => {
        if (e && e.preventDefault) e.preventDefault();
        if (user) {
            navigate(redirectPath);
        } else {
            setShowLoginModal(true);
        }
    };

    const LoginRequiredModal = () => (
        <div className="login-modal-overlay">
            <div className="login-modal-content">
                <button className="login-modal-close" onClick={() => setShowLoginModal(false)}>
                    <FaTimes />
                </button>
                <div className="login-modal-icon">
                    <FaLock />
                </div>
                <h3>Login Required</h3>
                <p>Please login to your account to purchase packages and start advertising your properties on ApniZameen.</p>
                <div className="login-modal-actions">
                    <button className="login-modal-btn-dismiss" onClick={() => setShowLoginModal(false)}>
                        Maybe Later
                    </button>
                    <button className="login-modal-btn-primary" onClick={() => {
                        setShowLoginModal(false);
                        // Trigger the login modal from Navbar could be tricky without global state,
                        // so we just guide them or redirect to a login page if available.
                        // Assuming the auth modal is managed by Navbar, we just tell them to login.
                    }}>
                        Got It
                    </button>
                </div>
            </div>
        </div>
    );

    // Helper to split description into list items if newlines exist
    const renderDescription = (desc) => {
        if (!desc) return null;
        const lines = desc.split('\n');
        if (lines.length > 1) {
            return (
                <ul className="pkg-features-list">
                    {lines.map((line, i) => (
                        <li key={i}><FaCheckCircle /> {line}</li>
                    ))}
                </ul>
            );
        }
        return <p className="pkg-desc">{desc}</p>;
    };

    return (
        <div className="advertise-page">
            <Navbar />

            {/* Hero Section */}
            <div className="advertise-hero">
                <div className="container">
                    <h1>Let <span>Zameen</span> Build Your Business</h1>
                    <p>
                        Excel in the challenging real estate market in Pakistan with our dependable platform,
                        expert services, and access to a broad audience of prospective property seekers.
                    </p>

                    <div className="ads-nav-container">
                        <button className="ads-nav-btn individual" onClick={() => scrollToSection(individualRef)}>
                            <FaUser /> # For Property Deals
                        </button>
                        <button className="ads-nav-btn agency" onClick={() => scrollToSection(agencyRef)}>
                            <FaBuilding /> # For Agency Deals
                        </button>
                        <button className="ads-nav-btn developer" onClick={() => scrollToSection(developerRef)}>
                            <FaHardHat /> # For Project Deals
                        </button>
                        <button className="ads-nav-btn banner" onClick={() => scrollToSection(bannerRef)}>
                            <FaImages /> # For Banner Deals
                        </button>
                    </div>
                </div>
            </div>

            <div className="container">
                {/* For Individuals (Property Deals) */}
                <section ref={individualRef} className="ads-section">
                    <h2 className="ads-section-title">For Property Deals</h2>
                    {error && <div className="alert alert-danger text-center">{error}</div>}
                    {loading ? <div className="text-center py-5">Loading plans...</div> : (
                        <div className="row g-4">
                            {propertyDeals.length > 0 ? propertyDeals.map((pkg, idx) => (
                                <div className="col-lg-4 col-md-6" key={pkg._id || idx}>
                                    <div className="pkg-card">
                                        <div className="pkg-icon"><FaCheckCircle /></div>
                                        <h3 className="pkg-title">{pkg.name}</h3>
                                        {renderDescription(pkg.description)}
                                        <div className="pkg-price">PKR {Number(pkg.price).toLocaleString()}</div>
                                        <span className="pkg-duration">{pkg.durationDays ? `${pkg.durationDays} Days` : '/month'}</span>
                                        <button onClick={(e) => handleActionClick(e, '/seller/packages')} className="btn-pkg">Buy Now ↗</button>
                                    </div>
                                </div>
                            )) : <p className="text-center text-muted">No property deals available at the moment.</p>}
                        </div>
                    )}
                </section>

                <hr />

                {/* For Agencies */}
                <section ref={agencyRef} className="ads-section">
                    <h2 className="ads-section-title">For Agency Deals</h2>
                    <div className="row g-4 justify-content-center">
                        {agencyPlans.length > 0 ? agencyPlans.map((plan) => (
                            <div className="col-lg-3 col-md-6" key={plan._id}>
                                <div className="pkg-card">
                                    <div className="pkg-icon"><FaBriefcase /></div>
                                    <h3 className="pkg-title">{plan.name}</h3>
                                    {renderDescription(plan.description)}
                                    <div className="pkg-price">PKR {Number(plan.price).toLocaleString()}</div>
                                    <span className="pkg-duration">{plan.durationInDays} Days</span>
                                    <button onClick={(e) => handleActionClick(e, '/seller/agency-upgrade')} className="btn-pkg">Inquire Now</button>
                                </div>
                            </div>
                        )) : <p className="text-center text-muted">No agency plans available.</p>}
                    </div>
                </section>

                <hr />

                {/* For Developers (Project Deals) */}
                <section ref={developerRef} className="ads-section">
                    <h2 className="ads-section-title">For Project Deals</h2>
                    <div className="row g-4 justify-content-center">
                        {projectPlans.length > 0 ? projectPlans.map((plan) => (
                            <div className="col-lg-3 col-md-6" key={plan._id}>
                                <div className="pkg-card">
                                    <div className="pkg-icon"><FaHardHat /></div>
                                    <h3 className="pkg-title">{plan.name}</h3>
                                    <div className="pkg-features-wrapper" style={{ marginBottom: '20px', width: '100%' }}>
                                        <ul className="pkg-features-list">
                                            {plan.features && plan.features.length > 0 ? (
                                                plan.features.map((feature, i) => (
                                                    <li key={i}><FaCheckCircle /> {feature}</li>
                                                ))
                                            ) : (
                                                plan.description && plan.description.split('\n').map((line, i) => (
                                                    <li key={i}><FaCheckCircle /> {line}</li>
                                                ))
                                            )}
                                        </ul>
                                    </div>
                                    <div className="pkg-price">PKR {Number(plan.price).toLocaleString()}</div>
                                    <span className="pkg-duration">{plan.durationInDays} Days</span>
                                    <button onClick={(e) => handleActionClick(e, '/seller/project-requests')} className="btn-pkg">Inquire Now</button>
                                </div>
                            </div>
                        )) : <p className="text-center text-muted">No project deals available.</p>}
                    </div>
                </section>

                <hr />

                {/* For Banner Deals */}
                <section ref={bannerRef} className="ads-section">
                    <h2 className="ads-section-title">For Banner Deals</h2>
                    <div className="row g-4 justify-content-center">
                        {bannerPlans.length > 0 ? bannerPlans.map((plan) => (
                            <div className="col-lg-3 col-md-6" key={plan._id}>
                                <div className="pkg-card">
                                    <div className="pkg-icon"><FaImages /></div>
                                    <h3 className="pkg-title">{plan.name}</h3>
                                    {renderDescription(plan.description)}
                                    <div className="pkg-price">PKR {Number(plan.price).toLocaleString()}</div>
                                    <span className="pkg-duration">{plan.durationInDays} Days</span>
                                    <button onClick={(e) => handleActionClick(e, '/seller/banner-request')} className="btn-pkg">Inquire Now</button>
                                </div>
                            </div>
                        )) : <p className="text-center text-muted">No banner deals available.</p>}
                    </div>
                </section>

                <hr />

                {/* Become a Member Banner */}
                <section className="member-banner">
                    <div className="row g-4">
                        <div className="col-md-6">
                            <div className="member-card">
                                <h3>Are you a Developer?</h3>
                                <p>If you're a developer, Zameen.com offers you the best packages to get started on your journey.</p>
                                <button onClick={(e) => handleActionClick(e, '/seller/agency-upgrade')} className="btn-light-outline">Inquire Now</button>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="member-card agent">
                                <h3>Are you an Agent?</h3>
                                <p>If you're an agent, Zameen.com offers you the best packages to get started on your journey.</p>
                                <button onClick={(e) => handleActionClick(e, '/seller/agency-upgrade')} className="btn-light-outline">Inquire Now</button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {showLoginModal && <LoginRequiredModal />}

            <Footer />
        </div>
    );
};

// Simple Icon Components for placeholders
const FaFireIcon = () => <span style={{ color: '#e74c3c' }}>🔥</span>;
const FaSyncIcon = () => <span style={{ color: '#3498db' }}>🔄</span>;
const FaHistoryIcon = () => <span style={{ color: '#9b59b6' }}>⏱</span>;


export default Advertise;

