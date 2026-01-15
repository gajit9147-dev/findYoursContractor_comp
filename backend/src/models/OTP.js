const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        trim: true
    },
    otpHash: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: true
    },
    attempts: {
        type: Number,
        default: 0,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // TTL index: auto-delete after 5 minutes (300 seconds)
    }
});

// Index for faster phone lookups
otpSchema.index({ phone: 1 });

// Index for automatic deletion of expired documents
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

module.exports = mongoose.model('OTP', otpSchema);
