import React, { useEffect, useState } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer/Footer';
import HorizontalPropertyCard from '../Components/Home/HorizontalPropertyCard';
import Banner from '../Components/Home/Banner';
import SEO from '../Components/SEO';
import { FaSearch } from 'react-icons/fa';
import './SearchResults.css'; // Import CSS
import { useSocket } from '../context/SocketContext'; // Adjust path as needed
import { useProperties, usePropertyCounts } from '../hooks/useProperties';

// Helper to de-slugify type
const normalizeType = (slug) => {
    if (!slug) return null;
    if (slug === 'Houses') return 'House';
    if (slug === 'Flats') return 'Flat';
    if (slug === 'Plots') return 'Plots'; // 'Plots' usually maps to category, but if specific type needed: 'Residential Plot'
    if (slug === 'Shops') return 'Shop';
    if (slug === 'Offices') return 'Office';
    if (slug === 'Farm_Houses') return 'Farm House';
    if (slug === 'Penthouses') return 'Penthouse';
    if (slug === 'Lower_Portions') return 'Lower Portion';
    if (slug === 'Upper_Portions') return 'Upper Portion';
    if (slug === 'Rooms') return 'Room';
    return slug.replace(/_/g, ' ');
};

// Property categories for tabs
const PROPERTY_CATEGORIES = [
    { name: 'All Homes', value: null },
    { name: 'Houses', value: 'House' },
    { name: 'Flats', value: 'Flat' },
    { name: 'Farm Houses', value: 'Farm House' },
    { name: 'Penthouse', value: 'Penthouse' },
    { name: 'Lower Portions', value: 'Lower Portion' },
    { name: 'Upper Portions', value: 'Upper Portion' }
];

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const { city: routeCity, type: routeType } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Prioritize Route params over Query params
    const city = routeCity || searchParams.get('city');
    const typeParam = normalizeType(routeType) || searchParams.get('type');

    // Logic to distinguish if 'typeParam' is a specific Property Type or a High Level Category
    // e.g. /Plots/Islamabad -> Category=PLOTS
    // e.g. /Houses/Islamabad -> Type=House, Category=HOMES implied

    let type = typeParam;
    let category = searchParams.get('category');

    if (routeType === 'Plots') {
        type = null;
        category = 'PLOTS';
    } else if (routeType === 'Commercial') {
        type = null;
        category = 'COMMERCIAL';
    } else if (routeType === 'Homes') {
        type = null;
        category = 'HOMES';
    }

    const location = searchParams.get('location'); // Added location parameter

    // Area Size Parsing Logic
    // Pattern: 5_Marla_Homes -> Size: 5, Unit: Marla, Type: Homes (-> House)
    let routeAreaMin = null;
    let routeAreaMax = null;
    let routeAreaUnit = null;

    if (routeType && routeType.includes('_')) {
        // Attempt to parse Area Size Slug
        const parts = routeType.split('_');
        // Check if first part is a number and second is a unit
        // Simple heuristic: 1st is numeric, 2nd is string like Marla/Kanal/Sq. Yd.
        const likelySize = parseFloat(parts[0]);

        if (!isNaN(likelySize)) {
            routeAreaMin = parts[0];
            routeAreaMax = parts[0];
            routeAreaUnit = parts[1]; // Marla, Kanal, Sq, Yd

            // Re-determine Type from the rest
            // 5_Marla_Homes -> parts[2] = Homes -> normalize to House
            if (parts.length >= 3) {
                const typePart = parts.slice(2).join('_');
                type = normalizeType(typePart);
                // If type is generic "Properties", type remains null or handled?
                if (typePart === 'Properties' || typePart === 'properties') type = null;
            }
        }
    }
    // const type = searchParams.get('type'); // Handled above
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const areaMin = routeAreaMin || searchParams.get('areaMin');
    const areaMax = routeAreaMax || searchParams.get('maxArea') || searchParams.get('areaMax'); // Fixed maxArea naming inconsistency if any
    const areaUnit = routeAreaUnit || searchParams.get('areaUnit');
    const beds = searchParams.get('beds');
    const baths = searchParams.get('baths');
    const search = searchParams.get('search'); // Generic text search
    const purpose = searchParams.get('purpose'); // Remove default 'For Sale' to allow global search from browse boxes
    // const category = searchParams.get('category'); // Handled above


    const [activeCategory, setActiveCategory] = useState(type || null);

    const handleCategoryClick = (categoryValue) => {
        setActiveCategory(categoryValue);
        const newParams = new URLSearchParams(searchParams);
        if (categoryValue) {
            newParams.set('type', categoryValue);
        } else {
            newParams.delete('type');
        }
        navigate(`/search?${newParams.toString()}`);
    };


    // Define property types for each category
    const categoryTypes = {
        'HOMES': ['House', 'Flat', 'Upper Portion', 'Lower Portion', 'Farm House', 'Room', 'Penthouse'],
        'PLOTS': ['Plot'],
        'COMMERCIAL': ['Commercial']
    };

    // Map type to category for Navbar highlighting
    let navCategory = category || '';
    if (type && !category) {
        if (['House', 'Flat', 'Upper Portion', 'Lower Portion', 'Farm House', 'Room', 'Penthouse', 'Homes'].includes(type)) navCategory = 'HOMES';
        else if (['Plot', 'Plots'].includes(type)) navCategory = 'PLOTS';
        else if (['Commercial'].includes(type)) navCategory = 'COMMERCIAL';
    }

    // Fetch aggregate counts
    const { data: rawCounts = {} } = usePropertyCounts({ city, purpose, location, search, priceMin, priceMax, areaMin, areaMax, areaUnit, beds, baths });

    const categoryCounts = React.useMemo(() => {
        const counts = { ...rawCounts };
        const homesTypes = ['House', 'Flat', 'Upper Portion', 'Lower Portion', 'Farm House', 'Penthouse', 'Room'];
        let homesCount = 0;
        homesTypes.forEach(t => {
            if (counts[t]) homesCount += counts[t];
        });
        counts["All Homes"] = homesCount;
        return counts;
    }, [rawCounts]);

    // Fetch property listings
    const { data: filteredProjects = [], isLoading: loading } = useProperties({ city, location, type, category, purpose, minPrice: priceMin, maxPrice: priceMax, areaMin, areaMax, areaUnit, beds, baths, search }, { keepPreviousData: true });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    // Previous client-side filtering logic removed as backend handles it now

    // Effect to reset pagination and scroll to top when URL parameters change
    useEffect(() => {
        setCurrentPage(1);
        window.scrollTo(0, 0);
    }, [searchParams, routeCity, routeType]);

    // State for search filter - normalize purpose to match BUY/RENT tabs
    const [listingType, setListingType] = useState(purpose === 'For Rent' ? 'RENT' : 'BUY');
    const [cityState, setCityState] = useState(city || 'Karachi');

    // Sync banner state with URL params
    useEffect(() => {
        setListingType(purpose === 'For Rent' ? 'RENT' : 'BUY');
        setCityState(city || 'Karachi');
    }, [purpose, city]);

    return (
        <div className="search-results-page bg-light min-vh-100 page-fade-in">
            <SEO
                title={`${filteredProjects.length.toLocaleString()} ${type || 'Properties'}${purpose ? ` for ${purpose === 'For Rent' ? 'Rent' : 'Sale'}` : ''}${city ? ` in ${city}` : ''} | Zameen`}
                description={`Browse ${filteredProjects.length.toLocaleString()} ${type || 'properties'} ${purpose ? `for ${purpose.toLowerCase()}` : ''} ${city ? `in ${city}` : 'across Pakistan'}. Find houses, plots, and commercial properties with verified sellers and agents.`}
                keywords={`${type || 'property'} ${purpose ? purpose.toLowerCase() : ''} ${city || 'Pakistan'}, real estate ${city || 'Pakistan'}, ${type || 'properties'} ${city || ''}`}
            />
            <Navbar listingType={purpose} currentCategory={category} />

            {/* Banner Section with Search Filter */}
            <Banner
                currentCategory={category}
                listingType={listingType}
                setListingType={setListingType}
                city={cityState}
                setCity={setCityState}
                showSearchFilter={true}
                showHeading={false}
            >
            </Banner>

            <div className="container">
                <div className="bg-white p-3 rounded-top shadow-sm mb-0">
                    <h2 className="results-heading mb-4" style={{ fontSize: '1.4rem' }}>
                        {filteredProjects.length.toLocaleString()} Properties {purpose ? `for ${purpose === 'For Rent' ? 'Rent' : 'Sale'}` : ''} {(search || location || city) ? `in ${search || location || city}` : ''}
                    </h2>

                    <div className="d-flex justify-content-between align-items-start">
                        {/* Category Tabs Grid */}
                        <div className="property-category-grid">
                            {PROPERTY_CATEGORIES.map((cat) => {
                                const count = cat.name === 'All Homes'
                                    ? categoryCounts['All Homes']
                                    : categoryCounts[cat.value];

                                return (
                                    <div
                                        key={cat.value || 'all'}
                                        className={`category-tab-refined ${activeCategory === cat.value ? 'active' : ''}`}
                                        onClick={() => handleCategoryClick(cat.value)}
                                    >
                                        <div className="cat-name">{cat.name}</div>
                                        <div className="cat-count">({(count || 0).toLocaleString()})</div>
                                    </div>
                                );
                            })}
                        </div>


                    </div>
                </div>

                <div className="divider-full"></div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : filteredProjects.length > 0 ? (
                    <>
                        <div className="row g-4">
                            {currentItems.map((project, index) => (
                                <div key={`${project._id}-${index}`} className="col-12">
                                    <HorizontalPropertyCard property={project} />

                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {filteredProjects.length > itemsPerPage && (
                            <div className="d-flex justify-content-center mt-5">
                                <nav>
                                    <ul className="pagination">
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <button className="page-link text-success" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                                                &laquo; Previous
                                            </button>
                                        </li>
                                        {(() => {
                                            const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
                                            const pageNumbers = [];
                                            const delta = 2; // Pages to show around current page

                                            for (let i = 1; i <= totalPages; i++) {
                                                if (
                                                    i === 1 ||
                                                    i === totalPages ||
                                                    (i >= currentPage - delta && i <= currentPage + delta)
                                                ) {
                                                    pageNumbers.push(i);
                                                } else if (
                                                    (i === currentPage - delta - 1) ||
                                                    (i === currentPage + delta + 1)
                                                ) {
                                                    pageNumbers.push('...');
                                                }
                                            }

                                            // Deduplicate '...' if they appear consecutively (simple filter)
                                            // The logic above naturally produces unique '...' unless delta overlaps with ends, 
                                            // but let's ensure we render correctly.
                                            // Actually the logic above might push '...' multiple times if not careful? 
                                            // Let's use a simpler known algorithm or just clean up the generic loop above.

                                            // Refined Loop for React Render:
                                            const renderPages = [];
                                            if (totalPages <= 7) {
                                                for (let i = 1; i <= totalPages; i++) renderPages.push(i);
                                            } else {
                                                if (currentPage <= 4) {
                                                    // Start Case: 1 2 3 4 5 ... 20
                                                    for (let i = 1; i <= 5; i++) renderPages.push(i);
                                                    renderPages.push('...');
                                                    renderPages.push(totalPages);
                                                } else if (currentPage >= totalPages - 3) {
                                                    // End Case: 1 ... 16 17 18 19 20
                                                    renderPages.push(1);
                                                    renderPages.push('...');
                                                    for (let i = totalPages - 4; i <= totalPages; i++) renderPages.push(i);
                                                } else {
                                                    // Middle Case: 1 ... 9 10 11 ... 20
                                                    renderPages.push(1);
                                                    renderPages.push('...');
                                                    renderPages.push(currentPage - 1);
                                                    renderPages.push(currentPage);
                                                    renderPages.push(currentPage + 1);
                                                    renderPages.push('...');
                                                    renderPages.push(totalPages);
                                                }
                                            }

                                            return renderPages.map((number, index) => (
                                                <li key={index} className={`page-item ${currentPage === number ? 'active' : ''} ${number === '...' ? 'disabled' : ''}`}>
                                                    <button
                                                        onClick={() => number !== '...' && paginate(number)}
                                                        className={`page-link ${currentPage === number ? 'bg-success border-success text-white' : 'text-success'}`}
                                                        disabled={number === '...'}
                                                    >
                                                        {number}
                                                    </button>
                                                </li>
                                            ));
                                        })()}
                                        <li className={`page-item ${currentPage === Math.ceil(filteredProjects.length / itemsPerPage) ? 'disabled' : ''}`}>
                                            <button className="page-link text-success" onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(filteredProjects.length / itemsPerPage)}>
                                                Next &raquo;
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-5 bg-white rounded shadow-sm">
                        <FaSearch size={48} className="text-muted mb-3" />
                        <h4>No Properties Found</h4>
                        <p className="text-muted">Try adjusting your search criteria or removing some filters.</p>
                    </div>
                )}
            </div>

            {/* Location / About Section */}
            {city && (
                <div className="container pb-5">
                    <div className="row">
                        <div className="col-12">
                            <div className="bg-white p-4 rounded border shadow-sm">
                                <h3 className="fw-bold mb-3">About Property in {city}</h3>
                                <p className="text-muted mb-4">
                                    The bustling city of {city} has always been awe-inspiring for tourists and even the metropolis's own residents.
                                    It is popularly believed that a person who has resided in {city} is seldom likely to choose another city in Pakistan for residence.
                                    Being home to several multi-national organizations, a thriving trade and business sector, and a large and diverse population, property in {city} is in high demand for both commercial and residential purposes.
                                </p>

                                <h5 className="fw-bold mb-3">Locations of Homes For Sale in {city}</h5>
                                <div className="row">
                                    {/* Mock List of Locations */}
                                    <div className="col-md-3 mb-2"><span className="text-primary cursor-pointer">DHA Defence</span> <span className="text-muted small">(5,419)</span></div>
                                    <div className="col-md-3 mb-2"><span className="text-primary cursor-pointer">Bahria Town</span> <span className="text-muted small">(2,717)</span></div>
                                    <div className="col-md-3 mb-2"><span className="text-primary cursor-pointer">Gulshan-e-Iqbal</span> <span className="text-muted small">(2,410)</span></div>
                                    <div className="col-md-3 mb-2"><span className="text-primary cursor-pointer">Scheme 33</span> <span className="text-muted small">(2,304)</span></div>
                                    <div className="col-md-3 mb-2"><span className="text-primary cursor-pointer">Clifton</span> <span className="text-muted small">(1,547)</span></div>
                                    <div className="col-md-3 mb-2"><span className="text-primary cursor-pointer">North Nazimabad</span> <span className="text-muted small">(1,441)</span></div>
                                    <div className="col-md-3 mb-2"><span className="text-primary cursor-pointer">Gadap Town</span> <span className="text-muted small">(1,029)</span></div>
                                    <div className="col-md-3 mb-2"><span className="text-primary cursor-pointer">Jamshed Town</span> <span className="text-muted small">(1,019)</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default SearchResults;
