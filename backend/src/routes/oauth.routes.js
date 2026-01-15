const express = require('express');
const router = express.Router();
const oauthController = require('../controllers/oauth.controller');

// Google OAuth routes
router.get('/google', oauthController.googleAuth);
router.get('/google/callback', oauthController.googleAuthCallback);

module.exports = router;
