import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaPlus, FaArrowLeft, FaEdit, FaTrash, FaSearch, FaBuilding } from 'react-icons/fa';
import { useMyAgencies, useAgencyPlans, useCreateAgency, useUpdateAgency, useDeleteAgency } from '../../../hooks/useAgencies';
import { useLocations } from '../../../hooks/useLocations';
import FeaturedPlans from './FeaturedPlans'; // Same directory
import DeleteConfirmModal from '../../../Components/Backend/Seller/DeleteConfirmModal';
import './SellerAgencies.css';

const SellerAgencies = () => {
    const { user } = useSelector((state) => state.auth);
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState(null);
    const [showCityList, setShowCityList] = useState(false);
    const [citySearch, setCitySearch] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        city: 'Karachi',
        phone: '',
        email: '',
        description: '',
        planId: ''
    });

    const [logoFile, setLogoFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [agencyToDelete, setAgencyToDelete] = useState(null);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [cityFilter, setCityFilter] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    const { data, isLoading: loading, refetch: refetchAgencies } = useMyAgencies(user?.token);

    useEffect(() => {
        if (import.meta.env.DEV && data) {
            
        }
    }, [data]);

    const allAgencies = data?.agencies || [];
    const { data: plans = [] } = useAgencyPlans();
    const { data: cityLocations = [] } = useLocations({ type: 'city' });
    const cities = cityLocations;

    // CLIENT-SIDE FILTERING & SORTING (Matches BannerRequest.jsx behavior)
    const agencies = React.useMemo(() => {
        let result = [...allAgencies];

        // Search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            result = result.filter(a =>
                a.name?.toLowerCase().includes(searchLower) ||
                a.city?.toLowerCase().includes(searchLower)
            );
        }

        // Status filter
        if (statusFilter) {
            result = result.filter(a => a.status === statusFilter);
        }

        // City filter
        if (cityFilter && cityFilter !== 'All Cities') {
            result = result.filter(a => a.city === cityFilter);
        }

        // Sorting
        result.sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
            if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
            return 0;
        });

        return result;
    }, [allAgencies, searchTerm, statusFilter, cityFilter, sortBy]);

    const totalPages = data?.pages || 1;
    const createAgencyMutation = useCreateAgency();
    const updateAgencyMutation = useUpdateAgency();
    const deleteAgencyMutation = useDeleteAgency();

    useEffect(() => {
        if (!isEditing && cities.length > 0 && !formData.city) {
            setFormData(prev => ({ ...prev, city: cities[0].name }));
        }
    }, [cities, isEditing, formData.city]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        if (e.target.name === 'logo') {
            setLogoFile(e.target.files[0]);
        } else if (e.target.name === 'image') {
            setImageFile(e.target.files[0]);
        }
    };

    const handleEdit = (agency) => {
        setIsEditing(true);
        setEditId(agency._id);
        setFormData({
            name: agency.name,
            city: agency.city,
            phone: agency.phone,
            email: agency.email,
            description: agency.description,
            planId: agency.featuredPlanId || ''
        });
        setCitySearch(agency.city);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        setAgencyToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!agencyToDelete) return;
        try {
            await deleteAgencyMutation.mutateAsync({ id: agencyToDelete, token: user.token });
            setMessage({ type: 'success', text: 'Agency Deleted Successfully!' });
        } catch (err) {
            
            setMessage({ type: 'error', text: 'Error deleting agency' });
        } finally {
            setIsDeleteModalOpen(false);
            setAgencyToDelete(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('city', formData.city);
        data.append('phone', formData.phone);
        data.append('email', formData.email);
        data.append('description', formData.description);
        data.append('planId', formData.planId);

        if (logoFile) data.append('logo', logoFile);
        if (imageFile) data.append('image', imageFile);

        try {
            if (isEditing) {
                await updateAgencyMutation.mutateAsync({ id: editId, agencyData: data, token: user.token });
            } else {
                await createAgencyMutation.mutateAsync({ agencyData: data, token: user.token });
            }

            setMessage({ type: 'success', text: isEditing ? 'Agency Updated Successfully!' : 'Agency Created Successfully!' });
            setShowForm(false);
            setIsEditing(false);
            setEditId(null);
            setFormData({ name: '', city: 'Karachi', phone: '', email: '', description: '', planId: '' });
            setLogoFile(null);
            setImageFile(null);
        } catch (err) {
            
            const msg = err?.response?.data?.message || err?.message || 'Error submitting form';
            setMessage({ type: 'error', text: msg });
        }
    };

    const [showBoostModal, setShowBoostModal] = useState(false);
    const [selectedAgencyId, setSelectedAgencyId] = useState(null);

    const handleBoostClick = (id) => {
        setSelectedAgencyId(id);
        setShowBoostModal(true);
    };

    useEffect(() => {
        setPage(1);
    }, [searchTerm, cityFilter, statusFilter, sortBy]);

    return (
        <div className="p-2 p-md-0 position-relative">
            {/* Premium Header Bar (Matches BannerRequest.jsx) */}
            <div className="px-md-4 mb-4">
                <div className="campaign-header-bar">
                    <h2 className="campaign-header-title">
                        <FaBuilding className="me-2 text-warning" /> My Agency Portfolio
                    </h2>

                    {!showForm && !showBoostModal && (
                        <button
                            className="btn btn-primary fw-bold text-white shadow-sm border-white"
                            onClick={() => {
                                setFormData({ name: '', city: 'Karachi', phone: '', email: '', description: '', planId: '' });
                                setLogoFile(null);
                                setImageFile(null);
                                setIsEditing(false);
                                setShowForm(true);
                            }}
                        >
                            <FaPlus className="me-2" /> <span className="d-none d-md-inline">Add Agency</span>
                        </button>
                    )}

                    {(showForm || showBoostModal) && (
                        <button
                            className="btn btn-outline-light"
                            onClick={() => {
                                setShowForm(false);
                                setShowBoostModal(false);
                                setIsEditing(false);
                                setEditId(null);
                                setFormData({ name: '', city: 'Karachi', phone: '', email: '', description: '', planId: '' });
                                setLogoFile(null);
                                setImageFile(null);
                            }}
                        >
                            <FaArrowLeft className="me-2" /> Back
                        </button>
                    )}
                </div>
            </div>

            {message && <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'} mx-md-4`}>{message.text}</div>}

            {showForm ? (
                <div className="seller-agencies-form-card animate-slide-up mt-4">
                    <h4>{isEditing ? 'Update Agency Details' : 'Register New Agency'}</h4>

                    <form onSubmit={handleSubmit}>
                        <div className="form-section-title">Basic Information</div>
                        <div className="row g-3">
                            <div className="col-md-8 mb-3">
                                <label>Agency Name</label>
                                <input type="text" className="form-control" name="name" placeholder="Enter agency name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label>City</label>
                                <div className="position-relative">
                                    <input
                                        type="text"
                                        className="form-select"
                                        placeholder="Search or Select City"
                                        value={citySearch}
                                        onChange={(e) => {
                                            setCitySearch(e.target.value);
                                            setShowCityList(true);
                                            if (e.target.value === '') setFormData(prev => ({ ...prev, city: '' }));
                                        }}
                                        onFocus={() => setShowCityList(true)}
                                        required
                                    />
                                    {showCityList && (
                                        <>
                                            <div
                                                className="fixed-top w-100 h-100"
                                                style={{ zIndex: 999 }}
                                                onClick={() => setShowCityList(false)}
                                            />
                                            <div
                                                className="position-absolute w-100 bg-white border rounded shadow-lg"
                                                style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto', top: '100%' }}
                                            >
                                                {cities
                                                    .filter(c => c.name.toLowerCase().includes(citySearch.toLowerCase()))
                                                    .map(c => (
                                                        <div
                                                            key={c._id}
                                                            className="p-2 border-bottom text-dark"
                                                            style={{ cursor: 'pointer', backgroundColor: formData.city === c.name ? '#f8f9fa' : 'white' }}
                                                            onClick={() => {
                                                                setFormData(prev => ({ ...prev, city: c.name }));
                                                                setCitySearch(c.name);
                                                                setShowCityList(false);
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = formData.city === c.name ? '#f8f9fa' : 'white'}
                                                        >
                                                            {c.name}
                                                        </div>
                                                    ))}
                                                {cities.filter(c => c.name.toLowerCase().includes(citySearch.toLowerCase())).length === 0 && (
                                                    <div className="p-2 text-center text-muted small">No cities found</div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="form-section-title">Contact Details</div>
                        <div className="row g-3">
                            <div className="col-md-6 mb-3">
                                <label>Email Address</label>
                                <input type="email" className="form-control" name="email" placeholder="agency@example.com" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label>Phone Number</label>
                                <input type="text" className="form-control" name="phone" placeholder="+92 300 1234567" value={formData.phone} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="form-section-title">Agency Presence</div>
                        <div className="mb-3">
                            <label>Description</label>
                            <textarea className="form-control" name="description" rows="4" placeholder="Tell users about your agency..." value={formData.description} onChange={handleChange}></textarea>
                        </div>

                        {isEditing && (
                            <div className="mb-3">
                                <label>Agency Plan (Update Status)</label>
                                <select className="form-select" name="planId" value={formData.planId} onChange={handleChange}>
                                    <option value="">Current Plan / No Change</option>
                                    {plans.map(plan => (
                                        <option key={plan._id} value={plan._id}>
                                            {plan.name} - Rs {plan.price} ({plan.durationInDays} Days)
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="row g-4 mt-2">
                            <div className="col-md-6">
                                <label>Agency Logo {isEditing && <span className="text-muted small">(Optional)</span>}</label>
                                <div className="custom-file-upload">
                                    <input type="file" className="form-control-file" id="logo" name="logo" onChange={handleFileChange} accept="image/*" hidden />
                                    <label htmlFor="logo" className="mb-0 cursor-pointer w-100 text-muted small">
                                        {logoFile ? `Selected: ${logoFile.name}` : (isEditing ? 'Change Logo' : 'Upload Logo')}
                                    </label>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label>Cover Image {isEditing && <span className="text-muted small">(Optional)</span>}</label>
                                <div className="custom-file-upload">
                                    <input type="file" className="form-control-file" id="image" name="image" onChange={handleFileChange} accept="image/*" hidden />
                                    <label htmlFor="image" className="mb-0 cursor-pointer w-100 text-muted small">
                                        {imageFile ? `Selected: ${imageFile.name}` : (isEditing ? 'Change Cover' : 'Upload Cover')}
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex gap-3 mt-5 pt-3 border-top">
                            <button type="submit" className="btn-premium-save flex-grow-1">
                                {isEditing ? 'Update Agency Profile' : 'Create Agency'}
                            </button>
                            <button type="button" className="btn-premium-cancel px-5" onClick={() => {
                                setIsEditing(false);
                                setEditId(null);
                                setShowForm(false);
                                setFormData({ name: '', city: 'Karachi', phone: '', email: '', description: '', planId: '' });
                                setLogoFile(null);
                                setImageFile(null);
                            }}>Cancel</button>
                        </div>
                    </form>
                </div>
            ) : showBoostModal ? (
                <div className="agency-upgrade-section animate-slide-up mx-md-4 mt-4">
                    <FeaturedPlans agencyId={selectedAgencyId} onUpgrade={() => {
                        setShowBoostModal(false);
                        refetchAgencies();
                    }} />
                </div>
            ) : (
                <div className="px-md-4 mt-3">
                    {/* BannerRequest-style card */}
                    <div className="premium-requests-card animate-fade-in mb-5">

                        {/* Blue header with stacked filters */}
                        <div className="campaign-card-header">
                            <div className="d-flex flex-column gap-3">
                                <h5 className="mb-0 d-flex align-items-center text-white">
                                    My Agency Portfolio
                                </h5>
                                <div className="filter-grid">
                                    {/* Search */}
                                    <div className="premium-filter-box">
                                        <FaSearch className="ms-2 opacity-75 text-white" />
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search agency name..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    {/* Status */}
                                    <div className="premium-filter-box">
                                        <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                            <option value="">All Status</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="pending">Pending</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </div>
                                    {/* City */}
                                    <div className="premium-filter-box">
                                        <select className="form-select" value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
                                            <option value="">All Cities</option>
                                            {cities.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    {/* Sort */}
                                    <div className="premium-filter-box">
                                        <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                            <option value="newest">Newest First</option>
                                            <option value="oldest">Oldest First</option>
                                            <option value="name">Name (A-Z)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="premium-table-container">
                            {loading && agencies.length === 0 ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-light" role="status"></div>
                                    <p className="mt-2 text-muted">Loading agencies...</p>
                                </div>
                            ) : agencies.length === 0 ? (
                                <div className="text-center py-5">
                                    <div className="opacity-25 mb-3">
                                        <FaSearch size={40} />
                                    </div>
                                    <p className="mb-0 text-muted fw-medium">
                                        {allAgencies.length === 0
                                            ? 'No agencies found yet.'
                                            : 'No matching agencies for these filters.'}
                                    </p>
                                    {(searchTerm || statusFilter || cityFilter) && (
                                        <button
                                            className="btn btn-outline-primary btn-sm mt-3"
                                            onClick={() => { setSearchTerm(''); setStatusFilter(''); setCityFilter(''); }}
                                        >
                                            Clear All Filters
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle">
                                            <thead>
                                                <tr>
                                                    <th className="ps-4">S.No</th>
                                                    <th>Logo</th>
                                                    <th>Agency Info</th>
                                                    <th>Plan</th>
                                                    <th>Added</th>
                                                    <th>Cover</th>
                                                    <th className="text-center">Status</th>
                                                    <th className="text-end pe-4">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {agencies.map((agency, index) => (
                                                    <tr key={agency._id}>
                                                        <td className="ps-4 text-muted fw-medium">{(page - 1) * 20 + index + 1}</td>
                                                        <td>
                                                            <img
                                                                src={agency.logo || 'https://placehold.co/100x55?text=No+Logo'}
                                                                alt="logo"
                                                                style={{ width: '80px', height: '45px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                                                                onError={(e) => { e.target.src = 'https://placehold.co/100x55?text=No+Logo'; }}
                                                            />
                                                        </td>
                                                        <td>
                                                            <div className="fw-bold text-dark">{agency.name}</div>
                                                            <div className="small text-muted">{agency.city}</div>
                                                        </td>
                                                        <td>
                                                            <div className="fw-bold text-primary">
                                                                {agency.isTitanium ? 'Titanium' : (agency.isFeatured ? 'Featured' : 'Standard')}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="small text-nowrap text-muted">{new Date(agency.createdAt).toLocaleDateString()}</div>
                                                        </td>
                                                        <td>
                                                            {agency.image
                                                                ? <img src={agency.image} alt="cover" style={{ width: '70px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} onError={(e) => { e.target.style.display = 'none'; }} />
                                                                : <span className="small text-muted">No Cover</span>
                                                            }
                                                        </td>
                                                        <td className="text-center">
                                                            <span className={`status-badge status-${agency.status === 'active' ? 'approved' : agency.status}`}>
                                                                {agency.status.toUpperCase()}
                                                            </span>
                                                        </td>
                                                        <td className="text-end pe-4">
                                                            <div className="d-flex justify-content-end gap-1">

                                                                <button className="btn btn-sm btn-light text-primary border-0" onClick={() => handleEdit(agency)} title="Edit">
                                                                    <FaEdit size={16} />
                                                                </button>
                                                                <button className="btn btn-sm btn-light text-danger border-0" onClick={() => handleDelete(agency._id)} title="Delete">
                                                                    <FaTrash size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Footer */}
                                    <div className="p-3 text-end border-top bg-light-subtle rounded-bottom-4">
                                        <span className="small text-muted fw-bold">
                                            Total Agencies: {agencies.length}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center pb-4">
                            <nav aria-label="Page navigation">
                                <ul className="pagination pagination-sm mb-0">
                                    <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                        <button className="page-link shadow-none" onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</button>
                                    </li>
                                    {(() => {
                                        const pages = [];
                                        const showEllipsisStart = page > 3;
                                        const showEllipsisEnd = page < totalPages - 2;
                                        pages.push(<li key={1} className={`page-item ${page === 1 ? 'active' : ''}`}><button className="page-link shadow-none" onClick={() => setPage(1)}>1</button></li>);
                                        if (showEllipsisStart) pages.push(<li key="es" className="page-item disabled"><span className="page-link border-0 bg-transparent text-muted">...</span></li>);
                                        for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
                                            pages.push(<li key={i} className={`page-item ${page === i ? 'active' : ''}`}><button className="page-link shadow-none" onClick={() => setPage(i)}>{i}</button></li>);
                                        }
                                        if (showEllipsisEnd) pages.push(<li key="ee" className="page-item disabled"><span className="page-link border-0 bg-transparent text-muted">...</span></li>);
                                        if (totalPages > 1) pages.push(<li key={totalPages} className={`page-item ${page === totalPages ? 'active' : ''}`}><button className="page-link shadow-none" onClick={() => setPage(totalPages)}>{totalPages}</button></li>);
                                        return pages;
                                    })()}
                                    <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                        <button className="page-link shadow-none" onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    )}
                </div>
            )}

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Agency"
                message="Are you sure you want to delete this agency? This action will remove all associated data and cannot be undone."
            />
        </div>
    );
};

export default SellerAgencies;

