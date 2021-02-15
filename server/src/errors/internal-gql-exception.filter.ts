import { Catch, Injectable } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';

import { AppLogger } from '../logging/app-logger.service';
import { BaseError } from './base-error';

@Injectable()
@Catch(BaseError)
export class InternalGqlExceptionFilter implements GqlExceptionFilter {
  constructor(private logger: AppLogger) {
    this.logger.setContext('InternalGqlExceptionFilter');
  }

  catch(exception: BaseError) {
    this.logger.log(
      `handling exception: '${exception.name}', identifier: '${exception.code}', message: ${exception.message}`,
    );
    return new ApolloError(exception.message, exception.code);
  }
}
