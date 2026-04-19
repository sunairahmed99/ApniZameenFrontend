import React from 'react';
import PopularLocations from './PopularLocations';
import FooterPromo from './FooterPromo';
import MainFooter from './MainFooter';

const Footer = () => {
  return (
    <div className="footer-wrapper">
      <PopularLocations />
      <FooterPromo />
      <MainFooter />
    </div>
  );
};

export default Footer;
