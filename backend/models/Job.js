const mongoose = require('mongoose');

const companySnapshotSchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    displayName: String,
    email: String,
    photoURL: String,
    userPhone: String,
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },
  },
  { _id: false }
);

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'contract'],
      default: 'full-time',
    },
    experienceLevel: {
      type: String,
      enum: ['entry-level', 'mid-level', 'senior'],
      default: 'entry-level',
    },
    requirements: [{ type: String }],
    responsibilities: [{ type: String }],
    salary: { type: String, default: '' },
    applicationDeadline: { type: Date, required: true },
    searchKeywords: [{ type: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: companySnapshotSchema, required: true },
    status: { type: String, default: 'active' },
  },
  { timestamps: true }
);

jobSchema.index({ title: 'text', description: 'text' });
jobSchema.index({ 'company.email': 1 });

module.exports = mongoose.model('Job', jobSchema);

