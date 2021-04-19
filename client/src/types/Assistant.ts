import { TermsInput } from './TermsInput';

export interface Assistant {
  id: string;
  name: string;
  status: string;
  influencerId: string;
  notAcceptedTerms: TermsInput | null;
}
