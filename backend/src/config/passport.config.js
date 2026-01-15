const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const { generateUniqueUserCode } = require('../utils/userCode.utils');

/**
 * Configure Passport Google OAuth Strategy
 */
const configureGoogleAuth = () => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                const googleId = profile.id;

                // Check if user exists with this Google ID
                let user = await User.findOne({ googleId });

                if (user) {
                    // User exists with this Google account
                    return done(null, user);
                }

                // Check if user exists with this email (account linking)
                user = await User.findOne({ email });

                if (user) {
                    // Link Google provider to existing account
                    user.googleId = googleId;
                    user.authProviders.google = true;
                    user.isEmailVerified = true; // Google verifies email
                    await user.save();
                    return done(null, user);
                }

                // Create new user with Google account
                const userCode = await generateUniqueUserCode();

                user = await User.create({
                    name: profile.displayName,
                    email,
                    googleId,
                    userCode,
                    role: 'worker', // Default role, can be changed later
                    authProviders: {
                        google: true
                    },
                    isEmailVerified: true
                });

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    ));

    // Serialize user for session (if using sessions)
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Deserialize user from session
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
};

module.exports = configureGoogleAuth;
