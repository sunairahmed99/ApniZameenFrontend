import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useMySubscriptionRequests } from '../../../hooks/useSellerFeatures';
import { FaHistory, FaSearch, FaBoxOpen, FaFileInvoiceDollar, FaCalendarAlt } from 'react-icons/fa';
import './MySubscriptions.css';

const MySubscriptions = () => {
    const { user } = useSelector((state) => state.auth);
    const { data: allRequests = [], isLoading: loading } = useMySubscriptionRequests(user?.token);

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredRequests = useMemo(() => {
        let docs = allRequests.filter(r => (r.sellerId?._id || r.sellerId) === user?._id);

        if (search) {
            docs = docs.filter(r => r.dealId?.name?.toLowerCase().includes(search.toLowerCase()));
        }

        if (statusFilter !== 'all') {
            docs = docs.filter(r => r.status === statusFilter);
        }

        return docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [allRequests, user?._id, search, statusFilter]);

    return (
        <div className="p-2 p-md-4">
            <div className="premium-requests-card animate-fade-in mb-5">
                <div className="campaign-card-header">
                    <div className="d-flex flex-column gap-3">
                        <div className="d-flex justify-content-between align-items-center text-white">
                            <h5 className="mb-0 d-flex align-items-center">
                                <FaHistory className="me-2 text-warning" />
                                Property Package History
                            </h5>
                            <span className="small opacity-75 d-none d-md-inline">Track your package subscription requests</span>
                        </div>

                        <div className="filter-grid">
                            <div className="premium-filter-box">
                                <FaSearch className="ms-2 opacity-75 text-white" />
                                <input
                                    type="text"
                                    className="form-control text-white"
                                    placeholder="Search by package..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="premium-filter-box">
                                <select
                                    className="form-select"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="premium-table-container">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-light" role="status"></div>
                            <p className="mt-2 text-muted">Loading your requests...</p>
                        </div>
                    ) : filteredRequests.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="opacity-25 mb-3">
                                <FaBoxOpen size={48} />
                            </div>
                            <p className="mb-0 text-muted fw-medium">No subscription requests found.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead>
                                    <tr>
                                        <th className="ps-4">Date</th>
                                        <th>Package Plan</th>
                                        <th>Amount Paid</th>
                                        <th className="text-center">Proof</th>
                                        <th className="text-center">Status</th>
                                        <th className="text-end pe-4">Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRequests.map((req) => (
                                        <tr key={req._id}>
                                            <td className="ps-4">
                                                <div className="d-flex align-items-center gap-2">
                                                    <FaCalendarAlt className="text-muted" />
                                                    <div className="fw-medium">{new Date(req.createdAt).toLocaleDateString()}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="fw-bold text-dark">{req.dealId?.name}</div>
                                                    {req.dealId?.planType === 'titanium' && <span className="badge" style={{ background: 'linear-gradient(45deg, #FFD700, #FFA500)', color: '#000', fontSize: '9px' }}>TITANIUM</span>}
                                                    {req.dealId?.planType === 'standard' && <span className="badge bg-secondary" style={{ fontSize: '9px' }}>STANDARD</span>}
                                                </div>
                                                <div className="small text-muted">{req.dealId?.propertyLimit} Properties Limit</div>
                                            </td>
                                            <td>
                                                <div class="fw-bold text-primary text-nowrap">
                                                    PKR {req.dealId?.price?.toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <a href={req.paymentScreenshot} target="_blank" rel="noopener noreferrer">
                                                    <img
                                                        src={req.paymentScreenshot}
                                                        className="payment-proof-thumb"
                                                        alt="Payment Proof"
                                                    />
                                                </a>
                                            </td>
                                            <td className="text-center">
                                                <span className={`status-badge status-${req.status}`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="text-end pe-4">
                                                <button className="btn btn-sm btn-light border-0" title="View Invoice">
                                                    <FaFileInvoiceDollar className="text-primary" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="p-3 bg-light border-top text-end rounded-bottom-4">
                        <span className="small text-muted fw-bold">Total Requests: {filteredRequests.length}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MySubscriptions;

