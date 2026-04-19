import { useNavigate, useParams } from 'react-router-dom';
import { useAgency, useUpdateAgency } from '../../../../hooks/useAgencies';
import './AgencyForm.css';

const EditAgency = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: agency, isLoading: fetching } = useAgency(id);
  const updateAgencyMutation = useUpdateAgency();

  const [formData, setFormData] = useState({
    name: '',
    city: '',
    isTitanium: false,
    isFeatured: false,
    isActive: true
  });

  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState('');

  useEffect(() => {
    if (agency) {
      setFormData({
        name: agency.name || '',
        city: agency.city || '',
        isTitanium: agency.isTitanium || false,
        isFeatured: agency.isFeatured || false,
        isActive: agency.isActive ?? true
      });
      setCurrentImage(agency.logo || '');
    }
  }, [agency]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('city', formData.city);
    data.append('isTitanium', formData.isTitanium);
    data.append('isFeatured', formData.isFeatured);
    data.append('isActive', formData.isActive);

    if (image) {
      data.append('logo', image);
    }

    try {
      await updateAgencyMutation.mutateAsync({ id, agencyData: data });
      navigate('/admin/agencies');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  if (fetching) return <div>Loading...</div>;

  return (
    <div className="agency-form-container">
      <h2>Edit Agency</h2>
      <form onSubmit={handleSubmit} className="agency-form">
        <div className="form-group">
          <label>Agency Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>City</label>
          <input type="text" name="city" value={formData.city} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Agency Logo</label>
          {currentImage && <img src={currentImage} alt="Current" style={{ width: '100px', marginBottom: '10px' }} />}
          <input type="file" onChange={handleFileChange} accept="image/*" />
        </div>

        <div className="form-row checkboxes">
          <div className="form-group checkbox">
            <label>
              <input type="checkbox" name="isTitanium" checked={formData.isTitanium} onChange={handleChange} />
              Titanium
            </label>
          </div>
          <div className="form-group checkbox">
            <label>
              <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} />
              Featured
            </label>
          </div>
          <div className="form-group checkbox">
            <label>
              <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
              Active
            </label>
          </div>
        </div>

        <button type="submit" className="btn-submit" disabled={updateAgencyMutation.isLoading}>
          {updateAgencyMutation.isLoading ? 'Updating...' : 'Update Agency'}
        </button>
      </form>
    </div>
  );
};

export default EditAgency;
