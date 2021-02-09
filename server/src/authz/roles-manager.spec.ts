// import ManagementClient, { mockRoles, mockUsers } from './__mocks__/management-client';
import { ConfigService } from '@nestjs/config';
import { ManagementClient } from 'auth0';
import { AuthRole, RolesManager } from './roles-manager';
import { UserRoles } from './user-roles';
jest.mock('auth0');

beforeEach(() => {
  ManagementClient.mockClear();
});

describe('RolesManager', () => {
  describe('listRoles', () => {
    const existingAuth0Roles: AuthRole[] = [
      { id: 'fake_id_1', name: 'admin', description: 'admin role' },
      { id: 'fake_id_2', name: 'plain_user', description: 'plain user role' },
    ];

    beforeEach(() => {
      ManagementClient.mockImplementation(() => {
        return {
          roles: {
            getAll: async () => {
              return existingAuth0Roles;
            },
          },
        };
      });
    });

    it('returns list of role objects', async () => {
      const cs = new ConfigService({});
      const manager = new RolesManager(cs);
      const gotRoles = await manager.listRoles();
      expect(gotRoles).toEqual(existingAuth0Roles);
    });
  });

  describe('assignRole', () => {
    const adminRole = { id: 'fake_id_1', name: 'admin', description: 'admin role' };
    const plainUserRole = { id: 'fake_id_2', name: 'plain_user', description: 'plain user role' };
    const multipleRoles: AuthRole[] = [adminRole, plainUserRole];
    const missingRoles: AuthRole[] = [adminRole];
    const authUserId = 'fake_auth0_user_id';

    describe('with known role', () => {
      const calledAssignRoles = [];

      beforeEach(() => {
        ManagementClient.mockImplementation(() => {
          return {
            roles: {
              getAll: async () => {
                return multipleRoles;
              },
            },
            users: {
              assignRoles: async ({ id }, { roles }) => {
                calledAssignRoles.push({ id, roles });
              },
            },
          };
        });
      });

      it('assigns role', async () => {
        const cs = new ConfigService({});
        const manager = new RolesManager(cs);
        await manager.assignRole(authUserId, UserRoles.PLAIN_USER);
        expect(calledAssignRoles).toEqual([{ id: 'fake_auth0_user_id', roles: ['fake_id_2'] }]);
      });
    });

    describe('with unknown role', () => {
      const calledAssignRoles = [];

      beforeEach(() => {
        ManagementClient.mockImplementation(() => {
          return {
            roles: {
              getAll: async () => {
                return missingRoles;
              },
            },
            users: {
              assignRoles: async ({ id }, { roles }) => {
                calledAssignRoles.push({ id, roles });
              },
            },
          };
        });
      });

      it('does not assign role', async () => {
        const cs = new ConfigService({});
        const manager = new RolesManager(cs);
        await manager.assignRole(authUserId, UserRoles.PLAIN_USER);
        expect(calledAssignRoles).toEqual([{ id: 'fake_auth0_user_id', roles: [] }]);
      });
    });
  });
});
