import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSiteSettings, useUpdateSettings } from '../../../hooks/useSettings';
import { FaSave, FaPlus, FaTrash, FaBuilding, FaPhone, FaEnvelope, FaClock, FaShareAlt } from 'react-icons/fa';

const SiteSettings = () => {
    const { user } = useSelector((state) => state.auth);
    const { data: settings, isLoading } = useSiteSettings();
    const updateSettingsMutation = useUpdateSettings();

    const [formData, setFormData] = useState({
        contactNumber: '',
        email: '',
        timings: '',
        branches: [],
        socialLinks: { facebook: '', instagram: '', youtube: '', linkedin: '', twitter: '' }
    });

    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (settings) {
            setFormData({
                contactNumber: settings.contactNumber || '',
                email: settings.email || '',
                timings: settings.timings || '',
                branches: settings.branches || [],
                socialLinks: settings.socialLinks || { facebook: '', instagram: '', youtube: '', linkedin: '', twitter: '' }
            });
        }
    }, [settings]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSocialChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            socialLinks: { ...prev.socialLinks, [name]: value }
        }));
    };

    // Branch Handlers
    const addBranch = () => {
        setFormData(prev => ({
            ...prev,
            branches: [...prev.branches, { title: '', addressLines: [''] }]
        }));
    };

    const removeBranch = (index) => {
        setFormData(prev => {
            const updated = [...prev.branches];
            updated.splice(index, 1);
            return { ...prev, branches: updated };
        });
    };

    const updateBranchTitle = (index, value) => {
        setFormData(prev => {
            const updated = [...prev.branches];
            updated[index].title = value;
            return { ...prev, branches: updated };
        });
    };

    const addAddressLine = (branchIndex) => {
        setFormData(prev => {
            const updated = [...prev.branches];
            updated[branchIndex].addressLines.push('');
            return { ...prev, branches: updated };
        });
    };

    const removeAddressLine = (branchIndex, lineIndex) => {
        setFormData(prev => {
            const updated = [...prev.branches];
            updated[branchIndex].addressLines.splice(lineIndex, 1);
            return { ...prev, branches: updated };
        });
    };

    const updateAddressLine = (branchIndex, lineIndex, value) => {
        setFormData(prev => {
            const updated = [...prev.branches];
            updated[branchIndex].addressLines[lineIndex] = value;
            return { ...prev, branches: updated };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        try {
            await updateSettingsMutation.mutateAsync({ token: user.token, formData });
            setMessage({ type: 'success', text: 'Site settings updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update settings.' });
        }
    };

    if (isLoading) return <div className="p-4 text-center">Loading settings...</div>;

    return (
        <div className="p-2 p-md-4">
            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                <h4 className="mb-0 text-dark fw-bold">Site Settings</h4>
            </div>

            {message && (
                <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="row g-4">
                    {/* General Contact Info */}
                    <div className="col-12 col-xl-6">
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white fw-bold d-flex align-items-center">
                                <FaPhone className="me-2 text-primary" /> Contact Details
                            </div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <label className="form-label text-muted small fw-bold">Contact Number</label>
                                    <input type="text" className="form-control" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-muted small fw-bold">Email Address</label>
                                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-muted small fw-bold">Timings</label>
                                    <input type="text" className="form-control" name="timings" placeholder="e.g. Monday To Sunday 9AM To 6PM" value={formData.timings} onChange={handleChange} required />
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="card border-0 shadow-sm mt-4">
                            <div className="card-header bg-white fw-bold d-flex align-items-center">
                                <FaShareAlt className="me-2 text-primary" /> Social Links
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    {['facebook', 'instagram', 'youtube', 'linkedin', 'twitter'].map(platform => (
                                        <div className="col-12" key={platform}>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light text-capitalize" style={{ width: '100px' }}>{platform}</span>
                                                <input type="url" className="form-control" name={platform} value={formData.socialLinks[platform] || ''} onChange={handleSocialChange} placeholder={`https://${platform}.com/...`} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Branches */}
                    <div className="col-12 col-xl-6">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-white fw-bold d-flex align-items-center justify-content-between">
                                <div><FaBuilding className="me-2 text-primary" /> Head Office / Branches</div>
                                <button type="button" className="btn btn-sm btn-outline-primary" onClick={addBranch}>
                                    <FaPlus className="me-1" /> Add Branch
                                </button>
                            </div>
                            <div className="card-body">
                                {formData.branches.length === 0 && <p className="text-muted small">No branches added yet.</p>}
                                
                                {formData.branches.map((branch, bIndex) => (
                                    <div key={bIndex} className="border rounded p-3 mb-3 bg-light">
                                        <div className="d-flex justify-content-between mb-2">
                                            <input 
                                                type="text" 
                                                className="form-control form-control-sm fw-bold w-75" 
                                                placeholder="Branch Title (e.g. Head Office)" 
                                                value={branch.title} 
                                                onChange={(e) => updateBranchTitle(bIndex, e.target.value)} 
                                                required 
                                            />
                                            <button type="button" className="btn btn-sm btn-danger px-2" onClick={() => removeBranch(bIndex)} title="Remove Branch">
                                                <FaTrash />
                                            </button>
                                        </div>
                                        
                                        <label className="form-label text-muted small fw-bold mt-2">Address Lines</label>
                                        {branch.addressLines.map((line, lIndex) => (
                                            <div className="input-group input-group-sm mb-2" key={lIndex}>
                                                <input 
                                                    type="text" 
                                                    className="form-control" 
                                                    placeholder="Address Line" 
                                                    value={line} 
                                                    onChange={(e) => updateAddressLine(bIndex, lIndex, e.target.value)} 
                                                    required 
                                                />
                                                <button type="button" className="btn btn-outline-secondary" onClick={() => removeAddressLine(bIndex, lIndex)}>
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        ))}
                                        <button type="button" className="btn btn-sm btn-link text-decoration-none p-0 mt-1" onClick={() => addAddressLine(bIndex)}>
                                            + Add Line
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 text-end">
                    <button type="submit" className="btn btn-primary px-5 py-2 fw-bold shadow-sm" disabled={updateSettingsMutation.isPending}>
                        {updateSettingsMutation.isPending ? 'Saving...' : <><FaSave className="me-2" /> Save Settings</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SiteSettings;
