import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { verifyAdminOTP, reset } from '../../features/auth/authSlice';

function VerifyAdminOTP() {
    const [code, setCode] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message, tempEmail, otpRequired } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (!otpRequired && !user) {
            navigate('/login');
        }
        if (user && user.role === 'admin') {
            navigate('/admin');
        }
    }, [user, navigate, otpRequired]);

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(verifyAdminOTP({ email: tempEmail, code }));
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow-sm border-0 p-4">
                        <h2 className="text-center mb-4">Admin Verification</h2>
                        <p className="text-center text-muted">Enter the OTP sent to your admin email</p>
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
                                {isLoading ? 'Verifying...' : 'Verify OTP'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VerifyAdminOTP;
