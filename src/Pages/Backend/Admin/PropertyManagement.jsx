import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaRocket, FaStar, FaTrash, FaCrown } from 'react-icons/fa';
import { useAdminProperties, useUpdateAdminProperty, useAdminDeleteProperty } from '../../../hooks/useProperties';
import DataTable from '../../../Components/Backend/Admin/DataTable';

const PropertyManagement = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');

    const { data, isLoading: loading } = useAdminProperties({
        page: page.toString(),
        limit: '10',
        search: search
    });

    const { properties = [], totalPages = 1, totalProperties: totalItems = 0 } = data || {};

    const updateMutation = useUpdateAdminProperty();
    const deleteMutation = useAdminDeleteProperty();

    useEffect(() => {
        setPage(1);
    }, [search]);

    const handleUpdateStatus = (id, updates) => {
        updateMutation.mutate({ id, updates });
    };

    const handleDelete = (id) => {
        if (!confirm('Delete this property listing?')) return;
        deleteMutation.mutate(id);
    };

    const columns = [
        {
            key: 'property',
            label: 'Property',
            render: (_, row) => (
                <div className="d-flex align-items-center">
                    <img
                        src={row.images?.[0] || 'https://via.placeholder.com/50'}
                        alt=""
                        className="rounded me-2"
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                    <div>
                        <div className="fw-bold">{row.title}</div>
                        <small className="text-muted">{row.propertyType} - {row.purpose}</small>
                    </div>
                </div>
            )
        },
        {
            key: 'location',
            label: 'Location',
            render: (_, row) => `${row.city || ''}, ${row.areaName || ''}`
        },
        {
            key: 'level',
            label: 'Listing Level',
            render: (_, row) => (
                <div className="d-flex flex-wrap gap-1">
                    {row.isTitanium && <span className="badge" style={{ background: 'linear-gradient(45deg, #FFD700, #FFA500)', color: '#000' }}>Titanium</span>}
                    {row.isBoosted && <span className="badge bg-danger">Boosted</span>}
                    {!row.isTitanium && !row.isBoosted && <span className="badge bg-light text-dark border">Normal</span>}
                </div>
            )
        },
        {
            key: 'price',
            label: 'Price',
            render: (price) => `Rs ${price?.toLocaleString()}`
        },
        {
            key: 'seller',
            label: 'Seller',
            render: (_, row) => (
                <div>
                    <div className="fw-bold">{row.seller?.name || 'N/A'}</div>
                    <small className="text-muted">{row.seller?.phone || row.whatsapp}</small>
                </div>
            )
        },
        {
            key: 'status',
            label: 'Status',
            render: (status) => (
                <span className={`badge bg-${status === 'approved' ? 'success' : status === 'rejected' ? 'danger' : 'warning'}`}>
                    {status}
                </span>
            )
        },
        {
            key: 'highlights',
            label: 'Highlight Controls',
            sortable: false,
            render: (_, row) => (
                <div className="d-flex gap-2">
                    <button
                        className={`btn btn-sm ${row.isTitanium ? 'btn-warning' : 'btn-outline-secondary'}`}
                        onClick={() => handleUpdateStatus(row._id, { isTitanium: !row.isTitanium, isFeatured: !row.isTitanium })}
                        title="Toggle Titanium"
                        style={row.isTitanium ? { background: 'linear-gradient(45deg, #FFD700, #FFA500)', borderColor: '#FFA500', color: '#000' } : {}}
                    >
                        <FaCrown />
                    </button>
                    <button
                        className={`btn btn-sm ${row.isBoosted ? 'btn-danger' : 'btn-outline-secondary'}`}
                        onClick={() => handleUpdateStatus(row._id, { isBoosted: !row.isBoosted })}
                        title="Toggle Boosted"
                    >
                        <FaRocket />
                    </button>
                </div>
            )
        }
    ];

    const actions = (row) => (
        <div className="d-flex justify-content-end gap-2">
            {row.status === 'pending' && (
                <>
                    <button className="btn btn-sm btn-success" onClick={() => handleUpdateStatus(row._id, { status: 'approved' })} title="Approve"><FaCheck /></button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleUpdateStatus(row._id, { status: 'rejected' })} title="Reject"><FaTimes /></button>
                </>
            )}
            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(row._id)} title="Delete"><FaTrash /></button>
        </div>
    );

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Property Listings Management</h2>
                {loading && (
                    <div className="d-flex align-items-center text-primary">
                        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                        <span>Refreshing...</span>
                    </div>
                )}
            </div>

            <div className="card shadow-sm border-0">
                <DataTable
                    data={properties}
                    columns={columns}
                    actions={actions}
                    pageSize={10}
                    serverSide={true}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    onPageChange={(newPage) => setPage(newPage)}
                    onSearch={(term) => setSearch(term)}
                />
            </div>
        </div>
    );
};

export default PropertyManagement;
