const nodemailer = require('nodemailer');

/**
 * Create email transporter
 * Uses environment variables for configuration
 */
const createTransporter = () => {
    return nodemailer.createTransporter({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

/**
 * Send password reset email
 * @param {String} email - Recipient email
 * @param {String} resetToken - Reset token for URL
 * @returns {Promise} Email send result
 */
const sendPasswordResetEmail = async (email, resetToken) => {
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontendURL}/reset-password?token=${resetToken}`;

    // DEV_MODE: Just log to console instead of sending
    if (process.env.DEV_MODE === 'true') {
        console.log('\n========== PASSWORD RESET EMAIL (DEV MODE) ==========');
        console.log(`To: ${email}`);
        console.log(`Reset Link: ${resetLink}`);
        console.log(`Token: ${resetToken}`);
        console.log('====================================================\n');
        return { messageId: 'dev-mode-no-email-sent' };
    }

    const transporter = createTransporter();

    const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request - FabriContract',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">Reset Your Password</h2>
                <p>You requested to reset your password for your FabriContract account.</p>
                <p>Click the button below to reset your password:</p>
                <a href="${resetLink}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
                    Reset Password
                </a>
                <p style="color: #666; font-size: 14px;">
                    Or copy and paste this link into your browser:<br>
                    <a href="${resetLink}">${resetLink}</a>
                </p>
                <p style="color: #666; font-size: 14px;">
                    This link will expire in 15 minutes.
                </p>
                <p style="color: #666; font-size: 14px;">
                    If you didn't request this, please ignore this email.
                </p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                <p style="color: #999; font-size: 12px;">
                    © 2026 FabriContract. All rights reserved.
                </p>
            </div>
        `
    };

    return await transporter.sendMail(mailOptions);
};

/**
 * Send email verification email
 * @param {String} email - Recipient email
 * @param {String} verificationToken - Verification token
 * @returns {Promise} Email send result
 */
const sendEmailVerification = async (email, verificationToken) => {
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
    const verifyLink = `${frontendURL}/verify-email?token=${verificationToken}`;

    if (process.env.DEV_MODE === 'true') {
        console.log('\n========== EMAIL VERIFICATION (DEV MODE) ==========');
        console.log(`To: ${email}`);
        console.log(`Verification Link: ${verifyLink}`);
        console.log('==================================================\n');
        return { messageId: 'dev-mode-no-email-sent' };
    }

    const transporter = createTransporter();

    const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your Email - FabriContract',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">Verify Your Email</h2>
                <p>Thank you for registering with FabriContract!</p>
                <p>Click the button below to verify your email address:</p>
                <a href="${verifyLink}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
                    Verify Email
                </a>
                <p style="color: #666; font-size: 14px;">
                    Or copy and paste this link into your browser:<br>
                    <a href="${verifyLink}">${verifyLink}</a>
                </p>
                <p style="color: #666; font-size: 14px;">
                    If you didn't create this account, please ignore this email.
                </p>
            </div>
        `
    };

    return await transporter.sendMail(mailOptions);
};

module.exports = {
    sendPasswordResetEmail,
    sendEmailVerification
};
