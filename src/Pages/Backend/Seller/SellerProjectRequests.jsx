import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useProjectPlans, useMyProjectRequests, useSubmitProjectRequest } from '../../../hooks/useProjectRequests';
import { FaBuilding, FaPlus, FaCheckCircle, FaClock, FaExclamationCircle, FaInfoCircle, FaArrowLeft, FaFileInvoice } from 'react-icons/fa';
import PaymentInstructions from '../../../Components/Backend/Seller/PaymentInstructions';
import './SellerProjectRequests.css';

const SellerProjectRequests = () => {
    const { user } = useSelector((state) => state.auth);
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState(null);
    const [formData, setFormData] = useState({
        planId: '',
        projectName: ''
    });
    const [paymentScreenshot, setPaymentScreenshot] = useState(null);

    const { data: plans = [] } = useProjectPlans();
    const { data: requests = [], isLoading: loadingRequests } = useMyProjectRequests(user?.token);
    const submitMutation = useSubmitProjectRequest();

    const isSubmitting = submitMutation.isPending;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (!paymentScreenshot) {
            setMessage({ type: 'error', text: 'Please upload a payment screenshot.' });
            return;
        }

        try {
            const data = new FormData();
            data.append('planId', formData.planId);
            data.append('projectName', formData.projectName);
            data.append('paymentScreenshot', paymentScreenshot);

            await submitMutation.mutateAsync({ token: user.token, formData: data });

            setMessage({ type: 'success', text: 'Project request submitted successfully! Our team will contact you soon.' });
            setShowForm(false);
            setFormData({ planId: '', projectName: '' });
            setPaymentScreenshot(null);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Submission failed' });
        }
    };

    return (
        <div className="p-2 p-md-0">
            <div className="px-md-4 mb-2">
                <div className="campaign-header-bar">
                    <h2 className="campaign-header-title"><FaBuilding className="me-2 text-warning" /> Project Requests</h2>
                    <button
                        className={`btn ${showForm ? 'btn-outline-light' : 'btn-light fw-bold'}`}
                        onClick={() => {
                            setShowForm(!showForm);
                            setMessage(null);
                        }}
                    >
                        {showForm ? <><FaArrowLeft className="me-2" /> Back to List</> : <><FaPlus className="me-2" /> New Project Request</>}
                    </button>
                </div>
            </div>

            <div className="px-md-4">
                {!showForm && <div className="premium-page-subtitle">Request dedicated project slots. Our team will assist with uploading details.</div>}

                {message && <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger shadow-sm'} mb-4`}>{message.text}</div>}

                {showForm ? (
                    <div className="project-request-form-card animate-slide-up">
                        <div className="info-banner mb-4">
                            <FaInfoCircle className="me-2" size={18} />
                            <span><strong>Note:</strong> After submittig this request, our team will contact you to collect project details (images, floor plans, etc.) for uploading.</span>
                        </div>

                        <div className="form-section-title">Step 1: Project Basic Info</div>
                        <PaymentInstructions />

                        <form onSubmit={handleSubmit} className="mt-4">
                            <div className="row g-4">
                                <div className="col-12">
                                    <label className="form-label fw-bold">Project Name</label>
                                    <input
                                        type="text"
                                        name="projectName"
                                        className="form-control form-control-lg"
                                        placeholder="e.g. Dream Gardens Phase II"
                                        value={formData.projectName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Select Project Plan</label>
                                    <select
                                        name="planId"
                                        className="form-select form-select-lg"
                                        value={formData.planId}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">-- Choose a plan --</option>
                                        {plans.map(plan => (
                                            <option key={plan._id} value={plan._id}>
                                                {plan.name} (PKR {plan.price.toLocaleString()} • {plan.durationInDays} Days)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Payment Proof (Screenshot)</label>
                                    <div className="custom-file-upload">
                                        <input
                                            type="file"
                                            id="paymentProof"
                                            onChange={(e) => setPaymentScreenshot(e.target.files[0])}
                                            accept="image/*"
                                            hidden
                                        />
                                        <label htmlFor="paymentProof" className="mb-0 cursor-pointer w-100 text-center py-1">
                                            {paymentScreenshot ? `Selected: ${paymentScreenshot.name}` : 'Click to upload receipt'}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex gap-3 justify-content-end mt-5 pt-4 border-top">
                                <button type="button" className="btn-premium-cancel px-4" onClick={() => setShowForm(false)}>Cancel</button>
                                <button type="submit" className="btn-premium-save px-5" disabled={isSubmitting}>
                                    {isSubmitting ? 'Processing...' : 'Submit Request'}
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="seller-table-container animate-fade-in">
                        {loadingRequests ? (
                            <div className="p-5 text-center"><div className="spinner-border text-light" role="status"></div></div>
                        ) : (
                            <div className="table-responsive">
                                <table className="campaign-table">
                                    <thead>
                                        <tr>
                                            <th className="px-4">Project Name</th>
                                            <th>Package & Price</th>
                                            <th>Status</th>
                                            <th>Request Date</th>
                                            <th className="text-end px-4">Proof</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requests.length === 0 ? (
                                            <tr><td colSpan="5" className="text-center py-5 text-muted h6 fw-normal">No project requests found.</td></tr>
                                        ) : requests.map(req => (
                                            <tr key={req._id}>
                                                <td className="px-4 project-name-cell">{req.projectName}</td>
                                                <td>
                                                    <div className="badge-soft-blue">{req.planId?.name}</div>
                                                    <div className="price-text">PKR {req.planId?.price?.toLocaleString()}</div>
                                                </td>
                                                <td>
                                                    <span className={`badge-status ${req.status === 'approved' ? 'status-approved' :
                                                        req.status === 'rejected' ? 'status-rejected' : 'status-pending'
                                                        }`}>
                                                        {req.status === 'approved' ? <FaCheckCircle /> :
                                                            req.status === 'rejected' ? <FaExclamationCircle /> : <FaClock />}
                                                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                                    </span>
                                                    {req.rejectionReason && <div className="small text-danger mt-1">Reason: {req.rejectionReason}</div>}
                                                </td>
                                                <td className="text-muted">{new Date(req.createdAt).toLocaleDateString()}</td>
                                                <td className="text-end px-4">
                                                    <a href={req.paymentScreenshot} target="_blank" rel="noreferrer" className="btn-view-proof">
                                                        Receipt
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerProjectRequests;

