import React from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer/Footer';
import NewProjectBanner from '../Components/NewProject/NewProjectBanner';
import DiscoverNewProjects from '../Components/NewProject/DiscoverNewProjects';
import SEO from '../Components/SEO';

const NewProjects = () => {
  return (
    <div className="page-fade-in">
      <SEO
        title="New Real Estate Projects in Pakistan | Zameen"
        description="Discover new real estate projects and housing societies across Pakistan. Browse apartments, villas, and plots in upcoming projects in Islamabad, Lahore, Karachi, and other major cities."
        keywords="new projects Pakistan, housing societies, real estate projects, new apartments, new villas, upcoming projects, Islamabad projects, Lahore projects, Karachi projects"
      />
      <Navbar />
      <NewProjectBanner />
      <div style={{ backgroundColor: '#fff', minHeight: '80vh' }}>
        <div className="container py-5">
          <DiscoverNewProjects />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NewProjects;
