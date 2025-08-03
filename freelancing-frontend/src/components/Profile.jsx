import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

const Profile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateForm, setUpdateForm] = useState({
    name: '',
    email: ''
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getProfile();
      setProfile(response.data);
      setUpdateForm({
        name: response.data.name || '',
        email: response.data.email || ''
      });
    } catch (err) {
      setError('Failed to fetch profile');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const response = await userAPI.updateProfile(updateForm);
      setProfile(response.data);
      setError('');
    } catch (err) {
      setError('Failed to update profile');
      console.error('Profile update error:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleChange = (e) => {
    setUpdateForm({
      ...updateForm,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <div className="container">Loading profile...</div>;
  }

  return (
    <div className="container">
      <h2>User Profile</h2>
      
      {error && <div className="form-error">{error}</div>}
      
      <div className="profile-info">
        <h3>Current User Info</h3>
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>ID:</strong> {user?.id}</p>
      </div>

      {profile && (
        <div className="profile-update">
          <h3>Update Profile</h3>
          <form onSubmit={handleUpdateProfile}>
            <label>Name</label>
            <input
              name="name"
              type="text"
              value={updateForm.name}
              onChange={handleChange}
              disabled={updating}
            />
            
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={updateForm.email}
              onChange={handleChange}
              disabled={updating}
            />
            
            <button type="submit" disabled={updating}>
              {updating ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      )}

      <div className="profile-actions">
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile; 