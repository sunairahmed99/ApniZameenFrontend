import React from 'react';
import './AreaGuideInfo.css';
import { FaMapMarkedAlt, FaUmbrellaBeach, FaHome } from 'react-icons/fa';

const AreaGuideInfo = () => {
    return (
        <div className="ag-info-container">
            <h2 className="ag-info-title">Find the Perfect Place to live in!</h2>
            <p className="ag-info-subtitle">Stop wondering how your life will be like in a housing society & make informed decisions with Zameen Area Guides</p>
            
            <div className="ag-info-grid">
                <div className="ag-info-item">
                    <div className="ag-info-icon-circle">
                        <FaMapMarkedAlt size={30} color="#28a745" />
                    </div>
                    <h3>Take a look inside society maps</h3>
                    <p>Conveniently browse through detailed maps of all the societies established across the country, featuring master plans, road networks, and plots.</p>
                </div>
                <div className="ag-info-item">
                    <div className="ag-info-icon-circle">
                        <FaUmbrellaBeach size={30} color="#28a745" />
                    </div>
                    <h3>Best of Local Amenities</h3>
                    <p>Surf through the 'hot spots' that the locals love to flock to. Discover top places including schools, hospitals, parks, grocery stores, and much more.</p>
                </div>
                <div className="ag-info-item">
                    <div className="ag-info-icon-circle">
                        <FaHome size={30} color="#28a745" />
                    </div>
                    <h3>Houses & Plot Prices</h3>
                    <p>Find thousands of listings of low price houses and plots for sale in your desired society. Check out these affordable houses for rent and commercial properties for sale.</p>
                </div>
            </div>
        </div>
    );
};

export default AreaGuideInfo;
