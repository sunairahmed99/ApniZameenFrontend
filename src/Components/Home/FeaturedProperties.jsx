import React, { useState, useRef, useEffect } from 'react';
import { FaFire, FaAngleLeft, FaAngleRight, FaPhone, FaEnvelope, FaWhatsapp, FaComments } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useProperties, useCreateLead, fetchPropertyDetail } from '../../hooks/useProperties';
import { useLocations } from '../../hooks/useLocations';
import { PropertyCardSkeleton } from '../Common/Skeleton';
import { useSocket } from '../../context/SocketContext';
import { API_BASE_URL } from '../../config';
import ContactModal from '../ContactModal';
import EmailModal from '../EmailModal';
import AuthModal from '../AuthModal/AuthModal';
import OptimizedImage from '../OptimizedImage';
import './FeaturedProperties.css';

// Helper for price formatting (kept here as it's UI specific)
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

const getDaysAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return 'yesterday';
    return `${diffDays} days ago`;
};

const CityTabs = ({ activeCity, onCityChange, cities }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 200;
            scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="city-tabs-container position-relative mb-4">
            <button className="city-nav-btn left" onClick={() => scroll('left')} aria-label="Scroll cities left"><FaAngleLeft /></button>
            <div className="city-tabs-scroll-wrapper" ref={scrollRef}>
                <div className="city-tabs">
                    {cities.map((city) => (
                        <button
                            key={city}
                            className={`city-tab ${activeCity === city ? 'active' : ''}`}
                            onClick={() => onCityChange(city)}
                        >
                            {city}
                        </button>
                    ))}
                </div>
            </div>
            <button className="city-nav-btn right" onClick={() => scroll('right')} aria-label="Scroll cities right"><FaAngleRight /></button>
        </div>
    );
};

const PropertyItem = ({ property, onPrefetch }) => {
    const { user } = useSelector((state) => state.auth);
    const { openChatWith } = useSocket();
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
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

    let imageSrc = property.images && property.images.length > 0
        ? property.images[0]
        : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';

    if (imageSrc && !imageSrc.startsWith('http')) {
        imageSrc = `${API_BASE_URL}/${imageSrc.replace(/\\/g, '/')}`;
    }

    return (
        <div className="featured-property-card-wrapper h-100 text-decoration-none">
            <div className="featured-property-card">
                <Link
                    to={`/property/${property._id}`}
                    className="text-decoration-none text-reset"
                    onMouseEnter={() => onPrefetch(property._id)}
                >
                    <div className="property-image-container">
                        <OptimizedImage 
                            src={imageSrc} 
                            alt={property.title || 'Property Image'} 
                            width={400} 
                            height={300} 
                            loading="lazy" 
                            className="property-main-img"
                        />
                        {property.images && property.images.length > 1 && (
                            <div className="image-count">
                                <i className="fas fa-camera"></i> {property.images.length}
                            </div>
                        )}
                        <div className="fav-icon">
                            <i className="far fa-heart text-white"></i>
                        </div>
                    </div>

                    <div className="property-details">
                        <div className="property-header">
                            <div className="price-tag">
                                PKR <span className="price-val">{formatShortPrice(property.price)}</span>
                            </div>
                            <div className="property-type-badge">
                                <span className="dot"></span> {property.propertyType}
                            </div>
                        </div>

                        <div className="property-specs my-2 d-flex gap-3 text-muted small">
                            <span><i className="fas fa-bed"></i> {property.bedrooms || '-'} Beds</span>
                            <span><i className="fas fa-bath"></i> {property.bathrooms || '-'} Baths</span>
                            <span><i className="fas fa-vector-square"></i> {property.area?.value} {property.area?.unit}</span>
                        </div>

                        <h6 className="property-title text-dark mb-1 text-truncate">{property.title || `${property.areaName}, ${property.city}`}</h6>

                        <div className="seller-agency-info mt-1 mb-2">
                            <span className="text-muted" style={{ fontSize: '11px', fontWeight: '500' }}>
                                <i className="fas fa-user-circle me-1"></i>
                                {property.seller?.name || 'Private Seller'}
                                {property.agency?.name && (
                                    <span className="ms-1 ps-1 border-start">
                                        <i className="fas fa-building me-1 ms-1"></i>
                                        {property.agency.name}
                                    </span>
                                )}
                            </span>
                        </div>

                        <p className="property-added text-muted small" style={{ fontSize: '10px' }}>
                            Added {getDaysAgo(property.createdAt)}
                        </p>
                    </div>
                </Link>

                <div className="property-actions d-flex gap-1 p-2 border-top justify-content-between bg-light">
                    <button
                        className="btn btn-sm btn-white border flex-grow-1 text-success fw-bold"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleContactAction('call', () => setIsContactModalOpen(true)); }}
                        aria-label="Call Seller"
                    >
                        <FaPhone />
                    </button>
                    <button
                        className="btn btn-sm btn-white border flex-grow-1 text-success fw-bold"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleContactAction('email', () => setIsEmailModalOpen(true)); }}
                        aria-label="Email Seller"
                    >
                        <FaEnvelope />
                    </button>
                    <button
                        className="btn btn-sm btn-white border flex-grow-1 text-success fw-bold"
                        onClick={(e) => {
                            e.preventDefault();
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
                        <FaWhatsapp />
                    </button>
                    <button
                        className="btn btn-sm btn-white border flex-grow-1 text-primary fw-bold"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!user) { setIsAuthModalOpen(true); return; }
                            if (user._id === property.seller?._id || user._id === property.seller) { alert("You cannot chat with yourself"); return; }
                            openChatWith({ 
                                sellerId: property.seller?._id || property.seller, 
                                propertyId: property._id,
                                name: property.seller?.name || property.sellerId?.name || "Private Seller"
                            });
                        }}
                        aria-label="Chat with Seller"
                    >
                        <FaComments />
                    </button>
                </div>
            </div>

            <ContactModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                seller={property.seller}
                property={property}
                agency={property.agency?.name || "Apni Zameen Agency"}
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

const PropertySection = ({ title, properties, loading, activeCity, onCityChange, cities, onPrefetch }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 300;
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    return (
        <div className="property-section mb-5">
            <h2 className="section-title mb-3" style={{ fontSize: '24px', fontWeight: '700', color: '#333' }}>
                {title}
            </h2>

            <CityTabs activeCity={activeCity} onCityChange={onCityChange} cities={cities} />

            {loading ? (
                <div className="properties-grid">
                    {[1, 2, 3, 4].map(i => <PropertyCardSkeleton key={i} />)}
                </div>
            ) : properties.length > 0 ? (
                <div className="properties-grid-wrapper position-relative">
                    <button className="nav-arrow left-arrow" onClick={() => scroll('left')} aria-label="Slide properties left">
                        <FaAngleLeft />
                    </button>
                    <button className="nav-arrow right-arrow" onClick={() => scroll('right')} aria-label="Slide properties right">
                        <FaAngleRight />
                    </button>

                    <div className="properties-grid" ref={scrollRef}>
                        {properties.map((property, index) => (
                            <PropertyItem key={`${property._id}-${index}`} property={property} onPrefetch={onPrefetch} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-4 text-muted">No properties found in {activeCity}.</div>
            )}
        </div>
    );
};

const FeaturedProperties = () => {
    const queryClient = useQueryClient();

    // Fetch dynamic cities
    const { data: locationData = [] } = useLocations({ type: 'city' });

    const cities = React.useMemo(() => {
        const rawCities = locationData.map(c => c.name);
        if (rawCities.length === 0) return ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad'];

        const mainCities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad'];
        const sorted = [...new Set([...mainCities, ...rawCities])]
            .filter(c => rawCities.includes(c) || mainCities.includes(c)); // Ensure we only keep existing ones OR at least the fallback ones if needed

        // Actually, just sort what we have:
        const existingMain = mainCities.filter(c => rawCities.includes(c));
        const others = rawCities.filter(c => !mainCities.includes(c)).sort();

        return existingMain.length > 0 ? [...existingMain, ...others] : rawCities.sort();
    }, [locationData]);

    // Rent State
    const [rentCity, setRentCity] = useState(cities[0] || 'Karachi');

    // Sale State
    const [saleCity, setSaleCity] = useState(cities[0] || 'Karachi');

    // Update city if list changes
    useEffect(() => {
        if (cities.length > 0) {
            if (!cities.includes(rentCity)) setRentCity(cities[0]);
            if (!cities.includes(saleCity)) setSaleCity(cities[0]);
        }
    }, [cities]);

    // Handlers
    const handlePrefetch = (idOrSlug) => {
        queryClient.prefetchQuery({
            queryKey: ['property', idOrSlug],
            queryFn: () => fetchPropertyDetail(idOrSlug),
            staleTime: 5 * 60 * 1000,
        });
    };

    // Use React Query for Rent Properties
    const { data: rentProperties = [], isLoading: loadingRent } = useProperties({ purpose: 'For Rent', city: rentCity, featured: true, limit: 10 }, { keepPreviousData: true });

    // Use React Query for Sale Properties
    const { data: saleProperties = [], isLoading: loadingSale } = useProperties({ purpose: 'For Sale', city: saleCity, featured: true, limit: 10 }, { keepPreviousData: true });

    return (
        <div className="featured-properties-section py-5 bg-white">
            <div className="container">
                <PropertySection
                    title="Featured Properties for Rent"
                    properties={rentProperties}
                    loading={loadingRent}
                    activeCity={rentCity}
                    onCityChange={setRentCity}
                    cities={cities}
                    onPrefetch={handlePrefetch}
                />

                <div className="my-5"></div> {/* Spacer */}

                <PropertySection
                    title="Featured Properties for Sale"
                    properties={saleProperties}
                    loading={loadingSale}
                    activeCity={saleCity}
                    onCityChange={setSaleCity}
                    cities={cities}
                    onPrefetch={handlePrefetch}
                />
            </div>
        </div>
    );
};

export default FeaturedProperties;

