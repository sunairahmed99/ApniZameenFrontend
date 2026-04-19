import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useProjectsList, useDeleteProject } from '../../../../hooks/useProjects';
import DataTable from '../../../../Components/Backend/Admin/DataTable.jsx';
import './Projects.css';

const Projects = () => {
  const navigate = useNavigate();
  const { data: projects = [], isLoading: loading } = useProjectsList();
  const deleteMutation = useDeleteProject();

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteMutation.mutate(id);
    }
  };

  const columns = [
    {
      key: 'thumbnail',
      label: 'Image',
      render: (value) => value && (
        <img src={value} alt="Project" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
      ),
      sortable: false
    },
    {
      key: 'name',
      label: 'Name',
      render: (value, row) => (
        <div>
          <div className="fw-bold">{value}</div>
          <div className="small text-muted" style={{ fontSize: '10px' }}>ID: {row._id}</div>
        </div>
      )
    },
    { key: 'city', label: 'City' },
    { key: 'area', label: 'Area' },
    {
      key: 'priceRange',
      label: 'Price Range',
      render: (value) => value ? `${value.min} - ${value.max} ${value.unit}` : '-'
    },
    {
      key: 'projectTypes',
      label: 'Type',
      render: (value) => value?.join(', ') || '-'
    },
    {
      key: 'developer',
      label: 'Developer',
      render: (value) => (
        <div className="d-flex align-items-center gap-1">
          {value?.logo && <img src={value.logo} alt="dev" style={{ width: '20px', height: '20px', borderRadius: '50%' }} />}
          <span className="small">{value?.name || '-'}</span>
        </div>
      )
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (value) => (
        <span className={`badge bg-${value ? 'success' : 'secondary'}`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  if (loading) return <div className="p-5 text-center">Loading Projects...</div>;

  return (
    <div className="projects-container">
      <div className="page-header">
        <h2>Projects Management</h2>
        <button className="create-btn" onClick={() => navigate('/admin/projects/add')}>
          <FaPlus /> Create New Project
        </button>
      </div>

      <DataTable
        data={projects}
        columns={columns}
        pageSize={10}
        searchable={true}
        sortable={true}
        actions={(row) => (
          <div className="d-flex gap-2">
            <button onClick={() => navigate(`/admin/projects/edit/${row._id}`)} className="btn btn-sm btn-outline-info" title="Edit">
              <FaEdit />
            </button>
            <button onClick={() => handleDelete(row._id)} className="btn btn-sm btn-outline-danger" title="Delete">
              <FaTrash />
            </button>
          </div>
        )}
      />
    </div>
  );
};

export default Projects;
