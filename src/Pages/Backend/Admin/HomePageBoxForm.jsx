import React, { useState, useEffect } from 'react';
import { useHomePageBoxes } from '../../../hooks/useHomePageBoxes';
import { FaTimes, FaPlus, FaTrash, FaAngleDown, FaAngleUp } from 'react-icons/fa';

const HomePageBoxForm = ({ currentBox, onClose }) => {
    const { createBoxAsync, updateBoxAsync } = useHomePageBoxes();

    const [formData, setFormData] = useState({
        boxKey: 'homes',
        title: '',
        order: 0,
        isActive: true,
        sections: []
    });

    useEffect(() => {
        if (currentBox) {
            setFormData(currentBox);
        }
    }, [currentBox]);

    const { boxKey, title, order, isActive, sections } = formData;

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    // --- Sections Management ---
    const addSection = () => {
        setFormData({
            ...formData,
            sections: [
                ...sections,
                {
                    sectionTitle: '',
                    filtersLabel: '',
                    items: []
                }
            ]
        });
    };

    const removeSection = (index) => {
        const newSections = sections.filter((_, i) => i !== index);
        setFormData({ ...formData, sections: newSections });
    };

    const updateSection = (index, field, value) => {
        const newSections = [...sections];
        newSections[index][field] = value;
        setFormData({ ...formData, sections: newSections });
    };

    // --- Items Management ---
    const addItem = (sectionIndex) => {
        const newSections = [...sections];
        newSections[sectionIndex].items.push({
            title: '',
            query: {
                propertyCategory: 'Residential',
                propertyType: 'House',
                areaSize: 5,
                areaUnit: 'Marla',
                city: '',
                installmentAvailable: false,
                possession: false
            }
        });
        setFormData({ ...formData, sections: newSections });
    };

    const removeItem = (sectionIndex, itemIndex) => {
        const newSections = [...sections];
        newSections[sectionIndex].items = newSections[sectionIndex].items.filter((_, i) => i !== itemIndex);
        setFormData({ ...formData, sections: newSections });
    };

    const updateItem = (sectionIndex, itemIndex, field, value) => {
        const newSections = [...sections];
        newSections[sectionIndex].items[itemIndex][field] = value;
        setFormData({ ...formData, sections: newSections });
    };

    // --- Query Management ---
    const updateItemQuery = (sectionIndex, itemIndex, field, value) => {
        const newSections = [...sections];
        // Handle number conversation for areaSize
        if (field === 'areaSize') value = Number(value);
        // Handle booleans
        if (value === 'true') value = true;
        if (value === 'false') value = false;

        newSections[sectionIndex].items[itemIndex].query[field] = value;
        setFormData({ ...formData, sections: newSections });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentBox) {
            updateBoxAsync({ id: currentBox._id, boxData: formData });
        } else {
            createBoxAsync(formData);
        }
        onClose();
    };

    return (
        <div className="bg-white p-4 rounded shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                <h3>{currentBox ? 'Edit Box' : 'Create New Box'}</h3>
                <button type="button" className="btn btn-outline-secondary" onClick={onClose}><FaTimes /></button>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Root Fields */}
                <div className="row mb-3">
                    <div className="col-md-3">
                        <label className="form-label">Box Key</label>
                        <select name="boxKey" className="form-select" value={boxKey} onChange={handleChange}>
                            <option value="homes">Homes</option>
                            <option value="plots">Plots</option>
                            <option value="commercial">Commercial</option>
                        </select>
                    </div>
                    <div className="col-md-5">
                        <label className="form-label">Title</label>
                        <input type="text" name="title" className="form-control" value={title} onChange={handleChange} required />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label">Order</label>
                        <input type="number" name="order" className="form-control" value={order} onChange={handleChange} required />
                    </div>
                    <div className="col-md-2 d-flex align-items-end">
                        <div className="form-check mb-2">
                            <input type="checkbox" className="form-check-input" id="isActive" name="isActive" checked={isActive} onChange={handleChange} />
                            <label className="form-check-label" htmlFor="isActive">Active</label>
                        </div>
                    </div>
                </div>

                <hr />

                {/* Sections */}
                <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h4>Sections</h4>
                        <button type="button" className="btn btn-sm btn-outline-primary" onClick={addSection}><FaPlus /> Add Section</button>
                    </div>

                    {sections.map((section, sIndex) => (
                        <div key={sIndex} className="card mb-3 border-secondary">
                            <div className="card-header bg-light d-flex justify-content-between align-items-center">
                                <span className="fw-bold">Section {sIndex + 1}</span>
                                <button type="button" className="btn btn-sm btn-danger" onClick={() => removeSection(sIndex)}><FaTrash /></button>
                            </div>
                            <div className="card-body">
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Section Title</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="e.g. Popular"
                                            value={section.sectionTitle}
                                            onChange={(e) => updateSection(sIndex, 'sectionTitle', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Filters Label</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="e.g. Type | Area Size"
                                            value={section.filtersLabel}
                                            onChange={(e) => updateSection(sIndex, 'filtersLabel', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="ps-3 border-start">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h5>Items</h5>
                                        <button type="button" className="btn btn-sm btn-outline-success" onClick={() => addItem(sIndex)}><FaPlus /> Add Item</button>
                                    </div>

                                    {section.items.map((item, iIndex) => (
                                        <div key={iIndex} className="card mb-2">
                                            <div className="card-body p-3">
                                                <div className="d-flex justify-content-between mb-2">
                                                    <h6 className="card-title text-muted">Item {iIndex + 1}</h6>
                                                    <button type="button" className="btn btn-sm btn-light text-danger" onClick={() => removeItem(sIndex, iIndex)}><FaTimes /></button>
                                                </div>

                                                <div className="mb-2">
                                                    <label className="form-label small">Item Title</label>
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        value={item.title}
                                                        onChange={(e) => updateItem(sIndex, iIndex, 'title', e.target.value)}
                                                        required
                                                    />
                                                </div>

                                                {/* Query Fields */}
                                                <div className="bg-light p-2 rounded">
                                                    <small className="d-block fw-bold mb-2">Query Parameters</small>
                                                    <div className="row g-2">
                                                        <div className="col-md-3">
                                                            <select className="form-select form-select-sm" value={item.query.propertyCategory} onChange={(e) => updateItemQuery(sIndex, iIndex, 'propertyCategory', e.target.value)}>
                                                                <option value="Residential">Residential</option>
                                                                <option value="Commercial">Commercial</option>
                                                            </select>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <select className="form-select form-select-sm" value={item.query.propertyType} onChange={(e) => updateItemQuery(sIndex, iIndex, 'propertyType', e.target.value)}>
                                                                <option value="House">House</option>
                                                                <option value="Flat">Flat</option>
                                                                <option value="Plot">Plot</option>
                                                                <option value="Shop">Shop</option>
                                                                <option value="Office">Office</option>
                                                            </select>
                                                        </div>
                                                        <div className="col-md-2">
                                                            <input
                                                                type="number"
                                                                className="form-control form-control-sm"
                                                                placeholder="Size"
                                                                value={item.query.areaSize || ''}
                                                                onChange={(e) => updateItemQuery(sIndex, iIndex, 'areaSize', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-md-2">
                                                            <select className="form-select form-select-sm" value={item.query.areaUnit || 'Marla'} onChange={(e) => updateItemQuery(sIndex, iIndex, 'areaUnit', e.target.value)}>
                                                                <option value="Marla">Marla</option>
                                                                <option value="Kanal">Kanal</option>
                                                                <option value="Square Yards">Square Yards</option>
                                                            </select>
                                                        </div>
                                                        <div className="col-md-2">
                                                            <select className="form-select form-select-sm" value={item.query.city || ''} onChange={(e) => updateItemQuery(sIndex, iIndex, 'city', e.target.value)}>
                                                                <option value="">All Cities</option>
                                                                <option value="Karachi">Karachi</option>
                                                                <option value="Lahore">Lahore</option>
                                                                <option value="Islamabad">Islamabad</option>
                                                                <option value="Rawalpindi">Rawalpindi</option>
                                                                <option value="Faisalabad">Faisalabad</option>
                                                                <option value="Multan">Multan</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="row g-2 mt-1">
                                                        <div className="col-md-6">
                                                            <select className="form-select form-select-sm" value={item.query.installmentAvailable} onChange={(e) => updateItemQuery(sIndex, iIndex, 'installmentAvailable', e.target.value === 'true')}>
                                                                <option value={false}>Not Installment</option>
                                                                <option value={true}>On Installment</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button type="submit" className="btn btn-primary">{currentBox ? 'Update Box' : 'Create Box'}</button>
                </div>
            </form>
        </div>
    );
};

export default HomePageBoxForm;
