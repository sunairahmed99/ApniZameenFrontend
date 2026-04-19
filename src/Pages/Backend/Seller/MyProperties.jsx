import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaRocket, FaStar, FaClock, FaEye, FaCheckCircle, FaKey, FaSearch, FaBuilding } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSellerProperties, useDeleteProperty, useUpdatePropertyStatus } from '../../../hooks/useProperties';
import ConfirmModal from '../../../Components/ConfirmModal';
import './MyProperties.css';

const MyProperties = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, propertyId: null, status: null });

    const [searchParams] = useSearchParams();
    const urlSearch = searchParams.get('search') || '';

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState(urlSearch);
    const [status, setStatus] = useState('All');
    const [sort, setSort] = useState('newest');

    // Sync search from URL if it changes
    useEffect(() => {
        if (urlSearch) {
            setSearch(urlSearch);
        }
    }, [urlSearch]);

    const { data: { properties = [], totalPages = 1 } = {}, isLoading: loading } = useSellerProperties(user?.token, {
        page,
        limit: 10, // Increased limit for table view
        search: search || '',
        status,
        sort
    });

    const { mutateAsync: deletePropertyAsync } = useDeleteProperty();
    const { mutateAsync: updatePropertyStatusAsync } = useUpdatePropertyStatus();

    useEffect(() => {
        setPage(1);
    }, [search, status, sort]);

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this listing?')) return;
        try {
            await deletePropertyAsync({ id, token: user.token });
        } catch (err) {  }
    };

    const handleMarkAs = async (id, newStatus) => {
        setConfirmModal({ isOpen: true, propertyId: id, status: newStatus });
    };

    const confirmMarkAs = async () => {
        const { propertyId, status } = confirmModal;
        setConfirmModal({ isOpen: false, propertyId: null, status: null });

        try {
            await updatePropertyStatusAsync({ id: propertyId, status, token: user.token });
        } catch (err) {
            
            alert('Failed to update status');
        }
    };

    return (
        <div className="p-2 p-md-4">
            <div className="premium-requests-card animate-fade-in mb-5">
                {/* Header with blue gradient */}
                <div className="campaign-card-header">
                    <div className="d-flex flex-column gap-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 d-flex align-items-center text-white">
                                <FaBuilding className="me-2 text-warning" />
                                My Property Portfolio
                            </h5>
                            <a href="/seller/add-property" className="btn btn-primary btn-sm px-3 shadow-sm">+ Add New Property</a>
                        </div>

                        {/* Filters Grid */}
                        <div className="filter-grid">
                            <div className="premium-filter-box">
                                <FaSearch className="ms-2 opacity-75 text-white" />
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search properties..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="premium-filter-box">
                                <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="All">All Status</option>
                                    <option value="approved">Approved</option>
                                    <option value="pending">Pending</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="sold">Sold</option>
                                    <option value="rented">Rented</option>
                                </select>
                            </div>
                            <div className="premium-filter-box">
                                <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="price_high">Price: High to Low</option>
                                    <option value="price_low">Price: Low to High</option>
                                    <option value="views">Most Viewed</option>
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
                            <p className="mt-2 text-muted">Loading properties...</p>
                        </div>
                    ) : properties.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="opacity-25 mb-3">
                                <FaBuilding size={48} />
                            </div>
                            <p className="mb-0 text-muted fw-medium">No properties found matching your criteria.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead>
                                    <tr>
                                        <th className="ps-4">S.No</th>
                                        <th>Property</th>
                                        <th>Location</th>
                                        <th>Price</th>
                                        <th className="text-center">Views</th>
                                        <th className="text-center">Status</th>
                                        <th className="text-center">Type</th>
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
                                                        <div className="small text-muted">{p.isBoosted && <span className="text-danger me-2"><FaRocket size={10} /> Boosted</span>} {p.isFeatured && <span className="text-warning"><FaStar size={10} /> Featured</span>}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="small fw-medium text-dark">{p.areaName}</div>
                                                <div className="small text-muted">{p.city}</div>
                                            </td>
                                            <td>
                                                <div className="fw-bold text-primary text-nowrap">Rs {p.price?.toLocaleString()}</div>
                                            </td>
                                            <td className="text-center">
                                                <span className="badge bg-light text-dark border"><FaEye className="me-1 opacity-50" /> {p.views || 0}</span>
                                            </td>
                                            <td className="text-center">
                                                <span className={`status-badge status-${p.status}`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                {p.isBoosted ? (
                                                    <span className="badge bg-danger rounded-pill px-2">Super Hot</span>
                                                ) : p.isFeatured ? (
                                                    <span className="badge bg-warning text-dark rounded-pill px-2">Featured</span>
                                                ) : (
                                                    <span className="badge bg-secondary rounded-pill px-2">Normal</span>
                                                )}
                                            </td>
                                            <td className="text-end pe-4">
                                                <div className="d-flex justify-content-end gap-1">
                                                    {p.status === 'approved' && (
                                                        <>
                                                            <button className="btn btn-sm btn-light text-primary border-0" title="Mark as Sold" onClick={() => handleMarkAs(p._id, 'sold')}><FaCheckCircle size={14} /></button>
                                                            <button className="btn btn-sm btn-light text-info border-0" title="Mark as Rented" onClick={() => handleMarkAs(p._id, 'rented')}><FaKey size={14} /></button>
                                                        </>
                                                    )}
                                                    <button className="btn btn-sm btn-light text-primary border-0" title="Edit" onClick={() => navigate(`/seller/edit-property/${p._id}`)}><FaEdit size={14} /></button>
                                                    <button className="btn btn-sm btn-light text-danger border-0" title="Delete" onClick={() => handleDelete(p._id)}><FaTrash size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Table Footer / Summary */}
                    <div className="p-3 bg-light border-top text-end rounded-bottom-4">
                        <span className="small text-muted fw-bold">Total Properties: {properties.length}</span>
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

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, propertyId: null, status: null })}
                onConfirm={confirmMarkAs}
                title={`Mark as ${confirmModal.status === 'sold' ? 'Sold' : 'Rented'}?`}
                message={`Are you sure you want to mark this property as ${confirmModal.status}? It will be moved to the Sold/Rented section and removed from active listings.`}
                confirmText="Yes, Mark it"
                cancelText="Cancel"
                type="warning"
            />
        </div>
    );
};

export default MyProperties;

