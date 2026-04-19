import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'; // Import ReactDOM
import { FaFacebook, FaGoogle, FaEnvelope, FaLock, FaUser, FaPhone, FaTimes, FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useGoogleLogin } from '@react-oauth/google';
import { useSelector, useDispatch } from 'react-redux';
import {
    login,
    register as registerAction,
    verifyEmail,
    resendVerification,
    googleLogin as googleLoginAction,
    verifyAdminOTP,
    forgotPassword,
    resetPassword,
    reset
} from '../../features/auth/authSlice';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
    const [view, setView] = useState('login'); // 'login', 'signup', 'forgot', 'verifyEmail', 'verifyOTP', 'resetPassword'
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const dispatch = useDispatch();
    const { user, isLoading, isError, isSuccess, message, otpRequired, tempEmail } = useSelector((state) => state.auth);

    const { register, handleSubmit, formState: { errors }, watch, reset: resetForm } = useForm();
    const password = watch("password", "");

    const [resendTimer, setResendTimer] = useState(10);
    const [resendAttempts, setResendAttempts] = useState(() => parseInt(localStorage.getItem('resendAttempts') || '0'));
    const [blockedUntil, setBlockedUntil] = useState(() => parseInt(localStorage.getItem('blockedUntil') || '0'));

    const loginWithGoogle = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            dispatch(googleLoginAction({ access_token: tokenResponse.access_token }));
        },
        onError: () => {
            
        }
    });

    useEffect(() => {
        resetForm();
        dispatch(reset());
    }, [view, resetForm, dispatch]);

    useEffect(() => {
        if (view === 'verifyEmail') {
            setResendTimer(10);
        }
    }, [view]);

    useEffect(() => {
        let interval;
        if (view === 'verifyEmail' && resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [view, resendTimer]);

    useEffect(() => {
        let blockInterval;
        if (blockedUntil && blockedUntil > Date.now()) {
            blockInterval = setInterval(() => {
                if (Date.now() >= blockedUntil) {
                    setBlockedUntil(0);
                    setResendAttempts(0);
                    localStorage.removeItem('blockedUntil');
                    localStorage.removeItem('resendAttempts');
                }
            }, 1000);
        } else if (blockedUntil && blockedUntil <= Date.now()) {
            setBlockedUntil(0);
            setResendAttempts(0);
            localStorage.removeItem('blockedUntil');
            localStorage.removeItem('resendAttempts');
        }
        return () => clearInterval(blockInterval);
    }, [blockedUntil]);

    useEffect(() => {
        if (!isOpen) {
            dispatch(reset());
        }
    }, [isOpen, dispatch]);

    useEffect(() => {
        if (isSuccess) {
            if (view === 'signup') {
                setView('verifyEmail');
                dispatch(reset());
            }
            if (view === 'forgot') {
                setView('resetPassword');
                dispatch(reset());
            }
            if (view === 'resetPassword') {
                setView('login');
                dispatch(reset());
            }
            if (view === 'verifyEmail' || view === 'verifyOTP') {
                onClose();
                dispatch(reset());
            }
        }

        if (otpRequired) {
            setView('verifyOTP');
        }

        if (user && !otpRequired) {
            onClose();
            dispatch(reset());
        }
    }, [user, isSuccess, otpRequired, view, onClose, dispatch]);

    if (!isOpen) return null;

    const onLoginSubmit = (data) => {
        dispatch(login(data));
    };

    const onSignupSubmit = (data) => {
        dispatch(registerAction(data));
    };

    const onVerifyEmailSubmit = (data) => {
        dispatch(verifyEmail({ email: tempEmail, code: data.code }));
    };

    const handleResend = () => {
        if (resendTimer > 0) return;
        if (blockedUntil && blockedUntil > Date.now()) return;

        const newAttempts = resendAttempts + 1;
        
        if (newAttempts >= 3) {
            const blockTime = Date.now() + 15 * 60 * 1000;
            setBlockedUntil(blockTime);
            setResendAttempts(newAttempts);
            localStorage.setItem('blockedUntil', blockTime.toString());
            localStorage.setItem('resendAttempts', newAttempts.toString());
        } else {
            setResendAttempts(newAttempts);
            localStorage.setItem('resendAttempts', newAttempts.toString());
            setResendTimer(10);
        }

        dispatch(resendVerification({ email: tempEmail }));
    };

    const onVerifyOTPSubmit = (data) => {
        dispatch(verifyAdminOTP({ email: tempEmail, code: data.code }));
    };

    const onForgotSubmit = (data) => {
        dispatch(forgotPassword(data));
    };

    const onResetPasswordSubmit = (data) => {
        dispatch(resetPassword({ email: tempEmail, code: data.code, password: data.password }));
    };

    // Use Portal to render outside of parent stacking contexts
    return ReactDOM.createPortal(
        <div className="auth-overlay" onClick={onClose}>
            <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
                <button className="auth-close" onClick={onClose}>
                    <FaTimes />
                </button>

                {(view !== 'login' && view !== 'verifyEmail' && view !== 'verifyOTP' && view !== 'resetPassword') && (
                    <button className="auth-back" onClick={() => setView('login')}>
                        <FaArrowLeft />
                    </button>
                )}

                <div className="auth-container">
                    {/* Header */}
                    <div className="text-center mb-4">
                        <h3 className="fw-bold">
                            {view === 'login' ? 'Login' :
                                view === 'signup' ? 'Sign Up' :
                                    view === 'forgot' ? 'Forgot Password' :
                                        view === 'verifyEmail' ? 'Verify Email' :
                                            view === 'verifyOTP' ? 'Verification Code' : 'Reset Password'}
                        </h3>
                        {message && isError && <div className="auth-error-msg">{message}</div>}
                    </div>

                    {/* Social Login Buttons - only for login/signup */}
                    {(view === 'login' || view === 'signup') && (
                        <>
                            <button type="button" className="social-btn google" onClick={() => loginWithGoogle()}>
                                <FaGoogle className="social-icon" /> Continue with Google
                            </button>
                            <div className="auth-divider">
                                <span>OR</span>
                            </div>
                        </>
                    )}

                    {view === 'login' ? (
                        /* Login Form */
                        <form className="auth-form" onSubmit={handleSubmit(onLoginSubmit)} noValidate>
                            <div className="input-group-auth">
                                <input
                                    type="email"
                                    placeholder="Email*"
                                    className={`auth-input ${errors.email ? 'is-invalid' : ''}`}
                                    {...register('email', { required: 'Email is required' })}
                                />
                                {errors.email && <small className="text-danger">{errors.email.message}</small>}
                            </div>
                            <div className="input-group-auth password-field-group">
                                <input
                                    type={showPass ? "text" : "password"}
                                    placeholder="Password*"
                                    className={`auth-input ${errors.password ? 'is-invalid' : ''}`}
                                    {...register('password', { required: 'Password is required' })}
                                />
                                <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                                    {showPass ? <FaEyeSlash /> : <FaEye />}
                                </button>
                                {errors.password && <small className="text-danger">{errors.password.message}</small>}
                            </div>

                            <button type="submit" className="submit-btn-auth" disabled={isLoading}>
                                {isLoading ? 'Logging In...' : 'Log In'}
                            </button>

                            <div className="auth-extras">
                                <label className="auth-checkbox-label">
                                    <input type="checkbox" {...register('rememberMe')} />
                                    <span>Remember Me</span>
                                </label>
                                <a href="#" className="forgot-link" onClick={(e) => { e.preventDefault(); setView('forgot'); }}>Forgot Password?</a>
                            </div>

                            <div className="auth-switch">
                                <span>ARE YOU NEW TO ZAMEEN?</span>
                                <button type="button" className="switch-btn" onClick={() => setView('signup')}>
                                    Sign Up
                                </button>
                            </div>
                        </form>
                    ) : view === 'signup' ? (
                        /* Signup Form */
                        <form className="auth-form" onSubmit={handleSubmit(onSignupSubmit)} noValidate>
                            <div className="input-group-auth">
                                <input
                                    type="text"
                                    placeholder="Name*"
                                    className={`auth-input ${errors.name ? 'is-invalid' : ''}`}
                                    {...register('name', { required: 'Name is required' })}
                                />
                                {errors.name && <small className="text-danger">{errors.name.message}</small>}
                            </div>
                            <div className="input-group-auth">
                                <input
                                    type="email"
                                    placeholder="Email*"
                                    className={`auth-input ${errors.email ? 'is-invalid' : ''}`}
                                    {...register('email', { required: 'Email is required' })}
                                />
                                {errors.email && <small className="text-danger">{errors.email.message}</small>}
                            </div>
                            <div className="input-group-auth password-field-group">
                                <input
                                    type={showPass ? "text" : "password"}
                                    placeholder="Password*"
                                    className={`auth-input ${errors.password ? 'is-invalid' : ''}`}
                                    {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })}
                                />
                                <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                                    {showPass ? <FaEyeSlash /> : <FaEye />}
                                </button>
                                {errors.password && <small className="text-danger">{errors.password.message}</small>}
                            </div>
                            <div className="input-group-auth password-field-group">
                                <input
                                    type={showConfirmPass ? "text" : "password"}
                                    placeholder="Confirm Password*"
                                    className={`auth-input ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                    {...register('confirmPassword', {
                                        required: 'Please confirm password',
                                        validate: value => value === password || "Passwords do not match"
                                    })}
                                />
                                <button type="button" className="pass-toggle" onClick={() => setShowConfirmPass(!showConfirmPass)}>
                                    {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
                                </button>
                                {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword.message}</small>}
                            </div>
                            <div className="phone-input-wrapper">
                                <span className="country-code">🇵🇰 +92</span>
                                <input
                                    type="text"
                                    placeholder="Phone"
                                    className="auth-input phone-field"
                                    {...register('phone')}
                                />
                            </div>

                            <div className="consent-section">
                                <label className="auth-checkbox-label">
                                    <input type="checkbox" {...register('marketing')} defaultChecked />
                                    <small>Yes, I'd like to receive marketing communication</small>
                                </label>
                                <label className="auth-checkbox-label">
                                    <input type="checkbox" {...register('terms', { required: true })} />
                                    <small>I agree to the <a href="#">Terms and Conditions</a></small>
                                </label>
                            </div>

                            <button type="submit" className="submit-btn-auth signup" disabled={isLoading}>
                                {isLoading ? 'Processing...' : 'Continue'}
                            </button>
                        </form>
                    ) : view === 'forgot' ? (
                        /* Forgot Password View */
                        <form className="auth-form" onSubmit={handleSubmit(onForgotSubmit)} noValidate>
                            <p className="text-muted small mb-3">Enter your email to receive a reset code.</p>
                            <div className="input-group-auth">
                                <input
                                    type="email"
                                    placeholder="Email*"
                                    className={`auth-input ${errors.email ? 'is-invalid' : ''}`}
                                    {...register('email', { required: 'Email is required' })}
                                />
                                {errors.email && <small className="text-danger">{errors.email.message}</small>}
                            </div>
                            <button type="submit" className="submit-btn-auth signup" disabled={isLoading}>
                                {isLoading ? 'Sending...' : 'Send Reset Code'}
                            </button>
                        </form>
                    ) : view === 'verifyEmail' || view === 'verifyOTP' ? (
                        /* Verification Views */
                        <form className="auth-form" onSubmit={handleSubmit(view === 'verifyEmail' ? onVerifyEmailSubmit : onVerifyOTPSubmit)} noValidate>
                            <p className="text-muted small mb-3">We've sent a 6-digit code to <b>{tempEmail}</b></p>
                            <div className="input-group-auth">
                                <input
                                    type="text"
                                    placeholder="6-digit Code*"
                                    className={`auth-input ${errors.code ? 'is-invalid' : ''}`}
                                    {...register('code', { required: 'Code is required', minLength: 6, maxLength: 6 })}
                                />
                                {errors.code && <small className="text-danger">{errors.code.message}</small>}
                            </div>
                            <button type="submit" className="submit-btn-auth signup" disabled={isLoading}>
                                {isLoading ? 'Verifying...' : 'Verify'}
                            </button>

                            {view === 'verifyEmail' && (
                                <div className="text-center mt-3">
                                    {blockedUntil && blockedUntil > Date.now() ? (
                                        <p className="text-danger small">
                                            Maximum attempts reached. Please try again after {Math.ceil((blockedUntil - Date.now()) / 60000)} minutes.
                                        </p>
                                    ) : (
                                        <p className="small mb-0 mt-2">
                                            Didn't receive the code?{' '}
                                            <button 
                                                type="button" 
                                                className="btn btn-link p-0 text-decoration-none" 
                                                onClick={handleResend}
                                                disabled={resendTimer > 0 || isLoading}
                                                style={{ border: 'none', background: 'none', color: '#007bff' }}
                                            >
                                                {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend Code'}
                                            </button>
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="text-center mt-3">
                                <button
                                    type="button"
                                    className="btn btn-link p-0 text-decoration-none small text-muted"
                                    onClick={() => {
                                        setView('login');
                                        dispatch(reset());
                                    }}
                                    style={{ border: 'none', background: 'none', fontSize: '14px' }}
                                >
                                    <FaArrowLeft style={{ fontSize: '12px', marginRight: '4px' }} /> Back to Login
                                </button>
                            </div>
                        </form>
                    ) : (
                        /* Reset Password View */
                        <form className="auth-form" onSubmit={handleSubmit(onResetPasswordSubmit)} noValidate>
                            <div className="input-group-auth">
                                <input
                                    type="text"
                                    placeholder="Reset Code*"
                                    className={`auth-input ${errors.code ? 'is-invalid' : ''}`}
                                    {...register('code', { required: 'Code is required' })}
                                />
                                {errors.code && <small className="text-danger">{errors.code.message}</small>}
                            </div>
                            <div className="input-group-auth password-field-group">
                                <input
                                    type={showPass ? "text" : "password"}
                                    placeholder="New Password*"
                                    className={`auth-input ${errors.password ? 'is-invalid' : ''}`}
                                    {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 chars' } })}
                                />
                                <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                                    {showPass ? <FaEyeSlash /> : <FaEye />}
                                </button>
                                {errors.password && <small className="text-danger">{errors.password.message}</small>}
                            </div>
                            <div className="input-group-auth password-field-group">
                                <input
                                    type={showConfirmPass ? "text" : "password"}
                                    placeholder="Confirm Password*"
                                    className={`auth-input ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                    {...register('confirmPassword', {
                                        required: 'Please confirm password',
                                        validate: value => value === password || "Passwords do not match"
                                    })}
                                />
                                <button type="button" className="pass-toggle" onClick={() => setShowConfirmPass(!showConfirmPass)}>
                                    {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
                                </button>
                                {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword.message}</small>}
                            </div>
                            <button type="submit" className="submit-btn-auth signup" disabled={isLoading}>
                                {isLoading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AuthModal;
