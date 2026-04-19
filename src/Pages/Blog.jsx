import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useBlogs } from '../hooks/useBlogs';
import Navbar from '../Components/Navbar';
import Banner from '../Components/Home/Banner';
import Footer from '../Components/Footer/Footer';
import SEO from '../Components/SEO';
import { FaRegClock, FaUser, FaChevronRight } from 'react-icons/fa';
import './Blog.css';

const Blog = () => {
    const location = useLocation();
    const [currentCategory, setCurrentCategory] = useState('HOMES');
    const [listingType, setListingType] = useState('BUY');
    const [city, setCity] = useState('Karachi');
    const [page, setPage] = useState(1);
    const pageSize = 9;

    const { data, isLoading } = useBlogs(page, pageSize);
    const blogPosts = data?.blogs || [];
    const totalPages = data?.pages || 1;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="blog-page">
            <SEO
                title="Zameen Blog - Real Estate News, Guides & Lifestyle in Pakistan"
                description="Stay updated with the latest real estate trends, property news, investment guides, and lifestyle tips in Pakistan."
            />
            <Navbar
                currentCategory={currentCategory}
                setCurrentCategory={setCurrentCategory}
                listingType={listingType}
                setListingType={setListingType}
            />
            <Banner
                currentCategory={currentCategory}
                listingType={listingType}
                setListingType={setListingType}
                city={city}
                setCity={setCity}
                showHeading={false}
                showSearchFilter={false}
            />

            <div className="blog-content-container container py-5">
                <div className="row">
                    <div className="col-lg-8">
                        {/* Blog Grid */}

                        <div className="row">
                            {blogPosts.map(post => (
                                <div key={post._id} className="col-md-6 mb-4">
                                    <Link to={`/blog/${post._id}`} className="text-decoration-none text-dark">
                                        <div className="blog-card">
                                            <div className="blog-card-img">
                                                <img src={post.thumbnail} alt={post.title} />
                                            </div>
                                            <div className="blog-card-body p-3">
                                                <h4 className="blog-card-title">{post.title}</h4>
                                                <div className="blog-card-meta mb-2">
                                                    <span className="text-success fw-bold">{post.category}</span>
                                                    <span className="mx-1">•</span>
                                                    <span>{post.readTime}</span>
                                                    <span className="mx-1">•</span>
                                                    <span>{post.author}</span>
                                                    <span className="mx-1">•</span>
                                                    <span>{new Date(post.date || post.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <p className="blog-card-excerpt text-muted">{post.excerpt}</p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                            {blogPosts.length === 0 && !isLoading && (
                                <div className="col-12 text-center py-5">
                                    <h3>No blog posts found.</h3>
                                </div>
                            )}
                            {isLoading && <div className="col-12 text-center py-5">Loading blogs...</div>}

                        </div>

                        {/* Dynamic Pagination */}
                        {totalPages > 1 && (
                            <div className="blog-pagination d-flex justify-content-center mt-4">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        className={`page-num ${page === i + 1 ? 'active' : ''}`}
                                        onClick={() => {
                                            setPage(i + 1);
                                            window.scrollTo(0, 0);
                                        }}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                {page < totalPages && (
                                    <button
                                        className="page-next"
                                        onClick={() => {
                                            setPage(prev => prev + 1);
                                            window.scrollTo(0, 0);
                                        }}
                                    >
                                        <FaChevronRight />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="col-lg-4">
                        <aside className="blog-sidebar">
                            {/* Instagram Widget */}
                            <div className="sidebar-widget mb-4">
                                <div className="widget-header instagram-gradient">
                                    <span>INSTAGRAM</span>
                                </div>
                                <div className="instagram-grid p-2">
                                    {['1560518883636-acf64ee6978f', '1564013799919-ab600027ffc6', '1600585154340-be6161a56a0c', '1512917774080-9991f1c4c750', '1613490493576-7fde63acd811', '1600607687939-ce8a6c25118c'].map((id, i) => (
                                        <div key={i} className="insta-item">
                                            <img src={`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=150&q=80`} alt="insta" />
                                        </div>
                                    ))}
                                </div>
                                <button className="btn-insta-follow m-2 w-100">Follow on Instagram</button>
                            </div>

                            {/* Newsletter Widget */}
                            <div className="sidebar-widget mb-4">
                                <div className="widget-header newsletter-bg">
                                    <span>NEWSLETTER</span>
                                </div>
                                <div className="newsletter-content p-4 text-center">
                                    <div className="email-icon">📧</div>
                                    <h4>Subscribe For Daily Blog Alert</h4>
                                    <div className="mt-3">
                                        <input type="email" className="form-control mb-2" placeholder="Email Address" />
                                        <button className="btn btn-dark w-100">SUBSCRIBE</button>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Blog;
