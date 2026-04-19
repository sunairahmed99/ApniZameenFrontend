import React, { useEffect, useState } from 'react';
import { useApprovedSubscriptions } from '../../../hooks/useAdminFinancials';
import { useSelector } from 'react-redux';
// import axios from 'axios'; // Removed
import { FaTrash, FaTimes } from 'react-icons/fa';
import DataTable from '../../../Components/Backend/Admin/DataTable.jsx';
import { API_BASE_URL } from '../../../config';

const ApprovedSubscriptions = () => {
    const { user } = useSelector((state) => state.auth);
    const { subscriptions, isLoading, revertToPending, deleteSubscription } = useApprovedSubscriptions(user?.token);

    // useEffect removed
    // fetchApprovedRequests removed

    const handleDisapprove = async (id) => {
        if (!window.confirm('Are you sure you want to DISAPPROVE this request? It will return to pending status.')) return;
        try {
            await revertToPending(id);
        } catch (err) {
            alert('Failed to disapprove');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to DELETE this request record permanently?')) return;
        try {
            await deleteSubscription(id);
        } catch (err) {
            alert('Failed to delete');
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
                    <small>{value?.propertyLimit} Props</small>
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
            label: 'Proof',
            render: (value) => (
                <a href={value?.startsWith('http') ? value : `${API_BASE_URL}/${value}`} target="_blank" rel="noopener noreferrer">
                    <img
                        src={value?.startsWith('http') ? value : `${API_BASE_URL}/${value}`}
                        alt="Proof"
                        style={{ height: '40px', borderRadius: '4px' }}
                    />
                </a>
            ),
            sortable: false
        },
        {
            key: 'status',
            label: 'Status',
            render: () => <span className="badge bg-success">Approved</span>,
            sortable: false
        }
    ];

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Approved Deals</h2>

            <DataTable
                data={subscriptions}
                columns={columns}
                pageSize={10}
                searchable={true}
                sortable={true}
                actions={(row) => (
                    <div className="btn-group">
                        <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => handleDisapprove(row._id)}
                            title="Disapprove / Reject"
                        >
                            <FaTimes /> Disapprove
                        </button>
                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(row._id)}
                            title="Delete Record"
                        >
                            <FaTrash />
                        </button>
                    </div>
                )}
            />
        </div>
    );
};

export default ApprovedSubscriptions;

