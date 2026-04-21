import React, { useState, useEffect } from 'react';
import {
    FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp, FaEnvelope,
    FaChevronDown, FaChevronUp, FaCheck, FaBuilding,
    FaLayerGroup, FaRulerCombined, FaUsers, FaHospital,
    FaGraduationCap, FaUtensils, FaDumbbell, FaShieldAlt,
    FaArrowRight, FaCamera, FaVideo, FaCube, FaImages,
    FaBed, FaBath, FaPlay, FaChevronLeft, FaChevronRight, FaShareAlt, FaHeart, FaTimes
} from 'react-icons/fa';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer/Footer';
import './ZameenProjectDetail.css';
import { useParams } from 'react-router-dom';
import { API_BASE_URL } from '../config';
// import axios from 'axios'; // Removed
import { useProject, useProjectInquiry } from '../hooks/useProjects';
import { getImageUrl } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';
import { IoIosShareAlt } from "react-icons/io";
import { useMemo } from 'react';

const TABS = [
    'Overview', 'Offered Properties', 'Features', 'Progress Updates',
    'Location', 'Floor Plans', '3d Walkthrough', 'Payment Plan',
    'Marketed By', 'Developer'
];

const formatPriceRange = (range) => {
    if (!range) return "N/A";
    return `PKR ${range.min} ${range.unit || "Crore"} to ${range.max} ${range.unit || "Crore"}`;
};

const ZameenProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 992);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // NEW: Use custom hook
    const { data: project, isLoading: loading, error: queryError } = useProject(id);
    const { mutateAsync: submitInquiryAsync } = useProjectInquiry();

    const error = queryError ? "Project not found" : null; // Map error to string if needed or just use queryError.message

    const [activeTab, setActiveTab] = useState('Overview');
    const [expandedCat, setExpandedCat] = useState(null); // Defaults to null or first cat after load
    const [activeFloor, setActiveFloor] = useState(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);

    // Inquiry Form State
    const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
    const [formStatus, setFormStatus] = useState('idle'); // idle, submitting, success, error

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormStatus('submitting');
        try {
            await submitInquiryAsync({
                ...formData,
                projectId: id
            });
            setFormStatus('success');
            setFormData({ name: '', phone: '', email: '' });
            setTimeout(() => setFormStatus('idle'), 3000);
        } catch (err) {
            
            setFormStatus('error');
        }
    };


    // Initialize states when project data loads
    useEffect(() => {
        if (project) {
            // Set initial states based on data
            if (project.inventory && project.inventory.length > 0 && !expandedCat) {
                setExpandedCat(project.inventory[0].category);
            }
            if (project.floorPlans && project.floorPlans.length > 0 && !activeFloor) {
                setActiveFloor(project.floorPlans[0].title);
            }
        }
    }, [project, expandedCat, activeFloor]);

    const allImages = useMemo(() => {
        const imgs = [];
        if (!project) return [];
        if (project.thumbnail) imgs.push(project.thumbnail);
        if (project.gallery) imgs.push(...project.gallery);
        return imgs.map(url => getImageUrl(url));
    }, [project]);

    const projectFeatures = useMemo(() => {
        const mapped = [];
        if (!project) return [];
        if (project.amenities?.mainFeatures?.length) mapped.push({ group: 'Main Features', icon: <FaShieldAlt />, items: project.amenities.mainFeatures });
        if (project.amenities?.rooms?.length) mapped.push({ group: 'Rooms', icon: <FaDumbbell />, items: project.amenities.rooms });
        if (project.amenities?.businessAndCommunication?.length) mapped.push({ group: 'Business And Communication', icon: <FaBuilding />, items: project.amenities.businessAndCommunication });
        if (project.amenities?.communityFeatures?.length) mapped.push({ group: 'Community Features', icon: <FaUsers />, items: project.amenities.communityFeatures });
        return mapped;
    }, [project]);

    if (loading) return <div className="text-center py-5"><h2>Loading Project...</h2></div>;
    if (error || !project) return <div className="text-center py-5"><h2>{error || "Project not found"}</h2></div>;


    // --- Lightbox Logic ---
    const openLightbox = (index) => {
        setPhotoIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const nextImage = (e) => {
        e.stopPropagation();
        setPhotoIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setPhotoIndex((prev) => (prev + allImages.length - 1) % allImages.length);
    };

    // --- Scroll Logic ---
    const scrollToSection = (id) => {
        setActiveTab(TABS.find(t => t.toLowerCase().replace(/ /g, '') === id) || id); // Sync tab state
        const element = document.getElementById(id);
        if (element) {
            const offset = 120; // Header height approx
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    // Helper map for tabs to IDs
    const getTabId = (tabName) => {
        if (tabName === '3d Walkthrough') return '3d';
        return tabName.toLowerCase().replace(/ /g, '');
    };

    return (
        <div className={`zp-wrapper ${isMobile ? 'is-mobile' : ''}`}>
            {!isMobile && <Navbar />}

            {/* Mobile Header (Sticky) */}
            {isMobile && (
                <div className="mobile-zp-header sticky-top">
                    <div className="d-flex align-items-center justify-content-between px-3 py-2 bg-white border-bottom">
                        <div className="d-flex align-items-center gap-3">
                            <button className="btn p-0 border-0" onClick={() => navigate(-1)}>
                                <FaChevronLeft size={20} />
                            </button>
                            <img src={allImages[0]} alt="Project" className="mobile-header-thumb" />
                            <div className="mobile-header-info">
                                <div className="mobile-header-price">{formatPriceRange(project.priceRange)}</div>
                                <div className="mobile-header-name">{project.name}</div>
                                <div className="mobile-header-loc"><FaMapMarkerAlt size={10} className="me-1 text-success" /> {project.area}, {project.city}</div>
                            </div>
                        </div>
                        <div className="d-flex gap-3">
                            {/* <IoIosShareAlt size={24} />
                            <FaHeart size={20} /> */}
                        </div>
                    </div>
                </div>
            )}

            {/* Lightbox Overlay */}
            {lightboxOpen && (
                <div className="zp-lightbox-overlay" onClick={closeLightbox}>
                    <button className="zp-lightbox-close" onClick={closeLightbox}>
                        <FaTimes />
                    </button>
                    <div className="zp-lightbox-content" onClick={e => e.stopPropagation()}>
                        <img src={allImages[photoIndex]} alt="Full View" className="zp-lightbox-image" />
                        <div className="zp-lightbox-nav">
                            <button className="zp-nav-btn prev" onClick={prevImage}><FaChevronLeft /></button>
                            <button className="zp-nav-btn next" onClick={nextImage}><FaChevronRight /></button>
                        </div>
                        <span className="zp-counter">{photoIndex + 1} / {allImages.length}</span>
                    </div>
                    {/* Thumbnails */}
                    <div className="zp-lightbox-thumbnails" onClick={e => e.stopPropagation()}>
                        {allImages.map((img, idx) => (
                            <div
                                key={idx}
                                className={`zp-thumb-item ${photoIndex === idx ? 'active' : ''}`}
                                onClick={() => setPhotoIndex(idx)}
                            >
                                <img src={img} alt={`Thumb ${idx + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="zp-container">
                {/* Header Section */}
                <header className="zp-header">
                    <div className="zp-header-top">
                        <div className="zp-project-title">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <img
                                    src={getImageUrl(project.developer?.logo || allImages[0])}
                                    alt="Logo"
                                    className="rounded border"
                                    style={{ width: '50px', height: '50px', objectFit: 'contain', background: '#fff' }}
                                />
                                <div>
                                    {/* <h1>{project.name}</h1> */}
                                    <div className="zp-location-info pt-2">
                                        <FaMapMarkerAlt className="me-2 text-success" />
                                        {project.area}, {project.city}
                                    </div>
                                </div>
                            </div>
                            <div className="badge bg-light text-success border px-3 py-2 mt-2">
                                Marketed By <strong>{project.marketedBy?.name || "Zameen.com"}</strong> <FaCheck className="ms-1" />
                            </div>
                        </div>
                        <div className="zp-price-info">
                            <span className="zp-price-label">Price Range</span>
                            <div className="zp-price-value">{formatPriceRange(project.priceRange)}</div>
                        </div>
                    </div>

                    {/* Gallery Grid - Dynamic Click Handlers */}
                    <div className="zp-gallery">
                        <div className="zp-main-img-wrapper" onClick={() => openLightbox(0)}>
                            <img src={allImages[0]} alt="Main" className="zp-main-img" />
                        </div>
                        <div className="zp-side-gallery">
                            <div className="zp-side-img-wrapper" onClick={() => openLightbox(1)}>
                                <img src={allImages[1] || allImages[0]} alt="Side 1" />
                            </div>
                            <div className="zp-side-img-wrapper" onClick={() => openLightbox(2)}>
                                <img src={allImages[2] || allImages[0]} alt="Side 2" />
                                <div className="zp-gallery-overlay">
                                    <div className="d-flex gap-3">
                                        <div className="text-center"><FaCamera size={20} /> <div className="small">{allImages.length}</div></div>
                                        <div className="text-center"><FaVideo size={20} /> <div className="small">{project.videoUrl ? 1 : 0}</div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Sticky Tab Navigation */}
                <nav className={`zp-tabs-wrapper sticky-top bg-white shadow-sm ${isMobile ? 'mobile-tabs' : ''}`} style={{ zIndex: 100, top: isMobile ? '58px' : '0' }}>
                    <ul className={`zp-tabs ${!isMobile ? 'container' : 'px-3'}`}>
                        {TABS.map(tab => (
                            <li
                                key={tab}
                                className={`zp-tab-item ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => {
                                    if (isMobile) {
                                        setActiveTab(tab);
                                        // Still allow scrolling to section if needed, but tabs act as views on mobile too
                                        const id = getTabId(tab);
                                        const element = document.getElementById(id);
                                        if (element) {
                                            const offset = isMobile ? 160 : 120;
                                            const bodyRect = document.body.getBoundingClientRect().top;
                                            const elementRect = element.getBoundingClientRect().top;
                                            window.scrollTo({
                                                top: elementRect - bodyRect - offset,
                                                behavior: 'smooth'
                                            });
                                        }
                                    } else {
                                        scrollToSection(getTabId(tab));
                                    }
                                }}
                            >
                                <div className="d-flex align-items-center gap-2">
                                    {tab === 'Offered Properties' && isMobile && <FaBuilding size={14} />}
                                    {tab === 'Features' && isMobile && <FaLayerGroup size={14} />}
                                    {tab === 'Location' && isMobile && <FaMapMarkerAlt size={14} />}
                                    {tab}
                                </div>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="zp-main-layout mt-4">
                    {/* Left Content Area */}
                    <div className="zp-content">

                        {/* Overview */}
                        <section className="zp-content-section" id="overview">
                            <h2 className="zp-section-title">Overview</h2>
                            <div className="row g-4 mb-4">
                                <div className="col-md-4">
                                    <div className="d-flex align-items-center gap-3 border p-3 rounded h-100">
                                        <FaLayerGroup className="text-success fs-4" />
                                        <div>
                                            <div className="small text-secondary">Offering</div>
                                            <strong>{project.projectTypes?.join(', ') || "Flats, Penthouse"}</strong>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="d-flex align-items-center gap-3 border p-3 rounded h-100">
                                        <FaBuilding className="text-success fs-4" />
                                        <div>
                                            <div className="small text-secondary">Developer</div>
                                            <strong>{project.developer?.name || "Zameen Developments"}</strong>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="d-flex align-items-center gap-3 border p-3 rounded h-100">
                                        <FaShieldAlt className="text-success fs-4" />
                                        <div>
                                            <div className="small text-secondary">NOC Status</div>
                                            <strong>{project.nocStatus || "Approved"}</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-secondary" style={{ lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                                {project.description}
                            </div>
                        </section>

                        {/* Offered Properties (Inventory) */}
                        <section className="zp-content-section" id="offeredproperties">
                            <h2 className={`zp-section-title ${isMobile ? 'd-none' : ''}`}>Offered Properties</h2>
                            {project.inventory && project.inventory.map(cat => (
                                <div key={cat.category} className={`zp-inventory-cat mb-3 ${isMobile ? 'border-0 border-bottom rounded-0' : 'shadow-sm rounded border'}`}>
                                    <div
                                        className={`zp-cat-header ${isMobile ? 'bg-white p-3' : 'p-3 bg-light'} d-flex justify-content-between align-items-center cursor-pointer`}
                                        onClick={() => setExpandedCat(expandedCat === cat.category ? null : cat.category)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="zp-cat-info d-flex align-items-center gap-2">
                                            {isMobile ? <FaBuilding className="text-secondary" /> : <FaBuilding className="text-secondary" />}
                                            <span className={`fw-bold ${isMobile ? 'fs-5' : ''}`}>{cat.category}</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-3">
                                            {!isMobile && <span className="zp-cat-price fw-bold text-success">{formatPriceRange(cat.priceRange)}</span>}
                                            {expandedCat === cat.category ? <FaChevronUp className="text-secondary" /> : <FaChevronDown className="text-secondary" />}
                                        </div>
                                    </div>
                                    {expandedCat === cat.category && cat.units.length > 0 && (
                                        <div className={`zp-cat-body ${isMobile ? 'bg-light p-3' : 'bg-white p-3'}`}>
                                            {cat.units.map((unit, idx) => (
                                                isMobile ? (
                                                    <div key={idx} className="mobile-unit-card bg-white p-3 rounded mb-3 shadow-sm border">
                                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                                            <div className="mobile-unit-title fw-bold fs-6" style={{ maxWidth: '60%' }}>{unit.title}</div>
                                                            <div className="mobile-unit-price fw-bold text-dark text-end">{unit.price}</div>
                                                        </div>
                                                        <div className="divider-dashed mb-3"></div>
                                                        <div className="row g-2">
                                                            <div className="col-6">
                                                                <div className="d-flex align-items-center gap-2 text-muted small">
                                                                    <FaRulerCombined className="text-success" size={14} />
                                                                    <span>Area Size : <strong>{unit.area}</strong></span>
                                                                </div>
                                                            </div>
                                                            <div className="col-6">
                                                                <div className="d-flex align-items-center gap-2 text-muted small">
                                                                    <FaBed className="text-success" size={14} />
                                                                    <span>Bedrooms : <strong>{unit.beds || 0}</strong></span>
                                                                </div>
                                                            </div>
                                                            <div className="col-6">
                                                                <div className="d-flex align-items-center gap-2 text-muted small">
                                                                    <FaBath className="text-success" size={14} />
                                                                    <span>Bathrooms : <strong>{unit.baths || 0}</strong></span>
                                                                </div>
                                                            </div>
                                                            <div className="col-6">
                                                                <div className="d-flex align-items-center gap-2 text-muted small">
                                                                    <FaPlay className="text-success" size={14} />
                                                                    <span>Walkthrough</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div key={idx} className="zp-unit-item d-flex justify-content-between align-items-center border-bottom py-3">
                                                        <div className="zp-unit-details">
                                                            <div className="zp-unit-title fw-bold">{unit.title}</div>
                                                            <div className="zp-unit-specs text-muted small d-flex gap-3 mt-1">
                                                                <div className="zp-unit-spec-item"><FaRulerCombined /> {unit.area}</div>
                                                                <div className="zp-unit-spec-item">🛏️ {unit.beds || 0} Bed</div>
                                                                <div className="zp-unit-spec-item">🚿 {unit.baths || 0} Bath</div>
                                                            </div>
                                                        </div>
                                                        <div className="zp-unit-price-action text-end">
                                                            <div className="zp-unit-price fw-bold mb-1">{unit.price}</div>
                                                            <button className="btn btn-sm btn-outline-success">View Details</button>
                                                        </div>
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </section>

                        {/* Features */}
                        <section className="zp-content-section" id="features">
                            <h2 className="zp-section-title">Features</h2>
                            <div className="zp-features-grid row g-4">
                                {projectFeatures.map(f => (
                                    <div key={f.group} className="col-md-6">
                                        <div className="zp-feature-group mb-4">
                                            <div className="zp-feature-group-title d-flex align-items-center gap-2 mb-2 fw-bold">
                                                <span className="text-warning bg-warning-subtle p-1 rounded">{f.icon}</span> {f.group}
                                            </div>
                                            <ul className="zp-feature-list list-unstyled ps-4">
                                                {f.items.map(item => (
                                                    <li key={item} className="zp-feature-item mb-1"><FaCheck className="text-success me-2" size={12} /> {item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Development Updates */}
                        <section className="zp-content-section" id="progressupdates">
                            <h2 className="zp-section-title">Progress Updates</h2>
                            {project.developmentUpdates && project.developmentUpdates.length > 0 ? (
                                isMobile ? (
                                    <div className="mobile-timeline-wrapper">
                                        <div className="mobile-timeline">
                                            {project.developmentUpdates.map((update, idx) => (
                                                <div className="mobile-timeline-item" key={idx}>
                                                    <div className={`mobile-timeline-dot ${idx === 0 ? 'active' : ''}`}>
                                                        <div className="mobile-timeline-date">{update.date}</div>
                                                    </div>
                                                    {idx < project.developmentUpdates.length - 1 && <div className="mobile-timeline-line"></div>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="zp-timeline position-relative border-start ms-3 ps-4">
                                        {project.developmentUpdates.map((update, idx) => (
                                            <div className="zp-timeline-item mb-4 position-relative" key={idx}>
                                                <div className="zp-timeline-dot position-absolute top-0 start-0 translate-middle rounded-circle bg-success border border-white" style={{ width: '12px', height: '12px', left: '-25px' }}></div>
                                                <div className="zp-timeline-content">
                                                    <div className="d-flex justify-content-between mb-2">
                                                        <span className="badge bg-success-subtle text-success">{update.date}</span>
                                                    </div>
                                                    <h6 className="mb-1 fw-bold">{update.title}</h6>
                                                    <p className="small text-secondary mb-2">{update.description}</p>
                                                    {update.image && <img src={update.image} alt="Update" className="rounded object-fit-cover shadow-sm" style={{ width: '100%', maxWidth: '200px', height: '120px' }} />}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            ) : (
                                <p className="text-muted fst-italic">No updates available yet.</p>
                            )}
                        </section>

                        {/* Location */}
                        <section className="zp-content-section" id="location">
                            <h2 className="zp-section-title">Location</h2>
                            <div className="zp-map-wrapper rounded overflow-hidden shadow-sm border position-relative" style={{ height: '400px' }}>
                                <iframe
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    scrolling="no"
                                    marginHeight="0"
                                    marginWidth="0"
                                    src={`https://maps.google.com/maps?q=${project.location?.lat || 31.5204},${project.location?.lng || 74.3587}&z=14&output=embed`}
                                ></iframe>
                                {isMobile && (
                                    <div className="mobile-map-overlay">
                                        <button className="btn btn-white shadow-sm rounded-pill px-4">
                                            <FaMapMarkerAlt className="text-success me-2" /> Click to Load Map
                                        </button>
                                    </div>
                                )}
                                <div className="position-absolute bottom-0 start-0 w-100 bg-white p-3 border-top d-flex gap-2 overflow-auto align-items-center">
                                    <small className="fw-bold me-2">Nearby:</small>
                                    {project.location?.markers?.map((m, i) => (
                                        <span key={i} className="badge bg-light text-dark border"><FaMapMarkerAlt className="text-danger me-1" /> {m.name}</span>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Floor Plans */}
                        <section className="zp-content-section" id="floorplans">
                            <h2 className="zp-section-title">Floor Plans</h2>
                            {project.floorPlans && project.floorPlans.length > 0 ? (
                                <div className="zp-floor-plan-explorer d-flex border rounded overflow-hidden" style={{ minHeight: '400px' }}>
                                    <div className="zp-floor-sidebar bg-light border-end" style={{ width: '250px' }}>
                                        {project.floorPlans.map(plan => (
                                            <div
                                                key={plan.title}
                                                className={`p-3 border-bottom cursor-pointer hover-bg-light ${activeFloor === plan.title ? 'bg-white fw-bold border-start border-4 border-success' : ''}`}
                                                onClick={() => setActiveFloor(plan.title)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                {plan.title}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="zp-floor-display flex-grow-1 p-4 d-flex align-items-center justify-content-center bg-white">
                                        {project.floorPlans.find(p => p.title === activeFloor)?.image ? (
                                            <img
                                                src={getImageUrl(project.floorPlans.find(p => p.title === activeFloor).image)}
                                                alt="Floor Plan"
                                                className="img-fluid"
                                                style={{ maxHeight: '350px' }}
                                            />
                                        ) : <div className="text-muted">Select a floor plan</div>}
                                    </div>
                                </div>
                            ) : <p className="text-muted">No floor plans available.</p>}
                        </section>

                        {/* 3D Walkthrough */}
                        <section className="zp-content-section" id="3d">
                            <h2 className="zp-section-title">3d Walkthrough</h2>
                            {project.threeDWalkthroughUrl ? (
                                <div className="ratio ratio-16x9 rounded overflow-hidden shadow-sm position-relative">
                                    <iframe
                                        src={project.threeDWalkthroughUrl.replace('watch?v=', 'embed/')}
                                        title="3D Walkthrough"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            ) : (
                                <div className="alert alert-light">No 3D Walkthrough available for this project.</div>
                            )}
                        </section>

                        {/* Payment Plan */}
                        <section className="zp-content-section" id="paymentplan">
                            <h2 className="zp-section-title">Payment Plan</h2>
                            {project.projectPaymentPlans && project.projectPaymentPlans.length > 0 ? (
                                <div className="d-flex flex-column gap-4">
                                    {project.projectPaymentPlans.map((plan, i) => (
                                        <img
                                            key={i}
                                            src={getImageUrl(plan)}
                                            alt="Payment Plan"
                                            className="img-fluid rounded border shadow-sm"
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="alert alert-light">Contact us for detailed payment plans.</div>
                            )}
                        </section>

                        {/* Marketed & Developed By */}
                        <section className="zp-content-section border-0" id="marketedby">
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <div className="p-4 border rounded bg-light h-100">
                                        <div className="d-flex align-items-center gap-3 mb-3">
                                            <img src={getImageUrl(project.marketedBy?.logo || allImages[0])} alt="Logo" className="rounded-circle border bg-white" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
                                            <div>
                                                <div className="small text-secondary text-uppercase">Marketed By</div>
                                                <h4 className="m-0">{project.marketedBy?.name || "Zameen.com"}</h4>
                                            </div>
                                        </div>
                                        <p className="small text-secondary">Authorized sales partner for this project.</p>
                                    </div>
                                </div>
                                <div className="col-md-6" id="developer">
                                    <div className="p-4 border rounded bg-light h-100">
                                        <div className="d-flex align-items-center gap-3 mb-3">
                                            <img src={getImageUrl(project.developer?.logo || allImages[0])} alt="Logo" className="rounded-circle border bg-white" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
                                            <div>
                                                <div className="small text-secondary text-uppercase">Developed By</div>
                                                <h4 className="m-0">{project.developer?.name || "Zameen Developments"}</h4>
                                            </div>
                                        </div>
                                        <p className="small text-secondary">{project.developer?.description || "Builder of premium real estate."}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                    </div>

                    {/* Sidebar Area */}
                    <div className="zp-sidebar-wrapper">
                        <aside className="zp-sidebar-card sticky-top" style={{ top: '100px', zIndex: 90 }}>
                            <div className="zp-lead-btn-group d-flex flex-column gap-2 mb-3">
                                <button className="btn btn-success fw-bold py-2 w-100 d-flex align-items-center justify-content-center gap-2">
                                    <FaPhoneAlt /> Call Now
                                </button>
                                <button className="btn btn-outline-success fw-bold py-2 w-100 d-flex align-items-center justify-content-center gap-2">
                                    <FaWhatsapp /> WhatsApp
                                </button>
                            </div>

                            <div className="text-center text-secondary small mb-3 position-relative"><span className="bg-white px-2 position-relative z-1">or request a call back</span><hr className="position-absolute w-100 top-50 start-0 z-0 m-0" /></div>

                            <form className="d-flex flex-column gap-3" onSubmit={handleSubmit}>
                                <div>
                                    <label className="form-label small fw-bold">Your Name *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Full Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="form-label small fw-bold">Phone Number *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="0300 1234567"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="form-label small fw-bold">Email (Optional)</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="email@example.com"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <button type="submit" className="btn btn-dark w-100 py-2" disabled={formStatus === 'submitting'}>
                                    <FaEnvelope className="me-2" />
                                    {formStatus === 'submitting' ? 'Sending...' : 'Request Information'}
                                </button>
                                {formStatus === 'success' && <div className="alert alert-success small p-2 text-center">Inquiry sent successfully!</div>}
                                {formStatus === 'error' && <div className="alert alert-danger small p-2 text-center">Failed to send inquiry.</div>}
                            </form>

                            <p className="mt-3 text-center text-muted" style={{ fontSize: '11px' }}>
                                By submitting, you agree to our Terms.
                            </p>
                        </aside>
                    </div>
                </div>
            </div>

            {/* Mobile Footer (Fixed) */}
            {isMobile && (
                <div className="mobile-zp-footer">
                    <div className="d-flex align-items-center gap-2 px-3 py-2 bg-white">
                        <button className="btn btn-light-success text-success fw-bold flex-grow-1 py-3 mobile-action-btn" onClick={() => scrollToSection('inquiry')}>
                            <FaEnvelope className="me-2" /> Get More Info
                        </button>
                        <button className="btn btn-success fw-bold flex-grow-1 py-3 mobile-action-btn d-flex align-items-center justify-content-center gap-2">
                            <FaPhoneAlt /> Call
                        </button>
                        <button className="btn btn-outline-success py-3 px-3 mobile-whatsapp-btn">
                            <FaWhatsapp size={24} />
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default ZameenProjectDetail;


