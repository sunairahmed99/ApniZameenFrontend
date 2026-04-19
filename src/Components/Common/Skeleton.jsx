import React from 'react';
import './Skeleton.css';

const Skeleton = ({ width, height, borderRadius, className = '' }) => {
    const style = {
        width: width || '100%',
        height: height || '20px',
        borderRadius: borderRadius || '4px',
    };

    return <div className={`skeleton-base ${className}`} style={style}></div>;
};

export const PropertyCardSkeleton = () => (
    <div className="card h-100 shadow-sm border-0 overflow-hidden" style={{ minWidth: '280px' }}>
        <Skeleton height="180px" borderRadius="0" />
        <div className="card-body">
            <Skeleton width="80%" height="20px" className="mb-2" />
            <Skeleton width="60%" height="15px" className="mb-3" />
            <Skeleton width="40%" height="20px" className="mb-3" />
            <div className="d-flex justify-content-between border-top pt-2">
                <Skeleton width="30%" height="15px" />
                <Skeleton width="30%" height="15px" />
                <Skeleton width="30%" height="15px" />
            </div>
        </div>
    </div>
);

export const CategoryCardSkeleton = () => (
    <div className="bg-white rounded border p-3 h-100 shadow-sm">
        <div className="d-flex align-items-center mb-3">
            <Skeleton width="40px" height="40px" borderRadius="50%" className="me-2" />
            <Skeleton width="100px" height="24px" />
        </div>
        <div className="d-flex gap-3 border-bottom mb-3 pb-2">
            <Skeleton width="60px" height="15px" />
            <Skeleton width="60px" height="15px" />
            <Skeleton width="60px" height="15px" />
        </div>
        <div className="row g-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="col-4">
                    <Skeleton height="60px" borderRadius="8px" />
                </div>
            ))}
        </div>
    </div>
);

export const AgencySkeleton = () => (
    <div className="agency-card p-3 border rounded bg-white shadow-sm text-center" style={{ minWidth: '200px' }}>
        <div className="d-flex justify-content-center mb-2">
            <Skeleton width="80px" height="60px" borderRadius="8px" />
        </div>
        <Skeleton width="70%" height="18px" className="mx-auto mb-2" />
        <Skeleton width="50%" height="14px" className="mx-auto mb-2" />
        <Skeleton width="60%" height="30px" borderRadius="20px" className="mx-auto" />
    </div>
);

export const AgencyPageCardSkeleton = () => (
    <div className="bg-white p-3 rounded h-100 d-flex align-items-center border shadow-sm">
        <div className="me-3">
            <Skeleton width="60px" height="60px" borderRadius="8px" />
        </div>
        <div className="flex-grow-1 overflow-hidden">
            <Skeleton width="80%" height="18px" className="mb-2" />
            <Skeleton width="60%" height="14px" className="mb-2" />
            <Skeleton width="40%" height="14px" className="mb-2" />
            <Skeleton width="50%" height="14px" />
        </div>
    </div>
);

export const NewProjectCardSkeleton = () => (
    <div className="bg-white rounded overflow-hidden shadow-sm border h-100">
        <Skeleton height="200px" borderRadius="0" />
        <div className="p-3">
            <Skeleton width="70%" height="20px" className="mb-2" />
            <Skeleton width="90%" height="24px" className="mb-2" />
            <Skeleton width="60%" height="16px" />
        </div>
    </div>
);

export const CityStatSkeleton = () => (
    <div className="bg-white p-4 rounded h-100 d-flex flex-column justify-content-between border shadow-sm">
        <div>
            <Skeleton width="60%" height="22px" className="mb-2" />
            <Skeleton width="40%" height="16px" />
        </div>
        <div className="mt-4">
            <Skeleton width="50%" height="16px" />
        </div>
    </div>
);

export default Skeleton;
