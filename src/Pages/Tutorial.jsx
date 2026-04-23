import React from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer/Footer';
import SEO from '../Components/SEO';

const Tutorial = () => {
    return (
        <div className="page-fade-in">
            <SEO 
                title="How to Post Property | Apni Zameen"
                description="Learn how to post and manage your property listings on Apni Zameen Pakistan."
            />
            <Navbar />
            
            <div style={{ backgroundColor: '#f8fafc', minHeight: '80vh' }}>
                <div className="container py-5">
                    <div className="text-center mb-5">
                        <h1 className="fw-bold" style={{ color: '#1a4e32' }}>How to Post Property</h1>
                        <p className="text-muted">Follow these simple steps to list your property on Apni Zameen</p>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-lg-8">

                            <div className="bg-white p-4 rounded shadow-sm">
                                <h4 className="fw-bold mb-4">Quick Steps</h4>
                                <div className="d-flex flex-column gap-3">
                                    <div className="d-flex gap-3">
                                        <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', flexShrink: 0 }}>1</div>
                                        <div>
                                            <h6 className="fw-bold mb-1">Login to your account</h6>
                                            <p className="text-muted small mb-0">Use your email and password to log in to your Seller Panel.</p>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-3">
                                        <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', flexShrink: 0 }}>2</div>
                                        <div>
                                            <h6 className="fw-bold mb-1">Go to Dashboard / Packages</h6>
                                            <p className="text-muted small mb-0">Navigate to the packages section in your dashboard.</p>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-3">
                                        <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', flexShrink: 0 }}>3</div>
                                        <div>
                                            <h6 className="fw-bold mb-1">Buy Property Package</h6>
                                            <p className="text-muted small mb-0">Select and purchase a property package that suits your needs.</p>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-3">
                                        <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', flexShrink: 0 }}>4</div>
                                        <div>
                                            <h6 className="fw-bold mb-1">Wait for Admin Approval</h6>
                                            <p className="text-muted small mb-0">Once Admin approves your package, you can go to 'Add Property' and list your property.</p>
                                        </div>
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

export default Tutorial;
