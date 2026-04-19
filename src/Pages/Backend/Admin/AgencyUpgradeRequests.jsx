import React, { useState, useEffect } from 'react';
import { useAgencyUpgradeRequests } from '../../../hooks/useAgencyManagement';
// import axios from 'axios'; // Removed
import { FaCheck, FaTimes, FaEye, FaTrash } from 'react-icons/fa';

import DataTable from '../../../Components/Backend/Admin/DataTable.jsx';

const AgencyUpgradeRequests = () => {
    const { requests, isLoading: loading, approveRequest, rejectRequest, deleteRequest } = useAgencyUpgradeRequests();
    const [message, setMessage] = useState(null);

    const handleApprove = async (id) => {
        if (!window.confirm('Approve this request?')) return;
        try {
            await approveRequest(id);
            setMessage({ type: 'success', text: 'Request Approved Successfully' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Approval failed' });
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm('Mark this request as Denied/Rejected?')) return;
        try {
            await rejectRequest(id);
            setMessage({ type: 'warning', text: 'Request Denied' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Action failed' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to PERMANENTLY DELETE this request?')) return;
        try {
            await deleteRequest(id);
            setMessage({ type: 'success', text: 'Record Deleted Successfully' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Delete failed' });
        }
    };

    const columns = [
        {
            key: 'agencyId.name',
            label: 'Agency',
            render: (val, row) => (
                <div className="d-flex align-items-center">
                    {row.agencyId?.logo && <img src={row.agencyId.logo} alt="logo" className="rounded-circle me-2" style={{ width: 30, height: 30 }} />}
                    <span className="fw-bold">{val || 'Unknown Agency'}</span>
                </div>
            )
        },
        {
            key: 'planId.name',
            label: 'Plan',
            render: (val, row) => val ? `${val} (${row.planId?.durationInDays} days)` : 'N/A'
        },
        { key: 'planId.price', label: 'Cost', render: (val) => val ? `Rs ${val}` : 'N/A' },
        {
            key: 'paymentImage',
            label: 'Payment Proof',
            sortable: false,
            render: (val) => val ? (
                <a href={val} target="_blank" rel="noopener noreferrer">
                    <img
                        src={val}
                        alt="Proof"
                        style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #dee2e6' }}
                        title="Click to view full image"
                    />
                </a>
            ) : <span className="text-muted">No Image</span>
        },
        { key: 'createdAt', label: 'Requested On', render: (val) => new Date(val).toLocaleDateString() },
        {
            key: 'status',
            label: 'Status',
            render: (val) => (
                <span className={`badge bg-${val === 'approved' ? 'success' : val === 'rejected' ? 'danger' : 'warning text-dark'}`}>
                    {val?.toUpperCase()}
                </span>
            )
        }
    ];

    return (
        <div className="p-4">
            <h2 className="mb-4">Agency Upgrade Requests</h2>
            {message && <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'}`}>{message.text}</div>}

            <div className="card shadow-sm border-0">
                <DataTable
                    data={requests}
                    columns={columns}
                    loading={loading}
                    showIndex={true}
                    pageSize={10}
                    actions={(row) => (
                        <div className="d-flex gap-2 justify-content-end">
                            {row.status === 'pending' && (
                                <button className="btn btn-sm btn-success" onClick={() => handleApprove(row._id)} title="Approve">
                                    <FaCheck />
                                </button>
                            )}
                            {row.status !== 'rejected' && (
                                <button className="btn btn-sm btn-warning text-dark" onClick={() => handleReject(row._id)} title="Deny Request">
                                    <FaTimes />
                                </button>
                            )}
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(row._id)} title="Delete Record">
                                <FaTrash />
                            </button>
                        </div>
                    )}
                    emptyMessage="No pending requests found."
                />
            </div>
        </div>
    );
};

export default AgencyUpgradeRequests;
