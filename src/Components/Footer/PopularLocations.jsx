import React, { useState } from 'react';
import { usePopularLocations } from '../../hooks/useProperties';

const PopularLocations = () => {
  const [activeTab, setActiveTab] = useState('For Sale');
  const { data: dynamicData = [], isLoading: loading } = usePopularLocations();

  // Helper to get top locations
  const getTopLocations = (city, type, purpose, limit = 5) => {
    const filtered = dynamicData.filter(d =>
      d.city === city &&
      d.type === type &&
      d.purpose === purpose &&
      d.area // Ensure area name exists
    );

    // Sort by count descending
    return filtered.sort((a, b) => b.count - a.count).slice(0, limit).map(item => ({
      name: item.area,
      count: `(${item.count.toLocaleString()})`
    }));
  };

  // Helper to get total count for a city/type
  const getCityCount = (city, type, purpose) => {
    const total = dynamicData
      .filter(d => d.city === city && (type === 'All' || d.type === type) && d.purpose === purpose)
      .reduce((sum, item) => sum + item.count, 0);
    return `(${total.toLocaleString()})`;
  };

  const renderList = (category, type, cities) => {
    const purpose = activeTab === 'For Sale' ? 'For Sale' : 'For Rent';
    const actionText = activeTab === 'For Sale' ? 'for sale' : 'to rent';

    return (
      <div className="mb-5">
        <h5 className="section-subtitle mb-3 text-secondary">Most Popular Locations for {category}</h5>
        <div className="row">
          {cities.map(city => {
            const items = getTopLocations(city, type, purpose);
            if (items.length === 0) return null; // Or show empty state? usually hidden if no data

            return (
              <div className="col-md-4" key={city}>
                <h6 className="city-title">{city}</h6>
                <ul className="list-unstyled">
                  {items.map((item, idx) => (
                    <li key={idx}>
                      <a href={`/search?city=${city}&purpose=${purpose}&type=${type}&search=${item.name}`} className="location-link">
                        <span className="link-text">{category} {actionText} in {item.name}</span>
                        <span className="link-count ms-1">{item.count}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderPopularCities = () => {
    const purpose = activeTab === 'For Sale' ? 'For Sale' : 'For Rent';
    const actionText = activeTab === 'For Sale' ? 'Buy' : 'Rent';
    const citiesToCheck = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Multan', 'Faisalabad', 'Peshawar'];

    return (
      <div>
        <h5 className="section-subtitle mb-3 text-secondary">Popular Cities to {actionText} Properties</h5>
        <div className="row">
          <div className="col-md-4">
            <h6 className="city-title">Houses</h6>
            <ul className="list-unstyled">
              {citiesToCheck.map((city, idx) => {
                const count = getCityCount(city, 'House', purpose);
                if (count === '(0)') return null;

                return (
                  <li key={idx}>
                    <a href={`/search?city=${city}&purpose=${purpose}&type=House`} className="location-link">
                      <span className="link-text">Houses {activeTab === 'For Sale' ? 'for sale' : 'to rent'} in {city}</span>
                      <span className="link-count ms-1">{count}</span>
                    </a>
                  </li>
                );
              })}
              <li><a href="/" className="location-link fw-bold text-primary">View all Cities</a></li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const majorCities = ['Lahore', 'Karachi', 'Islamabad'];

  return (
    <div className="popular-locations-section py-5 bg-white border-top">
      <div className="container">
        <h4 className="fw-bold mb-3">Popular Locations</h4>

        <div className="tabs mb-4 border-bottom" role="tablist">
          <button
            className={`tab-item btn btn-link me-4 pb-2 text-decoration-none border-0 ${activeTab === 'For Sale' ? 'active' : ''}`}
            onClick={() => setActiveTab('For Sale')}
            role="tab"
            aria-selected={activeTab === 'For Sale'}
            aria-controls="location-panels"
          >
            For Sale
          </button>
          <button
            className={`tab-item btn btn-link pb-2 text-decoration-none border-0 ${activeTab === 'To Rent' ? 'active' : ''}`}
            onClick={() => setActiveTab('To Rent')}
            role="tab"
            aria-selected={activeTab === 'To Rent'}
            aria-controls="location-panels"
          >
            To Rent
          </button>
        </div>

        {renderList('Plots', 'Plot', majorCities)}
        {renderList('Flats', 'Flat', majorCities)}
        {renderList('Houses', 'House', majorCities)}

        {renderPopularCities()}

      </div>
    </div>
  );
};

export default PopularLocations;
