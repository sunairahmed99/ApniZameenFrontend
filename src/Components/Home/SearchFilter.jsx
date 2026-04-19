import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown, FaSearch, FaHome, FaBuilding, FaTree, FaMapMarkedAlt, FaStore, FaWarehouse, FaIndustry } from 'react-icons/fa';
import { MdLayers, MdWork, MdMeetingRoom } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import './SearchFilter.css';
import MobileFilterModal from './MobileFilterModal';
import { logEvent } from '../../utils/analytics';
import { pakistanCities as cities, cityDefaultAreas } from '../../utils/cities';
import { useCityAreas } from '../../hooks/useLocations';

const SearchFilter = ({ listingType, setListingType, city, setCity }) => {
    const [showMobileFilter, setShowMobileFilter] = useState(false);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(listingType || 'BUY');
    // Local state fallback if not provided (though Homepage provides it)
    const [localCity, setLocalCity] = useState('Karachi');
    const effectiveCity = city !== undefined ? city : localCity;
    const handleCityChange = (newCity) => {
        if (setCity) setCity(newCity);
        else setLocalCity(newCity);
    };
    const [propertyType, setPropertyType] = useState('All');
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [areaMin, setAreaMin] = useState('');
    const [areaMax, setAreaMax] = useState('');
    const [beds, setBeds] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [locationQuery, setLocationQuery] = useState(''); // Added state for location input
    const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

    const { data: cityAreas = [], isLoading: loadingAreas } = useCityAreas(effectiveCity);

    const [areaUnit, setAreaUnit] = useState('Marla');
    const [showAreaModal, setShowAreaModal] = useState(false);
    const [tempUnit, setTempUnit] = useState('Marla');

    // Dropdown visibility
    const [showCity, setShowCity] = useState(false);
    const [showPropertyType, setShowPropertyType] = useState(false);
    const [showPrice, setShowPrice] = useState(false);
    const [showArea, setShowArea] = useState(false);
    const [showBeds, setShowBeds] = useState(false);

    const [moreOptions, setMoreOptions] = useState(false);

    // Property Type Tabs
    const [typeTab, setTypeTab] = useState('HOUSE');

    // Refs
    const cityRef = useRef(null);
    const typeRef = useRef(null);
    const priceRef = useRef(null);
    const areaRef = useRef(null);
    const bedsRef = useRef(null);
    const locationRef = useRef(null);


    useEffect(() => {
        setActiveTab(listingType);
    }, [listingType]);

    // Province Mapping for Unit Defaults
    const getProvinceUnit = (cityName) => {
        const sindhCities = ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah', 'Mirpur Khas', 'Ghotki', 'Shikarpur', 'Jacobabad', 'Khairpur', 'Dadu', 'Tando Adam', 'Tando Allahyar', 'Umerkot', 'Thatta', 'Badin', 'Sanghar', 'Kotri', 'Rohri', 'Jamshoro', 'Kandhkot', 'Moro', 'Shahdadpur', 'Gambat', 'Hala', 'Ratodero', 'Sehwan'];
        // Default to Marla for Punjab, KPK, Balochistan, AJK, etc.
        return sindhCities.includes(cityName) ? 'Square Yards' : 'Marla';
    };

    // Auto-switch Area Unit based on City (Province) AND Property Type
    useEffect(() => {
        // Priority 1: Property Type (Flats/Commercial etc always Sqft)
        if (['Flat', 'Penthouse', 'Room', 'Office', 'Shop', 'Warehouse', 'Factory', 'Building'].includes(propertyType)) {
            setAreaUnit('Sqft');
        }
        // Priority 2: City/Province (Only if not a fixed-unit type)
        else {
            const defaultUnit = getProvinceUnit(effectiveCity);
            setAreaUnit(defaultUnit);
        }
    }, [effectiveCity, propertyType]); // Run when city or type changes




    const handleTabClick = (type) => {
        setActiveTab(type);
        if (setListingType) setListingType(type);

        // Open mobile filter modal on mobile/tablet viewports
        if (window.innerWidth <= 992) {
            setShowMobileFilter(true);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Helper to check if click is outside
            const isOutside = (ref) => ref.current && !ref.current.contains(event.target);
            if (isOutside(cityRef)) setShowCity(false);
            if (isOutside(typeRef)) setShowPropertyType(false);
            if (isOutside(priceRef)) setShowPrice(false);
            if (isOutside(areaRef)) setShowArea(false);
            if (isOutside(bedsRef)) setShowBeds(false);
            if (isOutside(locationRef)) setShowLocationSuggestions(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    const filteredCities = cities.filter(c => c.toLowerCase().includes(searchTerm.toLowerCase()));

    const propertyTypes = {
        HOUSE: [{ name: 'House', icon: <FaHome /> }],
        FLAT: [{ name: 'Flat', icon: <FaBuilding /> }],
        PORTION: [
            { name: 'Lower Portion', icon: <MdLayers /> },
            { name: 'Upper Portion', icon: <MdLayers style={{ transform: 'rotate(180deg)' }} /> }
        ],
        'FARM HOUSE': [{ name: 'Farm House', icon: <FaTree /> }],
        PLOTS: [
            { name: 'Residential Plot', icon: <FaMapMarkedAlt /> },
            { name: 'Commercial Plot', icon: <FaMapMarkedAlt /> },
            { name: 'Agricultural Land', icon: <FaTree /> },
            { name: 'Industrial Land', icon: <FaIndustry /> },
            { name: 'Plot File', icon: <FaSearch /> },
            { name: 'Plot Form', icon: <FaSearch /> }
        ],
        COMMERCIAL: [
            { name: 'Office', icon: <MdWork /> },
            { name: 'Shop', icon: <FaStore /> },
            { name: 'Warehouse', icon: <FaWarehouse /> },
            { name: 'Factory', icon: <FaIndustry /> },
            { name: 'Building', icon: <FaBuilding /> },
            { name: 'Other', icon: <MdMeetingRoom /> }
        ]
    };

    const bedOptions = ['All', 'Studio', '1', '2', '3', '4', '5', '6', '7+'];

    const priceOptions = ['0', '500,000', '1,000,000', '2,000,000', '3,500,000', '5,000,000', '10,000,000', '20,000,000'];
    const areaOptions = ['0', '1', '2', '3', '5', '10', '20', '50', '100'];


    const handleSearch = () => {
        const params = new URLSearchParams();
        if (effectiveCity) params.append('city', effectiveCity);
        if (propertyType && propertyType !== 'All') params.append('type', propertyType);
        if (priceMin && priceMin !== '0') params.append('priceMin', priceMin);
        if (priceMax && priceMax !== 'Any') params.append('priceMax', priceMax);
        if (areaMin && areaMin !== '0') params.append('areaMin', areaMin);
        if (areaMax && areaMax !== 'Any') params.append('areaMax', areaMax);
        if (areaUnit) params.append('areaUnit', areaUnit);
        if (beds && beds !== 'All') params.append('beds', beds);


        // Pass location input as search param
        if (locationQuery) {
            params.append('search', locationQuery);
        }

        // Use activeTab for BUY/RENT mapping
        if (activeTab === 'BUY') params.append('purpose', 'For Sale');
        else if (activeTab === 'RENT') params.append('purpose', 'For Rent');
        else if (activeTab) params.append('purpose', activeTab);

        logEvent('search', {
            city: effectiveCity,
            type: propertyType,
            purpose: activeTab,
            location: locationQuery
        });

        navigate(`/search?${params.toString()}`);
    };

    const handleReset = () => {
        setPriceMin('');
        setPriceMax('');
        setAreaMin('');
        setAreaMax('');
        setBeds('All');
        setLocationQuery('');
        setPropertyType('Homes');
        setSearchTerm('');
    };

    // Location Suggestions Logic (Filtered by selected City from API)
    const locationSuggestions = useMemo(() => {
        if (!locationQuery || cityAreas.length === 0) return [];

        let cleanQuery = locationQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        cleanQuery = cleanQuery
           .replace(/[-_\s]+/g, '[-\\s_]+') 
           .replace(/([a-zA-Z])([0-9])/g, '$1[-\\s_]*$2') 
           .replace(/([0-9])([a-zA-Z])/g, '$1[-\\s_]*$2');
        
        const fuzzyRegex = new RegExp(cleanQuery, 'i');
        const exactStartsRegex = new RegExp('^' + cleanQuery, 'i');

        return cityAreas
            .filter(areaName => fuzzyRegex.test(areaName))
            .sort((a, b) => {
                const aStarts = exactStartsRegex.test(a);
                const bStarts = exactStartsRegex.test(b);
                if (aStarts && !bStarts) return -1;
                if (!aStarts && bStarts) return 1;
                return a.localeCompare(b);
            })
            .slice(0, 20);
    }, [locationQuery, cityAreas]);

    return (
        <div className="search-filter-container">
            {/* Tabs */}
            <div className="filter-tabs">
                {['BUY', 'RENT', 'PROJECTS'].map(tab => (
                    <button
                        key={tab}
                        className={`filter-tab ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => handleTabClick(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Main Search Box */}
            <div className="filter-box">

                {/* Row 1: City, Location, Find */}
                <div className="filter-row">

                    {/* City Dropdown */}
                    <div className="filter-input-wrapper city-wrapper" ref={cityRef}>
                        <div className="filter-input-group" onClick={() => { setShowCity(!showCity); setSearchTerm(''); }}>
                            <label>CITY</label>
                            <div className="input-display">
                                <span>{effectiveCity}</span>
                                <FaChevronDown className="icon" />
                            </div>
                        </div>
                        {showCity && (
                            <div className="search-dropdown-menu city-dropdown">
                                <div className="p-2">
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Start typing..."
                                        autoFocus
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleCityChange(searchTerm);
                                                setShowCity(false);
                                            }
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                                <div className="city-list">
                                    {filteredCities.map(c => (
                                        <div key={c} className={`city-item ${effectiveCity === c ? 'active' : ''}`} onClick={() => { handleCityChange(c); setShowCity(false); }}>
                                            {c}
                                        </div>
                                    ))}
                                </div>
                                <div className="dropdown-footer">
                                    <button className="btn-close-custom" onClick={(e) => { e.stopPropagation(); setShowCity(false); }}>Close</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Location Input */}
                    <div className="filter-input-wrapper location-wrapper" ref={locationRef}>
                        <div className="filter-input-group">
                            <label>LOCATION</label>
                            <input
                                type="text"
                                placeholder={(() => {
                                    const placeholders = {
                                        'Karachi': 'e.g. DHA Defence, Gulshan-e-Iqbal',
                                        'Lahore': 'e.g. DHA Phase 1, Bahria Town',
                                        'Islamabad': 'e.g. F-6, Bahria Town',
                                        'Rawalpindi': 'e.g. Bahria Town, Saddar',
                                        'Multan': 'e.g. Cantt, Gulgasht Colony',
                                        'Faisalabad': 'e.g. Peoples Colony, Madina Town'
                                    };
                                    return placeholders[effectiveCity] || 'Enter location';
                                })()}
                                value={locationQuery}
                                onChange={(e) => {
                                    setLocationQuery(e.target.value);
                                    setShowLocationSuggestions(true);
                                }}
                                onFocus={() => setShowLocationSuggestions(true)}
                            />
                        </div>
                        {showLocationSuggestions && locationSuggestions.length > 0 && (
                            <div className="search-dropdown-menu location-dropdown">
                                <div className="city-list">
                                    {locationSuggestions.map((area, index) => (
                                        <div
                                            key={index}
                                            className="city-item"
                                            onClick={() => {
                                                setLocationQuery(area);
                                                setShowLocationSuggestions(false);
                                            }}
                                        >
                                            {area}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Find Button */}
                    <button className="btn-find" onClick={handleSearch}>
                        FIND
                    </button>
                </div>

                {/* Row 2: Type, Price, Area, Beds */}
                <div className={`filter-row secondary-row ${moreOptions ? 'visible' : ''}`}>

                    {/* Property Type */}
                    <div className="filter-input-wrapper type-wrapper" ref={typeRef}>
                        <div className="filter-input-group" onClick={() => setShowPropertyType(!showPropertyType)}>
                            <label>PROPERTY TYPE</label>
                            <div className="input-display">
                                <span>{propertyType === 'All' ? 'All Types' : propertyType}</span>
                                <FaChevronDown className="icon" />
                            </div>
                        </div>
                        <AnimatePresence>
                            {showPropertyType && (
                                <motion.div 
                                    className="search-dropdown-menu type-dropdown"
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                >
                                    <div className="type-tabs">
                                        {Object.keys(propertyTypes).map(t => (
                                            <div 
                                                key={t} 
                                                className={`type-tab ${typeTab === t ? 'active' : ''}`} 
                                                onClick={(e) => { 
                                                    e.stopPropagation(); 
                                                    setTypeTab(t); 
                                                    if (propertyTypes[t].length === 1) {
                                                        setPropertyType(propertyTypes[t][0].name);
                                                    }
                                                }}
                                            >
                                                {t}
                                                {typeTab === t && (
                                                    <motion.div 
                                                        className="active-bg" 
                                                        layoutId="activeTab" 
                                                        style={{ position: 'absolute', inset: 0, background: '#fff', borderRadius: '8px', zIndex: -1 }}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <motion.div 
                                        className="type-grid"
                                        layout
                                    >
                                        <AnimatePresence mode="popLayout">
                                            {propertyTypes[typeTab].map(t => (
                                                <motion.div 
                                                    key={t.name}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    transition={{ duration: 0.2 }}
                                                    className={`type-option ${propertyType === t.name ? 'active' : ''}`} 
                                                    onClick={() => { setPropertyType(t.name); setShowPropertyType(false); }}
                                                >
                                                    <span className="type-icon">{t.icon}</span>
                                                    <span className="type-label">{t.name}</span>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </motion.div>
                                    <div className="dropdown-footer d-flex justify-content-between align-items-center">
                                        <span className="text-muted small cursor-pointer" onClick={(e) => { e.stopPropagation(); setPropertyType('All'); }}>Reset</span>
                                        <button className="btn-close-custom" onClick={(e) => { e.stopPropagation(); setShowPropertyType(false); }}>Close</button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Price */}
                    <div className="filter-input-wrapper price-wrapper" ref={priceRef}>
                        <div className="filter-input-group" onClick={() => setShowPrice(!showPrice)}>
                            <label>PRICE (PKR)</label>
                            <div className="input-display">
                                <span>{priceMin || '0'} to {priceMax || 'Any'}</span>
                                <FaChevronDown className="icon" />
                            </div>
                        </div>
                        {showPrice && (
                            <div className="search-dropdown-menu range-dropdown">
                                <div className="range-header-link">Change currency (PKR)</div>
                                <div className="d-flex gap-2 p-2">
                                    <div className="w-50">
                                        <label className="small fw-bold">MIN:</label>
                                        <input type="text" className="form-control form-control-sm" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} placeholder="0" onClick={e => e.stopPropagation()} />
                                    </div>
                                    <div className="w-50">
                                        <label className="small fw-bold">MAX:</label>
                                        <input type="text" className="form-control form-control-sm" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} placeholder="Any" onClick={e => e.stopPropagation()} />
                                    </div>
                                </div>
                                <div className="d-flex range-lists">
                                    <div className="range-list border-end">
                                        <div className={`range-item ${priceMin === '0' || priceMin === '' ? 'active' : ''}`} onClick={() => setPriceMin('0')}>0</div>
                                        {priceOptions.slice(1).map(p => (
                                            <div key={p} className={`range-item ${priceMin === p ? 'active' : ''}`} onClick={() => setPriceMin(p)}>{p}</div>
                                        ))}
                                    </div>
                                    <div className="range-list">
                                        <div className={`range-item ${priceMax === 'Any' || priceMax === '' ? 'active' : ''}`} onClick={() => { setPriceMax('Any'); setShowPrice(false); }}>Any</div>
                                        {priceOptions.slice(1).map(p => (
                                            <div key={p} className={`range-item ${priceMax === p ? 'active' : ''}`} onClick={() => { setPriceMax(p); setShowPrice(false); }}>{p}</div>
                                        ))}
                                    </div>
                                </div>
                                <div className="dropdown-footer text-end">
                                    <button className="btn-close-custom" onClick={(e) => { e.stopPropagation(); setShowPrice(false); }}>Close</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Area */}
                    <div className="filter-input-wrapper area-wrapper" ref={areaRef}>
                        <div className="filter-input-group" onClick={() => setShowArea(!showArea)}>
                            <label>AREA ({areaUnit.toUpperCase()})</label>
                            <div className="input-display">
                                <span>{areaMin || '0'} to {areaMax || 'Any'}</span>
                                <FaChevronDown className="icon" />
                            </div>
                        </div>
                        {showArea && (
                            <div className="search-dropdown-menu range-dropdown">
                                <div className="range-header-link text-info" onClick={(e) => { e.stopPropagation(); setShowAreaModal(true); setShowArea(false); }}>Change area unit ({areaUnit})</div>
                                <div className="d-flex gap-2 p-2">
                                    <div className="w-50">
                                        <label className="small fw-bold">MIN:</label>
                                        <input type="text" className="form-control form-control-sm" value={areaMin} onChange={(e) => setAreaMin(e.target.value)} placeholder="0" onClick={e => e.stopPropagation()} />
                                    </div>
                                    <div className="w-50">
                                        <label className="small fw-bold">MAX:</label>
                                        <input type="text" className="form-control form-control-sm" value={areaMax} onChange={(e) => setAreaMax(e.target.value)} placeholder="Any" onClick={e => e.stopPropagation()} />
                                    </div>
                                </div>
                                <div className="d-flex range-lists">
                                    <div className="range-list border-end">
                                        <div className={`range-item ${areaMin === '0' || areaMin === '' ? 'active' : ''}`} onClick={() => setAreaMin('0')}>0</div>
                                        {areaOptions.slice(1).map(a => (
                                            <div key={a} className={`range-item ${areaMin === a ? 'active' : ''}`} onClick={() => setAreaMin(a)}>{a}</div>
                                        ))}
                                    </div>
                                    <div className="range-list">
                                        <div className={`range-item ${areaMax === 'Any' || areaMax === '' ? 'active' : ''}`} onClick={() => { setAreaMax('Any'); setShowArea(false); }}>Any</div>
                                        {areaOptions.slice(1).map(a => (
                                            <div key={a} className={`range-item ${areaMax === a ? 'active' : ''}`} onClick={() => { setAreaMax(a); setShowArea(false); }}>{a}</div>
                                        ))}
                                    </div>
                                </div>
                                <div className="dropdown-footer text-end">
                                    <button className="btn-close-custom" onClick={(e) => { e.stopPropagation(); setShowArea(false); }}>Close</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Beds */}
                    <div className="filter-input-wrapper beds-wrapper" ref={bedsRef}>
                        <div className="filter-input-group" onClick={() => setShowBeds(!showBeds)}>
                            <label>BEDS</label>
                            <div className="input-display">
                                <span>{beds}</span>
                                <FaChevronDown className="icon" />
                            </div>
                        </div>
                        {showBeds && (
                            <div className="search-dropdown-menu beds-dropdown">
                                <div className="beds-list">
                                    {bedOptions.map(b => (
                                        <div key={b} className={`bed-item ${beds === b ? 'active' : ''}`} onClick={() => { setBeds(b); setShowBeds(false); }}>
                                            {b}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                </div>

                {/* Bottom Links */}
                <div className="filter-links">
                    <div className="link-item" onClick={() => setMoreOptions(!moreOptions)}>
                        <FaChevronDown className={`icon-sm ${moreOptions ? 'rotate' : ''}`} />
                        {moreOptions ? 'Less Options' : 'More Options'}
                    </div>
                    <span className="pipe">|</span>
                    <div className="link-item text-blue" onClick={() => setShowAreaModal(true)}>Change Area Unit</div>
                    <span className="pipe">|</span>
                    <div className="link-item text-blue" onClick={handleReset}>Reset Search</div>
                </div>

            </div>

            {/* Area Unit Modal */}
            {
                showAreaModal && (
                    <div className="modal-overlay">
                        <div className="area-modal">
                            <div className="area-modal-header">
                                <h3>Change Area</h3>
                                <button className="btn-close-modal" onClick={() => setShowAreaModal(false)}>×</button>
                            </div>
                            <div className="area-modal-body">
                                <select
                                    className="form-control form-select mb-3"
                                    value={tempUnit}
                                    onChange={(e) => setTempUnit(e.target.value)}
                                >
                                    <option value="Square Yards">Square Yards</option>
                                    <option value="Marla">Marla</option>
                                    <option value="Kanal">Kanal</option>
                                    <option value="Sqft">Square Feet</option>
                                </select>
                                <button
                                    className="btn-save"
                                    onClick={() => { setAreaUnit(tempUnit); setShowAreaModal(false); }}
                                >
                                    SAVE
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Mobile Filter Modal */}
            <MobileFilterModal
                isOpen={showMobileFilter}
                onClose={() => setShowMobileFilter(false)}
                listingType={activeTab}
            />
        </div >
    );
};

export default SearchFilter;
