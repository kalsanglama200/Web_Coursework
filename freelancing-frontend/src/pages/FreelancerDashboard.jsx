import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import JobCard from "../components/JobCard";
import { useJobs } from "../context/JobsContext";
import { useAuth } from "../context/AuthContext";
import ChatWindow from "../components/ChatWindow";

const FreelancerDashboard = () => {
  const { jobs, loading, error, addProposal } = useJobs();
  const { user } = useAuth();
  const [proposalText, setProposalText] = useState({});
  const [sent, setSent] = useState({});
  const [chatJobId, setChatJobId] = useState(null);
  const [submitLoading, setSubmitLoading] = useState({});

  // Find jobs where this freelancer's proposal is accepted
  const awardedJobs = jobs.filter(job =>
    (job.proposals || []).some(
      p =>
        p.freelancer_id === user.id &&
        p.status === "accepted"
    )
  );

  // Jobs not yet awarded to this freelancer and not posted by this freelancer
  const availableJobs = jobs.filter(
    job =>
      !awardedJobs.includes(job) &&
      job.user_id !== user.id // don't show own jobs
  );

  const getProposalStatus = (job) => {
    if (!user) return null;
    const proposal = (job.proposals || []).find(
      (p) => p.freelancer_id === user.id
    );
    return proposal ? proposal.status : null;
  };

  const handleProposal = async (job) => {
    if (!user) return;
    if (sent[job.id]) return;

    const message = proposalText[job.id] || "";
    if (!message.trim()) return;

    setSubmitLoading(prev => ({ ...prev, [job.id]: true }));
    
    const result = await addProposal(job.id, {
      message: message.trim()
    }, user); // Pass the current user

    if (result.success) {
      setSent((prev) => ({ ...prev, [job.id]: true }));
      setProposalText((prev) => ({ ...prev, [job.id]: "" }));
    } else {
      alert(result.message);
    }
    
    setSubmitLoading(prev => ({ ...prev, [job.id]: false }));
  };

  if (loading) {
    return (
      <div className="container flex" style={{ alignItems: "flex-start" }}>
        <Sidebar role="freelancer" />
        <div style={{ flex: 1 }}>
          <p>Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container flex" style={{ alignItems: "flex-start" }}>
        <Sidebar role="freelancer" />
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
        <h2>Jobs Awarded to You</h2>
        {awardedJobs.length === 0 && <p>No jobs awarded yet.</p>}
        {awardedJobs.map((job) => (
          <div key={job.id} style={{ marginBottom: 24 }}>
            <JobCard job={job} />
            <div style={{ color: "#28a745", fontWeight: "bold", marginTop: 8 }}>
              You have been awarded this job!
            </div>
            <button onClick={() => setChatJobId(job.id)} style={{ marginTop: 8 }}>
              💬 Chat
            </button>
            {chatJobId === job.id && (
              <ChatWindow
                jobId={job.id}
                onClose={() => setChatJobId(null)}
                participants={[job.client_name, user.name]}
              />
            )}
          </div>
        ))}

        <h2 style={{ marginTop: 40 }}>Available Jobs</h2>
        {availableJobs.length === 0 && <p>No jobs available.</p>}
        {availableJobs.map((job) => {
          const status = getProposalStatus(job);
          return (
            <div key={job.id} style={{ marginBottom: 24 }}>
              <JobCard job={job} />
              {status ? (
                <div style={{
                  marginTop: 8,
                  color:
                    status === "accepted"
                      ? "#28a745"
                      : status === "rejected"
                      ? "#dc3545"
                      : "#888",
                  fontWeight: "bold"
                }}>
                  Proposal {status.charAt(0).toUpperCase() + status.slice(1)}
                </div>
              ) : (
                <>
                  <textarea
                    placeholder="Write your proposal..."
                    value={proposalText[job.id] || ""}
                    onChange={e =>
                      setProposalText({ ...proposalText, [job.id]: e.target.value })
                    }
                    style={{ width: "100%", minHeight: 60, marginBottom: 8 }}
                    disabled={sent[job.id] || submitLoading[job.id]}
                  />
                  <button
                    onClick={() => handleProposal(job)}
                    disabled={sent[job.id] || submitLoading[job.id]}
                    style={{ marginBottom: 8 }}
                  >
                    {submitLoading[job.id] ? "Sending..." : sent[job.id] ? "Proposal Sent" : "Send Proposal"}
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FreelancerDashboard;