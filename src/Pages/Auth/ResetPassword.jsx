import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetPassword, reset as resetAuth } from '../../features/auth/authSlice';

function ResetPassword() {
    const [formData, setFormData] = useState({
        email: '',
        code: '',
        password: '',
    });

    const { email, code, password } = formData;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isSuccess && message.includes('successful')) {
            setTimeout(() => navigate('/login'), 2000);
        }
        return () => dispatch(resetAuth());
    }, [isSuccess, message, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(resetPassword(formData));
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow-sm border-0 p-4">
                        <h2 className="text-center mb-4">Reset Password</h2>
                        {isSuccess && <div className="alert alert-success">{message}. Redirecting to login...</div>}
                        {isError && <div className="alert alert-danger">{message}</div>}
                        <form onSubmit={onSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={email}
                                    onChange={onChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Reset Code</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="code"
                                    value={code}
                                    onChange={onChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">New Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    value={password}
                                    onChange={onChange}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn w-100" style={{ backgroundColor: '#000', color: '#fff', border: 'none' }} disabled={isLoading}>
                                {isLoading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
