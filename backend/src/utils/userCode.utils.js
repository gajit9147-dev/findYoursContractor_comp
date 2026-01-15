const User = require('../models/User');

/**
 * Generate a random user code in format "USR-XXXXXX"
 * where X is uppercase alphanumeric (A-Z, 0-9)
 * @returns {String} Generated user code
 */
const generateUserCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'USR-';

    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return code;
};

/**
 * Generate a unique user code by checking database
 * Retries until a unique code is found
 * @returns {Promise<String>} Unique user code
 */
const generateUniqueUserCode = async () => {
    let userCode;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
        userCode = generateUserCode();

        // Check if code already exists
        const existingUser = await User.findOne({ userCode });

        if (!existingUser) {
            isUnique = true;
        }

        attempts++;
    }

    if (!isUnique) {
        throw new Error('Failed to generate unique user code after maximum attempts');
    }

    return userCode;
};

module.exports = {
    generateUserCode,
    generateUniqueUserCode
};
