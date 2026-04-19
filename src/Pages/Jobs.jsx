import React, { useState, useRef } from 'react';
import './Jobs.css';
import { FaMapMarkerAlt, FaBriefcase, FaMoneyBillWave, FaHeartbeat, FaChartLine, FaLaptop, FaUserAstronaut, FaChalkboardTeacher, FaGlobe } from 'react-icons/fa';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer/Footer';
import { useJobs } from '../hooks/useJobs';

const Jobs = () => {
    const openingsRef = useRef(null);
    const [filterDept, setFilterDept] = useState('All');
    const [filterLoc, setFilterLoc] = useState('All');

    const scrollToOpenings = () => {
        openingsRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const { data: jobs = [] } = useJobs();

    const departments = ['All', ...new Set(jobs.map(job => job.department))];
    const locations = ['All', ...new Set(jobs.map(job => job.location))];

    const filteredJobs = jobs.filter(job => {
        const matchDept = filterDept === 'All' || job.department === filterDept;
        const matchLoc = filterLoc === 'All' || job.location === filterLoc;
        return matchDept && matchLoc;
    });

    // Group by location for display
    const jobsByLocation = filteredJobs.reduce((acc, job) => {
        if (!acc[job.location]) acc[job.location] = [];
        acc[job.location].push(job);
        return acc;
    }, {});

    return (
        <div className="jobs-page">
            <Navbar />
            {/* Hero Section */}
            <section className="jobs-hero">
                <div className="container">
                    <h1>YOUR GATEWAY TO SUCCESS IN REAL-ESTATE</h1>
                    <button className="btn-view-openings" onClick={scrollToOpenings}>
                        View Openings
                    </button>
                    {/* Background image overlay could go here */}
                </div>
            </section>

            {/* Welcome Text */}
            <section className="jobs-culture">
                <div className="container">
                    <h2 className="section-title">Welcome to ApniZameen.com</h2>
                    <div className="text-content">
                        <p>
                            At ApniZameen.com, we're not just redefining the real estate landscape in Pakistan; we're building a community of
                            visionaries, innovators, and go-getters. As the leading real estate platform in the country, we pride ourselves on our
                            dynamic corporate culture that fosters creativity, collaboration, and continuous learning. Here, your ideas matter, and
                            your contributions drive real impact.
                        </p>
                    </div>
                </div>
            </section>

            {/* Corporate Culture */}
            <section className="jobs-culture">
                <div className="container">
                    <h2 className="section-title">Our Corporate Culture</h2>
                    <div className="text-content">
                        <p>
                            Our culture is built on the pillars of Integrity, Innovation, and Inclusivity. We believe in nurturing a workspace where
                            everyone feels valued and empowered to bring their authentic selves to work. From cross-functional team
                            collaborations to regular brainstorming sessions, we encourage a flow of ideas and perspectives, ensuring that
                            every voice is heard and every idea is considered.
                        </p>
                    </div>
                </div>
            </section>

            {/* Growth Opportunities */}
            <section className="jobs-culture">
                <div className="container">
                    <h2 className="section-title">Growth Opportunities</h2>
                    <div className="text-content">
                        <p>
                            At ApniZameen.com, your growth is our priority. We offer a myriad of opportunities for professional development, whether
                            it's through our comprehensive training programs, mentorship initiatives, or leadership development tracks. Our fast-paced,
                            agile environment ensures that you are constantly challenged and engaged, paving the way for your career advancement.
                            With us, you have the chance to work on groundbreaking projects that shape the future of real estate in Pakistan.
                        </p>
                    </div>
                </div>
            </section>


            {/* Benefits Section */}
            <section className="jobs-benefits">
                <div className="container">
                    <h2 className="section-title text-center">Employee Benefits</h2>
                    <div className="text-content text-center mb-5">
                        <p>We understand that a satisfied employee is a productive employee. That's why we offer a competitive benefits package designed to support your well-being and work-life balance.</p>
                    </div>

                    <div className="benefits-grid">
                        <div className="benefit-card">
                            <div className="benefit-icon"><FaHeartbeat /></div>
                            <div className="benefit-title">Health Insurance</div>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon"><FaChartLine /></div>
                            <div className="benefit-title">Career Advancement</div>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon"><FaLaptop /></div>
                            <div className="benefit-title">Laptop & Mobile Ownership</div>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon"><FaUserAstronaut /></div> {/* Using astronaut as generic 'vehicle' placeholder if needed, or car icon */}
                            <div className="benefit-title">Company Maintained Vehicle</div>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon"><FaMoneyBillWave /></div>
                            <div className="benefit-title">Fuel Allowance</div>
                        </div>
                        <div className="benefit-card">
                            <div className="benefit-icon"><FaChalkboardTeacher /></div>
                            <div className="benefit-title">Coaching & People Development</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="jobs-gallery">
                <div className="container">
                    <div className="gallery-grid">
                        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80" alt="Team Event" className="gallery-item" />
                        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=300&q=80" alt="Modern Office" className="gallery-item" />
                        <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=300&q=80" alt="Meeting" className="gallery-item" />
                        <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=300&q=80" alt="Work Culture" className="gallery-item" />
                        <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=300&q=80" alt="Collaboration" className="gallery-item" />
                    </div>
                </div>
            </section>

            {/* Openings Section */}
            <section className="jobs-openings" ref={openingsRef}>
                <div className="container">
                    <h2 className="section-title">Our Openings</h2>

                    <div className="filters-bar">
                        <select className="filter-select" onChange={(e) => setFilterDept(e.target.value)}>
                            <option value="All">Departments: All</option>
                            {departments.filter(d => d !== 'All').map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>

                        <select className="filter-select" onChange={(e) => setFilterLoc(e.target.value)}>
                            <option value="All">Locations: All</option>
                            {locations.filter(l => l !== 'All').map(loc => (
                                <option key={loc} value={loc}>{loc}</option>
                            ))}
                        </select>
                        <select className="filter-select">
                            <option value="All">Remote: Any</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>

                    <div className="openings-list">
                        {Object.keys(jobsByLocation).length > 0 ? (
                            Object.entries(jobsByLocation).map(([location, locationJobs]) => (
                                <div key={location} className="location-group">
                                    <div className="location-title">
                                        <FaMapMarkerAlt /> {location}
                                    </div>
                                    <div className="row">
                                        {locationJobs.map(job => (
                                            <div key={job.id} className="col-md-6">
                                                <div className="job-card">
                                                    <div className="job-info">
                                                        <h3>{job.title}</h3>
                                                        <div className="job-meta">
                                                            <span><FaMapMarkerAlt size={12} /> {job.location}</span>
                                                            <span><FaBriefcase size={12} /> {job.department}</span>
                                                        </div>
                                                        <div className="job-meta mt-2">
                                                            <small className="text-muted">{job.type}</small>
                                                            {job.salary && <small className="text-success ms-2">{job.salary}</small>}
                                                        </div>
                                                    </div>
                                                    <div className="job-action">
                                                        <button className="btn-apply">Apply</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-muted">No openings found matching your criteria.</p>
                        )}
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Jobs;
