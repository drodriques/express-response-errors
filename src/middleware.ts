import { HttpError } from './http-error'
import type { ErrorInput, JsonValue } from './types'

export interface ErrorRequest {
  method?: string
  url?: string
}

/** Structural types allow Express 4 and 5 without a runtime Express dependency. */
export interface ErrorResponse {
  headersSent: boolean
  status(code: number): ErrorResponse
  json(body: JsonValue): void
  set(name: string, value: string): void
}

export type ErrorNext = (error?: ErrorInput) => void
export type ResponseErrorHandler<Request = ErrorRequest> = (
  error: ErrorInput,
  req: Request,
  res: ErrorResponse,
  next: ErrorNext
) => void

export interface ResponseErrorHandlerOptions<Request = ErrorRequest> {
  /** Map non-HttpError inputs before exposure and serialization; undefined delegates. */
  normalizeError?: (error: ErrorInput, req: Request) => HttpError | undefined
  /** Forward unknown errors by default; opt in to generic 500 responses. */
  handleUnknownErrors?: boolean
  /** Defaults to true. An explicit false on the error always hides its details. */
  expose?: boolean | ((error: HttpError, req: Request) => boolean)
  /** Receives the original error for handled failures. Must be synchronous. */
  onError?: (error: ErrorInput, req: Request, res: ErrorResponse) => void
  /** Receives an error with private fields removed when exposure is disabled. */
  serialize?: (error: HttpError, req: Request, res: ErrorResponse) => JsonValue
}

export function createResponseErrorHandler<Request = ErrorRequest>(
  options: ResponseErrorHandlerOptions<Request> = {}
): ResponseErrorHandler<Request> {
  // Snapshot configuration so later mutations do not change installed behavior.
  const { normalizeError, handleUnknownErrors = false, expose = true, onError, serialize } = options

  return function responseErrorHandler(err, req, res, next): void {
    if (res.headersSent) {
      next(err)
      return
    }

    try {
      const normalized = err instanceof HttpError ? err : normalizeError?.(err, req)

      if (normalized !== undefined && !(normalized instanceof HttpError)) {
        throw new TypeError('normalizeError must return an HttpError or undefined.')
      }

      if (!normalized && !handleUnknownErrors) {
        next(err)
        return
      }

      onError?.(err, req, res)

      // A callback may have sent a response itself.
      if (res.headersSent) {
        next(err)
        return
      }

      const error = normalized ?? new HttpError(500, '', { cause: err, expose: false })
      const mayExpose =
        error.expose !== false && (typeof expose === 'function' ? expose(error, req) : expose)
      const publicError = mayExpose ? error : new HttpError(error.code)

      for (const [name, value] of Object.entries(error.headers ?? {})) {
        res.set(name, value)
      }

      const body = serialize ? serialize(publicError, req, res) : { message: publicError.message }

      res.status(error.code).json(body)
    } catch (error) {
      next(
        error instanceof Error
          ? error
          : new Error('Error handler callback failed', { cause: error })
      )
    }
  }
}

export const responseErrorHandler: ResponseErrorHandler = createResponseErrorHandler()
