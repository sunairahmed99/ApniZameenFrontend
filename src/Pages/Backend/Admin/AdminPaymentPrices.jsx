import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAdminPaymentPrices } from '../../../hooks/useAdminFinancials';
// import axios from 'axios'; // Removed
import { FaTrash, FaEdit, FaPlus, FaSave, FaTimes } from 'react-icons/fa';

import DataTable from '../../../Components/Backend/Admin/DataTable.jsx';

const AdminPaymentPrices = () => {
    const { user } = useSelector((state) => state.auth);
    const token = user?.token;

    const { prices, isLoading, createPrice, updatePrice, deletePrice } = useAdminPaymentPrices(token);

    const [formData, setFormData] = useState({
        paymentType: 'Banner',
        price: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false); // Local loading for submit
    const [error, setError] = useState('');

    // useEffect removed
    // fetchPrices removed

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');


        try {
            if (editingId) {
                await updatePrice({ token, id: editingId, data: formData });
                alert('Price updated successfully');
            } else {
                await createPrice({ token, data: formData });
                alert('Price added successfully');
            }
            setFormData({
                paymentType: 'Banner',
                price: '',
                date: new Date().toISOString().split('T')[0],
                description: ''
            });
            setEditingId(null);
            // fetchPrices auto handled
        } catch (error) {
            
            setError(error.response?.data?.message || 'Failed to save price');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setFormData({
            paymentType: item.paymentType,
            price: item.price,
            date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
            description: item.description || ''
        });
        setEditingId(item._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this price record?')) return;
        try {
            await deletePrice({ token, id });
        } catch (error) {
            
            alert('Failed to delete price');
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({
            paymentType: 'Banner',
            price: '',
            date: new Date().toISOString().split('T')[0],
            description: ''
        });
    };

    const columns = [
        { key: 'date', label: 'Date', render: (val) => val ? new Date(val).toLocaleDateString() : 'N/A' },
        { key: 'paymentType', label: 'Payment Type', className: 'fw-bold' },
        {
            key: 'price',
            label: 'Price (PKR)',
            className: 'text-primary fw-bold',
            render: (val) => `${Number(val).toLocaleString()} PKR`
        },
        { key: 'description', label: 'Description', render: (val) => val || <span className="text-muted small">N/A</span> }
    ];

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Admin: Payment Price Management</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card shadow-sm mb-4">
                <div className="card-header bg-primary text-white d-flex align-items-center">
                    {editingId ? <><FaEdit className="me-2" /> Edit Payment Price</> : <><FaPlus className="me-2" /> Add New Payment Price</>}
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Payment Type</label>
                                <select
                                    className="form-select"
                                    name="paymentType"
                                    value={formData.paymentType}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="Banner">Banner</option>
                                    <option value="Agency">Agency</option>
                                    <option value="Property">Property</option>
                                </select>
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Price (PKR)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    placeholder="5000"
                                    required
                                />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label className="form-label">Description (Optional)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Details..."
                                />
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-success" disabled={loading}>
                                {editingId ? <><FaSave className="me-1" /> Update</> : <><FaPlus className="me-1" /> Add Record</>}
                            </button>
                            {editingId && (
                                <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                                    <FaTimes className="me-1" /> Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-header bg-light">
                    <h5 className="mb-0">Price Records Table</h5>
                </div>
                <div className="card-body p-0">
                    <DataTable
                        data={prices}
                        columns={columns}
                        showIndex={true}
                        pageSize={10}
                        actions={(row) => (
                            <div className="d-flex gap-2 justify-content-end">
                                <button
                                    className="btn btn-sm btn-outline-info"
                                    onClick={() => handleEdit(row)}
                                    title="Edit"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleDelete(row._id)}
                                    title="Delete"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        )}
                        emptyMessage="No records found."
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminPaymentPrices;
