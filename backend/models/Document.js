const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  extractedText: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
  },
  keywords: [{
    type: String,
  }],
  insights: [{
    type: String,
  }],
  tags: [{
    type: String,
  }],
  embedding: {
    type: [Number],
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Document', documentSchema);
