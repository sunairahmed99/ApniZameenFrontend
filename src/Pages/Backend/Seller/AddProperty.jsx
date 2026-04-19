import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaCloudUploadAlt, FaTrash, FaCheckCircle, FaPlus, FaBuilding } from 'react-icons/fa';
import './AddProperty.css';
import { useLocations, useCreateLocation } from '../../../hooks/useLocations';
import { useMyAgencies } from '../../../hooks/useAgencies';
import { useMySubscriptionRequests } from '../../../hooks/useSellerFeatures';
import { useCreateProperty } from '../../../hooks/useProperties';

const AddProperty = () => {
    const { user } = useSelector((state) => state.auth);

    const { data: states = [] } = useLocations({ type: 'state' });
    const [selectedState, setSelectedState] = useState('');
    const { data: cities = [] } = useLocations({ type: 'city', parentId: selectedState });
    const [selectedCity, setSelectedCity] = useState('');
    const { data: areas = [] } = useLocations({ type: 'area', parentId: selectedCity });

    const { data: agenciesData } = useMyAgencies(user?.token);
    const agencies = agenciesData?.agencies || [];
    const { data: subscriptions = [] } = useMySubscriptionRequests(user?.token, user?._id);
    const [selectedSubscription, setSelectedSubscription] = useState('');

    const createLocationMutation = useCreateLocation();
    const createPropertyMutation = useCreateProperty();
    const loading = createPropertyMutation.isPending;

    // Custom Area Logic
    const [isAddingArea, setIsAddingArea] = useState(false);
    const [newAreaName, setNewAreaName] = useState('');
    const [addingAreaLoading, setAddingAreaLoading] = useState(false);
    const [areaSearch, setAreaSearch] = useState(''); // New search state for areas
    const [showAreaList, setShowAreaList] = useState(false); // Toggle for custom list

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
        areaName: '', // This will be the specific neighborhood/area
        address: '',
        agency: '', // Optional agency selection
        bedrooms: '',
        bathrooms: '',
        email: '',
        whatsapp: ''
    });

    const [images, setImages] = useState([]);
    const [video, setVideo] = useState(null);

    // Hierarchical selection state
    const [locationDetails, setLocationDetails] = useState({
        category: 'House',
        type: 'House',
        subType: ''
    });

    useEffect(() => {
        if (subscriptions.length === 1 && !selectedSubscription) {
            setSelectedSubscription(subscriptions[0]._id);
        }
    }, [subscriptions, selectedSubscription]);

    const handleAddCustomArea = async () => {
        if (!newAreaName.trim()) return alert('Please enter an area name');
        if (!formData.city) return alert('Please select a city first');

        const cityObj = cities.find(c => c.name === formData.city);
        if (!cityObj) return alert("City not found");

        try {
            await createLocationMutation.mutateAsync({
                name: newAreaName,
                type: 'area',
                parent: cityObj._id
            });
            setFormData(prev => ({ ...prev, areaName: newAreaName }));
            setIsAddingArea(false);
            setNewAreaName('');
            setAreaSearch('');
            alert('Area added successfully!');
        } catch (err) {
            
            alert(err.response?.data?.message || 'Error adding custom area');
        }
    };

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

    const handleImageChange = (e) => {
        const newFiles = Array.from(e.target.files);
        if (images.length + newFiles.length > 7) {
            alert("You can only upload a maximum of 7 images.");
            return;
        }
        setImages([...images, ...newFiles]);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('video/')) {
                alert("Please upload a valid video file.");
                return;
            }
            setVideo(file);
        }
    };

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [debugInfo, setDebugInfo] = useState(null); // Added debugInfo state

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedSubscription) {
            alert("Please select a package/deal to list this property.");
            return;
        }

        setError(null);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        if (user && user._id) {
            data.append('sellerId', user._id);
        } else {
            alert("User session not found. Please log in.");
            return;
        }

        data.append('area[value]', formData.areaValue);
        data.append('area[unit]', formData.areaUnit);
        data.append('subscriptionId', selectedSubscription);

        images.forEach(img => data.append('images', img));
        if (video) data.append('video', video);

        try {
            await createPropertyMutation.mutateAsync(data);
            setSuccess(true);
        } catch (err) {
            
            setError(err.response?.data?.message || 'Failed to submit property.');
        }
    };

    if (success) {
        return (
            <div className="text-center p-5 bg-white rounded shadow-sm">
                <FaCheckCircle size={80} className="text-primary mb-4" />
                <h2 className="text-dark">Property Submitted!</h2>
                <p className="text-secondary">Your listing is pending admin approval. It will be visible once approved.</p>
                <button className="btn btn-primary btn-lg mt-3" onClick={() => window.location.reload()}>Add Another Property</button>
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
                                        <FaPlus className="text-warning me-2" />
                                        Add New Property
                                    </h5>
                                    <p className="mb-0 small opacity-75 d-none d-md-block">Fill in the details to list your property</p>
                                </div>
                                <Link to="/seller/my-properties" className="btn btn-outline-light btn-sm px-4 rounded-pill fw-bold">
                                    <FaBuilding className="me-2" /> My Properties
                                </Link>
                            </div>

                            <div className="package-selection-grid">
                                <div className="premium-package-box">
                                    <label>Property Listing Package</label>
                                    {subscriptions.length > 0 ? (
                                        <select
                                            className="form-select"
                                            value={selectedSubscription}
                                            onChange={(e) => setSelectedSubscription(e.target.value)}
                                            required
                                        >
                                            <option value="">-- Choose a package --</option>
                                            {subscriptions.map(sub => (
                                                <option key={sub._id} value={sub._id}>
                                                    {sub.dealId?.name} ({sub.quotaRemaining} Listing Units Remaining)
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <Link to="/seller/packages" className="form-select text-decoration-none text-dark d-flex align-items-center">
                                            -- Choose a package --
                                        </Link>
                                    )}
                                </div>
                                {subscriptions.length === 0 && (
                                    <div className="text-white small fw-bold px-2 animate-pulse">
                                        ⚠️ No active packages found. Please buy a subscription first.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {error && <div className="alert alert-danger mb-4 border-0 shadow-sm alert-dismissible fade show" role="alert">
                    <strong>Error:</strong> {error}
                    {debugInfo && (
                        <div className="mt-2 small text-muted">
                            Debug: {JSON.stringify(debugInfo)}
                        </div>
                    )}
                    <button type="button" className="btn-close" onClick={() => { setError(null); setDebugInfo(null); }} aria-label="Close"></button>
                </div>}

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
                                placeholder="Enter WhatsApp number (e.g. 03001234567)"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-bold text-dark">Property Title</label>
                        <input type="text" name="title" className="form-control form-control-lg" onChange={handleInputChange} placeholder="e.g. 5 Marla Modern House for Sale" required />
                    </div>

                    <div className="row mb-4">
                        <div className="col-md-4 mb-3 mb-md-0">
                            <label className="form-label fw-bold text-dark">Purpose</label>
                            <select name="purpose" className="form-select" onChange={handleInputChange}>
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
                                    
                                    // Auto-select type if category is a specific type
                                    if (['House', 'Flat', 'Farm House', 'Portion'].includes(category)) {
                                        type = category;
                                    }

                                    setLocationDetails({ ...locationDetails, category: category, type: type, subType: '' });
                                    
                                    // Reset/Set form data propertyType
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
                                    // If not portion, set formData.propertyType directly
                                    if (val !== 'Portion') {
                                        setFormData({ ...formData, propertyType: val });
                                    } else {
                                        setFormData({ ...formData, propertyType: '' }); // Reset until specific portion chosen
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

                        {/* Show Portion Sub-Type only if Portion is selected */}
                        {locationDetails.category === 'Homes' && locationDetails.type === 'Portion' && (
                            <div className="col-md-4 mt-3 mt-md-0">
                                <label className="form-label fw-bold text-dark">Portion Category</label>
                                <select
                                    className="form-select"
                                    value={formData.propertyType}
                                    onChange={(e) => {
                                        setFormData({ ...formData, propertyType: e.target.value });
                                    }}
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
                            <input type="number" name="price" className="form-control" onChange={handleInputChange} placeholder="Total Price" required />
                        </div>
                    </div>

                    <div className="row mb-4">
                        <div className="col-md-6 mb-3 mb-md-0">
                            <label className="form-label fw-bold text-dark">Area Size</label>
                            <div className="input-group">
                                <input type="number" name="areaValue" className="form-control" onChange={handleInputChange} required />
                                <select name="areaUnit" className="form-select border-start-0" style={{ maxWidth: '120px' }} value={formData.areaUnit} onChange={handleInputChange}>
                                    <option value="Marla">Marla</option>
                                    <option value="Square Yards">Square Yards</option>
                                    <option value="Kanal">Kanal</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-3 mb-3 mb-md-0">
                            <label className="form-label fw-bold text-dark">Bedrooms</label>
                            <input type="number" name="bedrooms" className="form-control" onChange={handleInputChange} placeholder="0" />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-bold text-dark">Bathrooms</label>
                            <input type="number" name="bathrooms" className="form-control" onChange={handleInputChange} placeholder="0" />
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
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleAddCustomArea}
                                        disabled={addingAreaLoading}
                                    >
                                        {addingAreaLoading ? '...' : '✓'}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => { setIsAddingArea(false); setNewAreaName(''); }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <div className="position-relative">
                                    <input
                                        type="text"
                                        className="form-select" // Use form-select class to mimic dropdown look or form-control 
                                        placeholder={!formData.city ? "Select City First" : "Select or Search Area"}
                                        value={areaSearch}
                                        onChange={(e) => {
                                            setAreaSearch(e.target.value);
                                            setShowAreaList(true);
                                            // Reset selection if user clears input? Optional.
                                            if (e.target.value === '') setFormData(prev => ({ ...prev, areaName: '' }));
                                        }}
                                        onFocus={() => setShowAreaList(true)}
                                        // onBlur={() => setTimeout(() => setShowAreaList(false), 200)} // Delay to allow click
                                        disabled={!formData.city}
                                        style={{ cursor: formData.city ? 'text' : 'not-allowed' }}
                                    />
                                    {/* Chevron icon to mimic select */}
                                    <span
                                        className="position-absolute end-0 top-50 translate-middle-y me-3 pointer-events-none"
                                        style={{ pointerEvents: 'none', opacity: 0.5 }}
                                    >
                                        &#9662;
                                    </span>

                                    {showAreaList && formData.city && (
                                        <>
                                            <div
                                                className="fixed-top w-100 h-100"
                                                style={{ zIndex: 999 }}
                                                onClick={() => setShowAreaList(false)}
                                            />
                                            <div
                                                className="position-absolute w-100 bg-white border rounded shadow-lg"
                                                style={{ zIndex: 1000, maxHeight: '250px', overflowY: 'auto', top: '100%' }}
                                            >
                                                {areas
                                                    .filter(a => fuzzyAreaRegex.test(a.name))
                                                    .map(a => (
                                                        <div
                                                            key={a._id}
                                                            className="p-2 border-bottom hover-bg-light text-dark"
                                                            style={{ cursor: 'pointer', backgroundColor: formData.areaName === a.name ? '#f8f9fa' : 'white', color: 'black' }}
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
                                                    ))
                                                }
                                                {areas.filter(a => fuzzyAreaRegex.test(a.name)).length === 0 && (
                                                    <div className="p-3 text-center text-muted">
                                                        No matches found.
                                                    </div>
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
                        <input type="text" name="address" className="form-control" placeholder="House #, Street #, Phase..." onChange={handleInputChange} required />
                    </div>

                    <div className="mb-4">
                        <label className="form-label text-dark">Agency (Optional)</label>
                        <select name="agency" className="form-select" onChange={handleInputChange}>
                            <option value="">No Agency</option>
                            {agencies.map(agency => <option key={agency._id} value={agency._id}>{agency.name}</option>)}
                        </select>
                        <small className="text-muted">Select your agency if you're representing one</small>
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-bold text-dark">Description</label>
                        <textarea name="description" className="form-control" rows="5" onChange={handleInputChange} required placeholder="Describe property features, nearby amenities, etc."></textarea>
                    </div>

                    <div className="form-section-title mt-5">Media (Images & Video)</div>
                    <div className="mb-4">
                        <div
                            className="border rounded p-5 text-center bg-light"
                            style={{ borderStyle: 'dashed', cursor: 'pointer', borderWidth: '2px' }}
                            onClick={() => document.getElementById('imageInput').click()}
                        >
                            <FaCloudUploadAlt size={50} className="text-primary mb-3" />
                            <h6 className="text-dark fw-bold">Click to upload property images</h6>
                            <p className="text-secondary small mb-0">Max 7 high-quality images allowed</p>
                            <input type="file" id="imageInput" multiple hidden onChange={handleImageChange} accept="image/*" />
                        </div>

                        {images.length > 0 && (
                            <div className="d-flex flex-wrap gap-3 mt-4">
                                {images.map((img, index) => (
                                    <div key={index} className="position-relative shadow-sm rounded overflow-hidden" style={{ width: '120px', height: '100px' }}>
                                        <img src={URL.createObjectURL(img)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button type="button" className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 rounded-circle p-0" onClick={() => removeImage(index)} style={{ width: '22px', height: '22px', fontSize: '12px' }}>×</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mb-5">
                        <label className="form-label fw-bold text-dark">Property Video (Max 10 Minutes)</label>
                        <div className="input-group">
                            <input type="file" className="form-control" onChange={handleVideoChange} accept="video/*" />
                        </div>
                        <small className="text-muted mt-1 d-block italic">Only 1 video file allowed. Recommended format: MP4.</small>
                    </div>

                    {subscriptions.length === 0 && !user?.isUnlimited && (
                        <div className="alert alert-danger mb-4 shadow-sm border-0 d-flex align-items-center">
                            <div className="me-3">
                                <FaTrash className="text-danger" size={24} />
                            </div>
                            <div>
                                <h6 className="mb-1 fw-bold">Quota Exhausted!</h6>
                                <p className="mb-0 small">You don't have any active packages with remaining property listings. Please <a href="/seller/packages" className="fw-bold text-danger">buy a new package</a> to list this property.</p>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        className={`btn-premium-save w-100 py-3 mt-4 ${subscriptions.length === 0 && !user?.isUnlimited ? 'bg-secondary' : ''}`}
                        disabled={loading || (subscriptions.length === 0 && !user?.isUnlimited)}
                        style={{ fontSize: '1.2rem' }}
                    >
                        {loading ? (
                            <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Processing...</>
                        ) : (subscriptions.length === 0 && !user?.isUnlimited ? 'Quota Exhausted' : 'Submit Property Listing')}
                    </button>
                </form>
            </div >
        </div >
    );
};

export default AddProperty;

