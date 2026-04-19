import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import { useAgenciesList } from '../../hooks/usePublicFeatures';
import { useLocations } from '../../hooks/useLocations';
import './TitaniumAgencies.css';
import './CityTabs.css';
import { AgencyPageCardSkeleton } from '../Common/Skeleton';
import OptimizedImage from '../OptimizedImage';
import { API_BASE_URL } from '../../config';

const TitaniumAgencies = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // 3 rows x 4 columns

  // Fetch dynamic cities
  const { data: locationData = [] } = useLocations({ type: 'city' });

  const cities = React.useMemo(() => {
    const rawCities = locationData.map(c => c.name);
    if (rawCities.length === 0) return ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad'];

    const mainCities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad'];
    const existingMain = mainCities.filter(c => rawCities.includes(c));
    const others = rawCities.filter(c => !mainCities.includes(c)).sort();

    return existingMain.length > 0 ? [...existingMain, ...others] : rawCities.sort();
  }, [locationData]);

  const [selectedCity, setSelectedCity] = useState(cities[0] || 'Karachi');

  // Update city if list changes
  useEffect(() => {
    if (cities.length > 0 && !cities.includes(selectedCity)) {
      setSelectedCity(cities[0]);
    }
  }, [cities, selectedCity]);

  // Fetch agencies using React Query
  const { data: agencies = [], isLoading: loading } = useAgenciesList({
    titanium: true,
    status: 'active',
    city: selectedCity
  });

  useEffect(() => {
    setCurrentPage(1); // Reset to first page on city change
  }, [selectedCity]);

  // Pagination Logic
  const totalPages = Math.ceil(agencies.length / itemsPerPage);
  const paginatedAgencies = agencies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Smooth scroll to top of section
    const section = document.querySelector('.agent-titanium-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);

      if (start === 1) {
        end = maxVisiblePages;
      } else if (end === totalPages) {
        start = totalPages - maxVisiblePages + 1;
      }

      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  return (
    <div className="agent-titanium-section py-4">
      <div className="container">
        <h3 className="mb-4 fw-bold">Titanium Agencies</h3>

        {/* City Tabs Slider */}
        <div className="project-city-tabs-container mb-4">
          <button className="city-nav-btn left" onClick={() => {
            const el = document.querySelector('.agent-titanium-section .city-tabs-scroll-wrapper');
            el?.scrollBy({ left: -200, behavior: 'smooth' });
          }}><FaChevronLeft /></button>

          <div className="city-tabs-scroll-wrapper">
            <div className="project-city-tabs d-flex gap-2">
              {cities.map((city) => (
                <button
                  key={city}
                  className={`project-city-tab ${selectedCity === city ? 'active' : ''}`}
                  onClick={() => setSelectedCity(city)}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <button className="city-nav-btn right" onClick={() => {
            const el = document.querySelector('.agent-titanium-section .city-tabs-scroll-wrapper');
            el?.scrollBy({ left: 200, behavior: 'smooth' });
          }}><FaChevronRight /></button>
        </div>

        {loading ? (
          <div className="row g-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="col-lg-3 col-md-6">
                <AgencyPageCardSkeleton />
              </div>
            ))}
          </div>
        ) : (
          <div className="position-relative">
            <div className="row g-3">
              {paginatedAgencies.map((agent) => (
                <div className="col-lg-3 col-md-6 col-6" key={agent._id}>
                  <div
                    className="agent-titanium-card bg-white p-3 rounded h-100 d-flex align-items-center"
                    onClick={() => navigate(`/agency/${agent._id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="agent-logo-wrapper me-3">
                      <OptimizedImage
                        src={agent.logo?.startsWith('http') ? agent.logo : `${API_BASE_URL}/${agent.logo?.replace(/\\/g, '/')}`}
                        alt={agent.name}
                        width={80}
                        height={80}
                        className="img-fluid rounded"
                        onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(agent.name) + "&background=random"; }}
                      />
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="fw-bold mb-1" title={agent.name} style={{ lineHeight: '1.2', wordWrap: 'break-word' }}>{agent.name}</h6>
                      <div className="agent-stats mb-1 small text-muted text-truncate">
                        <span className="me-1">{agent.forSale || 0} for Sale</span>
                        <span className="mx-1">|</span>
                        <span className="ms-1">{agent.forRent || 0} for Rent</span>
                      </div>
                      <div className="text-success small text-truncate mb-1">
                        <FaMapMarkerAlt className="me-1" />
                        {agent.city}
                      </div>
                      <div className="text-primary small text-truncate">
                        <FaPhoneAlt className="me-1" />
                        {agent.phone}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {agencies.length === 0 && (
              <div className="alert alert-light text-center border shadow-sm py-4">
                <p className="mb-0 text-muted">No Titanium Agencies found in {selectedCity}.</p>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination-container-v2 d-flex justify-content-center align-items-center mt-5 gap-2">
                <button
                  className="pagination-btn-v2"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <FaChevronLeft />
                </button>

                {currentPage > 3 && totalPages > 5 && (
                  <>
                    <button className="pagination-btn-v2" onClick={() => handlePageChange(1)}>1</button>
                    {currentPage > 4 && <span className="px-2">...</span>}
                  </>
                )}

                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    className={`pagination-btn-v2 ${currentPage === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}

                {currentPage < totalPages - 2 && totalPages > 5 && (
                  <>
                    {currentPage < totalPages - 3 && <span className="px-2">...</span>}
                    <button className="pagination-btn-v2" onClick={() => handlePageChange(totalPages)}>{totalPages}</button>
                  </>
                )}

                <button
                  className="pagination-btn-v2"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(TitaniumAgencies);
