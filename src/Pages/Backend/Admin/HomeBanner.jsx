import React, { useState } from 'react';
import { useBanners } from '../../../hooks/useBanners';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import './HomeBanner.css';

import DataTable from '../../../Components/Backend/Admin/DataTable.jsx';

const HomeBanner = () => {
  const {
    banners = [],
    bannerRequests = [],
    isLoadingBanners,
    isLoadingRequests,
    createBanner,
    updateBanner,
    deleteBanner,
    updateRequestStatusAsync,
    deleteRequestAsync,
    updateSellerBannerAsync
  } = useBanners();

  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentBannerId, setCurrentBannerId] = useState(null);
  const [isSellerBanner, setIsSellerBanner] = useState(false);

  // Filter State
  const [filterSource, setFilterSource] = useState('all');

  // Combine banners for display
  const combinedBanners = React.useMemo(() => {
    const admin = (banners || []).map(b => ({ ...b, source: 'admin', page: b.page || 'home' }));
    const seller = (bannerRequests || []).map(b => ({
      _id: b._id,
      title: b.title,
      subtitle: b.description, // Map description to subtitle
      image: b.bannerImage,
      link: b.redirectUrl,
      active: b.status === 'approved',
      status: b.status, // Keep status needed for seller
      source: 'seller',
      page: b.page || 'home'
    }));

    let result = [...admin, ...seller];
    if (filterSource !== 'all') {
      result = result.filter(b => b.source === filterSource);
    }
    return result;
  }, [banners, bannerRequests, filterSource]);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    link: '',
    buttonText: '',
    page: 'home',
    active: true
  });

  const [imageFile, setImageFile] = useState(null);

  const { title, subtitle, image, link, buttonText, page, active } = formData;

  // No need for useEffect dispatch fetchBanners, hook does it automatically.

  const onChange = (e) => {
    if (e.target.name === 'image') {
      setImageFile(e.target.files[0]);
    } else {
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: value,
      }));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const bannerData = new FormData();
    bannerData.append('title', title);
    bannerData.append('subtitle', subtitle);
    bannerData.append('link', link);
    bannerData.append('buttonText', buttonText);
    bannerData.append('page', page);
    bannerData.append('active', active);

    if (imageFile) {
      bannerData.append('image', imageFile);
    }

    if (isEdit) {
      if (isSellerBanner) {
        const sellerData = new FormData();
        sellerData.append('title', title);
        sellerData.append('description', subtitle);
        sellerData.append('redirectUrl', link);
        sellerData.append('isActive', active);

        if (imageFile) {
          sellerData.append('bannerImage', imageFile);
        }

        if (imageFile) {
          sellerData.append('bannerImage', imageFile);
        }

        updateSellerBannerAsync({ id: currentBannerId, bannerData: sellerData })
          .then(() => {
            // refetch handled by hook
            resetForm();
          })
          .catch(err => {
            
            alert("Failed to update banner");
          });
      } else {
        updateBanner({ id: currentBannerId, bannerData });
        resetForm();
      }
    } else {
      createBanner(bannerData);
      resetForm();
    }
  };

  const handleDelete = async (id, source) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      if (source === 'seller') {
        try {
          await deleteRequestAsync(id);
          // fetch handled by hook
        } catch (error) {
          
        }
      } else {
        deleteBanner(id);
      }
    }
  };

  const handleToggleActive = async (banner) => {
    if (banner.source === 'seller') {
      const newStatus = banner.active ? 'pending' : 'approved';
      try {
        await updateRequestStatusAsync({ id: banner._id, status: newStatus });
        // fetch handled by hook
      } catch (error) {
        
      }
    } else {
      const bData = new FormData();
      bData.append('title', banner.title);
      bData.append('active', !banner.active);
      updateBanner({ id: banner._id, bannerData: bData });
    }
  };

  const handleEdit = (banner) => {
    setIsEdit(true);
    setCurrentBannerId(banner._id);
    setIsSellerBanner(banner.source === 'seller');
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      image: banner.image,
      link: banner.link || '',
      buttonText: banner.buttonText || '',
      page: banner.page || 'home',
      active: banner.active
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setIsEdit(false);
    setCurrentBannerId(null);
    setImageFile(null);
    setFormData({
      title: '',
      subtitle: '',
      image: '',
      link: '',
      buttonText: '',
      page: 'home',
      active: true
    });
    setIsSellerBanner(false);
  };

  const columns = [
    {
      key: 'image',
      label: 'Image',
      sortable: false,
      render: (val) => <img src={val} alt="Banner" className="banner-thumbnail" />
    },
    {
      key: 'page',
      label: 'Page',
      render: (val, row) => (
        <div>
          <span style={{ textTransform: 'capitalize' }}>{val || 'home'}</span> <br />
          <small className='text-muted'>({row.source})</small>
        </div>
      )
    },
    { key: 'title', label: 'Title' },
    { key: 'subtitle', label: 'Subtitle' },
    {
      key: 'active',
      label: 'Status',
      render: (val, row) => (
        <div className="d-flex align-items-center gap-2">
          <span className={`status-badge ${val ? 'active' : 'inactive'}`}>
            {val ? 'Active' : 'Inactive'}
          </span>
          <button
            className={`btn btn-sm ${val ? 'btn-success' : 'btn-secondary'}`}
            onClick={() => handleToggleActive(row)}
            title="Toggle Status"
          >
            {val ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="home-banner-container">
      <div className="page-header">
        <h2 style={{ color: '#fff' }}>Banner Management</h2>
        <div className="d-flex gap-2">
          {!showForm && (
            <button className="create-btn" onClick={() => {
              setIsSellerBanner(false);
              setShowForm(true);
            }}>
              <FaPlus /> Create New Banner
            </button>
          )}
        </div>
      </div>

      <div className="filter-controls mb-3 p-3 bg-white rounded shadow-sm d-flex gap-3 align-items-center flex-wrap">
        <div className="d-flex align-items-center gap-2 ms-auto">
          <label className="fw-bold text-secondary">Source:</label>
          <select className="form-select" value={filterSource} onChange={(e) => setFilterSource(e.target.value)}>
            <option value="all">All Sources</option>
            <option value="admin">Admin Only</option>
            <option value="seller">Seller Requests</option>
          </select>
        </div>
      </div>

      {showForm && (
        <div className="banner-form-container">
          <div className="form-header">
            <h3 style={{ color: '#000' }}>{isEdit ? 'Edit Banner' : 'Create New Banner'}</h3>
            <button className="close-btn" onClick={resetForm}><FaTimes /></button>
          </div>
          <form onSubmit={onSubmit}>
            {/* Form fields remain the same */}
            <div className="form-group">
              <label>Title</label>
              <input type="text" name="title" value={title} onChange={onChange} placeholder="Enter banner title" required />
            </div>
            <div className="form-group">
              <label>Subtitle</label>
              <input type="text" name="subtitle" value={subtitle} onChange={onChange} placeholder="Enter banner subtitle" />
            </div>
            <div className="form-group">
              <label>Banner Image</label>
              {isEdit && image && !imageFile && (
                <div style={{ marginBottom: '10px' }}>
                  <img
                    src={image}
                    alt="Current"
                    style={{ height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                  <p style={{ fontSize: '12px', color: '#666' }}>Current Image</p>
                </div>
              )}
              <input type="file" name="image" onChange={onChange} accept="image/*" required={!isEdit} />
            </div>
            <div className="form-group">
              <label>Link (Optional)</label>
              <input type="text" name="link" value={link} onChange={onChange} placeholder="Enter redirect link" />
            </div>
            <div className="form-group">
              <label>Button Text (Optional)</label>
              <input type="text" name="buttonText" value={buttonText} onChange={onChange} placeholder="e.g., Learn More" />
            </div>
            <div className="form-group">
              <label>Page</label>
              <select name="page" value={page} onChange={onChange} className="form-select">
                <option value="home">Home Page</option>
                <option value="agent">Agent Page</option>
                <option value="guide">Area Guide Page</option>
                <option value="project">New Project Page</option>
              </select>
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input type="checkbox" name="active" checked={active} onChange={onChange} />
                Active
              </label>
            </div>
            <button type="submit" className="submit-btn">{isEdit ? 'Update Banner' : 'Create Banner'}</button>
          </form>
        </div>
      )}

      <div className="banner-list-container bg-white rounded shadow-sm">
        <DataTable
          data={combinedBanners}
          columns={columns}
          loading={isLoadingBanners || isLoadingRequests}
          showIndex={true}
          pageSize={10}
          actions={(row) => (
            <div className="d-flex gap-2 justify-content-end">
              <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(row)} title="Edit"><FaEdit /></button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(row._id, row.source)} title="Delete"><FaTrash /></button>
            </div>
          )}
          emptyMessage="No banners found."
        />
      </div>
    </div>
  );
};

export default HomeBanner;
