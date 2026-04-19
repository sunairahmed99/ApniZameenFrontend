import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBlog } from '../hooks/useBlogs';
import Navbar from '../Components/Navbar';
import Banner from '../Components/Home/Banner';
import Footer from '../Components/Footer/Footer';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaWhatsapp, FaClock, FaUser, FaCalendarAlt, FaEnvelope } from 'react-icons/fa';
import './BlogDetail.css';

const BlogDetail = () => {
    const { id } = useParams();
    const [currentCategory, setCurrentCategory] = useState('HOMES');
    const [listingType, setListingType] = useState('BUY');

    const { data: post, isLoading } = useBlog(id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (isLoading) return <div className="p-5 text-center">Loading...</div>;
    if (!post) return <div className="p-5 text-center">Blog not found.</div>;

    const relatedPosts = [
        {
            id: 1,
            title: "5 IDEAS TO MAKE YOUR PROPERTY STAND OUT",
            category: "LIFESTYLE",
            image: "https://images.unsplash.com/photo-1600585154340-be6199f7c096?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60"
        },
        {
            id: 2,
            title: "HOW TO FIND THE PERFECT PLOT FOR YOUR HOME",
            category: "PROPERTY",
            image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60"
        },
        {
            id: 3,
            title: "THE FUTURE OF REAL ESTATE IN PAKISTAN",
            category: "REAL ESTATE",
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60"
        }
    ];

    return (
        <div className="blog-detail-page">
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
                showHeading={false}
                showSearchFilter={false}
            />

            <div className="container py-5">
                {/* Breadcrumbs */}
                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/blog">Blog</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">{post.category}</li>
                    </ol>
                </nav>

                <div className="row">
                    <div className="col-lg-8">
                        <article className="blog-article">
                            <header className="article-header mb-4">
                                <span className="category-badge mb-2">{post.category}</span>
                                <h1 className="article-title mb-3">{post.title}</h1>
                                <div className="article-meta d-flex align-items-center flex-wrap gap-3 text-muted">
                                    <span className="meta-item"><FaUser className="me-1" /> {post.author}</span>
                                    <span className="meta-item"><FaClock className="me-1" /> {post.readTime}</span>
                                    <span className="meta-item"><FaCalendarAlt className="me-1" /> {new Date(post.date || post.createdAt).toLocaleDateString()}</span>
                                </div>
                            </header>

                            <div className="featured-image-container mb-4">
                                <img src={post.thumbnail} alt={post.title} className="img-fluid rounded shadow-sm w-100" />
                            </div>

                            <div className="article-content" dangerouslySetInnerHTML={{ __html: post.content }}>
                            </div>

                            {/* Share Buttons */}
                            <div className="share-section border-top border-bottom py-4 my-5 d-flex align-items-center gap-3">
                                <span className="fw-bold">SHARE:</span>
                                <div className="share-buttons d-flex gap-2">
                                    <button className="share-btn fb"><FaFacebookF /></button>
                                    <button className="share-btn tw"><FaTwitter /></button>
                                    <button className="share-btn li"><FaLinkedinIn /></button>
                                    <button className="share-btn wa"><FaWhatsapp /></button>
                                    <button className="share-btn mail"><FaEnvelope /></button>
                                </div>
                            </div>

                            {/* Author Section */}
                            <div className="author-box d-flex gap-4 p-4 rounded mb-5 border">
                                <div className="author-img">
                                    <img src={`https://ui-avatars.com/api/?name=${post.author}&background=random`} alt={post.author} className="rounded-circle" width="100" height="100" />
                                </div>
                                <div className="author-info">
                                    <h5 className="mb-2">WRITTEN BY {post.author}</h5>
                                    <p className="mb-0 text-muted">
                                        {post.author} is a regular contributor to our blog, covering everything from real estate trends to lifestyle and home decoration.
                                    </p>
                                </div>
                            </div>
                        </article>

                        {/* Related Posts */}
                        <section className="related-posts mt-5">
                            <h3 className="section-title mb-4 pb-2 border-bottom">Related Articles</h3>
                            <div className="row">
                                {relatedPosts.map(p => (
                                    <div key={p.id} className="col-md-4 mb-4">
                                        <div className="related-card border-0 shadow-sm h-100">
                                            <img src={p.image} alt={p.title} className="card-img-top" />
                                            <div className="card-body p-3">
                                                <span className="text-success small fw-bold">{p.category}</span>
                                                <h6 className="mt-2 text-truncate-2">{p.title}</h6>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="col-lg-4">
                        <aside className="blog-sidebar">
                            <div className="sidebar-widget mb-4 border rounded p-4 text-center">
                                <h5>Follow our social media</h5>
                                <div className="d-flex justify-content-center gap-3 mt-3">
                                    <button className="btn btn-outline-dark rounded-circle"><FaFacebookF /></button>
                                    <button className="btn btn-outline-dark rounded-circle"><FaTwitter /></button>
                                    <button className="btn btn-outline-dark rounded-circle"><FaLinkedinIn /></button>
                                </div>
                            </div>

                            <div className="sidebar-widget mb-4 border rounded p-4">
                                <h5 className="text-center mb-3">Newsletter</h5>
                                <p className="small text-center text-muted">Subscribe to our newsletter for daily updates!</p>
                                <input type="email" className="form-control mb-2" placeholder="Email Address" />
                                <button className="btn btn-success w-100">SUBSCRIBE</button>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default BlogDetail;
