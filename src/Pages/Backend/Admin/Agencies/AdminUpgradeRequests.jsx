import React, { useState } from 'react';
import { FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import { useAdminUpgradeRequests, useApproveUpgradeRequest, useRejectUpgradeRequest } from '../../../../hooks/useAgencies';

import DataTable from '../../../../Components/Backend/Admin/DataTable.jsx';

const AdminUpgradeRequests = () => {
    const { data: requests = [], isLoading: loading } = useAdminUpgradeRequests();
    const approveMutation = useApproveUpgradeRequest();
    const rejectMutation = useRejectUpgradeRequest();

    const handleApprove = async (id) => {
        if (!window.confirm("Approve this payment and feature the agency?")) return;
        try {
            await approveMutation.mutateAsync(id);
        } catch (err) {  }
    };

    const handleReject = async (id) => {
        if (!window.confirm("Reject this request?")) return;
        try {
            await rejectMutation.mutateAsync(id);
        } catch (err) {  }
    };

    const columns = [
        {
            key: 'agencyId.name',
            label: 'Agency',
            render: (val, row) => (
                <div className="d-flex align-items-center">
                    <img src={row.agencyId?.logo || "https://placehold.co/40"} style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 10 }} />
                    <span>{val || 'Unknown Agency'}</span>
                </div>
            )
        },
        {
            key: 'planId.name',
            label: 'Plan',
            render: (val, row) => val ? `${val} (${row.planId?.durationInDays} days)` : 'N/A'
        },
        { key: 'planId.price', label: 'Amount', render: (val) => val ? `Rs ${val}` : 'N/A' },
        {
            key: 'paymentImage',
            label: 'Proof',
            sortable: false,
            render: (val) => val ? (
                <a href={val} target="_blank" rel="noopener noreferrer">
                    <img src={val} style={{ width: 60, height: 35, objectFit: 'cover', borderRadius: 4 }} />
                </a>
            ) : 'No Proof'
        },
        {
            key: 'status',
            label: 'Status',
            render: (val) => (
                <span className={`badge ${val === 'approved' ? 'bg-success' : val === 'rejected' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                    {val.toUpperCase()}
                </span>
            )
        },
        { key: 'createdAt', label: 'Date', render: (val) => new Date(val).toLocaleDateString() }
    ];

    return (
        <div className="p-4">
            <h2 className="mb-4">Featured Agency Requests</h2>
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
                                <>
                                    <button className="btn btn-sm btn-success" onClick={() => handleApprove(row._id)} title="Approve">
                                        <FaCheck />
                                    </button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleReject(row._id)} title="Reject">
                                        <FaTimes />
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                    emptyMessage="No requests found."
                />
            </div>
        </div>
    );
};

export default AdminUpgradeRequests;
