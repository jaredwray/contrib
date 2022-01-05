import { Dayjs } from 'dayjs';
import { InvitationParentEntityType } from '../mongodb/InvitationParentEntityType';

export interface Invitation {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  welcomeMessage: string;
  parentEntityType: InvitationParentEntityType;
  parentEntityId: string;
  accepted: boolean;
  createdAt: Dayjs;
  updatedAt: Dayjs;
}
