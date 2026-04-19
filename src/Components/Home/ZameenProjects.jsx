import React, { useState, useEffect } from 'react';
import { FaHome, FaVectorSquare, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useProjectsList } from '../../hooks/useProjects';
import { useLocations } from '../../hooks/useLocations';
import './ZameenProjects.css';
import { PropertyCardSkeleton } from '../Common/Skeleton';
import { API_BASE_URL } from '../../config';

const ZameenProjects = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const itemsPerPage = 6; // Restore missing constant
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

  const [activeCity, setActiveCity] = useState(cities[0] || 'Karachi');

  // Update city if list changes
  useEffect(() => {
    if (cities.length > 0 && !cities.includes(activeCity)) {
      setActiveCity(cities[0]);
    }
  }, [cities]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { data: rawProjects = [], isLoading: loading } = useProjectsList({ city: activeCity });
  const projects = rawProjects.filter(p => p.isActive);

  useEffect(() => {
    setStartIndex(0);
  }, [activeCity]);

  const handleNext = () => {
    if (startIndex + itemsPerPage < projects.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  // On mobile, show all, on desktop show itemsPerPage
  const projectsToRender = isMobile ? projects : projects.slice(startIndex, startIndex + itemsPerPage);

  const formatRange = (min, max, unit) => {
    if (!min && !max) return 'Contact for Price';
    const formatValue = (val) => {
      if (val >= 100) return (val / 100).toFixed(2) + ' Crore';
      return val + ' Lac';
    };
    if (min && max) return `PKR ${formatValue(min)} to ${formatValue(max)}`;
    if (min) return `From PKR ${formatValue(min)}`;
    return `Up to PKR ${formatValue(max)}`;
  };

  if (loading) {
    return (
      <div className="zameen-projects-section py-5 bg-white">
        <div className="container">
          <div className="row g-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="col-lg-4 col-md-6">
                <PropertyCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="zameen-projects-section py-5 bg-white">
      <div className="container">
        {/* Main Section Heading */}
        <div className="text-center mb-4">
          <h2 className="zameen-projects-heading fw-bold" style={{
            color: '#1a1a1a',
            fontSize: '36px',
            marginBottom: '12px',
            letterSpacing: '-0.5px'
          }}>
            <span style={{ color: '#1a1a1a' }}>Most Valuable Projects</span>
          </h2>
          <div style={{
            width: '60px',
            height: '4px',
            backgroundColor: '#0ea800',
            margin: '0 auto 15px',
            borderRadius: '2px'
          }}></div>
          <p className="zameen-projects-subtitle" style={{ color: '#555', fontSize: '18px', fontWeight: '400', maxWidth: '700px', margin: '0 auto' }}>
            Discover the most premium and high-yield real estate investments across Pakistan
          </p>
        </div>

        {/* City Tabs Slider */}
        <div className="city-tabs-container position-relative mb-4">
          <button className="city-nav-btn left" onClick={() => {
            const el = document.querySelector('.zameen-projects-section .city-tabs-scroll-wrapper');
            el?.scrollBy({ left: -200, behavior: 'smooth' });
          }}><FaChevronLeft /></button>

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
            const el = document.querySelector('.zameen-projects-section .city-tabs-scroll-wrapper');
            el?.scrollBy({ left: 200, behavior: 'smooth' });
          }}><FaChevronRight /></button>
        </div>

        <div className="d-flex justify-content-end align-items-center mb-3">
          <Link to="/new-projects" className="text-decoration-none fw-bold text-primary d-flex align-items-center view-all-link" style={{ fontSize: '14px' }}>
            View All <FaChevronRight className="ms-1" size={10} />
          </Link>
        </div>

        <div className="projects-scroll-wrapper">
          {/* Desktop Arrows */}
          {!isMobile && startIndex > 0 && (
            <button
              className="project-arrow left-arrow"
              onClick={handlePrev}
            >
              <FaChevronLeft />
            </button>
          )}

          <div className="row projects-row g-4">
            {projectsToRender.map((project) => {
              const priceDisplay = formatRange(project.priceRange?.min, project.priceRange?.max, '');
              const sizeDisplay = project.sizeRange?.min && project.sizeRange?.max
                ? `${project.sizeRange.min} - ${project.sizeRange.max} ${project.sizeRange.unit || 'Marla'}`
                : 'Contact for Size';
              const locationDisplay = `${project.city}${project.area ? ', ' + project.area : ''}`;
              const typeDisplay = project.projectTypes ? project.projectTypes.join(', ') : 'Mixed Use';

              const imageSrc = project.thumbnail
                ? project.thumbnail.startsWith('http') ? project.thumbnail : `${API_BASE_URL}/${project.thumbnail.replace(/\\/g, '/')}`
                : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';

              return (
                <div key={project._id} className="project-column">
                  <Link to={`/project-zameen/${project._id}`} className="text-decoration-none">
                    <div className="project-card-refined">
                      <div className="project-img-container">
                        <img src={imageSrc} alt={project.name} loading="lazy" />
                        {project.isHot && (
                          <span className="hot-tag">HOT</span>
                        )}
                      </div>
                      <div className="project-details">
                        <div className="project-price">{priceDisplay}</div>
                        <h5 className="project-name">{project.name}</h5>
                        <p className="project-location">{locationDisplay}</p>

                        <div className="project-meta">
                          <div className="meta-item">
                            <FaHome className="meta-icon" />
                            <span className="meta-text">{typeDisplay}</span>
                          </div>
                          <div className="meta-item">
                            <FaVectorSquare className="meta-icon" />
                            <span className="meta-text">{sizeDisplay}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
            {projects.length === 0 && !loading && (
              <div className="col-12 text-center py-5 text-muted">
                No projects found in {activeCity}.
              </div>
            )}
          </div>

          {!isMobile && startIndex + itemsPerPage < projects.length && (
            <button
              className="project-arrow right-arrow"
              onClick={handleNext}
            >
              <FaChevronRight />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ZameenProjects);
