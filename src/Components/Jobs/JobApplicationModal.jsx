import React, { useState } from 'react';
import { FaTimes, FaCloudUploadAlt, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { useApplyForJob } from '../../hooks/useJobApplications';
import './JobApplicationModal.css';

const JobApplicationModal = ({ isOpen, onClose, job }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        coverLetter: ''
    });
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState('');

    const applyMutation = useApplyForJob();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 5 * 1024 * 1024) {
                alert('File size exceeds 5MB limit');
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            alert('Please upload your CV');
            return;
        }

        setStatus('loading');
        const submitData = new FormData();
        submitData.append('job', job._id);
        submitData.append('name', formData.name);
        submitData.append('email', formData.email);
        submitData.append('phone', formData.phone);
        submitData.append('coverLetter', formData.coverLetter);
        submitData.append('cv', file);

        try {
            await applyMutation.mutateAsync(submitData);
            setStatus('success');
            setTimeout(() => {
                onClose();
                setStatus('idle');
                setFormData({ name: '', email: '', phone: '', coverLetter: '' });
                setFile(null);
            }, 3000);
        } catch (error) {
            setStatus('error');
            setErrorMessage(error.response?.data?.message || 'Something went wrong. Please try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="job-app-modal-overlay">
            <div className="job-app-modal-content animate-slide-up">
                <button className="close-btn" onClick={onClose}><FaTimes /></button>
                
                {status === 'success' ? (
                    <div className="success-view text-center">
                        <FaCheckCircle className="success-icon" />
                        <h2>Application Submitted!</h2>
                        <p>Thank you for applying for the <strong>{job?.title}</strong> position. Our team will review your application and get back to you soon.</p>
                    </div>
                ) : (
                    <>
                        <div className="modal-header">
                            <h2>Apply for {job?.title}</h2>
                            <p className="job-location">{job?.location} • {job?.department}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="job-app-form">
                            <div className="form-group">
                                <label>Full Name *</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    placeholder="Enter your full name" 
                                    required 
                                />
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Email Address *</label>
                                        <input 
                                            type="email" 
                                            name="email" 
                                            value={formData.email} 
                                            onChange={handleChange} 
                                            placeholder="your@email.com" 
                                            required 
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Phone Number *</label>
                                        <input 
                                            type="tel" 
                                            name="phone" 
                                            value={formData.phone} 
                                            onChange={handleChange} 
                                            placeholder="+92 3XX XXXXXXX" 
                                            required 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Upload CV (PDF, DOC, DOCX) *</label>
                                <div className={`file-upload-area ${file ? 'has-file' : ''}`}>
                                    <input 
                                        type="file" 
                                        id="cv-upload" 
                                        accept=".pdf,.doc,.docx" 
                                        onChange={handleFileChange} 
                                    />
                                    <label htmlFor="cv-upload">
                                        <FaCloudUploadAlt />
                                        <span>{file ? file.name : 'Select or drag your CV here'}</span>
                                    </label>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Cover Letter (Optional)</label>
                                <textarea 
                                    name="coverLetter" 
                                    value={formData.coverLetter} 
                                    onChange={handleChange} 
                                    rows="4" 
                                    placeholder="Tell us why you are a good fit..."
                                ></textarea>
                            </div>

                            {status === 'error' && <div className="error-alert">{errorMessage}</div>}

                            <button 
                                type="submit" 
                                className="submit-btn" 
                                disabled={status === 'loading'}
                            >
                                {status === 'loading' ? <><FaSpinner className="spin" /> Processing...</> : 'Submit Application'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default JobApplicationModal;
