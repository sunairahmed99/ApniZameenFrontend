import React, { useState, useEffect } from 'react';
import { useInquiries } from '../../../hooks/useInquiries';
// import axios from 'axios'; // Removed
import { FaTrash, FaEnvelope, FaPhone, FaSearch } from 'react-icons/fa';

import DataTable from '../../../Components/Backend/Admin/DataTable.jsx';

const Inquiries = () => {
    const { data: inquiries = [], isLoading: loading } = useInquiries();

    const columns = [
        {
            key: 'date',
            label: 'Date',
            render: (val) => (
                <div className="text-secondary small">
                    {new Date(val).toLocaleDateString()} <br />
                    {new Date(val).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            )
        },
        { key: 'name', label: 'Name', className: 'fw-bold' },
        {
            key: 'phone',
            label: 'Contact',
            render: (_, row) => (
                <div className="d-flex flex-column small">
                    <span><FaPhone className="me-1 text-success" /> {row.phone}</span>
                    {row.email && <span><FaEnvelope className="me-1 text-primary" /> {row.email}</span>}
                </div>
            )
        },
        { key: 'projectId.name', label: 'Project' },
        {
            key: 'message',
            label: 'Message',
            render: (val) => (
                <div className="text-truncate" style={{ maxWidth: '250px' }} title={val}>
                    {val || '-'}
                </div>
            )
        }
    ];

    return (
        <div className="p-4">
            <h2 className="mb-4">Project Inquiries</h2>

            <div className="card shadow-sm border-0">
                <DataTable
                    data={inquiries}
                    columns={columns}
                    loading={loading}
                    showIndex={true}
                    pageSize={10}
                    emptyMessage="No inquiries found."
                />
            </div>
        </div>
    );
};

export default Inquiries;
