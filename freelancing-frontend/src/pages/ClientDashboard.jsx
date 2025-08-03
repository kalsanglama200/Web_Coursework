import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import JobCard from "../components/JobCard";
import { useAuth } from "../context/AuthContext";
import { useJobs } from "../context/JobsContext";
import ChatWindow from "../components/ChatWindow";

const ClientDashboard = () => {
  const { user } = useAuth();
  const { jobs, loading, error, addJob, updateProposalStatus, backendAvailable } = useJobs();
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: ""
  });
  const [chatJobId, setChatJobId] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.title && form.description && form.budget) {
      setSubmitLoading(true);
      const result = await addJob({
        title: form.title,
        description: form.description,
        budget: parseFloat(form.budget)
      }, user); // Pass the current user
      
      if (result.success) {
        setForm({ title: "", description: "", budget: "" });
      }
      setSubmitLoading(false);
    }
  };

  // Show only jobs posted by this client
  const myJobs = jobs.filter((job) => job.user_id === user?.id);

  // Debug information
  console.log('ClientDashboard Debug:', {
    currentUser: user,
    allJobs: jobs,
    myJobs: myJobs,
    userFilter: user?.id
  });

  const handleProposalStatusUpdate = async (jobId, proposalId, status) => {
    const result = await updateProposalStatus(jobId, proposalId, status);
    if (!result.success) {
      alert(result.message);
    }
  };

  if (loading) {
    return (
      <div className="container flex" style={{ alignItems: "flex-start" }}>
        <Sidebar role="client" />
        <div style={{ flex: 1 }}>
          <p>Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container flex" style={{ alignItems: "flex-start" }}>
        <Sidebar role="client" />
        <div style={{ flex: 1 }}>
          <p style={{ color: "red" }}>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container flex" style={{ alignItems: "flex-start" }}>
      <Sidebar role={user?.role?.toLowerCase()} />
      <div style={{ flex: 1 }}>
        {/* Backend Status */}
        <div style={{ 
          marginBottom: 20, 
          padding: 10, 
          background: backendAvailable ? '#d4edda' : '#f8d7da', 
          borderRadius: 5,
          border: `1px solid ${backendAvailable ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          <h4>System Status</h4>
          <p>
            <strong>Backend:</strong> {backendAvailable ? '🟢 Connected' : '🔴 Offline (using fallback)'}
          </p>
          <p>
            <strong>Mode:</strong> {backendAvailable ? 'Online' : 'Offline Mode'}
          </p>
          <p>
            <strong>Current User:</strong> {user?.name} (ID: {user?.id})
          </p>
          <p>
            <strong>Total Jobs:</strong> {jobs.length} | <strong>Your Jobs:</strong> {myJobs.length}
          </p>
        </div>
        
        <h2>Post a Job</h2>
        <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
          <label>Title</label>
          <input name="title" value={form.title} onChange={handleChange} required />
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} required />
          <label>Budget ($)</label>
          <input name="budget" type="number" value={form.budget} onChange={handleChange} required />
          <button type="submit" disabled={submitLoading}>
            {submitLoading ? "Posting..." : "Post Job"}
          </button>
        </form>
        <h2>Your Posted Jobs</h2>
        {myJobs.length === 0 && <p>No jobs posted yet.</p>}
        {myJobs.map((job) => {
          const acceptedProposal = job.proposals && job.proposals.find(p => p.status === "accepted");
          return (
            <div key={job.id} style={{ marginBottom: 24 }}>
              <JobCard job={job} />
              <div style={{ marginTop: 8, marginLeft: 8 }}>
                <b>Proposals:</b>
                {job.proposals && job.proposals.length > 0 ? (
                  <ul>
                    {job.proposals.map((p, idx) => (
                      <li key={idx} style={{ marginBottom: 8 }}>
                        <div>
                          <b>{p.freelancer_name}</b> ({p.freelancer_email}) <span style={{ color: "#888" }}>{p.created_at}</span>
                          <span style={{
                            marginLeft: 12,
                            color:
                              p.status === "accepted"
                                ? "#28a745"
                                : p.status === "rejected"
                                ? "#dc3545"
                                : "#888",
                            fontWeight: "bold"
                          }}>
                            {p.status === "pending"
                              ? "Pending"
                              : p.status === "accepted"
                              ? "Accepted"
                              : "Rejected"}
                          </span>
                        </div>
                        <div style={{ marginLeft: 8 }}>{p.message}</div>
                        {p.status === "pending" && (
                          <div style={{ marginTop: 4 }}>
                            <button
                              style={{ marginRight: 8, background: "#28a745", color: "#fff" }}
                              onClick={() => handleProposalStatusUpdate(job.id, p.id, "accepted")}
                            >
                              Accept
                            </button>
                            <button
                              style={{ background: "#dc3545", color: "#fff" }}
                              onClick={() => handleProposalStatusUpdate(job.id, p.id, "rejected")}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ color: "#888" }}>No proposals yet.</div>
                )}
              </div>
              {acceptedProposal && (
                <button onClick={() => setChatJobId(job.id)} style={{ marginTop: 8 }}>
                  💬 Chat
                </button>
              )}
              {chatJobId === job.id && (
                <ChatWindow
                  jobId={job.id}
                  onClose={() => setChatJobId(null)}
                  participants={[user.name, acceptedProposal.freelancer_name]}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClientDashboard;