import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile, getMe, reset } from '../../features/auth/authSlice';
import './AuthModal.css'; // Reusing styles
import { FaTimes } from 'react-icons/fa';

const EditProfileModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { user, isLoading } = useSelector((state) => state.auth);

    // React Hook Form setup
    const { register, handleSubmit, reset: resetForm, formState: { errors }, setValue } = useForm({
        defaultValues: {
            name: '',
            phone: '',
            email: ''
        }
    });

    useEffect(() => {
        if (isOpen) {
            dispatch(getMe());
        }
    }, [isOpen, dispatch]);

    useEffect(() => {
        if (isOpen && user) {
            // Reset form with user data when modal opens and user data is available
            resetForm({
                name: user.name || '',
                phone: user.phone || user.phoneNumber || '', // Handle both potential field names
                email: user.email || ''
            });
        }
    }, [isOpen, user, resetForm]);

    // Handle success via local state to close modal
    const [localSuccess, setLocalSuccess] = useState(false);
    const [localError, setLocalError] = useState('');

    const onSubmit = (data) => {
        setLocalError('');

        dispatch(updateProfile({ name: data.name, phone: data.phone }))
            .unwrap()
            .then(() => {
                setLocalSuccess(true);
                setTimeout(() => {
                    setLocalSuccess(false);
                    onClose();
                }, 1000);
            })
            .catch((err) => {
                // If err is a string (rejectedValue), use it. Otherwise use a fallback.
                const message = typeof err === 'string' ? err : (err.message || 'Failed to update profile');
                setLocalError(message);
            });
    };

    if (!isOpen) return null;

    return (
        <div className="auth-overlay" onClick={onClose}>
            <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
                <button className="auth-close" onClick={onClose}><FaTimes /></button>

                <h2 style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>Edit Profile</h2>

                {localError && <div className="auth-error-msg">{localError}</div>}
                {localSuccess && <div className="auth-error-msg" style={{ backgroundColor: '#d4edda', color: '#155724', borderColor: '#c3e6cb' }}>Profile Updated!</div>}

                <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="auth-input-group">
                        <label style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Name</label>
                        <input
                            type="text"
                            className={`auth-input ${errors.name ? 'input-error' : ''}`}
                            placeholder="Enter your name"
                            {...register('name', { required: 'Name is required' })}
                        />
                        {errors.name && <span className="error-text">{errors.name.message}</span>}
                    </div>

                    <div className="auth-input-group">
                        <label style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Phone</label>
                        <input
                            type="text"
                            className={`auth-input ${errors.phone ? 'input-error' : ''}`}
                            placeholder="Enter your phone number"
                            {...register('phone', { required: 'Phone number is required' })}
                        />
                        {errors.phone && <span className="error-text">{errors.phone.message}</span>}
                    </div>

                    <div className="auth-input-group">
                        <label style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Email (Cannot be changed)</label>
                        <input
                            type="email"
                            className="auth-input"
                            disabled
                            style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
                            {...register('email')}
                        />
                    </div>

                    <button type="submit" className="submit-btn-auth" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
