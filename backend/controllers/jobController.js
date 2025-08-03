const jobModel = require('../models/jobModel');

exports.createJob = (req, res) => {
  const { title, description, budget } = req.body;
  const userId = req.user.id; // from authMiddleware
  
  console.log('Creating job:', { title, description, budget, userId, userRole: req.user.role });
  
  if (!title || !description || !budget) {
    return res.status(400).json({ message: 'Title, description, and budget are required' });
  }
  
  jobModel.createJob(title, description, budget, userId, (err, result) => {
    if (err) {
      console.error('Error creating job:', err);
      return res.status(500).json({ error: err });
    }
    console.log('Job created successfully:', result);
    res.status(201).json({ message: 'Job created successfully', jobId: result.insertId });
  });
};

exports.getJobs = (req, res) => {
  console.log('Getting all jobs');
  jobModel.getAllJobs((err, results) => {
    if (err) {
      console.error('Error getting jobs:', err);
      return res.status(500).json({ error: err });
    }
    console.log(`Found ${results.length} jobs`);
    res.json(results);
  });
};

exports.submitProposal = (req, res) => {
  const { jobId } = req.params;
  const { message } = req.body;
  const freelancerId = req.user.id;
  
  console.log('Submitting proposal:', { jobId, freelancerId, message });
  
  if (!message) {
    return res.status(400).json({ message: 'Proposal message is required' });
  }
  
  jobModel.submitProposal(jobId, freelancerId, message, (err, result) => {
    if (err) {
      console.error('Error submitting proposal:', err);
      return res.status(500).json({ error: err });
    }
    console.log('Proposal submitted successfully');
    res.status(201).json({ message: 'Proposal submitted successfully' });
  });
};

exports.getJobProposals = (req, res) => {
  const { jobId } = req.params;
  
  console.log('Getting proposals for job:', jobId);
  
  jobModel.getJobProposals(jobId, (err, results) => {
    if (err) {
      console.error('Error getting proposals:', err);
      return res.status(500).json({ error: err });
    }
    console.log(`Found ${results.length} proposals for job ${jobId}`);
    res.json(results);
  });
};

exports.updateProposalStatus = (req, res) => {
  const { jobId, proposalId } = req.params;
  const { status } = req.body;
  const userId = req.user.id;
  const userRole = req.user.role;
  
  console.log('Updating proposal status:', { jobId, proposalId, status, userId, userRole });
  
  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Status must be either "accepted" or "rejected"' });
  }
  
  // If admin, allow managing any proposal
  if (userRole === 'Admin') {
    console.log('Admin updating proposal status');
    jobModel.updateProposalStatus(jobId, proposalId, status, null, (err, result) => {
      if (err) {
        console.error('Error updating proposal status (admin):', err);
        return res.status(500).json({ error: err });
      }
      console.log('Proposal status updated successfully by admin');
      res.json({ message: 'Proposal status updated successfully' });
    });
  } else {
    // For clients, verify they own the job
    console.log('Client updating proposal status');
    jobModel.updateProposalStatus(jobId, proposalId, status, userId, (err, result) => {
      if (err) {
        console.error('Error updating proposal status (client):', err);
        return res.status(500).json({ error: err });
      }
      console.log('Proposal status updated successfully by client');
      res.json({ message: 'Proposal status updated successfully' });
    });
  }
};

exports.deleteJob = (req, res) => {
  const { jobId } = req.params;
  
  console.log(`Admin attempting to delete job: ${jobId}`);
  
  jobModel.deleteJob(jobId, (err, result) => {
    if (err) {
      console.error('Error deleting job:', err);
      return res.status(500).json({ error: err });
    }
    console.log('Job deleted successfully');
    res.json({ message: 'Job deleted successfully' });
  });
};