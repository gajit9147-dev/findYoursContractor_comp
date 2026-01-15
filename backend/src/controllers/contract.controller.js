const Contract = require('../models/Contract');
const Application = require('../models/Application');
const WorkerProfile = require('../models/WorkerProfile');

/**
 * Create new contract
 * POST /api/contracts
 */
exports.createContract = async (req, res) => {
    try {
        const companyUserId = req.user.userId;
        const contractData = req.body;

        // Validate budget
        if (contractData.budgetMax < contractData.budgetMin) {
            return res.status(400).json({
                success: false,
                message: 'Maximum budget must be greater than or equal to minimum budget'
            });
        }

        // Validate deadline is in future
        if (new Date(contractData.deadlineDate) <= new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Deadline must be in the future'
            });
        }

        // Create contract
        const contract = await Contract.create({
            companyUserId,
            ...contractData
        });

        res.status(201).json({
            success: true,
            message: 'Contract created successfully',
            data: contract
        });
    } catch (error) {
        console.error('Contract creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating contract',
            error: error.message
        });
    }
};

/**
 * Get all contracts with filters
 * GET /api/contracts
 * Query params: keyword, city, category, budgetMin, budgetMax, status, page, limit
 */
exports.getContracts = async (req, res) => {
    try {
        const { keyword, city, category, budgetMin, budgetMax, status, page = 1, limit = 20 } = req.query;

        // Build match filter
        const matchFilter = {};

        if (keyword) {
            matchFilter.$or = [
                { title: new RegExp(keyword, 'i') },
                { description: new RegExp(keyword, 'i') }
            ];
        }

        if (city) {
            matchFilter.locationCity = new RegExp(city, 'i');
        }

        if (category) {
            matchFilter.category = category;
        }

        if (budgetMin || budgetMax) {
            matchFilter.budgetMin = {};
            if (budgetMin) matchFilter.budgetMin.$gte = parseInt(budgetMin);
            if (budgetMax) matchFilter.budgetMax = { $lte: parseInt(budgetMax) };
        }

        if (status) {
            matchFilter.status = status;
        } else {
            matchFilter.status = 'open';
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Aggregation pipeline to get contracts with applicant count
        const contracts = await Contract.aggregate([
            { $match: matchFilter },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: parseInt(limit) },
            {
                $lookup: {
                    from: 'applications',
                    localField: '_id',
                    foreignField: 'contractId',
                    as: 'applications'
                }
            },
            {
                $addFields: {
                    applicantCount: { $size: '$applications' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'companyUserId',
                    foreignField: '_id',
                    as: 'company'
                }
            },
            { $unwind: '$company' },
            {
                $project: {
                    applications: 0,
                    'company.passwordHash': 0,
                    'company.authProviders': 0
                }
            }
        ]);

        const total = await Contract.countDocuments(matchFilter);

        res.status(200).json({
            success: true,
            data: {
                contracts,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / parseInt(limit)),
                    totalContracts: total,
                    limit: parseInt(limit)
                }
            }
        });
    } catch (error) {
        console.error('Get contracts error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching contracts',
            error: error.message
        });
    }
};

/**
 * Get single contract by ID
 * GET /api/contracts/:id
 */
exports.getContractById = async (req, res) => {
    try {
        const { id } = req.params;

        const contract = await Contract.findById(id)
            .populate('companyUserId', 'name email phone');

        if (!contract) {
            return res.status(404).json({
                success: false,
                message: 'Contract not found'
            });
        }

        res.status(200).json({
            success: true,
            data: contract
        });
    } catch (error) {
        console.error('Get contract error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching contract',
            error: error.message
        });
    }
};

/**
 * Update contract
 * PATCH /api/contracts/:id
 */
exports.updateContract = async (req, res) => {
    try {
        const { id } = req.params;
        const companyUserId = req.user.userId;
        const updates = req.body;

        // Find contract
        const contract = await Contract.findById(id);

        if (!contract) {
            return res.status(404).json({
                success: false,
                message: 'Contract not found'
            });
        }

        // Verify ownership
        if (contract.companyUserId.toString() !== companyUserId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this contract'
            });
        }

        // Validate budget if being updated
        if (updates.budgetMax && updates.budgetMin) {
            if (updates.budgetMax < updates.budgetMin) {
                return res.status(400).json({
                    success: false,
                    message: 'Maximum budget must be greater than or equal to minimum budget'
                });
            }
        }

        // Validate deadline if being updated
        if (updates.deadlineDate && new Date(updates.deadlineDate) <= new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Deadline must be in the future'
            });
        }

        // Update contract
        Object.assign(contract, updates);
        await contract.save();

        res.status(200).json({
            success: true,
            message: 'Contract updated successfully',
            data: contract
        });
    } catch (error) {
        console.error('Update contract error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating contract',
            error: error.message
        });
    }
};

/**
 * Apply to contract
 * POST /api/contracts/:id/apply
 */
exports.applyToContract = async (req, res) => {
    try {
        const { id } = req.params;
        const workerUserId = req.user.userId;
        const { bidAmount, proposedDays, message } = req.body;

        // Check if contract exists
        const contract = await Contract.findById(id);
        if (!contract) {
            return res.status(404).json({
                success: false,
                message: 'Contract not found'
            });
        }

        // Check if contract is open
        if (contract.status !== 'open') {
            return res.status(400).json({
                success: false,
                message: 'This contract is no longer accepting applications'
            });
        }

        // Check if worker has a profile
        const workerProfile = await WorkerProfile.findOne({ userId: workerUserId });
        if (!workerProfile) {
            return res.status(400).json({
                success: false,
                message: 'Please create a worker profile before applying to contracts'
            });
        }

        // Check if worker already applied
        const existingApplication = await Application.findOne({
            contractId: id,
            workerUserId
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied to this contract'
            });
        }

        // Create application
        const application = await Application.create({
            contractId: id,
            workerUserId,
            bidAmount,
            proposedDays,
            message
        });

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: application
        });
    } catch (error) {
        console.error('Apply to contract error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting application',
            error: error.message
        });
    }
};

/**
 * Get applications for a contract
 * GET /api/contracts/:id/applications
 */
exports.getContractApplications = async (req, res) => {
    try {
        const { id } = req.params;
        const companyUserId = req.user.userId;
        const { page = 1, limit = 20 } = req.query;

        // Find contract and verify ownership
        const contract = await Contract.findById(id);
        if (!contract) {
            return res.status(404).json({
                success: false,
                message: 'Contract not found'
            });
        }

        if (contract.companyUserId.toString() !== companyUserId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to view applications for this contract'
            });
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get applications
        const applications = await Application.find({ contractId: id })
            .populate('workerUserId', 'name email phone')
            .populate({
                path: 'workerUserId',
                populate: {
                    path: 'userId',
                    select: 'name email phone'
                }
            })
            .limit(parseInt(limit))
            .skip(skip)
            .sort({ createdAt: -1 });

        // Also populate worker profiles
        const applicationsWithProfiles = await Promise.all(
            applications.map(async (app) => {
                const workerProfile = await WorkerProfile.findOne({
                    userId: app.workerUserId._id
                });
                return {
                    ...app.toObject(),
                    workerProfile
                };
            })
        );

        const total = await Application.countDocuments({ contractId: id });

        res.status(200).json({
            success: true,
            data: {
                applications: applicationsWithProfiles,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / parseInt(limit)),
                    totalApplications: total,
                    limit: parseInt(limit)
                }
            }
        });
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message
        });
    }
};
