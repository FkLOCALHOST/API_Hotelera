export const catchErrors = (err, req, res, next) => {
    const statusCode = err.status || 500;
    if (statusCode === 400 || err.errors) {
        return res.status(400).json({
            success: false,
            errors: err.errors || []
        });
    }
    return res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
};
