import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JobCard from "../components/JobCard";
import { useJobs } from "../context/JobsContext";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { jobs } = useJobs();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is authenticated, redirect to their appropriate dashboard
    if (isAuthenticated() && user) {
      switch (user.role) {
        case 'Client':
          navigate('/client');
          break;
        case 'Freelancer':
          navigate('/freelancer');
          break;
        case 'Admin':
          navigate('/admin');
          break;
        default:
          // Stay on home page if role is not recognized
          break;
      }
    }
  }, [user, isAuthenticated, navigate]);

  // If user is authenticated, show loading while redirecting
  if (isAuthenticated() && user) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '50px 0' }}>
        <p>Redirecting to your dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <section className="hero" style={{
        background: 'linear-gradient(90deg, #007bff 0%, #00c6ff 100%)',
        color: '#fff',
        padding: '60px 0',
        textAlign: 'center',
        borderRadius: '0 0 24px 24px'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', marginBottom: 12 }}>Find & Post Freelance Jobs Easily</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: 0 }}>Connecting clients and freelancers worldwide.</p>
        </div>
      </section>
      <div className="container" style={{ marginTop: 36 }}>
        <h2>Latest Jobs</h2>
        {jobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default Home;