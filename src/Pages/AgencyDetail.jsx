import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer/Footer';
import { useAgency } from '../hooks/useAgencies';
import { API_BASE_URL } from '../config';
import { useProperties } from '../hooks/useProperties';
// import { fetchProperties } from '../utils/api'; // Removed, used hook instead
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaGlobe, FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
// import axios from 'axios'; // Removed direct axios usage
import './AgencyDetail.css';
import OptimizedImage from '../Components/OptimizedImage';
import PropertyCard from '../Components/Home/PropertyCard';
import { PropertyCardSkeleton } from '../Components/Common/Skeleton';
import SEO from '../Components/SEO';

const AgencyDetail = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();

    // Fetch agency details
    const { data: agency, isLoading: loading, isError: agencyError } = useAgency(id);

    // Fetch properties for this agency
    const ownerId = agency?.ownerId?._id || agency?.ownerId;

    // We pass enabled: !!ownerId via the options argument we just added
    const { data: properties = [], isLoading: propsLoading } = useProperties(
        { sellerId: ownerId },
        { enabled: !!ownerId }
    );

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return (
            <div className="agency-detail-page">
                <Navbar />
                <div className="container py-5">
                    <div className="text-center py-5">
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (agencyError || (!agency && !loading)) {
        return (
            <div className="agency-detail-page">
                <Navbar />
                <div className="container py-5 text-center">
                    <h2>Agency Not Found</h2>
                    <Link to="/agents" className="btn btn-success mt-3">Back to Agents</Link>
                </div>
                <Footer />
            </div>
        );
    }

    const agencyLogo = agency.logo?.startsWith('http') ? agency.logo : `${API_BASE_URL}/${agency.logo?.replace(/\\/g, '/')}`;
    const agencyBanner = agency.image?.startsWith('http') ? agency.image : `${API_BASE_URL}/${agency.image?.replace(/\\/g, '/')}`;

    return (
        <div className="agency-detail-page">
            <SEO
                title={`${agency.name} - Real Estate Agency in ${agency.city}`}
                description={agency.description || `View properties and contact details of ${agency.name} in ${agency.city}.`}
            />
            <Navbar />

            {/* Agency Header Section */}
            <div className="agency-header-banner" style={{
                backgroundImage: `url(${agency.image ? agencyBanner : 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80'})`
            }}>
                <div className="banner-overlay"></div>
                <div className="container position-relative">
                    <div className="agency-profile-box bg-white rounded shadow-lg p-4">
                        <div className="row align-items-center">
                            <div className="col-md-auto text-center mb-3 mb-md-0">
                                <div className="agency-detail-logo-wrapper">
                                    <OptimizedImage
                                        src={agencyLogo}
                                        alt={agency.name}
                                        width={120}
                                        height={120}
                                        className="img-fluid rounded border shadow-sm"
                                        onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(agency.name) + "&background=random&size=120"; }}
                                    />
                                </div>
                            </div>
                            <div className="col-md">
                                <div className="d-flex align-items-center flex-wrap gap-2 mb-2 pt-3">
                                    <h1 className="fw-bold mb-0">{agency.name}</h1>
                                    {agency.isTitanium && <span className="badge bg-warning text-dark px-3 py-2 rounded-pill shadow-sm">Titanium Agency</span>}
                                    {agency.isFeatured && <span className="badge bg-info text-white px-3 py-2 rounded-pill shadow-sm">Featured Agency</span>}
                                </div>
                                <div className="d-flex flex-wrap gap-3 text-muted mb-3 pt-3">
                                    <span><FaMapMarkerAlt className="text-success me-1" /> {agency.city}</span>
                                    <span><FaPhoneAlt className="text-success me-1" /> {agency.phone}</span>
                                    <span><FaEnvelope className="text-success me-1" /> {agency.email}</span>
                                </div>
                                <div className="agency-social-links d-flex gap-2">
                                    <a href={`tel:${agency.phone}`} className="btn btn-outline-success btn-sm"><FaPhoneAlt className="me-1" /> Call</a>
                                    <a href={`https://wa.me/${agency.phone.replace(/\+/g, '')}`} className="btn btn-outline-success btn-sm"><FaWhatsapp className="me-1" /> WhatsApp</a>
                                    <a href={`mailto:${agency.email}`} className="btn btn-outline-success btn-sm"><FaEnvelope className="me-1" /> Email</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-5">
                <div className="row">
                    {/* Left Column: Description & Properties */}
                    <div className="col-lg-8">
                        <section className="agency-about-section mb-5">
                            <h3 className="fw-bold mb-4 border-bottom pb-2">About {agency.name}</h3>
                            <div className="agency-description text-muted lh-lg">
                                {agency.description || "No description available for this agency."}
                            </div>
                        </section>

                        <section className="agency-properties-section">
                            <h3 className="fw-bold mb-4 border-bottom pb-2">Properties by {agency.name}</h3>
                            {propsLoading ? (
                                <div className="row g-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="col-md-6">
                                            <PropertyCardSkeleton />
                                        </div>
                                    ))}
                                </div>
                            ) : properties.length > 0 ? (
                                <div className="row g-4">
                                    {properties.map(property => (
                                        <div key={property._id} className="col-md-6">
                                            <PropertyCard property={property} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="alert alert-light text-center py-5 border">
                                    <p className="mb-0">No properties found for this agency.</p>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Right Column: Contact Sidebar */}
                    <div className="col-lg-4">
                        <div className="contact-sidebar-card sticky-top" style={{ top: '100px', zIndex: 10 }}>
                            <div className="card shadow-sm border-0">
                                <div className="card-body p-4">
                                    <h5 className="fw-bold mb-4">Contact Information</h5>
                                    <div className="mb-3">
                                        <p className="small text-muted mb-1">Company Name</p>
                                        <p className="fw-bold">{agency.name}</p>
                                    </div>
                                    <div className="mb-3">
                                        <p className="small text-muted mb-1">Address</p>
                                        <p className="fw-bold"><FaMapMarkerAlt className="text-muted me-2" /> {agency.city}</p>
                                    </div>
                                    <div className="mb-3">
                                        <p className="small text-muted mb-1">Phone Number</p>
                                        <p className="fw-bold"><FaPhoneAlt className="text-muted me-2" /> {agency.phone}</p>
                                    </div>
                                    <div className="mb-4">
                                        <p className="small text-muted mb-1">Email Address</p>
                                        <p className="fw-bold"><FaEnvelope className="text-muted me-2" /> {agency.email}</p>
                                    </div>

                                    <div className="d-grid gap-2">
                                        <a href={`tel:${agency.phone}`} className="btn btn-success py-2 fw-bold">Call Now</a>
                                        <a href={`https://wa.me/${agency.phone.replace(/\+/g, '')}`} className="btn btn-outline-success py-2 fw-bold">WhatsApp Inquiry</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default AgencyDetail;
