import React, { useState, useEffect } from 'react';
import { FaTrophy, FaMedal, FaAward, FaStar } from 'react-icons/fa';
import { useSellerScoreboard } from '../../../hooks/useSellerFeatures';
import { useSelector } from 'react-redux';
import Chart from 'react-apexcharts';

const SellerScoreboard = () => {
    const { user } = useSelector((state) => state.auth);
    const { data: stats = null, isLoading } = useSellerScoreboard(user?.token);
    const scoreboard = stats || [];

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1:
                return <FaTrophy className="text-warning" size={24} />;
            case 2:
                return <FaMedal className="text-secondary" size={22} />;
            case 3:
                return <FaAward className="text-danger" size={20} />;
            default:
                return <span className="text-muted fw-bold">{rank}</span>;
        }
    };

    const getRowClass = (rank) => {
        switch (rank) {
            case 1:
                return 'table-warning';
            case 2:
                return 'table-light';
            case 3:
                return 'table-danger bg-opacity-10';
            default:
                return '';
        }
    };

    const chartOptions = {
        chart: { type: 'bar', toolbar: { show: false }, animations: { enabled: true, easing: 'easeinout', speed: 1000 } },
        plotOptions: { bar: { borderRadius: 8, distributed: true, columnWidth: '50%' } },
        colors: ['#FFD700', '#C0C0C0', '#CD7F32', '#0d6efd', '#198754'],
        dataLabels: { enabled: false },
        xaxis: { categories: scoreboard.slice(0, 5).map(s => s.name.split(' ')[0]) },
        legend: { show: false },
        title: { text: 'Top 5 Sellers Performance', align: 'center' }
    };

    const chartSeries = [{
        name: 'Points',
        data: scoreboard.slice(0, 5).map(s => s.totalPoints)
    }];

    if (isLoading) return <div className="p-4 text-center">Loading scoreboard...</div>;

    return (
        <div className="p-2 p-md-4">
            <div className="responsive-page-header">
                <h2 className="responsive-page-title">
                    <FaStar className="text-warning me-2" />
                    Seller Scoreboard
                    <FaStar className="text-warning ms-2" />
                </h2>
                <div className="responsive-page-subtitle" style={{ color: 'white' }}>Compete with other sellers and climb the leaderboard!</div>
            </div>

            {/* Scoring Info Banner */}
            <div className="alert alert-info py-2 py-md-3 mb-3" role="alert">
                <h5 className="alert-heading mb-2">
                    <FaTrophy className="me-2" />
                    How Points Are Calculated
                </h5>
                <div className="row text-center">
                    <div className="col-md-6 mb-2">
                        <strong>🏠 Rented Property:</strong> <span className="badge bg-primary ms-2">5 Points</span>
                    </div>
                    <div className="col-md-6 mb-2">
                        <strong>✅ Sold Property:</strong> <span className="badge bg-success ms-2">10 Points</span>
                    </div>
                </div>
            </div>

            {/* Premium Benefits Banner */}
            <div className="alert alert-success mb-4" role="alert">
                <h5 className="alert-heading">
                    <FaAward className="me-2" />
                    Premium Seller Benefits
                </h5>
                <p className="mb-0">
                    🌟 <strong>Top sellers will become our Premium Sellers</strong> and get exclusive benefits including:
                    <strong> Umrah packages, international tours, priority support, featured listings,</strong> and much more!
                </p>
            </div>

            {/* Performance Chart */}
            <div className="card shadow-sm mb-4 p-3 border-0">
                <Chart options={chartOptions} series={chartSeries} type="bar" height={250} />
            </div>

            {/* Leaderboard Table */}
            <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">
                        <FaTrophy className="me-2" />
                        Top Performers
                    </h5>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th style={{ width: '80px' }} className="text-center">Rank</th>
                                    <th>Seller Name</th>
                                    <th>Agency Name</th>
                                    <th className="text-center">Sold Properties</th>
                                    <th className="text-center">Rented Properties</th>
                                    <th className="text-center">Total Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scoreboard.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center text-muted py-4">
                                            No sellers found.
                                        </td>
                                    </tr>
                                ) : (
                                    scoreboard.map((seller, index) => {
                                        const rank = index + 1;
                                        return (
                                            <tr key={seller._id} className={getRowClass(rank)}>
                                                <td className="text-center align-middle">
                                                    {getRankIcon(rank)}
                                                </td>
                                                <td className="align-middle">
                                                    <strong>{seller.name}</strong>
                                                    {rank <= 3 && seller.totalPoints > 0 && (
                                                        <span className="badge bg-warning text-dark ms-2">
                                                            Top {rank}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="align-middle">
                                                    <span className="text-muted">{seller.agencyName}</span>
                                                </td>
                                                <td className="text-center align-middle">
                                                    <span className="badge bg-success">{seller.soldCount}</span>
                                                    <small className="text-muted ms-1">
                                                        ({seller.soldCount * 10} pts)
                                                    </small>
                                                </td>
                                                <td className="text-center align-middle">
                                                    <span className="badge bg-primary">{seller.rentedCount}</span>
                                                    <small className="text-muted ms-1">
                                                        ({seller.rentedCount * 5} pts)
                                                    </small>
                                                </td>
                                                <td className="text-center align-middle">
                                                    <h5 className="mb-0 text-primary">
                                                        <strong>{seller.totalPoints}</strong>
                                                    </h5>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerScoreboard;

