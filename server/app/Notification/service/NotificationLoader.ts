import DataLoader from 'dataloader';

import { InvitationService } from './InvitationService';
import { Notification } from '../dto/Notification';

export class NotificationLoader {
  private readonly loaderById = new DataLoader<string, Notification>(async (ids) => {
    const notifications = (await this.notificationService.listInvitationsByParentEntityIds(ids)).reduce(
      (id, notification) => ({
        ...id,
        [notification.parentEntityId]: notification,
      }),
      {},
    );

    return ids.map((id) => notifications[id] ?? null);
  });

  constructor(private readonly invitationService: InvitationService) {}

  get = (id: string): Promise<Notification> => this.loaderById.load(id);
}
