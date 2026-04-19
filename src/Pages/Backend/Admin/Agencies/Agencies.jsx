import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaCheck, FaBan, FaToggleOn } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useAgenciesList, useCreateAgency, useUpdateAgency, useDeleteAgency, useApproveAgency, useRejectAgency, useDeactivateAgency } from '../../../../hooks/useAgencies';
import DataTable from '../../../../Components/Backend/Admin/DataTable.jsx';
import './Agencies.css';

const Agencies = () => {
  const { user } = useSelector((state) => state.auth);
  const token = user?.token;
  const [statusFilter, setStatusFilter] = useState('all');
  const { data: agencies = [], isLoading: loading } = useAgenciesList({ status: statusFilter });
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentAgencyId, setCurrentAgencyId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    isTitanium: false,
    isFeatured: false,
    isActive: true
  });

  const [image, setImage] = useState(null);

  const createMutation = useCreateAgency();
  const updateMutation = useUpdateAgency();
  const deleteMutation = useDeleteAgency();
  const approveMutation = useApproveAgency();
  const rejectMutation = useRejectAgency();
  const deactivateMutation = useDeactivateAgency();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleFileChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('city', formData.city);
    data.append('isTitanium', formData.isTitanium);
    data.append('isFeatured', formData.isFeatured);
    data.append('isActive', formData.isActive);
    if (image) data.append('logo', image);

    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: currentAgencyId, agencyData: data, token });
      } else {
        await createMutation.mutateAsync({ agencyData: data, token });
      }
      resetForm();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = (id) => {
    if (!window.confirm('Approve this agency? Status will be set to Active.')) return;
    approveMutation.mutate({ id, token });
  };

  const handleReject = (id) => {
    if (!window.confirm('Reject this agency?')) return;
    rejectMutation.mutate({ id, token });
  };

  const handleActivate = (id) => {
    if (!window.confirm('Activate this agency?')) return;
    approveMutation.mutate({ id, token });
  };

  const handleDeactivate = (id) => {
    if (!window.confirm('Deactivate this agency? Status will be set to Inactive.')) return;
    deactivateMutation.mutate({ id, token });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this agency?')) {
      deleteMutation.mutate({ id, token });
    }
  };

  const handleEdit = (agency) => {
    setIsEdit(true);
    setCurrentAgencyId(agency._id);
    setFormData({
      name: agency.name,
      city: agency.city,
      isTitanium: agency.isTitanium,
      isFeatured: agency.isFeatured,
      isActive: agency.isActive
    });
    setImage(null);
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setIsEdit(false);
    setCurrentAgencyId(null);
    setImage(null);
    setFormData({ name: '', city: '', isTitanium: false, isFeatured: false, isActive: true });
  };

  const columns = [
    {
      key: 'logo',
      label: 'Logo',
      render: (value) => value && <img src={value} alt="Logo" className="agency-logo" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />,
      sortable: false
    },
    { key: 'name', label: 'Agency Name' },
    { key: 'city', label: 'City' },
    {
      key: 'owner.name',
      label: 'Owner',
      render: (value, row) => (
        <div>
          <div>{row.owner?.name || 'N/A'}</div>
          <small className="text-muted">{row.owner?.email || ''}</small>
        </div>
      )
    },
    {
      key: 'isTitanium',
      label: 'Badges',
      render: (value, row) => (
        <div>
          {row.isTitanium && <span className="badge bg-warning text-dark me-1">Titanium</span>}
          {row.isFeatured && <span className="badge bg-info">Featured</span>}
          {!row.isTitanium && !row.isFeatured && <span className="text-muted">-</span>}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const color = value === 'active' ? 'success' : value === 'pending' ? 'warning text-dark' : value === 'inactive' ? 'secondary' : 'danger';
        return <span className={`badge bg-${color}`}>{(value || 'unknown').toUpperCase()}</span>;
      }
    }
  ];

  if (loading && !showForm) return <div>Loading...</div>;

  return (
    <div className="agencies-container">
      <div className="page-header">
        <div className="d-flex align-items-center gap-3">
          <h2>Agencies</h2>
          <select
            className="form-select form-select-sm"
            style={{ width: 'auto' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All (Including Pending)</option>
            <option value="active">Active Only</option>
            <option value="pending">Pending Only</option>
            <option value="inactive">Inactive Only</option>
            <option value="rejected">Rejected Only</option>
          </select>
        </div>
        {!showForm && (
          <button className="create-btn" onClick={() => setShowForm(true)}>
            <FaPlus /> Create New Agency
          </button>
        )}
      </div>

      {showForm && (
        <div className="agency-form-container">
          <div className="form-header">
            <h3>{isEdit ? 'Edit Agency' : 'Create New Agency'}</h3>
            <button className="close-btn" onClick={resetForm}><FaTimes /></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Agency Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>City</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Agency Logo</label>
              <input type="file" onChange={handleFileChange} accept="image/*" />
            </div>
            <div className="form-row checkboxes">
              <div className="form-group checkbox">
                <label><input type="checkbox" name="isTitanium" checked={formData.isTitanium} onChange={handleChange} /> Titanium</label>
              </div>
              <div className="form-group checkbox">
                <label><input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} /> Featured</label>
              </div>
              <div className="form-group checkbox">
                <label><input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} /> Active</label>
              </div>
            </div>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (isEdit ? 'Update Agency' : 'Create Agency')}
            </button>
          </form>
        </div>
      )}

      <DataTable
        data={agencies}
        columns={columns}
        pageSize={10}
        searchable={true}
        sortable={true}
        actions={(row) => (
          <div className="d-flex gap-2 flex-wrap">
            {row.status === 'pending' && (
              <>
                <button onClick={() => handleApprove(row._id)} className="btn btn-sm btn-success" title="Approve Agency">
                  <FaCheck /> <span className="d-none d-lg-inline ms-1">Approve</span>
                </button>
                <button onClick={() => handleReject(row._id)} className="btn btn-sm btn-danger" title="Reject Agency">
                  <FaTimes /> <span className="d-none d-lg-inline ms-1">Reject</span>
                </button>
              </>
            )}
            {row.status === 'active' && (
              <button onClick={() => handleDeactivate(row._id)} className="btn btn-sm btn-warning text-dark" title="Deactivate Agency">
                <FaBan /> <span className="d-none d-lg-inline ms-1">Deactivate</span>
              </button>
            )}
            {(row.status === 'rejected' || row.status === 'inactive') && (
              <button onClick={() => handleActivate(row._id)} className="btn btn-sm btn-success" title="Activate Agency">
                <FaToggleOn /> <span className="d-none d-lg-inline ms-1">Activate</span>
              </button>
            )}
            <button onClick={() => handleEdit(row)} className="btn btn-sm btn-outline-info" title="Edit">
              <FaEdit />
            </button>
            <button onClick={() => handleDelete(row._id)} className="btn btn-sm btn-outline-danger" title="Delete">
              <FaTrash />
            </button>
          </div>
        )}
        actionsWidth="220px"
      />
    </div>
  );
};

export default Agencies;

