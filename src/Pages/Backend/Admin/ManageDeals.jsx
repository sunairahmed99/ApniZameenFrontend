import React, { useEffect, useState } from 'react';
import { useAdminDeals } from '../../../hooks/useAdminFinancials';
// import axios from 'axios'; // Removed
import { FaTrash, FaPlus, FaEdit } from 'react-icons/fa';
import DataTable from '../../../Components/Backend/Admin/DataTable.jsx';

const ManageDeals = () => {
    const { deals, isLoading, createDeal, updateDeal, deleteDeal } = useAdminDeals();
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        propertyLimit: '',
        durationDays: 30,
        planType: 'standard',
        description: ''
    });
    const [editId, setEditId] = useState(null);

    // useEffect removed

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await updateDeal({ id: editId, dealData: formData });
                alert('Deal updated successfully!');
            } else {
                await createDeal(formData);
                alert('Deal created successfully!');
            }
            setEditId(null);
            setFormData({ name: '', price: '', propertyLimit: '', durationDays: 30, planType: 'standard', description: '' });
        } catch (err) {
            
            const responseData = err.response?.data;
            let message = "Failed to create deal";

            if (responseData) {
                if (responseData.message) message = responseData.message;
                if (responseData.errors) {
                    const fieldErrors = Object.values(responseData.errors).map(e => e.message).join(", ");
                    message += " | Detail: " + fieldErrors;
                }
            } else {
                message = err.message;
            }

            alert('Error: ' + message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await deleteDeal(id);
        } catch (err) {
            alert('Failed to delete deal');
        }
    };

    const handleEdit = (deal) => {
        setEditId(deal._id);
        setFormData({
            name: deal.name,
            price: deal.price,
            propertyLimit: deal.propertyLimit,
            durationDays: deal.durationDays,
            planType: deal.planType,
            description: deal.description || ''
        });
        window.scrollTo(0, 0); // Scroll to form
    };

    const columns = [
        { key: 'name', label: 'Name' },
        {
            key: 'price',
            label: 'Price',
            render: (value) => `PKR ${value}`
        },
        {
            key: 'propertyLimit',
            label: 'Limit',
            render: (value) => `${value} Properties`
        },
        {
            key: 'durationDays',
            label: 'Duration',
            render: (value) => `${value} Days`
        },
        {
            key: 'planType',
            label: 'Type',
            render: (value) => {
                if (value === 'titanium') return <span className="badge" style={{ background: 'linear-gradient(45deg, #FFD700, #FFA500)', color: '#000' }}>Titanium</span>;
                return <span className="badge bg-secondary">Standard</span>;
            }
        },
        { key: 'description', label: 'Description' }
    ];

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Manage Deals / Packages</h2>
                <button className="btn btn-warning" onClick={async () => {
                    if (!window.confirm('Create default Standard and Titanium property plans?')) return;
                    try {
                        // Standard Plan
                        await createDeal({
                            name: 'Standard Listing Plan',
                            price: 1000,
                            propertyLimit: 5,
                            durationDays: 30,
                            planType: 'standard',
                            description: 'Post 5 standard properties. Visible in normal search results.'
                        });
                        // Titanium Plan
                        await createDeal({
                            name: 'Titanium Homepage Plan',
                            price: 15000,
                            propertyLimit: 2,
                            durationDays: 30,
                            planType: 'titanium',
                            description: 'Post 2 TITANIUM properties. Visible on Home Page main sliders with premium badge.'
                        });
                        alert('Default Property Plans Created!');
                    } catch (err) {
                        alert('Failed to create defaults');
                    }
                }}>
                    Initialize Defaults
                </button>
            </div>

            <div className="card mb-4">
                <div className={`card-header ${editId ? 'bg-warning text-dark' : 'bg-primary text-white'}`}>
                    {editId ? 'Edit Deal / Package' : 'Create New Deal'}
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label">Deal Name</label>
                            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Starter Pack" />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">Price (PKR)</label>
                            <input type="number" className="form-control" name="price" value={formData.price} onChange={handleChange} required placeholder="1000" />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">Property Limit</label>
                            <input type="number" className="form-control" name="propertyLimit" value={formData.propertyLimit} onChange={handleChange} required placeholder="2" />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">Duration (Days)</label>
                            <input type="number" className="form-control" name="durationDays" value={formData.durationDays} onChange={handleChange} required />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Plan Type</label>
                            <select className="form-select" name="planType" value={formData.planType} onChange={handleChange}>
                                <option value="standard">Standard (Normal Listing)</option>
                                <option value="titanium">Titanium (Home Page Sliders)</option>
                            </select>
                        </div>
                        <div className="col-md-12">
                            <label className="form-label">Description</label>
                            <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} rows="2"></textarea>
                        </div>
                        <div className="col-12 d-flex gap-2">
                            <button type="submit" className={`btn ${editId ? 'btn-warning' : 'btn-primary'}`}>
                                {editId ? 'Update Deal' : <><FaPlus /> Create Deal</>}
                            </button>
                            {editId && (
                                <button type="button" className="btn btn-secondary" onClick={() => {
                                    setEditId(null);
                                    setFormData({ name: '', price: '', propertyLimit: '', durationDays: 30, planType: 'standard', description: '' });
                                }}>Cancel Edit</button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            <DataTable
                data={deals}
                columns={columns}
                pageSize={10}
                searchable={true}
                sortable={true}
                actions={(row) => (
                    <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(row)}>
                            <FaEdit />
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row._id)}>
                            <FaTrash />
                        </button>
                    </div>
                )}
            />
        </div>
    );
};

export default ManageDeals;
