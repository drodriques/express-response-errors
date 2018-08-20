export const HTTP_INTERNAL_SERVER_ERROR = 500
export const HTTP_UNAUTHORIZED = 401

export const STATUS_TEXTS = {
  [HTTP_UNAUTHORIZED]: 'Unauthorized',
  [HTTP_INTERNAL_SERVER_ERROR]: 'Internal Server Error'
}

export class HttpException extends Error {
  constructor (status, message = '') {
    super(message)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpException)
    }

    this.name = 'HttpException'
    this.status = status
  }
}

export function httpErrorHandler (err, req, res, next) {
  // Pass on non-http base error
  // !(err instanceof HttpException && STATUS_TEXTS[err.status])
  // (err && err.status && !STATUS_TEXTS[err.status])
  if (res.headersSent || !(err instanceof HttpException)) {
    return next(err)
  }

  return res.json(
    err.status,
    {
      message: err.message || STATUS_TEXTS[err.status]
    }
  )
}
