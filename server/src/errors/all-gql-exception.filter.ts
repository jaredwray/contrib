import { Catch, Injectable } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { AppLogger } from 'src/logging/app-logger.service';
import { BaseError } from './base-error';

@Injectable()
@Catch()
export class AllGqlExceptionFilter implements GqlExceptionFilter {
  constructor(private logger: AppLogger) {
    this.logger.setContext('AllGqlExceptionFilter');
  }

  catch(exception: Error) {
    this.logger.error(`handling uncought exception: '${exception.name}', message: ${exception.message}`);
    return new BaseError('something went wrong', 'internal_server_error');
  }
}
