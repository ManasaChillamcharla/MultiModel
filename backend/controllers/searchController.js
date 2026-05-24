const Document = require('../models/Document');
const aiService = require('../services/aiService');
const mongoose = require('mongoose');

exports.semanticSearch = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database connection is not established. Please check if MONGO_URL/MONGO_URI is set in Vercel and that Vercel IPs are whitelisted (0.0.0.0/0) in MongoDB Atlas Network Access.' });
    }

    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const queryEmbedding = await aiService.generateQueryEmbedding(query);
    if (!queryEmbedding || queryEmbedding.length === 0) {
        return res.status(500).json({ error: 'Failed to generate embedding for query' });
    }

    const docs = await Document.find({ embedding: { $exists: true, $ne: [] } });
    
    // Calculate cosine similarity
    const results = docs.map(doc => {
       const similarity = cosineSimilarity(queryEmbedding, doc.embedding);
       return { doc, similarity };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5) // Top 5
    .map(item => {
        const docObj = item.doc.toObject();
        delete docObj.embedding;
        return { ...docObj, similarityScore: item.similarity };
    });

    res.status(200).json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Server error during search' });
  }
};

function cosineSimilarity(vecA, vecB) {
    let dotProduct = 0.0;
    let normA = 0.0;
    let normB = 0.0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
