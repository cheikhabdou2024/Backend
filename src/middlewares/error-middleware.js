const logger = require('../config/logger');

const globalErrorHandler = (err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'production' ? {} : err.stack
    });
};

module.exports = globalErrorHandler;






