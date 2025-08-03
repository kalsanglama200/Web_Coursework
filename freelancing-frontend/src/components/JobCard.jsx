import React from 'react';
import './JobCard.css';

const JobCard = ({ job, onAction, actionLabel }) => (
  <div className="job-card">
    <h3>{job.title}</h3>
    <p>{job.description}</p>
    <div className="job-meta">
      <span>Budget: <b>${job.budget}</b></span>
      <span>Posted by: {job.client_name}</span>
      <span>Posted: {new Date(job.created_at).toLocaleDateString()}</span>
    </div>
    {onAction && (
      <button onClick={() => onAction(job)}>{actionLabel}</button>
    )}
  </div>
);

export default JobCard;