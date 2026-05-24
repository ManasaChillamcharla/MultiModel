const Document = require('../models/Document');
const parserService = require('../services/parserService');
const aiService = require('../services/aiService');
const fs = require('fs');

exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      console.error('Upload Error: No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { originalname, mimetype, path } = req.file;

    // 1. Parse File
    let extractedText = '';
    try {
        extractedText = await parserService.extractText(path, mimetype);
    } catch(err) {
        fs.unlinkSync(path); // Clean up
        return res.status(400).json({ error: 'Failed to extract text: ' + err.message });
    }

    if (!extractedText || extractedText.trim() === '') {
        console.warn('Warning: No text found in file (could be a scanned PDF). Using fallback text.');
        extractedText = 'This document appears to be a scanned image or has no parseable text layer. This is a fallback text.';
    }

    // 2. AI Analysis
    const analysis = await aiService.analyzeText(extractedText);

    // 3. Generate Embeddings
    const embedding = await aiService.generateEmbedding(extractedText);

    // 4. Save to DB
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
        const newDoc = new Document({
          filename: originalname,
          fileType: mimetype,
          extractedText,
          summary: analysis.summary,
          keywords: analysis.keywords,
          insights: analysis.insights,
          tags: analysis.tags,
          embedding
        });
        await newDoc.save();
        fs.unlinkSync(path);
        return res.status(201).json(newDoc);
    } else {
        const mockDoc = {
          _id: Date.now().toString(),
          filename: originalname,
          fileType: mimetype,
          summary: analysis.summary,
          keywords: analysis.keywords,
          insights: analysis.insights,
          tags: analysis.tags,
          uploadedAt: new Date()
        };
        fs.unlinkSync(path);
        return res.status(201).json(mockDoc);
    }
  } catch (error) {
    console.error("Upload error:", error);
    if (req.file && fs.existsSync(req.file.path)) {
       fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Server error during upload' });
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const docs = await Document.find().select('-embedding -extractedText').sort({ uploadedAt: -1 });
    res.status(200).json(docs);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getDocumentById = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id).select('-embedding');
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    res.status(200).json(doc);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
