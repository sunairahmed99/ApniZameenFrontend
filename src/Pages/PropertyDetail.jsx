import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer/Footer';
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaCheck, FaPhone, FaWhatsapp, FaEnvelope, FaCamera, FaComments } from 'react-icons/fa';
import Banner from '../Components/Home/Banner';
import './PropertyDetail.css';
import { useSocket } from '../context/SocketContext';
import { logEvent } from '../utils/analytics';
import { useProperty, useIncrementView, useCreateLead, useProperties } from '../hooks/useProperties';
import { useCreateInquiry } from '../hooks/useInquiries';
import SEO from '../Components/SEO';
import { generatePropertyStructuredData } from '../utils/seo';
import { API_BASE_URL } from '../config';
import ContactModal from '../Components/ContactModal';
import EmailModal from '../Components/EmailModal';

const PropertyDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [mainImage, setMainImage] = useState(null);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const { openChatWith, user } = useSocket();
    const viewIncrementedRef = useRef(false);

    // Helper to render area/price objects safely
    const safeRender = (val) => {
        if (!val) return "";
        if (typeof val === 'object') {
            if (val.value) return `${val.value} ${val.unit || ''}`;
            if (val.min || val.max) return `${val.min || 0} - ${val.max || 'Any'} ${val.unit || ''}`;
            return JSON.stringify(val);
        }
        return val;
    };

    // Formatting helpers
    const formatPrice = (price) => {
        if (!price) return "Contact for Price";
        const val = Number(price);
        if (isNaN(val)) return price;
        if (val >= 10000000) return `${(val / 10000000).toFixed(2)} Crore`;
        if (val >= 100000) return `${(val / 100000).toFixed(2)} Lakh`;
        return val.toLocaleString();
    };

    const defaultImages = [
        'https://images.unsplash.com/photo-1600596542815-2250654128e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ];

    // Use React Query for main property
    const { data: property, isLoading: loading, isError } = useProperty(slug);

    const images = (property?.images && property.images.length > 0 ? property.images : defaultImages).map(img =>
        img.startsWith('http') ? img : `${API_BASE_URL}/${img.replace(/\\/g, '/')}`
    );

    // Initialize main image when property data is loaded
    useEffect(() => {
        if (images.length > 0) {
            setMainImage(images[0]);
        }
    }, [property?.images]); // Only re-run when actual property images change

    const createLeadMutation = useCreateLead();
    const createInquiryMutation = useCreateInquiry();

    const handleContactClick = (type, action) => {
        if (!property?._id) return;
        createLeadMutation.mutate(property._id);
        logEvent('contact_click', { propertyId: property._id, type });
        if (action) action();
    };

    const sId = property?.sellerId?._id || property?.sellerId;

    // Use React Query for related properties
    const { data: relatedProperties = [] } = useProperties(
        { sellerId: sId, limit: 4 },
        {
            enabled: !!sId,
            select: (data) => Array.isArray(data) ? data.filter(p => p._id !== property?._id).slice(0, 3) : []
        }
    );

    const handleInquirySubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const payload = {
            propertyId: property._id,
            sellerId: sId,
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            message: formData.get('message')
        };

        try {
            await createInquiryMutation.mutateAsync(payload);
            alert("Message Sent to Seller!");
            form.reset();
        } catch (err) {
            
            alert("Error sending message.");
        }
    };

    const scrollToSection = (id) => {
        setActiveTab(id);
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 130;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
    };

    if (loading) return <div className="p-5 text-center">Loading...</div>;
    if (!property && !loading) return (
        <div className="text-center p-5">
            <h3>Property Not Found</h3>
            <p>We couldn't find the property you're looking for.</p>
        </div>
    );

    const propertyPrice = property.priceRange ? `PKR ${formatPrice(property.priceRange.min)} - ${formatPrice(property.priceRange.max)}` : `PKR ${formatPrice(property.price)}`;
    const propertyLocation = `${safeRender(property.area)}, ${property.blockName ? property.blockName + ', ' : ''}${property.city}`;
    const propertyImage = images[0];


    return (
        <div className="property-detail-page">
            <SEO
                title={`${property.name || property.title} - ${propertyPrice} | ${property.city} | Zameen`}
                description={`${property.type || 'Property'} for ${property.purpose || 'sale'} in ${propertyLocation}. ${property.bedrooms ? property.bedrooms + ' bedrooms, ' : ''}${property.bathrooms ? property.bathrooms + ' bathrooms. ' : ''}${property.description ? property.description.substring(0, 150) : 'Contact for more details.'}`}
                keywords={`${property.type} ${property.city}, property ${property.purpose?.toLowerCase()} ${property.city}, ${property.area} ${property.city}, real estate ${property.city}`}
                ogImage={propertyImage}
                ogType="product"
                structuredData={generatePropertyStructuredData(property)}
                canonicalUrl={window.location.href}
            />
            <Navbar />
            <Banner showSearchFilter={false} showHeading={false} />

            <div className="container mt-4">
                {/* Header */}
                <div className="row mb-3">
                    <div className="col-12 d-flex justify-content-between align-items-end">
                        <div className="pd-header-title">
                            <div className="d-flex align-items-center gap-2">
                                <h1>{property.name || property.title}</h1>
                                {property.isTitanium && (
                                    <span className="badge" style={{ background: 'linear-gradient(45deg, #FFD700, #FFA500)', color: '#000', fontWeight: '800', verticalAlign: 'middle', height: 'fit-content' }}>
                                        <i className="fas fa-crown me-1"></i> TITANIUM
                                    </span>
                                )}
                            </div>
                            <div className="pd-header-location">
                                <FaMapMarkerAlt className="me-1" />
                                {property.location || `${safeRender(property.area)}, ${property.blockName ? property.blockName + ', ' : ''}${property.city}`}
                            </div>
                        </div>
                        <div className="text-end d-none d-md-block">
                            <div className="pd-price-tag">{property.priceRange ? `PKR ${formatPrice(property.priceRange.min)} - ${formatPrice(property.priceRange.max)}` : `PKR ${formatPrice(property.price)}`}</div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {/* Left Column */}
                    <div className="col-lg-8">
                        {/* Gallery */}
                        <div className="pd-main-image-container">
                            <img src={mainImage} alt="Main" className="pd-main-image" />
                            <div className="position-absolute bottom-0 end-0 m-3 text-white">
                                <span className="badge bg-dark bg-opacity-75 p-2"><FaCamera className="me-1" /> {images.length} Photos</span>
                            </div>
                        </div>
                        <div className="pd-thumbnails">
                            {images.slice(0, 5).map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`Thumb ${idx}`}
                                    className={`pd-thumb ${mainImage === img ? 'active' : ''}`}
                                    onClick={() => setMainImage(img)}
                                />
                            ))}
                        </div>

                        {/* Page Nav */}
                        <div className="pd-page-nav d-flex overflow-auto">
                            <div className={`pd-nav-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => scrollToSection('overview')}>Overview</div>
                            <div className={`pd-nav-link ${activeTab === 'description' ? 'active' : ''}`} onClick={() => scrollToSection('description')}>Description</div>
                            <div className={`pd-nav-link ${activeTab === 'amenities' ? 'active' : ''}`} onClick={() => scrollToSection('amenities')}>Amenities</div>
                            <div className={`pd-nav-link ${activeTab === 'location' ? 'active' : ''}`} onClick={() => scrollToSection('location')}>Location & Nearby</div>
                            {property.video && <div className={`pd-nav-link ${activeTab === 'video' ? 'active' : ''}`} onClick={() => scrollToSection('video')}>Video</div>}
                        </div>

                        {/* Overview */}
                        <div id="overview" className="pd-content-card">
                            <h3 className="pd-section-heading">Overview</h3>
                            <div className="pd-feature-grid">
                                <div className="pd-feature-item">
                                    <span className="pd-feature-label">Type</span>
                                    <span className="pd-feature-value">{property.type || "House"}</span>
                                </div>
                                <div className="pd-feature-item">
                                    <span className="pd-feature-label">Price</span>
                                    <span className="pd-feature-value">{property.priceRange ? `PKR ${formatPrice(property.priceRange.min)} - ${formatPrice(property.priceRange.max)}` : `PKR ${formatPrice(property.price)}`}</span>
                                </div>
                                <div className="pd-feature-item">
                                    <span className="pd-feature-label">Location</span>
                                    <span className="pd-feature-value">{safeRender(property.area)}, {property.blockName ? property.blockName + ', ' : ''}{property.city}</span>
                                </div>
                                <div className="pd-feature-item">
                                    <span className="pd-feature-label">Bath(s)</span>
                                    <span className="pd-feature-value"><FaBath className="text-secondary" /> {property.bathrooms || "-"}</span>
                                </div>
                                <div className="pd-feature-item">
                                    <span className="pd-feature-label">Area</span>
                                    <span className="pd-feature-value">
                                        <FaRulerCombined className="text-secondary" />
                                        {safeRender(property.areaSize || property.size || property.area)}
                                    </span>
                                </div>
                                <div className="pd-feature-item">
                                    <span className="pd-feature-label">Purpose</span>
                                    <span className="pd-feature-value">{property.purpose || "For Sale"}</span>
                                </div>
                                <div className="pd-feature-item">
                                    <span className="pd-feature-label">Bedroom(s)</span>
                                    <span className="pd-feature-value"><FaBed className="text-secondary" /> {property.bedrooms || "-"}</span>
                                </div>
                                <div className="pd-feature-item">
                                    <span className="pd-feature-label">Added</span>
                                    <span className="pd-feature-value">Recently</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div id="description" className="pd-content-card standalone">
                            <h3 className="pd-section-heading">Description</h3>
                            <div className="pd-description-text">
                                {property.description ? property.description.split('\\n').map((para, i) => (
                                    <p key={i}>{para}</p>
                                )) : <p>No description available.</p>}
                            </div>
                        </div>

                        {/* Amenities */}
                        <div id="amenities" className="pd-content-card standalone">
                            <h3 className="pd-section-heading">Amenities</h3>
                            <div className="pd-amenities-list">
                                {property.features && property.features.length > 0 ? property.features.map((item, idx) => (
                                    <div key={idx} className="pd-amenity">
                                        <FaCheck className="text-success" /> {item}
                                    </div>
                                )) : (
                                    <p className="text-secondary">No amenities listed for this property.</p>
                                )}
                            </div>
                        </div>

                        {/* Video */}
                        {property.video && (
                            <div id="video" className="pd-content-card standalone mt-4">
                                <h3 className="pd-section-heading">Property Video</h3>
                                <div className="pd-video-container border rounded overflow-hidden">
                                    <video 
                                        controls 
                                        className="w-100"
                                        style={{ maxHeight: '500px', backgroundColor: '#000' }}
                                        src={property.video.startsWith('http') ? property.video : `${API_BASE_URL}/${property.video.replace(/\\/g, '/')}`}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            </div>
                        )}

                        {/* Location */}
                        <div id="location" className="pd-content-card standalone">
                            <h3 className="pd-section-heading">Location & Nearby</h3>
                            <div className="pd-map-container mb-3 border rounded overflow-hidden" style={{ height: '350px' }}>
                                <iframe
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    allowFullScreen
                                    src={`https://www.google.com/maps?q=${encodeURIComponent(`${property.location || ''} ${safeRender(property.area)} ${property.blockName || ''} ${property.city}`)}&output=embed`}
                                ></iframe>
                            </div>
                            <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded border">
                                <div className="d-flex align-items-center">
                                    <FaMapMarkerAlt className="text-danger me-2" size={24} />
                                    <div>
                                        <h6 className="mb-0 fw-bold">{property.location || `${safeRender(property.area)}, ${property.blockName ? property.blockName + ', ' : ''}${property.city}`}</h6>
                                        <p className="text-muted small mb-0">Exact location as provided by seller</p>
                                    </div>
                                </div>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${property.location || ''} ${safeRender(property.area)} ${property.blockName || ''} ${property.city}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline-dark btn-sm fw-bold"
                                >
                                    Open in Google Maps
                                </a>
                            </div>
                        </div>

                    </div>

                    {/* Right Column (Sidebar) */}
                    <div className="col-lg-4">
                        <div className="pd-agent-card">
                            <div className="pd-agent-header">
                                <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=100&q=80" alt="Agency" style={{ height: '30px' }} />
                                <span>{property.sellerId?.name ? `${property.sellerId.name}'s Listing` : 'Property Agent'}</span>
                            </div>

                            <div className="text-center mb-4">
                                <p className="mb-1 fw-bold">{property.sellerId?.name || "Private Seller"}</p>
                                <p className="text-secondary small">
                                    {property.sellerId?.phone ? "Verified Seller" : "Contact for details"}
                                </p>
                            </div>

                            <button className="pd-contact-btn btn-call" onClick={() => handleContactClick('call', () => setIsContactModalOpen(true))}>
                                <FaPhone /> Call
                            </button>
                            <button className="pd-contact-btn btn-email" onClick={() => handleContactClick('email', () => setIsEmailModalOpen(true))}>
                                <FaEnvelope /> Send Email
                            </button>
                            <button className="pd-contact-btn btn-chat-live" onClick={() => handleContactClick('chat', () => {
                                openChatWith({
                                    sellerId: property.sellerId?._id || property.sellerId,
                                    propertyId: property._id,
                                    name: property.sellerId?.name || property.seller?.name || "Private Seller"
                                });
                            })}>
                                <FaComments /> Live Chat with Seller
                            </button>
                            <button className="pd-contact-btn btn-whatsapp" onClick={() => handleContactClick('whatsapp', () => {
                                if (property.whatsapp || property.sellerId?.phone) {
                                    const waNumber = (property.whatsapp || property.sellerId?.phone).replace(/[^0-9]/g, '');
                                    window.open(`https://wa.me/${waNumber}`, '_blank');
                                }
                            })}>
                                <FaWhatsapp /> WhatsApp
                            </button>


                            <hr className="my-4" />

                            <form onSubmit={handleInquirySubmit}>
                                <div className="mb-3">
                                    <input type="text" name="name" required className="form-control" placeholder="Name" />
                                </div>
                                <div className="mb-3">
                                    <input type="email" name="email" required className="form-control" placeholder="Email" />
                                </div>
                                <div className="mb-3">
                                    <input type="text" name="phone" required className="form-control" placeholder="Phone" />
                                </div>
                                <div className="mb-3">
                                    <textarea name="message" required className="form-control" rows="3" placeholder="Message"></textarea>
                                </div>
                                <button type="submit" className="btn btn-dark w-100 fw-bold">SEND EMAIL</button>
                            </form>
                        </div>

                        <div className="mt-4 p-4 bg-white border rounded">
                            <h5 className="fw-bold mb-3">Useful Links</h5>
                            <ul className="list-unstyled small text-secondary">
                                <li className="mb-2"><a href="#" className="text-decoration-none text-secondary">Property for sale in {property.city}</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Similar Properties (Dynamic) */}
                {relatedProperties.length > 0 && (
                    <div className="pd-similar-section mb-5">
                        <h3 className="pd-section-heading">More from this Seller</h3>
                        <div className="row">
                            {relatedProperties.map((prop) => (
                                <div key={prop._id} className="col-md-4 mb-3">
                                    <div className="card h-100 border-0 shadow-sm" onClick={() => navigate(`/property/${prop.slug || prop._id}`)} style={{ cursor: 'pointer' }}>
                                        <img
                                            src={prop.images && prop.images[0] ? (prop.images[0].startsWith('http') ? prop.images[0] : `${API_BASE_URL}/${prop.images[0]}`) : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=500&q=60'}
                                            className="card-img-top"
                                            alt={prop.title}
                                            style={{ height: '200px', objectFit: 'cover' }}
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title text-truncate">{prop.title}</h5>
                                            <p className="card-text text-success fw-bold">
                                                {prop.priceRange ? `PKR ${formatPrice(prop.priceRange.min)}` : `PKR ${formatPrice(prop.price)}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <Footer />

            <ContactModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                seller={property.sellerId}
                property={property}
                agency={property.sellerId?.companyName || "Zameen Agency"}
            />

            <EmailModal
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
                property={property}
            />
        </div>
    );
};

export default PropertyDetail;
