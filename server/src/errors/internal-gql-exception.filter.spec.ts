import { MockAppLogger } from '../../test/mock-app-logger';
import { BaseError } from './base-error';
import { InternalGqlExceptionFilter } from './internal-gql-exception.filter';
import { ErrorCode } from './error-code';

describe('InternalGqlExceptionFilter', () => {
  const mockLogger = new MockAppLogger();
  const filter = new InternalGqlExceptionFilter(mockLogger);
  const error = new BaseError('some error', ErrorCode.PHONE_NUMBER_ALREADY_TAKEN);

  it('logs catched error', () => {
    expect(filter.catch(error)).toEqual(error);
    const lastMsg = mockLogger.messageContainer[mockLogger.messageContainer.length - 1];
    expect(lastMsg).toEqual({
      level: 'log',
      context: 'InternalGqlExceptionFilter',
      message: `handling exception: 'Error', identifier: 'PHONE_NUMBER_ALREADY_TAKEN', message: some error`,
    });
  });
});
