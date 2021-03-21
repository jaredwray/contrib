import DataLoader from 'dataloader';

import { InvitationService } from './InvitationService';
import { Invitation } from '../dto/Invitation';

export class InvitationLoader {
  private readonly loaderByInfluencerId = new DataLoader<string, Invitation>(async (influencerIds) => {
    const invitationsByInfluencerId = (
      await this.invitationService.listInvitationsByInfluencerIds(influencerIds)
    ).reduce(
      (byInfluencerId, invitation) => ({
        ...byInfluencerId,
        [invitation.parentEntityId]: invitation,
      }),
      {},
    );

    return influencerIds.map((influencerId) => invitationsByInfluencerId[influencerId] ?? null);
  });

  constructor(private readonly invitationService: InvitationService) {}

  getByInfluencerId(influencerId: string): Promise<Invitation> {
    return this.loaderByInfluencerId.load(influencerId);
  }
}
