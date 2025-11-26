exports.handleUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.status(201).json({
    filename: req.file.filename,
    url: `/uploads/${req.file.filename}`,
  });
};

