import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, reset } from '../../features/auth/authSlice';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

    const navigate = useNavigate();
    const useDispatchAction = useDispatch();

    const { user, isLoading, isError, isSuccess, message, otpRequired } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (otpRequired) {
            navigate('/verify-admin-otp');
        } else if (user) {
            if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'seller') navigate('/seller/dashboard');
            else navigate('/');
        }
    }, [user, navigate, otpRequired]);

    useEffect(() => {
        return () => {
            useDispatchAction(reset());
        }
    }, [useDispatchAction]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        useDispatchAction(login(formData));
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow-sm border-0 p-4">
                        <h2 className="text-center mb-4" style={{ fontWeight: 'bold' }}>Login</h2>
                        {isError && (
                            <div className="alert alert-danger d-flex align-items-center" role="alert">
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                <div>{message}</div>
                            </div>
                        )}
                        {isSuccess && !user && (
                            <div className="alert alert-success">Check your email for OTP</div>
                        )}
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
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    value={password}
                                    onChange={onChange}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn w-100"
                                style={{ backgroundColor: '#000', color: '#fff', border: 'none' }}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                        <div className="mt-3 text-center">
                            <Link to="/forgot-password">Forgot Password?</Link>
                        </div>
                        <p className="mt-3 text-center">
                            Don't have an account? <Link to="/register">Register</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
