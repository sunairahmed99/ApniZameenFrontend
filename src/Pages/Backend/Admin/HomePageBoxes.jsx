import React, { useEffect, useState } from 'react';
import { useHomePageBoxes } from '../../../hooks/useHomePageBoxes';
import { FaEdit, FaTrash, FaPlus, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import HomePageBoxForm from './HomePageBoxForm';
import './HomePageBoxes.css'; // We'll create a basic CSS file or reuse existing styles

const HomePageBoxes = () => {
    const { boxes, isLoading, isError, error, deleteBox, updateBox } = useHomePageBoxes();

    const [showForm, setShowForm] = useState(false);
    const [currentBox, setCurrentBox] = useState(null);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this box?')) {
            deleteBox(id);
        }
    };

    const handleToggleActive = (box) => {
        updateBox({
            id: box._id,
            boxData: { ...box, isActive: !box.isActive }
        });
    };

    const handleEdit = (box) => {
        setCurrentBox(box);
        setShowForm(true);
    };

    const handleCreate = () => {
        setCurrentBox(null);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setCurrentBox(null);
    };

    return (
        <div className="homepage-boxes-container p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Home Page Boxes</h2>
                {!showForm && (
                    <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleCreate}>
                        <FaPlus /> Create New Box
                    </button>
                )}
            </div>

            {showForm ? (
                <HomePageBoxForm currentBox={currentBox} onClose={handleCloseForm} />
            ) : (
                <div className="table-responsive bg-white rounded shadow-sm p-3">
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : isError ? (
                        <p className="text-danger">{error?.message || 'Something went wrong'}</p>
                    ) : (
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Order</th>
                                    <th>Title</th>
                                    <th>Key</th>
                                    <th>Sections</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {boxes.map((box) => (
                                    <tr key={box._id}>
                                        <td>{box.order}</td>
                                        <td>{box.title}</td>
                                        <td><code>{box.boxKey}</code></td>
                                        <td>{box.sections?.length || 0}</td>
                                        <td>
                                            <button
                                                className={`btn btn-sm ${box.isActive ? 'btn-success' : 'btn-secondary'} d-flex align-items-center gap-1`}
                                                onClick={() => handleToggleActive(box)}
                                            >
                                                {box.isActive ? <FaToggleOn /> : <FaToggleOff />}
                                                {box.isActive ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <button className="btn btn-sm btn-info text-white" onClick={() => handleEdit(box)}>
                                                    <FaEdit />
                                                </button>
                                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(box._id)}>
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {boxes.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4">No boxes found. Create one to get started.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default HomePageBoxes;
