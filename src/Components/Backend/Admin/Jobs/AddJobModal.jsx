import React, { useState, useEffect } from 'react';
import { useCreateJob, useUpdateJob } from '../../../../hooks/useJobs';

const AddJobModal = ({ show, handleClose, jobToEdit }) => {
    const [title, setTitle] = useState('');
    const [department, setDepartment] = useState('');
    const [location, setLocation] = useState('');
    const [type, setType] = useState('On-site');
    const [salary, setSalary] = useState('');
    const [description, setDescription] = useState('');
    const [isActive, setIsActive] = useState(true);

    const createJobMutation = useCreateJob();
    const updateJobMutation = useUpdateJob();

    useEffect(() => {
        if (jobToEdit) {
            setTitle(jobToEdit.title);
            setDepartment(jobToEdit.department);
            setLocation(jobToEdit.location);
            setType(jobToEdit.type);
            setSalary(jobToEdit.salary || '');
            setDescription(jobToEdit.description || '');
            setIsActive(jobToEdit.isActive);
        } else {
            resetForm();
        }
    }, [jobToEdit, show]);

    const resetForm = () => {
        setTitle('');
        setDepartment('');
        setLocation('');
        setType('On-site');
        setSalary('');
        setDescription('');
        setIsActive(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const jobData = {
            title,
            department,
            location,
            type,
            salary,
            description,
            isActive
        };

        if (jobToEdit) {
            updateJobMutation.mutate({ id: jobToEdit._id, jobData });
        } else {
            createJobMutation.mutate(jobData);
        }
        handleClose();
        resetForm();
    };

    if (!show) return null;

    return (
        <>
            <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header d-flex justify-content-between align-items-center">
                            <h5 className="modal-title">{jobToEdit ? 'Edit Job' : 'Add New Job'}</h5>
                            <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Job Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="e.g. Sales Specialist"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Department</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="e.g. Sales, Marketing"
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Location</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="e.g. Lahore, Remote"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Type</label>
                                    <select className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                                        <option value="On-site">On-site</option>
                                        <option value="Remote">Remote</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Salary Range (Optional)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="e.g. 50k - 80k"
                                        value={salary}
                                        onChange={(e) => setSalary(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Description (Optional)</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="mb-3 form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="isActiveCheck"
                                        checked={isActive}
                                        onChange={(e) => setIsActive(e.target.checked)}
                                    />
                                    <label className="form-check-label" htmlFor="isActiveCheck">Active</label>
                                </div>

                                <div className="d-flex justify-content-end gap-2">
                                    <button type="button" className="btn btn-secondary" onClick={handleClose}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-success">
                                        {jobToEdit ? 'Update Job' : 'Create Job'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </>
    );
};

export default AddJobModal;
