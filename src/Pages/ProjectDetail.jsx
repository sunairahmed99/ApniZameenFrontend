import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaCheck, FaPhoneAlt, FaEnvelope, FaBuilding, FaLayerGroup, FaRulerCombined, FaListUl, FaCalendarAlt, FaMap, FaImages, FaMoneyBillWave } from 'react-icons/fa';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer/Footer';
import { useProject } from '../hooks/useProjects';
import { getImageUrl } from '../utils/formatters';
import SEO from '../Components/SEO';

import { API_BASE_URL } from '../config';

const ProjectDetail = () => {
    const { slug } = useParams();
    const [openCat, setOpenCat] = useState(null);

    const { data: project, isLoading: loading } = useProject(slug);

    if (loading) return <div className="p-5 text-center">Loading Project...</div>;
    if (!project) return <div className="p-5 text-center">Project not found</div>;

    const mainGallery = project.gallery || [];
    const mainImg = project.thumbnail || (mainGallery[0] || 'https://via.placeholder.com/800x400');
    const priceRangeText = `PKR ${project.priceRange?.min} ${project.priceRange?.unit} to ${project.priceRange?.max} ${project.priceRange?.unit}`;
    const projectImage = getImageUrl(mainImg);

    return (
        <div>
            <SEO
                title={`${project.name} - ${priceRangeText} | ${project.city} | Zameen`}
                description={`${project.name} in ${project.area}, ${project.city}. ${project.projectTypes?.join(', ')} with sizes ranging from ${project.sizeRange?.min} to ${project.sizeRange?.max} ${project.sizeRange?.unit}. ${project.description ? project.description.substring(0, 150) : 'Contact for more details.'}`}
                keywords={`${project.name}, new project ${project.city}, ${project.area} ${project.city}, ${project.projectTypes?.join(', ')}, real estate project ${project.city}`}
                ogImage={projectImage}
                ogType="article"
            />
            <Navbar />
            <div className="pd-container mt-4">

                {/* Header */}
                <div className="pd-header">
                    <div className="pd-title-section">
                        <h1>{project.name}</h1>
                        <div className="pd-location">
                            <FaMapMarkerAlt className="me-2 text-success" />
                            {project.area}, {project.city}
                        </div>
                    </div>
                    <div className="pd-price-section">
                        <span className="text-secondary small d-block">Price range</span>
                        <div className="pd-price-range">
                            PKR {project.priceRange?.min} {project.priceRange?.unit} to {project.priceRange?.max} {project.priceRange?.unit}
                        </div>
                    </div>
                </div>

                {/* Gallery Grid */}
                <div className="pd-gallery-grid">
                    <img src={getImageUrl(mainImg)} alt={project.name} className="pd-main-img" />
                    <div className="pd-side-gallery">
                        <img src={getImageUrl(mainGallery[1] || mainImg)} alt="" className="pd-side-img" />
                        <div style={{ position: 'relative' }}>
                            <img src={getImageUrl(mainGallery[2] || mainImg)} alt="" className="pd-side-img" />
                            <div className="gallery-overlay d-flex align-items-center justify-content-center text-white cursor-pointer" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', borderRadius: '8px' }}>
                                <FaImages className="me-2" /> View All
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pd-content-layout">

                    {/* Main Content */}
                    <div className="pd-main-content">

                        {/* Overview Section */}
                        <div className="pd-section">
                            <h3>Overview</h3>
                            <div className="pd-overview-grid">
                                <div className="pd-overview-item">
                                    <FaLayerGroup />
                                    <div>
                                        <small className="text-secondary d-block">Offering</small>
                                        <strong>{project.projectTypes?.join(', ')}</strong>
                                    </div>
                                </div>
                                <div className="pd-overview-item">
                                    <FaBuilding />
                                    <div>
                                        <small className="text-secondary d-block">Developer</small>
                                        <strong>{project.developer?.name || 'Zameen Developments'}</strong>
                                    </div>
                                </div>
                                <div className="pd-overview-item">
                                    <FaRulerCombined />
                                    <div>
                                        <small className="text-secondary d-block">Size Range</small>
                                        <strong>{project.sizeRange?.min} - {project.sizeRange?.max} {project.sizeRange?.unit}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Inventory Section */}
                        {project.inventory && project.inventory.length > 0 && (
                            <div className="pd-section">
                                <h3>Property Units</h3>
                                {project.inventory.map((cat, i) => (
                                    <div key={i} className="pd-inventory-cat">
                                        <div className="pd-cat-header" onClick={() => setOpenCat(openCat === i ? null : i)}>
                                            <span className="fw-bold">{cat.category}</span>
                                            <span className="text-success fw-bold">PKR {cat.priceRange?.min} to {cat.priceRange?.max} Crore</span>
                                        </div>
                                        {openCat === i && (
                                            <div className="pd-cat-units">
                                                {cat.units.map((unit, j) => (
                                                    <div key={j} className="pd-unit-card">
                                                        <div className="d-flex align-items-center gap-3">
                                                            {unit.floorPlan && (
                                                                <img 
                                                                    src={getImageUrl(unit.floorPlan)} 
                                                                    alt="Plan" 
                                                                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                                                    className="cursor-pointer"
                                                                    onClick={() => window.open(getImageUrl(unit.floorPlan), '_blank')}
                                                                />
                                                            )}
                                                            <div>
                                                                <div className="fw-bold">{unit.title}</div>
                                                                <small className="text-secondary">Area: {unit.area} | Beds: {unit.beds} | Baths: {unit.baths}</small>
                                                            </div>
                                                        </div>
                                                        <div className="text-success fw-bold">PKR {unit.price}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Description Section */}
                        <div className="pd-section">
                            <h3>Project Details</h3>
                            <p style={{ lineHeight: '1.8' }}>{project.description}</p>
                        </div>

                        {/* Amenities Section */}
                        <div className="pd-section">
                            <h3>Features & Amenities</h3>
                            {project.amenities && Object.entries(project.amenities).map(([key, list]) => (
                                list.length > 0 && (
                                    <div key={key} className="pd-amenities-group">
                                        <h5 className="text-capitalize">{key.replace(/([A-Z])/g, ' $1')}</h5>
                                        <div className="pd-amenities-list">
                                            {list.map(item => (
                                                <div key={item} className="pd-amenity-item">
                                                    <FaCheck className="text-success" /> {item}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>

                        {/* Development Updates Section */}
                        {project.developmentUpdates && project.developmentUpdates.length > 0 && (
                            <div className="pd-section">
                                <h3>Development Updates</h3>
                                <div className="timeline">
                                    {project.developmentUpdates.map((upd, i) => (
                                        <div key={i} className="mb-4 pt-3 border-top">
                                            <div className="d-flex align-items-center mb-2">
                                                <FaCalendarAlt className="text-success me-2" />
                                                <strong>{upd.date}</strong>
                                            </div>
                                            <h5>{upd.title}</h5>
                                            <p className="text-secondary small">{upd.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}


                        {/* Location Section */}
                        <div className="pd-section">
                            <h3>Location</h3>
                            <div className="bg-light d-flex align-items-center justify-content-center border rounded p-4 mb-3" style={{ height: '300px' }}>
                                <div className="text-center">
                                    <FaMapMarkerAlt className="text-danger mb-2" size={40} />
                                    <h5>{project.address || project.area}</h5>
                                    <p className="text-secondary small">Map coordinates: {project.location?.lat}, {project.location?.lng}</p>
                                </div>
                            </div>
                        </div>

                        {/* Marketed By / Developed By at Bottom */}
                        <div className="pd-section mb-5">
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <div className="p-3 border rounded h-100 bg-white">
                                        <small className="text-secondary d-block mb-2">Developed By</small>
                                        <div className="d-flex align-items-center">
                                            <img src={getImageUrl(project.developer?.logo)} alt="" style={{ width: '60px' }} className="me-3" />
                                            <div>
                                                <strong>{project.developer?.name}</strong>
                                                <p className="small text-secondary mb-0" style={{ fontSize: '11px' }}>{project.developer?.description?.substring(0, 80)}...</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {project.marketedBy?.name && (
                                    <div className="col-md-6">
                                        <div className="p-3 border rounded h-100 bg-white">
                                            <small className="text-secondary d-block mb-2">Marketed By</small>
                                            <div className="d-flex align-items-center">
                                                <img src={getImageUrl(project.marketedBy?.logo)} alt="" style={{ width: '60px' }} className="me-3" />
                                                <div>
                                                    <strong>{project.marketedBy?.name}</strong>
                                                    <p className="small text-secondary mb-0" style={{ fontSize: '11px' }}>Official sales and marketing partner.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Sidebar */}
                    <div className="pd-sidebar">
                        <div className="pd-lead-card sticky-top" style={{ top: '20px' }}>
                            <h4 className="fw-bold mb-4">Contact for Details</h4>
                            <div className="mb-3">
                                <label className="form-label small text-secondary">Your Name</label>
                                <input type="text" className="form-control" placeholder="Enter your name" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small text-secondary">Phone Number</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-white">+92</span>
                                    <input type="text" className="form-control" />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="form-label small text-secondary">Email</label>
                                <input type="email" className="form-control" placeholder="Email address" />
                            </div>
                            <button className="pd-call-btn mb-2">
                                <FaPhoneAlt className="me-2" /> Show Number
                            </button>
                            <button className="pd-request-btn">
                                <FaEnvelope className="me-2" /> Request Call
                            </button>

                            <div className="mt-4 pt-3 border-top">
                                <div className="d-flex align-items-center mb-3">
                                    <img src={getImageUrl(project.developer?.logo)} alt="" className="rounded-circle me-3" style={{ width: '40px', height: '40px' }} />
                                    <div>
                                        <div className="fw-bold small">{project.developer?.name || 'Zameen Developments'}</div>
                                        <small className="text-secondary" style={{ fontSize: '11px' }}>Official Developer</small>
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

export default ProjectDetail;
