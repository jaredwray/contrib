import { Catch, Injectable } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { AppLogger } from 'src/logging/app-logger.service';

@Injectable()
@Catch()
export class AllGqlExceptionFilter implements GqlExceptionFilter {
  constructor(private logger: AppLogger) {
    this.logger.setContext('AllGqlExceptionFilter');
  }

  catch(exception: Error) {
    this.logger.log(`handling exception: '${exception.name}', message: ${exception.message}`);
    return exception;
  }
}
