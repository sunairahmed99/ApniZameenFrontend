import React, { useState, useEffect } from 'react';
import { useAdminAdDeals } from '../../../hooks/useAdminFinancials';
// import axios from 'axios'; // Removed
import { useSelector } from 'react-redux';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import DataTable from '../../../Components/Backend/Admin/DataTable.jsx';

const AdminAdDeals = () => {
    const { user } = useSelector((state) => state.auth);
    const { deals, isLoading, createAdDeal, updateAdDeal, deleteAdDeal } = useAdminAdDeals(user?.token);

    // const [deals, setDeals] = useState([]); // Removed
    const [showForm, setShowForm] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        durationInDays: '',
        description: '',
        isActive: true
    });

    // useEffect removed

    // fetchDeals removed

    const handleEdit = (deal) => {
        setFormData({
            name: deal.name,
            price: deal.price,
            durationInDays: deal.durationInDays,
            description: deal.description || '',
            isActive: deal.isActive
        });
        setEditId(deal._id);
        setIsEdit(true);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this advertisement deal?")) return;
        try {
            await deleteAdDeal({ token: user.token, id });
        } catch (err) {
            
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await updateAdDeal({ token: user.token, id: editId, dealData: formData });
            } else {
                await createAdDeal({ token: user.token, dealData: formData });
            }
            setShowForm(false);
            setFormData({ name: '', price: '', durationInDays: '', description: '', isActive: true });
            setIsEdit(false);
        } catch (err) {
            
        }
    };

    const columns = [
        { key: 'name', label: 'Name', className: 'fw-bold' },
        { key: 'price', label: 'Price (PKR)', render: (v) => `Rs ${v.toLocaleString()}` },
        { key: 'durationInDays', label: 'Duration', render: (v) => `${v} Days` },
        { key: 'isActive', label: 'Status', render: (v) => <span className={`badge bg-${v ? 'success' : 'secondary'}`}>{v ? 'Active' : 'Inactive'}</span> },
    ];

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4 text-white">
                <h2>Advertisement Deals Management</h2>
                <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setIsEdit(false); setFormData({ name: '', price: '', durationInDays: '', description: '', isActive: true }); }}>
                    {showForm ? 'Cancel' : <><FaPlus className="me-2" /> Create Ad Deal</>}
                </button>
            </div>

            {showForm && (
                <div className="card shadow-sm mb-4 border-0">
                    <div className="card-body p-4 bg-light rounded text-dark">
                        <h4 className="mb-3">{isEdit ? 'Edit Ad Deal' : 'New Ad Deal'}</h4>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Deal Name</label>
                                    <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Price (PKR)</label>
                                    <input type="number" className="form-control" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Duration (Days)</label>
                                    <input type="number" className="form-control" value={formData.durationInDays} onChange={e => setFormData({ ...formData, durationInDays: e.target.value })} required />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea className="form-control" rows="2" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                            </div>
                            <div className="form-check mb-4">
                                <input type="checkbox" className="form-check-input" id="isActive" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} />
                                <label className="form-check-label" htmlFor="isActive">Mark as Active</label>
                            </div>
                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-success px-4">Save Deal</button>
                                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowForm(false)}>Discard</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <DataTable
                data={deals}
                columns={columns}
                actions={(row) => (
                    <>
                        <button className="btn btn-sm btn-outline-info me-2" onClick={() => handleEdit(row)}><FaEdit /></button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(row._id)}><FaTrash /></button>
                    </>
                )}
            />
        </div>
    );
};

export default AdminAdDeals;

