import React from 'react';
import OptimizedImage from '../OptimizedImage';
import './FooterPromo.css';
import { FaApple, FaGooglePlay, FaQrcode } from 'react-icons/fa';

const FooterPromo = () => {
  return (
    <div className="footer-promo-section">
      {/* App Promo */}
      <div className="container py-5 border-bottom">
        <div className="row align-items-center justify-content-center text-center text-md-start">
          <div className="col-md-6 mb-4 mb-md-0">
            <h3 className="text-success fw-bold">Get the ApniZameen.pk App</h3>
            <p className="text-muted mb-4">Experience the convenience of buying and renting property on the go with our future mobile app.</p>
            <div className="d-flex gap-3 justify-content-center justify-content-md-start" style={{ opacity: 0.6 }}>
              <div className="app-store-btn bg-dark text-white rounded p-2 d-flex align-items-center px-3">
                <FaApple size={24} className="me-2" />
                <div className="text-start">
                  <div className="small-text" style={{ fontSize: '10px' }}>Download on the</div>
                  <div className="fw-bold" style={{ lineHeight: '1' }}>App Store</div>
                </div>
              </div>
              <div className="app-store-btn bg-dark text-white rounded p-2 d-flex align-items-center px-3" style={{ cursor: 'not-allowed' }}>
                <FaGooglePlay size={20} className="me-2" />
                <div className="text-start">
                  <div className="small-text" style={{ fontSize: '10px' }}>GET IT ON</div>
                  <div className="fw-bold" style={{ lineHeight: '1' }}>Google Play</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 text-center">
            {/* Phone Image */}
            <div className="phone-mockup mx-auto d-flex align-items-center justify-content-center">
              <OptimizedImage 
                  src="https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="App Mockup" 
                  width={200} 
                  height={400} 
                  className="img-fluid rounded shadow" 
                  style={{ maxHeight: '200px', filter: 'grayscale(0.5)' }} 
              />
            </div>
          </div>
          <div className="col-md-2 text-center">
            <div className="qr-code-wrapper">
              <div className="coming-soon-badge bg-success text-white py-1 px-3 rounded-pill d-inline-block mb-2 small fw-bold">COMING SOON</div>
              <p className="small mt-2 mb-0 fw-bold">Our mobile app is on the way! Stay tuned for updates.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default FooterPromo;
