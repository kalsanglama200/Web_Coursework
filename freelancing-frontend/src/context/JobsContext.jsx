import React, { createContext, useContext, useState, useEffect } from "react";
import { jobsAPI } from "../services/api";

const JobsContext = createContext();

// Fallback job data for testing when backend is not available
const FALLBACK_JOBS = [
  {
    id: 1,
    title: "Website Development",
    description: "Need a professional website for my business. Looking for someone with experience in React and Node.js.",
    budget: 1500,
    user_id: 2,
    client_name: "Client User",
    created_at: "2024-01-15T10:00:00Z",
    proposals: [
      {
        id: 1,
        freelancer_id: 3,
        freelancer_name: "Freelancer User",
        freelancer_email: "freelancer@example.com",
        message: "I have 5 years of experience in web development. I can deliver this project within 2 weeks.",
        status: "pending",
        created_at: "2024-01-16T14:30:00Z"
      }
    ]
  },
  {
    id: 2,
    title: "Mobile App Design",
    description: "Looking for a UI/UX designer to create a modern mobile app interface.",
    budget: 800,
    user_id: 2,
    client_name: "Client User",
    created_at: "2024-01-14T09:00:00Z",
    proposals: []
  },
  {
    id: 3,
    title: "Content Writing",
    description: "Need blog posts written for my tech company. 10 articles, 1000 words each.",
    budget: 500,
    user_id: 1,
    client_name: "Admin User",
    created_at: "2024-01-13T16:00:00Z",
    proposals: [
      {
        id: 2,
        freelancer_id: 3,
        freelancer_name: "Freelancer User",
        freelancer_email: "freelancer@example.com",
        message: "I'm a professional content writer with expertise in tech topics. I can deliver high-quality articles.",
        status: "accepted",
        created_at: "2024-01-14T11:00:00Z"
      }
    ]
  }
];

export function JobsProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendAvailable, setBackendAvailable] = useState(true);

  // Test backend availability
  const testBackend = async () => {
    try {
      await jobsAPI.getAllJobs();
      setBackendAvailable(true);
    } catch (error) {
      if (error.code === 'ERR_NETWORK' || error.response?.status >= 500) {
        console.log('Backend not available, using fallback jobs');
        setBackendAvailable(false);
        setJobs(FALLBACK_JOBS);
      }
    }
  };

  // Load jobs from API or fallback
  const loadJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      if (backendAvailable) {
        const response = await jobsAPI.getAllJobs();
        setJobs(response.data);
      } else {
        setJobs(FALLBACK_JOBS);
      }
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || err.response?.status >= 500) {
        console.log('Backend failed, using fallback jobs');
        setBackendAvailable(false);
        setJobs(FALLBACK_JOBS);
      } else {
        setError(err.response?.data?.message || 'Failed to load jobs');
        console.error('Error loading jobs:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testBackend();
  }, []);

  useEffect(() => {
    if (backendAvailable !== null) {
      loadJobs();
    }
  }, [backendAvailable]);

  const addJob = async (jobData, currentUser = null) => {
    setLoading(true);
    setError(null);
    try {
      if (backendAvailable) {
        const response = await jobsAPI.createJob(jobData);
        await loadJobs();
        return { success: true, message: response.data.message };
      } else {
        // Fallback: add to local jobs with current user's info
        const newJob = {
          id: Math.max(...jobs.map(j => j.id)) + 1,
          ...jobData,
          user_id: currentUser?.id || 1, // Use current user's ID or default to admin
          client_name: currentUser?.name || "Admin User",
          created_at: new Date().toISOString(),
          proposals: []
        };
        setJobs([...jobs, newJob]);
        return { success: true, message: 'Job created (offline mode)' };
      }
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || err.response?.status >= 500) {
        setBackendAvailable(false);
        // Retry with fallback
        const newJob = {
          id: Math.max(...jobs.map(j => j.id)) + 1,
          ...jobData,
          user_id: currentUser?.id || 1,
          client_name: currentUser?.name || "Admin User",
          created_at: new Date().toISOString(),
          proposals: []
        };
        setJobs([...jobs, newJob]);
        return { success: true, message: 'Job created (offline mode)' };
      }
      const message = err.response?.data?.message || 'Failed to create job';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const addProposal = async (jobId, proposalData, currentUser = null) => {
    setLoading(true);
    setError(null);
    try {
      if (backendAvailable) {
        const response = await jobsAPI.submitProposal(jobId, proposalData);
        await loadJobs();
        return { success: true, message: response.data.message };
      } else {
        // Fallback: add proposal to local job
        const updatedJobs = jobs.map(job => {
          if (job.id === jobId) {
            const newProposal = {
              id: Math.max(...(job.proposals || []).map(p => p.id), 0) + 1,
              freelancer_id: currentUser?.id || 3, // Use current user's ID or default to freelancer
              freelancer_name: currentUser?.name || "Freelancer User",
              freelancer_email: currentUser?.email || "freelancer@example.com",
              message: proposalData.message,
              status: "pending",
              created_at: new Date().toISOString()
            };
            return {
              ...job,
              proposals: [...(job.proposals || []), newProposal]
            };
          }
          return job;
        });
        setJobs(updatedJobs);
        return { success: true, message: 'Proposal submitted (offline mode)' };
      }
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || err.response?.status >= 500) {
        setBackendAvailable(false);
        // Retry with fallback
        const updatedJobs = jobs.map(job => {
          if (job.id === jobId) {
            const newProposal = {
              id: Math.max(...(job.proposals || []).map(p => p.id), 0) + 1,
              freelancer_id: currentUser?.id || 3,
              freelancer_name: currentUser?.name || "Freelancer User",
              freelancer_email: currentUser?.email || "freelancer@example.com",
              message: proposalData.message,
              status: "pending",
              created_at: new Date().toISOString()
            };
            return {
              ...job,
              proposals: [...(job.proposals || []), newProposal]
            };
          }
          return job;
        });
        setJobs(updatedJobs);
        return { success: true, message: 'Proposal submitted (offline mode)' };
      }
      const message = err.response?.data?.message || 'Failed to submit proposal';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const updateProposalStatus = async (jobId, proposalId, status) => {
    setLoading(true);
    setError(null);
    try {
      if (backendAvailable) {
        const response = await jobsAPI.updateProposalStatus(jobId, proposalId, status);
        await loadJobs();
        return { success: true, message: response.data.message };
      } else {
        // Fallback: update proposal status locally
        const updatedJobs = jobs.map(job => {
          if (job.id === jobId) {
            return {
              ...job,
              proposals: (job.proposals || []).map(proposal => 
                proposal.id === proposalId 
                  ? { ...proposal, status }
                  : proposal
              )
            };
          }
          return job;
        });
        setJobs(updatedJobs);
        return { success: true, message: 'Proposal status updated (offline mode)' };
      }
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || err.response?.status >= 500) {
        setBackendAvailable(false);
        // Retry with fallback
        const updatedJobs = jobs.map(job => {
          if (job.id === jobId) {
            return {
              ...job,
              proposals: (job.proposals || []).map(proposal => 
                proposal.id === proposalId 
                  ? { ...proposal, status }
                  : proposal
              )
            };
          }
          return job;
        });
        setJobs(updatedJobs);
        return { success: true, message: 'Proposal status updated (offline mode)' };
      }
      const message = err.response?.data?.message || 'Failed to update proposal status';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId) => {
    setLoading(true);
    setError(null);
    try {
      if (backendAvailable) {
        const response = await jobsAPI.deleteJob(jobId);
        await loadJobs();
        return { success: true, message: response.data.message };
      } else {
        // Fallback: remove job locally
        setJobs(jobs.filter(job => job.id !== jobId));
        return { success: true, message: 'Job deleted (offline mode)' };
      }
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || err.response?.status >= 500) {
        setBackendAvailable(false);
        // Retry with fallback
        setJobs(jobs.filter(job => job.id !== jobId));
        return { success: true, message: 'Job deleted (offline mode)' };
      }
      const message = err.response?.data?.message || 'Failed to delete job';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <JobsContext.Provider value={{ 
      jobs, 
      loading, 
      error, 
      addJob, 
      addProposal, 
      updateProposalStatus, 
      deleteJob,
      loadJobs,
      backendAvailable
    }}>
      {children}
    </JobsContext.Provider>
  );
}

export function useJobs() {
  return useContext(JobsContext);
}