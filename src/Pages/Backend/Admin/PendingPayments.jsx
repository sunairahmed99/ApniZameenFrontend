import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { usePendingPayments, useReviewPayment } from '../../../hooks/useAdminFinancials';
// import axios from 'axios'; // Removed
import { FaCheck, FaTimes, FaEye } from 'react-icons/fa';

import DataTable from '../../../Components/Backend/Admin/DataTable.jsx';

const PendingPayments = () => {
    const { user } = useSelector((state) => state.auth);
    const token = user?.token;
    const { data: payments = [], isLoading: loading } = usePendingPayments(token);
    const { mutateAsync: reviewPay } = useReviewPayment();

    const [selectedPayment, setSelectedPayment] = useState(null);
    const [reviewData, setReviewData] = useState({
        paymentType: '',
        amount: '',
        notes: ''
    });

    // Modal State
    const [showModal, setShowModal] = useState(false);

    // useEffect removed

    const handleReviewClick = (payment) => {
        setSelectedPayment(payment);
        setReviewData({ paymentType: 'banner', amount: '', notes: '' });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPayment(null);
    };

    const submitReview = async (action) => {
        if (action === 'approve' && (!reviewData.paymentType || !reviewData.amount)) {
            alert('Please select Payment Type and Amount for approval.');
            return;
        }

        try {
            await reviewPay({
                token,
                reviewData: {
                    paymentImageId: selectedPayment._id,
                    action,
                    ...reviewData
                }
            });

            alert(`Payment ${action}ed successfully!`);
            handleCloseModal();
        } catch (error) {
            
            alert(`Failed to ${action} payment. ${error.response?.data?.message || ''}`);
        }
    };

    const columns = [
        {
            key: 'user.name',
            label: 'User',
            render: (val, row) => (
                <div>
                    <div>{val || 'Unknown'}</div>
                    <small className="text-muted">{row.user?.email}</small>
                </div>
            )
        },
        {
            key: 'imageUrl',
            label: 'Image',
            sortable: false,
            render: (val) => (
                <a href={val} target="_blank" rel="noopener noreferrer">
                    <img
                        src={val}
                        alt="Proof"
                        style={{ height: '50px', width: '80px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                </a>
            )
        },
        {
            key: 'createdAt',
            label: 'Uploaded Date',
            render: (val) => `${new Date(val).toLocaleDateString()} ${new Date(val).toLocaleTimeString()}`
        },
        {
            key: 'status',
            label: 'Status',
            render: (val) => <span className="badge bg-warning text-dark">{val.toUpperCase()}</span>
        }
    ];

    if (loading) return <div className="p-4">Loading...</div>;

    return (
        <div className="container-fluid p-4">
            <h2 className="mb-4">Pending Payment Reviews</h2>

            <div className="card shadow-sm border-0">
                <DataTable
                    data={payments}
                    columns={columns}
                    showIndex={true}
                    pageSize={10}
                    emptyMessage="No pending payments found."
                    actions={(row) => (
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleReviewClick(row)}
                        >
                            <FaEye className="me-1" /> Review
                        </button>
                    )}
                />
            </div>

            {/* Review Modal */}
            {showModal && selectedPayment && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Review Payment</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <h6>Payment Proof</h6>
                                        <img
                                            src={selectedPayment.imageUrl}
                                            alt="Proof Full"
                                            className="img-fluid rounded border"
                                            style={{ maxHeight: '400px', width: '100%', objectFit: 'contain' }}
                                        />
                                        <div className="mt-2 text-center">
                                            <a href={selectedPayment.imageUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-secondary">
                                                Open Original
                                            </a>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <h6>Review Details</h6>

                                        <div className="mb-3">
                                            <label className="form-label">Payment Category</label>
                                            <select
                                                className="form-select"
                                                value={reviewData.paymentType}
                                                onChange={(e) => setReviewData({ ...reviewData, paymentType: e.target.value })}
                                            >
                                                <option value="banner">Banner Fee</option>
                                                <option value="agency">Agency Package</option>
                                                <option value="property">Property Listing</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Amount (PKR)</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={reviewData.amount}
                                                onChange={(e) => setReviewData({ ...reviewData, amount: e.target.value })}
                                                placeholder="Enter verified amount"
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Notes (Optional)</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                value={reviewData.notes}
                                                onChange={(e) => setReviewData({ ...reviewData, notes: e.target.value })}
                                                placeholder="Rejection reason or internal notes..."
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                                <button type="button" className="btn btn-danger" onClick={() => submitReview('reject')}>
                                    <FaTimes className="me-1" /> Reject
                                </button>
                                <button type="button" className="btn btn-success" onClick={() => submitReview('approve')}>
                                    <FaCheck className="me-1" /> Approve
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PendingPayments;

