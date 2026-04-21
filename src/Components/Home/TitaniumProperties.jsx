import React, { useState, useRef } from 'react';
import { FaCrown, FaAngleLeft, FaAngleRight, FaPhone, FaEnvelope, FaWhatsapp, FaComments } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useProperties, useCreateLead } from '../../hooks/useProperties';
import { PropertyCardSkeleton } from '../Common/Skeleton';
import { useSocket } from '../../context/SocketContext';
import { getImageUrl } from '../../utils/formatters';
import OptimizedImage from '../OptimizedImage';
import ContactModal from '../ContactModal';
import EmailModal from '../EmailModal';
import AuthModal from '../AuthModal/AuthModal';
import './TitaniumProperties.css';

const formatShortPrice = (price) => {
    if (!price) return 'Contact';
    const val = Number(price);
    if (isNaN(val)) return price;
    if (val >= 10000000) {
        return `${(val / 10000000).toFixed(1).replace(/\.0$/, '')} Crore`;
    } else if (val >= 100000) {
        return `${(val / 100000).toFixed(1).replace(/\.0$/, '')} Lac`;
    }
    return val.toLocaleString();
};

const TitaniumPropertyItem = ({ property }) => {
    const { user } = useSelector((state) => state.auth);
    const { openChatWith } = useSocket();
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const createLeadMutation = useCreateLead();

    const handleContactAction = async (type, callback) => {
        const leadKey = `lead_sent_${property._id}`;
        if (!localStorage.getItem(leadKey)) {
            try {
                await createLeadMutation.mutateAsync(property._id);
                localStorage.setItem(leadKey, 'true');
            } catch (err) { }
        }
        if (callback) callback();
    };

    const imageSrc = getImageUrl(property.images && property.images.length > 0 ? property.images[0] : null);

    return (
        <div className="titanium-property-card">
            <div className="card-inner">
                <Link to={`/property/${property._id}`} className="text-decoration-none">
                    <div className="image-wrapper">
                        <OptimizedImage src={imageSrc} alt={property.title} className="main-img" />
                        <div className="titanium-badge">
                            <FaCrown className="me-1" /> TITANIUM
                        </div>
                        <div className="price-overlay">
                            PKR {formatShortPrice(property.price)}
                        </div>
                    </div>
                    <div className="card-content p-3">
                        <h6 className="property-title text-truncate mb-1">{property.title}</h6>
                        <p className="property-location text-muted small mb-2 text-truncate">
                            <i className="fas fa-map-marker-alt me-1"></i> {property.areaName}, {property.city}
                        </p>
                        <div className="property-specs d-flex gap-3 text-muted">
                            <span><i className="fas fa-bed"></i> {property.bedrooms || '-'}</span>
                            <span><i className="fas fa-bath"></i> {property.bathrooms || '-'}</span>
                            <span><i className="fas fa-vector-square"></i> {property.area?.value} {property.area?.unit}</span>
                        </div>
                    </div>
                </Link>
                <div className="card-footer-actions d-flex border-top">
                    <button onClick={() => handleContactAction('call', () => setIsContactModalOpen(true))} className="action-btn call"><FaPhone /></button>
                    <button onClick={() => handleContactAction('whatsapp', () => {
                        const waNumber = property.whatsapp || property.phone;
                        if (waNumber) window.open(`https://wa.me/${waNumber.replace(/[^0-9]/g, '')}`, '_blank');
                    })} className="action-btn wa"><FaWhatsapp /></button>
                    <button onClick={() => {
                        if (!user) { setIsAuthModalOpen(true); return; }
                        openChatWith({ sellerId: property.sellerId?._id || property.sellerId, propertyId: property._id, name: property.seller?.name || "Seller" });
                    }} className="action-btn chat"><FaComments /></button>
                </div>
            </div>

            <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} seller={property.sellerId} property={property} />
            <EmailModal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} property={property} />
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </div>
    );
};

const TitaniumProperties = () => {
    const scrollRef = useRef(null);
    const { data: properties = [], isLoading } = useProperties({ titanium: 'true', limit: 8 });

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 320;
            scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    if (!isLoading && properties.length === 0) return null;

    return (
        <div className="titanium-properties-section py-5">
            <div className="container">
                <div className="section-header d-flex justify-content-between align-items-end mb-4">
                    <div>
                        <h2 className="section-title mb-1">Titanium Properties</h2>
                        <p className="section-subtitle text-muted mb-0">Premium listings from our top-tier partners</p>
                    </div>
                    <div className="nav-controls d-none d-md-flex gap-2">
                        <button className="nav-btn" onClick={() => scroll('left')}><FaAngleLeft /></button>
                        <button className="nav-btn" onClick={() => scroll('right')}><FaAngleRight /></button>
                    </div>
                </div>

                <div className="properties-slider-wrapper position-relative">
                    <div className="properties-slider" ref={scrollRef}>
                        {isLoading ? (
                            [1, 2, 3, 4].map(i => <PropertyCardSkeleton key={i} />)
                        ) : (
                            properties.map(p => <TitaniumPropertyItem key={p._id} property={p} />)
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TitaniumProperties;
