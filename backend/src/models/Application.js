const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    contractId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contract',
        required: true
    },
    workerUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bidAmount: {
        type: Number,
        required: [true, 'Bid amount is required'],
        min: [0, 'Bid amount cannot be negative']
    },
    proposedDays: {
        type: Number,
        required: [true, 'Proposed days is required'],
        min: [1, 'Proposed days must be at least 1']
    },
    message: {
        type: String,
        required: [true, 'Application message is required'],
        trim: true
    },
    status: {
        type: String,
        enum: ['applied', 'shortlisted', 'awarded', 'rejected'],
        default: 'applied'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound index to prevent duplicate applications
applicationSchema.index({ contractId: 1, workerUserId: 1 }, { unique: true });

// Additional indexes for queries
applicationSchema.index({ contractId: 1 });
applicationSchema.index({ workerUserId: 1 });

module.exports = mongoose.model('Application', applicationSchema);
