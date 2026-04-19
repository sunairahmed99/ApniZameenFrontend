import React, { useState } from 'react';
import { usePaymentInfo } from '../../../hooks/useAdminFinancials';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import DataTable from '../../../Components/Backend/Admin/DataTable.jsx';

const PriceListing = () => {
    const { info: instructions, isLoading, create, update, remove } = usePaymentInfo();
    const [text, setText] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingId) {
                await update({ id: editingId, text });
                alert('Instruction updated successfully');
            } else {
                await create(text);
                alert('Instruction added successfully');
            }
            setText('');
            setEditingId(null);
        } catch (error) {
            
            alert('Failed to save instruction');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (item) => {
        setText(item.text);
        setEditingId(item._id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this instruction?')) return;
        try {
            await remove(id);
        } catch (error) {
            
            alert('Failed to delete instruction');
        }
    };

    const columns = [
        { key: 'text', label: 'Instruction' }
    ];

    return (
        <div className="container mt-4">
            <h2>Price Listing / Payment Instructions</h2>
            <div className="card shadow-sm mb-4">
                <div className="card-header bg-primary text-white">
                    {editingId ? 'Edit Instruction' : 'Add New Instruction'}
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Instruction Text</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="e.g. Pay the subscription amount to Easypaisa: 36347843"
                                required
                            />
                        </div>
                        <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                                {isSubmitting ? 'Saving...' : (editingId ? <><FaEdit /> Update</> : <><FaPlus /> Add</>)}
                            </button>
                            {editingId && (
                                <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(null); setText(''); }}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-header bg-light">Existing Instructions</div>
                <div className="card-body p-0">
                    <DataTable
                        data={instructions}
                        columns={columns}
                        showIndex={true}
                        pageSize={10}
                        actions={(row) => (
                            <div className="d-flex gap-2 justify-content-end">
                                <button className="btn btn-sm btn-info text-white" onClick={() => handleEdit(row)}>
                                    <FaEdit />
                                </button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(row._id)}>
                                    <FaTrash />
                                </button>
                            </div>
                        )}
                        emptyMessage="No instructions found."
                    />
                </div>
            </div>
        </div>
    );
};

export default PriceListing;
