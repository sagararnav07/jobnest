const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    displayName: String,
    email: String,
    photoURL: String,
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    sender: { type: participantSchema, required: true },
    receiver: { type: participantSchema, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

messageSchema.index({ 'sender.email': 1, 'receiver.email': 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);

