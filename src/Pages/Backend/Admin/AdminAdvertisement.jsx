import React, { useState } from 'react';
import AdminAdDeals from './AdminAdDeals';
import AdminAdRequests from './AdminAdRequests';
import { FaTags, FaBullhorn } from 'react-icons/fa';

const AdminAdvertisement = () => {
    const [activeTab, setActiveTab] = useState('deals');

    return (
        <div className="p-2 p-md-4">
            <div className="responsive-page-header mb-4">
                <h2 className="responsive-page-title text-white">Advertisement Management</h2>
                <div className="d-flex bg-dark p-1 rounded border border-secondary">
                    <button
                        className={`btn btn-sm px-4 ${activeTab === 'deals' ? 'btn-primary' : 'btn-outline-light border-0'}`}
                        onClick={() => setActiveTab('deals')}
                    >
                        <FaTags className="me-2" /> Ad Packages
                    </button>
                    <button
                        className={`btn btn-sm px-4 ${activeTab === 'requests' ? 'btn-primary' : 'btn-outline-light border-0'}`}
                        onClick={() => setActiveTab('requests')}
                    >
                        <FaBullhorn className="me-2" /> Ad Approvals
                    </button>
                </div>
            </div>

            <div className="animate-fade-in">
                {activeTab === 'deals' ? <AdminAdDeals /> : <AdminAdRequests />}
            </div>
        </div>
    );
};

export default AdminAdvertisement;
