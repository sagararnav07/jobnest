const mongoose = require('mongoose');
const Job = require('../models/Job');
const asyncHandler = require('../utils/asyncHandler');
const buildCompanySnapshot = require('../utils/companySnapshot');

const toArray = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') {
    return value
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const keywordsFromTitle = (title = '') =>
  title
    .split(' ')
    .map((word) => word.toLowerCase().replace(/[^a-z0-9]/g, ''))
    .filter(Boolean);

exports.createJob = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    type,
    experienceLevel,
    requirements,
    responsibilities,
    salary,
    applicationDeadline,
  } = req.body;

  const job = await Job.create({
    title,
    description,
    type,
    experienceLevel,
    requirements: toArray(requirements),
    responsibilities: toArray(responsibilities),
    salary,
    applicationDeadline,
    searchKeywords: keywordsFromTitle(title),
    company: buildCompanySnapshot(req.user),
    createdBy: req.user._id,
  });

  res.status(201).json({ job });
});

exports.getJobs = asyncHandler(async (req, res) => {
  const { search, type, experienceLevel, salary, companyEmail, limit = 0 } =
    req.query;
  const filter = {};

  if (search) {
    filter.$or = [
      { title: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
      { searchKeywords: search.toLowerCase() },
    ];
  }

  if (type) filter.type = type;
  if (experienceLevel) filter.experienceLevel = experienceLevel;
  if (salary) filter.salary = salary;
  if (companyEmail) filter['company.email'] = companyEmail;

  const jobs = await Job.find(filter)
    .sort({ createdAt: -1 })
    .limit(Number(limit) || 0);
  res.json({ jobs });
});

exports.getJobById = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid job id' });
  }
  const job = await Job.findById(req.params.id);
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }
  res.json({ job });
});

exports.getMyJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user._id }).sort({
    createdAt: -1,
  });
  res.json({ jobs });
});

exports.updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, createdBy: req.user._id });
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  const fields = [
    'title',
    'description',
    'type',
    'experienceLevel',
    'salary',
    'applicationDeadline',
  ];

  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      job[field] = req.body[field];
    }
  });

  if (req.body.requirements) {
    job.requirements = toArray(req.body.requirements);
  }
  if (req.body.responsibilities) {
    job.responsibilities = toArray(req.body.responsibilities);
  }
  if (req.body.title) {
    job.searchKeywords = keywordsFromTitle(req.body.title);
  }

  await job.save();
  res.json({ job });
});

exports.deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user._id,
  });
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }
  res.json({ message: 'Job deleted' });
});

