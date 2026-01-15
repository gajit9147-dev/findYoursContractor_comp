const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tokenHash: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: true
    },
    used: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 900 // TTL index: auto-delete after 15 minutes (900 seconds)
    }
});

// Index for userId lookups
passwordResetSchema.index({ userId: 1 });

// Index for automatic deletion of expired documents
passwordResetSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 });

module.exports = mongoose.model('PasswordReset', passwordResetSchema);
