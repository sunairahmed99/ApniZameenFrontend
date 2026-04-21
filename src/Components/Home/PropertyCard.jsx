import React, { memo, useMemo } from 'react';
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import OptimizedImage from '../OptimizedImage';
import { API_BASE_URL } from '../../config';
import { getImageUrl } from '../../utils/formatters';
import { fetchPropertyDetail } from '../../hooks/useProperties';
import { fetchProjectDetail } from '../../hooks/useProjects';

const PropertyCard = ({ property }) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Handle different data structures (Project vs plain property)
    const title = property.name || property.title;

    // Memoize expensive calculations
    const { price, location, image, slug, isProject } = useMemo(() => {
        // Helper for strict number formatting
        const formatPrice = (price) => {
            if (!price) return "Contact for Price";
            const val = Number(price);
            if (isNaN(val)) return price;
            if (val >= 10000000) return `${(val / 10000000).toFixed(2)} Crore`;
            if (val >= 100000) return `${(val / 100000).toFixed(2)} Lakh`;
            return val.toLocaleString();
        };

        const calculatedPrice = property.priceRange
            ? `PKR ${formatPrice(property.priceRange.min)} - ${formatPrice(property.priceRange.max)}`
            : `PKR ${formatPrice(property.price)}`;

        const calculatedImage = property.thumbnail || property.mainImage || (property.images && property.images.length > 0 ? property.images[0] : null) || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';

        const finalImage = getImageUrl(calculatedImage);

        const calculatedLocation = property.city ? `${property.areaName || property.location || ''}, ${property.city}` : property.location;

        const calculatedSlug = property.slug || property.id;
        const calculatedIsProject = !!property.projectTypes;

        return {
            price: calculatedPrice,
            location: calculatedLocation,
            image: finalImage,
            slug: calculatedSlug,
            isProject: calculatedIsProject
        };
    }, [property]);

    const handlePrefetch = () => {
        if (isProject) {
            queryClient.prefetchQuery({
                queryKey: ['project', slug],
                queryFn: () => fetchProjectDetail(slug),
                staleTime: 10 * 60 * 1000,
            });
        } else {
            queryClient.prefetchQuery({
                queryKey: ['property', slug],
                queryFn: () => fetchPropertyDetail(slug),
                staleTime: 5 * 60 * 1000,
            });
        }
    };

    const handleClick = () => {
        if (isProject) {
            navigate(`/project/${slug}`);
        } else {
            navigate(`/property/${slug}`);
        }
    };

    return (
        <div
            className="card h-100 shadow-sm border-0 property-card hover-lift"
            onClick={handleClick}
            onMouseEnter={handlePrefetch}
            style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
        >
            <div className="position-relative overflow-hidden rounded-top" style={{ paddingTop: '60%' }}>
                <OptimizedImage
                    src={image}
                    alt={title}
                    width={400}
                    height={240}
                    className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
                    style={{ transition: 'transform 0.5s' }}
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div className="position-absolute top-0 end-0 m-2 badge bg-success">
                    {property.status || 'For Sale'}
                </div>
                {property.isTitanium && (
                    <div className="position-absolute top-0 start-0 m-2 badge" style={{ background: 'linear-gradient(45deg, #FFD700, #FFA500)', color: '#000', fontWeight: '800' }}>
                        <i className="fas fa-crown me-1"></i> TITANIUM
                    </div>
                )}
            </div>
            <div className="card-body">
                <h5 className="card-title text-truncate fw-bold mb-1">{title}</h5>
                <p className="card-text text-muted small mb-2">
                    <FaMapMarkerAlt className="me-1 text-success" />
                    {location}
                </p>
                <h6 className="fw-bold text-success mb-3">{price}</h6>

                {/* Features (if available) - mostly for individual properties, generally projects have ranges */}
                <div className="d-flex justify-content-between border-top pt-2 small text-muted">
                    {property.beds && (
                        <span><FaBed className="me-1" /> {property.beds} Beds</span>
                    )}
                    {property.baths && (
                        <span><FaBath className="me-1" /> {property.baths} Baths</span>
                    )}
                    {property.sizeRange ? (
                        <span><FaRulerCombined className="me-1" /> {property.sizeRange.min} - {property.sizeRange.max} {property.sizeRange.unit}</span>
                    ) : (
                        (property.areaSize || property.area) && <span><FaRulerCombined className="me-1" /> {property.areaSize || property.area?.value} {property.areaUnit || property.area?.unit}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default memo(PropertyCard);
