import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pakistanCities } from '../../../../utils/cities';
import { useCreateAgency } from '../../../../hooks/useAgencies';
import './AgencyForm.css';

const AddAgency = () => {
  const navigate = useNavigate();
  const createAgencyMutation = useCreateAgency();

  const [formData, setFormData] = useState({
    name: '',
    city: 'Karachi',
    isTitanium: false,
    isFeatured: false,
    isActive: true
  });

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('city', formData.city);
    data.append('isTitanium', formData.isTitanium);
    data.append('isFeatured', formData.isFeatured);
    data.append('isActive', formData.isActive);

    if (image) {
      data.append('logo', image);
    }

    try {
      await createAgencyMutation.mutateAsync({ agencyData: data });
      navigate('/admin/agencies');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="agency-form-container">
      <div className="card shadow-sm border-0 p-4">
        <h2 className="fw-bold mb-4">Add New Agency</h2>
        <form onSubmit={handleSubmit} className="agency-form">
          <div className="form-group mb-3">
            <label className="fw-semibold small text-muted mb-1">AGENCY NAME</label>
            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter agency name" />
          </div>

          <div className="form-group mb-3">
            <label className="fw-semibold small text-muted mb-1">CITY</label>
            <select className="form-select" name="city" value={formData.city} onChange={handleChange} required>
              <option value="" disabled>Select City</option>
              {pakistanCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="form-group mb-4">
            <label className="fw-semibold small text-muted mb-1">AGENCY LOGO</label>
            <input type="file" className="form-control" onChange={handleFileChange} accept="image/*" />
          </div>

          <div className="form-row checkboxes mb-4 d-flex gap-4">
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="isTitanium" name="isTitanium" checked={formData.isTitanium} onChange={handleChange} />
              <label className="form-check-label" htmlFor="isTitanium">Titanium</label>
            </div>
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} />
              <label className="form-check-label" htmlFor="isFeatured">Featured</label>
            </div>
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="isActive" name="isActive" checked={formData.isActive} onChange={handleChange} />
              <label className="form-check-label" htmlFor="isActive">Active</label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2 fw-bold" disabled={createAgencyMutation.isLoading}>
            {createAgencyMutation.isLoading ? 'Creating...' : 'CREATE AGENCY'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAgency;
