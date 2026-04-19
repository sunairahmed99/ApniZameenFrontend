import React from 'react';
import './BrowseByCategory.css';
import { FaBuilding, FaMapMarkedAlt, FaStore, FaHome } from 'react-icons/fa';
import HorizontalScroll from './HorizontalScroll';

const BrowseByCategory = () => {
  const categories = [
    { icon: <FaBuilding />, name: 'Flats', count: '1050 Projects' },
    { icon: <FaMapMarkedAlt />, name: 'Plots', count: '600 Projects' },
    { icon: <FaStore />, name: 'Shops', count: '300 Projects' },
    { icon: <FaHome />, name: 'Houses', count: '150 Projects' },
    { icon: <FaBuilding />, name: 'Commercial', count: '200 Projects' },
    { icon: <FaMapMarkedAlt />, name: 'Farm Houses', count: '100 Projects' },
  ];

  return (
    <div className="browse-by-category">
      <h2 className="section-title">Browse Projects by Category</h2>
      <HorizontalScroll>
        {categories.map((cat, index) => (
          <div key={index} className="category-card">
            <div className="category-icon">{cat.icon}</div>
            <div className="category-name">{cat.name}</div>
            <div className="project-count">{cat.count}</div>
          </div>
        ))}
      </HorizontalScroll>
    </div>
  );
};

export default BrowseByCategory;
