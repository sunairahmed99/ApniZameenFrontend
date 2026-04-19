import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaChevronRight, FaPlus, FaTimes } from 'react-icons/fa';
import { usePropertyTypes } from '../../hooks/useProperties';
import { useLocations, useCityAreas } from '../../hooks/useLocations';
import { cityDefaultAreas } from '../../utils/cities';
import './MobileFilterModal.css';

const MobileFilterModal = ({ isOpen, onClose, listingType = 'BUY' }) => {
    const navigate = useNavigate();

    // Filter States
    const [wantTo, setWantTo] = useState(listingType);

    // Sync state with prop when modal opens or type changes
    useEffect(() => {
        if (listingType) setWantTo(listingType);
    }, [listingType, isOpen]);

    const [city, setCity] = useState('Karachi');
    const [location, setLocation] = useState('');
    const [paymentType, setPaymentType] = useState('Any');
    const [propertyCategory, setPropertyCategory] = useState('House');
    const [propertyType, setPropertyType] = useState('House');
    const [priceMin, setPriceMin] = useState('0');
    const [priceMax, setPriceMax] = useState('5,000,000,000');
    const [priceCurrency, setPriceCurrency] = useState('PKR');
    const [areaMin, setAreaMin] = useState('0');
    const [areaMax, setAreaMax] = useState('5,000');
    const [areaUnit, setAreaUnit] = useState('Marla');
    const [bedrooms, setBedrooms] = useState([]);
    const [bathrooms, setBathrooms] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [showVerifiedAds, setShowVerifiedAds] = useState(false);
    const [showVideosOnly, setShowVideosOnly] = useState(false);
    const [showImagesOnly, setShowImagesOnly] = useState(false);

    // Location Modal State
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [showCityModal, setShowCityModal] = useState(false);
    const [locationSearchQuery, setLocationSearchQuery] = useState('');
    const [citySearchQuery, setCitySearchQuery] = useState('');

    // Dynamic Data States
    const [propertyTypes, setPropertyTypes] = useState({
        House: ['House'],
        Flat: ['Flat'],
        Portion: ['Lower Portion', 'Upper Portion'],
        'Farm House': ['Farm House'],
        Plots: ['All', 'Residential Plot', 'Commercial Plot'],
        Commercial: ['All', 'Office', 'Shop', 'Warehouse', 'Factory', 'Building']
    });
    const [config, setConfig] = useState({
        priceRange: { min: 0, max: 5000000000 },
        areaRange: { min: 0, max: 5000 }
    });

    // Hardcoded Pakistani cities as fallback
    const pakistaniCities = [
        'Islamabad', 'Karachi', 'Lahore', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
        'Hyderabad', 'Abbottabad', 'Bahawalpur', 'Sargodha', 'Sukkur', 'Larkana', 'Sheikhupura', 'Rahim Yar Khan', 'Jhang', 'Dera Ghazi Khan',
        'Gujrat', 'Sahiwal', 'Wah Cantonment', 'Mardan', 'Kasur', 'Mingora', 'Nawabshah', 'Chiniot', 'Kotli', 'Khanpur',
        'Hafizabad', 'Sadiqabad', 'Mirpur Khas', 'Burewala', 'Kohat', 'Khanewal', 'Dera Ismail Khan', 'Turbat', 'Muzaffargarh',
        'Mandi Bahauddin', 'Shikarpur', 'Jacobabad', 'Jhelum', 'Khairpur', 'Khuzdar', 'Pakpattan', 'Kamoke', 'Mianwali'
    ];

    const [cities, setCities] = useState([]);
    const [locations, setLocations] = useState([]);

    const { data: typesData } = usePropertyTypes();
    const { data: citiesData } = useLocations({ type: 'City' });

    // Sync Property Types & Config
    useEffect(() => {
        if (typesData) {
            if (typesData.types) setPropertyTypes(typesData.types);
            if (typesData.priceRange || typesData.areaRange) {
                setConfig({
                    priceRange: typesData.priceRange || { min: 0, max: 5000000000 },
                    areaRange: typesData.areaRange || { min: 0, max: 5000 }
                });
                setPriceMax((typesData.priceRange?.max || 5000000000).toLocaleString());
                setAreaMax((typesData.areaRange?.max || 5000).toLocaleString());
            } else {
                setPropertyTypes(typesData);
            }
        }
    }, [typesData]);

    // Sync Cities
    useEffect(() => {
        if (citiesData && citiesData.length > 0) {
            setCities(citiesData);
        } else if (citiesData) {
            setCities(pakistaniCities.map(name => ({ name, _id: name })));
        }
    }, [citiesData]);

    const { data: cityAreas } = useCityAreas(city);

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
            const defaultUnit = getProvinceUnit(city);
            setAreaUnit(defaultUnit);
        }
    }, [city, propertyType]);

    // Fetch Locations logic (with fallback)
    useEffect(() => {
        const fallbackLocations = {
            'Islamabad': ['F-6', 'F-7', 'F-8', 'F-10', 'F-11', 'G-6', 'G-7', 'G-8', 'G-9', 'G-10', 'G-11', 'G-13', 'I-8', 'I-9', 'I-10', 'Bahria Town', 'DHA', 'PWD', 'Gulberg Greens'],
            'Karachi': ['DHA', 'Clifton', 'Gulshan-e-Iqbal', 'North Nazimabad', 'Gulistan-e-Johar', 'Malir', 'Korangi', 'Saddar', 'PECHS', 'Bahria Town', 'Scheme 33', 'North Karachi', 'Surjani Town'],
            'Lahore': ['DHA', 'Gulberg', 'Model Town', 'Johar Town', 'Bahria Town', 'Canal Road', 'Faisal Town', 'Garden Town', 'Iqbal Town', 'Wapda Town', 'Township', 'Allama Iqbal Town', 'Valencia Town'],
            'Rawalpindi': ['Bahria Town', 'DHA', 'Satellite Town', 'Chaklala', 'Saddar', 'PWD', 'Gulraiz', 'Westridge', 'Commercial Market', 'Askari'],
            'Faisalabad': ['Peoples Colony', 'Model Town', 'Gulberg', 'Samanabad', 'Jinnah Colony', 'Susan Road', 'Madina Town', 'Canal Road'],
            'Multan': ['Cantt', 'Gulgasht Colony', 'Model Town', 'Shah Rukn-e-Alam Colony', 'Bosan Road', 'DHA'],
            'Peshawar': ['Hayatabad', 'University Town', 'Saddar', 'Cantt', 'Regi Model Town', 'Gulbahar'],
            'Quetta': ['Cantt', 'Satellite Town', 'Jinnah Town', 'Samungli Road', 'Brewery Road'],
            'Gujranwala': ['Model Town', 'Satellite Town', 'Peoples Colony', 'Rahwali Cantt', 'Civil Lines'],
            'Sialkot': ['Cantt', 'Allama Iqbal Town', 'Defence Road', 'Rangpura', 'Kutchery Road']
        };

        if (cityAreas && cityAreas.length > 0) {
            setLocations(cityAreas.map(name => ({ name, _id: name })));
        } else if (city) {
            if (fallbackLocations[city]) {
                setLocations(fallbackLocations[city].map(name => ({ name, _id: name })));
            } else {
                setLocations([
                    { name: 'City Center', _id: 'center' },
                    { name: 'Cantt', _id: 'cantt' },
                    { name: 'Model Town', _id: 'model' },
                    { name: 'Satellite Town', _id: 'satellite' }
                ]);
            }
        }
    }, [cityAreas, city]);

    const areaPresets = ['5 Marla', '10 Marla', '15 Marla', '1 Kanal', '2 Kanal'];
    const bedroomOptions = ['Studio', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'];
    const bathroomOptions = ['1', '2', '3', '4', '5', '6+'];

    const handleBedroomToggle = (bed) => {
        if (bedrooms.includes(bed)) {
            setBedrooms(bedrooms.filter(b => b !== bed));
        } else {
            setBedrooms([...bedrooms, bed]);
        }
    };

    const handleBathroomToggle = (bath) => {
        if (bathrooms.includes(bath)) {
            setBathrooms(bathrooms.filter(b => b !== bath));
        } else {
            setBathrooms([...bathrooms, bath]);
        }
    };

    const handleReset = () => {
        setCity('Karachi');
        setLocation('');
        setPaymentType('Any');
        setPropertyCategory('Homes');
        setPropertyType('All');
        setPriceMin('0');
        setPriceMax('5,000,000,000');
        setAreaMin('0');
        setAreaMax('5,000');
        setBedrooms([]);
        setBathrooms([]);
        setKeyword('');
        setShowVerifiedAds(false);
        setShowVideosOnly(false);
        setShowImagesOnly(false);
    };

    const handleFind = () => {
        const params = new URLSearchParams();

        // Map BUY/RENT to proper purpose values
        if (wantTo === 'BUY') {
            params.append('purpose', 'For Sale');
        } else if (wantTo === 'RENT') {
            params.append('purpose', 'For Rent');
        } else if (wantTo === 'PROJECTS') {
            params.append('purpose', 'PROJECTS');
        }

        if (city) params.append('city', city);
        let searchVal = [];
        if (location) {
            searchVal.push(location);
        }
        if (propertyType !== 'All') params.append('type', propertyType);

        // Clean price values (remove commas) before sending
        if (priceMin && priceMin !== '0') {
            params.append('priceMin', priceMin.replace(/,/g, ''));
        }
        if (priceMax && priceMax !== '5,000,000,000') {
            params.append('priceMax', priceMax.replace(/,/g, ''));
        }

        // Clean area values (remove commas) and add unit
        if (areaMin && areaMin !== '0') {
            params.append('areaMin', areaMin.replace(/,/g, ''));
        }
        if (areaMax && areaMax !== '5,000') {
            params.append('areaMax', areaMax.replace(/,/g, ''));
        }
        if (areaUnit) {
            params.append('areaUnit', areaUnit);
        }

        if (bedrooms.length > 0) params.append('beds', bedrooms.join(','));
        if (bathrooms.length > 0) params.append('baths', bathrooms.join(','));
        
        if (keyword) searchVal.push(keyword);
        if (searchVal.length > 0) params.append('search', searchVal.join(' '));

        navigate(`/search?${params.toString()}`);
        onClose();
    };

    if (!isOpen) return null;

    const modalContent = (
        <div className={`mobile-filter-modal ${isOpen ? 'show' : ''}`}>

            {/* Main Filter Content */}
            <div className="mobile-filter-header">
                <FaArrowLeft className="back-icon" onClick={onClose} />
                <h2>Filters</h2>
                <button className="done-btn" onClick={onClose}>Done</button>
            </div>

            <div className="mobile-filter-content">
                {/* I want to - Buy/Rent */}
                {/* I want to - Buy/Rent */}
                <div className="filter-section">
                    <div className="filter-row-between">
                        <div className="filter-label-icon">
                            <span className="filter-label">I want to</span>
                        </div>
                        <div className="button-group-inline">
                            <button
                                className={`toggle-btn-inline ${wantTo === 'BUY' ? 'active' : ''}`}
                                onClick={() => setWantTo('BUY')}
                            >
                                Buy
                            </button>
                            <button
                                className={`toggle-btn-inline ${wantTo === 'RENT' ? 'active' : ''}`}
                                onClick={() => setWantTo('RENT')}
                            >
                                Rent
                            </button>
                        </div>
                    </div>
                </div>

                {/* City */}
                <div className="filter-section clickable" onClick={() => setShowCityModal(true)}>
                    <div className="filter-row-between">
                        <div className="filter-label-icon">
                            <div>
                                <div className="filter-label-small">City</div>
                                <div className="filter-value-green">{city}</div>
                            </div>
                        </div>
                        <FaChevronRight className="chevron-icon" />
                    </div>
                </div>

                {/* Select Location Trigger */}
                <div className="filter-section clickable" onClick={() => setShowLocationModal(true)}>
                    <div className="filter-row-between">
                        <div className="filter-label-icon">
                            <div>
                                <div className="filter-label-small">Select Location</div>
                                <div className="filter-value-green">{location || "Any"}</div>
                            </div>
                        </div>
                        <FaChevronRight className="chevron-icon" />
                    </div>
                </div>

                <div className="divider"></div>

                {/* Payment Type */}
                <div className="filter-section">
                    <div className="filter-row-between">
                        <div className="filter-label-icon">
                            <span className="filter-label">Payment Type</span>
                        </div>
                        <div className="pill-group-inline">
                            <button
                                className={`pill-btn-small ${paymentType === 'Any' ? 'active' : ''}`}
                                onClick={() => setPaymentType('Any')}
                            >
                                Any
                            </button>
                            <button
                                className={`pill-btn-small ${paymentType === 'Cash' ? 'active' : ''}`}
                                onClick={() => setPaymentType('Cash')}
                            >
                                Cash
                            </button>
                            <button
                                className={`pill-btn-small ${paymentType === 'Installments' ? 'active' : ''}`}
                                onClick={() => setPaymentType('Installments')}
                            >
                                Installments
                            </button>
                        </div>
                    </div>
                </div>

                <div className="divider"></div>

                {/* Property Type */}
                <div className="filter-section">
                    <div className="filter-label-icon">
                        <span className="filter-label">Property Type</span>
                    </div>

                    {/* Property Category Tabs */}
                    <div className="tab-group">
                        {Object.keys(propertyTypes).map(cat => (
                            <button
                                key={cat}
                                className={`tab-btn ${propertyCategory === cat ? 'active' : ''}`}
                                onClick={() => { 
                                    setPropertyCategory(cat); 
                                    if (propertyTypes[cat].length === 1) {
                                        setPropertyType(propertyTypes[cat][0]);
                                    } else {
                                        setPropertyType('All');
                                    }
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="divider-thin"></div>

                    {/* Property Type Specific Scrollable Row */}
                    <div className="pill-scroll-container">
                        {propertyTypes[propertyCategory].map(type => (
                            <button
                                key={type}
                                className={`pill-btn-icon ${propertyType === type ? 'active' : ''}`}
                                onClick={() => setPropertyType(type)}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="divider"></div>

                {/* Price Range */}
                <div className="filter-section">
                    <div className="filter-row-between">
                        <div className="filter-label-icon">
                            <span className="filter-label">Price Range</span>
                        </div>

                        <div className="range-inputs-inline">
                            <input
                                type="text"
                                placeholder="0"
                                value={priceMin}
                                onChange={(e) => setPriceMin(e.target.value)}
                                className="range-input-small"
                            />
                            <span className="range-divider-small">TO</span>
                            <input
                                type="text"
                                placeholder="Any"
                                value={priceMax}
                                onChange={(e) => setPriceMax(e.target.value)}
                                className="range-input-small"
                            />
                        </div>
                    </div>

                    <div className="range-labels">
                        <span className="range-label-text">0 PKR</span>
                        <span className="range-label-text">5 Arab</span>
                    </div>

                    {/* Dual Range Slider Price */}
                    <div className="range-slider-container">
                        <div className="slider-track"></div>
                        <div
                            className="slider-range-highlight"
                            style={{
                                left: `${(parseInt(priceMin.replace(/,/g, '') || 0) / config.priceRange.max) * 100}%`,
                                right: `${100 - (parseInt(priceMax.replace(/,/g, '') || config.priceRange.max) / config.priceRange.max) * 100}%`
                            }}
                        ></div>
                        <input
                            type="range"
                            min={config.priceRange.min}
                            max={config.priceRange.max}
                            value={parseInt(priceMin.replace(/,/g, '') || 0)}
                            onChange={(e) => {
                                const val = Math.min(Number(e.target.value), parseInt(priceMax.replace(/,/g, '') || config.priceRange.max) - 100000);
                                setPriceMin(val.toLocaleString());
                            }}
                            className="dual-range-slider"
                        />
                        <input
                            type="range"
                            min={config.priceRange.min}
                            max={config.priceRange.max}
                            value={parseInt(priceMax.replace(/,/g, '') || config.priceRange.max)}
                            onChange={(e) => {
                                const val = Math.max(Number(e.target.value), parseInt(priceMin.replace(/,/g, '') || 0) + 100000);
                                setPriceMax(val.toLocaleString());
                            }}
                            className="dual-range-slider"
                        />
                    </div>
                </div>

                <div className="divider"></div>

                {/* Area Range */}
                <div className="filter-section">
                    <div className="filter-row-between">
                        <div className="filter-label-icon">
                            <span className="filter-label">Area Range</span>
                        </div>

                        <div className="range-inputs-inline">
                            <input
                                type="text"
                                placeholder="0"
                                value={areaMin}
                                onChange={(e) => setAreaMin(e.target.value)}
                                className="range-input-small"
                            />
                            <span className="range-divider-small">TO</span>
                            <input
                                type="text"
                                placeholder="Any"
                                value={areaMax}
                                onChange={(e) => setAreaMax(e.target.value)}
                                className="range-input-small"
                            />
                        </div>
                    </div>

                    <div className="range-labels">
                        <span className="range-label-text">0 {areaUnit}</span>
                        <span className="range-label-text">5000 {areaUnit}</span>
                    </div>

                    {/* Dual Range Slider Area */}
                    <div className="range-slider-container">
                        <div className="slider-track"></div>
                        <div
                            className="slider-range-highlight"
                            style={{
                                left: `${(parseInt(areaMin.replace(/,/g, '') || 0) / config.areaRange.max) * 100}%`,
                                right: `${100 - (parseInt(areaMax.replace(/,/g, '') || config.areaRange.max) / config.areaRange.max) * 100}%`
                            }}
                        ></div>
                        <input
                            type="range"
                            min={config.areaRange.min}
                            max={config.areaRange.max}
                            value={parseInt(areaMin.replace(/,/g, '') || 0)}
                            onChange={(e) => {
                                const val = Math.min(Number(e.target.value), parseInt(areaMax.replace(/,/g, '') || config.areaRange.max) - 1);
                                setAreaMin(val.toLocaleString());
                            }}
                            className="dual-range-slider"
                        />
                        <input
                            type="range"
                            min={config.areaRange.min}
                            max={config.areaRange.max}
                            value={parseInt(areaMax.replace(/,/g, '') || config.areaRange.max)}
                            onChange={(e) => {
                                const val = Math.max(Number(e.target.value), parseInt(areaMin.replace(/,/g, '') || 0) + 1);
                                setAreaMax(val.toLocaleString());
                            }}
                            className="dual-range-slider"
                        />
                    </div>

                    {/* Area Unit Selection */}
                    <div className="filter-row-between mt-3">
                        <div className="filter-label-icon">
                            <span className="filter-label-small">Area Unit</span>
                        </div>
                        <div className="pill-group-inline">
                            {['Marla', 'Kanal', 'Square Yards', 'Sqft'].map(unit => (
                                <button
                                    key={unit}
                                    className={`pill-btn-small ${areaUnit === unit ? 'active' : ''}`}
                                    onClick={() => setAreaUnit(unit)}
                                >
                                    {unit === 'Square Yards' ? 'Sq. Yd.' : unit.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Area Presets */}
                    <div className="area-presets">
                        {areaPresets.map(preset => (
                            <button key={preset} className="preset-btn">
                                {preset}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="divider"></div>

                {/* Show Verified Ads Only */}
                <div className="filter-section">
                    <div className="checkbox-row">
                        <div>
                            <div className="checkbox-label">✓ Show Verified Ads Only</div>
                            <div className="checkbox-desc">
                                Zameen.com verifies the location, size and advertiser information of these listings.<br />
                                T&Cs apply.
                            </div>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={showVerifiedAds}
                                onChange={(e) => setShowVerifiedAds(e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>

                <div className="divider"></div>

                {/* Bedrooms */}
                <div className="filter-section">
                    <div className="filter-label-icon">
                        <span className="filter-label">Bedrooms</span>
                    </div>
                    <div className="grid-options">
                        {bedroomOptions.map(bed => (
                            <button
                                key={bed}
                                className={`grid-option-btn ${bedrooms.includes(bed) ? 'selected' : ''}`}
                                onClick={() => handleBedroomToggle(bed)}
                            >
                                {bed}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="divider"></div>

                {/* Bathrooms */}
                <div className="filter-section">
                    <div className="filter-label-icon">
                        <span className="filter-label">Bathrooms</span>
                    </div>
                    <div className="grid-options">
                        {bathroomOptions.map(bath => (
                            <button
                                key={bath}
                                className={`grid-option-btn ${bathrooms.includes(bath) ? 'selected' : ''}`}
                                onClick={() => handleBathroomToggle(bath)}
                            >
                                {bath}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="divider"></div>

                {/* Add Keyword */}
                <div className="filter-section">
                    <div className="filter-label-icon">
                        <span className="filter-label">Add Keyword</span>
                    </div>
                    <div className="keyword-input-row">
                        <input
                            type="text"
                            placeholder='Try "furnished", "low price" etc.'
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="keyword-input"
                        />
                        <button className="add-keyword-btn">
                            <FaPlus />
                        </button>
                    </div>
                </div>

                <div className="divider"></div>

                {/* Show Ads with Videos only */}
                <div className="filter-section">
                    <div className="checkbox-row-simple">
                        <div className="filter-label-icon">
                            <span className="filter-label">Show Ads with Videos only</span>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={showVideosOnly}
                                onChange={(e) => setShowVideosOnly(e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>

                <div className="divider"></div>

                {/* Show Ads with Images only */}
                <div className="filter-section">
                    <div className="checkbox-row-simple">
                        <div className="filter-label-icon">
                            <span className="filter-label">Show Ads with Images only</span>
                        </div>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={showImagesOnly}
                                onChange={(e) => setShowImagesOnly(e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </div>

            </div>

            {/* Footer Buttons */}
            <div className="mobile-filter-footer">
                <button className="reset-btn" onClick={handleReset}>RESET</button>
                <button className="find-btn" onClick={handleFind}>FIND</button>
            </div>

            {/* Select Location Overlay */}
            <div className={`location-modal-overlay ${showLocationModal ? 'show' : ''}`}>
                <div className="mobile-filter-header">
                    <h2>Select Location</h2>
                    <FaTimes className="back-icon" onClick={() => setShowLocationModal(false)} />
                </div>
                <div className="location-content">
                    <div className="location-search-container">
                        <input
                            type="text"
                            placeholder="Search Location"
                            className="location-search-input"
                            value={locationSearchQuery}
                            onChange={(e) => setLocationSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="location-list-section">
                        <h3 className="location-section-title">All Locations</h3>
                        {locations.length > 0 ? (
                            locations
                                .filter(loc => loc.name.toLowerCase().includes(locationSearchQuery.toLowerCase()))
                                .map((loc, idx) => (
                                    <div key={loc._id || idx} className="location-item" onClick={() => { setLocation(loc.name); setShowLocationModal(false); setLocationSearchQuery(''); }}>
                                        <div className="location-name">{loc.name}</div>
                                        <div className="location-count">Properties</div>
                                    </div>
                                ))
                        ) : (
                            <div className="location-item"><div className="location-name">No locations found or loading...</div></div>
                        )}
                    </div>
                </div>
                <div className="mobile-filter-footer">
                    <button className="find-btn w-100" onClick={() => setShowLocationModal(false)}>Done</button>
                </div>
            </div>

            {/* Select City Overlay */}
            <div className={`location-modal-overlay ${showCityModal ? 'show' : ''}`}>
                <div className="mobile-filter-header">
                    <h2>Select City</h2>
                    <FaTimes className="back-icon" onClick={() => setShowCityModal(false)} />
                </div>
                <div className="location-content">
                    <div className="location-search-container">
                        <input
                            type="text"
                            placeholder="Search City"
                            className="location-search-input"
                            value={citySearchQuery}
                            onChange={(e) => setCitySearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="location-list-section">
                        <h3 className="location-section-title">All Cities</h3>
                        {cities.length > 0 ? (
                            cities
                                .filter(cityItem => cityItem.name.toLowerCase().includes(citySearchQuery.toLowerCase()))
                                .map((cityItem, idx) => (
                                    <div key={cityItem._id || idx} className="location-item" onClick={() => { setCity(cityItem.name); setShowCityModal(false); setCitySearchQuery(''); }}>
                                        <div className="location-name">{cityItem.name}</div>
                                        <div className="location-count">City</div>
                                    </div>
                                ))
                        ) : (
                            <div className="location-item"><div className="location-name">Loading cities...</div></div>
                        )}
                    </div>
                </div>
                <div className="mobile-filter-footer">
                    <button className="find-btn w-100" onClick={() => setShowCityModal(false)}>Done</button>
                </div>
            </div>

        </div>
    );

    // Use React Portal to render modal at document root level
    return ReactDOM.createPortal(modalContent, document.body);
};

export default MobileFilterModal;

