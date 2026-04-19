import React, { useState, useEffect } from 'react';
import { useActiveAgencyPlans } from '../../../hooks/useAgencyManagement';
import { useMyAgencies, useSubmitUpgradeRequest } from '../../../hooks/useSellerFeatures';
// import axios from 'axios'; // Removed
import { useSelector } from 'react-redux';
import { FaCrown, FaCheckCircle, FaStar } from 'react-icons/fa';
import './AgencyUpgrade.css';
import PaymentInstructions from '../../../Components/Backend/Seller/PaymentInstructions';

const AgencyUpgrade = () => {
    const { user } = useSelector((state) => state.auth);
    const { data: plans = [] } = useActiveAgencyPlans();
    const { data: agenciesData } = useMyAgencies(user?.token);
    const agencies = agenciesData?.agencies || [];
    const { mutateAsync: submitUpgrade, isLoading: isSubmitting } = useSubmitUpgradeRequest();

    // const [agencies, setAgencies] = useState([]); // Removed
    // const [plans, setPlans] = useState([]); // Removed
    const [selectedAgency, setSelectedAgency] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [paymentFile, setPaymentFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    // useEffect for fetching removed

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedAgency || !selectedPlan || !paymentFile) {
            setMessage({ type: 'error', text: 'Please select an agency, a plan, and upload payment proof.' });
            return;
        }

        const formData = new FormData();
        formData.append('agencyId', selectedAgency);
        formData.append('planId', selectedPlan);
        formData.append('paymentImage', paymentFile);

        setLoading(true);
        try {
            await submitUpgrade({ token: user.token, formData });
            setMessage({ type: 'success', text: 'Upgrade request submitted successfully!' });
            setSelectedAgency(null);
            setSelectedPlan(null);
            setPaymentFile(null);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Submission failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-2 p-md-4">
            {/* Banner Style Header */}
            <div className="premium-requests-card animate-fade-in mb-3">
                <div className="campaign-card-header">
                    <h5 className="mb-0 d-flex align-items-center gap-2">
                        <FaCrown className="text-warning" /> Promote Your Agency
                    </h5>
                </div>
            </div>

            {message && <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'}`}>{message.text}</div>}

            <div className="row g-4">
                {/* Step 1: Select Agency */}
                <div className="col-md-4">
                    <div className="card h-100 shadow-sm border-0">
                        <div className="card-header bg-white fw-bold">1. Select Agency</div>
                        <div className="card-body" style={{ height: '400px', overflowY: 'auto' }}>
                            {agencies.length === 0 ? <p className="text-muted">No agencies found.</p> : (
                                <div className="list-group">
                                    {agencies.map(agency => (
                                        <button
                                            key={agency._id}
                                            className={`list-group-item list-group-item-action d-flex align-items-center ${selectedAgency === agency._id ? 'active' : ''}`}
                                            onClick={() => setSelectedAgency(agency._id)}
                                        >
                                            <img src={agency.logo || "https://placehold.co/40"} alt="" className="rounded-circle me-3" style={{ width: 40, height: 40, objectFit: 'cover' }} />
                                            <div>
                                                <div className="fw-bold">{agency.name}</div>
                                                <div className="small opacity-75">{agency.isFeatured ? 'Already Featured' : 'Standard'}</div>
                                            </div>
                                            {selectedAgency === agency._id && <FaCheckCircle className="ms-auto" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Step 2: Select Plan */}
                <div className="col-md-4">
                    <div className="card h-100 shadow-sm border-0">
                        <div className="card-header bg-white fw-bold">2. Choose Plan</div>
                        <div className="card-body">
                            {plans.map(plan => (
                                <div
                                    key={plan._id}
                                    className={`card mb-3 cursor-pointer ${selectedPlan === plan._id ? 'border-primary bg-light' : 'border-light'} ${plan.name.toLowerCase().includes('titanium') ? 'titanium-plan-card' : ''} ${plan.name.toLowerCase().includes('featured') ? 'featured-plan-card' : ''}`}
                                    onClick={() => setSelectedPlan(plan._id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="card-body text-center">
                                        <h5 className={`card-title ${plan.name.toLowerCase().includes('titanium') ? 'text-titanium' : 'text-primary'}`}>
                                            <FaCrown className={`me-2 ${plan.name.toLowerCase().includes('titanium') ? 'text-secondary' : 'text-warning'}`} />
                                            {plan.name}
                                        </h5>
                                        <h3 className="card-text fw-bold">Rs {plan.price.toLocaleString()}</h3>
                                        <p className="card-text text-muted">{plan.durationInDays} Days Validity</p>
                                        <p className="small">{plan.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Step 3: Payment & Submit */}
                <div className="col-md-4">
                    <div className="card h-100 shadow-sm border-0">
                        <div className="card-header bg-white fw-bold">3. Payment Proof</div>
                        <div className="card-body">
                            <div className="mb-3 text-dark">
                                <label className="form-label">Upload Screenshot</label>
                                <input type="file" className="form-control" onChange={(e) => setPaymentFile(e.target.files[0])} accept="image/*" />
                            </div>
                            <PaymentInstructions />
                            <button
                                className="btn btn-primary w-100 py-2 fw-bold"
                                disabled={loading || !selectedAgency || !selectedPlan || !paymentFile}
                                onClick={handleSubmit}
                            >
                                {loading ? 'Submitting...' : 'Submit Upgrade Request'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgencyUpgrade;

