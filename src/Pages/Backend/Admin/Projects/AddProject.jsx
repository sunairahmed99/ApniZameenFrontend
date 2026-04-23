import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash, FaCity, FaBuilding, FaList, FaCheckSquare, FaChartLine, FaMapMarkerAlt, FaImage, FaUserTie } from 'react-icons/fa';
import { pakistanCities } from '../../../../utils/cities';
import { useCreateProject } from '../../../../hooks/useProjects';
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

const AddProject = () => {
  const navigate = useNavigate();
  const createMutation = useCreateProject();
  const loading = createMutation.isPending;

  const [formData, setFormData] = useState({
    name: '',
    city: '',
    area: '',
    address: '',
    description: '',
    priceMin: '',
    priceMax: '',
    priceUnit: 'Crore',
    sizeMin: '',
    sizeMax: '',
    sizeUnit: 'Square Yards',
    projectTypes: '',
    developer: { name: '', description: '' },
    marketedBy: { name: '' },
    location: { lat: '', lng: '' },
    isHot: false,
    isTrending: false,
    isActive: true
  });

  const [amenities, setAmenities] = useState({
    mainFeatures: [], rooms: [], businessAndCommunication: [], communityFeatures: [],
    healthcareRecreational: [], nearbyFacilities: [], otherFacilities: []
  });

  const [inventory, setInventory] = useState([]); // [{ category, priceRange: {min, max}, units: [{title, area, beds, baths, price}] }]
  const [developmentUpdates, setDevelopmentUpdates] = useState([]); // [{ date, title, description }]
  const [floorPlans, setFloorPlans] = useState([]); // [{ title }]
  const [nearbyFacilities, setNearbyFacilities] = useState([]); // [{ name, type }]

  // Files
  const [thumbnail, setThumbnail] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [developerLogo, setDeveloperLogo] = useState(null);
  const [marketedByLogo, setMarketedByLogo] = useState(null);
  const [paymentPlans, setPaymentPlans] = useState([]);

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

  // Inventory Management
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

  // Dynamic Lists Helpers
  const addItem = (setter, item) => setter(prev => [...prev, item]);
  const removeItem = (setter, index) => setter(prev => prev.filter((_, i) => i !== index));
  const updateItem = (setter, index, field, value) => setter(prev => {
    const newList = [...prev];
    newList[index][field] = value;
    return newList;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    // Basic Info
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
    data.append('location', JSON.stringify({ ...formData.location, markers: nearbyFacilities }));
    data.append('isHot', formData.isHot ? 'true' : 'false');
    data.append('isTrending', formData.isTrending ? 'true' : 'false');
    data.append('isActive', formData.isActive ? 'true' : 'false');
    data.append('nocStatus', formData.nocStatus || '');
    data.append('completionDate', formData.completionDate || '');
    data.append('nocDetails', formData.nocDetails || '');

    // Complex Data
    data.append('amenities', JSON.stringify(amenities));
    data.append('inventory', JSON.stringify(inventory));
    data.append('developmentUpdates', JSON.stringify(developmentUpdates));
    data.append('floorPlans', JSON.stringify(floorPlans));

    // Files
    if (thumbnail) data.append('thumbnail', thumbnail);
    gallery.forEach(file => data.append('gallery', file));
    if (developerLogo) data.append('developerLogo', developerLogo);
    if (marketedByLogo) data.append('marketedByLogo', marketedByLogo);
    paymentPlans.forEach(file => data.append('projectPaymentPlans', file));

    // Append Floor Plan Images (in order)
    floorPlans.forEach((plan, index) => {
      if (plan.imageFile) {
        data.append('floorPlanImages', plan.imageFile);
      }
    });

    // Nested Files (Flattened logic matching controller)
    // Note: To perfectly match the controller, we'd need to append file arrays for floorPlans, updates, units
    // For simplicity, let's just use what's easily supported by multer fields

    try {
      await createMutation.mutateAsync(data);
      navigate('/admin/projects');
    } catch (err) {
      
      alert(err.response?.data?.message || err.message || "Something went wrong");
    }
  };

  // Dummy Data Generator
  const fillDummyData = () => {
    setFormData({
      name: 'Zameen Opal (Dummy Data)',
      city: 'Lahore',
      area: 'Land Breeze Housing Society',
      address: 'Main Raiwind Road, Lahore',
      description: 'Zameen Opal is a premium residential project by Zameen Developments. It offers state-of-the-art apartments and penthouses with modern amenities. The project is designed to provide a luxurious lifestyle with a focus on community living. \n\nKey features include a swimming pool, gym, mini-cinema, and rooftop garden. The location is ideal, providing easy access to main city arteries while being tucked away in a serene environment.',
      priceMin: '1.5',
      priceMax: '4.5',
      priceUnit: 'Crore',
      sizeMin: '90', // roughly 5 Marla in sq yards
      sizeMax: '250',
      sizeUnit: 'Square Yards',
      projectTypes: 'Flats, Penthouse, Shops',
      developer: { name: 'Zameen Developments', description: 'Pakistan’s top real estate developer committed to quality.' },
      marketedBy: { name: 'Zameen.com' },
      location: { lat: '31.4504', lng: '74.2937' }, // Raiwind Road approx
      isHot: true,
      isTrending: true,
      isActive: true,
      nocStatus: 'Approved by LDA',
      completionDate: 'Dec 2026',
      nocDetails: 'NOC/LDA/123-456'
    });

    setAmenities(prev => ({
      ...prev,
      mainFeatures: ["Elevators", "Lobby in Building", "Service Elevators", "Central Air Conditioning", "Electricity Backup (Generator)"],
      rooms: ["Bedrooms", "Bathrooms", "Kitchens", "Drawing Room", "Lounge or Sitting Room"],
      businessAndCommunication: ["Broadband Internet Access", "Satellite or Cable TV Ready", "Intercom"],
      communityFeatures: ["Community Gym", "Kids Play Area", "Swimming Pool", "Community Garden"],
      healthcareRecreational: ["Sauna", "Swimming Pool", "Barbeque Area"],
      nearbyFacilities: ["Nearby Schools", "Nearby Hospitals", "Nearby Shopping Malls", "Nearby Restaurants"],
      otherFacilities: ["Maintenance Staff", "Security Staff", "CCTV Security"]
    }));

    setInventory([
      {
        category: 'Studio Apartment',
        priceRange: { min: '0.8', max: '1.2' },
        units: [
          { title: 'Standard Studio', area: '450 Sq Ft', beds: '1', baths: '1', price: 'PkR 80 Lakh' },
          { title: 'Executive Studio', area: '550 Sq Ft', beds: '1', baths: '1', price: 'PkR 1.2 Crore' }
        ]
      },
      {
        category: '2 Bed Apartment',
        priceRange: { min: '1.8', max: '2.5' },
        units: [
          { title: 'Type A - Corner', area: '1100 Sq Ft', beds: '2', baths: '2', price: 'PkR 1.8 Crore' },
          { title: 'Type B - Pool View', area: '1250 Sq Ft', beds: '2', baths: '2', price: 'PkR 2.2 Crore' },
          { title: 'Type C - Terrace', area: '1400 Sq Ft', beds: '2', baths: '3', price: 'PkR 2.5 Crore' }
        ]
      },
      {
        category: 'Penthouse',
        priceRange: { min: '4.0', max: '6.0' },
        units: [
          { title: 'Royal Penthouse', area: '2500 Sq Ft', beds: '4', baths: '5', price: 'PkR 5.5 Crore' }
        ]
      }
    ]);

    const floors = [];
    for (let i = 0; i < 10; i++) {
      const title = i === 0 ? 'Ground Floor' : `${i}th Floor`;
      floors.push({ title });
    }
    setFloorPlans(floors);

    setDevelopmentUpdates([
      { date: 'Jan 2026', title: 'Grey Structure Completed', description: 'The grey structure of the first 5 floors has been completed on schedule.' },
      { date: 'Dec 2025', title: 'Foundation Poured', description: 'Massive concrete pour for the foundation raft was successfully executed.' }
    ]);

    setNearbyFacilities([
      { name: 'City School', type: 'schools', lat: '31.4504', lng: '74.2937' },
      { name: 'Shaukat Khanum Hospital', type: 'hospitals', lat: '31.4504', lng: '74.2937' },
      { name: 'Emporium Mall', type: 'restaurants', lat: '31.4504', lng: '74.2937' } // Mapped simply
    ]);
  };

  return (
    <div className="project-form-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Add Comprehensive Project</h2>
        <button type="button" onClick={fillDummyData} className="btn btn-warning btn-sm">
          Please Fill Dummy Data 🪄
        </button>
      </div>
      <form onSubmit={handleSubmit} className="project-form">

        {/* Section: Basic Info */}
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
          <div className="form-row">
            <div className="form-group">
              <label>Project Types (comma separated)</label>
              <input type="text" name="projectTypes" placeholder="Flats, Penthouse, Offices" value={formData.projectTypes} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>NOC Status</label>
              <input type="text" name="nocStatus" placeholder="e.g. Approved" value={formData.nocStatus || ''} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Completion Date (Est.)</label>
              <input type="text" name="completionDate" placeholder="e.g. Dec 2026" value={formData.completionDate || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>NOC Number/Details (Optional)</label>
              <input type="text" name="nocDetails" value={formData.nocDetails || ''} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Section: Pricing & Size */}
        <div className="form-section">
          <h4><FaChartLine /> Pricing & Size Range</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Min Price</label>
              <input type="number" name="priceMin" value={formData.priceMin} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Max Price</label>
              <input type="number" name="priceMax" value={formData.priceMax} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Price Unit</label>
              <select name="priceUnit" value={formData.priceUnit} onChange={handleChange}>
                <option value="Crore">Crore</option>
                <option value="Lakh">Lakh</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Min Size</label>
              <input type="number" name="sizeMin" value={formData.sizeMin} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Max Size</label>
              <input type="number" name="sizeMax" value={formData.sizeMax} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Size Unit</label>
              <select name="sizeUnit" value={formData.sizeUnit} onChange={handleChange}>
                <option value="Square Yards">Square Yards</option>
                <option value="Marla">Marla</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section: Media */}
        <div className="form-section">
          <h4><FaImage /> Media & Gallery</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Main Thumbnail</label>
              <input type="file" onChange={(e) => setThumbnail(e.target.files[0])} accept="image/*" />
            </div>
            <div className="form-group">
              <label>Gallery Images (Multiple)</label>
              <input type="file" multiple onChange={(e) => setGallery(Array.from(e.target.files))} accept="image/*" />
            </div>
          </div>
          <div className="form-group">
            <label>Payment Plan Images (Multiple)</label>
            <input type="file" multiple onChange={(e) => setPaymentPlans(Array.from(e.target.files))} accept="image/*" />
          </div>
        </div>

        {/* Section: Developer */}
        <div className="form-section">
          <h4><FaUserTie /> Developer Information</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Developer Name</label>
              <input type="text" name="developer.name" value={formData.developer.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Developer Logo</label>
              <input type="file" onChange={(e) => setDeveloperLogo(e.target.files[0])} accept="image/*" />
            </div>
          </div>
          <div className="form-group">
            <label>Developer Description</label>
            <textarea rows="3" name="developer.description" value={formData.developer.description} onChange={handleChange}></textarea>
          </div>
        </div>

        {/* Section: Marketed By */}
        <div className="form-section">
          <h4><FaUserTie /> Marketing Information</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Marketed By (Name)</label>
              <input type="text" name="marketedBy.name" value={formData.marketedBy.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Marketed By (Logo)</label>
              <input type="file" onChange={(e) => setMarketedByLogo(e.target.files[0])} accept="image/*" />
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
                  <input type="number" value={cat.priceRange.min} onChange={(e) => updateInventoryCategory(catIndex, 'priceRange.min', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Price Range Max</label>
                  <input type="number" value={cat.priceRange.max} onChange={(e) => updateInventoryCategory(catIndex, 'priceRange.max', e.target.value)} />
                </div>
              </div>

              <div style={{ marginLeft: '20px', borderLeft: '2px solid #ddd', paddingLeft: '15px' }}>
                <h5>Units</h5>
                {cat.units.map((unit, unitIndex) => (
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

        {/* Section: Amenities */}
        <div className="form-section">
          <h4><FaCheckSquare /> Features & Amenities</h4>
          {Object.keys(AMENITY_OPTIONS).map(catKey => (
            <div key={catKey} className="mb-4">
              <h6 style={{ textTransform: 'capitalize', color: '#666', marginTop: '15px' }}>{catKey.replace(/([A-Z])/g, ' $1')}</h6>
              <div className="checkbox-grid">
                {AMENITY_OPTIONS[catKey].map(opt => (
                  <label key={opt} className="checkbox-item">
                    <input type="checkbox" checked={amenities[catKey].includes(opt)} onChange={() => handleAmenityChange(catKey, opt)} />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}
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
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => updateItem(setFloorPlans, i, 'imageFile', e.target.files[0])}
                    style={{ fontSize: '13px' }}
                  />
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

        {/* Section: Location and Markers */}
        <div className="form-section">
          <h4><FaMapMarkerAlt /> Location Details</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Latitude</label>
              <input type="text" name="location.lat" value={formData.location.lat} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Longitude</label>
              <input type="text" name="location.lng" value={formData.location.lng} onChange={handleChange} />
            </div>
          </div>
          <h5>Nearby Facilities</h5>
          {nearbyFacilities.map((fac, i) => (
            <div key={i} className="form-row" style={{ marginBottom: '10px' }}>
              <input type="text" placeholder="Name" value={fac.name} onChange={(e) => updateItem(setNearbyFacilities, i, 'name', e.target.value)} />
              <select value={fac.type} onChange={(e) => updateItem(setNearbyFacilities, i, 'type', e.target.value)}>
                <option value="schools">Schools</option>
                <option value="hospitals">Hospitals</option>
                <option value="restaurants">Restaurants</option>
                <option value="parks">Parks</option>
                <option value="transport">Transport</option>
              </select>
              <button type="button" onClick={() => removeItem(setNearbyFacilities, i)} style={{ color: 'red' }}><FaTrash /></button>
            </div>
          ))}
          <button type="button" onClick={() => addItem(setNearbyFacilities, { name: '', type: 'schools' })} className="add-btn"><FaPlus /> Add Facility</button>
        </div>

        {/* Settings */}
        <div className="form-section">
          <h4>Flags</h4>
          <div className="form-row">
            <label className="checkbox-item"><input type="checkbox" name="isHot" checked={formData.isHot} onChange={handleChange} /> Hot Project</label>
            <label className="checkbox-item"><input type="checkbox" name="isTrending" checked={formData.isTrending} onChange={handleChange} /> Trending</label>
            <label className="checkbox-item"><input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} /> Active</label>
          </div>
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Processing...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
};

export default AddProject;
