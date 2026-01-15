const twilio = require('twilio');

/**
 * Create Twilio client
 */
const createTwilioClient = () => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
        return null;
    }

    return twilio(accountSid, authToken);
};

/**
 * Send OTP via SMS using Twilio
 * @param {String} phone - Phone number in E.164 format
 * @param {String} otp - 4-digit OTP
 * @returns {Promise} SMS send result
 */
const sendOTP = async (phone, otp) => {
    // DEV_MODE: Just log to console instead of sending SMS
    if (process.env.DEV_MODE === 'true') {
        console.log('\n========== OTP SMS (DEV MODE) ==========');
        console.log(`To: ${phone}`);
        console.log(`OTP: ${otp}`);
        console.log(`Message: Your FabriContract verification code is: ${otp}. Valid for 5 minutes.`);
        console.log('========================================\n');
        return { sid: 'dev-mode-no-sms-sent', status: 'delivered' };
    }

    const client = createTwilioClient();

    if (!client) {
        throw new Error('Twilio credentials not configured');
    }

    const message = await client.messages.create({
        body: `Your FabriContract verification code is: ${otp}. Valid for 5 minutes. Do not share this code with anyone.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
    });

    return message;
};

/**
 * Validate phone number format (E.164)
 * @param {String} phone - Phone number to validate
 * @returns {Boolean} True if valid format
 */
const isValidPhoneNumber = (phone) => {
    // E.164 format: +[country code][number]
    // Example: +911234567890
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    return e164Regex.test(phone);
};

module.exports = {
    sendOTP,
    isValidPhoneNumber
};
