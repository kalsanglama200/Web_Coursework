import React from "react";
import Sidebar from "../components/Sidebar";
import JobCard from "../components/JobCard";
import { useJobs } from "../context/JobsContext";
import { useAuth } from "../context/AuthContext";

const FreelancerAwardedJobs = () => {
  const { jobs } = useJobs();
  const { user } = useAuth();

  if (!user) return <div>Please log in as a freelancer.</div>;
  if (!jobs) return <div>Loading...</div>;

  const awardedJobs = jobs.filter(job =>
    (job.proposals || []).some(
      p =>
        p.freelancer === user.name &&
        p.email === user.email &&
        p.status === "accepted"
    )
  );

  return (
    <div className="container flex" style={{ alignItems: "flex-start" }}>
      <Sidebar role="freelancer" />
      <div style={{ flex: 1 }}>
        <h2>My Awarded Jobs</h2>
        {awardedJobs.length === 0 && <p>No jobs awarded yet.</p>}
        {awardedJobs.map((job) => (
          <div key={job.id} style={{ marginBottom: 24 }}>
            <JobCard job={job} />
            <div style={{ color: "#28a745", fontWeight: "bold", marginTop: 8 }}>
              You have been awarded this job!
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FreelancerAwardedJobs;