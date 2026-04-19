import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useBanners } from '../../../hooks/useBanners';
import { FaCheck, FaTimes, FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import './BannerRequests.css';

import DataTable from '../../../Components/Backend/Admin/DataTable';

const BannerRequests = () => {
  const { bannerRequests: requests, isLoading: loading, updateRequestStatus, deleteRequest } = useBanners();
  const [message, setMessage] = useState(null);



  const handleStatusUpdate = async (id, status) => {
    try {
      updateRequestStatus({ id, status });
      setMessage({ type: 'success', text: `Request ${status} successfully` });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      
      setMessage({ type: 'error', text: 'Failed to update status' });
    }
  };

  const handleToggleStatus = (req) => {
    const newStatus = req.status === 'approved' ? 'pending' : 'approved';
    handleStatusUpdate(req._id, newStatus);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      deleteRequest(id);
      setMessage({ type: 'success', text: 'Request deleted successfully' });
    } catch (error) {
      
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to delete request' });
    }
  };

  const handleEdit = (req) => {
    // Placeholder for edit functionality
    alert(`Edit functionality for ${req.title} coming soon!`);
  };

  const columns = [
    { key: 'seller.name', label: 'Seller Name' },
    { key: 'seller._id', label: 'Seller ID', render: (val) => <small className="text-muted">{val || 'N/A'}</small> },
    { key: 'title', label: 'Banner Title' },
    {
      key: 'planId',
      label: 'Plan',
      render: (val) => val ? (
        <div>
          <strong>{val.name}</strong><br />
          <small className="text-muted">{val.durationInDays} Days</small>
        </div>
      ) : <span className="text-muted">Standard</span>
    },
    {
      key: 'bannerImage',
      label: 'Banner Image',
      sortable: false,
      render: (val) => val ? (
        <a href={val} target="_blank" rel="noopener noreferrer">
          <img src={val} alt="Banner" style={{ width: '80px', height: '45px', objectFit: 'cover', borderRadius: '4px' }} />
        </a>
      ) : 'No Image'
    },
    { key: 'startDate', label: 'Start Date', render: (val) => new Date(val).toLocaleDateString() },
    { key: 'endDate', label: 'End Date', render: (val) => new Date(val).toLocaleDateString() },
    { key: 'amount', label: 'Amount', render: (val) => `Rs ${val || 2000}` },
    {
      key: 'paymentScreenshot',
      label: 'Payment Picture',
      sortable: false,
      render: (val) => val ? (
        <a href={val} target="_blank" rel="noopener noreferrer">
          <img src={val} alt="Receipt" style={{ width: '80px', height: '45px', objectFit: 'cover', borderRadius: '4px' }} />
        </a>
      ) : <span className="text-danger">No Receipt</span>
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
    {
      key: '_id',
      label: 'Status Toggle',
      sortable: false,
      render: (_, row) => (
        <button
          className={`btn btn-sm ${row.status === 'approved' ? 'btn-warning' : 'btn-success'}`}
          onClick={() => handleToggleStatus(row)}
          title={row.status === 'approved' ? 'Set to Pending' : 'Approve'}
        >
          {row.status === 'approved' ? 'Revoke' : 'Approve'}
        </button>
      )
    }
  ];

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="banner-requests-container">
      <h2 className="mb-4">Seller Banner Requests</h2>

      {message && <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>{message.text}</div>}

      <div className="card shadow-sm border-0">
        <DataTable
          data={requests}
          columns={columns}
          actions={(row) => (
            <div className="d-flex gap-2">
              <button className="btn btn-primary btn-sm" onClick={() => handleEdit(row)} title="Edit"><FaEdit /></button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row._id)} title="Delete"><FaTrash /></button>
            </div>
          )}
          showIndex={true}
          pageSize={10}
        />
      </div>
    </div>
  );
};

export default BannerRequests;
