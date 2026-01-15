const bcrypt = require('bcryptjs');

/**
 * Generate a random 4-digit OTP
 * Range: 1000-9999 (avoids leading zeros for consistency)
 * @returns {String} 4-digit OTP as string
 */
const generateOTP = () => {
    // Generate random number between 1000 and 9999
    const otp = Math.floor(1000 + Math.random() * 9000);
    return otp.toString();
};

/**
 * Hash an OTP using bcrypt
 * @param {String} otp - Plain OTP to hash
 * @returns {Promise<String>} Hashed OTP
 */
const hashOTP = async (otp) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(otp, salt);
};

/**
 * Verify an OTP against its hash
 * @param {String} otp - Plain OTP to verify
 * @param {String} hash - Hashed OTP to compare against
 * @returns {Promise<Boolean>} True if OTP matches
 */
const verifyOTP = async (otp, hash) => {
    return await bcrypt.compare(otp, hash);
};

/**
 * Generate expiration time for OTP (5 minutes from now)
 * @returns {Date} Expiration timestamp
 */
const getOTPExpiration = () => {
    return new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
};

module.exports = {
    generateOTP,
    hashOTP,
    verifyOTP,
    getOTPExpiration
};
