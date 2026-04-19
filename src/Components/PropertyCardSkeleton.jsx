import React from 'react';

const PropertyCardSkeleton = () => {
    return (
        <div className="card h-100 shadow-sm border-0 property-card">
            <div className="position-relative overflow-hidden rounded-top" style={{ paddingTop: '60%', background: '#e0e0e0' }}>
                <div className="position-absolute top-0 start-0 w-100 h-100" style={{
                    background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite'
                }} />
            </div>
            <div className="card-body">
                <div className="mb-2" style={{
                    height: '20px',
                    background: '#e0e0e0',
                    borderRadius: '4px',
                    width: '80%'
                }} />
                <div className="mb-2" style={{
                    height: '16px',
                    background: '#e0e0e0',
                    borderRadius: '4px',
                    width: '60%'
                }} />
                <div className="mb-3" style={{
                    height: '24px',
                    background: '#e0e0e0',
                    borderRadius: '4px',
                    width: '50%'
                }} />
                <div className="d-flex justify-content-between">
                    <div style={{
                        height: '16px',
                        background: '#e0e0e0',
                        borderRadius: '4px',
                        width: '30%'
                    }} />
                    <div style={{
                        height: '16px',
                        background: '#e0e0e0',
                        borderRadius: '4px',
                        width: '30%'
                    }} />
                </div>
            </div>
        </div>
    );
};

export default PropertyCardSkeleton;
