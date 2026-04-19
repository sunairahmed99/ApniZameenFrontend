import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAdminSubscriptionRequests } from '../../../hooks/useAdminFinancials';
// import axios from 'axios'; // Removed
import { FaCheck, FaTimes, FaTrash } from 'react-icons/fa';
import DataTable from '../../../Components/Backend/Admin/DataTable.jsx';
import { API_BASE_URL } from '../../../config';

const SubscriptionApprovals = () => {
    const { user } = useSelector((state) => state.auth);
    const token = user?.token;
    const { requests, isLoading, reviewSubscription, deleteSubscription } = useAdminSubscriptionRequests(token);

    // useEffect removed

    const handleAction = async (id, status) => {
        if (!window.confirm(`Are you sure you want to ${status} this request?`)) return;
        try {
            await reviewSubscription({ token, id, action: status });
            alert(`Request ${status} successfully!`);
        } catch (err) {
            alert(`Action failed: ${err.response?.data?.message || err.message}`);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to DELETE this request? This cannot be undone.')) return;
        try {
            await deleteSubscription({ token, id });
            alert('Request deleted successfully!');
        } catch (err) {
            alert(`Delete failed: ${err.response?.data?.message || err.message}`);
        }
    };

    const columns = [
        {
            key: 'sellerId',
            label: 'Seller',
            render: (value) => (
                <div>
                    <strong>{value?.name || 'Unknown'}</strong><br />
                    <small className="text-muted">{value?.email}</small>
                </div>
            )
        },
        {
            key: 'dealId',
            label: 'Deal',
            render: (value) => (
                <div>
                    <span className="badge bg-info text-dark">{value?.name}</span><br />
                    <small>Limit: {value?.propertyLimit}</small>
                </div>
            )
        },
        {
            key: 'price',
            label: 'Price',
            render: (value, row) => `PKR ${row.dealId?.price}`
        },
        {
            key: 'paymentScreenshot',
            label: 'Payment Proof',
            render: (value) => (
                <a href={value?.startsWith('http') ? value : `${API_BASE_URL}/${value}`} target="_blank" rel="noopener noreferrer">
                    <img
                        src={value?.startsWith('http') ? value : `${API_BASE_URL}/${value}`}
                        alt="Proof"
                        style={{ height: '50px', borderRadius: '4px' }}
                    />
                </a>
            ),
            sortable: false
        },
        {
            key: 'status',
            label: 'Status',
            render: (value) => <span className="badge bg-warning text-dark">{value?.toUpperCase()}</span>
        }
    ];

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Pending Deal Approvals</h2>

            <DataTable
                data={requests}
                columns={columns}
                pageSize={10}
                searchable={true}
                sortable={true}
                actions={(row) => (
                    <div className="btn-group">
                        <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleAction(row._id, 'approved')}
                        >
                            <FaCheck /> Approve
                        </button>
                        <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleAction(row._id, 'rejected')}
                        >
                            <FaTimes /> Reject
                        </button>
                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(row._id)}
                            title="Delete Request"
                        >
                            <FaTrash />
                        </button>
                    </div>
                )}
            />
        </div>
    );
};

export default SubscriptionApprovals;

