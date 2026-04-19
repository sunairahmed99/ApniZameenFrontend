import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, reset } from '../../features/auth/authSlice';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const { name, email, password } = formData;

    const navigate = useNavigate();
    const useDispatchAction = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isSuccess) {
            navigate('/verify-email');
        }

        if (user) {
            navigate('/');
        }
    }, [user, isSuccess, navigate]);

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
        useDispatchAction(register(formData));
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow-sm border-0 p-4">
                        <h2 className="text-center mb-4" style={{ fontWeight: 'bold' }}>Register</h2>
                        {isError && (
                            <div className="alert alert-danger d-flex align-items-center" role="alert">
                                <div>{message}</div>
                            </div>
                        )}
                        <form onSubmit={onSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={name}
                                    onChange={onChange}
                                    required
                                />
                            </div>
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
                            <button type="submit" className="btn w-100" style={{ backgroundColor: '#000', color: '#fff', border: 'none' }} disabled={isLoading}>
                                {isLoading ? 'Registering...' : 'Register'}
                            </button>
                        </form>
                        <p className="mt-3 text-center">
                            Already have an account? <Link to="/login">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
