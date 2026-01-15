const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for OTP request endpoint
 * Limits: 3 requests per phone per hour, 10 per IP per hour
 */
const otpRequestLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Per IP
    message: {
        success: false,
        message: 'Too many OTP requests. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Rate limiter for OTP verification endpoint
 * Limits: 5 attempts per 10 minutes per IP
 */
const otpVerifyLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 10,
    message: {
        success: false,
        message: 'Too many verification attempts. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Rate limiter for password reset request
 * Limits: 3 requests per hour per IP
 */
const passwordResetRequestLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: {
        success: false,
        message: 'Too many password reset requests. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Rate limiter for login attempts
 * Limits: 5 failed attempts per 15 minutes per IP
 */
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: {
        success: false,
        message: 'Too many login attempts. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * General API rate limiter
 * Limits: 100 requests per 15 minutes per IP
 */
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: 'Too many requests. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    otpRequestLimiter,
    otpVerifyLimiter,
    passwordResetRequestLimiter,
    loginLimiter,
    generalLimiter
};
