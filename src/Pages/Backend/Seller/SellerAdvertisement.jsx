import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAdDeals, useSellerAdRequests, useCreateAdRequest } from '../../../hooks/useAds';
import { FaBullhorn, FaArrowLeft, FaPlus, FaClock, FaCheckCircle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';
import PaymentInstructions from '../../../Components/Backend/Seller/PaymentInstructions';
import './SellerAdvertisement.css';

const SellerAdvertisement = () => {
    const { user } = useSelector((state) => state.auth);
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: '',
        dealId: ''
    });
    const [adImage, setAdImage] = useState(null);
    const [paymentScreenshot, setPaymentScreenshot] = useState(null);

    const { data: deals = [] } = useAdDeals();
    const { data: requests = [], isLoading: fetchLoading } = useSellerAdRequests(user?.token);
    const createAdRequestMutation = useCreateAdRequest();

    const loading = createAdRequestMutation.isPending;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('startDate', formData.startDate);
            data.append('dealId', formData.dealId);
            if (adImage) data.append('adImage', adImage);
            if (paymentScreenshot) data.append('paymentScreenshot', paymentScreenshot);

            await createAdRequestMutation.mutateAsync({ adData: data, token: user.token });

            setMessage({ type: 'success', text: 'Advertisement request submitted successfully! Pending approval.' });
            setShowForm(false);
            setFormData({ title: '', description: '', startDate: '', dealId: '' });
            setAdImage(null);
            setPaymentScreenshot(null);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Submission failed' });
        }
    };

    return (
        <div className="p-2 p-md-0">
            <div className="px-md-4 mb-2">
                <div className="campaign-header-bar">
                    <h2 className="campaign-header-title"><FaBullhorn className="me-2 text-warning" /> Advertisements</h2>
                    <button
                        className={`btn ${showForm ? 'btn-outline-light' : 'btn-light fw-bold'}`}
                        onClick={() => {
                            setShowForm(!showForm);
                            setMessage(null);
                        }}
                    >
                        {showForm ? <><FaArrowLeft className="me-2" /> Back to List</> : <><FaPlus className="me-2" /> New Ad Request</>}
                    </button>
                </div>
            </div>

            <div className="px-md-4">
                {!showForm && <div className="premium-page-subtitle">Request premium advertisement slots to maximize your lead generation.</div>}

                {message && <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger shadow-sm'} mb-4`}>{message.text}</div>}

                {showForm ? (
                    <div className="banner-request-form-card animate-slide-up">
                        <h4 className="mb-4">Submit Advertisement Request</h4>
                        <PaymentInstructions />

                        <form onSubmit={handleSubmit} className="mt-4">
                            <div className="form-section-title">Step 1: Campaign Details</div>
                            <div className="row g-3 mb-4">
                                <div className="col-md-8">
                                    <label className="form-label fw-bold">Ad Campaign Title</label>
                                    <input type="text" name="title" className="form-control" placeholder="e.g. Dream House Promotion" value={formData.title} onChange={handleChange} required />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-bold">Ideal Start Date</label>
                                    <input type="date" name="startDate" className="form-control" value={formData.startDate} onChange={handleChange} required />
                                </div>
                                <div className="col-12">
                                    <label className="form-label fw-bold">Description (Optional)</label>
                                    <textarea name="description" className="form-control" rows="2" placeholder="Briefly describe your ad focus..." value={formData.description} onChange={handleChange}></textarea>
                                </div>
                            </div>

                            <div className="form-section-title">Step 2: Package Selection</div>
                            <div className="mb-4">
                                <label className="form-label fw-bold">Choose Advertising Deal</label>
                                <select name="dealId" className="form-select" value={formData.dealId} onChange={handleChange} required>
                                    <option value="">-- Select a package --</option>
                                    {deals.map(deal => (
                                        <option key={deal._id} value={deal._id}>
                                            {deal.name} (Rs {deal.price.toLocaleString()} • {deal.durationInDays} days)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-section-title">Step 3: Creative & Payment Proof</div>
                            <div className="row g-4 mb-4">
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Ad Creative (Image)</label>
                                    <div className="custom-file-upload">
                                        <input type="file" id="adImage" name="adImage" onChange={(e) => setAdImage(e.target.files[0])} accept="image/*" required hidden />
                                        <label htmlFor="adImage" className="mb-0 cursor-pointer w-100">
                                            {adImage ? `Selected: ${adImage.name}` : 'Click to upload Ad Image'}
                                        </label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Payment Screenshot</label>
                                    <div className="custom-file-upload">
                                        <input type="file" id="paymentScreenshot" name="paymentScreenshot" onChange={(e) => setPaymentScreenshot(e.target.files[0])} accept="image/*" required hidden />
                                        <label htmlFor="paymentScreenshot" className="mb-0 cursor-pointer w-100">
                                            {paymentScreenshot ? `Selected: ${paymentScreenshot.name}` : 'Click to upload Payment Receipt'}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex gap-3 justify-content-end mt-5 pt-3 border-top">
                                <button type="button" className="btn-premium-cancel px-4" onClick={() => setShowForm(false)}>Cancel</button>
                                <button type="submit" className="btn-premium-save px-5" disabled={loading}>
                                    {loading ? 'Processing...' : 'Submit Request'}
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="seller-table-container animate-fade-in">
                        {fetchLoading ? (
                            <div className="p-5 text-center"><div className="spinner-border text-primary" role="status"></div></div>
                        ) : (
                            <div className="table-responsive">
                                <table className="campaign-table">
                                    <thead>
                                        <tr>
                                            <th className="px-4">Campaign</th>
                                            <th>Deal & Price</th>
                                            <th>Dates</th>
                                            <th>Status</th>
                                            <th className="text-end px-4">Proof</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {requests.length === 0 ? (
                                            <tr><td colSpan="5" className="text-center py-5 text-muted h6 fw-normal">No active ad requests found.</td></tr>
                                        ) : requests.map(req => (
                                            <tr key={req._id}>
                                                <td className="px-4 ad-title-cell">
                                                    <div className="fw-bold">{req.title}</div>
                                                    <div className="small text-muted">{req.description || 'No description'}</div>
                                                </td>
                                                <td>
                                                    <div className="ad-deal-badge">{req.deal?.name}</div>
                                                    <div className="ad-price">Rs {req.amount?.toLocaleString()}</div>
                                                </td>
                                                <td>
                                                    <div className="ad-date-row">
                                                        <span className="date-dot dot-start"></span>
                                                        <span>Start: {new Date(req.startDate).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="ad-date-row">
                                                        <span className="date-dot dot-end"></span>
                                                        <span>End: {req.endDate ? new Date(req.endDate).toLocaleDateString() : 'Pending'}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={`badge-ad-status ${req.status === 'approved' ? 'status-approved' :
                                                        req.status === 'rejected' ? 'status-rejected' : 'status-pending'
                                                        }`}>
                                                        {req.status === 'approved' ? <FaCheckCircle /> :
                                                            req.status === 'rejected' ? <FaTimesCircle /> : <FaClock />}
                                                        {req.status.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="text-end px-4">
                                                    <div className="d-flex justify-content-end gap-2">
                                                        <a href={req.adImage} target="_blank" rel="noreferrer" className="btn-ad-view btn-ad-image" title="View Ad Image">Ad</a>
                                                        <a href={req.paymentScreenshot} target="_blank" rel="noreferrer" className="btn-ad-view btn-ad-receipt" title="View Payment Receipt">Receipt</a>
                                                    </div>
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

export default SellerAdvertisement;

