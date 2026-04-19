import React from 'react';
import './AgentList.css';
import { FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

const AgentList = () => {
  const agents = [
    {
      id: 1,
      name: "New City Estate",
      location: "Lahore",
      forSale: 126,
      forRent: 2,
      logo: "https://via.placeholder.com/80?text=NCE"
    },
    {
      id: 2,
      name: "Badshah Group",
      location: "Islamabad",
      forSale: 88,
      forRent: 12,
      logo: "https://via.placeholder.com/80?text=BG"
    },
    {
      id: 3,
      name: "Markhor Properties",
      location: "Karachi",
      forSale: 107,
      forRent: 1,
      logo: "https://via.placeholder.com/80?text=MP"
    },
    {
      id: 4,
      name: "Square Foot",
      location: "Lahore",
      forSale: 104,
      forRent: 0,
      logo: "https://via.placeholder.com/80?text=SF"
    }
  ];

  return (
    <div className="container py-5">
      <h3 className="mb-4 fw-bold">Titanium Agencies</h3>
      <div className="row g-4">
        {agents.map(agent => (
          <div className="col-lg-3 col-md-6" key={agent.id}>
            <div className="agent-card h-100">
              <div className="agent-card-body text-center">
                <img src={agent.logo} alt={agent.name} className="agent-logo" />
                <h5 className="agent-name">{agent.name}</h5>
                <div className="agent-location">
                  <FaMapMarkerAlt className="me-1 text-muted" />
                  {agent.location}
                </div>
                <div className="agent-stats justify-content-center">
                  <span><strong>{agent.forSale}</strong> for Sale</span>
                  <span>|</span>
                  <span><strong>{agent.forRent}</strong> for Rent</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentList;
