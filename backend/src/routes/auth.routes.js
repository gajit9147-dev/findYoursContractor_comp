const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const validate = require('../middleware/validation.middleware');
const {
    loginLimiter,
    otpRequestLimiter,
    otpVerifyLimiter,
    passwordResetRequestLimiter
} = require('../middleware/rateLimiter.middleware');

// Validation rules for registration
const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('phone').optional().trim().notEmpty().withMessage('Phone number is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['company', 'worker']).withMessage('Role must be either company or worker')
];

// Validation rules for login
const loginValidation = [
    body('password').notEmpty().withMessage('Password is required')
];

// Validation rules for phone OTP request
const phoneOTPRequestValidation = [
    body('phone').trim().notEmpty().withMessage('Phone number is required')
];

// Validation rules for phone OTP verification
const phoneOTPVerifyValidation = [
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('otp').isLength({ min: 4, max: 4 }).withMessage('OTP must be 4 digits')
];

// Validation rules for forgot password
const forgotPasswordValidation = [
    body('email').isEmail().withMessage('Valid email is required')
];

// Validation rules for reset password
const resetPasswordValidation = [
    body('token').trim().notEmpty().withMessage('Reset token is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// Routes

// Email/Password Authentication
router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginLimiter, loginValidation, validate, authController.login);

// Phone OTP Authentication
router.post(
    '/phone/request-otp',
    otpRequestLimiter,
    phoneOTPRequestValidation,
    validate,
    authController.requestPhoneOTP
);
router.post(
    '/phone/verify-otp',
    otpVerifyLimiter,
    phoneOTPVerifyValidation,
    validate,
    authController.verifyPhoneOTP
);

// Password Reset
router.post(
    '/password/forgot',
    passwordResetRequestLimiter,
    forgotPasswordValidation,
    validate,
    authController.forgotPassword
);
router.post(
    '/password/reset',
    resetPasswordValidation,
    validate,
    authController.resetPassword
);

module.exports = router;
