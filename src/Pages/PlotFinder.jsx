import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import './PlotFinder.css';
import {
    FaSearch, FaChevronDown, FaTimes, FaPlus, FaMinus, FaCheckSquare
} from 'react-icons/fa';
import { MdCollectionsBookmark } from 'react-icons/md';

// Leaflet Imports
import { MapContainer, TileLayer, Marker, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Green Marker Icon
const createCustomIcon = (label, count) => {
    return L.divIcon({
        className: 'custom-marker-container',
        html: `
            <div class="marker-label-green">
                ${label} ${count ? `+${count} more` : ''}
            </div>
            <div class="marker-arrow"></div>
        `,
        iconSize: [150, 40], // Adjust based on label width
        iconAnchor: [75, 40]
    });
};

// Component to handle map movement
const MapUpdater = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, zoom, {
                duration: 1.5
            });
        }
    }, [center, zoom, map]);
    return null;
};

// Mock Data (Coordinates are approximate)
const CITIES_DATA = [
    { id: 1, name: 'Lahore', coords: [31.5204, 74.3587] },
    { id: 2, name: 'Karachi', coords: [24.8607, 67.0011] },
    { id: 3, name: 'Islamabad', coords: [33.6844, 73.0479] },
    { id: 4, name: 'Rawalpindi', coords: [33.5651, 73.0169] },
    { id: 5, name: 'Faisalabad', coords: [31.4504, 73.1350] },
    { id: 6, name: 'Multan', coords: [30.1575, 71.5249] },
];

const SOCIETIES_DATA = {
    'Lahore': [
        { id: 101, name: 'DHA Lahore', count: 120, coords: [31.4805, 74.4064] },
        { id: 102, name: 'Bahria Town', count: 85, coords: [31.3653, 74.1783] },
        { id: 103, name: 'Johar Town', count: 40, coords: [31.4697, 74.2728] },
        { id: 104, name: 'Model Town', count: 25, coords: [31.4855, 74.3265] },
        { id: 105, name: 'Nespak Phase 1', count: 12, coords: [31.4426, 74.2764] },
    ],
    'Karachi': [
        { id: 201, name: 'DHA City', count: 200, coords: [25.0404, 67.5560] },
    ]
};

const PlotFinder = () => {

    // Handlers
    const handleCitySelect = (city) => {
        setSelectedCity(city);
        setViewState('city');
        setIsCitySelectorOpen(false);
        setMapConfig({ center: city.coords, zoom: 12 });
        setSearchQuery('');
    };

    const handleSocietySelect = (society) => {
        setSelectedSociety(society);
        setViewState('society');
        setMapConfig({ center: society.coords, zoom: 18 }); // Zoom in closer for plots
        setSearchQuery('');
        setShowSocietyList(false);
        setPlotDetails({ street: '', plotNo: '' });
    };

    const handleBackToCountry = () => {
        setViewState('country');
        setSelectedCity(null);
        setSelectedSociety(null);
        setMapConfig({ center: [30.3753, 69.3451], zoom: 6 });
        setShowSocietyList(false);
    };

    const handleBackToCity = () => {
        setViewState('city');
        setSelectedSociety(null);
        setMapConfig({ center: selectedCity.coords, zoom: 12 });
        setPlotDetails({ street: '', plotNo: '' });
    };

    const toggleMapType = () => {
        setMapType(prev => prev === 'roadmap' ? 'satellite' : 'roadmap');
    };

    // Custom Zoom Handlers (We need access to map instance, but doing it via state/prop for now or using default zoom control)
    // Note: Leaflet has built-in zoom control which we moved to bottom-right.

    return (
        <div className="plot-finder-page">
            <Navbar />
            <div className="plot-finder-container">

                {/* Leaflet Map */}
                <MapContainer
                    center={mapConfig.center}
                    zoom={mapConfig.zoom}
                    zoomControl={false} // Disable default top-left zoom
                    className="leaflet-map-view"
                    style={{ height: "100%", width: "100%" }}
                >
                    <MapUpdater center={mapConfig.center} zoom={mapConfig.zoom} />

                    {/* Tile Layer (Roadmap or Satellite) */}
                    {mapType === 'roadmap' ? (
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        />
                    ) : (
                        <TileLayer
                            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        />
                    )}

                    {/* Markers */}
                    {viewState === 'country' && CITIES_DATA.map(city => (
                        <Marker
                            key={city.id}
                            position={city.coords}
                            icon={createCustomIcon(city.name, null)}
                            eventHandlers={{
                                click: () => handleCitySelect(city),
                            }}
                        />
                    ))}

                    {viewState === 'city' && (SOCIETIES_DATA[selectedCity?.name] || []).map(soc => (
                        <Marker
                            key={soc.id}
                            position={soc.coords}
                            icon={createCustomIcon(soc.name, soc.count)}
                            eventHandlers={{
                                click: () => handleSocietySelect(soc),
                            }}
                        />
                    ))}

                    {/* Zoom Control at Bottom Right */}
                    <ZoomControl position="bottomright" />
                </MapContainer>

                {/* --- Top Left Controls (Overlay) --- */}
                <div className="pf-controls-top-left">
                    {viewState === 'country' && (
                        <button
                            className="pf-select-city-btn"
                            onClick={() => setIsCitySelectorOpen(!isCitySelectorOpen)}
                        >
                            Select a city
                        </button>
                    )}

                    {viewState === 'city' && (
                        <div className="pf-search-bar-container">
                            <div className="pf-city-pill" onClick={handleBackToCountry}>
                                {selectedCity?.name} <FaChevronDown size={10} />
                            </div>
                            <div className="pf-search-dropdown-wrapper" style={{ position: 'relative' }}>
                                <div className="pf-search-input-wrapper">
                                    <input
                                        type="text"
                                        placeholder="Enter society..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onFocus={() => setShowSocietyList(true)}
                                    />
                                    {searchQuery && (
                                        <FaTimes
                                            className="cursor-pointer text-muted"
                                            style={{ marginLeft: '5px', color: '#999' }}
                                            onClick={() => {
                                                setSearchQuery('');
                                                setShowSocietyList(true);
                                            }}
                                        />
                                    )}
                                </div>
                                {showSocietyList && (
                                    <div className="pf-society-dropdown-list">
                                        {(SOCIETIES_DATA[selectedCity?.name] || [])
                                            .filter(soc => soc.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                            .map(soc => (
                                                <div
                                                    key={soc.id}
                                                    className="pf-dropdown-item"
                                                    onClick={() => handleSocietySelect(soc)}
                                                >
                                                    {soc.name}
                                                </div>
                                            ))
                                        }
                                        {(SOCIETIES_DATA[selectedCity?.name] || []).filter(soc => soc.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                                            <div className="pf-dropdown-item no-results" style={{ cursor: 'default', color: '#999' }}>No societies found</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {viewState === 'society' && (
                        <div className="pf-society-view-container">
                            {/* City Pill */}
                            <div className="pf-city-pill mb-2" onClick={handleBackToCountry} style={{ alignSelf: 'flex-start' }}>
                                {selectedCity?.name} <FaChevronDown size={10} />
                            </div>

                            {/* Society Card */}
                            <div className="pf-society-card">
                                <div className="pf-society-card-header">
                                    <span className="pf-society-name">{selectedSociety?.name}</span>
                                    <FaTimes
                                        className="cursor-pointer text-muted"
                                        onClick={handleBackToCity}
                                    />
                                </div>
                                <div className="pf-society-card-body">
                                    <div className="pf-plot-inputs-wrapper full-width">
                                        <input
                                            type="text"
                                            placeholder="Street"
                                            className="pf-small-input flex-grow"
                                            value={plotDetails.street}
                                            onChange={(e) => setPlotDetails({ ...plotDetails, street: e.target.value })}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Plot No"
                                            className="pf-small-input flex-grow"
                                            value={plotDetails.plotNo}
                                            onChange={(e) => setPlotDetails({ ...plotDetails, plotNo: e.target.value })}
                                        />
                                        <button className="pf-search-btn">
                                            <FaSearch />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* City Selection Dropdown */}
                {isCitySelectorOpen && viewState === 'country' && (
                    <div className="pf-city-dropdown">
                        <div className="pf-city-dropdown-header">
                            <input
                                type="text"
                                className="pf-city-dropdown-input"
                                placeholder="Enter city..."
                                autoFocus
                            />
                        </div>
                        {CITIES_DATA.map(city => (
                            <div
                                key={city.id}
                                className="pf-city-list-item"
                                onClick={() => handleCitySelect(city)}
                            >
                                {city.name}
                            </div>
                        ))}
                    </div>
                )}

                {/* --- Bottom Left Controls (Overlay) --- */}
                <div className="pf-controls-bottom-left">
                    <button className="pf-collections-btn">
                        <MdCollectionsBookmark className="pf-icon-blue" size={16} />
                        Collections
                    </button>
                </div>

                {/* --- Bottom Right Controls (Overlay) --- */}
                <div className="pf-controls-bottom-right-custom">
                    {/* Society Toggle */}
                    <div className="pf-society-maps-toggle mb-2">
                        <FaCheckSquare className="pf-toggle-icon" /> Society Maps: On
                    </div>

                    {/* Satellite Toggle */}
                    <div className="pf-satellite-btn" onClick={toggleMapType}>
                        <div
                            className="pf-satellite-bg"
                            style={{
                                backgroundImage: mapType === 'roadmap'
                                    ? "url('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/4/5/10')"
                                    : "url('https://a.basemaps.cartocdn.com/rastertiles/voyager/10/10/10.png')"
                            }}
                        ></div>
                        <div className="pf-satellite-label">
                            {mapType === 'roadmap' ? 'Satellite' : 'Map'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlotFinder;
