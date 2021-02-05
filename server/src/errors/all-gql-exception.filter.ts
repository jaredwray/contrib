import { Catch, Injectable } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';

import { AppLogger } from 'src/logging/app-logger.service';
import { ErrorCode } from './error-code';

@Injectable()
@Catch()
export class AllGqlExceptionFilter implements GqlExceptionFilter {
  constructor(private logger: AppLogger) {
    this.logger.setContext('AllGqlExceptionFilter');
  }

  catch(exception: Error) {
    this.logger.error(`unhandled exception: ${exception.name}: ${exception.message}`, exception.stack);
    return new ApolloError('Something went wrong. Please try again later.', ErrorCode.INTERNAL_ERROR);
  }
}
