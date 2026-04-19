import React from 'react';
import Navbar from '../Components/Navbar';
import AreaGuideBanner from '../Components/AreaGuide/AreaGuideBanner';
import FeaturedSocieties from '../Components/AreaGuide/FeaturedSocieties';
import AreaGuideInfo from '../Components/AreaGuide/AreaGuideInfo';
import MostViewedSocieties from '../Components/AreaGuide/MostViewedSocieties';
import Footer from '../Components/Footer/Footer';
import SEO from '../Components/Common/SEO';


// Simple inline component for App Download if it doesn't exist
const AppDownloadSection = () => (
    <div style={{ padding: '40px 20px', textAlign: 'center', backgroundColor: '#fff', borderTop: '1px solid #eee' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#28a745', marginBottom: '10px' }}>Get the ApniZameen.pk App</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>Your perfect home search experience on the go. Stay tuned for the official launch!</p>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', opacity: 0.6 }}>
                <img src="https://assets.zameen.com/assets/area_guides_web_assets/images/app-store.png" alt="App Store" style={{ height: '40px', filter: 'grayscale(1)' }} />
                <img src="https://assets.zameen.com/assets/area_guides_web_assets/images/google-play.png" alt="Google Play" style={{ height: '40px', filter: 'grayscale(1)' }} />
            </div>
            <div style={{ backgroundColor: '#28a745', color: 'white', padding: '5px 20px', borderRadius: '50px', fontSize: '14px', fontWeight: '700' }}>
                MOBILE APP COMING SOON
            </div>
        </div>
    </div>
);

const AreaGuide = () => {
    return (
        <div className="area-guide-page">
            <SEO
                title="Area Guides - Explore Localities & Societies in Pakistan | Zameen"
                description="Explore comprehensive area guides for localities and housing societies across Pakistan. Get detailed information about amenities, prices, and lifestyle in major cities."
                keywords="area guides Pakistan, locality guides, housing societies, DHA, Bahria Town, society information, Pakistan localities"
            />
            <Navbar />
            <AreaGuideBanner />
            <FeaturedSocieties />
            <AreaGuideInfo />
            <MostViewedSocieties />
            <AppDownloadSection />
            <Footer />
        </div>
    );
};

export default AreaGuide;
