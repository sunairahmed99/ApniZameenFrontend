import React from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer/Footer';
import AgentBanner from '../Components/Agents/AgentBanner';
import TitaniumAgencies from '../Components/Agents/TitaniumAgencies';
import FeaturedAgencies from '../Components/Agents/FeaturedAgencies';
import BrowseAgenciesByCity from '../Components/Agents/BrowseAgenciesByCity';
import SEO from '../Components/SEO';

const Agents = () => {
  return (
    <div className="page-fade-in">
      <SEO
        title="Real Estate Agents & Agencies in Pakistan | Zameen"
        description="Find verified real estate agents and agencies across Pakistan. Connect with Titanium and Featured agencies for buying, selling, and renting properties in major cities."
        keywords="real estate agents Pakistan, property agents, agencies, Titanium agencies, featured agencies, Karachi agents, Lahore agents, Islamabad agents"
      />
      <Navbar />
      <AgentBanner />
      <div style={{ backgroundColor: '#f8f9fa' }}>
        <TitaniumAgencies />
        <FeaturedAgencies />
        <BrowseAgenciesByCity />
      </div>
      <Footer />
    </div>
  );
};

export default Agents;
