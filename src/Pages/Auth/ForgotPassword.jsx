import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { forgotPassword, reset as resetAuth } from '../../features/auth/authSlice';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const dispatch = useDispatch();

    const { isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isSuccess && message.includes('Reset code')) {
            setSent(true);
        }
        return () => dispatch(resetAuth());
    }, [isSuccess, message, dispatch]);

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(forgotPassword({ email }));
    };

    if (sent) {
        return (
            <div className="container py-5 text-center">
                <div className="alert alert-success">
                    <h4>Check your email</h4>
                    <p>A reset code has been sent to {email}. Use it to reset your password.</p>
                    <a href="/reset-password" name="email" value={email} className="btn btn-primary">Go to Reset Page</a>
                </div>
            </div>
        )
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow-sm border-0 p-4">
                        <h2 className="text-center mb-4">Forgot Password</h2>
                        {isError && <div className="alert alert-danger">{message}</div>}
                        <form onSubmit={onSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn w-100" style={{ backgroundColor: '#000', color: '#fff', border: 'none' }} disabled={isLoading}>
                                {isLoading ? 'Sending...' : 'Send Reset Code'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
