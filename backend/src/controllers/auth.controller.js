const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const OTP = require('../models/OTP');
const PasswordReset = require('../models/PasswordReset');
const { generateToken } = require('../utils/jwt.utils');
const { generateUniqueUserCode } = require('../utils/userCode.utils');
const { generateOTP, hashOTP, verifyOTP, getOTPExpiration } = require('../utils/otp.utils');
const { sendOTP, isValidPhoneNumber } = require('../utils/sms.utils');
const { sendPasswordResetEmail } = require('../utils/email.utils');

/**
 * Register a new user with email/password
 * POST /api/auth/register
 */
exports.register = async (req, res) => {
    try {
        const { name, email, phone, password, role } = req.body;

        // Validate at least one: email or phone
        if (!email && !phone) {
            return res.status(400).json({
                success: false,
                message: 'Either email or phone is required'
            });
        }

        // Check if user already exists
        const query = {};
        if (email) query.email = email.toLowerCase();
        if (phone) query.phone = phone;

        const existingUser = await User.findOne({
            $or: [
                email ? { email: query.email } : null,
                phone ? { phone: query.phone } : null
            ].filter(Boolean)
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email or phone already exists'
            });
        }

        // Validate role
        if (!['company', 'worker'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be either "company" or "worker"'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Generate unique user code
        const userCode = await generateUniqueUserCode();

        // Create new user
        const user = await User.create({
            name,
            email: email ? email.toLowerCase() : undefined,
            phone,
            passwordHash,
            role,
            userCode,
            authProviders: {
                local: true
            }
        });

        // Generate JWT token
        const token = generateToken({
            userId: user._id,
            email: user.email,
            role: user.role,
            userCode: user.userCode
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                token,
                user: {
                    id: user._id,
                    userCode: user.userCode,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    authProviders: user.authProviders
                }
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: error.message
        });
    }
};

/**
 * Login user with email/password or phone/password
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
    try {
        const { email, phone, password } = req.body;

        // Validate input
        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'Password is required'
            });
        }

        if (!email && !phone) {
            return res.status(400).json({
                success: false,
                message: 'Either email or phone is required'
            });
        }

        // Build query
        const query = {};
        if (email) query.email = email.toLowerCase();
        if (phone) query.phone = phone;

        // Find user and include password for verification
        const user = await User.findOne({
            $or: [
                email ? { email: query.email } : null,
                phone ? { phone: query.phone } : null
            ].filter(Boolean)
        }).select('+passwordHash');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if user has local auth (password)
        if (!user.authProviders.local || !user.passwordHash) {
            return res.status(401).json({
                success: false,
                message: 'This account uses a different login method. Try Google or phone OTP.'
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = generateToken({
            userId: user._id,
            email: user.email,
            role: user.role,
            userCode: user.userCode
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user._id,
                    userCode: user.userCode,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    authProviders: user.authProviders
                }
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message
        });
    }
};

/**
 * Request OTP for phone authentication
 * POST /api/auth/phone/request-otp
 */
exports.requestPhoneOTP = async (req, res) => {
    try {
        const { phone } = req.body;

        // Validate phone format
        if (!isValidPhoneNumber(phone)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid phone number format. Use E.164 format (e.g., +911234567890)'
            });
        }

        // Generate 4-digit OTP
        const otp = generateOTP();

        // Hash OTP
        const otpHash = await hashOTP(otp);

        // Delete any existing OTP for this phone
        await OTP.deleteMany({ phone });

        // Store hashed OTP
        await OTP.create({
            phone,
            otpHash,
            expiresAt: getOTPExpiration()
        });

        // Send OTP via SMS (or log in DEV_MODE)
        await sendOTP(phone, otp);

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            expiresIn: 300 // 5 minutes in seconds
        });
    } catch (error) {
        console.error('Request OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending OTP',
            error: error.message
        });
    }
};

/**
 * Verify OTP and login/register user
 * POST /api/auth/phone/verify-otp
 */
exports.verifyPhoneOTP = async (req, res) => {
    try {
        const { phone, otp } = req.body;

        // Validate phone format
        if (!isValidPhoneNumber(phone)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid phone number format'
            });
        }

        // Find OTP record
        const otpRecord = await OTP.findOne({ phone });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: 'No OTP found for this phone number. Please request a new OTP.'
            });
        }

        // Check expiration
        if (new Date() > otpRecord.expiresAt) {
            await OTP.deleteOne({ _id: otpRecord._id });
            return res.status(400).json({
                success: false,
                message: 'OTP has expired. Please request a new one.'
            });
        }

        // Check attempts
        if (otpRecord.attempts >= 5) {
            await OTP.deleteOne({ _id: otpRecord._id });
            return res.status(429).json({
                success: false,
                message: 'Too many failed attempts. Please request a new OTP.'
            });
        }

        // Verify OTP
        const isValid = await verifyOTP(otp, otpRecord.otpHash);

        if (!isValid) {
            // Increment attempts
            otpRecord.attempts += 1;
            await otpRecord.save();

            return res.status(400).json({
                success: false,
                message: `Invalid OTP. ${5 - otpRecord.attempts} attempts remaining.`
            });
        }

        // OTP is valid - delete it
        await OTP.deleteOne({ _id: otpRecord._id });

        // Find or create user
        let user = await User.findOne({ phone });

        if (!user) {
            // Create new user with phone auth
            const userCode = await generateUniqueUserCode();

            user = await User.create({
                name: `User ${phone.slice(-4)}`, // Temporary name
                phone,
                userCode,
                role: 'worker', // Default role
                authProviders: {
                    phone: true
                },
                isPhoneVerified: true
            });
        } else {
            // Update existing user
            if (!user.authProviders.phone) {
                user.authProviders.phone = true;
            }
            user.isPhoneVerified = true;
            await user.save();
        }

        // Generate JWT token
        const token = generateToken({
            userId: user._id,
            phone: user.phone,
            role: user.role,
            userCode: user.userCode
        });

        res.status(200).json({
            success: true,
            message: user.email ? 'Login successful' : 'Account created and logged in',
            data: {
                token,
                user: {
                    id: user._id,
                    userCode: user.userCode,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    authProviders: user.authProviders,
                    isNewUser: !user.email // Flag if account just created
                }
            }
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying OTP',
            error: error.message
        });
    }
};

/**
 * Request password reset link
 * POST /api/auth/password/forgot
 */
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Always return success (don't reveal if email exists)
        const genericResponse = {
            success: true,
            message: 'If an account with that email exists, a password reset link has been sent.'
        };

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            // Don't reveal that email doesn't exist
            return res.status(200).json(genericResponse);
        }

        // Check if user has local auth (can reset password)
        if (!user.authProviders.local) {
            // Don't reveal auth method
            return res.status(200).json(genericResponse);
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hash token
        const salt = await bcrypt.genSalt(10);
        const tokenHash = await bcrypt.hash(resetToken, salt);

        // Delete any existing reset tokens for this user
        await PasswordReset.deleteMany({ userId: user._id });

        // Create new reset token
        await PasswordReset.create({
            userId: user._id,
            tokenHash,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
        });

        // Send reset email (or log in DEV_MODE)
        await sendPasswordResetEmail(email, resetToken);

        res.status(200).json(genericResponse);
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing password reset request',
            error: error.message
        });
    }
};

/**
 * Reset password with token
 * POST /api/auth/password/reset
 */
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Token and new password are required'
            });
        }

        // Validate password length
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Find all non-expired, unused reset tokens
        const resetRecords = await PasswordReset.find({
            expiresAt: { $gt: new Date() },
            used: false
        }).populate('userId');

        // Check each token hash
        let validResetRecord = null;
        for (const record of resetRecords) {
            const isValid = await bcrypt.compare(token, record.tokenHash);
            if (isValid) {
                validResetRecord = record;
                break;
            }
        }

        if (!validResetRecord) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        // Update user password
        const user = await User.findById(validResetRecord.userId);
        user.passwordHash = passwordHash;
        if (!user.authProviders.local) {
            user.authProviders.local = true;
        }
        await user.save();

        // Mark token as used and delete all reset tokens for this user
        await PasswordReset.updateMany(
            { userId: user._id },
            { used: true }
        );

        res.status(200).json({
            success: true,
            message: 'Password reset successful. You can now login with your new password.'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error resetting password',
            error: error.message
        });
    }
};
