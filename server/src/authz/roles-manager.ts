import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ManagementClient } from 'auth0';
import { EnvironmentVariables } from 'src/environment-variables';
import { UserRoles } from './user-roles';

export interface AuthRole {
  id: string;
  name: string;
  description: string;
}

@Injectable()
export class RolesManager {
  private auth0: any;
  constructor(private configService: ConfigService<EnvironmentVariables>) {
    this.auth0 = new ManagementClient({
      domain: configService.get<string>('AUTH0_MANAGEMENT_DOMAIN'),
      clientId: configService.get<string>('AUTH0_MANAGEMENT_CLIENT_ID'),
      clientSecret: configService.get<string>('AUTH0_MANAGEMENT_CLIENT_SECRET'),
    });
  }

  async listRoles(): Promise<AuthRole[]> {
    const roles: AuthRole[] = <AuthRole[]>await this.auth0.roles.getAll();
    return roles;
  }

  async assignRole(authzId: string, roleName: UserRoles): Promise<any> {
    const roles = await this.listRoles();
    const roleIds: string[] = roles.filter((role) => role.name == roleName).map((role) => role.id);

    return await this.auth0.users.assignRoles({ id: authzId }, { roles: roleIds });
  }
}
