import { ErrorCode } from './error-code';

export class BaseError extends Error {
  constructor(message: string, public readonly code: ErrorCode = ErrorCode.BAD_REQUEST) {
    super(message);
    Object.setPrototypeOf(this, BaseError.prototype);
  }
}
