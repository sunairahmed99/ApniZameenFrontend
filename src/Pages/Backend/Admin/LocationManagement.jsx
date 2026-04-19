import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaMapMarkerAlt } from 'react-icons/fa';
import { useLocations, useCreateLocation, useDeleteLocation } from '../../../hooks/useLocations';

const LocationManagement = () => {
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedArea, setSelectedArea] = useState('');

    const [areaSearch, setAreaSearch] = useState('');
    const [quickAreaName, setQuickAreaName] = useState('');

    const [newName, setNewName] = useState('');
    const [newType, setNewType] = useState('state');

    // Queries
    const { data: states = [] } = useLocations({ type: 'state' });
    const { data: cities = [] } = useLocations(selectedState ? { parentId: selectedState, type: 'city' } : null);
    const { data: areas = [] } = useLocations(selectedCity ? { parentId: selectedCity, type: 'area' } : null);

    // Mutations
    const createMutation = useCreateLocation();
    const deleteMutation = useDeleteLocation();

    const handleQuickAddArea = async (e) => {
        e.preventDefault();
        if (!selectedCity || !quickAreaName.trim()) return;

        try {
            await createMutation.mutateAsync({
                name: quickAreaName,
                type: 'area',
                parent: selectedCity
            });
            setQuickAreaName('');
        } catch (err) {  }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        const payload = {
            name: newName,
            type: newType,
            parent: newType === 'city' ? selectedState : (newType === 'area' ? selectedCity : null)
        };

        try {
            await createMutation.mutateAsync(payload);
            setNewName('');
        } catch (err) {  }
    };

    const handleDelete = async (id, type) => {
        if (!confirm('Delete this location?')) return;
        try {
            await deleteMutation.mutateAsync(id);
        } catch (err) {  }
    };

    return (
        <div className="p-4">
            <h2 className="mb-4">Location Management (Hierarchy)</h2>

            <div className="card p-4 mb-4 shadow-sm border-0">
                <form onSubmit={handleAdd} className="row align-items-end g-3">
                    <div className="col-md-3">
                        <label className="form-label">Location Type</label>
                        <select className="form-select" value={newType} onChange={(e) => setNewType(e.target.value)}>
                            <option value="state">State</option>
                            <option value="city">City</option>
                            <option value="area">Area</option>
                        </select>
                    </div>

                    {['city', 'area'].includes(newType) && (
                        <div className="col-md-2">
                            <label className="form-label text-truncate d-block">Select State</label>
                            <select className="form-select" value={selectedState} onChange={(e) => { setSelectedState(e.target.value); }} required>
                                <option value="">Select State</option>
                                {states.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                            </select>
                        </div>
                    )}

                    {['area'].includes(newType) && (
                        <div className="col-md-2">
                            <label className="form-label text-truncate d-block">Select City</label>
                            <select className="form-select" value={selectedCity} onChange={(e) => { setSelectedCity(e.target.value); }} required>
                                <option value="">Select City</option>
                                {cities.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                        </div>
                    )}

                    <div className="col-md-2">
                        <label className="form-label">Name</label>
                        <input type="text" className="form-control" value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Punjab, Lahore, DHA" required />
                    </div>
                    <div className="col-md-2">
                        <button type="submit" className="btn btn-primary w-100"><FaPlus className="me-2" /> Add</button>
                    </div>
                </form>
            </div>

            <div className="row g-3">
                {/* States List */}
                <div className="col-md-4">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-header bg-primary text-white">States</div>
                        <ul className="list-group list-group-flush">
                            {states.map(s => (
                                <li key={s._id}
                                    className={`list-group-item d-flex justify-content-between align-items-center ${selectedState === s._id ? 'bg-light fw-bold' : ''}`}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => { setSelectedState(s._id); }}
                                >
                                    <span><FaMapMarkerAlt className="me-2 text-primary" /> {s.name}</span>
                                    <button className="btn btn-sm text-danger" onClick={(e) => { e.stopPropagation(); handleDelete(s._id, 'state'); }}><FaTrash /></button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Cities List */}
                <div className="col-md-4">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-header bg-info text-white">Cities in State</div>
                        <ul className="list-group list-group-flush">
                            {cities.map(c => (
                                <li key={c._id}
                                    className={`list-group-item d-flex justify-content-between align-items-center ${selectedCity === c._id ? 'bg-light fw-bold' : ''}`}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => { setSelectedCity(c._id); }}
                                >
                                    <span>{c.name}</span>
                                    <button className="btn btn-sm text-danger" onClick={(e) => { e.stopPropagation(); handleDelete(c._id, 'city'); }}><FaTrash /></button>
                                </li>
                            ))}
                            {cities.length === 0 && <li className="list-group-item text-muted text-center small">Select a state to view cities</li>}
                        </ul>
                    </div>
                </div>

                {/* Areas List */}
                <div className="col-md-4">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                            <span>Areas in City</span>
                            <span className="badge bg-light text-success">{areas.length}</span>
                        </div>

                        {/* Search Input */}
                        <div className="p-2 border-bottom bg-light">
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Search areas..."
                                value={areaSearch}
                                onChange={(e) => setAreaSearch(e.target.value)}
                            />
                        </div>

                        {/* Quick Add Area */}
                        {selectedCity && (
                            <div className="p-2 border-bottom bg-light">
                                <form onSubmit={handleQuickAddArea} className="d-flex gap-2">
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Add New Area..."
                                        value={quickAreaName}
                                        onChange={(e) => setQuickAreaName(e.target.value)}
                                        required
                                    />
                                    <button type="submit" className="btn btn-sm btn-primary"><FaPlus /></button>
                                </form>
                            </div>
                        )}

                        {/* Scrollable Area List */}
                        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            <ul className="list-group list-group-flush">
                                {areas
                                    .filter(a => a.name.toLowerCase().includes(areaSearch.toLowerCase()))
                                    .map(a => (
                                        <li key={a._id}
                                            className={`list-group-item d-flex justify-content-between align-items-center ${selectedArea === a._id ? 'bg-light fw-bold' : ''}`}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <span>{a.name}</span>
                                            <button className="btn btn-sm text-danger" onClick={(e) => { e.stopPropagation(); handleDelete(a._id, 'area'); }}><FaTrash /></button>
                                        </li>
                                    ))}
                                {areas.length === 0 && <li className="list-group-item text-muted text-center small">Select a city to view areas</li>}
                                {areas.length > 0 && areaSearch && areas.filter(a => a.name.toLowerCase().includes(areaSearch.toLowerCase())).length === 0 && (
                                    <li className="list-group-item text-muted text-center small">No areas match "{areaSearch}"</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationManagement;
