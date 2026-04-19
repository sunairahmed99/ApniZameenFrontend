import React from 'react';
import './FeaturedDevelopers.css';
import HorizontalScroll from './HorizontalScroll';

const FeaturedDevelopers = () => {
  const developers = [
    { name: 'Premier Choice', location: 'Lahore', contact: '+92-300-1234567', logo: 'https://images.zameen.com/developers/premier_choice_495/logo/premier_choice_logo_8347.jpg' },
    { name: 'Mukhtar Sons', location: 'Islamabad', contact: '+92-300-7654321', logo: 'https://via.placeholder.com/80?text=MS' },
    { name: 'ZEM Builders', location: 'Rawalpindi', contact: '+92-300-1122334', logo: 'https://via.placeholder.com/80?text=ZEM' },
    { name: 'Samsons Group', location: 'Karachi', contact: '+92-300-4455667', logo: 'https://via.placeholder.com/80?text=SG' },
    { name: 'Giga Group', location: 'Islamabad', contact: '+92-300-8899000', logo: 'https://via.placeholder.com/80?text=GIGA' },
    { name: 'Imarat Group', location: 'Islamabad', contact: '+92-300-5555555', logo: 'https://via.placeholder.com/80?text=IMARAT' },
  ];

  return (
    <div className="featured-developers">
      <h2 className="section-title">Featured Developers</h2>
      <HorizontalScroll>
        {developers.map((dev, index) => (
          <div key={index} className="developer-card">
            <div className="developer-logo-wrapper">
              <img src={dev.logo} alt={dev.name} className="developer-logo-img" />
            </div>
            <div className="developer-info">
              <div className="developer-name">{dev.name}</div>
              <div className="developer-location">{dev.location}</div>
              <div className="developer-contact">{dev.contact}</div>
            </div>
          </div>
        ))}
      </HorizontalScroll>
    </div>
  );
};

export default FeaturedDevelopers;
