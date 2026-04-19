import React from 'react';
import './FeaturedSocieties.css';

const societies = [
    { id: 1, name: 'Bahria Town', city: 'Lahore', image: 'https://images.unsplash.com/photo-1592595896551-12b371d546d5?q=80&w=600&auto=format&fit=crop' },
    { id: 2, name: 'Park View City', city: 'Lahore', image: 'https://images.unsplash.com/photo-1416862291207-4ca732144d83?q=80&w=600&auto=format&fit=crop' },
    { id: 3, name: 'Lake City', city: 'Lahore', image: 'https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?q=80&w=600&auto=format&fit=crop' },
    { id: 4, name: 'Lahore Smart City', city: 'Lahore', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=600&auto=format&fit=crop' },
    { id: 5, name: 'Central Park', city: 'Lahore', image: 'https://images.unsplash.com/photo-1545625477-873d63c5a31a?q=80&w=600&auto=format&fit=crop' },
    { id: 6, name: 'LDA Avenue', city: 'Lahore', image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=600&auto=format&fit=crop' },
];

const FeaturedSocieties = () => {
    return (
        <div className="ag-featured-container">
            <div className="ag-featured-grid">
                {societies.map(soc => (
                    <div key={soc.id} className="ag-society-card" style={{ backgroundImage: `url(${soc.image})` }}>
                        <div className="ag-society-card-overlay">
                            <h3 className="ag-society-name">{soc.name}</h3>
                            <p className="ag-society-city">{soc.city}</p>
                            <span className="ag-explore-link">Explore &gt;</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturedSocieties;
