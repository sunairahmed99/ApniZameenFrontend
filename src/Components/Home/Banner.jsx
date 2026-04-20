import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import './Banner.css';
import SearchFilter from './SearchFilter';
import OptimizedImage from '../OptimizedImage';

import { useBanners } from '../../hooks/useBanners';

const Banner = ({ currentCategory, listingType, setListingType, showSearchFilter = true, showHeading = true, city, setCity, children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState(new Set());

  const { displayBanners = [], isLoadingDisplay: isLoading } = useBanners();

  // Current Banner to display
  const currentBanner = displayBanners.length > 0 ? displayBanners[currentIndex] : null;

  // Construct banner style
  const bgImage = currentBanner ? (currentBanner.image || currentBanner.bannerImage) : '';
  
  // For rotation, we keep the index-based logic but let OptimizedImage handle the heavy lifting

  // Preload image function
  const preloadImage = (url) => {
    return new Promise((resolve, reject) => {
      if (preloadedImages.has(url)) {
        resolve(url);
        return;
      }

      const img = new Image();
      img.onload = () => {
        setPreloadedImages(prev => new Set([...prev, url]));
        resolve(url);
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  // Preload current and next images
  useEffect(() => {
    if (!bgImage) return;

    setImageLoaded(false);

    preloadImage(bgImage).then(() => {
      setImageLoaded(true);
    }).catch(err => {
      
      setImageLoaded(true); // Show anyway
    });

    if (displayBanners.length > 1) {
      const nextIndex = (currentIndex + 1) % displayBanners.length;
      const nextBanner = displayBanners[nextIndex];
      const nextImage = nextBanner ? (nextBanner.image || nextBanner.bannerImage) : '';
      if (nextImage) {
        preloadImage(nextImage).catch(() => { });
      }
    }
  }, [bgImage, currentIndex, displayBanners.length]);

  // Rotation Logic
  useEffect(() => {
    if (displayBanners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % displayBanners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [displayBanners.length]);

  return (
    <div className={`banner-section ${!showSearchFilter ? 'mb-0 min-h-auto' : ''}`}>
      {bgImage && (
        <OptimizedImage
          src={bgImage}
          alt="Banner"
          isPriority={currentIndex === 0}
          className="banner-bg-img"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0
          }}
        />
      )}
      <div className="banner-overlay"></div>
      <div className="container position-relative z-index-10 w-100 h-100 d-flex flex-column justify-content-center align-items-center">
        {/* {showHeading && (
          <div className="text-center text-white mb-5">
            <h1 className="display-4 fw-bold mb-3">Search Properties for Sale in Pakistan</h1>
            <p className="lead">With the largest number of property listings</p>
          </div>
        )} */}

        {showSearchFilter && (
          <div className="banner-content">
            <SearchFilter
              currentCategory={currentCategory}
              listingType={listingType}
              setListingType={setListingType} // Fixed prop name
              city={city}
              setCity={setCity} // Fixed prop name
            />
          </div>
        )}

        {children}
      </div>
    </div>
  );
};

export default Banner;
