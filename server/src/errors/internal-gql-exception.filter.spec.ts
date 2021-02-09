import { MockAppLogger } from '../../test/mock-app-logger';
import { BaseError } from './base-error';
import { InternalGqlExceptionFilter } from './internal-gql-exception.filter';

describe('InternalGqlExceptionFilter', () => {
  const mockLogger = new MockAppLogger();
  const filter = new InternalGqlExceptionFilter(mockLogger);
  const error = new BaseError('some error', 'some_identifier');

  it('logs catched error', () => {
    expect(filter.catch(error)).toEqual(error);
    const lastMsg = mockLogger.messageContainer[mockLogger.messageContainer.length - 1];
    expect(lastMsg).toEqual({
      level: 'log',
      context: 'InternalGqlExceptionFilter',
      message: `handling exception: 'Error', identifier: 'some_identifier', message: some error`,
    });
  });
});
