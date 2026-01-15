const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
    companyUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Contract title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Contract description is required']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true
    },
    locationCity: {
        type: String,
        required: [true, 'Location city is required'],
        trim: true
    },
    locationState: {
        type: String,
        required: [true, 'Location state is required'],
        trim: true
    },
    budgetMin: {
        type: Number,
        required: [true, 'Minimum budget is required'],
        min: [0, 'Budget cannot be negative']
    },
    budgetMax: {
        type: Number,
        required: [true, 'Maximum budget is required'],
        min: [0, 'Budget cannot be negative'],
        validate: {
            validator: function (value) {
                return value >= this.budgetMin;
            },
            message: 'Maximum budget must be greater than or equal to minimum budget'
        }
    },
    deadlineDate: {
        type: Date,
        required: [true, 'Deadline date is required'],
        validate: {
            validator: function (value) {
                return value > new Date();
            },
            message: 'Deadline must be in the future'
        }
    },
    status: {
        type: String,
        enum: ['open', 'closed', 'awarded'],
        default: 'open'
    },
    attachments: [{
        type: String,
        trim: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes for faster queries and filtering
contractSchema.index({ companyUserId: 1 });
contractSchema.index({ status: 1 });
contractSchema.index({ locationCity: 1 });
contractSchema.index({ category: 1 });
contractSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Contract', contractSchema);
