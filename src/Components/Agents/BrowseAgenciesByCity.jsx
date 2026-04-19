import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaArrowRight } from 'react-icons/fa';
import { useAgencyStats } from '../../hooks/useAgencies';
import { useLocations } from '../../hooks/useLocations';
import { CityStatSkeleton } from '../Common/Skeleton';

const cityBackgrounds = {
  'Karachi': '/images/cities/karachi.jpg',
  'Lahore': '/images/cities/lahore.jpg',
  'Islamabad': '/images/cities/islamabad.jpg',
  'Rawalpindi': '/images/cities/rawalpindi.jpg',
  'Peshawar': '/images/cities/peshawar.jpg',
  'Faisalabad': '/images/cities/faisalabad.jpg',
  'default': '/images/cities/default.jpg'
};

const BrowseAgenciesByCity = () => {
  const navigate = useNavigate();
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 4;

  const { data: cityStats = [], isLoading: statsLoading } = useAgencyStats();
  const { data: locationData = [], isLoading: locationsLoading } = useLocations({ type: 'city' });

  const mergedCityStats = React.useMemo(() => {
    if (locationData.length === 0) return cityStats;

    // Sort locations (main first)
    const mainCities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad'];
    const sortedLocations = [...locationData].sort((a, b) => {
      const aMain = mainCities.indexOf(a.name);
      const bMain = mainCities.indexOf(b.name);
      if (aMain !== -1 && bMain !== -1) return aMain - bMain;
      if (aMain !== -1) return -1;
      if (bMain !== -1) return 1;
      return a.name.localeCompare(b.name);
    });

    return sortedLocations.map(location => {
      const stat = cityStats.find(s => s.name === location.name);
      return {
        name: location.name,
        count: stat ? stat.count : 0
      };
    });
  }, [locationData, cityStats]);

  const loading = statsLoading || locationsLoading;

  const handleNext = () => {
    if (startIndex + itemsPerPage < mergedCityStats.length) {
      setStartIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(prev => prev - 1);
    }
  };

  const visibleCities = mergedCityStats.slice(startIndex, startIndex + itemsPerPage);
  const showLeftArrow = startIndex > 0;
  const showRightArrow = startIndex + itemsPerPage < mergedCityStats.length;

  if (loading && mergedCityStats.length === 0) {
    return (
      <div className="browse-agencies-section py-4">
        <div className="container">
          <div className="row g-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="col-lg-3 col-md-6">
                <CityStatSkeleton />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (mergedCityStats.length === 0 && !loading) return null;

  return (
    <div className="browse-agencies-section py-4 mb-5">
      <div className="container">
        <h3 className="mb-4 fw-bold">Browse Agencies By City</h3>

        <div className="position-relative">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              className="agent-titanium-arrow left-arrow btn btn-white shadow-sm rounded-circle position-absolute start-0 top-50 translate-middle-y"
              onClick={handlePrev}
              style={{ marginLeft: '-20px', zIndex: 10 }}
            >
              <FaChevronLeft />
            </button>
          )}

          <div className="row g-4">
            {visibleCities.map((city, index) => (
              <div className="col-lg-3 col-md-6 col-6" key={index}>
                <div
                  className="city-agency-card bg-white p-4 rounded h-100 d-flex flex-column justify-content-between"
                  style={{ '--city-bg': `url(${cityBackgrounds[city.name] || cityBackgrounds.default})` }}
                  onClick={() => navigate(`/search?city=${city.name}`)}
                >
                  <div className="position-relative z-1">
                    <h5 className="fw-bold mb-1">{city.name}</h5>
                    <p className="text-muted mb-3">{city.count} {city.count === 1 ? 'Agency' : 'Agencies'}</p>
                  </div>
                  <div className="position-relative z-1">
                    <span className="view-trend-link text-primary d-flex align-items-center" style={{ cursor: 'pointer' }}>
                      View Properties <FaArrowRight className="ms-1" size={12} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              className="agent-titanium-arrow right-arrow btn btn-white shadow-sm rounded-circle position-absolute end-0 top-50 translate-middle-y"
              onClick={handleNext}
              style={{ marginRight: '-20px', zIndex: 10 }}
            >
              <FaChevronRight />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseAgenciesByCity;
