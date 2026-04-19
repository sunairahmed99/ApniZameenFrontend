import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaCheckCircle, FaKey, FaHistory, FaClock, FaSearch, FaBuilding, FaEye } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useSellerProperties, useDeleteProperty } from '../../../hooks/useProperties';
import './SoldRentedProperties.css';

const SoldRentedProperties = () => {
    const { user } = useSelector((state) => state.auth);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sort, setSort] = useState('newest');

    const params = {
        page,
        limit: 10,
        search: search || '',
        sort,
        ...(statusFilter !== 'all' ? { status: statusFilter } : {})
    };

    const { data, isLoading: loading } = useSellerProperties(user?.token, params);
    const deletePropertyMutation = useDeleteProperty();

    // If showing all, filter to only sold and rented in the component logic
    const properties = data?.properties?.filter(p =>
        statusFilter !== 'all' || p.status === 'sold' || p.status === 'rented'
    ) || [];

    const totalPages = data?.totalPages || 1;

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this listing record?')) return;
        try {
            await deletePropertyMutation.mutateAsync({ id, token: user.token });
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
                                Sold & Rented Properties
                            </h5>
                            <span className="small opacity-75 d-none d-md-inline">History of your successful deals</span>
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
                                <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                    <option value="all">All Status</option>
                                    <option value="sold">Sold Only</option>
                                    <option value="rented">Rented Only</option>
                                </select>
                            </div>
                            <div className="premium-filter-box">
                                <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                                    <option value="newest">Newest First</option>
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
                            <p className="mt-2 text-muted">Loading history...</p>
                        </div>
                    ) : properties.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="opacity-25 mb-3">
                                <FaBuilding size={48} />
                            </div>
                            <p className="mb-0 text-muted fw-medium">No results found in your history.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead>
                                    <tr>
                                        <th className="ps-4">S.No</th>
                                        <th>Property</th>
                                        <th>Location</th>
                                        <th>Final Price</th>
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
                                                        <div className="small text-muted">
                                                            Marked as {p.status}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="small fw-medium text-dark">{p.areaName}</div>
                                                <div className="small text-muted">{p.city}</div>
                                            </td>
                                            <td>
                                                <div class="fw-bold text-primary text-nowrap">Rs {p.price?.toLocaleString()}</div>
                                            </td>
                                            <td className="text-center">
                                                <span className={`status-badge status-${p.status}`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="text-end pe-4">
                                                <div className="d-flex justify-content-end gap-1">
                                                    <button className="btn btn-sm btn-light text-danger border-0" title="Delete Permanent" onClick={() => handleDelete(p._id)}><FaTrash size={14} /></button>
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
                        <span className="small text-muted fw-bold">Total History Items: {properties.length}</span>
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
        </div>
    );
};

export default SoldRentedProperties;

