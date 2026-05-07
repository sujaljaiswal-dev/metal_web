import dotenv from 'dotenv';

// Load environment variables from .env file immediately
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import contactRoutes from './routes/contact.js';

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// ============= Security Middleware =============

// Helmet middleware for security headers
app.use(helmet());

// CORS configuration - allow requests only from frontend URL
app.use(
    cors({
        origin: FRONTEND_URL,
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type'],
    })
);

// ============= Rate Limiting =============

// Rate limiter: max 5 requests per 15 minutes per IP
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per windowMs
    message: {
        success: false,
        message: 'Too many submissions from this IP, please try again later.',
    },
    standardHeaders: true, // Return rate limit info in RateLimit-* headers
    legacyHeaders: false, // Disable X-RateLimit-* headers
    skip: (req) => {
        // Skip rate limiting for health check endpoint
        return req.path === '/health';
    },
});

// ============= Body Parsing Middleware =============

// Parse JSON request bodies
app.use(express.json({ limit: '10kb' })); // Limit payload size to 10KB for security

// ============= Routes =============

/**
 * Health check endpoint
 * GET /health
 * Used to verify the server is running
 */
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

/**
 * Contact form submission endpoint
 * POST /api/contact
 * Rate limited to prevent spam
 */
app.use('/api/contact', contactLimiter, contactRoutes);

// ============= 404 Handler =============

/**
 * Catch-all handler for undefined routes
 */
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
    });
});

// ============= Error Handling Middleware =============

/**
 * Global error handling middleware
 * Catches all errors and returns consistent error response
 */
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'An unexpected error occurred';

    res.status(statusCode).json({
        success: false,
        message: statusCode === 500 ? 'Something went wrong.' : message,
    });
});

// ============= Server Startup =============

/**
 * Start the Express server
 * Listen on configured PORT
 */
const server = app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════╗
║      🤘 METAL WEB BACKEND 🤘      ║
╠════════════════════════════════════╣
║  Server running on port ${PORT}           ║
║  Frontend: ${FRONTEND_URL}
║  Status: ✓ Ready to accept requests  ║
╚════════════════════════════════════╝
  `);
});

/**
 * Graceful shutdown handler
 * Close server connections on termination signals
 */
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

export default app;
