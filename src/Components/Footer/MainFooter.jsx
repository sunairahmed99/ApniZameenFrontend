import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { useSiteSettings } from '../../hooks/useSettings';
import './MainFooter.css';

const MainFooter = () => {
  const { data: settings } = useSiteSettings();

  return (
    <footer className="main-footer bg-dark text-white py-5">
      <div className="container">
        <div className="row g-4">
          {/* Company */}
          <div className="col-6 col-md-3">
            <h6 className="footer-title text-uppercase fw-bold mb-3">Company</h6>
            <ul className="list-unstyled footer-list">
              {[
                { name: 'About Us', link: '/about' },
                { name: 'Contact Us', link: '/contact-us' },
                { name: 'Jobs', link: '/jobs' },
                { name: 'Help & Support', link: '/support' },
                { name: 'Advertise On Zameen', link: '/advertise' },
                { name: 'Terms of Use', link: '/terms-of-use' }
              ].map((item, index) => (
                <li key={index}><a href={item.link}>{item.name}</a></li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="col-6 col-md-3">
            <h6 className="footer-title text-uppercase fw-bold mb-3">Connect</h6>
            <ul className="list-unstyled footer-list">
              {[
                { name: 'Blog', link: '/blog' },
                { name: 'Real Estate Agents', link: '/agents' },
                { name: 'New Projects', link: '/new-projects' },
                { name: 'Area Guides', link: '/area-guides' },
                { name: 'Buy Property', link: '/buy/all' },
                { name: 'Rent Property', link: '/rent/all' }
              ].map((item, index) => (
                <li key={index}><a href={item.link}>{item.name}</a></li>
              ))}
            </ul>
          </div>

          {/* Head Office / Branches */}
          <div className="col-6 col-md-3">
            {settings?.branches?.length > 0 ? (
              settings.branches.map((branch, idx) => (
                <div key={idx} className="mb-4">
                  <h6 className="footer-title text-uppercase fw-bold mb-3">{branch.title}</h6>
                  {branch.addressLines.map((line, lIdx) => (
                    <p key={lIdx} className="small mb-1">{line}</p>
                  ))}
                </div>
              ))
            ) : (
              <>
                <h6 className="footer-title text-uppercase fw-bold mb-3">Head Office</h6>
                <p className="small mb-2">Pearl One, 94-B/I, MM Alam Road,</p>
                <p className="small mb-3">Gulberg III, Lahore, Pakistan</p>
              </>
            )}

            <p className="small mb-1 mt-3"><span className="fw-bold">{settings?.contactNumber || '0800-APNIZAMEEN (92633)'}</span></p>
            <p className="small text-muted">{settings?.timings || 'Monday To Sunday 9AM To 6PM'}</p>

            <a href={`mailto:${settings?.email || 'info@zameen.com'}`} className="email-link small text-decoration-none text-white d-block mt-2">Email Us</a>
          </div>

          {/* Social & Other */}
          <div className="col-6 col-md-3">
            <h6 className="footer-title text-uppercase fw-bold mb-3">Roshan Digital Account</h6>
            <div className="mb-4">
              <img src="https://placehold.co/100x40?text=RDA" alt="RDA" className="bg-white rounded p-1" />
            </div>

            <h6 className="footer-title text-uppercase fw-bold mb-3">Get Connected</h6>
            <div className="social-icons d-flex gap-2">
              <a href={settings?.socialLinks?.facebook || "https://facebook.com"} target="_blank" rel="noopener noreferrer" className="social-icon bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white"><FaFacebookF /></a>
              <a href={settings?.socialLinks?.instagram || "https://instagram.com"} target="_blank" rel="noopener noreferrer" className="social-icon bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white"><FaInstagram /></a>
              <a href={settings?.socialLinks?.youtube || "https://youtube.com"} target="_blank" rel="noopener noreferrer" className="social-icon bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white"><FaYoutube /></a>
              <a href={settings?.socialLinks?.linkedin || "https://linkedin.com"} target="_blank" rel="noopener noreferrer" className="social-icon bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white"><FaLinkedinIn /></a>
              <a href={settings?.socialLinks?.twitter || "https://twitter.com"} target="_blank" rel="noopener noreferrer" className="social-icon bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white"><FaTwitter /></a>
            </div>
          </div>
        </div>

        <div className="border-top border-secondary mt-5 pt-4 text-center text-md-start">
          <p className="small text-muted mb-0">Copyright © 2007 - 2026 Zameen.com. All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
