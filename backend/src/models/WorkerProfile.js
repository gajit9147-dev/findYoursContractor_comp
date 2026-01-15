const mongoose = require('mongoose');

const workerProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    photoUrl: {
        type: String,
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
    },
    radiusKm: {
        type: Number,
        default: 50,
        min: [0, 'Radius cannot be negative']
    },
    availability: {
        type: String,
        enum: ['full-time', 'part-time', 'project'],
        required: [true, 'Availability is required']
    },
    experienceYears: {
        type: Number,
        required: [true, 'Experience years is required'],
        min: [0, 'Experience cannot be negative']
    },
    skills: [{
        type: String,
        trim: true
    }],
    expertisePrimary: {
        type: [String],
        validate: {
            validator: function (arr) {
                return arr.length >= 1 && arr.length <= 2;
            },
            message: 'Primary expertise must contain 1-2 items'
        }
    },
    expertiseSecondary: {
        type: [String],
        validate: {
            validator: function (arr) {
                return arr.length <= 5;
            },
            message: 'Secondary expertise cannot exceed 5 items'
        },
        default: []
    },
    expertiseLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Expert'],
        required: [true, 'Expertise level is required']
    },
    portfolioImages: [{
        type: String,
        trim: true
    }],
    documents: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true
});

// Indexes for faster queries
workerProfileSchema.index({ userId: 1 });
workerProfileSchema.index({ city: 1 });
workerProfileSchema.index({ experienceYears: 1 });
workerProfileSchema.index({ expertisePrimary: 1 });

module.exports = mongoose.model('WorkerProfile', workerProfileSchema);
