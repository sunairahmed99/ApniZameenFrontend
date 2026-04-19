import React, { useState, useMemo } from 'react';
import { useSellerInquiries } from '../../../hooks/useSellerFeatures';
import { useSelector } from 'react-redux';
import { FaEnvelope, FaPhone, FaUser, FaClock, FaEye, FaSearch, FaCommentAlt } from 'react-icons/fa';
import './SellerInquiries.css';

const SellerInquiries = () => {
    const { user } = useSelector((state) => state.auth);
    const { data: allInquiries = [], isLoading: loading } = useSellerInquiries(user?.token);

    const [search, setSearch] = useState('');
    const [selectedInquiry, setSelectedInquiry] = useState(null);

    const filteredInquiries = useMemo(() => {
        let docs = [...allInquiries];
        if (search) {
            const lowSearch = search.toLowerCase();
            docs = docs.filter(inq =>
                inq.name?.toLowerCase().includes(lowSearch) ||
                inq.propertyId?.title?.toLowerCase().includes(lowSearch) ||
                inq.message?.toLowerCase().includes(lowSearch)
            );
        }
        return docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [allInquiries, search]);

    return (
        <div className="p-2 p-md-4">
            <div className="premium-requests-card animate-fade-in mb-5">
                <div className="campaign-card-header">
                    <div className="d-flex flex-column gap-3">
                        <div className="d-flex justify-content-between align-items-center text-white">
                            <h5 className="mb-0 d-flex align-items-center">
                                <FaCommentAlt className="me-2 text-warning" />
                                My Inquiries
                            </h5>
                            <span className="small opacity-75 d-none d-md-inline">Manage messages from interested buyers</span>
                        </div>

                        <div className="filter-grid">
                            <div className="premium-filter-box">
                                <FaSearch className="ms-2 opacity-75 text-white" />
                                <input
                                    type="text"
                                    className="form-control text-white"
                                    placeholder="Search by name, property or message..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="premium-table-container">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-light" role="status"></div>
                            <p className="mt-2 text-muted">Loading inquiries...</p>
                        </div>
                    ) : filteredInquiries.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="opacity-25 mb-3">
                                <FaEnvelope size={48} />
                            </div>
                            <p className="mb-0 text-muted fw-medium">No inquiries found.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead>
                                    <tr>
                                        <th className="ps-4">Date</th>
                                        <th>Property Listing</th>
                                        <th>Client Information</th>
                                        <th>Message Preview</th>
                                        <th className="text-end pe-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredInquiries.map((inq) => (
                                        <tr key={inq._id}>
                                            <td className="ps-4">
                                                <div className="d-flex align-items-center gap-2 text-muted">
                                                    <FaClock size={12} />
                                                    <span className="small fw-medium">
                                                        {new Date(inq.createdAt || inq.date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="property-title-link">
                                                    {inq.propertyId?.title || "Property Unavailable"}
                                                </div>
                                                <div className="small text-muted opacity-75">ID: {inq.propertyId?._id?.slice(-8).toUpperCase() || "N/A"}</div>
                                            </td>
                                            <td>
                                                <div className="client-name">{inq.name}</div>
                                                <div className="contact-info d-flex flex-column mt-1">
                                                    <span className="d-flex align-items-center gap-1">
                                                        <FaEnvelope size={10} /> {inq.email}
                                                    </span>
                                                    <span className="d-flex align-items-center gap-1">
                                                        <FaPhone size={10} /> {inq.phone}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="message-preview text-truncate" style={{ maxWidth: '250px' }} title={inq.message}>
                                                    {inq.message}
                                                </div>
                                            </td>
                                            <td className="text-end pe-4">
                                                <button
                                                    className="btn btn-sm btn-light border-0 px-3 py-2 rounded-3 text-primary"
                                                    onClick={() => setSelectedInquiry(inq)}
                                                >
                                                    <FaEye className="me-1" /> View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="p-3 bg-light border-top text-end rounded-bottom-4">
                        <span className="small text-muted fw-bold">Total Inquiries: {filteredInquiries.length}</span>
                    </div>
                </div>
            </div>

            {/* Inquiry View Modal */}
            {selectedInquiry && (
                <div className="modal-backdrop-custom" onClick={() => setSelectedInquiry(null)}>
                    <div className="inquiry-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header-premium">
                            <h5 className="mb-0 fw-bold">Inquiry Details</h5>
                            <button className="btn btn-link text-white p-0 text-decoration-none" onClick={() => setSelectedInquiry(null)}>✕</button>
                        </div>
                        <div className="modal-body-premium">
                            <div className="inquiry-detail-row">
                                <div className="inquiry-detail-icon">
                                    <FaBuilding />
                                </div>
                                <div>
                                    <div className="small text-muted text-uppercase fw-bold" style={{ fontSize: '10px', letterSpacing: '1px' }}>Related Property</div>
                                    <div className="fw-bold text-dark">{selectedInquiry.propertyId?.title || "Property Unavailable"}</div>
                                </div>
                            </div>

                            <div className="inquiry-detail-row">
                                <div className="inquiry-detail-icon">
                                    <FaUser />
                                </div>
                                <div>
                                    <div className="small text-muted text-uppercase fw-bold" style={{ fontSize: '10px', letterSpacing: '1px' }}>Client Name</div>
                                    <div className="fw-bold text-dark">{selectedInquiry.name}</div>
                                    <div className="small text-muted">{selectedInquiry.email} • {selectedInquiry.phone}</div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="small text-muted text-uppercase fw-bold mb-2" style={{ fontSize: '10px', letterSpacing: '1px' }}>Client Message</div>
                                <div className="inquiry-message-box">
                                    {selectedInquiry.message}
                                </div>
                            </div>

                            <div className="mt-5 text-center">
                                <button className="btn btn-primary w-100 py-3 rounded-4 fw-bold shadow-sm" onClick={() => setSelectedInquiry(null)}>
                                    Close Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerInquiries;

