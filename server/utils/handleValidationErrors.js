module.exports = function handleValidationErrors(res, message, errors, errCode) {
    if (Object.keys(errors).length) {
        return res.status(errCode).json({
            message: message,
            errors
        });
    }
};