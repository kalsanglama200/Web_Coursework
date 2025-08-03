const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authenticate, requireClient, requireFreelancer, requireAdmin, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', jobController.getJobs);

// Job creation - Clients and Admins can create jobs
router.post('/', authenticate, authorize('Client', 'Admin'), jobController.createJob);

// Freelancer routes - only freelancers can submit proposals
router.post('/:jobId/proposals', authenticate, requireFreelancer, jobController.submitProposal);
router.get('/:jobId/proposals', authenticate, jobController.getJobProposals);

// Proposal management - Clients and Admins can manage proposals
router.put('/:jobId/proposals/:proposalId', authenticate, authorize('Client', 'Admin'), jobController.updateProposalStatus);

// Admin routes - only admins can delete jobs
router.delete('/:jobId', authenticate, requireAdmin, jobController.deleteJob);

module.exports = router;