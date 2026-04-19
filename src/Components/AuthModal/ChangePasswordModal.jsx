import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { changePassword, reset } from '../../features/auth/authSlice';
import './AuthModal.css'; // Reusing styles
import { FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';

const ChangePasswordModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.auth);

    // React Hook Form setup
    const { register, handleSubmit, reset: resetForm, watch, formState: { errors } } = useForm();
    const newPassword = watch('newPassword');

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [localError, setLocalError] = useState('');
    const [localSuccess, setLocalSuccess] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            resetForm();
            setLocalError('');
            setLocalSuccess(false);
            dispatch(reset());
        }
    }, [isOpen, resetForm, dispatch]);


    const onSubmit = (data) => {
        setLocalError('');

        dispatch(changePassword({ oldPassword: data.oldPassword, newPassword: data.newPassword }))
            .unwrap()
            .then(() => {
                setLocalSuccess(true);
                setTimeout(() => {
                    setLocalSuccess(false);
                    onClose();
                }, 1500);
            })
            .catch((err) => {
                setLocalError(err || 'Failed to change password');
            });
    };

    if (!isOpen) return null;

    return (
        <div className="auth-overlay" onClick={onClose}>
            <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
                <button className="auth-close" onClick={onClose}><FaTimes /></button>

                <h2 style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>Change Password</h2>

                {localError && <div className="auth-error-msg">{localError}</div>}
                {localSuccess && <div className="auth-error-msg" style={{ backgroundColor: '#d4edda', color: '#155724', borderColor: '#c3e6cb' }}>Password Changed!</div>}


                <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="auth-input-group password-field-group">
                        <label style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Old Password</label>
                        <input
                            type={showOldPassword ? "text" : "password"}
                            className={`auth-input ${errors.oldPassword ? 'input-error' : ''}`}
                            placeholder="Enter old password"
                            {...register('oldPassword', { required: 'Old password is required' })}
                        />
                        <button type="button" className="pass-toggle" onClick={() => setShowOldPassword(!showOldPassword)} style={{ top: '32px' }}>
                            {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        {errors.oldPassword && <span className="error-text">{errors.oldPassword.message}</span>}
                    </div>

                    <div className="auth-input-group password-field-group">
                        <label style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>New Password</label>
                        <input
                            type={showNewPassword ? "text" : "password"}
                            className={`auth-input ${errors.newPassword ? 'input-error' : ''}`}
                            placeholder="Enter new password"
                            {...register('newPassword', {
                                required: 'New password is required',
                                minLength: { value: 6, message: 'Password must be at least 6 characters' }
                            })}
                        />
                        <button type="button" className="pass-toggle" onClick={() => setShowNewPassword(!showNewPassword)} style={{ top: '32px' }}>
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        {errors.newPassword && <span className="error-text">{errors.newPassword.message}</span>}
                    </div>

                    <div className="auth-input-group password-field-group">
                        <label style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Confirm New Password</label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            className={`auth-input ${errors.confirmNewPassword ? 'input-error' : ''}`}
                            placeholder="Confirm new password"
                            {...register('confirmNewPassword', {
                                required: 'Please confirm your password',
                                validate: (val) => {
                                    if (watch('newPassword') != val) {
                                        return "Your passwords do no match";
                                    }
                                },
                            })}
                        />
                        <button type="button" className="pass-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ top: '32px' }}>
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        {errors.confirmNewPassword && <span className="error-text">{errors.confirmNewPassword.message}</span>}
                    </div>

                    <button type="submit" className="submit-btn-auth" disabled={isLoading}>
                        {isLoading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
