import React from 'react';
import './BrowseByCity.css';
import HorizontalScroll from './HorizontalScroll';

const BrowseByCity = () => {
  const cities = [
    { name: 'Islamabad', link: '#' },
    { name: 'Karachi', link: '#' },
    { name: 'Lahore', link: '#' },
    { name: 'Rawalpindi', link: '#' },
    { name: 'Faisalabad', link: '#' },
    { name: 'Multan', link: '#' },
    { name: 'Peshawar', link: '#' },
    { name: 'Gujranwala', link: '#' },
  ];

  return (
    <div className="browse-by-city">
      <h2 className="section-title">Browse Projects by City</h2>
      <HorizontalScroll>
        {cities.map((city, index) => (
          <div key={index} className="city-card">
            <h3 className="city-name">{city.name}</h3>
            <a href={city.link} className="city-link">View Projects &gt;</a>
          </div>
        ))}
      </HorizontalScroll>
    </div>
  );
};

export default BrowseByCity;
