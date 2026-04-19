import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCreateAgency } from '../../../hooks/useAgencies';

const pakistanCities = [
    'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
    'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
    'Hyderabad', 'Bahawalpur', 'Sargodha', 'Abbottabad', 'Sukkur',
    'Larkana', 'Sheikhupura', 'Jhang', 'Gujrat', 'Mardan',
    'Kasur', 'Rahim Yar Khan', 'Sahiwal', 'Okara', 'Wah Cantonment',
    'Dera Ghazi Khan', 'Mirpur Khas', 'Nawabshah', 'Mingora', 'Chiniot',
    'Jhelum', 'Kamoke', 'Hafizabad', 'Sadiqabad', 'Burewala',
    'Jacobabad', 'Shikarpur', 'Muridke', 'Khanewal', 'Pakpattan',
    'Muzaffarabad', 'Mirpur', 'Kotli', 'Bhimber', 'Rawalakot'
];

const CreateAgency = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const createAgencyMutation = useCreateAgency();
    const loading = createAgencyMutation.isPending;

    const [formData, setFormData] = useState({
        name: '',
        city: 'Karachi',
        phone: '',
        email: '',
        description: '',
    });

    const [logoFile, setLogoFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.name === 'logo') setLogoFile(e.target.files[0]);
        else if (e.target.name === 'image') setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please login to create an agency");
            return;
        }

        const data = new FormData();
        data.append('name', formData.name);
        data.append('city', formData.city);
        data.append('phone', formData.phone);
        data.append('email', formData.email);
        data.append('description', formData.description);
        if (logoFile) data.append('logo', logoFile);
        if (imageFile) data.append('image', imageFile);

        try {
            await createAgencyMutation.mutateAsync({
                agencyData: data,
                token: user.token
            });
            alert('Agency Created Successfully! It will be reviewed by admin.');
            navigate('/seller/agencies');
        } catch (err) {
            
            alert(err.response?.data?.message || 'An error occurred. Please try again.');
        }
    };

    return (
        <div className="container mt-4 mb-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="seller-form-card animate-slide-up">
                        <div className="card-body p-0">
                            <h2 className="mb-4 fw-bold text-center" style={{ color: '#0ea800' }}>
                                Register Your Agency
                            </h2>
                            <p className="text-center text-muted mb-4">
                                Join our network and start listing your properties under your official agency name.
                            </p>

                            <form onSubmit={handleSubmit}>
                                <div className="form-section-title">Basic Information</div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Agency Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        placeholder="Enter Agency Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">City</label>
                                        <select
                                            className="form-select"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="" disabled>Select City</option>
                                            {pakistanCities.map(city => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">Phone Number</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="phone"
                                            placeholder="e.g. 0300-1234567"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-section-title">Contact & Presence</div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Contact Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        placeholder="agency@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">About Agency</label>
                                    <textarea
                                        className="form-control"
                                        name="description"
                                        rows="4"
                                        placeholder="Briefly describe your agency..."
                                        value={formData.description}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>

                                <div className="form-section-title">Agency Images</div>
                                <div className="row">
                                    <div className="col-md-6 mb-4">
                                        <label className="form-label fw-semibold">Agency Logo (Optional)</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            name="logo"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                        {logoFile && <small className="text-primary mt-1 d-block">Selected: {logoFile.name}</small>}
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <label className="form-label fw-semibold">Cover Image (Optional)</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            name="image"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                        {imageFile && <small className="text-primary mt-1 d-block">Selected: {imageFile.name}</small>}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn-premium-save w-100 mt-3"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Creating...
                                        </>
                                    ) : 'Create Agency'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateAgency;

