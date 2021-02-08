import { BaseError } from './base-error';

describe('BaseError', () => {
  describe('getIdentifier', () => {
    describe('with provided identifier', () => {
      it('returns provided identifier', () => {
        const err: BaseError = new BaseError('some msg', 'provided_identifier');
        expect(err.getIdentifier()).toBe('provided_identifier');
      });
    });

    describe('without provided identifier', () => {
      it('returns "base_error"', () => {
        const err: BaseError = new BaseError('some msg');
        expect(err.getIdentifier()).toBe('base_error');
      });
    });
  });
});
