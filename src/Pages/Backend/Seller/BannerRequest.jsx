import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useBannerRequests, useBannerMutations, useBannerPlans } from '../../../hooks/useSellerFeatures';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaInfoCircle, FaSearch, FaFilter, FaSortAmountDown, FaBullhorn } from 'react-icons/fa';
import PaymentInstructions from '../../../Components/Backend/Seller/PaymentInstructions';
import DeleteConfirmModal from '../../../Components/Backend/Seller/DeleteConfirmModal';
import './BannerRequest.css';

const BannerRequest = () => {
    const { user } = useSelector((state) => state.auth);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: ''
    });
    const [bannerFile, setBannerFile] = useState(null);
    const [paymentFile, setPaymentFile] = useState(null);
    const [message, setMessage] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [planFilter, setPlanFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    const { data: requests = [], isLoading: fetchLoading } = useBannerRequests(user?.token);
    const { data: plans = [] } = useBannerPlans();
    const { submit, update, remove } = useBannerMutations();

    const loading = submit.isPending || update.isPending;

    const handleChange = (e) => {
        if (e.target.name === 'bannerImage') {
            setBannerFile(e.target.files[0]);
        } else if (e.target.name === 'paymentScreenshot') {
            setPaymentFile(e.target.files[0]);
        } else if (e.target.name === 'planId') {
            const plan = plans.find(p => p._id === e.target.value);
            setSelectedPlan(plan);
            setFormData({ ...formData, planId: e.target.value });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleEdit = (request) => {
        if (request.status === 'approved') {
            setMessage({
                type: 'warning',
                text: 'Cannot edit approved banners. Approved banner requests are locked and cannot be modified.'
            });
            setTimeout(() => setMessage(null), 5000);
            return;
        }

        setEditId(request._id);
        setFormData({
            title: request.title || '',
            description: request.description || '',
            startDate: request.startDate ? new Date(request.startDate).toISOString().split('T')[0] : '',
            planId: request.planId?._id || ''
        });
        setSelectedPlan(request.planId || null);
        setBannerFile(null);
        setPaymentFile(null);
        setShowForm(true);
        setMessage(null);
    };

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [requestToDelete, setRequestToDelete] = useState(null);

    const handleDelete = (id, status) => {
        if (status === 'approved') {
            setMessage({
                type: 'warning',
                text: 'Cannot delete approved banners. Approved banner requests are locked and cannot be deleted.'
            });
            setTimeout(() => setMessage(null), 5000);
            return;
        }

        setRequestToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!requestToDelete) return;
        try {
            await remove.mutateAsync({ token: user.token, id: requestToDelete });
            setMessage({ type: 'success', text: 'Request deleted successfully' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            
            setMessage({ type: 'error', text: 'Failed to delete request' });
            setTimeout(() => setMessage(null), 3000);
        } finally {
            setIsDeleteModalOpen(false);
            setRequestToDelete(null);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            startDate: '',
            planId: ''
        });
        setSelectedPlan(null);
        setBannerFile(null);
        setPaymentFile(null);
        setEditId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('startDate', formData.startDate);
            if (formData.planId) data.append('planId', formData.planId);

            if (bannerFile) data.append('bannerImage', bannerFile);
            if (paymentFile) data.append('paymentScreenshot', paymentFile);

            setMessage({ type: 'info', text: 'Uploading images... Please wait.' });

            if (editId) {
                await update.mutateAsync({ token: user.token, id: editId, data });
                setMessage({ type: 'success', text: 'Banner request updated successfully!' });
            } else {
                await submit.mutateAsync({ token: user.token, data });
                setMessage({ type: 'success', text: 'Banner request submitted successfully! Status: Pending' });
            }

            resetForm();
            setTimeout(() => {
                setShowForm(false);
                setMessage(null);
            }, 2000);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Something went wrong' });
        }
    };

    // --- Frontend Filtering & Sorting Logic ---
    const filteredRequests = requests.filter(req => {
        const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
        const matchesPlan = planFilter === 'all' || req.planId?._id === planFilter;

        return matchesSearch && matchesStatus && matchesPlan;
    }).sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.startDate) - new Date(a.startDate);
        if (sortBy === 'oldest') return new Date(a.startDate) - new Date(b.startDate);
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
    });

    return (
        <div className="p-2 p-md-0">
            <div className="px-md-4 mb-2">
                <div className="campaign-header-bar">
                    <h2 className="campaign-header-title"><FaBullhorn className="me-2 text-warning" /> Banner Requests</h2>
                    <button
                        className={`btn ${showForm ? 'btn-outline-light' : 'btn-primary fw-bold text-white shadow-sm border-white'}`}
                        onClick={() => {
                            setShowForm(!showForm);
                            setMessage(null);
                            if (!showForm) resetForm();
                        }}
                    >
                        {showForm ? <><FaArrowLeft className="me-2" /> Back</> : <><FaPlus className="me-2" /> Create</>}
                    </button>
                </div>
            </div>

            <div className="px-md-4">

                {message && <div className={`alert ${message.type === 'success' ? 'alert-success' :
                    message.type === 'info' ? 'alert-info' :
                        message.type === 'warning' ? 'alert-warning' :
                            'alert-danger'
                    }`}>{message.text}</div>}

                {showForm ? (
                    <div className="banner-request-form-card animate-slide-up">
                        <h4><FaPlus className="text-primary" /> {editId ? 'Update Banner Request' : 'Submit New Advertisement'}</h4>

                        <PaymentInstructions />

                        <form onSubmit={handleSubmit}>
                            <div className="form-section-title">
                                <span>Plan Selection</span>
                            </div>
                            <div className="mb-4">
                                <label>Banner Advertisement Plan</label>
                                <select name="planId" className="form-select" value={formData.planId} onChange={handleChange} required>
                                    <option value="">-- Choose an advertising plan --</option>
                                    {plans.map(plan => (
                                        <option key={plan._id} value={plan._id}>
                                            {plan.name} (Rs {plan.price.toLocaleString()} • {plan.durationInDays} days)
                                        </option>
                                    ))}
                                </select>
                                {selectedPlan && (
                                    <div className="mt-2 small text-muted px-2 border-start border-warning ms-1">
                                        {selectedPlan.description}
                                    </div>
                                )}
                            </div>

                            <div className="form-section-title">
                                <span>Advertisement Details</span>
                            </div>
                            <div className="row g-3">
                                <div className="col-md-8 mb-3">
                                    <label>Banner Title</label>
                                    <input type="text" className="form-control" name="title" placeholder="Catchy heading for your banner" value={formData.title} onChange={handleChange} required />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label>Campaign Start Date</label>
                                    <input type="date" className="form-control" name="startDate" value={formData.startDate} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label>Short Description (Optional)</label>
                                <textarea className="form-control" name="description" rows="3" placeholder="Tell users more about this promotion..." value={formData.description} onChange={handleChange}></textarea>
                            </div>

                            <div className="form-section-title">
                                <span>Creative & Payments</span>
                            </div>
                            <div className="row g-4 mb-4">
                                <div className="col-md-6">
                                    <label>Banner Creative {editId && <span className="text-muted small">(Optional)</span>}</label>
                                    <div className="custom-file-upload">
                                        <input type="file" id="bannerImage" name="bannerImage" onChange={handleChange} accept="image/*" required={!editId} hidden />
                                        <label htmlFor="bannerImage" className="mb-0 cursor-pointer w-100">
                                            <div className="mb-2"><i className="fa fa-cloud-upload fa-2x text-primary opacity-50"></i></div>
                                            {bannerFile ? `File: ${bannerFile.name}` : (editId ? 'Change Banner' : 'Upload Banner (1920x600)')}
                                        </label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label>Payment Proof {editId && <span className="text-muted small">(Optional)</span>}</label>
                                    <div className="custom-file-upload">
                                        <input type="file" id="paymentScreenshot" name="paymentScreenshot" onChange={handleChange} accept="image/*" required={!editId} hidden />
                                        <label htmlFor="paymentScreenshot" className="mb-0 cursor-pointer w-100">
                                            <div className="mb-2"><i className="fa fa-receipt fa-2x text-primary opacity-50"></i></div>
                                            {paymentFile ? `File: ${paymentFile.name}` : (editId ? 'Change Screenshot' : 'Upload Receipt')}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex gap-3 mt-5 pt-3 border-top">
                                <button type="submit" className="btn-premium-save" disabled={loading}>
                                    {loading ? 'Processing...' : (editId ? 'Update Campaign' : 'Launch Campaign')}
                                </button>
                                <button type="button" className="btn-premium-cancel px-5" onClick={() => {
                                    setShowForm(false);
                                    setEditId(null);
                                    resetForm();
                                }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="premium-requests-card animate-fade-in mb-5">
                        <div className="campaign-card-header">
                            <div className="d-flex flex-column gap-3">
                                <h5 className="mb-0 d-flex align-items-center">
                                    <FaInfoCircle className="me-2" />
                                    My Banner Campaign Requests
                                </h5>

                                <div className="filter-grid">
                                    {/* Search */}
                                    <div className="premium-filter-box">
                                        <FaSearch className="ms-2 opacity-75 text-white" />
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search title..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>

                                    {/* Status Filter */}
                                    <div className="premium-filter-box">
                                        <select
                                            className="form-select"
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                        >
                                            <option value="all">All Status</option>
                                            <option value="pending">Pending</option>
                                            <option value="approved">Approved</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </div>

                                    {/* Plan Filter */}
                                    <div className="premium-filter-box">
                                        <select
                                            className="form-select"
                                            value={planFilter}
                                            onChange={(e) => setPlanFilter(e.target.value)}
                                        >
                                            <option value="all">All Plans</option>
                                            {plans.map(p => (
                                                <option key={p._id} value={p._id}>{p.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Sort By */}
                                    <div className="premium-filter-box">
                                        <select
                                            className="form-select"
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                        >
                                            <option value="newest">Newest First</option>
                                            <option value="oldest">Oldest First</option>
                                            <option value="title">Sort by Title</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="premium-table-container">
                            {fetchLoading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status"></div>
                                    <p className="mt-2 text-muted">Loading your requests...</p>
                                </div>
                            ) : filteredRequests.length === 0 ? (
                                <div className="text-center py-5">
                                    <div className="opacity-25 mb-3">
                                        <i className="fa fa-folder-open fa-4x"></i>
                                    </div>
                                    <p className="mb-0 text-muted fw-medium">
                                        {requests.length === 0
                                            ? 'No banner requests found yet.'
                                            : 'No matching requests found for these filters.'}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Table for Desktop & Mobile */}
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle">
                                            <thead>
                                                <tr>
                                                    <th className="ps-4">S.No</th>
                                                    <th>Banner</th>
                                                    <th>Campaign Info</th>
                                                    <th>Plan Details</th>
                                                    <th>Schedule</th>
                                                    <th className="text-center">Status</th>
                                                    <th className="text-end pe-4">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredRequests.map((req, index) => (
                                                    <tr key={req._id}>
                                                        <td className="ps-4 text-muted fw-medium">{index + 1}</td>
                                                        <td>
                                                            <img src={req.bannerImage} alt="Banner" style={{ width: '80px', height: '45px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                                                        </td>
                                                        <td>
                                                            <div className="fw-bold text-dark">{req.title}</div>
                                                            <div className="small text-muted text-truncate" style={{ maxWidth: '180px' }}>{req.description}</div>
                                                        </td>
                                                        <td>
                                                            {req.planId ? (
                                                                <div>
                                                                    <div className="fw-bold text-primary">{req.planId.name}</div>
                                                                    <div className="small text-muted">Rs {req.planId.price.toLocaleString()}</div>
                                                                </div>
                                                            ) : <span className="text-muted">No Plan</span>}
                                                        </td>
                                                        <td>
                                                            <div className="small">
                                                                <div className="text-nowrap"><span className="text-muted">Start:</span> {req.startDate ? new Date(req.startDate).toLocaleDateString() : '—'}</div>
                                                                <div className="text-nowrap"><span className="text-muted">End:</span> {req.endDate ? new Date(req.endDate).toLocaleDateString() : '—'}</div>
                                                            </div>
                                                        </td>
                                                        <td className="text-center">
                                                            <span className={`status-badge status-${req.status}`}>
                                                                {req.status.toUpperCase()}
                                                            </span>
                                                        </td>
                                                        <td className="text-end pe-4">
                                                            <div className="d-flex justify-content-end gap-1">
                                                                <button
                                                                    className="btn btn-sm btn-light text-primary border-0"
                                                                    onClick={() => handleEdit(req)}
                                                                    disabled={req.status === 'approved'}
                                                                    title="Edit Request"
                                                                >
                                                                    <FaEdit size={16} />
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-light text-danger border-0"
                                                                    onClick={() => handleDelete(req._id, req.status)}
                                                                    disabled={req.status === 'approved'}
                                                                    title="Delete Request"
                                                                >
                                                                    <FaTrash size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Footer info */}
                                    <div className="p-3 text-end border-top bg-light-subtle rounded-bottom-4">
                                        <span className="small text-muted fw-bold">
                                            Total Campaigns: {filteredRequests.length}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                <DeleteConfirmModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    title="Delete Banner Request"
                    message="Are you sure you want to delete this banner request? This action will remove the request and all associated data."
                />
            </div>
        </div>
    );
};

export default BannerRequest;
