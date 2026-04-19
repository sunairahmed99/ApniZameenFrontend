import React from 'react';
import { useDashboardStats } from '../../../hooks/useDashboardStats';
import './AdminDashboard.css';
import { FaUsers, FaStore, FaBuilding, FaCity, FaBriefcase, FaEnvelope, FaBullhorn, FaImages, FaSearch, FaPhone, FaClock, FaInfoCircle, FaCheckCircle, FaChartLine, FaEye } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Chart from 'react-apexcharts';

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { data: statsData = {
    sellers: 0,
    properties: 0,
    projects: 0,
    agencies: 0,
    inquiries: 0,
    banners: 0,
    revenue: { Banner: 0, Agency: 0, Property: 0 },
    revenueRadarData: [],
    charts: { typeDistribution: [], growthData: [] }
  }, isLoading: loading } = useDashboardStats(user?.token);

  const stats = [
    { title: 'Total Sellers', value: statsData.sellers || 0, icon: <FaStore />, color: '#00d4a1', bg: 'rgba(0, 212, 161, 0.1)' },
    { title: 'Total Properties', value: statsData.properties || 0, icon: <FaBuilding />, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
    { title: 'Total Projects', value: statsData.projects || 0, icon: <FaCity />, color: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)' },
    { title: 'Total Agencies', value: statsData.agencies || 0, icon: <FaBriefcase />, color: '#0dcaf0', bg: 'rgba(13, 202, 240, 0.1)' },
    { title: 'Total Inquiries', value: statsData.inquiries || 0, icon: <FaEnvelope />, color: '#eab308', bg: 'rgba(234, 179, 8, 0.1)' },
    { title: 'Banner Requests', value: statsData.banners || 0, icon: <FaBullhorn />, color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)' },
    { title: 'Website Visits', value: statsData.analytics?.visit || 0, icon: <FaUsers />, color: '#00d4a1', bg: 'rgba(0, 212, 161, 0.1)' },
    { title: 'Search Trends', value: statsData.analytics?.search || 0, icon: <FaSearch />, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
    { title: 'Contact Clicks', value: statsData.analytics?.contact_click || 0, icon: <FaPhone />, color: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)' },
    { title: 'Property Views', value: statsData.analytics?.property_view || 0, icon: <FaEye />, color: '#eab308', bg: 'rgba(234, 179, 8, 0.1)' },
  ];

  const revenueStats = [
    { title: 'Agency Revenue', value: statsData.revenue?.Agency || 0, icon: <FaBriefcase />, color: '#00d4a1', bg: 'rgba(0, 212, 161, 0.1)' },
    { title: 'Banner Revenue', value: statsData.revenue?.Banner || 0, icon: <FaImages />, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
    { title: 'Property Revenue', value: statsData.revenue?.Property || 0, icon: <FaBuilding />, color: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)' },
  ];

  // ApexCharts Configs
  const radarOptions = {
    chart: { type: 'radar', background: 'transparent', toolbar: { show: false } },
    theme: { mode: 'dark' },
    colors: ['#00d4a1'],
    xaxis: { 
        categories: statsData.revenueRadarData.map(d => d.subject),
        labels: { style: { colors: '#94a3b8' } }
    },
    yaxis: { show: false },
    plotOptions: { radar: { polygons: { strokeColors: 'rgba(255, 255, 255, 0.05)', fill: { colors: ['transparent', 'transparent'] } } } },
    fill: { opacity: 0.3 }
  };
  const radarSeries = [{
    name: 'Revenue',
    data: statsData.revenueRadarData.map(d => d.A)
  }];

  const areaOptions = {
    chart: { type: 'area', background: 'transparent', toolbar: { show: false } },
    theme: { mode: 'dark' },
    colors: ['#3b82f6'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    xaxis: { 
        categories: statsData.charts.growthData.map(d => d.name),
        labels: { style: { colors: '#94a3b8' } }
    },
    yaxis: { labels: { style: { colors: '#94a3b8' } } },
    grid: { borderColor: 'rgba(255, 255, 255, 0.05)', strokeDashArray: 4 },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1 } }
  };
  const areaSeries = [{ name: 'Properties', data: statsData.charts.growthData.map(d => d.properties) }];

  const donutOptions = {
    chart: { type: 'donut', background: 'transparent' },
    theme: { mode: 'dark' },
    labels: statsData.charts.typeDistribution.map(d => d.name),
    colors: ['#00d4a1', '#3b82f6', '#a855f7', '#eab308', '#f97316'],
    legend: { position: 'bottom' },
    stroke: { show: false },
    dataLabels: { enabled: false }
  };
  const donutSeries = statsData.charts.typeDistribution.map(d => d.value);

  return (
    <div className="admin-dashboard animate-fade-in">
      <div className="dashboard-header-modern mb-5">
        <div className="welcome-section">
          <h1 className="welcome-title">Administrative Dashboard</h1>
          <p className="welcome-subtitle">System insight and overview. Monitoring platform performance.</p>
        </div>
        <div className="header-date-pill">
          <FaClock className="me-2" /> {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {loading && <div className="p-5 text-center text-muted"><div className="spinner-border text-primary"></div></div>}

      {/* Stats Grid */}
      <h3 className="section-title-modern mb-4">Platform Statistics</h3>
      <div className="stats-grid-modern mb-5">
        {stats.map((stat, index) => (
          <div className="stat-card-modern" key={index}>
            <div className="stat-card-inner">
                <div className="stat-icon-box" style={{ backgroundColor: stat.bg, color: stat.color }}>
                    {stat.icon}
                </div>
                <div className="stat-info">
                    <div className="stat-label">{stat.title}</div>
                    <div className="stat-value-large">{stat.value}</div>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Section */}
      <h3 className="section-title-modern mb-4">Revenue Overview</h3>
      <div className="stats-grid-modern mb-5">
        {revenueStats.map((stat, index) => (
          <div className="stat-card-modern revenue-card" key={index}>
            <div className="stat-card-inner">
                <div className="stat-icon-box" style={{ backgroundColor: stat.bg, color: stat.color }}>
                    {stat.icon}
                </div>
                <div className="stat-info">
                    <div className="stat-label">{stat.title}</div>
                    <div className="stat-value-large">Rs {stat.value.toLocaleString()}</div>
                    <div className="stat-trend positive">
                      <span className="trend-arrow">↑</span> 8.4% <span className="trend-label">Active Growth</span>
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-grid-modern">
        <div className="chart-card-modern">
          <div className="chart-header-modern">
            <h4 className="chart-title-modern">Revenue Polygon</h4>
          </div>
          <div className="chart-content-modern">
            <Chart options={radarOptions} series={radarSeries} type="radar" height={320} />
          </div>
        </div>

        <div className="chart-card-modern lg-col">
          <div className="chart-header-modern">
            <h4 className="chart-title-modern">System Growth Trend</h4>
          </div>
          <div className="chart-content-modern">
            <Chart options={areaOptions} series={areaSeries} type="area" height={320} />
          </div>
        </div>

        <div className="chart-card-modern">
          <div className="chart-header-modern">
            <h4 className="chart-title-modern">Lead Distribution</h4>
          </div>
          <div className="chart-content-modern">
            <Chart options={donutOptions} series={donutSeries} type="donut" height={320} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

