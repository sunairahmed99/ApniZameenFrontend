import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaPlus, FaTrash, FaCity, FaBuilding, FaList, FaCheckSquare, FaChartLine, FaMapMarkerAlt, FaVideo, FaImage, FaUserTie } from 'react-icons/fa';
import { pakistanCities } from '../../../../utils/cities';
import { useProject, useUpdateProject } from '../../../../hooks/useProjects';
import './ProjectForm.css';

const AMENITY_OPTIONS = {
  mainFeatures: ["Elevators", "Lobby in Building", "Service Elevators", "Central Air Conditioning", "Central Heating", "Electricity Backup (Generator)"],
  rooms: ["Bedrooms", "Bathrooms", "Servant Quarters", "Kitchens", "Drawing Room", "Dining Room", "Study Room", "Prayer Room", "Powder Room", "Gym", "Lounge or Sitting Room"],
  businessAndCommunication: ["Broadband Internet Access", "Satellite or Cable TV Ready", "Intercom", "Business Center or Media Room in Building", "Conference Room"],
  communityFeatures: ["Community Gym", "Kids Play Area", "Community Mosque", "Community Center", "Swimming Pool", "Community Garden"],
  healthcareRecreational: ["Sauna", "Jacuzzi", "Steam Room", "Swimming Pool", "Barbeque Area", "Lawn or Garden"],
  nearbyFacilities: ["Nearby Schools", "Nearby Hospitals", "Nearby Shopping Malls", "Nearby Restaurants", "Nearby Public Transport Service"],
  otherFacilities: ["Maintenance Staff", "Security Staff", "CCTV Security"]
};

const EditProject = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: project, isLoading: fetching } = useProject(id);
  const updateMutation = useUpdateProject();
  const loading = updateMutation.isPending;

  const [formData, setFormData] = useState({
    name: '', city: '', area: '', address: '', description: '',
    priceMin: '', priceMax: '', priceUnit: 'Crore',
    sizeMin: '', sizeMax: '', sizeUnit: 'sqft',
    projectTypes: '',
    developer: { name: '', description: '' },
    marketedBy: { name: '' },
    threeDWalkthroughUrl: '', videoUrl: '',
    location: { lat: '', lng: '' },
    isHot: false, isTrending: false, isActive: true
  });

  const [amenities, setAmenities] = useState({
    mainFeatures: [], rooms: [], businessAndCommunication: [], communityFeatures: [],
    healthcareRecreational: [], nearbyFacilities: [], otherFacilities: []
  });

  const [inventory, setInventory] = useState([]);
  const [developmentUpdates, setDevelopmentUpdates] = useState([]);
  const [floorPlans, setFloorPlans] = useState([]);
  const [nearbyFacilities, setNearbyFacilities] = useState([]);

  // Files (only for new uploads)
  const [thumbnail, setThumbnail] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [developerLogo, setDeveloperLogo] = useState(null);
  const [marketedByLogo, setMarketedByLogo] = useState(null);
  const [paymentPlans, setPaymentPlans] = useState([]);
  const [threeDWalkthroughFile, setThreeDWalkthroughFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  // For Previewing Existing
  const [previews, setPreviews] = useState({});

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name, city: project.city, area: project.area || '', address: project.address || '',
        description: project.description || '',
        priceMin: project.priceRange?.min || '', priceMax: project.priceRange?.max || '', priceUnit: project.priceRange?.unit || 'Crore',
        sizeMin: project.sizeRange?.min || '', sizeMax: project.sizeRange?.max || '', sizeUnit: project.sizeRange?.unit || 'Square Yards',
        projectTypes: project.projectTypes ? project.projectTypes.join(', ') : '',
        developer: project.developer || { name: '', description: '' },
        marketedBy: project.marketedBy || { name: '' },
        threeDWalkthroughUrl: project.threeDWalkthroughUrl || '', videoUrl: project.videoUrl || '',
        location: { lat: project.location?.lat || '', lng: project.location?.lng || '' },
        isHot: project.isHot || false, isTrending: project.isTrending || false, isActive: project.isActive !== false
      });
      setAmenities(project.amenities || {
        mainFeatures: [], rooms: [], businessAndCommunication: [], communityFeatures: [],
        healthcareRecreational: [], nearbyFacilities: [], otherFacilities: []
      });
      setInventory(project.inventory || []);
      setDevelopmentUpdates(project.developmentUpdates || []);
      setFloorPlans(project.floorPlans || []);
      setNearbyFacilities(project.location?.markers || []);
      setPreviews({
        thumbnail: project.thumbnail,
        developerLogo: project.developer?.logo,
        marketedByLogo: project.marketedBy?.logo,
        gallery: project.gallery || [],
        paymentPlans: project.paymentPlans || []
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleAmenityChange = (category, value) => {
    setAmenities(prev => {
      const current = prev[category];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [category]: [...current, value] };
      }
    });
  };

  // Inventory Helpers
  const addInventoryCategory = () => {
    setInventory([...inventory, { category: '', priceRange: { min: '', max: '' }, units: [] }]);
  };

  const removeInventoryCategory = (index) => {
    setInventory(inventory.filter((_, i) => i !== index));
  };

  const updateInventoryCategory = (index, field, value) => {
    const newInventory = [...inventory];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      newInventory[index][parent][child] = value;
    } else {
      newInventory[index][field] = value;
    }
    setInventory(newInventory);
  };

  const addUnit = (catIndex) => {
    const newInventory = [...inventory];
    newInventory[catIndex].units.push({ title: '', area: '', beds: '', baths: '', price: '' });
    setInventory(newInventory);
  };

  const updateUnit = (catIndex, unitIndex, field, value) => {
    const newInventory = [...inventory];
    newInventory[catIndex].units[unitIndex][field] = value;
    setInventory(newInventory);
  };

  const removeUnit = (catIndex, unitIndex) => {
    const newInventory = [...inventory];
    newInventory[catIndex].units = newInventory[catIndex].units.filter((_, i) => i !== unitIndex);
    setInventory(newInventory);
  };
  const removeItem = (setter, index) => setter(prev => prev.filter((_, i) => i !== index));
  const updateItem = (setter, index, field, value) => setter(prev => {
    const newList = [...prev];
    // Handle nested fields like priceRange.min
    if (field.includes('.')) {
      const [p, c] = field.split('.');
      if (!newList[index][p]) newList[index][p] = {};
      newList[index][p][c] = value;
    } else {
      newList[index][field] = value;
    }
    return newList;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('city', formData.city);
    data.append('area', formData.area);
    data.append('address', formData.address);
    data.append('description', formData.description);
    data.append('priceRange', JSON.stringify({ min: formData.priceMin, max: formData.priceMax, unit: formData.priceUnit }));
    data.append('sizeRange', JSON.stringify({ min: formData.sizeMin, max: formData.sizeMax, unit: formData.sizeUnit }));
    data.append('projectTypes', JSON.stringify(formData.projectTypes.split(',').map(t => t.trim())));
    data.append('developer', JSON.stringify(formData.developer));
    data.append('marketedBy', JSON.stringify(formData.marketedBy));
    data.append('threeDWalkthroughUrl', formData.threeDWalkthroughUrl);
    data.append('videoUrl', formData.videoUrl);
    data.append('location', JSON.stringify({ ...formData.location, markers: nearbyFacilities }));
    data.append('isHot', formData.isHot);
    data.append('isTrending', formData.isTrending);
    data.append('isActive', formData.isActive);

    data.append('amenities', JSON.stringify(amenities));
    data.append('inventory', JSON.stringify(inventory));
    data.append('developmentUpdates', JSON.stringify(developmentUpdates));
    data.append('floorPlans', JSON.stringify(floorPlans));

    if (thumbnail) data.append('thumbnail', thumbnail);
    gallery.forEach(file => data.append('gallery', file));
    if (developerLogo) data.append('developerLogo', developerLogo);
    if (marketedByLogo) data.append('marketedByLogo', marketedByLogo);
    paymentPlans.forEach(file => data.append('projectPaymentPlans', file));

    // Append Floor Plan Images
    floorPlans.forEach((plan, index) => {
      if (plan.imageFile) {
        data.append('floorPlanImages', plan.imageFile);
      }
    });

    if (threeDWalkthroughFile) data.append('threeDWalkthroughFile', threeDWalkthroughFile);
    if (videoFile) data.append('videoFile', videoFile);

    try {
      await updateMutation.mutateAsync({ id, updates: data });
      navigate('/admin/projects');
    } catch (err) {
      
      alert(err.response?.data?.message || "Failed to update project");
    }
  };

  if (fetching) return <div className="p-5 text-center">Loading Project Data...</div>;

  return (
    <div className="project-form-container">
      <h2>Edit Comprehensive Project</h2>
      <form onSubmit={handleSubmit} className="project-form">

        {/* Basic Info */}
        <div className="form-section">
          <h4><FaBuilding /> Basic Information</h4>
          <div className="form-group">
            <label>Project Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <select name="city" value={formData.city} onChange={handleChange} required className="form-control">
                <option value="">Select City</option>
                {pakistanCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Area / Society</label>
              <input type="text" name="area" value={formData.area} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label>Full Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea rows="4" name="description" value={formData.description} onChange={handleChange}></textarea>
          </div>
        </div>

        {/* Pricing & Size */}
        <div className="form-section">
          <h4><FaChartLine /> Pricing & Size Range</h4>
          <div className="form-row">
            <div className="form-group"><label>Min Price</label><input type="number" name="priceMin" value={formData.priceMin} onChange={handleChange} /></div>
            <div className="form-group"><label>Max Price</label><input type="number" name="priceMax" value={formData.priceMax} onChange={handleChange} /></div>
            <div className="form-group">
              <label>Unit</label>
              <select name="priceUnit" value={formData.priceUnit} onChange={handleChange}>
                <option value="Crore">Crore</option><option value="Lakh">Lakh</option>
              </select>
            </div>
          </div>

        </div>

        {/* Section: Floor Plans & Updates */}
        <div className="form-section">
          <h4><FaList /> Floor Plans & Updates</h4>
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <h5>Floor Plans</h5>
              {floorPlans.map((plan, i) => (
                <div key={i} className="dynamic-list-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <div className="form-row" style={{ width: '100%', marginBottom: '5px' }}>
                    <input type="text" placeholder="Plan Title (e.g. Ground Floor)" value={plan.title} onChange={(e) => updateItem(setFloorPlans, i, 'title', e.target.value)} />
                    <button type="button" onClick={() => removeItem(setFloorPlans, i)} style={{ color: 'red' }}><FaTrash /></button>
                  </div>
                  {plan.image && (
                    <div className="mb-2">
                      <small className="text-secondary d-block">Current Image:</small>
                      <img src={plan.image} alt={plan.title} style={{ height: '60px', borderRadius: '4px' }} />
                    </div>
                  )}
                  <div className="d-flex flex-column">
                    <small className="text-muted mb-1">{plan.image ? 'Replace Image:' : 'Upload Image:'}</small>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => updateItem(setFloorPlans, i, 'imageFile', e.target.files[0])}
                      style={{ fontSize: '13px' }}
                    />
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => addItem(setFloorPlans, { title: '', imageFile: null })} className="add-btn"><FaPlus /> Add Floor Plan</button>
            </div>

            <div className="form-group" style={{ flex: 2 }}>
              <h5>Development Updates</h5>
              {developmentUpdates.map((upd, i) => (
                <div key={i} className="dynamic-list-item">
                  <div className="form-row">
                    <input type="text" placeholder="Date" value={upd.date} onChange={(e) => updateItem(setDevelopmentUpdates, i, 'date', e.target.value)} />
                    <input type="text" placeholder="Title" value={upd.title} onChange={(e) => updateItem(setDevelopmentUpdates, i, 'title', e.target.value)} />
                  </div>
                  <textarea placeholder="Description" rows="2" value={upd.description} onChange={(e) => updateItem(setDevelopmentUpdates, i, 'description', e.target.value)}></textarea>
                  <button type="button" className="remove-btn" onClick={() => removeItem(setDevelopmentUpdates, i)}>Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => addItem(setDevelopmentUpdates, { date: '', title: '', description: '' })} className="add-btn"><FaPlus /> Add Update</button>
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="form-section">
          <h4><FaImage /> Media & Gallery</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Thumbnail</label>
              {previews.thumbnail && <img src={previews.thumbnail} alt="" style={{ height: '50px', marginBottom: '5px' }} />}
              <input type="file" onChange={(e) => setThumbnail(e.target.files[0])} />
            </div>
            <div className="form-group">
              <label>Add to Gallery</label>
              <input type="file" multiple onChange={(e) => setGallery(Array.from(e.target.files))} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>3D Walkthrough (URL or Video File)</label>
              <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                <input type="text" name="threeDWalkthroughUrl" placeholder="Enter URL" value={formData.threeDWalkthroughUrl} onChange={handleChange} />
                <span style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>OR</span>
                <input type="file" onChange={(e) => setThreeDWalkthroughFile(e.target.files[0])} accept="video/*" />
              </div>
            </div>
            <div className="form-group">
              <label>Video (URL or Video File)</label>
              <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                <input type="text" name="videoUrl" placeholder="Enter URL" value={formData.videoUrl} onChange={handleChange} />
                <span style={{ fontSize: '12px', color: '#666', textAlign: 'center' }}>OR</span>
                <input type="file" onChange={(e) => setVideoFile(e.target.files[0])} accept="video/*" />
              </div>
            </div>
          </div>
        </div>

        {/* Developer & Marketing */}
        <div className="form-section">
          <h4><FaUserTie /> Corporate Information</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Developer Name</label>
              <input type="text" name="developer.name" value={formData.developer.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Developer Logo</label>
              {previews.developerLogo && <img src={previews.developerLogo} alt="" style={{ height: '40px' }} />}
              <input type="file" onChange={(e) => setDeveloperLogo(e.target.files[0])} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Marketed By (Name)</label>
              <input type="text" name="marketedBy.name" value={formData.marketedBy.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Marketing Logo</label>
              {previews.marketedByLogo && <img src={previews.marketedByLogo} alt="" style={{ height: '40px' }} />}
              <input type="file" onChange={(e) => setMarketedByLogo(e.target.files[0])} />
            </div>
          </div>
        </div>

        {/* Section: Inventory */}
        <div className="form-section">
          <h4><FaList /> Inventory / Units</h4>
          {inventory.map((cat, catIndex) => (
            <div key={catIndex} className="dynamic-list-item">
              <button type="button" className="remove-btn" onClick={() => removeInventoryCategory(catIndex)}>Remove Category</button>
              <div className="form-row">
                <div className="form-group">
                  <label>Category (e.g. Flat)</label>
                  <input type="text" value={cat.category} onChange={(e) => updateInventoryCategory(catIndex, 'category', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Price Range Min</label>
                  <input type="number" value={cat.priceRange?.min || ''} onChange={(e) => updateInventoryCategory(catIndex, 'priceRange.min', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Price Range Max</label>
                  <input type="number" value={cat.priceRange?.max || ''} onChange={(e) => updateInventoryCategory(catIndex, 'priceRange.max', e.target.value)} />
                </div>
              </div>

              <div style={{ marginLeft: '20px', borderLeft: '2px solid #ddd', paddingLeft: '15px' }}>
                <h5>Units</h5>
                {cat.units && cat.units.map((unit, unitIndex) => (
                  <div key={unitIndex} style={{ marginBottom: '15px', padding: '10px', background: '#fff', borderRadius: '4px' }}>
                    <div className="form-row">
                      <input type="text" placeholder="Unit Title (e.g. 2 Bed Apr.)" value={unit.title} onChange={(e) => updateUnit(catIndex, unitIndex, 'title', e.target.value)} />
                      <input type="text" placeholder="Area" value={unit.area} onChange={(e) => updateUnit(catIndex, unitIndex, 'area', e.target.value)} />
                      <input type="number" placeholder="Beds" value={unit.beds} onChange={(e) => updateUnit(catIndex, unitIndex, 'beds', e.target.value)} />
                      <input type="number" placeholder="Baths" value={unit.baths} onChange={(e) => updateUnit(catIndex, unitIndex, 'baths', e.target.value)} />
                      <input type="text" placeholder="Price" value={unit.price} onChange={(e) => updateUnit(catIndex, unitIndex, 'price', e.target.value)} />
                      <button type="button" onClick={() => removeUnit(catIndex, unitIndex)} style={{ color: 'red', border: 'none', background: 'none' }}><FaTrash /></button>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => addUnit(catIndex)} className="add-btn"><FaPlus /> Add Unit</button>
              </div>
            </div>
          ))}
          <button type="button" onClick={addInventoryCategory} className="add-btn"><FaPlus /> Add Inventory Category</button>
        </div>

        {/* Amenities */}
        <div className="form-section">
          <h4><FaCheckSquare /> Amenities</h4>
          {Object.keys(AMENITY_OPTIONS).map(k => (
            <div key={k} className="mb-3">
              <h6 className="text-capitalize">{k.replace(/([A-Z])/g, ' $1')}</h6>
              <div className="checkbox-grid">
                {AMENITY_OPTIONS[k].map(o => (
                  <label key={o} className="checkbox-item">
                    <input type="checkbox" checked={amenities[k].includes(o)} onChange={() => handleAmenityChange(k, o)} /> {o}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>{loading ? 'Updating...' : 'Save Changes'}</button>
      </form>
    </div>
  );
};

export default EditProject;
