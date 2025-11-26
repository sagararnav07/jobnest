const Message = require('../models/Message');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

exports.sendMessage = asyncHandler(async (req, res) => {
  const { receiverEmail, message } = req.body;
  if (!receiverEmail || !message) {
    return res
      .status(400)
      .json({ message: 'Receiver email and message are required' });
  }

  const receiverUser = await User.findOne({ email: receiverEmail });
  if (!receiverUser) {
    return res.status(404).json({ message: 'Receiver not found' });
  }

  const payload = await Message.create({
    sender: {
      userId: req.user._id,
      displayName: req.user.displayName,
      email: req.user.email,
      photoURL: req.user.photoURL,
    },
    receiver: {
      userId: receiverUser._id,
      displayName: receiverUser.displayName,
      email: receiverUser.email,
      photoURL: receiverUser.photoURL,
    },
    message,
  });

  res.status(201).json({ message: payload });
});

exports.getConversation = asyncHandler(async (req, res) => {
  const { participantEmail } = req.query;
  if (!participantEmail) {
    return res.status(400).json({ message: 'participantEmail is required' });
  }

  const thread = await Message.find({
    $or: [
      { 'sender.email': req.user.email, 'receiver.email': participantEmail },
      { 'sender.email': participantEmail, 'receiver.email': req.user.email },
    ],
  }).sort({ createdAt: 1 });

  res.json({ messages: thread });
});

