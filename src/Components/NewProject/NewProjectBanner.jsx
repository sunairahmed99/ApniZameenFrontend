import React, { useMemo } from 'react';
import { useBanners } from '../../hooks/useBanners';
import './NewProjectBanner.css';
import { FaSearch } from 'react-icons/fa';

const NewProjectBanner = () => {
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

    // 2. Fallback to admin banner for 'project' page
    const projectBanner = banners?.find(b => b.page === 'project' && b.active);
    return projectBanner || null;
  }, [banners, publicBanners]);

  const bannerStyle = displayBanner ? { backgroundImage: `url("${displayBanner.image}")` } : {};
  const title = displayBanner?.title || "Find New Projects in Pakistan";
  const subtitle = displayBanner?.subtitle || "Find exciting new real estate projects and investment opportunities";

  return (
    <div className="new-project-banner" style={bannerStyle}>
      <div className="banner-content text-center">
        {/* <h1 className="banner-title">{title}</h1>
        <p className="banner-subtitle">{subtitle}</p> */}

        {/* Button removed as per user request */}


      </div>
    </div >
  );
};

export default NewProjectBanner;
