import React, { useState, useEffect } from 'react';
import { useAgencyPlans } from '../../../hooks/useAgencyManagement';
// import axios from 'axios'; // Removed
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';

import DataTable from '../../../Components/Backend/Admin/DataTable.jsx';

const AgencyPlans = () => {
    const { plans, isLoading: loading, createPlan, updatePlan, deletePlan } = useAgencyPlans();
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        durationInDays: '',
        description: ''
    });
    const [editId, setEditId] = useState(null);
    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await updatePlan({ id: editId, planData: formData });
                setMessage({ type: 'success', text: 'Plan updated successfully' });
            } else {
                await createPlan(formData);
                setMessage({ type: 'success', text: 'Plan created successfully' });
            }
            setShowForm(false);
            setEditId(null);
            setFormData({ name: '', price: '', durationInDays: '', description: '' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Operation failed' });
        }
    };

    const handleEdit = (plan) => {
        setFormData({
            name: plan.name,
            price: plan.price,
            durationInDays: plan.durationInDays,
            description: plan.description
        });
        setEditId(plan._id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await deletePlan(id);
        } catch (err) {
            alert('Failed to delete');
        }
    };

    const columns = [
        { key: 'name', label: 'Name', className: 'fw-bold' },
        { key: 'price', label: 'Price (Rs)', render: (val) => `Rs ${Number(val).toLocaleString()}` },
        { key: 'durationInDays', label: 'Duration', render: (val) => `${val} Days` },
        { key: 'description', label: 'Description' },
        {
            key: 'isActive',
            label: 'Status',
            render: (val, row) => (
                <span className={`badge bg-${val || true ? 'success' : 'secondary'}`}>
                    {val || true ? 'Active' : 'Inactive'}
                </span>
            )
        }
    ];

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Agency Featured Plans</h2>
                <div>
                    <button className="btn btn-secondary me-2" onClick={async () => {
                        if (!window.confirm('Create default Featured and Titanium plans?')) return;
                        try {
                            // Crate Featured Plan
                            await createPlan({
                                name: 'Featured Plan',
                                price: 2000,
                                durationInDays: 7,
                                description: 'Get your agency featured on the top list for 7 days.'
                            });
                            // Create Titanium Plan
                            await createPlan({
                                name: 'Titanium Plan',
                                price: 5000,
                                durationInDays: 30,
                                description: 'Maximum visibility with Titanium badge for 30 days.'
                            });
                            setMessage({ type: 'success', text: 'Default plans created!' });
                        } catch (err) {
                            setMessage({ type: 'error', text: 'Failed to create defaults.' });
                        }
                    }}>
                        Initialize Defaults
                    </button>
                    <button className="btn btn-primary" onClick={() => {
                        setShowForm(!showForm);
                        setEditId(null);
                        setFormData({ name: '', price: '', durationInDays: '', description: '' });
                    }}>
                        {showForm ? 'Cancel' : <><FaPlus className="me-2" /> Create Plan</>}
                    </button>
                </div>
            </div>

            {message && <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'}`}>{message.text}</div>}

            {
                showForm && (
                    <div className="card p-4 mb-4 shadow-sm">
                        <h4>{editId ? 'Edit Plan' : 'Create New Plan'}</h4>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Plan Name</label>
                                    <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Price (Rs)</label>
                                    <input type="number" className="form-control" name="price" value={formData.price} onChange={handleChange} required />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Duration (Days)</label>
                                    <input type="number" className="form-control" name="durationInDays" value={formData.durationInDays} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} rows="2"></textarea>
                            </div>
                            <button type="submit" className="btn btn-success me-2">{editId ? 'Update' : 'Save'}</button>
                        </form>
                    </div>
                )
            }

            <div className="card shadow-sm border-0">
                <DataTable
                    data={plans}
                    columns={columns}
                    loading={loading}
                    showIndex={true}
                    pageSize={10}
                    actions={(row) => (
                        <div className="d-flex gap-2 justify-content-end">
                            <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(row)} title="Edit"><FaEdit /></button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(row._id)} title="Delete"><FaTrash /></button>
                        </div>
                    )}
                />
            </div>
        </div >
    );
};

export default AgencyPlans;
