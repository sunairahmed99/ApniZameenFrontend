import React, { useState, useEffect } from 'react';
import { useAdminAdRequests } from '../../../hooks/useAdminFinancials';
// import axios from 'axios'; // Removed
import { useSelector } from 'react-redux';
import { FaCheck, FaTimes, FaTrash, FaEye } from 'react-icons/fa';
import DataTable from '../../../Components/Backend/Admin/DataTable.jsx';

const AdminAdRequests = () => {
    const { user } = useSelector((state) => state.auth);
    const { requests, isLoading, reviewAdRequest, deleteAdRequest } = useAdminAdRequests(user?.token);

    // useEffect removed

    // fetchRequests removed

    const handleStatus = async (id, status) => {
        try {
            await reviewAdRequest({ token: user.token, id, status });
        } catch (err) {
            
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this request?")) return;
        try {
            await deleteAdRequest({ token: user.token, id });
        } catch (err) {
            
        }
    };

    const columns = [
        { key: 'seller.name', label: 'Seller', render: (_, row) => row.seller?.name || 'Unknown' },
        { key: 'title', label: 'Campaign Title', className: 'fw-bold' },
        { key: 'deal.name', label: 'Deal', render: (_, row) => row.deal?.name || 'N/A' },
        { key: 'amount', label: 'Amount', render: (v) => `Rs ${v?.toLocaleString()}` },
        {
            key: 'status', label: 'Status', render: (v) => (
                <span className={`badge bg-${v === 'approved' ? 'success' : v === 'rejected' ? 'danger' : 'warning text-dark'}`}>
                    {v.toUpperCase()}
                </span>
            )
        },
        { key: 'adImage', label: 'Creative', render: (v) => <a href={v} target="_blank" rel="noreferrer"><img src={v} style={{ width: '50px', height: '30px', objectFit: 'cover' }} /></a> },
        { key: 'paymentScreenshot', label: 'Receipt', render: (v) => <a href={v} target="_blank" rel="noreferrer"><FaEye /></a> },
    ];

    return (
        <div className="p-4">
            <h2 className="mb-4 text-white">Seller Advertisement Requests</h2>
            <DataTable
                data={requests}
                columns={columns}
                actionsWidth="20%"
                actions={(row) => (
                    <div className="d-flex gap-2">
                        {row.status === 'pending' && (
                            <>
                                <button className="btn btn-sm btn-success" onClick={() => handleStatus(row._id, 'approved')} title="Approve"><FaCheck /></button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleStatus(row._id, 'rejected')} title="Reject"><FaTimes /></button>
                            </>
                        )}
                        {row.status !== 'pending' && (
                            <button className="btn btn-sm btn-outline-secondary" onClick={() => handleStatus(row._id, 'pending')}>Reset</button>
                        )}
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(row._id)}><FaTrash /></button>
                    </div>
                )}
            />
        </div>
    );
};

export default AdminAdRequests;

