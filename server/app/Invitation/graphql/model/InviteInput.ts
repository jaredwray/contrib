export interface InviteInput {
  phoneNumber: string;
  firstName: string;
  lastName: string;
  welcomeMessage: string;
  influencerId?: string;
  accepted?: boolean;
  parentEntityType: string;
}
