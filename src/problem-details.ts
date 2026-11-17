import type { HttpError } from './http-error'
import type { ErrorRequest, ErrorResponse } from './middleware'
import { STATUS_MESSAGES } from './status-messages'
import type { JsonValue } from './types'

/** RFC 9457 fields plus public application metadata. */
export type ProblemDetails = {
  type: string
  title: string
  status: number
  detail?: string
  instance?: string
  errorCode?: string
  details?: JsonValue
}

/** Use as a middleware serializer so exposure policies are applied first. */
export function problemDetailsSerializer<Request = ErrorRequest>(
  error: HttpError,
  _req: Request,
  res: ErrorResponse
): ProblemDetails {
  res.set('Content-Type', 'application/problem+json')

  return {
    type: 'about:blank',
    title: STATUS_MESSAGES[error.code] ?? 'HTTP Error',
    status: error.code,
    detail: error.message,
    errorCode: error.errorCode,
    details: error.details,
  }
}
