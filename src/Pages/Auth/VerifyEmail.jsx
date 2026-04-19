import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { verifyEmail, reset } from '../../features/auth/authSlice';

function VerifyEmail() {
    const [code, setCode] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message, tempEmail } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (user) {
            navigate('/');
        }

        if (isSuccess && user) {
            navigate('/');
        }

        // Don't reset if we need message to show error
    }, [user, isSuccess, navigate]);

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(verifyEmail({ email: tempEmail, code }));
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow-sm border-0 p-4">
                        <h2 className="text-center mb-4">Verify Email</h2>
                        <p className="text-center text-muted">Enter the 6-digit code sent to {tempEmail}</p>
                        {isError && <div className="alert alert-danger">{message}</div>}
                        <form onSubmit={onSubmit}>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control text-center fs-2"
                                    maxLength="6"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="000000"
                                    required
                                />
                            </div>
                            <button type="submit" className="btn w-100" style={{ backgroundColor: '#000', color: '#fff', border: 'none' }} disabled={isLoading}>
                                {isLoading ? 'Verifying...' : 'Verify'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VerifyEmail;
