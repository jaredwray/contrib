import { Events } from '../../Events';
import { UserAccount } from '../dto/UserAccount';
import { AppLogger } from '../../../logger';
import { Auth0Service, UserRole } from '../../../authz';
import { EventHub } from '../../EventHub';

export class UserAccountRolesManagementService {
  constructor(private readonly auth0Service: Auth0Service, private readonly eventHub: EventHub) {
    this.eventHub.subscribe(Events.USER_ACCOUNT_CREATED, (userAccount) => {
      this.assignPlainUserRole(userAccount).catch((error) =>
        AppLogger.error(`error assigning plain user role: ${error.name}: ${error.message}`, {
          stack: error.stack,
          userAccount,
        }),
      );
    });

    this.eventHub.subscribe(Events.INFLUENCER_ONBOARDED, ({ influencerProfile, userAccount }) => {
      this.assignInfluencerRole(userAccount).catch((error) =>
        AppLogger.error(`error assigning influencer user role: ${error.name}: ${error.message}`, {
          stack: error.stack,
          userAccount,
          influencerProfile,
        }),
      );
    });
  }

  private async assignPlainUserRole(userAccount: UserAccount) {
    await this.auth0Service.assignUserRole(userAccount.id, UserRole.PLAIN_USER);
  }

  private async assignInfluencerRole(userAccount: UserAccount) {
    await this.auth0Service.assignUserRole(userAccount.id, UserRole.INFLUENCER);
  }
}
