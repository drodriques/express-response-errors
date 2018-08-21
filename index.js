export const HTTP_CONTINUE = 100
export const HTTP_SWITCHING_PROTOCOLS = 101
export const HTTP_PROCESSING = 102
export const HTTP_EARLY_HINTS = 103
export const HTTP_OK = 200
export const HTTP_CREATED = 201
export const HTTP_ACCEPTED = 202
export const HTTP_NON_AUTHORITATIVE_INFORMATION = 203
export const HTTP_NO_CONTENT = 204
export const HTTP_RESET_CONTENT = 205
export const HTTP_PARTIAL_CONTENT = 206
export const HTTP_MULTI_STATUS = 207
export const HTTP_ALREADY_REPORTED = 208
export const HTTP_IM_USED = 226
export const HTTP_MULTIPLE_CHOICES = 300
export const HTTP_MOVED_PERMANENTLY = 301
export const HTTP_FOUND = 302
export const HTTP_SEE_OTHER = 303
export const HTTP_NOT_MODIFIED = 304
export const HTTP_USE_PROXY = 305
export const HTTP_RESERVED = 306
export const HTTP_TEMPORARY_REDIRECT = 307
export const HTTP_PERMANENTLY_REDIRECT = 308
export const HTTP_BAD_REQUEST = 400
export const HTTP_UNAUTHORIZED = 401
export const HTTP_PAYMENT_REQUIRED = 402
export const HTTP_FORBIDDEN = 403
export const HTTP_NOT_FOUND = 404
export const HTTP_METHOD_NOT_ALLOWED = 405
export const HTTP_NOT_ACCEPTABLE = 406
export const HTTP_PROXY_AUTHENTICATION_REQUIRED = 407
export const HTTP_REQUEST_TIMEOUT = 408
export const HTTP_CONFLICT = 409
export const HTTP_GONE = 410
export const HTTP_LENGTH_REQUIRED = 411
export const HTTP_PRECONDITION_FAILED = 412
export const HTTP_REQUEST_ENTITY_TOO_LARGE = 413
export const HTTP_REQUEST_URI_TOO_LONG = 414
export const HTTP_UNSUPPORTED_MEDIA_TYPE = 415
export const HTTP_REQUESTED_RANGE_NOT_SATISFIABLE = 416
export const HTTP_EXPECTATION_FAILED = 417
export const HTTP_I_AM_A_TEAPOT = 418
export const HTTP_MISDIRECTED_REQUEST = 421
export const HTTP_UNPROCESSABLE_ENTITY = 422
export const HTTP_LOCKED = 423
export const HTTP_FAILED_DEPENDENCY = 424

export const STATUS_TEXTS = {
  100: 'Continue',
  101: 'Switching Protocols',
  102: 'Processing',            // RFC2518
  103: 'Early Hints',
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  207: 'Multi-Status',          // RFC4918
  208: 'Already Reported',      // RFC5842
  226: 'IM Used',               // RFC3229
  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  307: 'Temporary Redirect',
  308: 'Permanent Redirect',    // RFC7238
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Payload Too Large',
  414: 'URI Too Long',
  415: 'Unsupported Media Type',
  416: 'Range Not Satisfiable',
  417: 'Expectation Failed',
  418: 'I\'m a teapot',                                               // RFC2324
  421: 'Misdirected Request',                                         // RFC7540
  422: 'Unprocessable Entity',                                        // RFC4918
  423: 'Locked',                                                      // RFC4918
  424: 'Failed Dependency',                                           // RFC4918
  425: 'Too Early',                                                   // RFC-ietf-httpbis-replay-04
  426: 'Upgrade Required',                                            // RFC2817
  428: 'Precondition Required',                                       // RFC6585
  429: 'Too Many Requests',                                           // RFC6585
  431: 'Request Header Fields Too Large',                             // RFC6585
  451: 'Unavailable For Legal Reasons',                               // RFC7725
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP Version Not Supported',
  506: 'Variant Also Negotiates',                                     // RFC2295
  507: 'Insufficient Storage',                                        // RFC4918
  508: 'Loop Detected',                                               // RFC5842
  510: 'Not Extended',                                                // RFC2774
  511: 'Network Authentication Required',                             // RFC6585
}

export class HttpResponseException extends Error {
  constructor (status, message = '') {
    super(message)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpException)
    }

    this.name = 'HttpException'
    this.status = status
  }
}

export function httpErrorHandlerMiddleware (err, req, res, next) {
  // Pass on non-http base error
  // !(err instanceof HttpException && STATUS_TEXTS[err.status])
  // (err && err.status && !STATUS_TEXTS[err.status])
  if (res.headersSent || !(err instanceof HttpException)) {
    return next(err)
  }

  res.json(err.status, {message: err.message || STATUS_TEXTS[err.status]})
}

// Todo how to use promises instead for try catch block
// app.get("/", function (req, res, next) {
//   Promise.resolve().then(function () {
//     throw new Error("BROKEN")
//   }).catch(next) // Errors will be passed to Express.
// })

