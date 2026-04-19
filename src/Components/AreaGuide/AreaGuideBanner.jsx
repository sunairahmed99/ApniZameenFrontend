import React, { useMemo } from 'react';
import { useBanners } from '../../hooks/useBanners';
import './AreaGuideBanner.css';
import { FaSearch } from 'react-icons/fa';

const AreaGuideBanner = () => {
    const { banners, publicBanners } = useBanners();

    const displayBanner = useMemo(() => {
        // 1. Check for random public ad first (matching previous logic)
        if (publicBanners && publicBanners.length > 0) {
            const randomIndex = Math.floor(Math.random() * publicBanners.length);
            const publicAd = publicBanners[randomIndex];
            return {
                image: publicAd.bannerImage,
                title: publicAd.title,
                subtitle: publicAd.description,
                link: publicAd.redirectUrl,
                buttonText: 'View Details'
            };
        }

        // 2. Fallback to admin banner for 'guide' page
        const guideBanner = banners?.find(b => b.page === 'guide' && b.active);
        return guideBanner || null;
    }, [banners, publicBanners]);

    const bannerStyle = displayBanner ? { backgroundImage: `url("${displayBanner.image}")` } : {};
    const title = displayBanner?.title || "Explore Societies in Pakistan";
    const subtitle = displayBanner?.subtitle || "Zameen provides you with a vibe of what every day looks like in different housing societies of Pakistan";

    return (
        <div className="ag-banner-container" style={bannerStyle}>
            <div className="ag-banner-content text-center">
                {/* <h1 className="ag-banner-title">{title}</h1>
                <p className="ag-banner-subtitle">
                    {subtitle}
                </p> */}

                {displayBanner && displayBanner.link && (
                    <div style={{ marginBottom: '20px' }}>
                        <a
                            href={displayBanner.link}
                            className="btn btn-success"
                            style={{ padding: '10px 20px', fontWeight: 'bold' }}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {displayBanner.buttonText || 'Learn More'}
                        </a>
                    </div>
                )}

                <div className="ag-search-box">
                    <div className="ag-input-group">
                        <label>City</label>
                        <input type="text" value="Lahore" readOnly />
                    </div>
                    <div className="ag-input-group border-left">
                        <label>Society</label>
                        <input type="text" placeholder="Search Societies" />
                    </div>
                    <button className="ag-search-btn">
                        <FaSearch className="mr-2" /> Search
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AreaGuideBanner;
