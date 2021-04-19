import { AssistantStatus } from './AssistantStatus';
import { TermsInput } from '../../Terms/dto/TermsInput';

export interface Assistant {
  id: string;
  name: string;
  status: AssistantStatus;
  userAccount: string;
  influencerId: string;
  notAcceptedTerms?: TermsInput;
}
