import React from 'react';
import { createPortal } from 'react-dom';
import { FaTimes, FaPhone, FaMobileAlt, FaEnvelope, FaCopy } from 'react-icons/fa';

const ContactModal = ({ isOpen, onClose, seller, property, agency }) => {
    if (!isOpen) return null;

    // Use seller phone or fallback to property whatsapp number
    const phoneNumber = seller?.phone || property?.whatsapp || property?.phone || null;
    const emailAddress = seller?.email || property?.email || null;

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    return createPortal(
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ zIndex: 1050, backgroundColor: 'rgba(0,0,0,0.6)' }}>
            <div className="bg-white rounded shadow-lg p-4 position-relative" style={{ width: '90%', maxWidth: '400px', transform: 'translateZ(0)' }}>
                <button
                    onClick={onClose}
                    className="btn btn-sm position-absolute top-0 end-0 m-2 text-secondary hover-dark"
                    style={{ fontSize: '1.2rem', border: 'none', background: 'none' }}
                    aria-label="Close contact modal"
                >
                    <FaTimes />
                </button>

                <h4 className="text-center fw-bold mb-1">Contact Us</h4>
                <div className="text-center mb-4">
                    <p className="mb-0 fw-semibold">{seller?.name || "Private Seller"}</p>
                    {agency && <p className="mb-0 text-muted small">{agency}</p>}
                </div>

                <div className="mb-3">
                    <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-2">
                        <div className="d-flex align-items-center gap-3">
                            <FaMobileAlt size={24} className="text-success" />
                            <div>
                                <div className="text-muted small">Mobile</div>
                                <div className="fw-bold text-dark">{phoneNumber || "Not Available"}</div>
                            </div>
                        </div>
                        {phoneNumber && (
                            <button className="btn btn-outline-success btn-sm d-flex align-items-center gap-1 py-1" onClick={() => copyToClipboard(phoneNumber)}>
                                <FaCopy /> Copy
                            </button>
                        )}
                    </div>

                    {phoneNumber && (
                        <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-2">
                            <div className="d-flex align-items-center gap-3">
                                <FaPhone size={24} className="text-success" />
                                <div>
                                    <div className="text-muted small">Phone</div>
                                    <div className="fw-bold text-dark">{phoneNumber}</div>
                                </div>
                            </div>
                            <button className="btn btn-outline-success btn-sm d-flex align-items-center gap-1 py-1" onClick={() => copyToClipboard(phoneNumber)}>
                                <FaCopy /> Copy
                            </button>
                        </div>
                    )}

                    {emailAddress && (
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-3">
                                <FaEnvelope size={24} className="text-primary" />
                                <div>
                                    <div className="text-muted small">Email</div>
                                    <div className="fw-bold text-dark" style={{ fontSize: '13px' }}>{emailAddress}</div>
                                </div>
                            </div>
                            <button className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1 py-1" onClick={() => copyToClipboard(emailAddress)}>
                                <FaCopy /> Copy
                            </button>
                        </div>
                    )}
                </div>

                <hr className="text-muted opacity-25" />

                <div className="text-center">
                    <p className="mb-1 text-muted small">Please quote property reference</p>
                    <h6 className="fw-bold text-dark mb-0">Zameen - ID: {property?._id || "N/A"}</h6>
                    <p className="small text-muted mb-0 mt-1">when calling us.</p>
                </div>

                <style>{`
                    .hover-dark:hover { color: #212529 !important; transition: transform 0.2s; transform: rotate(90deg); }
                `}</style>
            </div>
        </div>,
        document.body
    );
};

export default ContactModal;
