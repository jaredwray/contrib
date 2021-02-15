import { BaseError } from './base-error';
import { ErrorCode } from './error-code';

describe('BaseError', () => {
  describe('getIdentifier', () => {
    describe('with provided identifier', () => {
      it('returns provided identifier', () => {
        const err: BaseError = new BaseError('some msg', ErrorCode.INTERNAL_ERROR);
        expect(err.code).toBe(ErrorCode.INTERNAL_ERROR);
      });
    });

    describe('without provided identifier', () => {
      it('returns "base_error"', () => {
        const err: BaseError = new BaseError('some msg');
        expect(err.code).toBe(ErrorCode.BAD_REQUEST);
      });
    });
  });
});
