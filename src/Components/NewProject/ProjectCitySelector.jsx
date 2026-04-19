import React from 'react';
import './ProjectCitySelector.css';

const ProjectCitySelector = ({ selectedCity, onCityChange }) => {
    const cities = [
        { name: 'Islamabad', icon: 'https://cdn-icons-png.flaticon.com/512/1042/1042306.png' },
        { name: 'Karachi', icon: 'https://cdn-icons-png.flaticon.com/512/1042/1042286.png' },
        { name: 'Lahore', icon: 'https://cdn-icons-png.flaticon.com/512/1042/1042296.png' },
        { name: 'Rawalpindi', icon: 'https://cdn-icons-png.flaticon.com/512/1042/1042276.png' },
        { name: 'Faisalabad', icon: 'https://cdn-icons-png.flaticon.com/512/1042/1042246.png' },
        { name: 'Multan', icon: 'https://cdn-icons-png.flaticon.com/512/1042/1042266.png' },
        { name: 'Peshawar', icon: 'https://cdn-icons-png.flaticon.com/512/1042/1042256.png' },
        { name: 'Gujranwala', icon: 'https://cdn-icons-png.flaticon.com/512/1042/1042236.png' },
    ];

    return (
        <div className="project-city-selector py-4 bg-white shadow-sm mb-4">
            <div className="container">
                <h5 className="mb-4 fw-bold text-center">Select City to View Projects</h5>
                <div className="d-flex justify-content-center flex-wrap gap-4">
                    {cities.map((city) => (
                        <div
                            key={city.name}
                            className={`city-circle-item text-center ${selectedCity === city.name ? 'active' : ''}`}
                            onClick={() => onCityChange(city.name)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="city-circle shadow-sm mb-2 d-flex align-items-center justify-content-center">
                                <img src={city.icon} alt={city.name} className="img-fluid p-3" />
                            </div>
                            <span className="small fw-bold">{city.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectCitySelector;
