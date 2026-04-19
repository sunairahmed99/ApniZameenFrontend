import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useCategoryCounts } from '../../hooks/useProperties';

const CategoryCard = ({ icon, title, categories, city }) => {
  const Icon = icon;
  const categoryNames = Object.keys(categories);
  const [activeTab, setActiveTab] = useState(categoryNames[0] || '');
  const [currentPage, setCurrentPage] = useState(0);
  const scrollRef = useRef(null);

  // Optimize: Only fetch counts for the active tab to reduce API calls
  const activeCategoryData = { [activeTab]: categories[activeTab] };
  const { data: propertyCounts = {} } = useCategoryCounts(activeCategoryData, city);

  const currentCategoryItems = categories[activeTab] || [];

  // Calculate total pages (6 items per view: 2 rows * 3 cols)
  const itemsPerView = 6;
  const totalPages = Math.ceil(currentCategoryItems.length / itemsPerView);

  const handleNext = () => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const width = scrollRef.current.clientWidth;
      const newPage = Math.round(scrollLeft / width);
      setCurrentPage(newPage);
    }
  };

  const navigate = useNavigate();

  const handleItemClick = (item) => {
    // 1. Determine effective City
    const effectiveCity = item.query?.city || city || 'Pakistan';

    // 2. Determine effective Type (Slugified)
    let typeSlug = 'Properties';
    let isTypeBased = false;

    if (item.query) {
      if (item.query.propertyType) {
        // e.g. "Flat", "House", "Upper Portion"
        // Convert to plural slug: "Flats", "Houses", "Upper_Portions"
        const type = item.query.propertyType;
        if (['House', 'Flat', 'Plot', 'Shop', 'Office', 'Room'].includes(type)) {
          typeSlug = type + 's';
        } else if (type === 'Farm House') {
          typeSlug = 'Farm_Houses';
        } else if (type === 'Penthouse') {
          typeSlug = 'Penthouses';
        } else if (type === 'Lower Portion') {
          typeSlug = 'Lower_Portions';
        } else if (type === 'Upper Portion') {
          typeSlug = 'Upper_Portions';
        } else {
          typeSlug = type.replace(/ /g, '_');
        }
        isTypeBased = true;
      }
    }

    // 3. Check for Location/Area based items vs Type based items
    // If it has a specific location/area, we might want to stick to query params 
    // OR create a more complex route. For now, Zameen uses /Type/City for generic browsing.
    // If specific location is present, maybe fall back to search URL or handle /Type/City/Location?

    const hasComplexFilters = item.query?.location || item.query?.areaSize || item.query?.search;

    if (!hasComplexFilters && isTypeBased) {
      // Use efficient route: /Upper_Portions/Islamabad
      navigate(`/${typeSlug}/${effectiveCity}`);
    } else {
      // Fallback to legacy query params for complex queries
      const params = new URLSearchParams();

      if (item.query) {
        if (item.query.propertyType) params.append('type', item.query.propertyType);
        params.append('city', effectiveCity);

        // Fix: Map location to 'location' param, not search
        if (item.query.location) params.append('location', item.query.location);

        // Fix: Map Area Size and Unit
        if (item.query.areaSize) {
          // Assuming areaSize is a single number like '5', set both min and max to it for exact match
          params.append('areaMin', item.query.areaSize);
          params.append('areaMax', item.query.areaSize);
        }
        if (item.query.areaUnit) params.append('areaUnit', item.query.areaUnit);

        if (item.query.search) params.append('search', item.query.search);
      }

      // Navigate to Search Results with Query Params
      navigate(`/search?${params.toString()}`);
    }
  };

  // Reset scroll and page when tab changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: 'instant' });
      setCurrentPage(0);
    }
  }, [activeTab]);

  return (
    <div className="category-card bg-white rounded border p-3 h-100 position-relative">
      <div className="d-flex align-items-center mb-3">
        <div className="cat-icon-wrapper me-2">
          <Icon size={24} className="cat-icon" />
        </div>
        <h5 className="mb-0 fw-bold">{title}</h5>
      </div>

      {/* Tabs */}
      <div className="card-tabs d-flex border-bottom mb-3 overflow-auto">
        {categoryNames.map((tab) => (
          <div
            key={tab}
            className={`card-tab pb-2 me-3 cursor-pointer text-nowrap ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="cat-grid-wrapper position-relative">
        {/* Left Arrow - Show only if we can go back */}
        {currentPage > 0 && (
          <div className="grid-arrow left-arrow" onClick={handlePrev}>
            <FaChevronLeft />
          </div>
        )}

        <div
          className="cat-grid"
          ref={scrollRef}
          onScroll={handleScroll}
        >
          {currentCategoryItems.map((item, index) => (
            <div
              key={index}
              className="cat-item p-2 rounded text-center mb-2 shadow-sm"
              onClick={() => handleItemClick(item)}
            >
              <div className="cat-item-title fw-bold text-dark">
                {item.title}
                {propertyCounts[item.title] !== undefined && (
                  <span className="text-muted ms-1">({propertyCounts[item.title]})</span>
                )}
              </div>
              {item.subtitle && <div className="cat-item-subtitle text-muted mt-1">{item.subtitle}</div>}
            </div>
          ))}
        </div>

        {/* Right Arrow - Show only if we have more pages */}
        {currentPage < totalPages - 1 && (
          <div className="grid-arrow right-arrow" onClick={handleNext}>
            <FaChevronRight />
          </div>
        )}
      </div>

      {/* Pagination Dots */}
      {totalPages > 1 && (
        <div className="pagination-dots">
          {Array.from({ length: totalPages }).map((_, index) => (
            <div
              key={index}
              className={`dot ${currentPage === index ? 'active' : ''}`}
              onClick={() => {
                if (scrollRef.current) {
                  scrollRef.current.scrollTo({ left: index * scrollRef.current.clientWidth, behavior: 'smooth' });
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(CategoryCard);
