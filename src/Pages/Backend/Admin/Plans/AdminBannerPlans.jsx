import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useBanners } from '../../../../hooks/useBanners';
import DataTable from '../../../../Components/Backend/Admin/DataTable.jsx';

const AdminBannerPlans = () => {
    const {
        bannerPlans: plans = [],
        isLoadingPlans: loading,
        createPlan,
        updatePlan,
        deletePlan
    } = useBanners();

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
        { key: 'name', label: 'Name', className: 'fw-bold', width: '20%' },
        {
            key: 'price',
            label: 'Price',
            render: (value) => `Rs ${value.toLocaleString()}`,
            width: '20%'
        },
        {
            key: 'durationInDays',
            label: 'Days',
            render: (value) => `${value} Days`,
            width: '20%'
        },
        {
            key: 'isActive',
            label: 'Status',
            render: (value) => (
                <span className={`badge bg-${value ? 'success' : 'secondary'}`}>
                    {value ? 'Active' : 'Inactive'}
                </span>
            ),
            width: '20%'
        }
    ];

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Banner Plans Management</h2>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : <><FaPlus className="me-2" /> Create New Plan</>}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded bg-light shadow-sm text-dark" style={{ color: '#000' }}>
                    <h4 className="mb-3">{isEdit ? 'Edit Plan' : 'Create New Plan'}</h4>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Plan Name</label>
                            <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required placeholder="e.g. Weekly Highlight" />
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
                        <textarea className="form-control" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows="2" placeholder="Briefly describe the plan features"></textarea>
                    </div>
                    <div className="form-check mb-3">
                        <input type="checkbox" className="form-check-input" id="isActive" checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} />
                        <label className="form-check-label" htmlFor="isActive">Mark as Active</label>
                    </div>
                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-success px-4">Save Plan</button>
                        <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>Discard</button>
                    </div>
                </form>
            )}

            <DataTable
                data={plans}
                columns={columns}
                pageSize={10}
                searchable={true}
                sortable={true}
                actionsWidth="20%"
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

export default AdminBannerPlans;
