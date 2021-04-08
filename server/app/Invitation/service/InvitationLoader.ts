import DataLoader from 'dataloader';

import { InvitationService } from './InvitationService';
import { Invitation } from '../dto/Invitation';
import { InvitationParentEntityType } from '../mongodb/InvitationParentEntityType';

export class InvitationLoader {
  private readonly loaderByParentEntityId = new DataLoader<string, Invitation>(async (parentEntityIds) => {
    const invitationsByParentEntityId = (
      await this.invitationService.listInvitationsByParentEntityIds(parentEntityIds)
    ).reduce(
      (byParentEntityId, invitation) => ({
        ...byParentEntityId,
        [invitation.parentEntityId]: invitation,
      }),
      {},
    );

    return parentEntityIds.map((parentEntityId) => invitationsByParentEntityId[parentEntityId] ?? null);
  });

  constructor(private readonly invitationService: InvitationService) {}

  getByParentEntityId(parentEntityId: string): Promise<Invitation> {
    return this.loaderByParentEntityId.load(parentEntityId);
  }
}
