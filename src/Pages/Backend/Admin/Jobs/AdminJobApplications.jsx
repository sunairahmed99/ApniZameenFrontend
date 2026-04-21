import React from 'react';
import { useJobApplications, useUpdateApplicationStatus } from '../../../../hooks/useJobApplications';
import { FaDownload, FaEnvelope, FaPhone, FaClock, FaCheck, FaTimes } from 'react-icons/fa';
import DataTable from '../../../../Components/Backend/Admin/DataTable.jsx';
import '../AdminDashboard.css';

const AdminJobApplications = () => {
    const { data: applications = [], isLoading } = useJobApplications();
    const updateStatusMutation = useUpdateApplicationStatus();
    const [jobFilter, setJobFilter] = React.useState('All');

    const handleStatusUpdate = async (id, status) => {
        if (window.confirm(`Are you sure you want to change status to ${status}?`)) {
            try {
                await updateStatusMutation.mutateAsync({ id, status });
            } catch (error) {
                alert('Failed to update status');
            }
        }
    };

    const handleDownloadCV = async (url, name) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', `CV_${name.replace(/\s+/g, '_')}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Download failed', error);
            // Fallback: open in new tab
            window.open(url, '_blank');
        }
    };

    // Get unique job titles for filtering
    const uniqueJobTitles = React.useMemo(() => {
        const titles = applications.map(app => app.job?.title).filter(Boolean);
        return ['All', ...new Set(titles)];
    }, [applications]);

    // Filtered applications based on job selection
    const filteredApplications = React.useMemo(() => {
        if (jobFilter === 'All') return applications;
        return applications.filter(app => app.job?.title === jobFilter);
    }, [applications, jobFilter]);

    const columns = [
        {
            key: 'name',
            label: 'Candidate',
            width: '30%',
            render: (value, row) => (
                <div className="candidate-info">
                    <div className="candidate-name">{row.name}</div>
                    <div className="candidate-meta">
                        <span><FaEnvelope /> {row.email}</span>
                        <span><FaPhone /> {row.phone}</span>
                    </div>
                </div>
            )
        },
        {
            key: 'job.title',
            label: 'Job Details',
            width: '25%',
            render: (value, row) => (
                <div className="job-ref">
                    <div className="job-title-ref">{row.job?.title || 'N/A'}</div>
                    <div className="job-loc-ref">{row.job?.location || 'Unknown'}</div>
                </div>
            )
        },
        {
            key: 'status',
            label: 'Status',
            width: '15%',
            render: (value) => (
                <span className={`status-badge ${value?.toLowerCase()}`}>
                    {value}
                </span>
            )
        },
        {
            key: 'createdAt',
            label: 'Applied',
            width: '15%',
            render: (value) => (
                <div className="applied-time">
                    {new Date(value).toLocaleDateString()}
                </div>
            )
        }
    ];

    if (isLoading) return <div className="p-5 text-center"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="admin-job-apps animate-fade-in" style={{ overflowX: 'hidden' }}>
            <div className="dashboard-header-modern mb-4 flex-wrap">
                <div className="welcome-section">
                    <h1 className="welcome-title">Job Applications</h1>
                    <p className="welcome-subtitle">Review and manage candidates.</p>
                </div>
                
                <div className="filter-section d-flex align-items-center gap-2 mt-3 mt-md-0">
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#fff' }}>Filter by Job:</span>
                    <select 
                        className="form-select form-select-sm" 
                        style={{ width: '200px', backgroundColor: '#fff' }}
                        value={jobFilter}
                        onChange={(e) => setJobFilter(e.target.value)}
                    >
                        {uniqueJobTitles.map(title => (
                            <option key={title} value={title}>{title}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="admin-card-modern">
                <DataTable
                    data={filteredApplications}
                    columns={columns}
                    pageSize={10}
                    searchable={true}
                    sortable={true}
                    actionsWidth="150px"
                    emptyMessage={jobFilter === 'All' ? "No applications found." : `No applications found for "${jobFilter}".`}
                    actions={(row) => (
                        <div className="action-buttons-modern d-flex gap-2 justify-content-end">
                            <button 
                                onClick={() => handleDownloadCV(row.cvUrl, row.name)}
                                className="btn-table-action view" 
                                title="Download CV"
                            >
                                <FaDownload />
                            </button>
                            <div className="dropdown">
                                <button className="btn-table-action edit dropdown-toggle" data-bs-toggle="dropdown">
                                    Status
                                </button>
                                <ul className="dropdown-menu dropdown-menu-dark">
                                    <li><button className="dropdown-item" onClick={() => handleStatusUpdate(row._id, 'Reviewed')}>Reviewed</button></li>
                                    <li><button className="dropdown-item" onClick={() => handleStatusUpdate(row._id, 'Shortlisted')}>Shortlist</button></li>
                                    <li><button className="dropdown-item text-danger" onClick={() => handleStatusUpdate(row._id, 'Rejected')}>Reject</button></li>
                                </ul>
                            </div>
                        </div>
                    )}
                />
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .admin-card-modern {
                    background: #fff;
                    border-radius: 16px;
                    padding: 15px;
                    border: 1px solid #eee;
                    color: #333;
                    max-width: 100%;
                }
                .candidate-name { font-weight: 700; color: #111; margin-bottom: 2px; font-size: 0.9rem; }
                .candidate-meta { font-size: 0.75rem; color: #555; display: flex; flex-direction: column; gap: 1px; }
                .candidate-meta span { display: flex; align-items: center; gap: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; }
                .job-title-ref { font-weight: 600; color: #00A651; font-size: 0.85rem; }
                .job-loc-ref { font-size: 0.75rem; color: #777; }
                .status-badge { padding: 3px 8px; border-radius: 10px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; }
                .status-badge.pending { background: #fff8e1; color: #f57f17; }
                .status-badge.reviewed { background: #e3f2fd; color: #1976d2; }
                .status-badge.shortlisted { background: #e8f5e9; color: #2e7d32; }
                .status-badge.rejected { background: #ffebee; color: #c62828; }
                .btn-table-action { padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; border: 1px solid #ddd; cursor: pointer; transition: 0.2s; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; }
                .btn-table-action.view { background: #f0fff4; color: #00A651; border-color: #c6f6d5; }
                .btn-table-action.view:hover { background: #00A651; color: #fff; }
                .btn-table-action.edit { background: #ebf8ff; color: #3182ce; border-color: #bee3f8; }
                
                /* DataTable Responsiveness */
                .table { font-size: 0.85rem !important; table-layout: fixed; width: 100%; }
                .table td, .table th { padding: 8px 10px !important; vertical-align: middle; }
                .form-control-sm, .form-select-sm { height: 30px; font-size: 0.8rem !important; }
                .data-table-header { margin-bottom: 10px !important; }
                .applied-time { font-size: 0.8rem; color: #666; }
            `}} />
        </div>
    );
};

export default AdminJobApplications;

