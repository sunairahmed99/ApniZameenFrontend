import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProjectsList } from '../../hooks/useProjects';
import './DiscoverNewProjects.css';
import { FaCheckCircle } from 'react-icons/fa';
import HorizontalScroll from './HorizontalScroll';
import { NewProjectCardSkeleton } from '../Common/Skeleton';
import { API_BASE_URL } from '../../config';
import { getImageUrl } from '../../utils/formatters';

const DiscoverNewProjects = () => {
  const [selectedCity, setSelectedCity] = useState('Islamabad');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // 4 rows x 3 columns on desktop

  const cities = [
    'Islamabad', 'Karachi', 'Lahore', 'Rawalpindi', 'Faisalabad',
    'Multan', 'Peshawar', 'Gujranwala', 'Sialkot', 'Quetta', 'Hyderabad'
  ];

  const { data: projects = [], isLoading: loading } = useProjectsList({ city: selectedCity });

  useEffect(() => {
    setCurrentPage(1); // Reset to first page on city change
  }, [selectedCity]);

  // Pagination Logic
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const paginatedProjects = projects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <div className="discover-new-projects-v2 mb-5">
      <h2 className="main-project-heading mb-4 fw-bold">New Projects for Sale</h2>

      {/* City Tabs */}
      <div className="project-city-tabs-container mb-4">
        <div className="d-flex flex-wrap gap-2">
          {cities.map((city) => (
            <button
              key={city}
              className={`project-city-tab ${selectedCity === city ? 'active' : ''}`}
              onClick={() => setSelectedCity(city)}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="project-grid-v2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <NewProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="project-grid-v2">
            {paginatedProjects.map((project) => (
              <Link to={`/project-zameen/${project._id}`} key={project._id} className="project-card-v2 text-decoration-none">
                <div className="project-image-v2" style={{ backgroundImage: `url(${getImageUrl(project.thumbnail)})` }}>
                  {(project.isTrending || project.isHot) && (
                    <div className="trending-badge-v2">
                      <FaCheckCircle className="me-1" size={10} /> {project.isHot ? 'HOT' : 'TRENDING'}
                    </div>
                  )}
                </div>
                <div className="project-info-v2">
                  <div className="project-price-v2 text-success">
                    <span className="price-tag">PKR</span> {project.priceRange?.min} {project.priceRange?.unit} to {project.priceRange?.max} {project.priceRange?.unit}
                  </div>
                  <h3 className="project-name-v2 text-dark">{project.name}</h3>
                  <p className="project-location-v2 text-muted">{project.area}, {project.city}</p>
                </div>
              </Link>
            ))}
          </div>

          {projects.length === 0 && (
            <div className="text-center py-5 w-100">
              <p className="text-muted">No new projects found in {selectedCity} at the moment.</p>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-container-v2 d-flex justify-content-center mt-5 gap-2">
              <button
                className="pagination-btn-v2"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx + 1}
                  className={`pagination-btn-v2 ${currentPage === idx + 1 ? 'active' : ''}`}
                  onClick={() => handlePageChange(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                className="pagination-btn-v2"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DiscoverNewProjects;
