import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaImage, FaHeading, FaTags } from 'react-icons/fa';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useCreateBlog } from '../../../../hooks/useBlogs';
import './BlogForm.css';

const AddBlog = () => {
    const navigate = useNavigate();
    const createMutation = useCreateBlog();
    const loading = createMutation.isPending;

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
            await createMutation.mutateAsync(data);
            navigate('/admin/blogs');
        } catch (err) {
            
            alert(err.response?.data?.message || 'Failed to create blog');
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

    return (
        <div className="blog-form-container">
            <div className="form-header d-flex justify-content-between align-items-center mb-4">
                <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/admin/blogs')}>
                    <FaArrowLeft /> Back to List
                </button>
                <h2>Create New Blog</h2>
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
                                placeholder="Enter blog title"
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
                                placeholder="e.g. LIFESTYLE"
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
                            <label className="form-label">Read Time (e.g. 5 MIN READ)</label>
                            <input
                                type="text"
                                className="form-control"
                                name="readTime"
                                value={formData.readTime}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Excerpt (Summary)</label>
                            <textarea
                                className="form-control"
                                name="excerpt"
                                value={formData.excerpt}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Short summary for the card"
                            ></textarea>
                        </div>

                        <div className="mb-3">
                            <label className="form-label"><FaImage /> Featured Image</label>
                            <input
                                type="file"
                                className="form-control"
                                onChange={handleFileChange}
                                accept="image/*"
                                required={!createMutation.isPending}
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
                        {loading ? 'Submitting...' : <><FaSave /> Save Blog</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddBlog;
