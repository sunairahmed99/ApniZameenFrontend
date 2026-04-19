import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useAgencyPlans } from '../../../../hooks/useAdminFinancials';
import './AdminPlans.css';

import DataTable from '../../../../Components/Backend/Admin/DataTable.jsx';

const AdminPlans = () => {
    const { plans, isLoading: loading, createPlan, updatePlan, deletePlan } = useAgencyPlans();
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        durationInDays: '',
        description: '',
        isActive: true
    });
    const [isEdit, setIsEdit] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await updatePlan({ id: currentId, planData: formData });
            } else {
                await createPlan(formData);
            }
            resetForm();
        } catch (err) {
            
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete plan?')) return;
        try {
            await deletePlan(id);
        } catch (err) {  }
    };

    const handleEdit = (plan) => {
        setFormData({
            name: plan.name,
            price: plan.price,
            durationInDays: plan.durationInDays,
            description: plan.description,
            isActive: plan.isActive
        });
        setIsEdit(true);
        setCurrentId(plan._id);
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({ name: '', price: '', durationInDays: '', description: '', isActive: true });
        setShowForm(false);
        setIsEdit(false);
        setCurrentId(null);
    };

    const columns = [
        { key: 'name', label: 'Name', className: 'fw-bold' },
        { key: 'price', label: 'Price (PKR)', render: (val) => `Rs ${Number(val).toLocaleString()}` },
        { key: 'durationInDays', label: 'Days', render: (val) => `${val} Days` },
        {
            key: 'isActive',
            label: 'Status',
            render: (val) => (
                <span className={`badge bg-${val ? 'success' : 'secondary'}`}>
                    {val ? 'Active' : 'Inactive'}
                </span>
            )
        }
    ];

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Featured Plans Management</h2>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : <><FaPlus className="me-2" /> Create New Plan</>}
                </button>
            </div>

            {showForm && (
                <div className="card p-4 mb-4 shadow-sm">
                    <h4 className="mb-3">{isEdit ? 'Edit Plan' : 'Create New Plan'}</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Plan Name</label>
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
                            <textarea className="form-control" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows="2"></textarea>
                        </div>
                        <div className="form-check mb-3">
                            <input type="checkbox" className="form-check-input" id="isActive" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} />
                            <label className="form-check-label" htmlFor="isActive">Active</label>
                        </div>
                        <button type="submit" className="btn btn-success me-2">Save</button>
                        <button type="button" className="btn btn-secondary" onClick={resetForm}>Discard</button>
                    </form>
                </div>
            )}

            <div className="card shadow-sm border-0">
                <DataTable
                    data={plans}
                    columns={columns}
                    showIndex={true}
                    pageSize={10}
                    actions={(row) => (
                        <div className="d-flex gap-2 justify-content-end">
                            <button className="btn btn-sm btn-outline-info" onClick={() => handleEdit(row)} title="Edit"><FaEdit /></button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(row._id)} title="Delete"><FaTrash /></button>
                        </div>
                    )}
                />
            </div>
        </div>
    );
};

export default AdminPlans;
