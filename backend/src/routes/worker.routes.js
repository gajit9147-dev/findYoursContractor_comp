const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const workerController = require('../controllers/worker.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');
const validate = require('../middleware/validation.middleware');

// Validation rules for worker profile
const profileValidation = [
    body('city').trim().notEmpty().withMessage('City is required'),
    body('state').trim().notEmpty().withMessage('State is required'),
    body('availability').isIn(['full-time', 'part-time', 'project']).withMessage('Invalid availability'),
    body('experienceYears').isInt({ min: 0 }).withMessage('Experience years must be a positive number'),
    body('expertiseLevel').isIn(['Beginner', 'Intermediate', 'Expert']).withMessage('Invalid expertise level')
];

// Routes

// Create/update worker profile (worker role only)
router.post(
    '/profile',
    authenticate,
    authorize('worker'),
    profileValidation,
    validate,
    workerController.createOrUpdateProfile
);

// Get current user's worker profile (worker role only)
router.get(
    '/profile/me',
    authenticate,
    authorize('worker'),
    workerController.getMyProfile
);

// Get all workers with filters (public)
router.get('/', workerController.getWorkers);

module.exports = router;
