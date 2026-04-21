import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer/Footer';
import { FaQuestionCircle, FaHeadset, FaEnvelope, FaPhone, FaWhatsapp, FaMapMarkerAlt, FaClock, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useSocket } from '../context/SocketContext';
import { useSelector } from 'react-redux';
import AuthModal from '../Components/AuthModal/AuthModal';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import './HelpSupport.css';

const HelpSupport = () => {
    const [openFAQ, setOpenFAQ] = useState(null);
    const { toggleWidget } = useSocket();
    const { user } = useSelector((state) => state.auth);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

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
        } finally {
            setLoading(false);
        }
    };

    const toggleFAQ = (index) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    const handleChatClick = () => {
        if (!user) {
            setIsAuthModalOpen(true);
        } else {
            toggleWidget();
        }
    };

    const faqs = [
        {
            category: "Getting Started",
            questions: [
                {
                    q: "How do I create an account on Zameen?",
                    a: "To create an account, click on the 'Sign Up' button in the top right corner. Fill in your details including name, email, and password. You'll receive a verification email to activate your account."
                },
                {
                    q: "Is it free to list a property?",
                    a: "Yes! Creating a basic property listing is completely free. We also offer premium packages with additional features like Hot Listing and Super Hot Listing for better visibility."
                },
                {
                    q: "How do I search for properties?",
                    a: "Use our search filters on the homepage to select your preferred city, area, property type (buy/rent), and other criteria. You can also browse by location using our Area Guide feature."
                }
            ]
        },
        {
            category: "Property Listings",
            questions: [
                {
                    q: "How long does my listing stay active?",
                    a: "Free listings remain active for 30 days. Premium listings may have extended durations based on the package you choose. You can refresh your listing to bring it back to the top."
                },
                {
                    q: "Can I edit my property listing after posting?",
                    a: "Yes, you can edit your listings anytime from your dashboard. Go to 'My Properties', select the listing you want to edit, and make your changes."
                },
                {
                    q: "Why was my listing rejected?",
                    a: "Listings may be rejected if they violate our terms of service, contain inappropriate content, have incomplete information, or duplicate existing listings. Check your email for specific reasons."
                }
            ]
        },
        {
            category: "Payments & Packages",
            questions: [
                {
                    q: "What payment methods do you accept?",
                    a: "We accept bank transfers, credit/debit cards, and mobile wallets. All payment options are displayed at checkout when purchasing a package."
                },
                {
                    q: "How do I upgrade my listing to Hot or Super Hot?",
                    a: "Go to your dashboard, select the property, and click 'Upgrade'. Choose your preferred package (Hot Listing or Super Hot Listing) and complete the payment process."
                },
                {
                    q: "Can I get a refund for my package?",
                    a: "Refund policies vary by package type. Please refer to our Terms of Use or contact our support team for specific refund requests."
                }
            ]
        },
        {
            category: "Account & Security",
            questions: [
                {
                    q: "I forgot my password. What should I do?",
                    a: "Click on 'Forgot Password' on the login page. Enter your registered email address, and we'll send you instructions to reset your password."
                },
                {
                    q: "How do I change my contact information?",
                    a: "Log in to your account, go to Settings or Profile, and update your contact details. Make sure to save changes before exiting."
                },
                {
                    q: "Is my personal information secure?",
                    a: "Yes, we use industry-standard encryption and security measures to protect your data. Read our Privacy Policy for detailed information on how we handle your data."
                }
            ]
        },
        {
            category: "Technical Issues",
            questions: [
                {
                    q: "The website is not loading properly. What should I do?",
                    a: "Try clearing your browser cache and cookies, or use a different browser. If the issue persists, contact our technical support team."
                },
                {
                    q: "I'm not receiving verification emails.",
                    a: "Check your spam/junk folder. Add our email domain to your safe senders list. If still not receiving, contact support with your registered email."
                },
                {
                    q: "How do I report a bug or technical issue?",
                    a: `Email us at ${settings?.email || 'support@zameen.com'} with a detailed description of the issue, including screenshots if possible. Our technical team will investigate and respond within 24-48 hours.`
                }
            ]
        }
    ];

    const supportOptions = [
        {
            icon: <FaPhone />,
            title: "Phone Support",
            description: settings?.contactNumber || "0800-APNIZAMEEN (92633)",
            time: settings?.timings || "Monday to Sunday, 9 AM - 6 PM",
            color: "#00a651"
        },
        {
            icon: <FaWhatsapp />,
            title: "WhatsApp",
            description: settings?.contactNumber || "+92-XXX-XXXXXXX",
            time: "Quick responses during business hours",
            color: "#25D366"
        },
        {
            icon: <FaEnvelope />,
            title: "Email Support",
            description: settings?.email || "support@zameen.com",
            time: "Response within 24-48 hours",
            color: "#0088cc"
        },
        {
            icon: <FaHeadset />,
            title: "Live Chat",
            description: "Chat with our support team",
            time: `Available ${settings?.timings?.split('To')[1]?.trim() || '9 AM - 6 PM'}`,
            color: "#e74c3c"
        }
    ];

    return (
        <div className="help-support-page">
            <Navbar />

            {/* Hero Section */}
            <div className="help-hero">
                <div className="container">
                    <h1>Help & Support</h1>
                    <p>We're here to help! Find answers to common questions or get in touch with our support team.</p>
                </div>
            </div>

            <div className="container">
                {/* Support Options */}
                <section className="support-options-section">
                    <h2 className="section-title text-center">How Can We Help You?</h2>
                    <p className="text-center text-muted mb-5">Choose your preferred way to reach us</p>

                    <div className="row g-4">
                        {supportOptions.map((option, index) => (
                            <div className="col-lg-3 col-md-6" key={index}>
                                <div
                                    className="support-card"
                                    onClick={option.title === 'Live Chat' ? handleChatClick : undefined}
                                    style={option.title === 'Live Chat' ? { cursor: 'pointer' } : {}}
                                >
                                    <div className="support-icon" style={{ backgroundColor: `${option.color}20`, color: option.color }}>
                                        {option.icon}
                                    </div>
                                    <h4>{option.title}</h4>
                                    <p className="support-description">{option.description}</p>
                                    <p className="support-time">
                                        <FaClock className="me-2" />
                                        {option.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Office Location */}
                <section className="office-location-section">
                    <div className="row g-4 align-items-center">
                        <div className="col-md-6">
                            <div className="location-info">
                                <h3><FaMapMarkerAlt className="me-2 text-success" />Visit Our Office</h3>
                                {settings?.branches && settings.branches.length > 0 ? (
                                    settings.branches.map((branch, idx) => (
                                        <div key={idx} className="branch-item mt-4">
                                            <h5>{branch.title}</h5>
                                            <p className="mb-0">
                                                {branch.addressLines.map((line, i) => (
                                                    <React.Fragment key={i}>
                                                        {line}
                                                        {i < branch.addressLines.length - 1 && <br />}
                                                    </React.Fragment>
                                                ))}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <>
                                        <h5 className="mt-4">Head Office</h5>
                                        <p className="mb-3">
                                            Pearl One, 94-B/I, MM Alam Road,<br />
                                            Gulberg III, Lahore, Pakistan
                                        </p>
                                    </>
                                )}
                                <h5 className="mt-4">Office Hours</h5>
                                <p>{settings?.timings || 'Monday to Sunday: 9:00 AM - 6:00 PM'}</p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="map-placeholder">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3402.0969494870615!2d74.34428831512395!3d31.50932358137589!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDMwJzMzLjYiTiA3NMKwMjAnNDguNiJF!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
                                    width="100%"
                                    height="300"
                                    style={{ border: 0, borderRadius: '12px' }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    title="Zameen Office Location"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="faq-section">
                    <h2 className="section-title text-center">
                        <FaQuestionCircle className="me-2" />
                        Frequently Asked Questions
                    </h2>
                    <p className="text-center text-muted mb-5">Find quick answers to common questions</p>

                    {faqs.map((category, catIndex) => (
                        <div key={catIndex} className="faq-category">
                            <h3 className="category-title">{category.category}</h3>
                            <div className="faq-list">
                                {category.questions.map((faq, faqIndex) => {
                                    const uniqueIndex = `${catIndex}-${faqIndex}`;
                                    return (
                                        <div key={faqIndex} className={`faq-item ${openFAQ === uniqueIndex ? 'active' : ''}`}>
                                            <button
                                                className="faq-question"
                                                onClick={() => toggleFAQ(uniqueIndex)}
                                            >
                                                <span>{faq.q}</span>
                                                {openFAQ === uniqueIndex ? <FaChevronUp /> : <FaChevronDown />}
                                            </button>
                                            {openFAQ === uniqueIndex && (
                                                <div className="faq-answer">
                                                    <p>{faq.a}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </section>

                {/* Contact CTA */}
                <section className="help-cta">
                    <h3>Still Need Help?</h3>
                    <p>Can't find what you're looking for? Our support team is ready to assist you.</p>
                    <a href="/contact-us" className="btn-contact-support">Contact Support Team</a>
                </section>
            </div>

            <Footer />
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </div>
    );
};

export default HelpSupport;


