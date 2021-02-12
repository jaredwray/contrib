import { managementClient } from './Auth0';
import { Role } from 'auth0';
import { UserRoles } from '../dto/UserRoles';

export const listRoles = async (): Promise<Role[]> => {
  return await managementClient.getRoles();
};

export const assignRole = async (authzId: string, roleName: UserRoles): Promise<void> => {
  const roles = await listRoles();
  const roleIds: string[] = roles.filter((role) => role.name == roleName).map((role) => role.id);
  await managementClient.assignRolestoUser({ id: authzId }, { roles: roleIds });
};
