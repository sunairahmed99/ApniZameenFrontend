import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer/Footer';
import { FaCode, FaLaptopCode, FaDatabase, FaMobileAlt, FaArrowRight, FaUserTie } from 'react-icons/fa';
import './About.css';

const About = () => {
    return (
        <div className="about-page">
            <Navbar />

            {/* Header Section with Banner */}
            <header className="about-header" style={{
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: '#fff',
                padding: '100px 0'
            }}>
                <div className="container">
                    <h1 style={{ color: '#fff', fontSize: '3.5rem', fontWeight: '700' }}>About Us</h1>
                    <p style={{ color: '#f0f0f0', fontSize: '1.2rem', maxWidth: '800px' }}>
                        Apni Zameen.pk is Pakistan's Largest Online Real Estate Portal.
                        Connecting Buyers with Sellers within & outside the country.
                    </p>
                </div>
            </header>

            {/* Intro Section */}
            <section className="about-intro-section">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6 intro-content">
                            <h2>How did it all start?</h2>
                            <p>
                                Apni Zameen.pk was the brainchild of visionary entrepreneur <strong>Sunair</strong>.
                                His mission was to make Pakistan's real estate accessible and convenient for everyone.
                                Together with a dedicated team, they proceeded to lead Apni Zameen.pk from a small start-up
                                to the premier real estate entity of Pakistan.
                            </p>
                            <p>
                                Apni Zameen.pk connects buyers with sellers and tenants with landlords for a highly user-friendly
                                real estate experience. The extensive listings and projects on offer provide something
                                for everyone when it comes to property.
                            </p>
                        </div>
                        <div className="col-md-6">
                            {/* Simplified Graphic Representation */}
                            <div className="stats-circle-container">
                                <div className="orbit-item orbit-1">
                                    <FaLaptopCode />
                                    <span>Premium<br />Quality</span>
                                </div>
                                <div className="center-circle">
                                    <FaUserTie className="center-icon" />
                                    <span className="center-text">Sunair</span>
                                </div>
                                <div className="orbit-item orbit-2">
                                    <FaCode />
                                    <span>Trusted<br />Portal</span>
                                </div>
                                <div className="orbit-item orbit-3">
                                    <FaDatabase />
                                    <span>Secure<br />Data</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cards Section */}
            <section className="about-cards-section">
                <div className="container">
                    <div className="row g-4">
                        {/* Card 1 */}
                        <div className="col-md-6">
                            <div className="about-card">
                                <div className="card-content">
                                    <div className="card-text">
                                        <h3>Exclusive Marketing</h3>
                                        <p>
                                            Apni Zameen.pk uses a 360-degree marketing strategy, covering all aspects of the projects,
                                            and helps buyers at every step of the way with guaranteed transparency.
                                        </p>
                                        <Link to="/new-projects" className="card-link">View Our Projects <FaArrowRight /></Link>
                                    </div>
                                    <div className="card-image">
                                        <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=300&q=80" alt="Development" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="col-md-6">
                            <div className="about-card">
                                <div className="card-content">
                                    <div className="card-text">
                                        <h3>What Do We Do?</h3>
                                        <div className="d-flex align-items-center gap-2 mb-2">
                                            <span className="badge bg-success">Buy</span>
                                            <span className="badge bg-primary">Sell</span>
                                            <span className="badge bg-info">Rent</span>
                                        </div>
                                        <p>
                                            Apni Zameen.pk connects buyers with sellers and tenants with landlords.
                                            We provide a highly user-friendly real estate experience.
                                        </p>
                                        <Link to="/advertise" className="card-link">See Services <FaArrowRight /></Link>
                                    </div>
                                    <div className="card-image">
                                        <img src="https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=300&q=80" alt="Properties" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="col-md-6">
                            <div className="about-card">
                                <div className="card-content">
                                    <div className="card-text">
                                        <h3>Zameen Expos</h3>
                                        <p>
                                            The company is also the pioneer of large-scale real estate events and
                                            frequently organizes expos both locally and internationally.
                                        </p>
                                        <Link to="/blog" className="card-link">Read Blog <FaArrowRight /></Link>
                                    </div>
                                    <div className="card-image">
                                        <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=300&q=80" alt="Expos" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 4 */}
                        <div className="col-md-6">
                            <div className="about-card">
                                <div className="card-content">
                                    <div className="card-text">
                                        <h3>Har Pata, Humain Pata Hai!</h3>
                                        <p>
                                            The trust and reliability that Zameen.pk brings to these projects,
                                            and the expertise of our marketing and sales teams, have led to unprecedented success.
                                        </p>
                                        <Link to="/contact-us" className="card-link">Contact Us <FaArrowRight /></Link>
                                    </div>
                                    <div className="card-image">
                                        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80" alt="Trust" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            <Footer />
        </div>
    );
};

export default About;
