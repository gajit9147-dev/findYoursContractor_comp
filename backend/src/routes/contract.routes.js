const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const contractController = require('../controllers/contract.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');
const validate = require('../middleware/validation.middleware');

// Validation rules for creating contract
const createContractValidation = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('locationCity').trim().notEmpty().withMessage('Location city is required'),
    body('locationState').trim().notEmpty().withMessage('Location state is required'),
    body('budgetMin').isFloat({ min: 0 }).withMessage('Minimum budget must be a positive number'),
    body('budgetMax').isFloat({ min: 0 }).withMessage('Maximum budget must be a positive number'),
    body('deadlineDate').isISO8601().withMessage('Valid deadline date is required')
];

// Validation rules for applying to contract
const applicationValidation = [
    body('bidAmount').isFloat({ min: 0 }).withMessage('Bid amount must be a positive number'),
    body('proposedDays').isInt({ min: 1 }).withMessage('Proposed days must be at least 1'),
    body('message').trim().notEmpty().withMessage('Application message is required')
];

// Routes

// Create new contract (company role only)
router.post(
    '/',
    authenticate,
    authorize('company'),
    createContractValidation,
    validate,
    contractController.createContract
);

// Get all contracts with filters (public)
router.get('/', contractController.getContracts);

// Get single contract by ID (public)
router.get('/:id', contractController.getContractById);

// Update contract (company role only, owner verification in controller)
router.patch(
    '/:id',
    authenticate,
    authorize('company'),
    contractController.updateContract
);

// Apply to contract (worker role only)
router.post(
    '/:id/apply',
    authenticate,
    authorize('worker'),
    applicationValidation,
    validate,
    contractController.applyToContract
);

// Get applications for a contract (company role only, owner verification in controller)
router.get(
    '/:id/applications',
    authenticate,
    authorize('company'),
    contractController.getContractApplications
);

module.exports = router;
