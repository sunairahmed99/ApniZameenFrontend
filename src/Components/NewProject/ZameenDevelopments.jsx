import React from 'react';
import './ZameenDevelopments.css';
import { Link } from 'react-router-dom';
import HorizontalScroll from './HorizontalScroll';

const ZameenDevelopments = () => {
  const developments = [
    {
      id: 1,
      name: 'Zameen Aurum',
      slug: 'zameen-aurum',
      location: 'Gulberg 3, Lahore',
      price: 'PKR 1.85 Crore - 3.1 Crore',
      image: 'https://images.zameen.com/projects/zameen_aurum_2001/gallery/zameen_aurum_main_banner_4349.jpg'
    },
    {
      id: 2,
      name: 'Zameen Opal',
      slug: 'zameen-opal',
      location: 'Land Breeze Housing Society, Lahore',
      price: 'PKR 70 Lac - 1.5 Crore',
      image: 'https://images.zameen.com/projects/zameen_opal_2161/gallery/zameen_opal_main_banner_4329.jpg'
    },
    {
      id: 3,
      name: 'Zameen Quadrangle',
      slug: 'zameen-quadrangle',
      location: 'Zafar Ali Road, Lahore',
      price: 'PKR 2.1 Crore - 4.5 Crore',
      image: 'https://images.zameen.com/projects/zameen_quadrangle_2341/gallery/zameen_quadrangle_main_banner_4369.jpg'
    },
    {
      id: 4,
      name: 'Mall 35',
      slug: 'mall-35',
      location: 'Rawalpindi',
      price: 'PKR 1.2 Crore - 2.8 Crore',
      image: 'https://images.zameen.com/projects/mall_35_1841/gallery/mall_35_main_banner_4289.jpg'
    },
    {
      id: 5,
      name: 'Zameen Neo',
      slug: 'zameen-neo',
      location: 'Gulberg, Lahore',
      price: 'PKR 1.5 Crore - 3.5 Crore',
      image: 'https://images.zameen.com/projects/zameen_neo_6541/gallery/zameen_neo_main_banner_8319.jpg'
    }
  ];

  return (
    <div className="zameen-developments">
      <div className="zameen-dev-container">
        <h2 className="section-title">Projects by Zameen Developments</h2>
        <HorizontalScroll>
          {developments.map((dev) => (
            <Link to={`/project-zameen/${dev.slug}`} key={dev.id} className="text-decoration-none">
              <div className="dev-card">
                <img src={dev.image} alt={dev.name} className="dev-image" />
                <div className="dev-info text-dark">
                  <div className="dev-price">{dev.price}</div>
                  <div className="dev-name">{dev.name}</div>
                  <div className="dev-location">{dev.location}</div>
                </div>
              </div>
            </Link>
          ))}
        </HorizontalScroll>
      </div>
    </div>
  );
};

export default ZameenDevelopments;
