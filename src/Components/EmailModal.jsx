import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCreateInquiry } from '../hooks/useInquiries';
import { FaTimes, FaPhone, FaEnvelope, FaCheckCircle, FaPaperPlane } from 'react-icons/fa';

const EmailModal = ({ isOpen, onClose, property }) => {
    const [isSuccess, setIsSuccess] = useState(false);
    const createInquiryMutation = useCreateInquiry();

    // Reset success state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setIsSuccess(false);
        }
    }, [isOpen]);

    // Auto close after success
    useEffect(() => {
        let timer;
        if (isSuccess) {
            timer = setTimeout(() => {
                onClose();
            }, 3000); // Close after 3 seconds
        }
        return () => clearTimeout(timer);
    }, [isSuccess, onClose]);

    if (!isOpen) return null;

    const seller = property?.sellerId;
    const agencyName = seller?.companyName || "Zameen Agency";
    const agentName = seller?.name || "Property Agent";
    const propertyId = property?._id || "N/A";

    const loading = createInquiryMutation.isPending;

    // Pre-filled message
    const defaultMessage = `I would like to inquire about your property Zameen - ID${propertyId}. Please contact me at your earliest convenience.`;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const payload = {
            propertyId: property._id,
            sellerId: seller._id || seller,
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            message: formData.get('message'),
            userType: formData.get('userType') // Buyer/Agent/Other
        };

        try {
            await createInquiryMutation.mutateAsync(payload);
            setIsSuccess(true);
        } catch (err) {
            
            alert("Error sending message.");
        }
    };

    return createPortal(
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ zIndex: 1060, backgroundColor: 'rgba(0,0,0,0.6)' }}>
            <div className="bg-white rounded-4 shadow-lg position-relative d-flex flex-column overflow-hidden" style={{ width: '95%', maxWidth: '450px', maxHeight: '95vh', transform: 'translateZ(0)', willChange: 'transform, opacity' }}>

                {/* Success View */}
                {isSuccess ? (
                    <div className="p-5 text-center d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '400px', animation: 'fadeIn 0.5s ease-out' }}>
                        <div className="success-icon-wrapper mb-4" style={{ animation: 'scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                            <FaCheckCircle size={80} color="#198754" />
                        </div>
                        <h2 className="fw-bold text-dark mb-2">Email Sent!</h2>
                        <p className="text-muted mb-4">Your inquiry has been successfully sent to the agent. They will contact you shortly.</p>
                        <button onClick={onClose} className="btn btn-success px-4 py-2 rounded-pill fw-bold shadow-sm">
                            Got it, thanks!
                        </button>
                        <div className="mt-4 small text-muted">Closing automatically in 3 seconds...</div>

                        <style>{`
                            @keyframes scaleIn {
                                from { transform: scale(0); opacity: 0; }
                                to { transform: scale(1); opacity: 1; }
                            }
                            @keyframes fadeIn {
                                from { opacity: 0; transform: translateY(10px); }
                                to { opacity: 1; transform: translateY(0); }
                            }
                        `}</style>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-white">
                            <h5 className="mb-0 fw-bold text-dark">Contact Agent</h5>
                            <button onClick={onClose} className="btn border-0 p-1 text-secondary hover-dark" style={{ fontSize: '1.2rem' }}>
                                <FaTimes />
                            </button>
                        </div>

                        <div className="overflow-auto p-4 custom-scrollbar">
                            {/* Agent Details */}
                            <div className="d-flex align-items-center mb-4 p-3 bg-light rounded-3">
                                <div className="avatar me-3 bg-success text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '48px', height: '48px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                    {agentName ? agentName.charAt(0) : 'A'}
                                </div>
                                <div className="text-start">
                                    <div className="text-muted small mb-0">{agencyName}</div>
                                    <div className="fw-bold text-dark">{agentName}</div>
                                    <div className="text-muted small" style={{ fontSize: '11px' }}>Property ID: {propertyId}</div>
                                </div>
                            </div>

                            {/* Call Action */}
                            <div
                                className="d-flex align-items-center justify-content-center gap-2 bg-success text-white rounded-3 py-3 mb-4 shadow-sm"
                                style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                                onClick={() => alert(`Call: ${seller?.phone || 'Not Available'}`)}
                                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <FaPhone size={20} style={{ transform: 'scaleX(-1)' }} />
                                <span className="fw-bold">Call Agent Now</span>
                            </div>

                            {/* Divider with Text */}
                            <div className="position-relative text-center mb-4">
                                <hr className="text-muted opacity-25" />
                                <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small fw-bold">OR SEND EMAIL</span>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="text-start">
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted mb-1 text-uppercase ls-1">Name*</label>
                                    <input type="text" name="name" required className="form-control border-light shadow-none focus-success py-2" placeholder="Your name" />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted mb-1 text-uppercase ls-1">Email*</label>
                                    <input type="email" name="email" required className="form-control border-light shadow-none focus-success py-2" placeholder="your@email.com" />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted mb-1 text-uppercase ls-1">Phone*</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-light text-muted small">+92</span>
                                        <input type="number" name="phone" required className="form-control border-light shadow-none focus-success py-2" placeholder="3001234567" />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted mb-1 text-uppercase ls-1">Message*</label>
                                    <textarea
                                        name="message"
                                        required
                                        className="form-control border-light shadow-none focus-success py-2"
                                        rows="3"
                                        defaultValue={defaultMessage}
                                    ></textarea>
                                </div>

                                {/* Radio Buttons */}
                                <div className="mb-4">
                                    <label className="form-label small fw-bold text-muted mb-2 text-uppercase ls-1">I am a:</label>
                                    <div className="d-flex gap-3">
                                        {['Buyer', 'Agent', 'Other'].map((type) => (
                                            <div key={type} className="form-check custom-check">
                                                <input className="form-check-input" type="radio" name="userType" id={type.toLowerCase()} value={type} defaultChecked={type === 'Buyer'} />
                                                <label className="form-check-label small" htmlFor={type.toLowerCase()}>{type}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-success w-100 fw-bold py-3 d-flex align-items-center justify-content-center gap-2 rounded-3 shadow-sm border-0"
                                    style={{ transition: 'all 0.3s' }}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaPaperPlane />
                                            <span>SEND EMAIL INQUIRY</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </>
                )}

                <style>{`
                    .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: #19875433; border-radius: 10px; }
                    .ls-1 { letter-spacing: 0.5px; }
                    .focus-success:focus { border-color: #198754; box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.1); }
                    .custom-check .form-check-input:checked { background-color: #198754; border-color: #198754; }
                    .hover-dark:hover { color: #212529 !important; transform: rotate(90deg); transition: all 0.2s; }
                `}</style>
            </div>
        </div>,
        document.body
    );
};

export default EmailModal;
