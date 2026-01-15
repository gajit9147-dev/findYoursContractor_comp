const WorkerProfile = require('../models/WorkerProfile');
const User = require('../models/User');

/**
 * Create or update worker profile
 * POST /api/worker/profile
 */
exports.createOrUpdateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const profileData = req.body;

        // Validate primary expertise (1-2 items)
        if (profileData.expertisePrimary &&
            (profileData.expertisePrimary.length < 1 || profileData.expertisePrimary.length > 2)) {
            return res.status(400).json({
                success: false,
                message: 'Primary expertise must contain 1-2 items'
            });
        }

        // Validate secondary expertise (0-5 items)
        if (profileData.expertiseSecondary && profileData.expertiseSecondary.length > 5) {
            return res.status(400).json({
                success: false,
                message: 'Secondary expertise cannot exceed 5 items'
            });
        }

        // Check if profile exists
        let profile = await WorkerProfile.findOne({ userId });

        if (profile) {
            // Update existing profile
            Object.assign(profile, profileData);
            await profile.save();

            res.status(200).json({
                success: true,
                message: 'Worker profile updated successfully',
                data: profile
            });
        } else {
            // Create new profile
            profile = await WorkerProfile.create({
                userId,
                ...profileData
            });

            res.status(201).json({
                success: true,
                message: 'Worker profile created successfully',
                data: profile
            });
        }
    } catch (error) {
        console.error('Profile creation/update error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating/updating profile',
            error: error.message
        });
    }
};

/**
 * Get current user's worker profile
 * GET /api/worker/profile/me
 */
exports.getMyProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const profile = await WorkerProfile.findOne({ userId }).populate('userId', 'name email phone');

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Worker profile not found'
            });
        }

        res.status(200).json({
            success: true,
            data: profile
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message
        });
    }
};

/**
 * Get all workers with filters
 * GET /api/workers
 * Query params: city, skill, experienceYears, expertisePrimary, page, limit
 */
exports.getWorkers = async (req, res) => {
    try {
        const { city, skill, experienceYears, expertisePrimary, page = 1, limit = 20 } = req.query;

        // Build filter object
        const filter = {};

        if (city) {
            filter.city = new RegExp(city, 'i'); // Case-insensitive search
        }

        if (skill) {
            filter.skills = new RegExp(skill, 'i');
        }

        if (experienceYears) {
            filter.experienceYears = { $gte: parseInt(experienceYears) };
        }

        if (expertisePrimary) {
            filter.expertisePrimary = expertisePrimary;
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Query workers
        const workers = await WorkerProfile.find(filter)
            .populate('userId', 'name email phone')
            .limit(parseInt(limit))
            .skip(skip)
            .sort({ createdAt: -1 });

        const total = await WorkerProfile.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: {
                workers,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / parseInt(limit)),
                    totalWorkers: total,
                    limit: parseInt(limit)
                }
            }
        });
    } catch (error) {
        console.error('Get workers error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching workers',
            error: error.message
        });
    }
};
