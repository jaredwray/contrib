import { Dayjs } from 'dayjs';

import { InvitationParentEntityType } from '../mongodb/InvitationParentEntityType';
import { UserAccount } from '../../UserAccount/dto/UserAccount';
import { InfluencerProfile } from '../../Influencer/dto/InfluencerProfile';

export enum NotificationStatus {
  DONE = 'DONE',
  PENDING = 'PENDING',
  PAUSED = 'PAUSED',
}

export interface Notification {
  id: string;
  createdBy: UserAccount;
  recipients: InfluencerProfile[];
  status: string;
  message: string;
  sendAt: Dayjs;
  createdAt: Dayjs;
  updatedAt: Dayjs;
}
