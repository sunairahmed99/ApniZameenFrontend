import React, { useEffect, useState, useMemo } from 'react';
import { useBanners } from '../../hooks/useBanners';
import './AgentBanner.css';

const AgentBanner = () => {
  const { banners, publicBanners } = useBanners();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Combine and memoize banners logic
  const displayBanners = useMemo(() => {
    let combined = [];

    // 1. Admin Banners (Agent Page & Active)
    if (banners && Array.isArray(banners)) {
      const admin = banners.filter(b => b.page === 'agent' && b.active);
      combined = [...combined, ...admin];
    }

    // 2. Seller Banners (Public)
    if (publicBanners && Array.isArray(publicBanners)) {
      const sellerBanners = publicBanners.map(b => ({
        ...b,
        image: b.bannerImage,
        subtitle: b.description,
        link: b.redirectUrl,
        buttonText: 'View Details',
        isSeller: true
      }));
      combined = [...combined, ...sellerBanners];
    }

    return combined;
  }, [banners, publicBanners]);

  // Rotation Logic
  useEffect(() => {
    if (displayBanners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % displayBanners.length);
      }, 300000); // 5 minutes
      return () => clearInterval(interval);
    }
  }, [displayBanners]);

  const currentBanner = displayBanners.length > 0 ? displayBanners[currentIndex] : null;

  // Construct banner styles and content
  const displayBanner = currentBanner ? {
    image: currentBanner.image || currentBanner.bannerImage,
    title: currentBanner.title,
    subtitle: currentBanner.subtitle,
    link: currentBanner.link,
    buttonText: currentBanner.buttonText || 'Learn More'
  } : null;

  const bannerStyle = displayBanner ? { backgroundImage: `url("${displayBanner.image}")` } : {};
  const title = displayBanner?.title || "Find Top Real Estate Agents in Pakistan";
  const subtitle = displayBanner?.subtitle || "Search the real estate agents in Pakistan dealing in properties for sale and rent.";

  return (
    <div className="agent-banner" style={bannerStyle}>
      <div className="container text-center">
        {/* <h1>{title}</h1>
        <p>{subtitle}</p> */}
        {displayBanner && displayBanner.link && (
          <a
            href={displayBanner.link}
            className="btn btn-light mt-3"
            style={{ fontWeight: 'bold', color: '#28a745' }}
            target="_blank"
            rel="noopener noreferrer"
          >
            {displayBanner.buttonText || 'Learn More'}
          </a>
        )}
      </div>
    </div >
  );
};

export default AgentBanner;
