import React from 'react';
import { Link } from 'react-router-dom';
import FeaturedPlans from './FeaturedPlans';
import { useAgenciesList } from '../../../hooks/useAgencies';
import './AgencyDashboard.css';

const AgencyDashboard = () => {
    // Mock Owner ID - in real app get from Auth
    const ownerId = "67878d2b27d4223f66858e74";

    const { data: agencies = [], isLoading: loading } = useAgenciesList();

    const agency = agencies.find(a => a.ownerId?._id === ownerId || a.ownerId === ownerId);

    if (loading) {
        return (
            <div className="agency-dashboard-wrapper">
                <div className="agency-loading">Loading agency data...</div>
            </div>
        );
    }

    if (!agency) {
        return (
            <div className="agency-dashboard-wrapper">
                <div className="no-agency-card">
                    <h2>You don't have an agency yet.</h2>
                    <p>Create your free agency to start listing properties and reaching more clients.</p>
                    <Link to="/seller/create-agency" className="create-agency-btn">
                        Create Free Agency
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="agency-dashboard-wrapper">
            {/* Agency Banner Card */}
            <div className="agency-banner-card">
                <div>
                    <h1 className="agency-name">{agency.name}</h1>
                    <p className="agency-city">{agency.city}</p>
                    <div className="agency-badges">
                        <span className={`agency-status-badge ${agency.status === 'active' ? 'active' : agency.status === 'pending' ? 'pending' : 'rejected'}`}>
                            {agency.status?.toUpperCase()}
                        </span>
                        {agency.isFeatured && (
                            <span className="agency-featured-badge">
                                ⭐ FEATURED until {new Date(agency.featuredEndDate).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </div>
                {agency.logo && (
                    <div className="agency-logo-container">
                        <img src={agency.logo} alt="Agency Logo" />
                    </div>
                )}
            </div>

            {/* Featured Alert */}
            {agency.isFeatured && (
                <div className="agency-alert-success">
                    ✅ Your agency is currently featured. You are enjoying top placement and priority ranking!
                </div>
            )}

            {/* Pending Alert */}
            {agency.status === 'pending' && (
                <div className="agency-alert-info">
                    ⏳ Your agency is waiting for Admin Approval. You can add properties but you won't appear in public results yet.
                </div>
            )}

            {/* Upgrade / Featured Plans */}
            {!agency.isFeatured && agency.status === 'active' && (
                <div className="agency-upgrade-section">
                    <FeaturedPlans agencyId={agency._id} onUpgrade={() => window.location.reload()} />
                </div>
            )}
        </div>
    );
};

export default AgencyDashboard;
