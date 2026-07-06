export default function errorHandler(
    err,
    req,
    res,
    next
) {
    if (res?.headersSent) {
        return next(err);
    }
    const statusCode = err?.status || err?.statusCode || 500

    const response = {
        success: false,
        message: err?.message || "Something went wrong"
    }

    if (process.env.NODE_ENV === 'development') {
        response.stack = err?.stack;
    }

    res.status(statusCode).json(response);

}

