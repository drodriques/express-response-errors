/** Values suitable for JSON response bodies and public error details. */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | readonly JsonValue[]
  | { readonly [key: string]: JsonValue | undefined }

/** Errors and JSON values commonly passed to Express error middleware. */
export type ErrorInput = Error | JsonValue | undefined

/** One public field-level validation failure; validation remains application-owned. */
export type ValidationIssue = {
  field: string
  message: string
  code?: string
}
