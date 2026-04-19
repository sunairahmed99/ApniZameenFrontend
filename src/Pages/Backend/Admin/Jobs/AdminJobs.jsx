import React, { useState } from 'react';
import { useJobs, useDeleteJob } from '../../../../hooks/useJobs';
import AddJobModal from '../../../../Components/Backend/Admin/Jobs/AddJobModal';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const AdminJobs = () => {
    const { data: jobs, isLoading } = useJobs(true);
    const deleteJobMutation = useDeleteJob();

    const [showModal, setShowModal] = useState(false);
    const [jobToEdit, setJobToEdit] = useState(null);

    const handleAdd = () => {
        setJobToEdit(null);
        setShowModal(true);
    };

    const handleEdit = (job) => {
        setJobToEdit(job);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            deleteJobMutation.mutate(id);
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Manage Jobs</h2>
                <button className="btn btn-success" onClick={handleAdd}>
                    <FaPlus className="me-2" /> Add New Job
                </button>
            </div>

            <div className="card shadow-sm">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0 align-middle">
                            <thead className="bg-light">
                                <tr>
                                    <th className="ps-4">Title</th>
                                    <th>Department</th>
                                    <th>Location</th>
                                    <th>Type</th>
                                    <th>Salary</th>
                                    <th>Status</th>
                                    <th className="text-end pe-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs && jobs.length > 0 ? (
                                    jobs.map((job) => (
                                        <tr key={job._id}>
                                            <td className="ps-4 fw-bold">{job.title}</td>
                                            <td>{job.department}</td>
                                            <td>{job.location}</td>
                                            <td>
                                                <span className={`badge ${job.type === 'Remote' ? 'bg-info' : 'bg-secondary'}`}>
                                                    {job.type}
                                                </span>
                                            </td>
                                            <td>{job.salary || '-'}</td>
                                            <td>
                                                <span className={`badge ${job.isActive ? 'bg-success' : 'bg-danger'}`}>
                                                    {job.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="text-end pe-4">
                                                <button
                                                    className="btn btn-sm btn-outline-primary me-2"
                                                    onClick={() => handleEdit(job)}
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDelete(job._id)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-5">
                                            No jobs found. Click "Add New Job" to create one.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <AddJobModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                jobToEdit={jobToEdit}
            />
        </div>
    );
};

export default AdminJobs;
