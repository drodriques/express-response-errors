'use strict';

const statusCodes = {
  HTTP_CONTINUE: 100,
  HTTP_SWITCHING_PROTOCOLS: 101,
  HTTP_PROCESSING: 102,
  HTTP_EARLY_HINTS: 103,
  HTTP_OK: 200,
  HTTP_CREATED: 201,
  HTTP_ACCEPTED: 202,
  HTTP_NON_AUTHORITATIVE_INFORMATION: 203,
  HTTP_NO_CONTENT: 204,
  HTTP_RESET_CONTENT: 205,
  HTTP_PARTIAL_CONTENT: 206,
  HTTP_MULTI_STATUS: 207,
  HTTP_ALREADY_REPORTED: 208,
  HTTP_IM_USED: 226,
  HTTP_MULTIPLE_CHOICES: 300,
  HTTP_MOVED_PERMANENTLY: 301,
  HTTP_FOUND: 302,
  HTTP_SEE_OTHER: 303,
  HTTP_NOT_MODIFIED: 304,
  HTTP_USE_PROXY: 305,
  HTTP_RESERVED: 306,
  HTTP_TEMPORARY_REDIRECT: 307,
  HTTP_PERMANENTLY_REDIRECT: 308,
  HTTP_BAD_REQUEST: 400,
  HTTP_UNAUTHORIZED: 401,
  HTTP_PAYMENT_REQUIRED: 402,
  HTTP_FORBIDDEN: 403,
  HTTP_NOT_FOUND: 404,
  HTTP_METHOD_NOT_ALLOWED: 405,
  HTTP_NOT_ACCEPTABLE: 406,
  HTTP_PROXY_AUTHENTICATION_REQUIRED: 407,
  HTTP_REQUEST_TIMEOUT: 408,
  HTTP_CONFLICT: 409,
  HTTP_GONE: 410,
  HTTP_LENGTH_REQUIRED: 411,
  HTTP_PRECONDITION_FAILED: 412,
  HTTP_REQUEST_ENTITY_TOO_LARGE: 413,
  HTTP_REQUEST_URI_TOO_LONG: 414,
  HTTP_UNSUPPORTED_MEDIA_TYPE: 415,
  HTTP_REQUESTED_RANGE_NOT_SATISFIABLE: 416,
  HTTP_EXPECTATION_FAILED: 417,
  HTTP_I_AM_A_TEAPOT: 418,
  HTTP_MISDIRECTED_REQUEST: 421,
  HTTP_UNPROCESSABLE_ENTITY: 422,
  HTTP_LOCKED: 423,
  HTTP_FAILED_DEPENDENCY: 424
}

const statusTexts = {
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

class HttpResponseException extends Error {
  // invalidargumentexception
  constructor (status, message = '') {
    super();
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpResponseException);
    }

    //if (!this.message) {
    this.message = message ? message : statusTexts[status];
    //}

    this.name = HttpResponseException.name;
    this.status = status;
  }
}

function httpErrorHandlerMiddleware (err, req, res, next) {
  // Pass on non-http base error
  if (res.headersSent || !(err instanceof HttpResponseException)) {
    return next(err);
  }

  res.json(err.status, {message: err.message});
}

module.exports = {
  statusCodes,
  statusTexts,
  httpErrorHandlerMiddleware,
  HttpResponseException
};
