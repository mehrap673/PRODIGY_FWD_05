import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';

const EditProfile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    bio: ''
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        username: user.username || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('fullName', formData.fullName);
    data.append('username', formData.username);
    data.append('bio', formData.bio);
    
    if (profilePicture) {
      data.append('profilePicture', profilePicture);
    }
    if (coverPhoto) {
      data.append('coverPhoto', coverPhoto);
    }

    try {
      await api.put('/users/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Profile updated successfully!');
      navigate(`/profile/${user._id}`);
    } catch (error) {
      toast.error('Error updating profile');
    }
  };

  return (
    <div className="edit-profile">
      <div className="edit-profile-card card">
        <h1>Edit Profile</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
            />
          </div>
          <div className="form-group">
            <label>Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePicture(e.target.files[0])}
            />
          </div>
          <div className="form-group">
            <label>Cover Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverPhoto(e.target.files[0])}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
