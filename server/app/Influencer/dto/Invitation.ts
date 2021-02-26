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
  createdAt: string;
  updatedAt: string;
}
