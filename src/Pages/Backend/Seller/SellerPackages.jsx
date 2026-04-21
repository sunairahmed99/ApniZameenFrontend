import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useDeals, useSubmitSubscriptionRequest } from '../../../hooks/useSellerFeatures';
import { FaCheck, FaBoxOpen, FaCloudUploadAlt, FaHistory, FaRocket } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import PaymentInstructions from '../../../Components/Backend/Seller/PaymentInstructions';
import './SellerPackages.css';

const SellerPackages = () => {
    const { user } = useSelector((state) => state.auth);

    const [selectedDeal, setSelectedDeal] = useState(null);
    const [paymentScreenshot, setPaymentScreenshot] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState(null);
    const { data: deals = [] } = useDeals();
    const { mutateAsync: submitRequest } = useSubmitSubscriptionRequest();

    const handleFileChange = (e) => {
        setPaymentScreenshot(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedDeal || !paymentScreenshot) {
            setMessage({ type: 'error', text: 'Please select a deal and upload payment screenshot.' });
            return;
        }

        const formData = new FormData();
        if (user?._id) {
            formData.append('sellerId', user._id);
        } else {
            setMessage({ type: 'error', text: 'You must be logged in to buy a package.' });
            return;
        }
        formData.append('dealId', selectedDeal._id);
        formData.append('paymentScreenshot', paymentScreenshot);

        setUploading(true);
        setMessage(null);

        try {
            await submitRequest({ formData });
            setMessage({ type: 'success', text: 'Request submitted successfully! Waiting for approval.' });
            setPaymentScreenshot(null);
            setSelectedDeal(null);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to submit request.' });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-2 p-md-4">
            <div className="premium-header-card animate-fade-in mb-4">
                <div className="campaign-card-header">
                    <div className="d-flex justify-content-between align-items-center text-white">
                        <div className="d-flex align-items-center gap-3">
                            <FaBoxOpen className="text-warning fs-4" />
                            <div>
                                <h5 className="mb-0 fw-bold">Buy Property Packages</h5>
                                <p className="mb-0 small opacity-75 d-none d-md-block">Select a plan to increase your listing limit</p>
                            </div>
                        </div>
                        <Link to="/seller/my-subscriptions" className="btn btn-outline-light btn-sm px-4 rounded-pill fw-bold">
                            <FaHistory className="me-2" /> Property Package History
                        </Link>
                    </div>
                </div>
            </div>

            {message && (
                <div className={`alert ${message.type === 'success' ? 'alert-success border-0 shadow-sm' : 'alert-danger border-0 shadow-sm'} mb-4 rounded-3`}>
                    {message.text}
                    {message.type === 'success' && (
                        <div className="mt-2">
                            <Link to="/seller/my-subscriptions" className="alert-link small">View Request Status →</Link>
                        </div>
                    )}
                </div>
            )}

            <div className="pricing-grid mb-5">
                {deals.map(deal => (
                    <div className={`plan-card ${selectedDeal?._id === deal._id ? 'selected' : ''}`} key={deal._id}>
                        <div className="plan-header">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <div className="plan-name">{deal.name}</div>
                                {deal.planType === 'titanium' && <span className="badge" style={{ background: 'linear-gradient(45deg, #FFD700, #FFA500)', color: '#000', fontSize: '10px' }}>TITANIUM</span>}
                                {deal.planType === 'standard' && <span className="badge bg-secondary" style={{ fontSize: '10px' }}>STANDARD</span>}
                            </div>
                            <div className="plan-price">
                                <span className="plan-currency">PKR</span> {deal.price?.toLocaleString()}
                            </div>
                        </div>
                        <div className="plan-body">
                            <ul className="plan-features">
                                <li><FaCheck /> <strong>{deal.propertyLimit}</strong> {deal.planType === 'standard' ? 'Standard' : 'Titanium'} Listings</li>
                                <li><FaCheck /> Valid for <strong>{deal.durationDays}</strong> Days</li>
                                <li><FaCheck /> Premium Support</li>
                                <li className="text-muted opacity-75 small">{deal.description}</li>
                            </ul>
                            <button
                                type="button"
                                className="select-plan-btn shadow-none"
                                onClick={() => setSelectedDeal(deal)}
                            >
                                {selectedDeal?._id === deal._id ? <><FaCheck className="me-2" /> Plan Selected</> : 'Choose This Plan'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedDeal ? (
                <div className="purchase-section animate-slide-up">
                    <div className="purchase-header">
                        <h5 className="mb-0 d-flex align-items-center">
                            <FaRocket className="me-2" /> Complete Your Purchase
                        </h5>
                    </div>
                    <div className="purchase-body">
                        <div className="row">
                            <div className="col-lg-7">
                                <div className="payment-box">
                                    <h6 className="fw-bold text-dark mb-3">Selected Plan: {selectedDeal.name}</h6>
                                    <PaymentInstructions />
                                </div>
                            </div>
                            <div className="col-lg-5">
                                <form onSubmit={handleSubmit}>
                                    <label className="form-label fw-bold text-muted small mb-3">UPLOAD PAYMENT PROOF</label>
                                    <div className="position-relative">
                                        <input
                                            type="file"
                                            className="opacity-0 position-absolute w-100 h-100"
                                            style={{ cursor: 'pointer', zIndex: 2 }}
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            required
                                        />
                                        <div className="premium-upload-btn">
                                            {paymentScreenshot ? (
                                                <div className="text-primary fw-bold">
                                                    <FaCheck className="me-2" /> {paymentScreenshot.name}
                                                </div>
                                            ) : (
                                                <>
                                                    <FaCloudUploadAlt size={32} className="text-primary mb-2" />
                                                    <div className="fw-bold text-dark">Click to upload screenshot</div>
                                                    <div className="small text-muted">JPEG, PNG supported</div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <button type="submit" className="btn btn-primary w-100 py-3 mt-4 fw-bold shadow-sm border-0"
                                        style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', borderRadius: '12px' }}
                                        disabled={uploading}>
                                        {uploading ? 'Processing...' : `Submit Payment Proof`}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-5 bg-white rounded-4 border border-dashed">
                    <FaBoxOpen size={48} className="text-muted mb-3 opacity-25" />
                    <h5 className="text-muted fw-bold">Select a package to get started</h5>
                    <p className="text-muted small">Choose the plan that best fits your agency's needs</p>
                </div>
            )}
        </div>
    );
};

export default SellerPackages;

