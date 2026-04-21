import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer/Footer';
import { FaMapMarkerAlt, FaPhoneAlt, FaClock, FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState(null);
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/settings`);
            setSettings(data);
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the data to your backend API

        // Simulate success
        setStatus('sending');
        setTimeout(() => {
            setStatus('success');
            setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
        }, 1500);
    };

    return (
        <div className="contact-page">
            <Navbar />

            <div className="contact-container container">
                <div className="row">
                    {/* Left Side: Info */}
                    <div className="col-lg-6 contact-info-section position-relative">
                        <h1>Let's Talk About Everything!</h1>
                        <p className="intro-text">
                            Hello there! If you'd like to ask us something, you can get in touch with
                            us here! We'd love to address any and all concerns you may have.
                        </p>

                        <div className="info-block">
                            <h3>Head Office</h3>
                            <div className="info-item">
                                <FaMapMarkerAlt />
                                <span>
                                    {settings?.branches?.[0]?.addressLines?.join(', ') || 'Karachi North Nazimabad, Karachi, Pakistan'}
                                </span>
                            </div>
                        </div>

                        <div className="info-block">
                            <div className="info-item">
                                <FaPhoneAlt />
                                <span>{settings?.contactNumber || '0800-ZAMEEN (92633)'}</span>
                            </div>
                        </div>

                        <div className="info-block">
                            <div className="info-item">
                                <FaClock />
                                <span>{settings?.timings || 'Monday To Friday (9AM-6PM)'}</span>
                            </div>
                        </div>

                        {/* Background Decorations (Simulated with icons/shapes if needed) */}
                    </div>

                    {/* Right Side: Form */}
                    <div className="col-lg-6">
                        <div className="contact-form-card">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Your Name <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        placeholder="How should we address you?"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Phone Number <span className="text-danger">*</span></label>
                                    <div className="phone-input-group">
                                        <div className="country-code">
                                            <img src="https://flagcdn.com/w20/pk.png" alt="PK" className="flag-icon" />
                                            <span>+92</span>
                                        </div>
                                        <input
                                            type="tel"
                                            name="phone"
                                            className="form-control border-0"
                                            placeholder=""
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Email Address <span className="text-danger">*</span></label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        placeholder="Your best email address?"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Subject <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        name="subject"
                                        className="form-control"
                                        placeholder="General Inquiry"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Your Message <span className="text-danger">*</span></label>
                                    <textarea
                                        name="message"
                                        className="form-control"
                                        rows="4"
                                        placeholder="What would you like to say?"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>

                                <button type="submit" className="btn-submit" disabled={status === 'sending'}>
                                    {status === 'sending' ? 'Sending...' : 'Send Your Question'} <FaPaperPlane />
                                </button>

                                {status === 'success' && (
                                    <div className="response-message success">
                                        Message sent! We'll get back to you soon.
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Contact;

