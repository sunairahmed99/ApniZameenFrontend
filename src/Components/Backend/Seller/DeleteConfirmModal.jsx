import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import './DeleteConfirmModal.css';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="delete-modal-overlay">
            <div className="delete-modal-content">
                <div className="delete-modal-header">
                    <div className="warning-icon-wrapper">
                        <FaExclamationTriangle className="warning-icon" />
                    </div>
                </div>
                <div className="delete-modal-body">
                    <h3>{title || 'Confirm Deletion'}</h3>
                    <p>{message || 'Are you sure you want to delete this item? This action cannot be undone.'}</p>
                </div>
                <div className="delete-modal-footer">
                    <button className="btn-cancel" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn-delete" onClick={onConfirm}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
