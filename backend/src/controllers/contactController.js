import { sendContactEmail } from '../services/emailService.js';

/**
 * Handle contact form submission
 * Validates input (via middleware) and sends email via Resend
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const submitContact = async (req, res) => {
    try {
        // Extract validated data from request body
        const {
            name,
            email,
            serviceType,
            budget,
            description,
            company,
            phone,
        } = req.body;

        // Prepare contact data for email service
        const contactData = {
            name,
            email,
            serviceType,
            budget,
            description,
            company: company || undefined,
            phone: phone || undefined,
        };

        // Send email via Resend
        await sendContactEmail(contactData);

        // Log successful submission
        console.log(`Contact form submitted by: ${name} (${email})`);

        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Your message has been sent! We\'ll get back to you soon.',
        });
    } catch (error) {
        // Log full error for debugging
        console.error('Error in submitContact controller:', error);

        // Return a generic client-safe error message
        return res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again later.',
        });
    }
};
