import React, { useState } from 'react';
import './MostViewedSocieties.css';

const societyData = {
    Lahore: ['DHA Defence', 'Bahria Town', 'Johar Town', 'Askari', 'Lake City', 'Wapda Town', 'Valencia Housing Society', 'Model Town'],
    Karachi: ['DHA City', 'Bahria Town Karachi', 'Gulshan-e-Iqbal', 'Clifton', 'North Nazimabad', 'Gulistan-e-Jauhar'],
    Islamabad: ['DHA Islamabad', 'Bahria Town', 'Gulberg', 'B-17', 'G-13', 'E-11'],
    Rawalpindi: ['Bahria Town Rawalpindi', 'DHA Defence', 'Satellite Town', 'Chaklala Scheme'],
    Faisalabad: ['Wapda City', 'Citi Housing', 'Madina Town', 'Eden Valley'],
    Peshawar: ['DHA Defence', 'Hayatabad', 'Regi Model Town']
};

const MostViewedSocieties = () => {
    const [activeCity, setActiveCity] = useState('Lahore');

    return (
        <div className="ag-most-viewed-container">
            <h3 className="ag-section-title">Most Viewed Societies</h3>
            
            <div className="ag-city-tabs">
                {Object.keys(societyData).map(city => (
                    <button 
                        key={city} 
                        className={`ag-city-tab ${activeCity === city ? 'active' : ''}`}
                        onClick={() => setActiveCity(city)}
                    >
                        {city}
                    </button>
                ))}
            </div>

            <div className="ag-society-list-grid">
                <div className="ag-society-column">
                    <h4>Most viewed societies in {activeCity}</h4>
                    <ul>
                        {societyData[activeCity].slice(0, 4).map((soc, idx) => (
                            <li key={idx}><span className="ag-arrow">↗</span> {soc}</li>
                        ))}
                    </ul>
                </div>
                 {/* Reusing same list for demo to fill space or splitting data */}
                <div className="ag-society-column">
                    <h4>&nbsp;</h4> {/* Spacer */}
                    <ul>
                        {societyData[activeCity].slice(4, 8).map((soc, idx) => (
                            <li key={idx}><span className="ag-arrow">↗</span> {soc}</li>
                        ))}
                    </ul>
                </div>
                <div className="ag-society-column">
                     <h4>&nbsp;</h4>
                     <a href="#" className="ag-view-all-link">View {activeCity} Area Guide &gt;</a>
                </div>
            </div>

             <div className="ag-useful-links">
                <h3 className="ag-section-title">Useful Links</h3>
                <div className="ag-links-grid">
                     <div className="ag-link-col"><span className="ag-arrow">↗</span> Lahore Smart City</div>
                     <div className="ag-link-col"><span className="ag-arrow">↗</span> Park View City</div>
                     <div className="ag-link-col"><span className="ag-arrow">↗</span> Park View City Islamabad</div>
                     <div className="ag-link-col"><span className="ag-arrow">↗</span> Al Noor Orchard</div>
                     <div className="ag-link-col"><span className="ag-arrow">↗</span> LDA City Lahore</div>
                     <div className="ag-link-col"><span className="ag-arrow">↗</span> DHA Valley</div>
                     <div className="ag-link-col"><span className="ag-arrow">↗</span> Lake City Lahore</div>
                     <div className="ag-link-col"><span className="ag-arrow">↗</span> Gulberg Greens</div>
                </div>
            </div>
        </div>
    );
};

export default MostViewedSocieties;
