import { Catch, Injectable } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { AppLogger } from 'src/logging/app-logger.service';
import { BaseError } from './base-error';

@Injectable()
@Catch(BaseError)
export class InternalGqlExceptionFilter implements GqlExceptionFilter {
  constructor(private logger: AppLogger) {
    this.logger.setContext('InternalGqlExceptionFilter');
  }

  catch(exception: Error) {
    this.logger.log(`handling exception: '${exception.name}', message: ${exception.message}`);
    return exception;
  }
}
