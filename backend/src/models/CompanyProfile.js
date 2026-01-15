const mongoose = require('mongoose');

const companyProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    companyName: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true
    },
    gstNumber: {
        type: String,
        trim: true,
        sparse: true // Allows null values while maintaining uniqueness for non-null values
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
    },
    state: {
        type: String,
        required: [true, 'State is required'],
        trim: true
    }
}, {
    timestamps: true
});

// Index for faster userId lookups
companyProfileSchema.index({ userId: 1 });

module.exports = mongoose.model('CompanyProfile', companyProfileSchema);
