import { ExecutionContext } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { GqlArgumentsHost, GqlExecutionContext, Resolver } from '@nestjs/graphql';
import { AuthUser } from './auth-user';
import { RolesGuard } from './roles.guard';

class ReturnObjClass {}
@Resolver(() => ReturnObjClass)
class SampleGraphqlResolver {
  someQuery(): ReturnObjClass {
    return new ReturnObjClass();
  }
}

describe('RolesGuard', () => {
  const resolver = new SampleGraphqlResolver();
  const guard = new RolesGuard();
  const user = {
    iss: 'some str',
    sub: 'some str',
    aud: 'some str',
    iat: 123,
    exp: 123,
    azp: 'some str',
    permissions: ['SampleGraphqlResolver:someQuery'],
  };

  test('with requested permissions', async () => {
    const ctx: ExecutionContext = new ExecutionContextHost(
      ['root', ['arg1', 'arg2'], { req: { user } }],
      SampleGraphqlResolver,
      resolver.someQuery,
    );
    await guard.canActivate(ctx);
  });

  test('without requested permissions', async () => {
    user.permissions = ['SomeOtherResolver:someOtherQuery'];
    const ctx: ExecutionContext = new ExecutionContextHost(
      ['root', ['arg1', 'arg2'], { req: { user } }],
      SampleGraphqlResolver,
      resolver.someQuery,
    );
    expect(await guard.canActivate(ctx)).toBe(false);
  });
});
