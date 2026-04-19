import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'warning' }) => {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✓';
            case 'danger':
                return '⚠';
            case 'info':
                return 'ℹ';
            default:
                return '?';
        }
    };

    const getIconClass = () => {
        switch (type) {
            case 'success':
                return 'icon-success';
            case 'danger':
                return 'icon-danger';
            case 'info':
                return 'icon-info';
            default:
                return 'icon-warning';
        }
    };

    return (
        <div className="confirm-modal-overlay" onClick={onClose}>
            <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className={`confirm-modal-icon ${getIconClass()}`}>
                    {getIcon()}
                </div>
                <h3 className="confirm-modal-title">{title}</h3>
                <p className="confirm-modal-message">{message}</p>
                <div className="confirm-modal-actions">
                    <button className="btn-cancel" onClick={onClose}>
                        {cancelText}
                    </button>
                    <button className="btn-confirm" onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
