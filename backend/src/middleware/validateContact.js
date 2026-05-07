import { body, validationResult } from 'express-validator';

/**
 * Validation rules for contact form submission
 * Validates: name, email, serviceType, budget, description
 */
export const validateContactRules = () => {
    return [
        body('name')
            .trim()
            .notEmpty()
            .withMessage('Name is required')
            .isLength({ min: 2, max: 50 })
            .withMessage('Name must be between 2 and 50 characters'),

        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Please provide a valid email address')
            .normalizeEmail(),

        body('serviceType')
            .trim()
            .notEmpty()
            .withMessage('Service type is required')
            .isLength({ max: 100 })
            .withMessage('Service type must be less than 100 characters'),

        body('budget')
            .trim()
            .notEmpty()
            .withMessage('Budget range is required')
            .isLength({ max: 100 })
            .withMessage('Budget must be less than 100 characters'),

        body('description')
            .trim()
            .notEmpty()
            .withMessage('Project description is required')
            .isLength({ min: 10, max: 2000 })
            .withMessage('Description must be between 10 and 2000 characters'),

        // Optional fields
        body('company')
            .optional()
            .trim()
            .isLength({ max: 100 })
            .withMessage('Company name must be less than 100 characters'),

        body('phone')
            .optional()
            .trim()
            .isLength({ max: 20 })
            .withMessage('Phone number must be less than 20 characters'),
    ];
};

/**
 * Middleware to handle validation errors
 * Returns validation errors if any exist, otherwise passes control to next middleware
 */
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array(),
        });
    }
    next();
};
