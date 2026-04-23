import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaCloudUploadAlt, FaTrash, FaCheckCircle, FaEdit, FaBuilding } from 'react-icons/fa';
import './AddProperty.css';
import { useLocations, useCreateLocation } from '../../../hooks/useLocations';
import { useMyAgencies } from '../../../hooks/useAgencies';
import { useProperty, useUpdatePropertyContent } from '../../../hooks/useProperties';
import { uploadToCloudinary, uploadToCloudinaryChunked } from '../../../utils/cloudinaryUpload';
import { API_BASE_URL } from '../../../config';
import axios from 'axios';

const EditProperty = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const { data: propertyData, isLoading: propertyLoading } = useProperty(id);

    const { data: states = [] } = useLocations({ type: 'state' });
    const [selectedState, setSelectedState] = useState('');
    const { data: cities = [] } = useLocations({ type: 'city', parentId: selectedState });
    const [selectedCity, setSelectedCity] = useState('');
    const { data: areas = [] } = useLocations({ type: 'area', parentId: selectedCity });

    const { data: agenciesData } = useMyAgencies(user?.token);
    const agencies = agenciesData?.agencies || [];

    const updateMutation = useUpdatePropertyContent();
    const loading = updateMutation.isPending;

    const createLocationMutation = useCreateLocation();

    // Custom Area Logic
    const [isAddingArea, setIsAddingArea] = useState(false);
    const [newAreaName, setNewAreaName] = useState('');
    const [addingAreaLoading, setAddingAreaLoading] = useState(false);
    const [areaSearch, setAreaSearch] = useState('');
    const [showAreaList, setShowAreaList] = useState(false);

    const fuzzyAreaRegex = React.useMemo(() => {
        if (!areaSearch) return /(?:)/;
        let cleanSearch = areaSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        cleanSearch = cleanSearch
          .replace(/[-_\s]+/g, '[-\\s_]+')
          .replace(/([a-zA-Z])([0-9])/g, '$1[-\\s_]*$2')
          .replace(/([0-9])([a-zA-Z])/g, '$1[-\\s_]*$2');
        return new RegExp(cleanSearch, 'i');
    }, [areaSearch]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        purpose: 'For Sale',
        propertyType: 'House',
        price: '',
        areaValue: '',
        areaUnit: 'Marla',
        state: '',
        city: '',
        areaName: '',
        address: '',
        agency: '',
        bedrooms: '',
        bathrooms: '',
        email: '',
        whatsapp: ''
    });

    const [locationDetails, setLocationDetails] = useState({
        category: 'Homes',
        type: 'House',
        subType: ''
    });

    // New images (files selected by user)
    const [newImages, setNewImages] = useState([]);
    // Existing images from server
    const [existingImages, setExistingImages] = useState([]);
    // Images to keep (subset of existing)
    const [keptImages, setKeptImages] = useState([]);
    const [signatureData, setSignatureData] = useState(null);
    const [uploadProgress, setUploadProgress] = useState({
        images: {},
        isUploading: false,
        currentFile: ''
    });

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    // Populate form when property loads
    useEffect(() => {
        if (!propertyData) return;

        // Determine category from propertyType
        const homesTypes = ['House', 'Flat', 'Upper Portion', 'Lower Portion', 'Farm House', 'Room', 'Penthouse'];
        const plotsTypes = ['Residential Plot', 'Commercial Plot', 'Agricultural Land', 'Industrial Land', 'Plot File'];
        let category = 'Commercial';
        
        if (propertyData.propertyType === 'House') category = 'House';
        else if (propertyData.propertyType === 'Flat') category = 'Flat';
        else if (propertyData.propertyType === 'Farm House') category = 'Farm House';
        else if (['Upper Portion', 'Lower Portion'].includes(propertyData.propertyType)) {
            category = 'Portion';
        }
        else if (plotsTypes.includes(propertyData.propertyType)) category = 'Plots';
        else if (homesTypes.includes(propertyData.propertyType)) category = 'House'; // Fallback to House if it was some other Home type

        setLocationDetails({
            category,
            type: ['Upper Portion', 'Lower Portion'].includes(propertyData.propertyType) ? 'Portion' : propertyData.propertyType,
            subType: ''
        });

        setFormData({
            title: propertyData.title || '',
            description: propertyData.description || '',
            purpose: propertyData.purpose || 'For Sale',
            propertyType: propertyData.propertyType || 'House',
            price: propertyData.price || '',
            areaValue: propertyData.area?.value || '',
            areaUnit: propertyData.area?.unit || 'Marla',
            state: propertyData.state || '',
            city: propertyData.city || '',
            areaName: propertyData.areaName || '',
            address: propertyData.address || '',
            agency: propertyData.agency || '',
            bedrooms: propertyData.bedrooms || '',
            bathrooms: propertyData.bathrooms || '',
            email: propertyData.email || '',
            whatsapp: propertyData.whatsapp || ''
        });

        setAreaSearch(propertyData.areaName || '');

        // Set existing images
        if (propertyData.images && propertyData.images.length > 0) {
            setExistingImages(propertyData.images);
            setKeptImages(propertyData.images); // Keep all by default
        }

        // Pre-select state/city for cascading dropdowns
        if (propertyData.state) {
            const stateObj = states.find(s => s.name === propertyData.state);
            if (stateObj) setSelectedState(stateObj._id);
        }
    }, [propertyData]);

    // Update selectedState when states load and formData.state is set
    useEffect(() => {
        if (formData.state && states.length > 0) {
            const stateObj = states.find(s => s.name === formData.state);
            if (stateObj) setSelectedState(stateObj._id);
        }
    }, [states, formData.state]);

    // Update selectedCity when cities load and formData.city is set
    useEffect(() => {
        if (formData.city && cities.length > 0) {
            const cityObj = cities.find(c => c.name === formData.city);
            if (cityObj) setSelectedCity(cityObj._id);
        }
    }, [cities, formData.city]);

    const handleAddCustomArea = async () => {
        if (!newAreaName.trim()) return alert('Please enter an area name');
        if (!formData.city) return alert('Please select a city first');

        const cityObj = cities.find(c => c.name === formData.city);
        if (!cityObj) return alert("City not found");

        try {
            setAddingAreaLoading(true);
            await createLocationMutation.mutateAsync({
                name: newAreaName,
                type: 'area',
                parent: cityObj._id
            });
            setFormData(prev => ({ ...prev, areaName: newAreaName }));
            setIsAddingArea(false);
            setNewAreaName('');
            setAreaSearch(newAreaName);
            alert('Area added successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Error adding custom area');
        } finally {
            setAddingAreaLoading(false);
        }
    };
    
    // Pre-fetch signature on mount
    useEffect(() => {
        const fetchSignature = async () => {
            try {
                const { data } = await axios.get('/api/properties/upload-signature', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setSignatureData(data);
            } catch (err) {
                console.error("Failed to pre-fetch signature:", err);
            }
        };
        if (user?.token) fetchSignature();
    }, [user?.token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'state') {
            const stateObj = states.find(s => s.name === value);
            if (stateObj) setSelectedState(stateObj._id);
            
            if (value === 'Sindh') {
                setFormData(prev => ({ ...prev, [name]: value, areaUnit: 'Square Yards' }));
            } else if (value === 'Punjab') {
                setFormData(prev => ({ ...prev, [name]: value, areaUnit: 'Marla' }));
            }
        } else if (name === 'city') {
            const cityObj = cities.find(c => c.name === value);
            if (cityObj) setSelectedCity(cityObj._id);
        }
    };

    const handleNewImageChange = (e) => {
        const newFiles = Array.from(e.target.files);
        const totalImages = keptImages.length + newImages.length + newFiles.length;
        if (totalImages > 7) {
            alert("Maximum 7 images allowed in total.");
            return;
        }
        setNewImages([...newImages, ...newFiles]);
    };

    const removeNewImage = (index) => {
        setNewImages(newImages.filter((_, i) => i !== index));
    };

    const removeExistingImage = (imgUrl) => {
        setKeptImages(keptImages.filter(img => img !== imgUrl));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setUploadProgress(prev => ({ ...prev, isUploading: true }));

        try {
            // 1. Get Signature (if not pre-fetched)
            let sig = signatureData;
            if (!sig) {
                const { data } = await axios.get('/api/properties/upload-signature', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                sig = data;
                setSignatureData(sig);
            }

            // 2. Parallel Image Uploads
            setUploadProgress(prev => ({ ...prev, currentFile: `Uploading ${newImages.length} New Images...` }));
            
            const uploadPromises = newImages.map((img, index) => {
                return uploadToCloudinary(img, sig, (p) => {
                    setUploadProgress(prev => ({ 
                        ...prev, 
                        images: { ...prev.images, [index]: p } 
                    }));
                });
            });

            const newImageUrls = await Promise.all(uploadPromises);

            // 3. Merge with kept images
            const finalImages = [...keptImages, ...newImageUrls];

            // 4. Submit to Backend
            const finalData = {
                ...formData,
                images: finalImages,
                'area[value]': formData.areaValue,
                'area[unit]': formData.areaUnit,
                keptImages: JSON.stringify(keptImages)
            };

            await updateMutation.mutateAsync({ id, formData: finalData, token: user.token });
            setSuccess(true);
        } catch (err) {
            console.error("Update Error:", err);
            const errorMessage = err.response?.data?.details 
                ? `${err.response.data.message}: ${err.response.data.details}` 
                : (err.response?.data?.message || err.message || 'Failed to update property.');
            setError(errorMessage);
        } finally {
            setUploadProgress(prev => ({ ...prev, isUploading: false }));
        }
    };

    if (propertyLoading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-muted">Loading property details...</p>
            </div>
        );
    }

    if (success) {
        return (
            <div className="text-center p-5 bg-white rounded shadow-sm">
                <FaCheckCircle size={80} className="text-primary mb-4" />
                <h2 className="text-dark">Property Updated!</h2>
                <p className="text-secondary">Your property has been successfully updated.</p>
                <button className="btn btn-primary btn-lg mt-3" onClick={() => navigate('/seller/my-properties')}>
                    Back to My Properties
                </button>
            </div>
        );
    }

    return (
        <div className="p-2 p-md-4">
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div className="premium-header-card animate-fade-in mb-4">
                    <div className="campaign-card-header">
                        <div className="d-flex flex-column gap-3">
                            <div className="d-flex justify-content-between align-items-center text-white">
                                <div>
                                    <h5 className="mb-0 fw-bold d-flex align-items-center">
                                        <FaEdit className="text-warning me-2" />
                                        Edit Property
                                    </h5>
                                    <p className="mb-0 small opacity-75 d-none d-md-block">Update your property listing details</p>
                                </div>
                                <Link to="/seller/my-properties" className="btn btn-outline-light btn-sm px-4 rounded-pill fw-bold">
                                    <FaBuilding className="me-2" /> My Properties
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="alert alert-danger mb-4 border-0 shadow-sm alert-dismissible fade show" role="alert">
                        <strong>Error:</strong> {error}
                        <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Close"></button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="seller-form-card bg-white animate-slide-up">
                    <div className="form-section-title">Contact Information</div>
                    <div className="row mb-4">
                        <div className="col-md-6 mb-3 mb-md-0">
                            <label className="form-label fw-bold text-dark">Email Address *</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold text-dark">WhatsApp Number *</label>
                            <input
                                type="text"
                                name="whatsapp"
                                className="form-control"
                                value={formData.whatsapp}
                                onChange={handleInputChange}
                                placeholder="Enter WhatsApp number"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-bold text-dark">Property Title</label>
                        <input
                            type="text"
                            name="title"
                            className="form-control form-control-lg"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="e.g. 5 Marla Modern House for Sale"
                            required
                        />
                    </div>

                    <div className="row mb-4">
                        <div className="col-md-4 mb-3 mb-md-0">
                            <label className="form-label fw-bold text-dark">Purpose</label>
                            <select name="purpose" className="form-select" value={formData.purpose} onChange={handleInputChange}>
                                <option value="For Sale">For Sale</option>
                                <option value="For Rent">For Rent</option>
                            </select>
                        </div>
                        <div className="col-md-4 mb-3 mb-md-0">
                            <label className="form-label fw-bold text-dark">Property Category</label>
                            <select
                                className="form-select"
                                value={locationDetails.category}
                                onChange={(e) => {
                                    const category = e.target.value;
                                    let type = '';

                                    if (['House', 'Flat', 'Farm House', 'Portion'].includes(category)) {
                                        type = category;
                                    }

                                    setLocationDetails({ ...locationDetails, category: category, type: type, subType: '' });
                                    
                                    if (type && type !== 'Portion') {
                                        setFormData({ ...formData, propertyType: type });
                                    } else {
                                        setFormData({ ...formData, propertyType: '' });
                                    }
                                }}
                            >
                                <option value="Plots">Plots</option>
                                <option value="Commercial">Commercial</option>
                                <option value="House">House</option>
                                <option value="Flat">Flat</option>
                                <option value="Portion">Portion</option>
                                <option value="Farm House">Farm House</option>
                            </select>
                        </div>
                        <div className="col-md-4 mb-3 mb-md-0">
                            <label className="form-label fw-bold text-dark">Property Type</label>
                            <select
                                name="propertyType"
                                className="form-select"
                                value={locationDetails.type}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setLocationDetails({ ...locationDetails, type: val, subType: '' });
                                    if (val !== 'Portion') {
                                        setFormData({ ...formData, propertyType: val });
                                    } else {
                                        setFormData({ ...formData, propertyType: '' });
                                    }
                                }}
                            >
                                <option value="">Select Type</option>
                                {(locationDetails.category === 'House' || locationDetails.category === 'Flat' || locationDetails.category === 'Farm House' || locationDetails.category === 'Portion') && (
                                    <>
                                        {locationDetails.category === 'House' && <option value="House">House</option>}
                                        {locationDetails.category === 'Flat' && <option value="Flat">Flat</option>}
                                        {locationDetails.category === 'Farm House' && <option value="Farm House">Farm House</option>}
                                        {locationDetails.category === 'Portion' && (
                                            <>
                                                <option value="Lower Portion">Lower Portion</option>
                                                <option value="Upper Portion">Upper Portion</option>
                                            </>
                                        )}
                                    </>
                                )}
                                {locationDetails.category === 'Plots' && (
                                    <>
                                        <option value="Residential Plot">Residential Plot</option>
                                        <option value="Commercial Plot">Commercial Plot</option>
                                        <option value="Agricultural Land">Agricultural Land</option>
                                        <option value="Industrial Land">Industrial Land</option>
                                        <option value="Plot File">Plot File</option>
                                    </>
                                )}
                                {locationDetails.category === 'Commercial' && (
                                    <>
                                        <option value="Office">Office</option>
                                        <option value="Shop">Shop</option>
                                        <option value="Warehouse">Warehouse</option>
                                        <option value="Factory">Factory</option>
                                        <option value="Building">Building</option>
                                    </>
                                )}
                            </select>
                        </div>

                        {locationDetails.category === 'Homes' && locationDetails.type === 'Portion' && (
                            <div className="col-md-4 mt-3">
                                <label className="form-label fw-bold text-dark">Portion Category</label>
                                <select
                                    className="form-select"
                                    value={formData.propertyType}
                                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                                    required
                                >
                                    <option value="">Select Portion Type</option>
                                    <option value="Lower Portion">Lower Portion</option>
                                    <option value="Upper Portion">Upper Portion</option>
                                </select>
                            </div>
                        )}

                        <div className="col-md-4 mt-3 mt-md-0">
                            <label className="form-label fw-bold text-dark">Price (PKR)</label>
                            <input
                                type="number"
                                name="price"
                                className="form-control"
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder="Total Price"
                                required
                            />
                        </div>
                    </div>

                    <div className="row mb-4">
                        <div className="col-md-6 mb-3 mb-md-0">
                            <label className="form-label fw-bold text-dark">Area Size</label>
                            <div className="input-group">
                                <input
                                    type="number"
                                    name="areaValue"
                                    className="form-control"
                                    value={formData.areaValue}
                                    onChange={handleInputChange}
                                    required
                                />
                                <select name="areaUnit" className="form-select border-start-0" style={{ maxWidth: '120px' }} value={formData.areaUnit} onChange={handleInputChange}>
                                    <option value="Marla">Marla</option>
                                    <option value="Square Yards">Square Yards</option>
                                    <option value="Kanal">Kanal</option>
                                    <option value="Sqft">Sqft</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-3 mb-3 mb-md-0">
                            <label className="form-label fw-bold text-dark">Bedrooms</label>
                            <input type="number" name="bedrooms" className="form-control" value={formData.bedrooms} onChange={handleInputChange} placeholder="0" />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-bold text-dark">Bathrooms</label>
                            <input type="number" name="bathrooms" className="form-control" value={formData.bathrooms} onChange={handleInputChange} placeholder="0" />
                        </div>
                    </div>

                    <div className="form-section-title mt-5">Location Details</div>
                    <div className="row mb-4">
                        <div className="col-md-3 mb-3 mb-md-0">
                            <label className="form-label text-dark">State</label>
                            <select name="state" className="form-select" value={formData.state} onChange={handleInputChange} required>
                                <option value="">Select State</option>
                                {states.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
                            </select>
                        </div>
                        <div className="col-md-3 mb-3 mb-md-0">
                            <label className="form-label text-dark">City</label>
                            <select name="city" className="form-select" value={formData.city} onChange={handleInputChange} required disabled={!formData.state}>
                                <option value="">Select City</option>
                                {cities.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="col-md-6 mb-3 mb-md-0">
                            <label className="form-label text-dark d-flex justify-content-between align-items-center">
                                Area / Society
                                {!isAddingArea && (
                                    <small
                                        className="text-primary"
                                        style={{ cursor: 'pointer', fontSize: '0.75rem' }}
                                        onClick={() => setIsAddingArea(true)}
                                    >
                                        + Add New
                                    </small>
                                )}
                            </label>
                            {isAddingArea ? (
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Area Name"
                                        value={newAreaName}
                                        onChange={(e) => setNewAreaName(e.target.value)}
                                    />
                                    <button type="button" className="btn btn-primary" onClick={handleAddCustomArea} disabled={addingAreaLoading}>
                                        {addingAreaLoading ? '...' : '✓'}
                                    </button>
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => { setIsAddingArea(false); setNewAreaName(''); }}>
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <div className="position-relative">
                                    <input
                                        type="text"
                                        className="form-select"
                                        placeholder={!formData.city ? "Select City First" : "Select or Search Area"}
                                        value={areaSearch}
                                        onChange={(e) => {
                                            setAreaSearch(e.target.value);
                                            setShowAreaList(true);
                                            if (e.target.value === '') setFormData(prev => ({ ...prev, areaName: '' }));
                                        }}
                                        onFocus={() => setShowAreaList(true)}
                                        disabled={!formData.city}
                                        style={{ cursor: formData.city ? 'text' : 'not-allowed' }}
                                    />
                                    <span className="position-absolute end-0 top-50 translate-middle-y me-3" style={{ pointerEvents: 'none', opacity: 0.5 }}>&#9662;</span>

                                    {showAreaList && formData.city && (
                                        <>
                                            <div className="fixed-top w-100 h-100" style={{ zIndex: 999 }} onClick={() => setShowAreaList(false)} />
                                            <div className="position-absolute w-100 bg-white border rounded shadow-lg" style={{ zIndex: 1000, maxHeight: '250px', overflowY: 'auto', top: '100%' }}>
                                                {areas.filter(a => fuzzyAreaRegex.test(a.name)).map(a => (
                                                    <div
                                                        key={a._id}
                                                        className="p-2 border-bottom text-dark"
                                                        style={{ cursor: 'pointer', backgroundColor: formData.areaName === a.name ? '#f8f9fa' : 'white' }}
                                                        onClick={() => {
                                                            setFormData(prev => ({ ...prev, areaName: a.name }));
                                                            setAreaSearch(a.name);
                                                            setShowAreaList(false);
                                                        }}
                                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = formData.areaName === a.name ? '#f8f9fa' : 'white'}
                                                    >
                                                        {a.name}
                                                    </div>
                                                ))}
                                                {areas.filter(a => fuzzyAreaRegex.test(a.name)).length === 0 && (
                                                    <div className="p-3 text-center text-muted">No matches found.</div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label text-dark fw-bold">Full Address *</label>
                        <input
                            type="text"
                            name="address"
                            className="form-control"
                            placeholder="House #, Street #, Phase..."
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label text-dark">Agency (Optional)</label>
                        <select name="agency" className="form-select" value={formData.agency} onChange={handleInputChange}>
                            <option value="">No Agency</option>
                            {agencies.map(agency => <option key={agency._id} value={agency._id}>{agency.name}</option>)}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-bold text-dark">Description</label>
                        <textarea
                            name="description"
                            className="form-control"
                            rows="5"
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                            placeholder="Describe property features, nearby amenities, etc."
                        ></textarea>
                    </div>

                    {/* Existing Images */}
                    <div className="form-section-title mt-5">Current Images</div>
                    {existingImages.length > 0 ? (
                        <div className="d-flex flex-wrap gap-3 mb-4">
                            {existingImages.map((img, index) => {
                                const isKept = keptImages.includes(img);
                                const src = img.startsWith('http') ? img : `${API_BASE_URL}/${img.replace(/\\/g, '/')}`;
                                return (
                                    <div key={index} className="position-relative shadow-sm rounded overflow-hidden" style={{ width: '120px', height: '100px', opacity: isKept ? 1 : 0.35 }}>
                                        <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button
                                            type="button"
                                            className={`btn btn-sm position-absolute top-0 end-0 m-1 rounded-circle p-0 ${isKept ? 'btn-danger' : 'btn-success'}`}
                                            style={{ width: '22px', height: '22px', fontSize: '12px' }}
                                            onClick={() => isKept ? removeExistingImage(img) : setKeptImages([...keptImages, img])}
                                        >
                                            {isKept ? '×' : '+'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-muted small mb-4">No existing images.</p>
                    )}

                    {/* New Images */}
                    <div className="form-section-title">Add New Images</div>
                    <div className="mb-4">
                        <div
                            className="border rounded p-4 text-center bg-light"
                            style={{ borderStyle: 'dashed', cursor: 'pointer', borderWidth: '2px' }}
                            onClick={() => document.getElementById('newImageInput').click()}
                        >
                            <FaCloudUploadAlt size={40} className="text-primary mb-2" />
                            <h6 className="text-dark fw-bold">Click to add more images</h6>
                            <p className="text-secondary small mb-0">Max 7 total (existing + new)</p>
                            <input type="file" id="newImageInput" multiple hidden onChange={handleNewImageChange} accept="image/*" />
                        </div>

                        {newImages.length > 0 && (
                            <div className="d-flex flex-wrap gap-3 mt-4">
                                {newImages.map((img, index) => (
                                    <div key={index} className="position-relative shadow-sm rounded overflow-hidden" style={{ width: '120px', height: '100px' }}>
                                        <img src={URL.createObjectURL(img)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button type="button" className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 rounded-circle p-0" onClick={() => removeNewImage(index)} style={{ width: '22px', height: '22px', fontSize: '12px' }}>×</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>



                    <button
                        type="submit"
                        className="btn-premium-save w-100 py-3 mt-4"
                        disabled={loading || uploadProgress.isUploading}
                        style={{ fontSize: '1.2rem' }}
                    >
                        {loading || uploadProgress.isUploading ? (
                            <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> 
                                 {uploadProgress.isUploading ? 'Finalizing Images...' : 'Updating...'}
                            </>
                        ) : 'Update Property'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProperty;

