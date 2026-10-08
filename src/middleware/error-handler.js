import { ApiError } from '../errors.js';

export function notFound(req, _res, next) {
  next(new ApiError(404, `Route ${req.method} ${req.originalUrl} was not found.`, 'NOT_FOUND'));
}

export function errorHandler(error, _req, res, _next) {
  if (error instanceof ApiError) {
    res.status(error.status).json({
      error: {
        code: error.code,
        message: error.message,
        ...(error.details ? { details: error.details } : {})
      }
    });
    return;
  }

  if (error?.code === '23505') {
    res.status(409).json({
      error: { code: 'CONFLICT', message: 'A record with that value already exists.' }
    });
    return;
  }

  console.error(error);
  res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'An unexpected server error occurred.' }
  });
}
