import React, { useState, memo } from 'react';
import { FaBed, FaBath, FaRulerCombined, FaPhone, FaEnvelope, FaCamera, FaCheckCircle, FaFire, FaWhatsapp, FaComments } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from '../../context/SocketContext';
import ContactModal from '../ContactModal';
import EmailModal from '../EmailModal'; // Import new modal
import AuthModal from '../../Components/AuthModal/AuthModal';
import { useCreateLead, fetchPropertyDetail } from '../../hooks/useProperties';
import { API_BASE_URL } from '../../config';
import OptimizedImage from '../OptimizedImage';
import './HorizontalPropertyCard.css';

const HorizontalPropertyCard = ({ property }) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { openChatWith, user } = useSocket();
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false); // Email Modal state
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); // Auth Modal state

    const prefetchProperty = () => {
        const idOrSlug = property.slug || property._id || property.id;
        queryClient.prefetchQuery({
            queryKey: ['property', idOrSlug],
            queryFn: () => fetchPropertyDetail(idOrSlug),
            staleTime: 5 * 60 * 1000,
        });
    };

    // Data handling
    const title = property.name || property.title;
    // Helper for strict number formatting
    const formatPrice = (price) => {
        if (!price) return "Contact for Price";
        const val = Number(price);
        if (isNaN(val)) return price;
        if (val >= 10000000) return `${(val / 10000000).toFixed(2)} Crore`;
        if (val >= 100000) return `${(val / 100000).toFixed(2)} Lakh`;
        return val.toLocaleString();
    };

    const price = property.priceRange
        ? `PKR ${formatPrice(property.priceRange.min)} - ${formatPrice(property.priceRange.max)}`
        : `PKR ${formatPrice(property.price)}`;

    const location = property.city ? `${property.areaName || property.location || ''}, ${property.city}` : property.location;

    let image = property.thumbnail || property.mainImage || (property.images && property.images.length > 0 ? property.images[0] : null) || 'https://via.placeholder.com/600x400';

    if (image && !image.startsWith('http')) {
        image = `${API_BASE_URL}/${image.replace(/\\/g, '/')}`;
    }
    const slug = property.slug || property._id || property.id;

    // Formatting added/updated time (Mock logic if real data isn't parsing specifically)
    const timeAdded = "13 minutes ago";

    const handleClick = () => {
        // Navigate to details
        const typePath = property.projectTypes ? 'project' : 'property';
        navigate(`/${typePath}/${slug}`);
    };

    const createLeadMutation = useCreateLead();

    const handleContactAction = async (type, callback) => {
        const leadKey = `lead_sent_${property._id || property.id}`;
        if (!localStorage.getItem(leadKey)) {
            try {
                await createLeadMutation.mutateAsync(property._id || property.id);
                localStorage.setItem(leadKey, 'true');
            } catch (err) {  }
        }
        if (callback) callback();
    };

    return (
        <div
            className="card mb-4 border-0 shadow-sm overflow-hidden hover-bg-light"
            style={{ transition: 'all 0.3s ease' }}
            onMouseEnter={prefetchProperty}
        >
            <div className="row g-0">
                {/* Image Section */}
                <div className="col-md-4 position-relative">
                    <div
                        className="w-100" // Removed h-100 to stop stretching
                        style={{ height: '260px', cursor: 'pointer' }} // Fixed height
                        onClick={handleClick}
                    >
                        <OptimizedImage
                            src={image}
                            alt={title || 'Property Image'}
                            width={400}
                            height={260}
                            className="img-fluid w-100 h-100"
                            loading="lazy"
                            style={{ objectFit: 'cover' }}
                        />

                        {/* Boosted/Super Hot Badge */}
                        {property.isBoosted && (
                            <div className="position-absolute top-0 start-0 m-2">
                                <span className="badge bg-danger rounded-1 text-uppercase fw-bold px-2 py-1" style={{ fontSize: '0.75rem' }}>
                                    Super Hot
                                </span>
                            </div>
                        )}

                        {/* Camera/Media Count */}
                        <div className="position-absolute bottom-0 start-0 m-2">
                            <span className="badge bg-dark bg-opacity-75 rounded-1">
                                <FaCamera className="me-1" /> {property.images?.length || 8}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="col-md-8">
                    <div className="card-body d-flex flex-column h-100 p-3">

                        {/* Header: Badges & Icons */}
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div className="d-flex gap-2">
                                {/* Fire Icon/Verified etc */}
                                <FaFire className="text-danger fs-5" title="Popular" />
                                <FaCheckCircle className="text-success fs-5" title="Verified" />
                            </div>
                            <div>
                                {property.isTitanium && (
                                    <span className="badge d-flex align-items-center gap-1" style={{ background: 'linear-gradient(45deg, #FFD700, #FFA500)', color: '#000', fontWeight: '800' }}>
                                        <i className="fas fa-crown"></i> <span>TITANIUM</span>
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Price & Location */}
                        <h3 className="fw-bold mb-1" style={{ color: '#2b2b2b' }}>{price}</h3>
                        <p className="text-muted mb-3 fs-6">{location}</p>

                        {/* Features: Beds, Baths, Area */}
                        <div className="d-flex align-items-center gap-4 mb-3 text-dark fw-bold small">
                            {property.beds && (
                                <div className="d-flex align-items-center">
                                    <FaBed className="me-2 text-muted" size={18} />
                                    <span>{property.beds} Beds</span>
                                </div>
                            )}
                            {property.baths && (
                                <div className="d-flex align-items-center">
                                    <FaBath className="me-2 text-muted" size={18} />
                                    <span>{property.baths} Baths</span>
                                </div>
                            )}
                            {(property.areaSize || property.area || property.sizeRange) && (
                                <div className="d-flex align-items-center">
                                    <FaRulerCombined className="me-2 text-muted" size={18} />
                                    <span>
                                        {property.sizeRange
                                            ? `${property.sizeRange.min} - ${property.sizeRange.max} ${property.sizeRange.unit}`
                                            : `${property.areaSize || property.area?.value} ${property.areaUnit || property.area?.unit}`}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Title & Description */}
                        <h5
                            className="fw-bold text-dark mb-1 text-truncate cursor-pointer"
                            onClick={handleClick}
                            title={title}
                        >
                            {title}
                        </h5>
                        <p className="text-muted small text-truncate mb-auto" style={{ maxWidth: '90%' }}>
                            {property.description || "Good location close to markaz park and main attractions..."}
                            <span className="text-primary ms-1" style={{ cursor: 'pointer' }} onClick={handleClick}>more</span>
                        </p>

                        {/* Seller Info & ID */}
                        <div className="d-flex justify-content-between align-items-center mb-2 pt-2 border-top mt-auto">
                            <div className="lh-1">
                                <div className="fw-bold small text-dark mb-1">{property.sellerId?.name || "Private Seller"}</div>
                                {property.sellerId?.companyName && <div className="text-primary fw-bold" style={{ fontSize: '0.75rem' }}>{property.sellerId.companyName}</div>}
                            </div>
                            <div className="text-muted" style={{ fontSize: '0.7rem' }}>ID: {property._id}</div>
                        </div>

                        {/* Footer: Time & Actions */}
                        <div className="">
                            <p className="text-muted x-small mb-2" style={{ fontSize: '0.75rem' }}>
                                Added: {timeAdded} (Updated: {timeAdded})
                            </p>

                            <div className="d-flex justify-content-between align-items-end">
                                <div className="property-actions-container">
                                    <button
                                        className="btn btn-outline-success d-flex align-items-center px-3 fw-bold btn-sm"
                                        style={{ borderRadius: '4px' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleContactAction('email', () => setIsEmailModalOpen(true));
                                        }}
                                        aria-label="Email Seller"
                                    >
                                        <FaEnvelope className="me-2" /> EMAIL
                                    </button>
                                    <button
                                        className="btn btn-success d-flex align-items-center px-3 fw-bold text-white btn-sm"
                                        style={{ borderRadius: '4px', background: '#28a745' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleContactAction('call', () => setIsContactModalOpen(true));
                                        }}
                                        aria-label="Call Seller"
                                    >
                                        <FaPhone className="me-2" /> CALL
                                    </button>
                                    <button
                                        className="btn btn-outline-success d-flex align-items-center px-3 fw-bold btn-sm"
                                        style={{ borderRadius: '4px', borderColor: '#25D366', color: '#25D366' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleContactAction('whatsapp', () => {
                                                const waNumber = property.whatsapp || property.phone;
                                                if (waNumber) {
                                                    const cleanNumber = waNumber.replace(/[^0-9]/g, '');
                                                    window.open(`https://wa.me/${cleanNumber}`, '_blank');
                                                } else {
                                                    alert("No WhatsApp number available");
                                                }
                                            });
                                        }}
                                        aria-label="WhatsApp Seller"
                                    >
                                        <FaWhatsapp className="me-2" /> WHATSAPP
                                    </button>
                                    <button
                                        className="btn btn-outline-primary d-flex align-items-center px-3 fw-bold btn-sm"
                                        style={{ borderRadius: '4px' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!user) {
                                                setIsAuthModalOpen(true); // Open AuthModal instead of alert
                                                return;
                                            }
                                            if (user._id === property.sellerId?._id || user._id === property.sellerId) {
                                                alert("You cannot chat with yourself");
                                                return;
                                            }
                                            openChatWith({ 
                                                sellerId: property.sellerId?._id || property.sellerId, 
                                                propertyId: property._id,
                                                name: property.sellerId?.name || property.seller?.name || "Private Seller"
                                            });
                                        }}
                                        aria-label="Chat with Seller"
                                    >
                                        <FaComments className="me-2" /> CHAT
                                    </button>
                                </div>

                                {/* Agency Logo (Placeholder if not in data) */}
                                <div className="d-none d-sm-block">
                                    <OptimizedImage
                                        src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=80&h=40&q=80"
                                        alt="Agency Logo"
                                        width={80}
                                        height={40}
                                        loading="lazy"
                                        className="img-fluid"
                                        style={{ maxHeight: '40px' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Icons (Bottom Right overlay in Image or here?) - Reference has them in Image bottom right */}
                    </div>
                </div>
            </div>

            {/* Absolute Action Icons on Image Bottom Right */}
            <div className="position-absolute" style={{ bottom: '10px', left: '35%', transform: 'translateX(-110%)', zIndex: 5 }}>
                {/* This layout adjustment depends on responsive behavior, sticking to card body for safer layout first, 
                     but reference image has heart/share on image. Moving them for accuracy. */}
            </div>
            {/* Re-implementing overlay interaction icons on the image for accuracy */}
            <div className="position-absolute text-white" style={{ top: '220px', left: '10px', zIndex: 2 }}>
                {/* Camera count handled above */}
            </div>

            <ContactModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                seller={property.sellerId}
                property={property}
                agency={property.sellerId?.companyName || "Zameen Agency"} // Fallback or add agency data field
            />

            <EmailModal
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
                property={property}
            />

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </div>
    );
};

export default memo(HorizontalPropertyCard);
