import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { jobsAPI, userAPI } from '../services/api';

const ApiExample = () => {
  const { user, isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Example: Fetch jobs (protected route)
  const fetchJobs = async () => {
    if (!isAuthenticated()) {
      setError('You must be logged in to fetch jobs');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await jobsAPI.getAllJobs();
      setJobs(response.data);
      setMessage('Jobs fetched successfully!');
    } catch (err) {
      setError('Failed to fetch jobs: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Example: Create a job (protected route)
  const createJob = async () => {
    if (!isAuthenticated()) {
      setError('You must be logged in to create jobs');
      return;
    }

    const jobData = {
      title: 'Sample Job',
      description: 'This is a sample job created via API',
      budget: 1000,
      category: 'Web Development'
    };

    try {
      setLoading(true);
      setError('');
      const response = await jobsAPI.createJob(jobData);
      setMessage('Job created successfully! ID: ' + response.data.id);
      // Refresh jobs list
      fetchJobs();
    } catch (err) {
      setError('Failed to create job: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Example: Get user profile (protected route)
  const fetchProfile = async () => {
    if (!isAuthenticated()) {
      setError('You must be logged in to fetch profile');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await userAPI.getProfile();
      setMessage('Profile fetched: ' + JSON.stringify(response.data, null, 2));
    } catch (err) {
      setError('Failed to fetch profile: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>API Examples</h2>
      
      {!isAuthenticated() && (
        <div className="alert alert-warning">
          Please log in to test the API calls
        </div>
      )}

      {error && <div className="form-error">{error}</div>}
      {message && <div className="form-success">{message}</div>}

      <div className="api-examples">
        <div className="example-section">
          <h3>Authentication Status</h3>
          <p><strong>Logged in:</strong> {isAuthenticated() ? 'Yes' : 'No'}</p>
          {user && (
            <p><strong>User:</strong> {user.name} ({user.email})</p>
          )}
        </div>

        <div className="example-section">
          <h3>API Calls</h3>
          <div className="button-group">
            <button 
              onClick={fetchJobs} 
              disabled={loading || !isAuthenticated()}
              className="btn btn-primary"
            >
              {loading ? 'Loading...' : 'Fetch Jobs'}
            </button>
            
            <button 
              onClick={createJob} 
              disabled={loading || !isAuthenticated()}
              className="btn btn-success"
            >
              {loading ? 'Creating...' : 'Create Sample Job'}
            </button>
            
            <button 
              onClick={fetchProfile} 
              disabled={loading || !isAuthenticated()}
              className="btn btn-info"
            >
              {loading ? 'Loading...' : 'Fetch Profile'}
            </button>
          </div>
        </div>

        {jobs.length > 0 && (
          <div className="example-section">
            <h3>Jobs List</h3>
            <div className="jobs-list">
              {jobs.map((job, index) => (
                <div key={job.id || index} className="job-item">
                  <h4>{job.title}</h4>
                  <p>{job.description}</p>
                  <p><strong>Budget:</strong> ${job.budget}</p>
                  <p><strong>Category:</strong> {job.category}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .api-examples {
          margin-top: 20px;
        }
        
        .example-section {
          margin-bottom: 30px;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }
        
        .button-group {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        
        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .btn-primary { background-color: #007bff; color: white; }
        .btn-success { background-color: #28a745; color: white; }
        .btn-info { background-color: #17a2b8; color: white; }
        
        .jobs-list {
          display: grid;
          gap: 15px;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        }
        
        .job-item {
          padding: 15px;
          border: 1px solid #eee;
          border-radius: 4px;
          background-color: #f9f9f9;
        }
        
        .alert {
          padding: 15px;
          margin-bottom: 20px;
          border-radius: 4px;
        }
        
        .alert-warning {
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
          color: #856404;
        }
      `}</style>
    </div>
  );
};

export default ApiExample; 