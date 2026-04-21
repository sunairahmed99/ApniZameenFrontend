import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Banner from '../Components/Home/Banner';
import BrowseProperties from '../Components/Home/BrowseProperties';
import FeaturedProperties from '../Components/Home/FeaturedProperties';

import TitaniumAgencies from '../Components/Home/TitaniumAgencies';
import ZameenProjects from '../Components/Home/ZameenProjects';
import ZameenCommunity from '../Components/Home/ZameenCommunity';
import Footer from '../Components/Footer/Footer';
import SEO from '../Components/SEO';
import { generateOrganizationStructuredData } from '../utils/seo';
import LazySection from '../Components/Common/LazySection';

const Homepage = () => {
  const location = useLocation();
  const initialCategory = typeof location.state?.category !== 'undefined' ? location.state.category : 'HOMES';
  const initialType = typeof location.state?.type !== 'undefined' ? location.state.type : 'BUY';
  const [currentCategory, setCurrentCategory] = useState(initialCategory);
  const [listingType, setListingType] = useState(initialType);
  const [city, setCity] = useState('Karachi'); // Lifted state for filtering

  useEffect(() => {
    // keep URL-driven state sync without immediate set in effect when unchanged
    if (location.state?.category && location.state.category !== currentCategory) {
      setCurrentCategory(location.state.category);
    }
    if (location.state?.type && location.state.type !== listingType) {
      setListingType(location.state.type);
    }
  }, [location.state, currentCategory, listingType]);

  return (
    <div>
      <SEO
        title={`Zameen - Buy, Sell & Rent Properties in ${city} | Pakistan's #1 Property Portal`}
        description={`Find the best properties for sale and rent in ${city}, Pakistan. Browse houses, plots, commercial properties, and new projects. Connect with verified agents and sellers.`}
        keywords={`property ${city}, real estate ${city}, houses for sale ${city}, plots ${city}, commercial property ${city}, rent ${city}, Pakistan property`}
        structuredData={generateOrganizationStructuredData()}
      />
      <Navbar
        currentCategory={currentCategory}
        setCurrentCategory={setCurrentCategory}
        listingType={listingType}
        setListingType={setListingType}
      />
      <Banner
        currentCategory={currentCategory}
        listingType={listingType}
        setListingType={setListingType}
        city={city}
        setCity={setCity}
        showHeading={true}
      />
      
      <LazySection height="200px">
        <BrowseProperties listingType={listingType} city={city} />
      </LazySection>

      <LazySection height="500px">
        <FeaturedProperties />
      </LazySection>

      <LazySection height="400px">
        <ZameenProjects />
      </LazySection>

      <LazySection height="400px">
        <TitaniumAgencies />
      </LazySection>

      <LazySection height="300px">
        <ZameenCommunity />
      </LazySection>

      <LazySection height="300px">
        <Footer />
      </LazySection>
    </div>
  );
};

export default Homepage;
