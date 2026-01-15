const passport = require('passport');
const { generateToken } = require('../utils/jwt.utils');

/**
 * Initiate Google OAuth
 * GET /api/auth/google
 */
exports.googleAuth = passport.authenticate('google', {
    scope: ['profile', 'email']
});

/**
 * Google OAuth callback
 * GET /api/auth/google/callback
 */
exports.googleAuthCallback = (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
        if (err) {
            console.error('Google OAuth error:', err);
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
        }

        if (!user) {
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
        }

        // Generate JWT token
        const token = generateToken({
            userId: user._id,
            email: user.email,
            role: user.role,
            userCode: user.userCode
        });

        // Redirect to frontend with token
        // Frontend should extract token from URL and store it
        res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
    })(req, res, next);
};

module.exports = exports;
