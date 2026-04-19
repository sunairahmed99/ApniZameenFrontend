import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaFilter, FaTimes } from 'react-icons/fa';
import './CompactSearchFilter.css';
import { logEvent } from '../../utils/analytics';

const CompactSearchFilter = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Initialize state from URL params
    const [purpose, setPurpose] = useState(searchParams.get('purpose') || 'Buy');
    const [city, setCity] = useState(searchParams.get('city') || 'Karachi');
    const [location, setLocation] = useState(searchParams.get('location') || '');
    const [type, setType] = useState(searchParams.get('type') || 'Homes');
    const [areaMin, setAreaMin] = useState(searchParams.get('areaMin') || '0');
    const [areaMax, setAreaMax] = useState(searchParams.get('areaMax') || 'Any');
    const [priceMin, setPriceMin] = useState(searchParams.get('priceMin') || '0');
    const [priceMax, setPriceMax] = useState(searchParams.get('priceMax') || 'Any');
    const [beds, setBeds] = useState(searchParams.get('beds') || 'All');
    const [baths, setBaths] = useState(searchParams.get('baths') || 'All');
    const [areaUnit, setAreaUnit] = useState(searchParams.get('areaUnit') || 'Marla');
    const [keyword, setKeyword] = useState(searchParams.get('search') || '');

    // Options
    const cities = ['Karachi', 'Islamabad', 'Lahore', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta'];
    const types = ['Homes', 'Plots', 'Commercial'];
    const bedOptions = ['All', 'Studio', '1', '2', '3', '4', '5', '6', '7+'];
    const bathOptions = ['All', '1', '2', '3', '4', '5', '6+'];

    // Handlers
    const handleSearch = () => {
        const params = new URLSearchParams();
        if (purpose) params.append('purpose', purpose);
        if (city) params.append('city', city);
        if (location) params.append('location', location);
        if (type) params.append('type', type);
        if (areaMin && areaMin !== '0') params.append('areaMin', areaMin);
        if (areaMax && areaMax !== 'Any') params.append('areaMax', areaMax);
        if (priceMin && priceMin !== '0') params.append('priceMin', priceMin);
        if (priceMax && priceMax !== 'Any') params.append('priceMax', priceMax);
        if (beds && beds !== 'All') params.append('beds', beds);
        if (baths && baths !== 'All') params.append('baths', baths);
        if (areaUnit) params.append('areaUnit', areaUnit);
        if (keyword) params.append('search', keyword);

        logEvent('search', {
            city,
            type,
            purpose,
            location,
            keyword
        });

        setIsMobileOpen(false); // Close mobile modal on search
        navigate(`/search?${params.toString()}`);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    // Filter UI Components (Reusable)
    const FilterFields = () => (
        <>
            <div className="row g-2 mb-2">
                <div className="col-md-2 col-6">
                    <label className="filter-label">PURPOSE</label>
                    <select className="form-select form-select-sm rounded-0" value={purpose} onChange={e => setPurpose(e.target.value)}>
                        <option value="Buy">Buy</option>
                        <option value="Rent">Rent</option>
                    </select>
                </div>
                <div className="col-md-2 col-6">
                    <label className="filter-label">CITY</label>
                    <select className="form-select form-select-sm rounded-0" value={city} onChange={e => setCity(e.target.value)}>
                        {cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div className="col-md-4 col-12">
                    <label className="filter-label">LOCATION</label>
                    <input
                        type="text"
                        className="form-control form-control-sm rounded-0"
                        placeholder="Enter location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                <div className="col-md-2 col-6">
                    <label className="filter-label">TYPE</label>
                    <select className="form-select form-select-sm rounded-0" value={type} onChange={e => setType(e.target.value)}>
                        {types.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div className="col-md-2 col-6">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <label className="filter-label m-0">AREA</label>
                        <select
                            className="border-0 p-0 m-0 small fw-bold text-success bg-transparent outline-none"
                            style={{ fontSize: '10px' }}
                            value={areaUnit}
                            onChange={e => setAreaUnit(e.target.value)}
                        >
                            <option value="Marla">Marla</option>
                            <option value="Kanal">Kanal</option>
                            <option value="Square Yards">Sq. Yard</option>
                        </select>
                    </div>
                    <div className="d-flex align-items-center bg-white border rounded-0 px-1" style={{ height: '31px' }}>
                        <input type="text" className="border-0 w-50 small text-center outline-none" value={areaMin} onChange={e => setAreaMin(e.target.value)} />
                        <span className="text-muted mx-1" style={{ fontSize: '10px' }}>-</span>
                        <input type="text" className="border-0 w-50 small text-center outline-none" value={areaMax} onChange={e => setAreaMax(e.target.value)} />
                    </div>
                </div>
            </div>

            <div className="row g-2">
                <div className="col-md-3 col-12">
                    <label className="filter-label">PRICE (PKR)</label>
                    <div className="d-flex align-items-center bg-white border rounded-0 px-1" style={{ height: '31px' }}>
                        <input type="text" className="border-0 w-50 small text-center outline-none" value={priceMin} onChange={e => setPriceMin(e.target.value)} />
                        <span className="text-muted mx-1" style={{ fontSize: '10px' }}>-</span>
                        <input type="text" className="border-0 w-50 small text-center outline-none" value={priceMax} onChange={e => setPriceMax(e.target.value)} />
                    </div>
                </div>
                <div className="col-md-2 col-6">
                    <label className="filter-label">BEDS</label>
                    <select className="form-select form-select-sm rounded-0" value={beds} onChange={e => setBeds(e.target.value)}>
                        {bedOptions.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                </div>
                <div className="col-md-2 col-6">
                    <label className="filter-label">BATHS</label>
                    <select className="form-select form-select-sm rounded-0" value={baths} onChange={e => setBaths(e.target.value)}>
                        {bathOptions.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                </div>
                <div className="col-md-3 col-12">
                    <label className="filter-label">KEYWORD</label>
                    <input
                        type="text"
                        className="form-control form-control-sm rounded-0"
                        placeholder="e.g. pool"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                <div className="col-md-2 col-12 d-flex align-items-end">
                    <button className="btn btn-success btn-sm w-100 rounded-0 fw-bold" onClick={handleSearch} style={{ height: '31px' }}>
                        SEARCH
                    </button>
                </div>
            </div>
        </>
    );

    return (
        <>
            {/* Desktop View: Always Visible Bar */}
            <div className="compact-filter-wrapper w-100 bg-black p-3 d-none d-lg-block">
                <div className="container">
                    <FilterFields />
                </div>
            </div>

            {/* Mobile View: Toggle Button + Modal */}
            <div className="d-lg-none">
                {/* Floating Action Button */}
                <button
                    className="mobile-filter-btn btn btn-success d-flex align-items-center justify-content-center"
                    onClick={() => setIsMobileOpen(true)}
                >
                    <FaFilter className="text-white fs-4" />
                </button>

                {/* Modal Overlay */}
                {isMobileOpen && (
                    <div className="mobile-filter-overlay">
                        <div className="mobile-filter-content">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-bold m-0">Filter Properties</h5>
                                <button className="btn btn-sm btn-outline-secondary" onClick={() => setIsMobileOpen(false)}>
                                    <FaTimes />
                                </button>
                            </div>

                            {/* Reusing fields but slightly adjusted container if needed */}
                            <div className="mobile-fields-container">
                                <FilterFields />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default CompactSearchFilter;
