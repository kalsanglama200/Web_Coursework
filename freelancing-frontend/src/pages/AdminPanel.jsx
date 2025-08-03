import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useUsers } from "../context/UsersContext";
import { useJobs } from "../context/JobsContext";
import { useAuth } from "../context/AuthContext";
import JobCard from "../components/JobCard";

const AdminPanel = () => {
    const { user } = useAuth();
    const { users, loading: usersLoading, error: usersError, deleteUser, toggleBan, backendAvailable: usersBackendAvailable } = useUsers();
    const { jobs, loading: jobsLoading, error: jobsError, deleteJob, addJob, updateProposalStatus, backendAvailable: jobsBackendAvailable } = useJobs();
    
    // Form state for posting jobs
    const [jobForm, setJobForm] = useState({
        title: "",
        description: "",
        budget: ""
    });
    const [submitLoading, setSubmitLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    const handleDeleteJob = async (jobId) => {
        console.log('Attempting to delete job:', jobId);
        const result = await deleteJob(jobId);
        console.log('Delete job result:', result);
        if (!result.success) {
            alert(`Failed to delete job: ${result.message}`);
        } else {
            alert('Job deleted successfully!');
        }
    };

    const handleDeleteUser = async (userId) => {
        console.log('Attempting to delete user:', userId);
        const result = await deleteUser(userId);
        console.log('Delete user result:', result);
        if (!result.success) {
            alert(`Failed to delete user: ${result.message}`);
        } else {
            alert('User deleted successfully!');
        }
    };

    const handleToggleBan = async (userId) => {
        console.log('Attempting to toggle ban for user:', userId);
        const result = await toggleBan(userId);
        console.log('Toggle ban result:', result);
        if (!result.success) {
            alert(`Failed to toggle ban: ${result.message}`);
        } else {
            alert('User ban status updated successfully!');
        }
    };

    const handleJobSubmit = async (e) => {
        e.preventDefault();
        if (jobForm.title && jobForm.description && jobForm.budget) {
            setSubmitLoading(true);
            console.log('Attempting to post job:', jobForm);
            const result = await addJob({
                title: jobForm.title,
                description: jobForm.description,
                budget: parseFloat(jobForm.budget)
            }, user); // Pass the current user
            
            console.log('Post job result:', result);
            if (result.success) {
                setJobForm({ title: "", description: "", budget: "" });
                alert('Job posted successfully!');
            } else {
                alert(`Failed to post job: ${result.message}`);
            }
            setSubmitLoading(false);
        }
    };

    const handleProposalStatusUpdate = async (jobId, proposalId, status) => {
        console.log('Attempting to update proposal status:', { jobId, proposalId, status });
        const result = await updateProposalStatus(jobId, proposalId, status);
        console.log('Update proposal result:', result);
        if (!result.success) {
            alert(`Failed to update proposal: ${result.message}`);
        } else {
            alert('Proposal status updated successfully!');
        }
    };

    const handleJobFormChange = (e) => {
        setJobForm({ ...jobForm, [e.target.name]: e.target.value });
    };

    // Debug information
    console.log('Admin Panel Debug Info:', {
        user: user,
        usersCount: users.length,
        jobsCount: jobs.length,
        usersLoading,
        jobsLoading,
        usersError,
        jobsError,
        usersBackendAvailable,
        jobsBackendAvailable
    });

    if (usersLoading || jobsLoading) {
        return (
            <div className="container flex" style={{ alignItems: "flex-start" }}>
                <Sidebar role={user?.role?.toLowerCase()} />
                <div style={{ flex: 1 }}>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (usersError || jobsError) {
        return (
            <div className="container flex" style={{ alignItems: "flex-start" }}>
                <Sidebar role={user?.role?.toLowerCase()} />
                <div style={{ flex: 1 }}>
                    <p style={{ color: "red" }}>
                        Error: {usersError || jobsError}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container flex" style={{ alignItems: "flex-start" }}>
            <Sidebar role={user?.role?.toLowerCase()} />
            <div style={{ flex: 1 }}>
                <h1>Admin Panel - Full Access</h1>
                <p style={{ color: '#666', marginBottom: 20 }}>
                    Logged in as: {user?.name} ({user?.role}) | ID: {user?.id}
                </p>
                
                {/* Backend Status */}
                <div style={{ 
                    marginBottom: 20, 
                    padding: 10, 
                    background: (usersBackendAvailable && jobsBackendAvailable) ? '#d4edda' : '#f8d7da', 
                    borderRadius: 5,
                    border: `1px solid ${(usersBackendAvailable && jobsBackendAvailable) ? '#c3e6cb' : '#f5c6cb'}`
                }}>
                    <h4>System Status</h4>
                    <p>
                        <strong>Users API:</strong> {usersBackendAvailable ? '🟢 Connected' : '🔴 Offline (using fallback)'}
                    </p>
                    <p>
                        <strong>Jobs API:</strong> {jobsBackendAvailable ? '🟢 Connected' : '🔴 Offline (using fallback)'}
                    </p>
                    <p>
                        <strong>Mode:</strong> {(usersBackendAvailable && jobsBackendAvailable) ? 'Online' : 'Offline Mode'}
                    </p>
                    {(!usersBackendAvailable || !jobsBackendAvailable) && (
                        <p style={{ fontSize: '12px', marginTop: 5 }}>
                            Note: In offline mode, changes are stored locally and will be lost when you refresh the page.
                        </p>
                    )}
                </div>
                
                {/* Tab Navigation */}
                <div style={{ marginBottom: 20 }}>
                    <button 
                        onClick={() => setActiveTab('overview')}
                        style={{ 
                            marginRight: 10, 
                            padding: '8px 16px',
                            background: activeTab === 'overview' ? '#007bff' : '#f8f9fa',
                            color: activeTab === 'overview' ? 'white' : 'black',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Overview
                    </button>
                    <button 
                        onClick={() => setActiveTab('users')}
                        style={{ 
                            marginRight: 10, 
                            padding: '8px 16px',
                            background: activeTab === 'users' ? '#007bff' : '#f8f9fa',
                            color: activeTab === 'users' ? 'white' : 'black',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Manage Users ({users.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('jobs')}
                        style={{ 
                            marginRight: 10, 
                            padding: '8px 16px',
                            background: activeTab === 'jobs' ? '#007bff' : '#f8f9fa',
                            color: activeTab === 'jobs' ? 'white' : 'black',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Manage Jobs ({jobs.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('post-job')}
                        style={{ 
                            marginRight: 10, 
                            padding: '8px 16px',
                            background: activeTab === 'post-job' ? '#007bff' : '#f8f9fa',
                            color: activeTab === 'post-job' ? 'white' : 'black',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Post Job
                    </button>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div>
                        <h2>Platform Overview</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
                                <h3>Total Users</h3>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#007bff' }}>{users.length}</p>
                                <p>Active: {users.filter(u => !u.banned).length}</p>
                                <p>Banned: {users.filter(u => u.banned).length}</p>
                            </div>
                            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
                                <h3>Total Jobs</h3>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>{jobs.length}</p>
                                <p>Open: {jobs.filter(j => j.status === 'open').length}</p>
                                <p>In Progress: {jobs.filter(j => j.status === 'in_progress').length}</p>
                            </div>
                            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
                                <h3>Total Proposals</h3>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffc107' }}>
                                    {jobs.reduce((total, job) => total + (job.proposals?.length || 0), 0)}
                                </p>
                                <p>Pending: {jobs.reduce((total, job) => total + (job.proposals?.filter(p => p.status === 'pending').length || 0), 0)}</p>
                                <p>Accepted: {jobs.reduce((total, job) => total + (job.proposals?.filter(p => p.status === 'accepted').length || 0), 0)}</p>
                            </div>
                        </div>
                        
                        <h3>Recent Activity</h3>
                        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
                            <h4>Latest Jobs</h4>
                            {jobs.slice(0, 5).map(job => (
                                <div key={job.id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
                                    <strong>{job.title}</strong> - ${job.budget} by {job.client_name}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Users Management Tab */}
                {activeTab === 'users' && (
                    <div>
                        <h2>User Management</h2>
                        {users.length === 0 ? (
                            <p>No users found.</p>
                        ) : (
                            <table style={{ width: "100%", marginBottom: 32, background: "#fff", borderRadius: 8, borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ background: "#f4f8fb" }}>
                                        <th style={{ padding: 8 }}>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id} style={{ borderBottom: "1px solid #eee" }}>
                                            <td style={{ padding: 8 }}>{u.name}</td>
                                            <td>{u.email}</td>
                                            <td>{u.role}</td>
                                            <td style={{ color: u.banned ? '#dc3545' : '#28a745' }}>
                                                {u.banned ? "Banned" : "Active"}
                                            </td>
                                            <td>{new Date(u.created_at).toLocaleDateString()}</td>
                                            <td>
                                                <button 
                                                    onClick={() => handleToggleBan(u.id)} 
                                                    style={{ 
                                                        marginRight: 8,
                                                        background: u.banned ? '#28a745' : '#ffc107',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {u.banned ? "Unban" : "Ban"}
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        if (window.confirm(`Are you sure you want to delete user "${u.name}"?`)) {
                                                            handleDeleteUser(u.id);
                                                        }
                                                    }} 
                                                    style={{ 
                                                        background: "#dc3545",
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {/* Jobs Management Tab */}
                {activeTab === 'jobs' && (
                    <div>
                        <h2>Job Management</h2>
                        {jobs.length === 0 ? (
                            <p>No jobs found.</p>
                        ) : (
                            jobs.map(job => (
                                <div key={job.id} style={{ marginBottom: 24, background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
                                    <JobCard job={job} />
                                    <div style={{ marginTop: 8, marginLeft: 8 }}>
                                        <b>Proposals ({job.proposals?.length || 0}):</b>
                                        {job.proposals && job.proposals.length > 0 ? (
                                            <ul>
                                                {job.proposals.map((p, idx) => (
                                                    <li key={idx} style={{ marginBottom: 8 }}>
                                                        <div>
                                                            <b>{p.freelancer_name}</b> ({p.freelancer_email}) 
                                                            <span style={{ color: "#888" }}>{new Date(p.created_at).toLocaleDateString()}</span>
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
                                                                    style={{ marginRight: 8, background: "#28a745", color: "#fff", border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                                                                    onClick={() => handleProposalStatusUpdate(job.id, p.id, "accepted")}
                                                                >
                                                                    Accept
                                                                </button>
                                                                <button
                                                                    style={{ background: "#dc3545", color: "#fff", border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
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
                                    <button 
                                        onClick={() => {
                                            if (window.confirm(`Are you sure you want to delete job "${job.title}"?`)) {
                                                handleDeleteJob(job.id);
                                            }
                                        }} 
                                        style={{ 
                                            marginTop: 8,
                                            background: "#dc3545",
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 16px',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Delete Job
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Post Job Tab */}
                {activeTab === 'post-job' && (
                    <div>
                        <h2>Post a Job (Admin)</h2>
                        <form onSubmit={handleJobSubmit} style={{ marginBottom: 32, background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: 'block', marginBottom: 4 }}>Title</label>
                                <input 
                                    name="title" 
                                    value={jobForm.title} 
                                    onChange={handleJobFormChange} 
                                    required 
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: 'block', marginBottom: 4 }}>Description</label>
                                <textarea 
                                    name="description" 
                                    value={jobForm.description} 
                                    onChange={handleJobFormChange} 
                                    required 
                                    style={{ width: '100%', minHeight: 100, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: 'block', marginBottom: 4 }}>Budget ($)</label>
                                <input 
                                    name="budget" 
                                    type="number" 
                                    value={jobForm.budget} 
                                    onChange={handleJobFormChange} 
                                    required 
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={submitLoading}
                                style={{ 
                                    background: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '4px',
                                    cursor: submitLoading ? 'not-allowed' : 'pointer',
                                    opacity: submitLoading ? 0.6 : 1
                                }}
                            >
                                {submitLoading ? "Posting..." : "Post Job"}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;