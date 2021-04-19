import { TermsInput } from 'src/types/TermsInput';

export interface Assistant {
  id: string;
  influencerId: string;
  notAcceptedTerms: TermsInput | null;
}
