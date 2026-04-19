import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { usePendingPayments, useReviewPayment } from '../../../hooks/useAdminFinancials';
// import axios from 'axios'; // Removed
import { FaCheck, FaTimes, FaEye } from 'react-icons/fa';

/**
 * Generic Component to list pending payments by category.
 * @param {string} category - 'banner', 'agency', 'property', or undefined (for ALL)
 * @param {string} title - Page Title
 */
const PaymentRequests = ({ category, title }) => {
    const { user } = useSelector((state) => state.auth);
    const token = user?.token;
    const { data: payments = [], isLoading: loading, refetch: refetchPayments } = usePendingPayments(token, category);
    const { mutateAsync: reviewPay } = useReviewPayment();

    const [selectedPayment, setSelectedPayment] = useState(null);
    const [reviewData, setReviewData] = useState({
        amount: '',
        notes: ''
    });

    // Modal State
    const [showModal, setShowModal] = useState(false);

    // useEffect for fetch removed

    const handleReviewClick = (payment) => {
        setSelectedPayment(payment);
        setReviewData({ amount: '', notes: '' });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPayment(null);
    };

    const submitReview = async (action) => {
        if (action === 'approve' && !reviewData.amount) {
            alert('Please enter Amount for approval.');
            return;
        }

        try {
            await reviewPay({
                token,
                reviewData: {
                    paymentImageId: selectedPayment._id,
                    action,
                    paymentType: category || selectedPayment.category || 'other',
                    ...reviewData
                }
            });

            alert(`Payment ${action}ed successfully!`);
            handleCloseModal();
            // Refetch happens automatically primarily, but if needed: refetchPayments();
        } catch (error) {
            
            alert(`Failed to ${action} payment. ${error.response?.data?.message || ''}`);
        }
    };

    if (loading) return <div className="p-4">Loading...</div>;

    return (
        <div className="container-fluid p-4">
            <h2 className="mb-4">{title}</h2>

            <div className="table-responsive bg-white rounded shadow-sm p-3">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>#</th>
                            <th>User</th>
                            <th>Image</th>
                            <th>Category</th>
                            <th>Uploaded Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-4">No pending {category || ''} payments found.</td>
                            </tr>
                        ) : (
                            payments.map((payment, index) => (
                                <tr key={payment._id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div>{payment.user?.name || 'Unknown'}</div>
                                        <small className="text-muted">{payment.user?.email}</small>
                                    </td>
                                    <td>
                                        <a href={payment.imageUrl} target="_blank" rel="noopener noreferrer">
                                            <img
                                                src={payment.imageUrl}
                                                alt="Proof"
                                                style={{ height: '50px', width: '80px', objectFit: 'cover', borderRadius: '4px' }}
                                            />
                                        </a>
                                    </td>
                                    <td>
                                        <span className="badge bg-info text-dark">{payment.category ? payment.category.toUpperCase() : 'OTHER'}</span>
                                    </td>
                                    <td>{new Date(payment.createdAt).toLocaleDateString()} {new Date(payment.createdAt).toLocaleTimeString()}</td>
                                    <td>
                                        <span className="badge bg-warning text-dark">{payment.status.toUpperCase()}</span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleReviewClick(payment)}
                                        >
                                            <FaEye className="me-1" /> Review
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Review Modal */}
            {showModal && selectedPayment && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Review {category ? category.toUpperCase() : ''} Payment</h5>
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
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={category ? category.toUpperCase() : selectedPayment.category}
                                                disabled
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Approved Amount (PKR)</label>
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

export default PaymentRequests;

