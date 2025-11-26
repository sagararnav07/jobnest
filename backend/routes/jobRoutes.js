const express = require('express');
const {
  createJob,
  getJobs,
  getJobById,
  getMyJobs,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');
const { auth, requireCompany } = require('../middleware/auth');

const router = express.Router();

router.get('/', getJobs);
router.get('/mine', auth, requireCompany, getMyJobs);
router.get('/:id', getJobById);
router.post('/', auth, requireCompany, createJob);
router.put('/:id', auth, requireCompany, updateJob);
router.delete('/:id', auth, requireCompany, deleteJob);

module.exports = router;

