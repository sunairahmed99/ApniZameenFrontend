import React, { useState, useEffect } from 'react';
import './BrowseSections.css';
import { useBrowseSections } from '../../../../hooks/usePublicFeatures';

import DataTable from '../../../../Components/Backend/Admin/DataTable.jsx';

const initialFormState = {
  category: 'homes',
  section: 'popular',
  title: '',
  order: 0,
  isActive: true,
  groups: []
};

const BrowseSections = () => {
  const { sections = [], isLoading: loading, createSection, updateSection, deleteSection } = useBrowseSections();

  const [isEditing, setIsEditing] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [currentGroup, setCurrentGroup] = useState({ groupTitle: '', items: [] });
  const [currentItem, setCurrentItem] = useState({ label: '', filters: {} });
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const addGroup = () => {
    if (!currentGroup.groupTitle) return alert('Group Title is required');
    setFormData({
      ...formData,
      groups: [...formData.groups, { ...currentGroup, items: [] }]
    });
    setCurrentGroup({ groupTitle: '', items: [] });
  };

  const addItemToGroup = (groupIndex) => {
    if (!currentItem.label) return alert('Item Label is required');

    const updatedGroups = [...formData.groups];
    updatedGroups[groupIndex].items.push({ ...currentItem });

    setFormData({ ...formData, groups: updatedGroups });
    setCurrentItem({ label: '', filters: {} });
  };

  const removeGroup = (index) => {
    const updatedGroups = formData.groups.filter((_, i) => i !== index);
    setFormData({ ...formData, groups: updatedGroups });
  };

  const removeItem = (groupIndex, itemIndex) => {
    const updatedGroups = [...formData.groups];
    updatedGroups[groupIndex].items = updatedGroups[groupIndex].items.filter((_, i) => i !== itemIndex);
    setFormData({ ...formData, groups: updatedGroups });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateSection({ id: currentSection._id, sectionData: formData });
      } else {
        await createSection(formData);
      }
      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleEdit = (section) => {
    setIsEditing(true);
    setCurrentSection(section);
    setFormData(section);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this section?')) return;
    try {
      await deleteSection(id);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentSection(null);
    setFormData(initialFormState);
    setCurrentGroup({ groupTitle: '', items: [] });
    setCurrentItem({ label: '', filters: {} });
  };

  const columns = [
    { key: 'category', label: 'Category', className: 'text-capitalize' },
    { key: 'section', label: 'Section', className: 'text-capitalize' },
    { key: 'title', label: 'Title', className: 'fw-bold' },
    {
      key: 'groups',
      label: 'Groups',
      render: (val) => `${val?.length || 0} Groups`
    },
    {
      key: 'isActive',
      label: 'Active',
      render: (val) => (
        <span className={`badge bg-${val ? 'success' : 'secondary'}`}>
          {val ? 'Yes' : 'No'}
        </span>
      )
    }
  ];

  if (loading) return <div className="p-5 text-center">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="browse-sections-container p-4">
      <h2 className="mb-4">Manage Browse Sections</h2>

      <div className="card shadow-sm border-0 mb-5">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">{isEditing ? 'Edit Section' : 'Add New Section'}</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-3 mb-3">
                <label className="form-label">Category</label>
                <select className="form-select" name="category" value={formData.category} onChange={handleInputChange}>
                  <option value="homes">Homes</option>
                  <option value="plots">Plots</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label">Section Type</label>
                <select className="form-select" name="section" value={formData.section} onChange={handleInputChange}>
                  <option value="popular">Popular</option>
                  <option value="type">Type</option>
                  <option value="area-size">Area Size</option>
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-md-2 mb-3">
                <label className="form-label">Order</label>
                <input
                  type="number"
                  className="form-control"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-check mb-4">
              <input
                type="checkbox"
                className="form-check-input"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                id="isActiveCheck"
              />
              <label className="form-check-label" htmlFor="isActiveCheck">
                Active Section
              </label>
            </div>

            <div className="border rounded p-3 bg-light mb-4">
              <h6 className="mb-3">Groups & Items</h6>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="New Group Title"
                  value={currentGroup.groupTitle}
                  onChange={(e) => setCurrentGroup({ ...currentGroup, groupTitle: e.target.value })}
                />
                <button type="button" onClick={addGroup} className="btn btn-secondary">Add Group</button>
              </div>

              <div className="row g-3">
                {formData.groups.map((group, gIndex) => (
                  <div key={gIndex} className="col-md-6">
                    <div className="card h-100 shadow-sm border-0">
                      <div className="card-header d-flex justify-content-between align-items-center py-2 bg-dark text-white">
                        <small className="fw-bold">{group.groupTitle}</small>
                        <button type="button" onClick={() => removeGroup(gIndex)} className="btn btn-link btn-sm text-danger p-0">Remove</button>
                      </div>
                      <div className="card-body py-2">
                        <div className="d-flex flex-wrap gap-1 mb-2">
                          {group.items.map((item, iIndex) => (
                            <span key={iIndex} className="badge bg-info text-dark d-flex align-items-center gap-1">
                              {item.label}
                              <button type="button" className="btn-close" style={{ fontSize: '0.5rem' }} onClick={() => removeItem(gIndex, iIndex)} aria-label="Remove"></button>
                            </span>
                          ))}
                        </div>
                        <div className="input-group input-group-sm">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Item Label"
                            value={currentItem.label}
                            onChange={(e) => setCurrentItem({ ...currentItem, label: e.target.value })}
                          />
                          <button type="button" onClick={() => addItemToGroup(gIndex)} className="btn btn-outline-secondary">Add</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">{isEditing ? 'Update Section' : 'Create Section'}</button>
              {isEditing && <button type="button" onClick={resetForm} className="btn btn-outline-secondary">Cancel</button>}
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-header bg-white">
          <h5 className="mb-0">Existing Sections</h5>
        </div>
        <DataTable
          data={sections}
          columns={columns}
          showIndex={true}
          pageSize={10}
          actions={(row) => (
            <div className="d-flex gap-2 justify-content-end">
              <button onClick={() => handleEdit(row)} className="btn btn-sm btn-outline-info">Edit</button>
              <button onClick={() => handleDelete(row._id)} className="btn btn-sm btn-outline-danger">Delete</button>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default BrowseSections;
