export interface Invitation {
  id: string;
  phoneNumber: string;
  firstName: string;
  lastName?: string;
  welcomeMessage?: string;
  status?: InvitationStatus;
  accepted: boolean;
  parentEntityType: string;
  parentEntityId?: string;
  createdAt: string;
  updatedAt: string;
}

export enum InvitationStatus {
  DONE = 'DONE',
  PENDING = 'PENDING',
  PROPOSED = 'PROPOSED',
  DECLINED = 'DECLINED',
}
