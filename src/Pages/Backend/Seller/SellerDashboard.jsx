import React from 'react';
import './SellerDashboard.css';
import { FaStore, FaBoxOpen, FaShoppingCart, FaEye, FaClock, FaStar, FaComments, FaInfoCircle, FaCheckCircle, FaChartLine, FaRocket } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useSellerDashboardStats } from '../../../hooks/useDashboardStats';
import { useSellerScoreboard } from '../../../hooks/useSellerFeatures';
import { useSellerProperties } from '../../../hooks/useProperties';
import Chart from 'react-apexcharts';

const SellerDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const { data: stats = {
    properties: 0,
    activeListings: 0,
    inactiveListings: 0,
    boostedProperties: 0,
    views: 0,
    leads: 0,
    unreadMessages: 0,
    inquiries: 0,
    pendingInquiries: 0,
    propertyDistribution: [],
    inquiriesTrend: [],
    performanceRadar: []
  }, isLoading } = useSellerDashboardStats(user?.token);

  const { data: scoreboard = [] } = useSellerScoreboard(user?.token);
  const myScoreboard = scoreboard.find(s => s._id === user?._id) || { soldCount: 0, rentedCount: 0 };

  const { data: { properties: myProperties = [] } = {}, isLoading: propertiesLoading } = useSellerProperties(user?.token, { limit: 4, sort: 'newest' });

  const statItems = [
    { title: 'Total Properties', value: stats.properties, icon: <FaBoxOpen />, color: '#00d4a1', bg: 'rgba(0, 212, 161, 0.1)' },
    { title: 'Active Listings', value: stats.activeListings, icon: <FaCheckCircle />, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
    { title: 'Total Agencies', value: stats.agencies || 0, icon: <FaStore />, color: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)' },
    { title: 'Boosted / Featured', value: stats.boostedProperties, icon: <FaStar />, color: '#eab308', bg: 'rgba(234, 179, 8, 0.1)' },
    { title: 'Total Views', value: stats.views, icon: <FaEye />, color: '#00d4a1', bg: 'rgba(0, 212, 161, 0.1)' },
    { title: 'Total Leads', value: stats.leads, icon: <FaShoppingCart />, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
    { title: 'Unread Messages', value: stats.unreadMessages, icon: <FaComments />, color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)' },
    { title: 'Total Inquiries', value: stats.inquiries, icon: <FaInfoCircle />, color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)' },
  ];

  // Chart Configs
  const donutOptions = {
    chart: { type: 'donut', background: 'transparent', foreColor: '#94a3b8' },
    theme: { mode: 'dark' },
    labels: ['Properties Sold', 'Properties Rented'],
    colors: ['#00d4a1', '#3b82f6'],
    legend: { position: 'bottom', fontSize: '13px', fontFamily: 'Inter' },
    stroke: { show: false },
    plotOptions: { pie: { donut: { size: '75%', labels: { show: true, total: { show: true, label: 'Total Deal Value', color: '#94a3b8' }, value: { color: '#fff' } } } } },
    dataLabels: { enabled: false }
  };
  const donutSeries = [myScoreboard.soldCount, myScoreboard.rentedCount];

  const areaOptions = {
    chart: { type: 'area', background: 'transparent', toolbar: { show: false }, animations: { enabled: true, speed: 1000 } },
    theme: { mode: 'dark' },
    colors: ['#00d4a1'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    xaxis: { 
        categories: stats.inquiriesTrend.map(d => d.date),
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { style: { colors: '#94a3b8' } }
    },
    yaxis: { labels: { style: { colors: '#94a3b8' } } },
    grid: { borderColor: 'rgba(255, 255, 255, 0.05)', strokeDashArray: 4 },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1, stopS: [0, 90, 100] } }
  };
  const areaSeries = [{ name: 'Inquiries', data: stats.inquiriesTrend.map(d => d.value) }];

  const barOptions = {
    chart: { type: 'bar', background: 'transparent', toolbar: { show: false } },
    theme: { mode: 'dark' },
    plotOptions: { bar: { borderRadius: 8, columnWidth: '45%', distributed: true } },
    dataLabels: { enabled: false },
    colors: ['#00d4a1', '#3b82f6', '#a855f7'],
    xaxis: { 
        categories: ['Views', 'Leads', 'Inquiries'],
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { style: { colors: '#94a3b8' } }
    },
    yaxis: { labels: { style: { colors: '#94a3b8' } } },
    grid: { show: false },
    legend: { show: false }
  };
  const barSeries = [{
    name: 'Stats',
    data: [stats.views, stats.leads, stats.inquiries]
  }];

  const radarOptions = {
    chart: { type: 'radar', background: 'transparent', toolbar: { show: false } },
    theme: { mode: 'dark' },
    colors: ['#00d4a1'],
    xaxis: { 
        categories: stats.performanceRadar.map(d => d.subject),
        labels: { style: { colors: '#94a3b8' } }
    },
    yaxis: { show: false },
    plotOptions: { radar: { polygons: { strokeColors: 'rgba(255, 255, 255, 0.05)', fill: { colors: ['transparent', 'transparent'] } } } },
    fill: { opacity: 0.3 }
  };
  const radarSeries = [{
    name: 'Performance',
    data: stats.performanceRadar.map(d => d.A)
  }];

  return (
    <div className="seller-dashboard animate-fade-in">
      <div className="dashboard-header-modern mb-5">
        <div className="welcome-section">
          <h1 className="welcome-title">Dashboard Overview</h1>
          <p className="welcome-subtitle">Welcome back, <span className="highlight-user-name">{user ? user.name : 'Seller'}</span>! Here's what's happening today.</p>
        </div>
        <div className="header-date-pill">
          <FaClock className="me-2" /> {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {isLoading && <div className="p-5 text-center text-muted"><div className="spinner-border text-light"></div></div>}

      {/* Stats Grid */}
      <div className="stats-grid-modern mb-5">
        {statItems.map((stat, index) => (
          <div className="stat-card-modern" key={index}>
            <div className="stat-card-inner">
              <div className="stat-icon-box" style={{ backgroundColor: stat.bg, color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-info">
                <div className="stat-label">{stat.title}</div>
                <div className="stat-value-large">{stat.value}</div>
                <div className="stat-trend positive">
                  <span className="trend-arrow">↑</span> 12% <span className="trend-label">Last month</span>
                </div>
              </div>
            </div>
            <div className="stat-card-chart-mini">
              <div className="sparkline-bar" style={{ height: '40%', background: stat.color }}></div>
              <div className="sparkline-bar" style={{ height: '60%', background: stat.color }}></div>
              <div className="sparkline-bar" style={{ height: '30%', background: stat.color }}></div>
              <div className="sparkline-bar" style={{ height: '80%', background: stat.color }}></div>
              <div className="sparkline-bar" style={{ height: '50%', background: stat.color }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-grid-modern">
        {/* Market Performance */}
        <div className="chart-card-modern">
          <div className="chart-header-modern">
            <h4 className="chart-title-modern">Status Analysis</h4>
            <FaInfoCircle className="text-secondary" />
          </div>
          <div className="chart-content-modern">
            <Chart options={radarOptions} series={radarSeries} type="radar" height={320} width="100%" />
          </div>
        </div>

        {/* Revenue Generation (Bar chart replacement) */}
        <div className="chart-card-modern lg-col">
          <div className="chart-header-modern">
            <h4 className="chart-title-modern">Revenue Generation</h4>
            <div className="chart-legend-fake">
              <span className="dot deals"></span> Deals
              <span className="dot value"></span> Deal value
            </div>
          </div>
          <div className="chart-content-modern">
            <Chart options={barOptions} series={barSeries} type="bar" height={320} width="100%" />
          </div>
        </div>

        {/* Weekly Inquiry Trends */}
        <div className="chart-card-modern">
          <div className="chart-header-modern">
            <h4 className="chart-title-modern">Weekly Trends</h4>
          </div>
          <div className="chart-content-modern">
            <Chart options={areaOptions} series={areaSeries} type="area" height={320} width="100%" />
          </div>
        </div>

        {/* Listing Mix */}
        <div className="chart-card-modern">
          <div className="chart-header-modern">
            <h4 className="chart-title-modern">Deal Distribution</h4>
          </div>
          <div className="chart-content-modern">
            <Chart options={donutOptions} series={donutSeries} type="donut" height={320} width="100%" />
          </div>
        </div>
      </div>

      {/* Explore Grid */}
      <div className="mt-5 mb-4 d-flex justify-content-between align-items-center">
        <h3 className="section-title-modern">Explore Your Properties</h3>
        <Link to="/seller/properties" className="btn-view-all text-decoration-none">View All</Link>
      </div>

      {propertiesLoading ? (
         <div className="p-4 text-center text-muted"><div className="spinner-border spinner-border-sm text-light"></div> Loading properties...</div>
      ) : myProperties.length === 0 ? (
         <div className="p-4 text-center text-muted border rounded border-secondary" style={{ background: 'var(--card-dark)' }}>No properties found. <Link to="/seller/add-property" className="text-primary text-decoration-none ms-2">Add New</Link></div>
      ) : (
        <div className="property-mock-grid">
           {myProperties.map(p => (
               <div key={p._id} className="property-mock-card h-100 d-flex flex-column">
                   <div className="property-mock-img" style={{ backgroundImage: `url(${p.images?.[0] || 'https://via.placeholder.com/400x300'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                       {p.isFeatured ? (
                          <div className="property-badge-mock bg-warning text-dark"><FaStar className="me-1"/> Featured</div>
                       ) : p.isBoosted ? (
                          <div className="property-badge-mock bg-danger text-white"><FaRocket className="me-1"/> Boosted</div>
                       ) : (
                          <div className="property-badge-mock text-capitalize">{p.status || 'Pending'}</div>
                       )}
                   </div>
                   <div className="property-mock-body flex-grow-1 d-flex flex-column">
                       <div className="property-mock-header mb-auto">
                          <div className="property-mock-info" style={{ overflow: 'hidden', flex: 1, paddingRight: '10px' }}>
                              <h5 className="property-mock-name text-truncate" title={p.title}>{p.title}</h5>
                              <p className="property-mock-loc text-truncate" title={`${p.areaName || ''}${p.areaName && p.city ? ', ' : ''}${p.city || ''}`}>
                                  {p.areaName}{p.areaName && p.city ? ', ' : ''}{p.city}
                              </p>
                          </div>
                          <div className="property-mock-price" style={{ fontSize: '1rem', whiteSpace: 'nowrap' }}>Rs {p.price?.toLocaleString() || 'N/A'}</div>
                       </div>
                       <div className="property-mock-footer mt-3">
                           <span title="Property Type"><FaStore className="me-1" /> {p.propertyType || p.type || 'N/A'}</span>
                           <span title="Views"><FaEye className="me-1" /> {p.views || 0}</span>
                           <span title="Size"><FaChartLine className="me-1" /> {p.size || (p.area?.value ? `${p.area.value} ${p.area.unit || 'Marla'}` : 'N/A')}</span>
                       </div>
                   </div>
               </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;

