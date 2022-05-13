import { Dayjs } from 'dayjs';
import { InvitationParentEntityType } from '../mongodb/InvitationParentEntityType';

export enum InvitationStatus {
  DONE = 'DONE',
  PENDING = 'PENDING',
  PROPOSED = 'PROPOSED',
  DECLINED = 'DECLINED',
}

export interface Invitation {
  id: string;
  slug: string;
  firstName: string;
  lastName?: string;
  phoneNumber: string;
  welcomeMessage?: string;
  parentEntityType: InvitationParentEntityType;
  parentEntityId?: string;
  status?: string;
  accepted: boolean;
  createdAt: Dayjs;
  updatedAt: Dayjs;
}
