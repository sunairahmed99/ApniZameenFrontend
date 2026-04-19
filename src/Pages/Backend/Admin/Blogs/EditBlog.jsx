import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaImage, FaHeading, FaTags } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useBlog, useUpdateBlog } from '../../../../hooks/useBlogs';
import './BlogForm.css';

const EditBlog = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: blog, isLoading: fetchLoading } = useBlog(id);
    const updateMutation = useUpdateBlog();
    const loading = updateMutation.isPending;

    const [formData, setFormData] = useState({
        title: '',
        category: 'LIFESTYLE',
        author: 'SAMRA ZULFIQAR',
        readTime: '3 MIN READ',
        excerpt: '',
    });
    const [content, setContent] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (blog) {
            setFormData({
                title: blog.title || '',
                category: blog.category || 'LIFESTYLE',
                author: blog.author || 'SAMRA ZULFIQAR',
                readTime: blog.readTime || '3 MIN READ',
                excerpt: blog.excerpt || '',
            });
            setContent(blog.content || '');
            if (blog.thumbnail) {
                setPreview(blog.thumbnail);
            }
        }
    }, [blog]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });
        data.append('content', content);
        if (thumbnail) {
            data.append('thumbnail', thumbnail);
        }

        try {
            await updateMutation.mutateAsync({ id, updates: data });
            navigate('/admin/blogs');
        } catch (err) {
            
            alert(err.response?.data?.message || 'Failed to update blog');
        }
    };

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    if (fetchLoading) return <div className="p-5 text-center">Loading Blog Data...</div>;

    return (
        <div className="blog-form-container">
            <div className="form-header d-flex justify-content-between align-items-center mb-4">
                <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/admin/blogs')}>
                    <FaArrowLeft /> Back to List
                </button>
                <h2>Edit Blog</h2>
            </div>

            <form onSubmit={handleSubmit} className="blog-form card p-4 shadow-sm">
                <div className="row">
                    <div className="col-md-8">
                        <div className="mb-3">
                            <label className="form-label"><FaHeading /> Title</label>
                            <input
                                type="text"
                                className="form-control"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Content</label>
                            <ReactQuill
                                theme="snow"
                                value={content}
                                onChange={setContent}
                                modules={quillModules}
                                style={{ height: '400px', marginBottom: '50px' }}
                            />
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="mb-3">
                            <label className="form-label"><FaTags /> Category</label>
                            <input
                                type="text"
                                className="form-control"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Author</label>
                            <input
                                type="text"
                                className="form-control"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Read Time</label>
                            <input
                                type="text"
                                className="form-control"
                                name="readTime"
                                value={formData.readTime}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Excerpt</label>
                            <textarea
                                className="form-control"
                                name="excerpt"
                                value={formData.excerpt}
                                onChange={handleChange}
                                rows="3"
                            ></textarea>
                        </div>

                        <div className="mb-3">
                            <label className="form-label"><FaImage /> Featured Image</label>
                            <input
                                type="file"
                                className="form-control"
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                            {preview && (
                                <div className="mt-2 text-center">
                                    <img src={preview} alt="Preview" style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px' }} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="text-end mt-4">
                    <button type="submit" className="btn btn-success px-5" disabled={loading}>
                        {loading ? 'Updating...' : <><FaSave /> Update Blog</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditBlog;
