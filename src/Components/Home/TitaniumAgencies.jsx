import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import { useFeaturedAgencies } from '../../hooks/useAgencies';
import { useLocations } from '../../hooks/useLocations';
import './TitaniumAgencies.css';
import { AgencySkeleton } from '../Common/Skeleton';
import { API_BASE_URL } from '../../config';
import { getImageUrl } from '../../utils/formatters';
import OptimizedImage from '../OptimizedImage';

import { useNavigate } from 'react-router-dom';

const TitaniumAgencies = () => {
  const navigate = useNavigate();
  const [startIndex, setStartIndex] = useState(0);

  // Fetch dynamic cities
  const { data: locationData = [] } = useLocations({ type: 'city' });

  const cities = React.useMemo(() => {
    const rawCities = locationData.map(c => c.name);
    if (rawCities.length === 0) return ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Peshawar', 'Faisalabad'];

    const mainCities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad'];
    const existingMain = mainCities.filter(c => rawCities.includes(c));
    const others = rawCities.filter(c => !mainCities.includes(c)).sort();

    return existingMain.length > 0 ? [...existingMain, ...others] : rawCities.sort();
  }, [locationData]);

  const [activeCity, setActiveCity] = useState(cities[0] || 'Karachi');

  // Update city if list changes
  useEffect(() => {
    if (cities.length > 0 && !cities.includes(activeCity)) {
      setActiveCity(cities[0]);
    }
  }, [cities]);

  useEffect(() => {
    setStartIndex(0);
  }, [activeCity]);

  const { data: agencies = [], isLoading: loading } = useFeaturedAgencies(activeCity);
  const itemsPerPage = 8; // Show 8 agencies at once (2 rows x 4 columns on desktop)
  const slideBy = 8; // Slide by 8 agencies

  const handleNext = () => {
    if (startIndex + itemsPerPage < agencies.length) {
      setStartIndex(prev => prev + slideBy);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(prev => Math.max(0, prev - slideBy));
    }
  };

  const visibleAgencies = agencies.slice(startIndex, startIndex + itemsPerPage);
  const showLeftArrow = startIndex > 0;
  const showRightArrow = startIndex + itemsPerPage < agencies.length;

  return (
    <div className="titanium-section py-5">
      <div className="container">
        {/* Main Section Heading */}
        <div className="text-center mb-4">
          <h2 className="titanium-heading fw-bold" style={{ color: '#1a1a1a', fontSize: '32px', marginBottom: '8px' }}>
            Titanium Agencies
          </h2>
          <p className="titanium-subtitle" style={{ color: '#666', fontSize: '16px', marginBottom: '20px' }}>
            Premium real estate agencies trusted by thousands
          </p>
        </div>

        {/* City Tabs Slider */}
        <div className="city-tabs-container position-relative mb-4">
          <button className="city-nav-btn left" onClick={() => {
            const el = document.querySelector('.titanium-section .city-tabs-scroll-wrapper');
            el?.scrollBy({ left: -200, behavior: 'smooth' });
          }} aria-label="Scroll cities left"><FaChevronLeft /></button>

          <div className="city-tabs-scroll-wrapper">
            <div className="city-tabs d-flex gap-2">
              {cities.map((city) => (
                <button
                  key={city}
                  className={`city-tab ${activeCity === city ? 'active' : ''}`}
                  onClick={() => setActiveCity(city)}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <button className="city-nav-btn right" onClick={() => {
            const el = document.querySelector('.titanium-section .city-tabs-scroll-wrapper');
            el?.scrollBy({ left: 200, behavior: 'smooth' });
          }} aria-label="Scroll cities right"><FaChevronRight /></button>
        </div>

        {loading ? (
          <div className="agencies-grid">
            {[1, 2, 3, 4].map(i => <AgencySkeleton key={i} />)}
          </div>
        ) : agencies.length > 0 ? (
          <div className="position-relative agencies-scroll-wrapper">
            {/* Left Arrow */}
            {showLeftArrow && (
              <button
                className="agency-arrow left-arrow btn btn-white shadow-sm rounded-circle"
                onClick={handlePrev}
                aria-label="Slide agencies left"
              >
                <FaChevronLeft />
              </button>
            )}

            <div className="agencies-grid">
              {visibleAgencies.map((agency, index) => (
                <div key={agency._id || index} className="agency-item">
                  <div
                    className="agency-card bg-white p-3 rounded border h-100"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/agency/${agency._id}`)}
                  >
                    <div className="agency-logo">
                      <OptimizedImage
                        src={getImageUrl(agency.logo)}
                        alt={agency.name || 'Agency Logo'}
                        width={80}
                        height={60}
                        loading="lazy"
                        className="img-fluid rounded"
                        style={{ maxWidth: '80px', maxHeight: '60px', objectFit: 'contain' }}
                      />
                    </div>
                    <div className="agency-info">
                      <h6 className="fw-bold mb-1" style={{ fontSize: '14px' }}>{agency.name}</h6>
                      <p className="text-muted small mb-1">
                        <FaMapMarkerAlt className="me-1 text-success" size={12} />
                        {agency.city}
                      </p>
                      <p className="text-primary small mb-0 fw-500" style={{ fontSize: '11px' }}>
                        <FaPhoneAlt className="me-1" size={10} />
                        {agency.phone}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            {showRightArrow && (
              <button
                className="agency-arrow right-arrow btn btn-white shadow-sm rounded-circle"
                onClick={handleNext}
                aria-label="Slide agencies right"
              >
                <FaChevronRight />
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-4 text-muted">
            No titanium agencies found in {activeCity}.
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(TitaniumAgencies);
