import React, { useState, useEffect, useMemo } from 'react';
import { useSellerProperties, useDeleteProperty, useRenewProperty } from '../../../hooks/useProperties';
import { useMySubscriptionRequests } from '../../../hooks/useSellerFeatures';
import { useSelector } from 'react-redux';
import { FaTrash, FaClock, FaHistory, FaSearch, FaBuilding, FaInfoCircle } from 'react-icons/fa';
import './ExpiredProperties.css';

const ExpiredProperties = () => {
    const { user } = useSelector((state) => state.auth);

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('newest');

    const { data: propertiesData, isLoading: loading, refetch } = useSellerProperties(user?.token, {
        status: 'expired',
        page,
        limit: 10,
        search,
        sort
    });
    const properties = propertiesData?.properties || [];
    const totalPages = propertiesData?.totalPages || 1;

    const { data: myRequests = [], refetch: refetchMyRequests } = useMySubscriptionRequests(user?.token);
    const { mutateAsync: deleteProp } = useDeleteProperty();
    const { mutateAsync: renewProp } = useRenewProperty();

    // Renewal State
    const [showRenewModal, setShowRenewModal] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [renewing, setRenewing] = useState(false);
    const [message, setMessage] = useState(null);
    const [selectedSub, setSelectedSub] = useState('');

    // Derived state for available packages
    const subscriptions = useMemo(() => {
        if (!user || !myRequests) return [];
        return myRequests.filter(s =>
            (s.sellerId?._id || s.sellerId) === user._id &&
            s.status === 'approved' &&
            s.quotaRemaining > 0 &&
            (!s.expiryDate || new Date(s.expiryDate) > new Date())
        );
    }, [myRequests, user]);

    useEffect(() => {
        if (user && user.token) {
            refetch(); // Refetch properties when user, page, search, or sort changes
        }
    }, [user, page, search, sort, refetch]);

    const handleRenewClick = (property) => {
        setSelectedProperty(property);
        setSelectedSub('');
        setMessage(null);
        refetchMyRequests();
        setShowRenewModal(true);
    };

    const handleRenewSubmit = async () => {
        if (!selectedSub) {
            setMessage({ type: 'danger', text: 'Please select a package.' });
            return;
        }
        if (!selectedProperty) return;

        setRenewing(true);
        try {
            await renewProp({ id: selectedProperty._id, subscriptionId: selectedSub, token: user.token });
            setMessage({ type: 'success', text: 'Property renewed successfully!' });
            setTimeout(() => {
                setShowRenewModal(false);
                refetch(); // Refetch expired properties to update the list
                setSelectedProperty(null);
                setSelectedSub('');
            }, 1500);
        } catch (err) {
            setMessage({ type: 'danger', text: err.response?.data?.message || 'Renewal failed' });
        } finally {
            setRenewing(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this expired listing?')) return;
        try {
            await deleteProp({ id, token: user.token });
        } catch (err) {
            
        }
    };

    return (
        <div className="p-2 p-md-4">
            <div className="premium-requests-card animate-fade-in mb-5">
                {/* Header with blue gradient */}
                <div className="campaign-card-header">
                    <div className="d-flex flex-column gap-3">
                        <div className="d-flex justify-content-between align-items-center text-white">
                            <h5 className="mb-0 d-flex align-items-center">
                                <FaHistory className="me-2 text-warning" />
                                Expired Listings
                            </h5>
                            <span className="small opacity-75 d-none d-md-inline">Manage and renew your expired properties</span>
                        </div>

                        {/* Filters Grid */}
                        <div className="filter-grid">
                            <div className="premium-filter-box">
                                <FaSearch className="ms-2 opacity-75 text-white" />
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search titles..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="premium-filter-box">
                                <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                                    <option value="newest">Recently Expired</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="price_high">Price: High to Low</option>
                                    <option value="price_low">Price: Low to High</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Container */}
                <div className="premium-table-container">
                    {loading && properties.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-light" role="status"></div>
                            <p className="mt-2 text-muted">Loading expired listings...</p>
                        </div>
                    ) : properties.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="opacity-25 mb-3">
                                <FaBuilding size={48} />
                            </div>
                            <p className="mb-0 text-muted fw-medium">No expired properties found.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead>
                                    <tr>
                                        <th className="ps-4">S.No</th>
                                        <th>Property</th>
                                        <th>Expired On</th>
                                        <th>Price</th>
                                        <th className="text-center">Status</th>
                                        <th className="text-end pe-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {properties.map((p, index) => (
                                        <tr key={p._id}>
                                            <td className="ps-4 text-muted fw-bold">{(page - 1) * 10 + index + 1}</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-3">
                                                    <img src={p.images?.[0] || 'https://via.placeholder.com/80x55'} className="property-thumb" alt="" />
                                                    <div>
                                                        <div className="fw-bold text-dark">{p.title}</div>
                                                        <div className="small text-muted">{p.city}, {p.areaName}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="small fw-medium text-danger d-flex align-items-center">
                                                    <FaClock className="me-1" />
                                                    {new Date(p.expiryDate).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="fw-bold text-dark text-nowrap">Rs {p.price?.toLocaleString()}</div>
                                            </td>
                                            <td className="text-center">
                                                <span className="status-badge status-expired">EXPIRED</span>
                                            </td>
                                            <td className="text-end pe-4">
                                                <div className="d-flex justify-content-end gap-1">
                                                    <button
                                                        className="btn btn-sm btn-light text-primary border-0"
                                                        title="Renew Listing"
                                                        onClick={() => handleRenewClick(p)}
                                                    >
                                                        <FaHistory size={14} />
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-light text-danger border-0"
                                                        title="Delete Listing"
                                                        onClick={() => handleDelete(p._id)}
                                                    >
                                                        <FaTrash size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Table Footer */}
                    <div className="p-3 bg-light border-top text-end rounded-bottom-4">
                        <span className="small text-muted fw-bold">Total Expired Items: {properties.length}</span>
                    </div>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center pb-5">
                    <nav aria-label="Page navigation">
                        <ul className="pagination pagination-sm mb-0">
                            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                <button className="page-link shadow-none" onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</button>
                            </li>
                            <li className="page-item active"><span className="page-link">Page {page} of {totalPages}</span></li>
                            <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                <button className="page-link shadow-none" onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</button>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}

            {/* Renewal Modal */}
            {showRenewModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                            <div className="campaign-card-header" style={{ borderRadius: '0' }}>
                                <div className="d-flex justify-content-between align-items-center text-white">
                                    <h5 className="mb-0 d-flex align-items-center"><FaHistory className="me-2" /> Renew Listing</h5>
                                    <button type="button" className="btn-close btn-close-white shadow-none" onClick={() => setShowRenewModal(false)}></button>
                                </div>
                            </div>
                            <div className="modal-body p-4">
                                {message && <div className={`alert alert-${message.type} small`}>{message.text}</div>}

                                <p className="mb-4 text-muted small">Select an active package to renew <strong>{selectedProperty?.title}</strong>. This will reactivate your listing using one unit of your subscription.</p>

                                {subscriptions.length === 0 ? (
                                    <div className="text-center py-3">
                                        <div className="alert alert-danger border-0 small">No active packages found with remaining quota.</div>
                                        <a href="/seller/packages" className="btn btn-primary fw-bold px-4">Buy New Package</a>
                                    </div>
                                ) : (
                                    <div className="mb-4">
                                        <label className="form-label small fw-bold text-muted">Available Subscriptions</label>
                                        <select
                                            className="form-select shadow-none"
                                            value={selectedSub}
                                            onChange={(e) => setSelectedSub(e.target.value)}
                                            style={{ borderRadius: '10px', height: '45px' }}
                                        >
                                            <option value="">Select a package...</option>
                                            {subscriptions.map(s => (
                                                <option key={s._id} value={s._id}>
                                                    {s.dealId?.title || 'Package'} ({s.quotaRemaining} units left)
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="d-grid gap-2">
                                    <button
                                        className="btn btn-primary fw-bold py-2 shadow-sm"
                                        disabled={renewing || !selectedSub}
                                        onClick={handleRenewSubmit}
                                        style={{ borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', border: 'none' }}
                                    >
                                        {renewing ? 'Processing Renewal...' : 'Confirm Renewal'}
                                    </button>
                                    <button
                                        className="btn btn-light fw-bold py-2"
                                        disabled={renewing}
                                        onClick={() => setShowRenewModal(false)}
                                        style={{ borderRadius: '10px' }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpiredProperties;

