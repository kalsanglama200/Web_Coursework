const db = require('../config/db');

exports.createJob = (title, description, budget, userId, callback) => {
  db.query(
    'INSERT INTO jobs (title, description, budget, user_id) VALUES (?, ?, ?, ?)',
    [title, description, budget, userId],
    callback
  );
};

exports.getAllJobs = (callback) => {
  // First get all jobs with client names
  db.query(`
    SELECT j.*, u.name as client_name 
    FROM jobs j 
    JOIN users u ON j.user_id = u.id 
    ORDER BY j.created_at DESC
  `, (err, jobs) => {
    if (err) return callback(err);
    
    // For each job, get its proposals
    const jobsWithProposals = [];
    let completed = 0;
    
    if (jobs.length === 0) {
      return callback(null, []);
    }
    
    jobs.forEach((job, index) => {
      db.query(`
        SELECT p.*, u.name as freelancer_name, u.email as freelancer_email
        FROM proposals p
        JOIN users u ON p.freelancer_id = u.id
        WHERE p.job_id = ?
        ORDER BY p.created_at DESC
      `, [job.id], (err, proposals) => {
        if (err) return callback(err);
        
        job.proposals = proposals;
        jobsWithProposals[index] = job;
        completed++;
        
        if (completed === jobs.length) {
          callback(null, jobsWithProposals);
        }
      });
    });
  });
};

exports.submitProposal = (jobId, freelancerId, message, callback) => {
  db.query(
    'INSERT INTO proposals (job_id, freelancer_id, message, status) VALUES (?, ?, ?, "pending")',
    [jobId, freelancerId, message],
    callback
  );
};

exports.getJobProposals = (jobId, callback) => {
  db.query(`
    SELECT p.*, u.name as freelancer_name, u.email as freelancer_email
    FROM proposals p
    JOIN users u ON p.freelancer_id = u.id
    WHERE p.job_id = ?
    ORDER BY p.created_at DESC
  `, [jobId], callback);
};

exports.updateProposalStatus = (jobId, proposalId, status, clientId, callback) => {
  // If clientId is null, it means admin is managing (skip ownership check)
  if (clientId === null) {
    db.query(
      'UPDATE proposals SET status = ? WHERE id = ? AND job_id = ?',
      [status, proposalId, jobId],
      callback
    );
  } else {
    // First verify that the job belongs to the client
    db.query(
      'SELECT user_id FROM jobs WHERE id = ?',
      [jobId],
      (err, results) => {
        if (err) return callback(err);
        if (results.length === 0) return callback(new Error('Job not found'));
        if (results[0].user_id !== clientId) return callback(new Error('Unauthorized'));
        
        db.query(
          'UPDATE proposals SET status = ? WHERE id = ? AND job_id = ?',
          [status, proposalId, jobId],
          callback
        );
      }
    );
  }
};

exports.deleteJob = (jobId, callback) => {
  // Delete proposals first, then the job
  db.query('DELETE FROM proposals WHERE job_id = ?', [jobId], (err) => {
    if (err) return callback(err);
    db.query('DELETE FROM jobs WHERE id = ?', [jobId], callback);
  });
};