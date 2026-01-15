const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        unique: true,
        sparse: true, // Allows null values while maintaining uniqueness
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    phone: {
        type: String,
        unique: true,
        sparse: true, // Allows null values while maintaining uniqueness
        trim: true
    },
    passwordHash: {
        type: String,
        select: false // Don't include password in queries by default
    },
    role: {
        type: String,
        enum: ['company', 'worker'],
        required: [true, 'User role is required']
    },
    userCode: {
        type: String,
        unique: true,
        required: true,
        uppercase: true,
        match: [/^USR-[A-Z0-9]{6}$/, 'Invalid user code format']
    },
    authProviders: {
        local: {
            type: Boolean,
            default: false
        },
        google: {
            type: Boolean,
            default: false
        },
        phone: {
            type: Boolean,
            default: false
        }
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isPhoneVerified: {
        type: Boolean,
        default: false
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Validation: At least one of email or phone must be present
userSchema.pre('validate', function (next) {
    if (!this.email && !this.phone) {
        next(new Error('At least one of email or phone is required'));
    } else {
        next();
    }
});

// Indexes for faster lookups
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ userCode: 1 });
userSchema.index({ googleId: 1 });

// Method to exclude password from JSON responses
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.passwordHash;
    return obj;
};

module.exports = mongoose.model('User', userSchema);
