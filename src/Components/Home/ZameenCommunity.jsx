import React from 'react';
import { FaArrowRight, FaBullhorn, FaComments } from 'react-icons/fa';
import { useBlogs } from '../../hooks/useBlogs';
import { Link } from 'react-router-dom';
import OptimizedImage from '../OptimizedImage';
import './ZameenCommunity.css';

const ZameenCommunity = () => {
  const { data, isLoading } = useBlogs(1, 8);
  const blogs = data?.blogs || [];

  // Split blogs into two columns
  const firstColBlogs = blogs.slice(0, 4).map(blog => ({
    id: blog._id,
    title: blog.title,
    date: new Date(blog.date || blog.createdAt).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),
    image: blog.thumbnail,
    slug: blog._id
  }));

  const secondColBlogs = blogs.slice(4, 8).map(blog => ({
    id: blog._id,
    title: blog.title,
    date: new Date(blog.date || blog.createdAt).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),
    image: blog.thumbnail,
    slug: blog._id
  }));

  return (
    <div className="zameen-community-section py-5">
      <div className="container">
        <h2 className="section-title fw-bold mb-4">Zameen Community</h2>

        <div className="row g-4">
          {/* Column 1 */}
          <div className="col-12 col-md-6">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center gap-2 text-success">
                <FaBullhorn />
                <h5 className="mb-0 fw-bold text-dark">Latest Blogs</h5>
              </div>
              <Link to="/blog" className="text-decoration-none small fw-bold text-primary d-flex align-items-center">
                View All <FaArrowRight className="ms-1" size={10} />
              </Link>
            </div>

            <div className="news-list">
              {isLoading ? (
                <p>Loading news...</p>
              ) : firstColBlogs.map(item => (
                <Link key={item.id} to={`/blog/${item.id}`} className="text-decoration-none d-flex gap-3 mb-4 align-items-start">
                  <OptimizedImage 
                      src={item.image} 
                      alt={item.title || 'Blog Thumbnail'} 
                      className="rounded" 
                      width={60} 
                      height={60} 
                      style={{ objectFit: 'cover' }} 
                  />
                  <div>
                    <h6 className="mb-1 fw-normal text-dark hover-link">{item.title}</h6>
                    <small className="text-muted">{item.date}</small>
                  </div>
                </Link>
              ))}
              {firstColBlogs.length === 0 && !isLoading && <p>No blogs available.</p>}
            </div>
          </div>

          {/* Column 2 */}
          <div className="col-12 col-md-6">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center gap-2 text-success">
                <FaBullhorn />
                <h5 className="mb-0 fw-bold text-dark">More Blogs</h5>
              </div>
              <Link to="/blog" className="text-decoration-none small fw-bold text-primary d-flex align-items-center">
                View All <FaArrowRight className="ms-1" size={10} />
              </Link>
            </div>

            <div className="news-list">
              {isLoading ? (
                <p>Loading more blogs...</p>
              ) : secondColBlogs.map(item => (
                <Link key={item.id} to={`/blog/${item.id}`} className="text-decoration-none d-flex gap-3 mb-4 align-items-start">
                  <OptimizedImage 
                      src={item.image} 
                      alt={item.title || 'Blog Thumbnail'} 
                      className="rounded" 
                      width={60} 
                      height={60} 
                      style={{ objectFit: 'cover' }} 
                  />
                  <div>
                    <h6 className="mb-1 fw-normal text-dark hover-link">{item.title}</h6>
                    <small className="text-muted">{item.date}</small>
                  </div>
                </Link>
              ))}
              {secondColBlogs.length === 0 && !isLoading && <p>No more blogs available.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZameenCommunity;
