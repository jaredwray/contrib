import { MockAppLogger } from '../../test/mock-app-logger';
import { AllGqlExceptionFilter } from './all-gql-exception.filter';
import { BaseError } from './base-error';
import { ErrorCode } from './error-code';

describe('AllGqlExceptionFilter', () => {
  const mockLogger = new MockAppLogger();
  const filter = new AllGqlExceptionFilter(mockLogger);
  const error = new Error('unknown error');
  const expectedReturnError = new BaseError('Something went wrong. Please try again later.', ErrorCode.INTERNAL_ERROR);

  it('logs catched error', () => {
    expect(filter.catch(error)).toEqual(expectedReturnError);
    const lastMsg = mockLogger.messageContainer[mockLogger.messageContainer.length - 1];
    expect(lastMsg).toEqual({
      level: 'error',
      context: 'AllGqlExceptionFilter',
      message: `unhandled exception: Error: unknown error`,
    });
  });
});
