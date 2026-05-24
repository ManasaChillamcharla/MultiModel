const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ── File upload config ─────────────────────────────────────────────────────────
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// ── Controllers ────────────────────────────────────────────────────────────────
const authController = require('../controllers/authController');
const documentController = require('../controllers/documentController');
const searchController = require('../controllers/searchController');

// ── Middleware ──────────────────────────────────────────────────────────────────
const { protect } = require('../middleware/authMiddleware');

// ── Auth routes (public) ───────────────────────────────────────────────────────
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', protect, authController.getMe);

// ── Document routes (protected) ────────────────────────────────────────────────
router.post('/upload', protect, upload.single('file'), documentController.uploadDocument);
router.get('/documents', protect, documentController.getDocuments);
router.get('/documents/:id', protect, documentController.getDocumentById);
router.delete('/documents/:id', protect, documentController.deleteDocument);

// ── Search routes (protected) ──────────────────────────────────────────────────
router.post('/search/semantic', protect, searchController.semanticSearch);

module.exports = router;
