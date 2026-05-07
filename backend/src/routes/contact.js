import express from 'express';
import {
    validateContactRules,
    handleValidationErrors,
} from '../middleware/validateContact.js';
import { submitContact } from '../controllers/contactController.js';

const router = express.Router();

/**
 * POST /api/contact
 * Handle contact form submission
 * Validates input and sends email via Resend
 */
router.post(
    '/',
    validateContactRules(),
    handleValidationErrors,
    submitContact
);

export default router;
