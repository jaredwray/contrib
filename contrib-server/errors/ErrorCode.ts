export enum ErrorCode {
  /**
   * Generic error code for unhandled errors.
   */
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  /**
   * Generic error code used when error indicates wrong input and no special action is needed on frontend.
   */
  BAD_REQUEST = 'BAD_REQUEST',
  /**
   * User has entered phone number, but it already exists.
   */
  PHONE_NUMBER_ALREADY_TAKEN = 'PHONE_NUMBER_ALREADY_TAKEN',
  /**
   * User is either not signed in, or access token is invalid/expired, or he lacks permissions to perform given action.
   */
  UNAUTHORIZED = 'UNAUTHORIZED'
}
