import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useBlogs, useDeleteBlog } from '../../../../hooks/useBlogs';
import DataTable from '../../../../Components/Backend/Admin/DataTable.jsx';
import './Blogs.css';

const Blogs = () => {
    const navigate = useNavigate();
    const { data, isLoading: loading } = useBlogs(1, 100); // Fetch a larger set for admin for now
    const blogs = data?.blogs || [];
    const deleteMutation = useDeleteBlog();

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            deleteMutation.mutate(id);
        }
    };

    const columns = [
        {
            key: 'thumbnail',
            label: 'Thumbnail',
            render: (value) => value && (
                <img src={value} alt="Blog" style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
            ),
            sortable: false
        },
        {
            key: 'title',
            label: 'Title',
            render: (value, row) => (
                <div>
                    <div className="fw-bold">{value}</div>
                    <div className="small text-muted" style={{ fontSize: '10px' }}>Slug: {row.slug}</div>
                </div>
            )
        },
        { key: 'category', label: 'Category' },
        { key: 'author', label: 'Author' },
        {
            key: 'date',
            label: 'Date',
            render: (value) => new Date(value).toLocaleDateString()
        }
    ];

    if (loading) return <div className="p-5 text-center">Loading Blogs...</div>;

    return (
        <div className="blogs-management-container">
            <div className="page-header d-flex justify-content-between align-items-center mb-4">
                <h2>Blogs Management</h2>
                <button className="btn btn-primary" onClick={() => navigate('/admin/blogs/add')}>
                    <FaPlus /> Create New Blog
                </button>
            </div>

            <DataTable
                data={blogs}
                columns={columns}
                pageSize={10}
                searchable={true}
                sortable={true}
                actions={(row) => (
                    <div className="d-flex gap-2">
                        <button onClick={() => navigate(`/admin/blogs/edit/${row._id}`)} className="btn btn-sm btn-outline-info" title="Edit">
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

export default Blogs;
